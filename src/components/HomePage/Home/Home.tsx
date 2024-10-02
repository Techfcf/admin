import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import * as toGeoJSON from '@tmcw/togeojson';
import JSZip from 'jszip';
import './Home.scss';
import SatelliteSensorSelection from './SatelliteSensorSelection'; // Import the new component
interface MapComponentProps {
  onFileUpload: (file: File) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ }) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [, setDrawingManager] = useState<google.maps.drawing.DrawingManager | null>(null);
  const [shapes, setShapes] = useState<google.maps.Polygon | google.maps.Rectangle | null>(null);
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

  const calculateNDVI = async () => {
  if (!map) return;

  try {
    // Fetch NIR and RED images (replace URLs with actual image sources)
    const nirImageResponse = await fetch('https://gibs.earthdata.nasa.gov/');
    const redImageResponse = await fetch('https://gibs.earthdata.nasa.gov/');

    const nirBlob = await nirImageResponse.blob();
    const redBlob = await redImageResponse.blob();

    // Convert blobs to ImageData
    const nirData = await getImageData(nirBlob);
    const redData = await getImageData(redBlob);

    // Calculate NDVI
    const ndviData = computeNDVI(nirData, redData);

    // Create NDVI image (returns base64 URL)
    const ndviImageUrl = createNDVIImage(ndviData);

    // Create an ImageMapType for NDVI layer using the generated NDVI image URL
    const ndviLayer = new google.maps.ImageMapType({
      getTileUrl: (_coord, _zoom) => {
        return ndviImageUrl;
      },
      tileSize: new google.maps.Size(256, 256),
      opacity: 0.7, // You can adjust the opacity of the NDVI layer
    });

    // Add NDVI layer to the map on top of the default satellite layer
    if (ndviLayer && map) {
      console.log("NDVI layer added to the map.");
    }
  } catch (error) {
    console.error('Error calculating NDVI:', error);
  }
};

  
  // Helper function to convert Blob to ImageData
  const getImageData = (blob: Blob): Promise<ImageData> => {
    return new Promise((resolve) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
  
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const imageData = ctx?.getImageData(0, 0, img.width, img.height);
        if (imageData) resolve(imageData);
      };
  
      const url = URL.createObjectURL(blob);
      img.src = url;
    });
  };
  
  // Compute NDVI using the NIR and RED ImageData objects
  const computeNDVI = (nirData: ImageData, redData: ImageData): number[][] => {
    const width = nirData.width;
    const height = nirData.height;
  
    const ndviArray: number[][] = [];
  
    for (let y = 0; y < height; y++) {
      const row: number[] = [];
      for (let x = 0; x < width; x++) {
        const nirPixel = nirData.data[(y * width + x) * 4]; // Assuming NIR value is in red channel of NIR image
        const redPixel = redData.data[(y * width + x) * 4]; // Assuming RED value is in red channel of Red image
  
        const ndvi = (nirPixel - redPixel) / (nirPixel + redPixel);
        row.push(isNaN(ndvi) ? 0 : ndvi); // Avoid NaN values
      }
      ndviArray.push(row);
    }
  
    return ndviArray;
  };
  
  // Create NDVI image from NDVI array (returns a base64 image string)
  const createNDVIImage = (ndviArray: number[][]): string => {
    const width = ndviArray[0].length;
    const height = ndviArray.length;
  
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const imageData = ctx?.createImageData(width, height);
    const data = imageData?.data;
  
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const ndvi = (ndviArray[y][x] + 1) / 2; // Scale NDVI from -1..1 to 0..1
        const pixelIndex = (y * width + x) * 4;
  
        data![pixelIndex] = 0; // Red
        data![pixelIndex + 1] = Math.floor(ndvi * 255); // Green (NDVI)
        data![pixelIndex + 2] = 0; // Blue
        data![pixelIndex + 3] = 255; // Alpha
      }
    }
  
    ctx?.putImageData(imageData!, 0, 0);
    return canvas.toDataURL(); // Return the base64 image string
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
      <button onClick={calculateNDVI} style={{ marginLeft: '20px' }}>Calculate NDVI</button>
      <div id="map" style={{ height: '500px', width: '100%' }}></div>
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
