class VatsimTracker {
    constructor() {
        this.map = null;
        this.markers = new Map();
        this.selectedFlight = null;
        this.searchInput = document.getElementById('search');
        this.init();
    }

    async init() {
        this.map = L.map('map', {
            center: [20, 0],
            zoom: 3,
            zoomControl: true,
            minZoom: 2,
            maxZoom: 12,
            worldCopyJump: true
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19
        }).addTo(this.map);

        this.map.zoomControl.setPosition('topright');

        if (this.searchInput) {
            this.searchInput.addEventListener('input', () => this.filterFlights());
        }

        // Setup view toggle buttons
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.addEventListener('click', () => this.toggleView(btn.dataset.view));
        });

        await this.fetchVatsimData();
        setInterval(() => this.fetchVatsimData(), 15000);
    }

    createAircraftIcon(pilot, isSelected = false) {
        const className = `aircraft-icon ${isSelected ? 'selected' : ''}`;
        return L.divIcon({
            html: `<div class="${className}" style="transform: rotate(${pilot.heading}deg);">✈</div>`,
            className: 'aircraft-marker',
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        });
    }

    async fetchVatsimData() {
        try {
            const response = await fetch('https://data.vatsim.net/v3/vatsim-data.json');
            const data = await response.json();
            
            this.updateStats(data);
            this.updateAircraft(data.pilots);
            this.updateFlightList(data.pilots);
        } catch (error) {
            console.error('Error fetching VATSIM data:', error);
        }
    }

    updateStats(data) {
        const pilotsCount = document.getElementById('pilots-count');
        const controllersCount = document.getElementById('controllers-count');

        if (pilotsCount) pilotsCount.textContent = data.pilots.length;
        if (controllersCount) controllersCount.textContent = data.controllers.length;
    }

    updateAircraft(pilots) {
        this.markers.forEach(marker => marker.remove());
        this.markers.clear();

        pilots.forEach(pilot => {
            const marker = L.marker([pilot.latitude, pilot.longitude], {
                icon: this.createAircraftIcon(pilot, pilot.callsign === this.selectedFlight),
                riseOnHover: true
            }).addTo(this.map);

            const popupContent = `
                <div class="flight-popup">
                    <h3>${pilot.callsign}</h3>
                    <div class="flight-info">
                        <p><i class="fas fa-plane-departure"></i> ${pilot.flight_plan?.departure || 'N/A'}</p>
                        <p><i class="fas fa-plane-arrival"></i> ${pilot.flight_plan?.arrival || 'N/A'}</p>
                        <p><i class="fas fa-info-circle"></i> ${pilot.flight_plan?.aircraft || 'N/A'}</p>
                        <p><i class="fas fa-arrow-up"></i> ${Math.round(pilot.altitude)}ft</p>
                        <p><i class="fas fa-tachometer-alt"></i> ${Math.round(pilot.groundspeed)}kts</p>
                        <p><i class="fas fa-compass"></i> ${Math.round(pilot.heading)}°</p>
                    </div>
                </div>
            `;

            marker.bindPopup(popupContent);
            marker.on('click', () => this.selectFlight(pilot.callsign));
            this.markers.set(pilot.callsign, marker);
        });
    }

    updateFlightList(pilots) {
        const searchTerm = this.searchInput?.value.toLowerCase() || '';
        const filteredPilots = pilots.filter(pilot => 
            pilot.callsign.toLowerCase().includes(searchTerm) ||
            pilot.flight_plan?.departure?.toLowerCase().includes(searchTerm) ||
            pilot.flight_plan?.arrival?.toLowerCase().includes(searchTerm)
        );

        const flightList = document.getElementById('flight-list');
        if (!flightList) return;

        flightList.innerHTML = filteredPilots
            .sort((a, b) => a.callsign.localeCompare(b.callsign))
            .map(pilot => `
                <div class="flight-item ${pilot.callsign === this.selectedFlight ? 'selected' : ''}"
                     onclick="tracker.selectFlight('${pilot.callsign}')">
                    <div class="flight-callsign">${pilot.callsign}</div>
                    <div class="flight-route">
                        ${pilot.flight_plan?.departure || '???'} → ${pilot.flight_plan?.arrival || '???'}
                    </div>
                    <div class="flight-altitude">${Math.round(pilot.altitude)}ft</div>
                </div>
            `).join('');
    }

    selectFlight(callsign) {
        this.selectedFlight = callsign;
        const marker = this.markers.get(callsign);
        
        if (marker) {
            this.map.setView(marker.getLatLng(), 7);
            marker.openPopup();
            
            // Update all markers to reflect selection
            this.markers.forEach((m, c) => {
                const pilot = { 
                    callsign: c,
                    heading: m.getLatLng().heading || 0
                };
                m.setIcon(this.createAircraftIcon(pilot, c === callsign));
            });
        }

        this.updateFlightList(Array.from(this.markers.values()).map(m => ({
            callsign: m.callsign,
            flight_plan: m.flight_plan,
            altitude: m.altitude
        })));
    }

    filterFlights() {
        if (!this.searchInput) return;
        const searchTerm = this.searchInput.value.toLowerCase();
        
        this.markers.forEach((marker, callsign) => {
            if (callsign.toLowerCase().includes(searchTerm)) {
                marker.setOpacity(1);
            } else {
                marker.setOpacity(0.3);
            }
        });
    }

    toggleView(view) {
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });
        // Implement different view logic here
    }
}

// Initialize tracker
document.addEventListener('DOMContentLoaded', () => {
    new VatsimTracker();
});