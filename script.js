class BackgroundSlider {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.currentSlide = 0;
        this.init();
    }

    init() {
        // Show first slide
        if (this.slides.length > 0) {
            this.slides[0].classList.add('active');
        }

        // Start slideshow
        setInterval(() => this.nextSlide(), 5000); // Change slide every 5 seconds
    }

    nextSlide() {
        // Remove active class from current slide
        this.slides[this.currentSlide].classList.remove('active');
        
        // Move to next slide
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        
        // Add active class to new slide
        this.slides[this.currentSlide].classList.add('active');
    }
}

class VatsimPreview {
    constructor() {
        this.map = null;
        this.markers = new Map();
        this.currentImages = new Map();
        this.init();
    }

    async init() {
        const previewMap = document.getElementById('preview-map');
        if (!previewMap) return;

        this.map = L.map('preview-map', {
            center: [20, 0],
            zoom: 3,
            zoomControl: true,
            dragging: true,
            scrollWheelZoom: true,
            doubleClickZoom: true,
            touchZoom: true,
            boxZoom: true,
            keyboard: true,
            minZoom: 2,
            maxZoom: 10,
            worldCopyJump: true
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(this.map);

        this.map.zoomControl.setPosition('topright');

        await this.fetchVatsimData();
        setInterval(() => this.fetchVatsimData(), 15000);
    }

    createAircraftIcon(heading) {
        return L.divIcon({
            html: `<div class="aircraft-icon" style="transform: rotate(${heading}deg);">✈</div>`,
            className: 'aircraft-marker',
            iconSize: [16, 16],
            iconAnchor: [8, 8]
        });
    }

    async fetchVatsimData() {
        try {
            const response = await fetch('https://data.vatsim.net/v3/vatsim-data.json');
            const data = await response.json();
            
            this.updateStats(data);
            this.updateAircraft(data.pilots);
        } catch (error) {
            console.error('Error fetching VATSIM data:', error);
        }
    }

    async updateAircraft(pilots) {
        this.markers.forEach(marker => marker.remove());
        this.markers.clear();

        for (const pilot of pilots) {
            const marker = L.marker([pilot.latitude, pilot.longitude], {
                icon: this.createAircraftIcon(pilot.heading),
                riseOnHover: true
            }).addTo(this.map);

            // Fetch aircraft images if we have an aircraft type
            if (pilot.flight_plan?.aircraft) {
                const aircraftType = pilot.flight_plan.aircraft.split('/')[0];
                if (!this.currentImages.has(aircraftType)) {
                    try {
                        const [jetPhotosUrl, planespottersUrl] = await Promise.all([
                            this.getJetPhotosUrl(aircraftType),
                            this.getPlanespottersUrl(aircraftType)
                        ]);
                        this.currentImages.set(aircraftType, {
                            jetPhotos: jetPhotosUrl,
                            planespotters: planespottersUrl
                        });
                    } catch (error) {
                        console.error('Error fetching aircraft images:', error);
                    }
                }
            }

            this.markers.set(pilot.callsign, marker);
        }
    }

    async getJetPhotosUrl(aircraftType) {
        try {
            const response = await fetch(`https://www.jetphotos.com/photo/keyword/${aircraftType}`);
            if (!response.ok) return null;
            const html = await response.text();
            // Parse the HTML to find the first image URL
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const imgElement = doc.querySelector('.result__photoLink img');
            return imgElement ? imgElement.src : null;
        } catch (error) {
            console.error('Error fetching JetPhotos:', error);
            return null;
        }
    }

    async getPlanespottersUrl(aircraftType) {
        try {
            const response = await fetch(`https://www.planespotters.net/photo/search?q=${aircraftType}`);
            if (!response.ok) return null;
            const html = await response.text();
            // Parse the HTML to find the first image URL
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const imgElement = doc.querySelector('.photo-card img');
            return imgElement ? imgElement.src : null;
        } catch (error) {
            console.error('Error fetching Planespotters:', error);
            return null;
        }
    }

    updateStats(data) {
        const pilotsCount = document.getElementById('preview-pilots');
        const controllersCount = document.getElementById('preview-controllers');
        const aircraftImages = document.getElementById('aircraft-images');

        if (pilotsCount) pilotsCount.textContent = data.pilots.length;
        if (controllersCount) controllersCount.textContent = data.controllers.length;

        // Update aircraft images display
        if (aircraftImages) {
            const imagesHtml = Array.from(this.currentImages.entries())
                .map(([type, urls]) => `
                    <div class="aircraft-image-container">
                        <h4>${type}</h4>
                        <div class="image-sources">
                            ${urls.jetPhotos ? `
                                <a href="https://www.jetphotos.com/photo/keyword/${type}" target="_blank">
                                    <img src="${urls.jetPhotos}" alt="${type} on JetPhotos" />
                                </a>
                            ` : ''}
                            ${urls.planespotters ? `
                                <a href="https://www.planespotters.net/photo/search?q=${type}" target="_blank">
                                    <img src="${urls.planespotters}" alt="${type} on Planespotters" />
                                </a>
                            ` : ''}
                        </div>
                    </div>
                `).join('');
            
            aircraftImages.innerHTML = imagesHtml;
        }
    }
}

// Initialize both the slider and preview when document is ready
document.addEventListener('DOMContentLoaded', () => {
    new BackgroundSlider();
    if (document.getElementById('preview-map')) {
        new VatsimPreview();
    }
});
