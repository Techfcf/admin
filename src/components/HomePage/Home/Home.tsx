import React, { useEffect, useRef, useState } from 'react';
import { Loader} from '@googlemaps/js-api-loader';
import * as toGeoJSON from '@tmcw/togeojson';
import './Home.scss';
const ProjectDescription: React.FC<{ onTabSelect: (tab: string) => void }> = ({ onTabSelect }) => {
  return (
    <div className="tab mb-2" style={{ padding: '10px', margin: '0px', borderRadius: '0px', backgroundColor: '#2F474F' }}>
      <button className="tablinks2" style={{ width: '50%', borderRadius: '10px' }} onClick={() => onTabSelect('project')}>
        Project Description
      </button>
      <button className="tablinks2 active" style={{ width: '50%', borderRadius: '10px' }} onClick={() => onTabSelect('draw')}>
        Data Visualization
      </button>
    </div>
  );
};

const SectorSelector: React.FC<{ onSectorChange: (event: React.ChangeEvent<HTMLSelectElement>) => void }> = ({ onSectorChange }) => {
  return (
    <select
      id="sector_selector"
      className="form-select btn btn-primary mt-3"
      aria-label="Default select example"
      onChange={onSectorChange}
      style={{ width: '100%', background: '#4bb9b4', height: '50px' }}
    >
      <option selected>Select Sector Type</option>
      <option value="1">Nature based Solutions (NbS)</option>
      <option value="2">Community based Projects</option>
    </select>
  );
};

const ProjectSelection: React.FC = () => {
  return (
    <select
      id="project_selector"
      className="form-select btn btn-primary mt-3"
      aria-label="Default select example"
      style={{ width: '100%', background: '#4bb9b4', height: '50px' }}
    >
      <option value="null">Select Projects</option>
    </select>
  );
};

const AlgorithmSelection: React.FC = () => {
  return (
    <form method="post" action="/get-result" id="form-result">
      <label htmlFor="glacierProcess">Select an algorithm:</label>
      <select className="form-control" id="glacierProcess" name="glacierProcess">
        <option value="">-- Select Algorithm --</option>
        <option value="NDVI">NDVI</option>
      </select>
      <input type="submit" name="submit" className="btn btn-primary" id="load_result" value="Compute" disabled style={{ background: 'radial-gradient(939px at 94.7% 50%, #5590a3 0%, rgb(163, 223, 220) 76.9%) !important' }} />
    </form>
  );
};

