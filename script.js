// Dancer data with locations and social media
const dancers = {
    salsa: [
        {
            name: "Adolfo Indacochea",
            location: [40.7128, -74.0060], // New York
            country: "USA",
            instagram: "adolfoindacochea",
            tiktok: null
        },
        {
            name: "Tania Cannarsa",
            location: [45.4642, 9.1900], // Milan
            country: "Italy",
            instagram: "taniacannarsa",
            tiktok: null
        },
        {
            name: "Jorge Ataca",
            location: [25.7617, -80.1918], // Miami
            country: "USA",
            instagram: "ataca_jorge",
            tiktok: "ataca_jorge"
        },
        {
            name: "Alma Latina",
            location: [19.4326, -99.1332], // Mexico City
            country: "Mexico",
            instagram: "alma_latinasalsa",
            tiktok: null
        },
        {
            name: "Fabrizio Zoro",
            location: [41.9028, 12.4964], // Rome
            country: "Italy",
            instagram: "zorozoro",
            tiktok: null
        },
        {
            name: "Leon Rose",
            location: [51.5074, -0.1278], // London
            country: "UK",
            instagram: "leonrosesalsa",
            tiktok: null
        },
        {
            name: "Juan Matos",
            location: [37.7749, -122.4194], // San Francisco
            country: "USA",
            instagram: "juanmatosofficial",
            tiktok: null
        },
        {
            name: "Olga Lapidus",
            location: [55.7558, 37.6173], // Moscow
            country: "Russia",
            instagram: "olgalapidus",
            tiktok: null
        },
        {
            name: "Seo In Young",
            location: [37.5665, 126.9780], // Seoul
            country: "South Korea",
            instagram: "seo_in_young_salsa",
            tiktok: null
        },
        {
            name: "Stacey Lopez",
            location: [-23.5505, -46.6333], // São Paulo
            country: "Brazil",
            instagram: "staceylopez_salsa",
            tiktok: "staceylopez"
        }
    ],
    bachata: [
        {
            name: "Daniel y Desiree",
            location: [40.7128, -74.0060], // New York
            country: "USA",
            instagram: "danielydesiree",
            tiktok: "danielydesiree"
        },
        {
            name: "Alejandra Loayza",
            location: [-12.0464, -77.0428], // Lima
            country: "Peru",
            instagram: "alejandraloayza",
            tiktok: "aleloayza"
        },
        {
            name: "Carlos Espinosa",
            location: [41.9028, 12.4964], // Rome
            country: "Italy",
            instagram: "carlosespinosa",
            tiktok: null
        },
        {
            name: "Jorge Burgos",
            location: [18.4802, -69.9420], // Santo Domingo
            country: "Dominican Republic",
            instagram: "jorgeburgosbachata",
            tiktok: null
        },
        {
            name: "Alex y Desire",
            location: [4.6097, -74.0817], // Bogotá
            country: "Colombia",
            instagram: "alexydesire",
            tiktok: null
        },
        {
            name: "Korke y Judith",
            location: [41.3851, 2.1734], // Barcelona
            country: "Spain",
            instagram: "korkeyjudith",
            tiktok: "korkeyjudith"
        },
        {
            name: "Mike and Jess",
            location: [51.5074, -0.1278], // London
            country: "UK",
            instagram: "MikeandJessBachata",
            tiktok: "mikeandjessbachata"
        },
        {
            name: "Rodrigo y Gabriela",
            location: [19.4326, -99.1332], // Mexico City
            country: "Mexico",
            instagram: "rodrigoygabriela",
            tiktok: null
        },
        {
            name: "Pablo y Paola",
            location: [34.6037, 58.3816], // Buenos Aires
            country: "Argentina",
            instagram: "pabloypaola",
            tiktok: null
        },
        {
            name: "Nery y Giana",
            location: [35.6762, 139.6503], // Tokyo
            country: "Japan",
            instagram: "neryygiana",
            tiktok: "neryygiana"
        }
    ]
};

let map;
let currentMarkers = [];
let currentDanceType = 'salsa';

// Initialize the map
function initMap() {
    map = L.map('map').setView([20, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add initial salsa dancers
    addDancersToMap('salsa');
}

// Add dancers to the map
function addDancersToMap(danceType) {
    // Clear existing markers
    clearMarkers();

    const dancerList = dancers[danceType];
    const markerClass = danceType === 'salsa' ? 'salsa-marker' : 'bachata-marker';

    dancerList.forEach(dancer => {
        const marker = L.circleMarker(dancer.location, {
            radius: 8,
            fillColor: danceType === 'salsa' ? '#ff6b6b' : '#4ecdc4',
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(map);

        // Create popup content
        let popupContent = `
            <div class="dancer-popup">
                <h3>${dancer.name}</h3>
                <p>${dancer.country}</p>
                <div>
        `;

        if (dancer.instagram) {
            popupContent += `<a href="https://instagram.com/${dancer.instagram}" target="_blank" class="social-link">Instagram</a>`;
        }

        if (dancer.tiktok) {
            popupContent += `<a href="https://tiktok.com/@${dancer.tiktok}" target="_blank" class="social-link tiktok">TikTok</a>`;
        }

        popupContent += `</div></div>`;

        marker.bindPopup(popupContent);
        currentMarkers.push(marker);
    });
}

// Clear all markers from the map
function clearMarkers() {
    currentMarkers.forEach(marker => {
        map.removeLayer(marker);
    });
    currentMarkers = [];
}

// Toggle between dance types
function toggleDanceType(type) {
    if (type === currentDanceType) return;

    currentDanceType = type;

    // Update button states
    document.getElementById('salsa-btn').classList.toggle('active', type === 'salsa');
    document.getElementById('bachata-btn').classList.toggle('active', type === 'bachata');

    // Add new markers
    addDancersToMap(type);
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    initMap();

    document.getElementById('salsa-btn').addEventListener('click', () => {
        toggleDanceType('salsa');
    });

    document.getElementById('bachata-btn').addEventListener('click', () => {
        toggleDanceType('bachata');
    });
});

// Handle window resize
window.addEventListener('resize', () => {
    map.invalidateSize();
});