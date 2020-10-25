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
let globalData = []

// Grab data with d3
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(url).then(data => {
    globalData = data
    init(globalData);
}) 

// Use data to build map layers
function init(data, index = 0) {
    
    // Define a markerSize function that will give each marker a different radius based on its magnitude
    function markerSize(magnitudes) {
        return magnitudes * 100000;
    }

    // Define data for map information
    let features = data.features

    let magnitudes = []

    for (let i = 0; i < features.length; i++) {[
        mag = features[i].properties.mag,
        magnitudes.push(mag)
    ]};
    console.log(magnitudes)

    let depths = []

    for (let i = 0; i < features.length; i++) {[
        depth = features[i].geometry.coordinates[2],
        depths.push(depth)
    ]};
    
    let coordinates = []

    for (let i = 0; i < features.length; i++) {[
        coordinate = [features[i].geometry.coordinates[1], features[i].geometry.coordinates[0]],
        coordinates.push(coordinate)
    ]};

    // Loop through the coordinates array and create one marker for each earthquake
    for (var i = 0; i < coordinates.length; i++) {
        L.circle(coordinates[i], {
            fillOpacity: 0.75,
            color: "black",
            fillColor: "purple",
            // Setting our circle's radius equal to the output of our markerSize function
            // This will make our marker's size proportionate to its magnitude
            radius: markerSize(magnitudes[i])
        }).bindPopup("<h3>Coordinates: " + coordinates[i] + "</h3><h3>Magnitude: " + magnitudes[i] + "</h3>").addTo(myMap);
    };

        //add date
        //add location
        //add coloring
        //add legend
}

    
