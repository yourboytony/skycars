class FlightPlanner {
    constructor() {
        this.map = null;
        this.markers = {};
        this.routeLine = null;
        this.airports = new Map();
        this.navaids = new Map();
        this.navaidLayers = null;
        this.init();
    }

    async init() {
        this.initMap();  // Initialize map first
        await Promise.all([
            this.loadAirports(),
            this.loadNavaids()
        ]);
        this.setupEventListeners();
    }

    initMap() {
        this.map = L.map('map', {
            center: [20, 0],
            zoom: 3,
            zoomControl: true,
            minZoom: 2,
            maxZoom: 12
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19
        }).addTo(this.map);

        // Create layer groups
        this.navaidLayers = L.layerGroup().addTo(this.map);
        this.routeLayers = L.layerGroup().addTo(this.map);
    }

    async loadNavaids() {
        try {
            const response = await fetch('navaid.csv');
            const csvText = await response.text();
            
            const rows = csvText.split('\n').slice(1);
            rows.forEach(row => {
                if (!row.trim()) return; // Skip empty rows
                
                const values = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
                if (!values) return;

                const [
                    id, filename, ident, name, type, frequency_khz, 
                    latitude_deg, longitude_deg, elevation_ft, iso_country,
                    dme_frequency_khz, dme_channel, dme_latitude_deg, 
                    dme_longitude_deg, dme_elevation_ft, slaved_variation_deg,
                    magnetic_variation_deg, usageType, power, associated_airport
                ] = values.map(val => val.replace(/"/g, '').trim());

                // Only store navaids we're interested in
                if (['VOR', 'DME', 'NDB', 'VORDME', 'VOR-DME'].includes(type)) {
                    const navaid = {
                        id,
                        ident,
                        name,
                        type,
                        frequency: (parseInt(frequency_khz) / 1000).toFixed(3),
                        lat: parseFloat(latitude_deg),
                        lon: parseFloat(longitude_deg),
                        elevation: parseInt(elevation_ft),
                        country: iso_country,
                        dme_channel: dme_channel || null,
                        magnetic_variation: magnetic_variation_deg,
                        airport: associated_airport,
                        usage: usageType
                    };

                    this.navaids.set(ident, navaid);
                    this.addNavaidMarker(navaid);
                }
            });
            console.log(`Loaded ${this.navaids.size} navaids`);
        } catch (error) {
            console.error('Error loading navaids:', error);
        }
    }

    addNavaidMarker(navaid) {
        if (!this.map || !navaid.lat || !navaid.lon) return;

        const marker = L.marker([navaid.lat, navaid.lon], {
            icon: this.createNavaidIcon(navaid.type)
        })
        .bindPopup(this.createNavaidPopup(navaid));

        marker.addTo(this.navaidLayers);
    }

    createNavaidIcon(type) {
        const icons = {
            'VOR': { icon: 'compass', color: '#FFC107' },
            'DME': { icon: 'signal', color: '#FF9800' },
            'NDB': { icon: 'dot-circle', color: '#FF5722' },
            'VORDME': { icon: 'broadcast-tower', color: '#FFC107' },
            'VOR-DME': { icon: 'broadcast-tower', color: '#FFC107' }
        };

        const navaidType = icons[type] || { icon: 'circle', color: '#ffffff' };
        
        return L.divIcon({
            html: `
                <div class="navaid-icon" style="border-color: ${navaidType.color}; color: ${navaidType.color}">
                    <i class="fas fa-${navaidType.icon}"></i>
                </div>
            `,
            className: '',
            iconSize: [16, 16],
            iconAnchor: [8, 8]
        });
    }

    updateMap(type, airport) {
        if (this.markers[type]) {
            this.markers[type].remove();
        }

        this.markers[type] = L.marker([airport.lat, airport.lon], {
            icon: this.createAirportIcon(type)
        })
        .bindPopup(`${airport.name} (${type.toUpperCase()})`)
        .addTo(this.routeLayers);

        if (this.markers['origin'] && this.markers['destination']) {
            this.drawRoute();
        }

        this.updateFlightInfo();
    }

    createAirportIcon(type) {
        return L.divIcon({
            html: `
                <div class="airport-icon ${type}">
                    <i class="fas fa-plane-${type === 'origin' ? 'departure' : 'arrival'}"></i>
                </div>
            `,
            className: '',
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        });
    }

    async loadAirports() {
        try {
            const response = await fetch('airports.csv');
            const csvText = await response.text();
            
            // Skip header row and parse CSV
            const rows = csvText.split('\n').slice(1);
            rows.forEach(row => {
                // Parse CSV while handling quoted values correctly
                const values = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
                if (!values) return;

                const [
                    id, ident, type, name, lat, lon, elevation, 
                    continent, country, region, municipality, 
                    scheduled_service, gps_code, iata_code
                ] = values.map(val => val.replace(/"/g, '').trim());

                // Only add airports (not heliports etc) with ICAO codes
                if (type === 'large_airport' || type === 'medium_airport') {
                    this.airports.set(ident, {
                        icao: ident,
                        iata: iata_code,
                        name: name,
                        city: municipality,
                        country: country,
                        lat: parseFloat(lat),
                        lon: parseFloat(lon),
                        elevation: parseInt(elevation),
                        type: type
                    });
                }
            });
            console.log(`Loaded ${this.airports.size} airports`);
        } catch (error) {
            console.error('Error loading airports:', error);
        }
    }

    setupEventListeners() {
        ['origin', 'destination'].forEach(type => {
            const input = document.getElementById(type);
            
            // Add input event for real-time search
            input.addEventListener('input', (e) => {
                const value = e.target.value.toUpperCase();
                
                // Clear existing dropdown
                let dropdown = document.getElementById(`${type}-dropdown`);
                if (dropdown) {
                    dropdown.remove();
                }

                // If we have at least 2 characters, show suggestions
                if (value.length >= 2) {
                    const matches = this.searchAirports(value);
                    if (matches.length > 0) {
                        this.showAirportDropdown(type, matches);
                    }
                }

                // If we have exactly 4 characters, try to load the airport
                if (value.length === 4) {
                    this.updateAirportInfo(type, value);
                }
            });

            // Handle focus to show recent/nearby airports
            input.addEventListener('focus', () => {
                if (!input.value) {
                    const nearby = this.getNearbyAirports();
                    this.showAirportDropdown(type, nearby);
                }
            });
        });

        // Generate button handler
        document.getElementById('generateBtn').addEventListener('click', () => {
            this.generateSimBriefLink();
        });

        // Form input handlers for updating flight info
        document.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', () => this.updateFlightInfo());
        });
    }

    async updateAirportInfo(type, icao) {
        const infoDiv = document.getElementById(`${type}-info`);
        const airport = this.airports.get(icao.toUpperCase());
        
        if (airport) {
            infoDiv.innerHTML = `
                <div class="airport-detail">
                    <span class="name">${airport.name}</span>
                    <span class="location">${airport.city || 'N/A'}, ${airport.country}</span>
                    <span class="coords">${airport.lat.toFixed(4)}°, ${airport.lon.toFixed(4)}°</span>
                    <span class="elevation">${airport.elevation}ft</span>
                    ${airport.iata ? `<span class="iata">IATA: ${airport.iata}</span>` : ''}
                </div>
            `;
            this.updateMap(type, airport);
        } else {
            infoDiv.textContent = 'Airport not found';
        }
    }

    createNavaidPopup(navaid) {
        return `
            <div class="navaid-popup">
                <h3>${navaid.ident} - ${navaid.type}</h3>
                <div class="navaid-details">
                    <p>${navaid.name}</p>
                    <p>Frequency: ${navaid.frequency} MHz</p>
                    ${navaid.dme_channel ? `<p>DME Channel: ${navaid.dme_channel}</p>` : ''}
                    <p>Elevation: ${navaid.elevation}ft</p>
                    ${navaid.airport ? `<p>Airport: ${navaid.airport}</p>` : ''}
                </div>
            </div>
        `;
    }

    toggleNavaidVisibility(show = true) {
        if (show && this.navaidLayers) {
            this.navaidLayers.addTo(this.map);
        } else if (this.navaidLayers) {
            this.navaidLayers.remove();
        }
    }

    updateFlightInfo() {
        const flightInfo = document.getElementById('flightInfo');
        const callsign = document.getElementById('callsign').value;
        const aircraft = document.getElementById('aircraft').value;
        const fl = document.getElementById('fl').value;

        if (this.markers['origin'] && this.markers['destination']) {
            const distance = this.calculateDistance(
                this.markers['origin'].getLatLng(),
                this.markers['destination'].getLatLng()
            );

            flightInfo.innerHTML = `
                <div class="flight-detail">
                    <strong>${callsign || 'N/A'}</strong> (${aircraft || 'N/A'})
                </div>
                <div class="flight-detail">
                    FL${fl || '---'}
                </div>
                <div class="flight-detail">
                    Distance: ${Math.round(distance)} nm
                </div>
            `;
        }
    }

    calculateDistance(latlng1, latlng2) {
        const R = 3440.065; // Earth's radius in nautical miles
        const lat1 = this.toRad(latlng1.lat);
        const lat2 = this.toRad(latlng2.lat);
        const dLat = this.toRad(latlng2.lat - latlng1.lat);
        const dLon = this.toRad(latlng2.lng - latlng1.lng);

        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1) * Math.cos(lat2) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    toRad(degrees) {
        return degrees * (Math.PI / 180);
    }

    generateSimBriefLink() {
        const data = {
            callsign: document.getElementById('callsign').value,
            type: document.getElementById('aircraft').value,
            orig: document.getElementById('origin').value,
            dest: document.getElementById('destination').value,
            route: document.getElementById('route').value,
            fl: document.getElementById('fl').value,
            pax: document.getElementById('pax').value,
            cargo: document.getElementById('cargo').value
        };

        // Construct SimBrief URL with parameters
        const url = `https://www.simbrief.com/system/dispatch.php?` + 
            `airline=${data.callsign.slice(0,3)}&` +
            `fltnum=${data.callsign.slice(3)}&` +
            `type=${data.type}&` +
            `orig=${data.orig}&` +
            `dest=${data.dest}&` +
            `route=${encodeURIComponent(data.route)}&` +
            `fl=${data.fl}&` +
            `pax=${data.pax}&` +
            `cargo=${data.cargo}`;

        // Open SimBrief in new tab
        window.open(url, '_blank');
    }

    searchAirports(query) {
        const matches = [];
        query = query.toUpperCase();
        
        this.airports.forEach(airport => {
            if (matches.length >= 5) return; // Limit to 5 results

            // Match by ICAO, IATA, name, or city
            if (airport.icao.includes(query) || 
                (airport.iata && airport.iata.includes(query)) ||
                airport.name.toUpperCase().includes(query) ||
                (airport.city && airport.city.toUpperCase().includes(query))) {
                matches.push(airport);
            }
        });

        return matches;
    }

    showAirportDropdown(type, airports) {
        let dropdown = document.createElement('div');
        dropdown.id = `${type}-dropdown`;
        dropdown.className = 'airport-dropdown';

        airports.forEach(airport => {
            const item = document.createElement('div');
            item.className = 'airport-option';
            item.innerHTML = `
                <div class="airport-option-main">
                    <span class="airport-code">${airport.icao}</span>
                    <span class="airport-name">${airport.name}</span>
                </div>
                <div class="airport-option-sub">
                    ${airport.city ? `${airport.city}, ` : ''}${airport.country}
                    ${airport.iata ? ` (${airport.iata})` : ''}
                </div>
            `;

            item.addEventListener('click', () => {
                document.getElementById(type).value = airport.icao;
                this.updateAirportInfo(type, airport.icao);
                dropdown.remove();
            });

            dropdown.appendChild(item);
        });

        const input = document.getElementById(type);
        input.parentNode.appendChild(dropdown);
    }

    getNearbyAirports() {
        // Return major airports first
        return Array.from(this.airports.values())
            .filter(airport => airport.type === 'large_airport')
            .slice(0, 5);
    }

    drawRoute() {
        if (this.routeLine) {
            this.routeLine.remove();
        }

        const origin = this.markers['origin'].getLatLng();
        const destination = this.markers['destination'].getLatLng();

        // Find navaids along route
        const routeWaypoints = this.findRouteWaypoints(origin, destination);
        
        // Create route coordinates including waypoints
        const routeCoords = [
            origin,
            ...routeWaypoints.map(wp => L.latLng(wp.lat, wp.lon)),
            destination
        ];

        // Draw the route line
        this.routeLine = L.polyline(routeCoords, {
            color: '#4169E1',
            weight: 2,
            opacity: 0.8
        }).addTo(this.routeLayers);

        // Add waypoint markers
        routeWaypoints.forEach(waypoint => {
            L.marker([waypoint.lat, waypoint.lon], {
                icon: this.createNavaidIcon(waypoint.type)
            })
            .bindPopup(this.createNavaidPopup(waypoint))
            .addTo(this.routeLayers);
        });

        this.map.fitBounds(this.routeLine.getBounds(), { padding: [50, 50] });
    }

    findRouteWaypoints(origin, destination) {
        const waypoints = [];
        const corridorWidth = 1; // degrees
        const minDistance = 50; // nautical miles

        // Calculate route bearing
        const bearing = this.calculateBearing(
            origin.lat, origin.lng,
            destination.lat, destination.lng
        );

        this.navaids.forEach(navaid => {
            // Only consider VOR and VOR-DME for main waypoints
            if (!['VOR', 'VOR-DME', 'VORDME'].includes(navaid.type)) return;

            // Check if navaid is within corridor
            const isInCorridor = this.isPointInCorridor(
                navaid.lat, navaid.lon,
                origin.lat, origin.lng,
                destination.lat, destination.lng,
                corridorWidth
            );

            if (isInCorridor) {
                // Calculate distance from route start
                const distanceFromStart = this.calculateDistance(
                    origin.lat, origin.lng,
                    navaid.lat, navaid.lon
                );

                // Calculate total route distance
                const totalDistance = this.calculateDistance(
                    origin.lat, origin.lng,
                    destination.lat, destination.lng
                );

                // Only add if waypoint is at least minDistance from previous waypoint
                if (distanceFromStart > minDistance && 
                    distanceFromStart < (totalDistance - minDistance)) {
                    waypoints.push({
                        ...navaid,
                        distanceFromStart
                    });
                }
            }
        });

        // Sort waypoints by distance from start
        return waypoints.sort((a, b) => a.distanceFromStart - b.distanceFromStart);
    }

    isPointInCorridor(pointLat, pointLon, startLat, startLon, endLat, endLon, width) {
        // Convert coordinates to radians
        const [pLat, pLon, sLat, sLon, eLat, eLon] = 
            [pointLat, pointLon, startLat, startLon, endLat, endLon]
            .map(deg => deg * Math.PI / 180);

        // Calculate cross track distance
        const R = 3440.065; // Earth's radius in nautical miles
        const d13 = this.calculateDistance(startLat, startLon, pointLat, pointLon) / R;
        const θ13 = this.calculateBearing(startLat, startLon, pointLat, pointLon) * Math.PI / 180;
        const θ12 = this.calculateBearing(startLat, startLon, endLat, endLon) * Math.PI / 180;

        const crossTrack = Math.asin(
            Math.sin(d13) * Math.sin(θ13 - θ12)
        ) * R;

        return Math.abs(crossTrack) <= width;
    }

    calculateBearing(lat1, lon1, lat2, lon2) {
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const y = Math.sin(Δλ) * Math.cos(φ2);
        const x = Math.cos(φ1) * Math.sin(φ2) -
                 Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

        return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
    }

    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 3440.065; // Earth's radius in nautical miles
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                 Math.cos(φ1) * Math.cos(φ2) *
                 Math.sin(Δλ/2) * Math.sin(Δλ/2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return R * c;
    }
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
    window.flightPlanner = new FlightPlanner();
}); 