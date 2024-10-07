// OrthoMosaicImage.tsx
import React, { useState } from 'react';

const OrthoMosaicImage: React.FC = () => {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [treeCount, setTreeCount] = useState<number | null>(null);

  // Function to generate orthomosaic image
  const handleGenerateImage = async () => {
    try {
      const predefinedCoordinates = [
        { lat: 34.1, lng: -118.69 },
        { lat: 34.2, lng: -118.59 },
        { lat: 34.3, lng: -118.49 },
        { lat: 34.4, lng: -118.39 }
      ];

      const queryParams = predefinedCoordinates.map(coord => `lat=${coord.lat}&lng=${coord.lng}`).join('&');
      const response = await fetch(`https://backend.fitclimate.com/auth/orthomosiac-img?${queryParams}`, {
        method: 'GET',
        headers: {
          'Accept': 'image/png',
          'Origin': 'https://admin.fitclimate.com',
          'Referer': 'https://admin.fitclimate.com',
        }
      });

      if (!response.ok) {
        console.error('Image generation failed:', response.statusText);
        alert(`Image generation failed: ${response.statusText}`);
        return;
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setGeneratedImage(imageUrl);

      alert('Image generation successful!');
    } catch (error) {
      console.error('An error occurred while generating the image:', error);
      alert('An error occurred while generating the image. Please try again later.');
    }
  };

  // Function to count trees by calling the API
  const handleCountTrees = async () => {
    try {
      const predefinedCoordinates = [
        { lat: 34.1, lng: -118.69 },
        { lat: 34.2, lng: -118.59 },
        { lat: 34.3, lng: -118.49 },
        { lat: 34.4, lng: -118.39 }
      ];

      const queryParams = predefinedCoordinates.map(coord => `lat=${coord.lat}&lng=${coord.lng}`).join('&');
      const response = await fetch(`https://backend.fitclimate.com/auth/api/trees/count?${queryParams}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Origin': 'https://admin.fitclimate.com',
          'Referer': 'https://admin.fitclimate.com',
        }
      });
      alert(`Tree count API call failed: ${response.json()}`);

      if (!response.ok) {
        console.error('Tree count API call failed:', response.statusText);
        alert(`Tree count API call failed: ${response.statusText}`);
        return;
      }

      const result = await response.json();
      setTreeCount(result.treeCount);

      alert('Tree count successful!');
    } catch (error) {
      console.error('An error occurred while counting trees:', error);
      alert('An error occurred while counting trees. Please try again later.');
    }
  };

  return (
    <div>
      <button onClick={handleGenerateImage} style={{ backgroundColor: 'green', color: 'white', marginRight: '10px' }}>
        Generate Orthomoasic Image
      </button>
      
      <button onClick={handleCountTrees} style={{ backgroundColor: 'blue', color: 'white' }}>
        Count Trees
      </button>
      
      {generatedImage && <img src={generatedImage} alt="Generated Orthoimage" />}
      
      {treeCount !== null && (
        <p>Number of Trees: {treeCount}</p>
      )}
    </div>
  );
};

export default OrthoMosaicImage;
