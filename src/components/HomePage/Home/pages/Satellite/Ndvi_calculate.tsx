import React from 'react';
import { FeatureCollection } from 'geojson';

interface NdviCalculatorProps {
  geoJsonData: FeatureCollection;
  onNdviCalculated: (ndviData: FeatureCollection) => void;
}

const NdviCalculator: React.FC<NdviCalculatorProps> = ({ geoJsonData, onNdviCalculated }) => {
  const calculateNdvi = () => {
    const featuresWithNdvi = geoJsonData.features.map((feature) => {
      const ndvi = Math.random(); // Mock NDVI calculation
      return {
        ...feature,
        properties: {
          ...feature.properties,
          ndvi,
        },
      };
    });

    const ndviGeoJson: FeatureCollection = {
      type: 'FeatureCollection',
      features: featuresWithNdvi,
    };

    onNdviCalculated(ndviGeoJson);
  };

  return (
    <button className="btn btn-secondary" onClick={calculateNdvi}>
      Calculate NDVI
    </button>
  );
};

export default NdviCalculator;
