// We create the tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

// We create the dark view tile layer that will be an option for our map.
let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

// Create the map object with center, zoom level and default layer.
let map = L.map('mapid', {
    center: [39.5, -98.5],
    zoom: 3,
    layers: [streets]
});

// create a base layer that holds both maps, streets and dark
let baseMaps = {
    'Streets': streets,
    'Satellite Streets': satelliteStreets
}

// Create the earthquake layer for our map.
let earthquakes = new L.layerGroup();

// We define an object that contains the overlays.
// This overlay will be visible all the time.
let overlays = {
    Earthquakes: earthquakes
  };

// Then we add a control to the map that will allow the user to change
// which layers are visible.
L.control.layers(baseMaps, overlays).addTo(map);

// Accessing the Toronto airline routes GeoJSON URL.
let earthquakeData = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// this function returns the style data for each of the earthquakes we plot on the map
// we pass the magnitude of the earthquake into this function to calculate the radius
function styleInfo(feature) { 
    return {
        opacity: 1,
        fillOpacity: 1,
        fillColor: getColor(feature.properties.mag),
        color: '#000000',
        radius: getRadius(feature.properties.mag),
        stroke: true,
        weight: 0.5
    };
};

function getColor(magnitude) {
    if (magnitude > 5) {
        return '#ea2c2c';
    }
    else if (magnitude > 4) {
        return '#ea822c';
    }
    else if (magnitude > 3) {
        return '#ee9c00';
    }
    else if (magnitude > 2) {
        return '#eecc00';
    }
    else if (magnitude > 1) {
        return '#d4ee00';
    }
    else {
        return '#98ee00';
    }
}

// this function determines the radius of the earthquake marker based on its magnitude
// earthquakes with a magnitude of 0 will be plotted with a radius of 1
function getRadius(magnitude) {
    if (magnitude === 0) {
        return 1;
    }
    return magnitude * 4;
};

    
d3.json(earthquakeData).then(function(data) {
    // create a geojson layer with the retrieved data
    L.geoJSON(data, {
        // we turn each feature into a circleMarker on the map
        pointToLayer: function(feature, latlng) {
            console.log(data);
            return L.circleMarker(latlng);
        },
        // set the style for each circleMarker using our styleInfo function
        style: styleInfo,
        // create a popup for each circleMarker to display the magnitude and 
        // location of the earthquake after the marker has been created a styled
        onEachFeature: function(feature, layer) {
            layer.bindPopup(`Magnitude: ${feature.properties.mag} <br> Location: ${feature.properties.place}`);
        }
    }).addTo(earthquakes);
    // then we add the earthquake layer to our map
    earthquakes.addTo(map)
});