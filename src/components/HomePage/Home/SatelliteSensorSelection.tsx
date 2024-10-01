import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import './satellite.scss';
import L from 'leaflet';  // Import Leaflet for utility functions

interface SatelliteSensorSelectionProps {
  onSubmit: (data: any) => void;
}

// Custom component to handle map fitting to GeoJSON bounds
const FitBoundsToGeoJson: React.FC<{ geoJsonData: any }> = ({ geoJsonData }) => {
  const map = useMap();

  useEffect(() => {
    if (geoJsonData) {
      const geoJsonLayer = L.geoJSON(geoJsonData);  // Create a Leaflet GeoJSON layer
      const bounds = geoJsonLayer.getBounds();  // Get the bounds of the GeoJSON layer
      map.fitBounds(bounds);  // Fit the map to the bounds
    }
  }, [geoJsonData, map]);

  return null;
};

const SatelliteSensorSelection: React.FC<SatelliteSensorSelectionProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    platforms: 'sentinel',
    sensors: '2',
    products: 'surface',
    reducer: 'mosaic',
    startDate: '',
    endDate: '',
  });

  const [geoJsonData, setGeoJsonData] = useState<any | null>(null);

  const loadGEE = () => {
    return new Promise<void>((resolve) => {
      console.log('Mock: Google Earth Engine API loaded');
      resolve();
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const mockGeoJsonData = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [73.8567, 26.9124], // Jodhpur, Rajasthan
          },
          properties: {
            name: 'Jodhpur, Rajasthan',
          },
        },
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [73.5021, 27.0238],
                [73.7586, 27.1325],
                [74.0135, 26.9393],
                [73.6537, 26.8237],
                [73.5021, 27.0238],
              ],
            ],
          },
          properties: {
            name: 'Polygon in Rajasthan',
          },
        },
      ],
    };

    setGeoJsonData(mockGeoJsonData);

    // Optionally submit the form data
    onSubmit(formData);
  };

  useEffect(() => {
    loadGEE();
  }, []);

  return (
    <div className="satellite-container">
      <div className="accordion-item">
        <div id="collapseSingle" className="accordion-collapse collapse show" aria-labelledby="headingSingle" data-bs-parent="#accordionExample">
          <div className="accordion-body fix-height-collapse">
            <h5 className="form-title">Select Dataset</h5>
            <form method="post" className="fix-form-height" id="form-prds" onSubmit={handleSubmit}>
              <label htmlFor="id_platforms">Platforms:</label>
              <select
                name="platforms"
                className="form-control"
                id="id_platforms"
                value={formData.platforms}
                onChange={handleChange}
              >
                <option value="sentinel">Sentinel</option>
              </select>

              <label htmlFor="id_sensors">Sensors:</label>
              <select
                name="sensors"
                className="form-control"
                id="id_sensors"
                value={formData.sensors}
                onChange={handleChange}
              >
                <option value="2">2</option>
              </select>

              <label htmlFor="id_products">Products:</label>
              <select
                name="products"
                className="form-control"
                id="id_products"
                value={formData.products}
                onChange={handleChange}
              >
                <option value="surface">Sentinel-2 MSI</option>
              </select>

              <label htmlFor="id_reducer">Reducer:</label>
              <select
                name="reducer"
                className="form-control"
                id="id_reducer"
                value={formData.reducer}
                onChange={handleChange}
              >
                <option value="mosaic">mosaic</option>
                <option value="median">median</option>
                <option value="mode">mode</option>
                <option value="mean">mean</option>
                <option value="min">min</option>
                <option value="max">max</option>
                <option value="sum">sum</option>
                <option value="count">count</option>
                <option value="product">product</option>
              </select>

              <br />
              <label htmlFor="id_start_date">Start date:</label>
              <input
                className="form-control"
                type="date"
                name="startDate"
                id="id_start_date"
                value={formData.startDate}
                onChange={handleChange}
                required
              />

              <br />
              <label htmlFor="id_end_date">End date:</label>
              <input
                className="form-control"
                type="date"
                name="endDate"
                id="id_end_date"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
              <input type="submit" className="btn btn-primary" id="load_map" value="Load Results" />
            </form>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="map-container">
        <h5>Map View</h5>
        <MapContainer center={[0, 0]} zoom={2} style={{ height: '500px', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://earthengine.google.com">Google Earth Engine</a>'
          />
          {geoJsonData && (
            <>
              <GeoJSON data={geoJsonData} />
              <FitBoundsToGeoJson geoJsonData={geoJsonData} />  {/* Auto-zoom to fit the data */}
            </>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default SatelliteSensorSelection;
