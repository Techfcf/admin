import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import * as toGeoJSON from '@tmcw/togeojson';
import JSZip from 'jszip';
import './Home.scss';
import SatelliteSensorSelection from './SatelliteSensorSelection'; // Import the new component
interface MapComponentProps {
  onFileUpload: (file: File) => void;
}
const MapComponent: React.FC<MapComponentProps> = ({}) => {
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [, setDrawingManager] = useState<google.maps.drawing.DrawingManager | null>(null);
    const [shapes, setShapes] = useState<google.maps.Polygon | google.maps.Rectangle | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null); // State for the generated image
    const fileInputRef = useRef<HTMLInputElement>(null);
  
    useEffect(() => {
      const loader = new Loader({
        apiKey: 'AIzaSyD_RsZX1HUnKShcqmWTz3COHmWWlQ0Gn_E', // Replace with your Google Maps API key
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
  
    const handleGenerateImage = async () => {
      try {
          // Define predefined coordinates (latitude and longitude)
          const predefinedCoordinates = [
              { lat: 34.1, lng: -118.69 },  // Example coordinates
              { lat: 34.2, lng: -118.59 },
              { lat: 34.3, lng: -118.49 },
              { lat: 34.4, lng: -118.39 }
          ];
  
          // Call the backend API to generate the orthomosaic image
          const response = await fetch('https://backend.fitclimate.com/auth/orthomosiac-img', {
              method: 'POST',
              headers: {
                  'Accept': '*/*',
                  'Content-Type': 'application/json',
                  'Origin': 'https://admin.fitclimate.com',
                  'Referer': 'https://admin.fitclimate.com',
              },
              body: JSON.stringify({
                  area: predefinedCoordinates,  // Use the predefined coordinates
                  // Add any other required fields based on the API specification
              }),
          });
  
          // Handle the API response
          if (!response.ok) {
              const errorData = await response.json();
              console.error('Image generation failed:', response.statusText, errorData);
              alert(`Image generation failed: ${response.statusText} - ${errorData.message || 'Unknown error'}`);
              return;
          }
  
          const data = await response.json();
          if (data && data.imageUrl) {
              setGeneratedImage(data.imageUrl); // Update the state with the image URL
              alert('Image generation successful!');
          } else {
              console.error('Unexpected API response:', data);
              alert('Image generation failed: Unexpected API response format.');
          }
      } catch (error) {
          console.error('An error occurred while generating the image:', error);
          alert('An error occurred while generating the image. Please try again later.');
      }
  };
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Left side: Upload section and map */}
        <div style={{ width: '60%' }}>
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
          <input type="file" ref={fileInputRef} accept=".zip,.geojson,.kml" />
          <button onClick={handleFileSubmit} style={{ marginRight: '10px', backgroundColor: 'blue', color: 'white' }}>Upload File</button>
  
          {/* Google Map */}
          <div id="map" style={{ height: '500px' }}></div>
        </div>
  
        {/* Right side: Controls */}
        <div style={{ width: '35%' }}>
        <button onClick={handleGenerateImage} style={{ marginRight: '10px', backgroundColor: 'green', color: 'white' }}>Generate OrthiImage</button>
        <button onClick={handleGenerateImage} style={{ backgroundColor: 'red', color: 'white' }}>Count Tree</button>
          <br />
          {generatedImage && <img src={generatedImage} alt="Generated Orthoimage" />}
        </div>
      </div>
    );
};
  
const MainComponent: React.FC = () => {
  const [, setSatelliteData] = useState(null); // State for satellite form data
  const [, setUploadedFile] = useState<File | null>(null); // State for AOI file upload

  // Handle Tab Change

  // Handle satellite form submission
  const handleSatelliteSubmit = (data: any) => {
    setSatelliteData(data);
    console.log('Satellite Data:', data);
  };

  // Handle AOI file upload
  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    console.log('Uploaded AOI File:', file);
  };


  return (
    <div className="form-div height_fix" style={{ background: 'linear-gradient(#5d5d5d, rgb(113, 135, 137))', color: 'white', padding: '0px' }}>
      <div className="accordion" id="accordionExample" style={{ overflow: 'hidden auto', display: 'block', height: '86%', background: 'linear-gradient(rgb(93, 93, 93), rgb(113, 135, 137))', color: 'white' }}>
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingOne">
            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
              <h5>1. Area of Interest</h5>
            </button>
          </h2>
          <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
            <div className="accordion-body">
              {/* Render MapComponent and pass the handleFileUpload function */}
              <MapComponent onFileUpload={handleFileUpload} />
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
              {/* Render SatelliteSensorSelection and pass the handleSatelliteSubmit function */}
              <SatelliteSensorSelection onSubmit={handleSatelliteSubmit} />
            </div>
          </div>
        </div>
        <div className="submit-section">
         
        </div>
      </div>
    </div>
  );
};

export default MainComponent;
