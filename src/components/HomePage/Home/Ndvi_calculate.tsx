// NdviCalculator.tsx
import React from 'react';

interface NdviCalculatorProps {
  geoJsonData: any;
  onNdviCalculated: (ndviData: any) => void;
}

const NdviCalculator: React.FC<NdviCalculatorProps> = ({ geoJsonData, onNdviCalculated }) => {
  // Function to calculate NDVI based on GeoJSON data
  const calculateNdvi = () => {
    // This is a mock calculation
    const featuresWithNdvi = geoJsonData.features.map((feature: any) => {
      const ndvi = Math.random(); // Replace with actual NDVI calculation logic

      return {
        ...feature,
        properties: {
          ...feature.properties,
          ndvi,
        },
      };
    });

    // Return the new GeoJSON data with NDVI values
    const ndviGeoJson = {
      type: 'FeatureCollection',
      features: featuresWithNdvi,
    };

    onNdviCalculated(ndviGeoJson); // Send calculated NDVI data to parent
  };

  return (
    <div>
      <button className="btn btn-secondary" onClick={calculateNdvi}>
        Calculate NDVI
      </button>
    </div>
  );
};

export default NdviCalculator;
