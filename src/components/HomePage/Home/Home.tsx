import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import * as toGeoJSON from '@tmcw/togeojson';
import JSZip from 'jszip';
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



const ProjectSelection: React.FC<{ onTabChange: (tab: string) => void }> = ({ onTabChange }) => {
  return (
    <div className="tab" style={{ borderRadius: '20px', padding: '10px' }}>
      <button
        className="tablinks1"
        style={{ width: '50%', borderRadius: '20px' }}
        onClick={() => onTabChange('drawAOI')}
      >
        Draw AOI
      </button>
      <button
        className="tablinks1 active"
        style={{ width: '50%', borderRadius: '20px' }}
        onClick={() => onTabChange('uploadAOI')}
      >
        Upload AOI
      </button>
    </div>
  );
};
const MapComponent: React.FC = () => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [, setDrawingManager] = useState<google.maps.drawing.DrawingManager | null>(null);
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

      // Set the map and drawing manager state
      setMap(mapInstance);
      setDrawingManager(drawingManagerInstance);

      // Add event listeners for drawing completion
      googleMaps.event.addListener(drawingManagerInstance, 'overlaycomplete', (event: google.maps.drawing.OverlayCompleteEvent) => {
        if (shapes) {
          shapes.setMap(null);
        }
      
        const overlay = event.overlay;
      
        // Check if the overlay is a Polygon or Rectangle
        if (overlay instanceof google.maps.Polygon || overlay instanceof google.maps.Rectangle) {
          setShapes(overlay);
        } else {
          // Optionally handle other types or ignore
          console.warn('Unsupported shape type:', overlay);
        }
      
        drawingManagerInstance.setDrawingMode(null);
      });
    });
  }, [shapes]);

  const handleFileSubmit = async () => {
    const file = fileInputRef.current?.files?.[0];
  
    if (!file) {
      alert('Please upload a file.');
      return;
    }
  
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
  
    if (fileExtension === 'kml') {
      handleKMLFile(file);
    } else if (fileExtension === 'geojson') {
      handleGeoJSONFile(file);
    } else if (fileExtension === 'zip') {
      handleZipFile(file);
    } else {
      alert('Unsupported file format. Please upload a KML, GeoJSON, or ZIP file.');
    }
  };
  
  const handleKMLFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const kmlText = e.target?.result as string;
      const parser = new DOMParser();
      const kmlDom = parser.parseFromString(kmlText, 'application/xml');
      const geoJsonData = toGeoJSON.kml(kmlDom);
  
      addDataToMap(geoJsonData);
    };
    reader.readAsText(file);
  };
  
  const handleGeoJSONFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const geoJsonText = e.target?.result as string;
      const geoJsonData = JSON.parse(geoJsonText);
  
      addDataToMap(geoJsonData);
    };
    reader.readAsText(file);
  };
  
  const handleZipFile = async (file: File) => {
    const zip = new JSZip();
    const content = await zip.loadAsync(file);
  
    content.forEach(async (_relativePath, zipEntry) => {
      if (zipEntry.name.endsWith('.kml')) {
        const kmlText = await zipEntry.async('string');
        const parser = new DOMParser();
        const kmlDom = parser.parseFromString(kmlText, 'application/xml');
        const geoJsonData = toGeoJSON.kml(kmlDom);
  
        addDataToMap(geoJsonData);
      } else if (zipEntry.name.endsWith('.geojson')) {
        const geoJsonText = await zipEntry.async('string');
        const geoJsonData = JSON.parse(geoJsonText);
  
        addDataToMap(geoJsonData);
      }
    });
  };
  
  const addDataToMap = (geoJsonData: any) => {
    if (map) {
      map.data.addGeoJson(geoJsonData);
      const bounds = new google.maps.LatLngBounds();
  
      geoJsonData.features.forEach((feature: any) => {
        const geometry = feature.geometry;
  
        if (geometry) {
          if (geometry.type === 'Point') {
            const [lng, lat] = geometry.coordinates;
            bounds.extend(new google.maps.LatLng(lat, lng));
          } else if (geometry.type === 'LineString' || geometry.type === 'MultiPoint') {
            geometry.coordinates.forEach(([lng, lat]: [number, number]) => {
              bounds.extend(new google.maps.LatLng(lat, lng));
            });
          } else if (geometry.type === 'Polygon' || geometry.type === 'MultiLineString') {
            geometry.coordinates.forEach((path: [number, number][]) => {
              path.forEach(([lng, lat]) => {
                bounds.extend(new google.maps.LatLng(lat, lng));
              });
            });
          } else if (geometry.type === 'MultiPolygon') {
            geometry.coordinates.forEach((polygon: [number, number][][]) => {
              polygon.forEach((path) => {
                path.forEach(([lng, lat]) => {
                  bounds.extend(new google.maps.LatLng(lat, lng));
                });
              });
            });
          }
        }
      });
  
      map.fitBounds(bounds);
    }
  };
  const processPoints = (
    geometry: google.maps.Data.Geometry | null,
    callback: (latLng: google.maps.LatLng) => void,
    thisArg: google.maps.LatLngBounds
  ) => {
    if (!geometry) return;
  
    // Handle different geometry types by checking their instance type
    if (geometry instanceof google.maps.LatLng) {
      callback.call(thisArg, geometry);
    } else if (geometry instanceof google.maps.Data.Point) {
      callback.call(thisArg, geometry.get());
    } else if (geometry instanceof google.maps.Data.LineString || geometry instanceof google.maps.Data.LinearRing) {
      geometry.getArray().forEach((g) => processPoints(g, callback, thisArg));
    } else if (geometry instanceof google.maps.Data.Polygon || geometry instanceof google.maps.Data.MultiLineString) {
      geometry.getArray().forEach((g) => {
        g.getArray().forEach((point) => processPoints(point, callback, thisArg));
      });
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
      <div id="uploadAOI" className="tabcontent" style={{ display: 'block' }}>
        <form action="/analytics/uploadShp" id="uploadAOIForm" encType="multipart/form-data" method="POST">
          Upload File:<br />
          Supported File Formats are:
          <ul>
            <li>GeoJSON</li>
            <li>KML</li>
            <li>ESRI Shapefile in Zipped Format</li>
          </ul>
        </form>
      </div>
      <input type="file" ref={fileInputRef} accept=".kml,.geojson,.zip" />
      <button onClick={handleFileSubmit}>Upload File</button>
      <button onClick={deleteShape} style={{ marginLeft: '20px' }}>Delete Last Shape</button>
      <div id="map" style={{ height: '500px', width: '100%' }}></div>
    </div>
  );
};

const MainComponent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('drawAOI');

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="form-div height_fix" style={{ background: 'linear-gradient(#5d5d5d, rgb(113, 135, 137))', color: 'white', padding: '0px' }}>
      <ProjectDescription onTabSelect={handleTabChange} />
      <div className="accordion" id="accordionExample" style={{ overflow: 'hidden auto', display: 'block', height: '86%', background: 'linear-gradient(rgb(93, 93, 93), rgb(113, 135, 137))', color: 'white' }}>
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingOne">
            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
              <h5>1. Area of Interest</h5>
            </button>
          </h2>
          <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
            <div className="accordion-body">
              <ProjectSelection onTabChange={handleTabChange} />
              {activeTab === 'uploadAOI' && (
                <div id="uploadAOI" className="tabcontent" style={{ display: 'block' }}>
                  <MapComponent />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainComponent;
