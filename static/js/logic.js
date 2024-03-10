// Creating the map object
let myMap = L.map("map", {
  center: [27.96044, -82.30695],
  zoom: 4,
});

// Adding the tile layer
let streetmap = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(myMap);

// Load the GeoJSON data.
let geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

function sizeRadius(x) {
  if (x == 0) {
    return 1;
  }
  return x * 4;
}

function colour(x) {
  switch (true) {
    case x > 90:
      return "red";
    case x > 70:
      return "orangered";
    case x > 50:
      return "orange";
    case x > 30:
      return "yellow";
    case x > 10:
      return "yellowgreen";
    default:
      return "green";
  }
}

// Define legend
let legend = L.control({ position: "bottomright" });

legend.onAdd = function (myMap) {
  let div = L.DomUtil.create("div", "info legend"),
    depth = [-10, 10, 30, 50, 70, 90],
    labels = [];

  // Add legend title
  div.innerHTML = '<h4>Depth</h4>';

  // Loop through our depth intervals and generate a label with a colored square for each interval
  for (let i = 0; i < depth.length; i++) {
    div.innerHTML +=
      '<i style="background:' +
      colour(depth[i] + 1) +
      '"></i> ' +
      depth[i] +
      (depth[i + 1] ? "&ndash;" + depth[i + 1] + "<br>" : "+");
  }

  return div;
};

legend.addTo(myMap);



// Adding popups
function onEachFeature(feature, layer) {
  layer.bindPopup(
    "Magnitude: " +
      feature.properties.mag +
      "<br>Location: " +
      feature.properties.place +
      "<br>Depth: " +
      feature.geometry.coordinates[2] +
      " km"
  );
}

// Load the GeoJSON data.
d3.json(geoData).then(function (data) {
  L.geoJson(data, {
    pointToLayer: function (feature, latLong) {
      return L.circleMarker(latLong);
    },
    style: function (feature) {
      return {
        color: "white",
        fillColor: colour(feature.geometry.coordinates[2]),
        fillOpacity: 0.5,
        weight: 1.5,
        radius: sizeRadius(feature.properties.mag),
      };
    },
    onEachFeature: onEachFeature,
  }).addTo(myMap);
});