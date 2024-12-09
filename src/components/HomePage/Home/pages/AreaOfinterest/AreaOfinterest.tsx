import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import * as toGeoJSON from '@tmcw/togeojson';
import JSZip from 'jszip';
import './AreaOfinterest.scss';

interface MapComponentProps {
  onFileUpload: (file: File | null) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ onFileUpload }) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  // const [ setDrawingManager] = useState<google.maps.drawing.DrawingManager | null>(null);
  const [shapes, setShapes] = useState<google.maps.Polygon | google.maps.Rectangle | null>(null);
  const [kmlData, setKmlData] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: 'AIzaSyD_RsZX1HUnKShcqmWTz3COHmWWlQ0Gn_E',
      version: 'weekly',
      libraries: ['drawing'],
    });

    loader.load().then(() => {
      const googleMaps = window.google.maps;
      const mapInstance = new googleMaps.Map(document.getElementById('map') as HTMLElement, {
        center: { lat: 34.1, lng: -118.69 },
        zoom: 10,
      });

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

      drawingManagerInstance.setMap(mapInstance);
      setMap(mapInstance);
      // setDrawingManager(drawingManagerInstance);

      googleMaps.event.addListener(drawingManagerInstance, 'overlaycomplete', (event: any) => {
        if (shapes) {
          shapes.setMap(null);
        }

        const overlay = event.overlay;
        if (overlay instanceof google.maps.Polygon || overlay instanceof google.maps.Rectangle) {
          setShapes(overlay);
        } else {
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
  
    onFileUpload(file); // Trigger the callback to pass the file to the parent component
  
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
      addDataToMap(geoJsonData as GeoJSON.FeatureCollection);
    };
    reader.readAsText(file);
  };

  const handleGeoJSONFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const geoJsonText = e.target?.result as string;
      const geoJsonData = JSON.parse(geoJsonText);
      addDataToMap(geoJsonData as GeoJSON.FeatureCollection);
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
        addDataToMap(geoJsonData as GeoJSON.FeatureCollection);
      } else if (zipEntry.name.endsWith('.geojson')) {
        const geoJsonText = await zipEntry.async('string');
        const geoJsonData = JSON.parse(geoJsonText);
        addDataToMap(geoJsonData as GeoJSON.FeatureCollection);
      }
    });
  };

  const addDataToMap = (geoJsonData: GeoJSON.FeatureCollection) => {
    if (map) {
      map.data.addGeoJson(geoJsonData);
      const bounds = new google.maps.LatLngBounds();

      geoJsonData.features.forEach((feature) => {
        const geometry = feature.geometry;
        if (geometry) {
          if (geometry.type === 'Point') {
            const [lng, lat] = geometry.coordinates as [number, number];
            bounds.extend(new google.maps.LatLng(lat, lng));
          } else if (geometry.type === 'LineString' || geometry.type === 'MultiPoint') {
            (geometry.coordinates as [number, number][]).forEach(([lng, lat]) => {
              bounds.extend(new google.maps.LatLng(lat, lng));
            });
          } else if (geometry.type === 'Polygon' || geometry.type === 'MultiLineString') {
            (geometry.coordinates as [number, number][][]).forEach((path) => {
              path.forEach(([lng, lat]) => {
                bounds.extend(new google.maps.LatLng(lat, lng));
              });
            });
          } else if (geometry.type === 'MultiPolygon') {
            (geometry.coordinates as [number, number][][][]).forEach((polygon) => {
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

  const generateKML = () => {
    if (!shapes) {
      alert('Please draw a shape first.');
      return;
    }

    const kmlTemplateStart = `<?xml version="1.0" encoding="UTF-8"?>
      <kml xmlns="http://www.opengis.net/kml/2.2">
        <Document>
          <name>Drawn AOI</name>
          <Placemark>`;

    const kmlTemplateEnd = `
          </Placemark>
        </Document>
      </kml>`;

    let coordinates = '';

    if (shapes instanceof google.maps.Polygon) {
      const paths = shapes.getPath().getArray();
      coordinates = paths
        .map((latLng) => `${latLng.lng()},${latLng.lat()},0`)
        .join(' ');

      setKmlData(
        `${kmlTemplateStart}
          <Polygon>
            <outerBoundaryIs>
              <LinearRing>
                <coordinates>${coordinates}</coordinates>
              </LinearRing>
            </outerBoundaryIs>
          </Polygon>
        ${kmlTemplateEnd}`
      );
    } else if (shapes instanceof google.maps.Rectangle) {
      const bounds = shapes.getBounds();

      if (bounds) {
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();

        const coordinates = `${sw.lng()},${sw.lat()},0 ${ne.lng()},${sw.lat()},0 ${ne.lng()},${ne.lat()},0 ${sw.lng()},${ne.lat()},0 ${sw.lng()},${sw.lat()},0`;

        setKmlData(
          `${kmlTemplateStart}
            <Polygon>
              <outerBoundaryIs>
                <LinearRing>
                  <coordinates>${coordinates}</coordinates>
                </LinearRing>
              </outerBoundaryIs>
            </Polygon>
          ${kmlTemplateEnd}`
        );
      }
    }
  };

  const downloadKML = () => {
    if (!kmlData) return;

    const blob = new Blob([kmlData], { type: 'application/vnd.google-earth.kml+xml' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'aoi.kml';
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div  className='main'>
      <div id="uploadAOI" className="tabcontent">
        <form action="/analytics/uploadShp" id="uploadAOIForm" encType="multipart/form-data" method="POST">
          <h1>Area Of Interest</h1>
          Upload File:
          <br />
          Supported File Formats are:
          <ul>
            <li>GeoJSON</li>
            <li>KML</li>
            <li>ESRI Shapefile in Zipped Format</li>
          </ul>
        </form>
      </div>
      <label htmlFor="fileInput">Upload AOI File:</label>
<input
  id="fileInput"
  type="file"
  ref={fileInputRef}
  accept=".kml,.geojson,.zip"
  aria-label="Upload a KML, GeoJSON, or ZIP file"
/>
      <button onClick={handleFileSubmit} className="upload-btn">
        Upload File
      </button>
      <button onClick={generateKML} className="generate-btn">
        Generate KML
      </button>
      {kmlData && (
        <button onClick={downloadKML} className="download-btn">
          Download KML
        </button>
      )}

           <div id="map" className="map-container"></div>    </div>
  );
};

const MainComponent: React.FC = () => {
  const [, setUploadedFile] = useState<File | null>(null);

  const handleFileUpload = (file: File | null) => {
    setUploadedFile(file);
    console.log('Uploaded AOI File:', file);
  };

  return (
    <div className="form-div height_fix">
      <div className="accordion" id="accordionExample">
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingOne"></h2>
          <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
            <div className="accordion-body">
              <MapComponent onFileUpload={handleFileUpload} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainComponent;
