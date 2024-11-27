import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import './Satellite.scss';
import L, { LatLngBoundsExpression } from 'leaflet';
import NdviCalculator from '../Satellite/Ndvi_calculate'; // Import the NDVI calculator component
import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';

// Types for props and state
interface SatelliteSensorSelectionProps {
  onSubmit: (formData: FormDataType) => void;
}

interface FormDataType {
  platforms: string;
  sensors: string;
  products: string;
  reducer: string;
  startDate: string;
  endDate: string;
}

const FitBoundsToGeoJson: React.FC<{ geoJsonData: FeatureCollection<Geometry, GeoJsonProperties> | null }> = ({ geoJsonData }) => {
  const map = useMap();

  useEffect(() => {
    if (geoJsonData) {
      const geoJsonLayer = L.geoJSON(geoJsonData);
      const bounds: LatLngBoundsExpression = geoJsonLayer.getBounds();
      map.fitBounds(bounds);
    }
  }, [geoJsonData, map]);

  return null;
};

const SatelliteSensorSelection: React.FC<SatelliteSensorSelectionProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<FormDataType>({
    platforms: 'sentinel',
    sensors: '2',
    products: 'surface',
    reducer: 'mosaic',
    startDate: '',
    endDate: '',
  });

  const [geoJsonData, setGeoJsonData] = useState<FeatureCollection<Geometry, GeoJsonProperties> | null>(null);
  const [ndviData, setNdviData] = useState<FeatureCollection<Geometry, GeoJsonProperties> | null>(null);

  const loadGEE = () => {
    return new Promise((resolve) => {
      console.log('Mock: Google Earth Engine API loaded');
      resolve(null);
    });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const mockGeoJsonData: FeatureCollection<Geometry, GeoJsonProperties> = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [73.8567, 26.9124],
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
    onSubmit(formData);
  };

  const handleNdviCalculated = (ndviData: FeatureCollection<Geometry, GeoJsonProperties>) => {
    setNdviData(ndviData);
  };

  useEffect(() => {
    loadGEE();
  }, []);

  return (
    <div className="satellite-container">
      <div className="accordion-item">
        <div id="collapseSingle" className="accordion-collapse collapse show" aria-labelledby="headingSingle" data-bs-parent="#accordionExample">
          <div className="accordion-body fix-height-collapse">
            <h1 className="h1">SatelliteSensorSelection</h1>
            <h3 className="form-title">Select Dataset</h3>
            <form method="post" className="fix-form-height" id="form-prds" onSubmit={handleSubmit}>
              {/* Form elements */}
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
                {/* Options */}
              </select>
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

      {/* NDVI Calculation */}
      {geoJsonData && <NdviCalculator geoJsonData={geoJsonData} onNdviCalculated={handleNdviCalculated} />}

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
              <FitBoundsToGeoJson geoJsonData={geoJsonData} />
            </>
          )}
          {ndviData && (
            <GeoJSON
              data={ndviData}
              style={(feature) => ({
                color: feature?.properties?.ndvi > 0 ? 'green' : 'red',
                fillOpacity: 0.5,
              })}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default SatelliteSensorSelection;
