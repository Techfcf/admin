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

  // Function to get the tree count from the API
  const handleGetTreeCount = async () => {
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

      if (!response.ok) {
        console.error('Tree count API call failed:', response.statusText);
        alert(`Tree count API call failed: ${response.statusText}`);
        return;
      }

      const result = await response.json();
      console.log('Tree count result:', result); // Debugging log

      if (result.treeCount !== undefined) {
        setTreeCount(result.treeCount); // Directly set the API value
        alert(`Tree count: ${result.treeCount}`);
      } else {
        alert('Tree count not available in the response.');
      }
    } catch (error) {
      console.error('An error occurred while fetching the tree count:', error);
      alert('An error occurred while fetching the tree count. Please try again later.');
    }
  };

  return (
    <div>
      <button onClick={handleGenerateImage} style={{ backgroundColor: 'green', color: 'white', marginRight: '10px' }}>
        Generate Orthomoasic Image
      </button>
      
      <button onClick={handleGetTreeCount} style={{ backgroundColor: 'blue', color: 'white' }}>
        Get Tree Count
      </button>
      
      {generatedImage && <img src={generatedImage} alt="Generated Orthoimage" />}
      
      {treeCount !== null ? (
        <p>Number of Trees (from API): {treeCount}</p>
      ) : (
        <p>Click "Get Tree Count" to retrieve the number of trees.</p>
      )}
    </div>
  );
};

export default OrthoMosaicImage;
