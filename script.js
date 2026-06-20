
// Initialize the map
const map = L.map('map').setView([37.8715, -122.2730], 13); // Centered on Berkeley

// Add a satellite basemap (Esri World Imagery)
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 18
}).addTo(map);

// Get references to the info panel elements
const infoPanel = document.getElementById('info-panel');
const infoContent = document.getElementById('info-content');

// Function to style the GeoJSON layers
function style(feature) {
    let fillColor = '#3388ff'; // Default blue
    let weight = 2;
    let opacity = 0.8;
    let color = '#3388ff';
    let fillOpacity = 0.2;

    // Highlight District 1 with a unique color outline
    if (feature.properties.District === 1) {
        color = '#ff7800'; // Orange outline for District 1
        weight = 3;
        fillColor = '#ff7800'; // Make fill also orange
        fillOpacity = 0.1; // Slightly transparent
    }

    return {
        fillColor: fillColor,
        weight: weight,
        opacity: opacity,
        color: color,
        fillOpacity: fillOpacity
    };
}

// Function to handle click events on districts
function onEachFeature(feature, layer) {
    layer.on({
        click: function(e) {
            const props = e.target.feature.properties;
            let districtInfo = `
                <p><b>District:</b> ${props.District}</p>
                <p><b>Council Member:</b> ${props.Council_Member}</p>
            `;
            infoContent.innerHTML = districtInfo;
            infoPanel.classList.remove('hidden');

            // Optional: Zoom to the clicked feature
            map.fitBounds(e.target.getBounds());
        }
    });
}

// Load GeoJSON data
// Make sure this URL is correct and accessible on your GitHub Pages
fetch('https://raw.githubusercontent.com/kashimaa/Berk/main/CouncilDistricts.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        L.geoJson(data, {
            style: style,
            onEachFeature: onEachFeature
        }).addTo(map);
    })
    .catch(error => {
        console.error('Error loading the GeoJSON data:', error);
        infoContent.innerHTML = '<p>Error loading district data.</p>';
        infoPanel.classList.remove('hidden');
    });

// Add a simple way to hide the info panel
map.on('click', function() {
    infoPanel.classList.add('hidden');
});


