// Create map object
var myMap = L.map("map", {
    center: [30, 0],
    zoom: 3
  });

// Add tile layer to the map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
}).addTo(myMap);

// Store data in variable
let globalData = [];

// Grab data with d3
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(url).then(data => {
    globalData = data
    init(globalData)
});

// Use data to build map layers
function init(data) {
    
    // Define a markerSize function that will give each marker a different radius based on its magnitude
    function markerSize(magnitudes) {
        return magnitudes * 50000
    };

    // Define data for map information
    let features = data.features;

    let magnitudes = [];

    for (let i = 0; i < features.length; i++) {
        let magnitude = features[i].properties.mag
        magnitudes.push(magnitude)
    };

    let depths = [];

    for (let i = 0; i < features.length; i++) {
        let depth = features[i].geometry.coordinates[2]
        depths.push(depth)
    };

    function getColor(d) {
        return d > 90 ? '#d73027' :
               d > 70 ? '#fc8d59' :
               d > 50 ? '#fee08b' :
               d > 30 ? '#d9ef8b' :
               d > 10 ? '#91cf60' :
               d > -10 ? '#1a9850' :
                        '#1a1a1a';
    };
    
    let coordinates = [];

    for (let i = 0; i < features.length; i++) {
        let coordinate = [features[i].geometry.coordinates[1], features[i].geometry.coordinates[0]]
        coordinates.push(coordinate)
    };

    let locations = [];

    for (let i = 0; i < features.length; i++) {
        let location = features[i].properties.place
        locations.push(location)
    };

    // Create circles based on coordinates
    // Define radius based on magnitude
    // Define color based on depth
    for (let i = 0; i < features.length; i++) {
        L.circle(coordinates[i], {
            radius: markerSize(magnitudes[i]),
            fillColor: getColor(depths[i]),
            fillOpacity: 1,
            color: "black",
            weight: 1            
        }).bindPopup("<p>Magnitude: " + magnitudes[i] + 
                    "</p><p>Depth: " + depths[i] + 
                    "</p><p>Location: " + locations[i] + "</p>").addTo(myMap);
    };

    // Create legend with depth colors
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (myMap) {

        let div = L.DomUtil.create('div', 'info legend'),
            grades = [-10, 10, 30, 50, 70, 90];

        for (let i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                (grades[i] + 1) + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(myMap);

}

    
