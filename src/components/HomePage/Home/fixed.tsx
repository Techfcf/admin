import React, { useState, useRef, useEffect } from "react";
import L from "leaflet";
import "leaflet-draw";
import "leaflet/dist/leaflet.css";
import $ from "jquery"; // Consider removing this later and replace with native fetch API

const MapComponent: React.FC = () => {
  const [selectedButton, setSelectedButton] = useState<string>("");
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [geeLayer, setGeeLayer] = useState<L.TileLayer | null>(null);
  const [fccLayer, setFccLayer] = useState<L.TileLayer | null>(null);
  const [ndviLayer, setNdviLayer] = useState<L.TileLayer | null>(null);
  const drawnItems = useRef(new L.FeatureGroup());

  // Function to update map with GEE layers
  const updateMap = (json: any) => {
    if (map) {
      if (geeLayer) {
        map.removeLayer(geeLayer);
        setGeeLayer(null);
      }
      if (fccLayer) {
        map.removeLayer(fccLayer);
        setFccLayer(null);
      }

      const newGeeLayer = L.tileLayer(json.url[0], {
        attribution:
          '&copy; <a href="https://www.earthengine.google.com/copyright">Google Earth Engine</a>',
      });

      const newFccLayer = L.tileLayer(json.url[1], {
        attribution:
          '&copy; <a href="https://www.earthengine.google.com/copyright">Google Earth Engine</a>',
      });

      newGeeLayer.addTo(map);
      newFccLayer.addTo(map);

      setGeeLayer(newGeeLayer);
      setFccLayer(newFccLayer);
    }
  };

  useEffect(() => {
    if (mapRef.current && !map) {
      const initMap = L.map(mapRef.current, {
        center: [23.311293946778164, 80.02315927873698],
        zoom: 4,
        layers: [L.tileLayer("http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
          maxZoom: 20,
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
        }), drawnItems.current]
      });

      setMap(initMap);
    }
  }, [mapRef, map]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Example of handling form submission in React
    console.log("Form submitted!");

    // Example AJAX call (Replace with fetch API)
    $.ajax({
      url: "/get-image-collection",
      type: "POST",
      data: {
        platforms: $("#id_platforms").val(),
        sensors: $("#id_sensors").val(),
        products: $("#id_products").val(),
        start_date: $("#id_start_date").val(),
        end_date: $("#id_end_date").val(),
        reducer: $("#id_reducer").val(),
      },
      success: (json: any) => {
        updateMap(json);
      },
      error: () => {
        alert("There was an error loading the requested data");
      },
    });
  };

  const handleDrawCreated = (e: L.DrawEvents.Created) => {
    const layer = e.layer;
    drawnItems.current.clearLayers();
    drawnItems.current.addLayer(layer);
    const feature = layer.toGeoJSON();
    console.log("GeoJSON feature:", feature);
    // Process feature as needed
  };

  useEffect(() => {
    if (map) {
      const drawControl = new L.Control.Draw({
        draw: {
          polygon: true,
          rectangle: true,
          polyline: false,
          circle: false,
          circlemarker: false,
          marker: false,
        },
        edit: {
          featureGroup: drawnItems.current,
        },
      });
      map.addControl(drawControl);
      map.on("draw:created", handleDrawCreated);
    }
  }, [map]);

  const handleSelectionChange = (uploadOption: string) => {
    setSelectedButton(uploadOption);
    if (uploadOption === "drawAOI") {
      // logic for draw AOI
    } else if (uploadOption === "adminAOI") {
      // logic for admin AOI
    } else if (uploadOption === "uploadAOI") {
      // logic for upload AOI
    }
  };

  return (
    <div>
      <form id="form-prds" onSubmit={handleFormSubmit}>
        {/* Your form elements */}
        <button type="submit">Submit</button>
      </form>

      <div id="map-div" ref={mapRef} style={{ height: "500px" }}></div>

      <div id="overlay" style={{ display: "none" }}>
        Loading...
      </div>

      <div id="load_result">
        <button id="load_result_button" disabled>
          Load Result
        </button>
      </div>
    </div>
  );
};

export default MapComponent;