const MapComponent: React.FC = () => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [drawingManager , setDrawingManager] = useState<google.maps.drawing.DrawingManager | null>(null);
  const [shapes, setShapes] = useState<google.maps.Polygon | google.maps.Rectangle | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: 'AIzaSyAKm1GCgJ2J6SdUnyOBBn0Z-w30yeuAhmQ', // Replace with your Google Maps API key
      version: 'weekly',
      libraries: ['drawing'],
    });

    loader.load().then(() => {
      const googleMaps = window.google.maps;

      // Initialize the map
      const mapInstance = new googleMaps.Map(document.getElementById('map') as HTMLElement, {
        center: { lat: 34.1, lng: -118.69 },
        zoom: 10,
      });

      // Initialize the Drawing Manager
      const drawingManagerInstance = new googleMaps.drawing.DrawingManager({
        drawingMode: null,
        drawingControl: true,
        drawingControlOptions: {
          position: googleMaps.ControlPosition.TOP_LEFT,
          
        },
        polygonOptions: {
          editable: true,
          draggable: true,
        },
        rectangleOptions: {
          editable: true,
          draggable: true,
        },
      });

      // Set up the Drawing Manager on the map
      drawingManagerInstance.setMap(mapInstance);

      drawingManagerInstance.setMap(mapInstance);
      setDrawingManager(drawingManagerInstance); // This line is correct

      googleMaps.event.addListener(drawingManagerInstance, 'overlaycomplete', (event: google.maps.drawing.OverlayCompleteEvent) => {
        if (shapes) {
          shapes.setMap(null);
        }
        setShapes(event.overlay as google.maps.Polygon | google.maps.Rectangle);
        drawingManagerInstance.setDrawingMode(null);
      });
  
      setMap(mapInstance);
    });
  }, [shapes]);

  const handleFileSubmit = () => {
    const file = fileInputRef.current?.files?.[0];
    if (file && file.name.endsWith('.kml')) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const kmlText = e.target?.result as string;
        const parser = new DOMParser();
        const kmlDom = parser.parseFromString(kmlText, 'application/xml');
        const geoJsonData = toGeoJSON.kml(kmlDom);

        if (map) {
          map.data.addGeoJson(geoJsonData);
          const bounds = new google.maps.LatLngBounds();
          map.data.forEach((feature) => {
            processPoints(feature.getGeometry(), bounds.extend, bounds);
          });
          map.fitBounds(bounds);
        }
      };
      reader.readAsText(file);
    } else {
      alert('Please upload a valid KML file.');
    }
  };

  const processPoints = (
    geometry: google.maps.Data.Geometry | null,
    callback: (latLng: google.maps.LatLng) => void,
    thisArg: google.maps.LatLngBounds
  ) => {
    if (!geometry) return;

    if (geometry instanceof google.maps.LatLng) {
      callback.call(thisArg, geometry);
    } else if (geometry instanceof google.maps.Data.Point) {
      callback.call(thisArg, geometry.get());
    } else if (geometry instanceof google.maps.Data.LineString || geometry instanceof google.maps.Data.LinearRing) {
      geometry.getArray().forEach((g) => processPoints(g, callback, thisArg));
    } else if (geometry instanceof google.maps.Data.Polygon || geometry instanceof google.maps.Data.MultiLineString) {
      geometry.getArray().forEach((g) => processPoints(g, callback, thisArg));
    } else if (geometry instanceof google.maps.Data.MultiPoint) {
      geometry.getArray().forEach((g) => processPoints(g, callback, thisArg));
    }
  };

  const deleteShape = () => {
    if (shapes) {
      shapes.setMap(null);
      setShapes(null);
    }
  };

  return (
    <div>
      
      <input type="file" ref={fileInputRef} accept=".kml" />
      <button onClick={handleFileSubmit}>Upload KML</button>
      <button onClick={deleteShape} style={{ marginLeft: '20px' }}>Delete Last Shape</button>
      <div id="map" style={{ height: '500px', width: '100%' }}></div>
    </div>
  );
};

const MainComponent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('draw');

  const handleTabSelect = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="form-div height_fix" style={{ background: 'linear-gradient(#5d5d5d, rgb(113, 135, 137))', color: 'white', padding: '0px' }}>
      <ProjectDescription onTabSelect={handleTabSelect} />
      <div className="accordion" id="project_tab" style={{ overflow: 'hidden auto', color: 'white', height: '90%', display: activeTab === 'project' ? 'block' : 'none' }}>
        <div className="row">
          <div className="col-md-12">
            <SectorSelector onSectorChange={(e) => console.log(e.target.value)} />
            <ProjectSelection />
          </div>
        </div>
      </div>

      <div className="accordion" id="accordionExample" style={{ overflow: 'hidden auto', display: 'block', height: '86%', background: 'linear-gradient(rgb(93, 93, 93), rgb(113, 135, 137))', color: 'white' }}>
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingOne">
            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
              <h5>1. Upload AOI</h5>
            </button>
          </h2>
          <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
            <div className="accordion-body">
              <MapComponent />
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingTwo">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
              <h5>2. Satellite/Sensor Selection</h5>
            </button>
          </h2>
          <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
            <div className="accordion-body">
              {/* Add Satellite/Sensor selection form here */}
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingThree">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
              <h5>3. Algorithm Selection</h5>
            </button>
          </h2>
          <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
            <div className="accordion-body">
              <AlgorithmSelection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainComponent;
