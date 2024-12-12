import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import * as toGeoJSON from "@tmcw/togeojson";
import { GeoJSON as LeafletGeoJSON } from "leaflet";
import "leaflet/dist/leaflet.css";
import "./FetchProject.scss";
import { useNavigate } from "react-router-dom"; // Import useNavigate

// KMLLayer Component
const KMLLayer: React.FC<{ url: string }> = ({ url }) => {
  const map = useMap();

  useEffect(() => {
    const loadKML = async () => {
      try {
        const response = await axios.get(url, { responseType: "blob" });
        const file = response.data;

        const reader = new FileReader();
        reader.onload = () => {
          try {
            const kmlText = reader.result as string;
            const parser = new DOMParser();
            const kml = parser.parseFromString(kmlText, "text/xml");
            const geoJSON = toGeoJSON.kml(kml);

            // Remove existing GeoJSON layers
            map.eachLayer((layer) => {
              if (layer instanceof LeafletGeoJSON) {
                map.removeLayer(layer);
              }
            });

            // Add GeoJSON layer
            const geoJsonLayer = new LeafletGeoJSON(geoJSON, {
              onEachFeature: (feature, layer) => {
                if (feature.properties?.name) {
                  layer.bindPopup(`<strong>${feature.properties.name}</strong>`);
                }
              },
            });

            geoJsonLayer.addTo(map);
            map.fitBounds(geoJsonLayer.getBounds());
          } catch (error) {
            console.error("Error parsing KML to GeoJSON:", error);
          }
        };

        reader.readAsText(file);
      } catch (error) {
        console.error("Error loading KML:", error);
      }
    };

    loadKML();
  }, [url, map]);

  return null;
};

// FetchProject Component
const FetchProject: React.FC = () => {
  interface Sector {
    id: string;
    sectorName: string;
    sectorDesc: string | null;
  }

  interface Project {
    id: number;
    name: string;
    filePath?: string;
    projectDesc?: string;
    area?: number;
    startDate?: string;
    status?: string | null;
    impact?: string;
  }

  const [formData, setFormData] = useState({
    sectorType: "",
    projectId: "",
  });
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectDetails, setProjectDetails] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use the useNavigate hook
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSectors = async () => {
      setLoading(true);
      try {
        const response = await axios.get<Sector[]>(
          "https://backend.fitclimate.com/api/projects/fetch-all-sectors"
        );
        setSectors(response.data);
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
          "An error occurred while fetching sectors."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchSectors();
  }, []);

  const fetchProjects = async () => {
    if (!formData.sectorType) {
      setError("Please select a sector.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<Project[]>(
        `https://backend.fitclimate.com/api/projects/get-all-projects?sectorId=${formData.sectorType}`
      );
      setProjects(response.data);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        "An error occurred while fetching projects."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectDetails = async () => {
    if (!formData.projectId) {
      setError("Please select a project.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<Project>(
        `https://backend.fitclimate.com/api/projects/${formData.projectId}`
      );
      setProjectDetails(response.data);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.message ||
        `Failed to fetch details for project ${formData.projectId}.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "sectorType") {
      setProjects([]);
      setFormData((prev) => ({ ...prev, projectId: "" }));
      setProjectDetails(null);
    }
  };

  // Function to navigate to the home page
  const navigateHome = () => {
    navigate("/"); // Replace "/" with your homepage route if different
  };
  // Function to navigate to the create project page
  const navigateCreateProject = () => {
    navigate("/CreateProject"); // Replace "/" with your homepage route if different
  };

  return (
    <div className="fetchs">
      {/* Button to navigate to the home page */}
      <button className="home-button" onClick={navigateHome}>
        Home
      </button>
      {/* Button to navigate to the create project  page */}
      <button className="create" onClick={navigateCreateProject}>
        Go to CreateProject
      </button>

  
      {/* Form Section */}
      <div className="forms">
        <h2>Fetch Project</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchProjects();
          }}
        >
          <div className="group">
            <label htmlFor="sectorType">Sector Type</label>
            <select
              name="sectorType"
              id="sectorType"
              value={formData.sectorType}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Sector --</option>
              {sectors.map((sector) => (
                <option key={sector.id} value={sector.id}>
                  {sector.sectorName}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Fetch Projects"}
          </button>
        </form>
  
        {projects.length > 0 && (
          <div className="group">
            <label htmlFor="projectId">Project</label>
            <select
              name="projectId"
              id="projectId"
              value={formData.projectId}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Project --</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            <button type="button" onClick={fetchProjectDetails}>
              {loading ? "Loading..." : "Get Details"}
            </button>
          </div>
        )}
  
        {error && <p className="error-message">{error}</p>}
  
        {projectDetails && (
          <div className="preview">
            <h3>Project Details</h3>
            <table>
              <tbody>
                <tr>
                  <td><strong>ID:</strong></td>
                  <td>{projectDetails.id}</td>
                </tr>
                <tr>
                  <td><strong>Name:</strong></td>
                  <td>{projectDetails.name}</td>
                </tr>
                <tr>
                  <td><strong>Description:</strong></td>
                  <td>{projectDetails.projectDesc || "N/A"}</td>
                </tr>
                <tr>
                  <td><strong>Start Date:</strong></td>
                  <td>{projectDetails.startDate || "N/A"}</td>
                </tr>
                <tr>
                  <td><strong>Status:</strong></td>
                  <td>{projectDetails.status || "N/A"}</td>
                </tr>
                <tr>
                  <td><strong>Impact:</strong></td>
                  <td>{projectDetails.impact}</td>
                </tr>
                <tr>
                  <td><strong>Area:</strong></td>
                  <td>{projectDetails.area} sq. units</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
  
      {/* Map Section */}
      <div className="map-container">
        {projectDetails?.filePath && (
          <MapContainer center={[0, 0]} zoom={2} className="map">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <KMLLayer url={projectDetails.filePath} />
          </MapContainer>
        )}
      </div>
    </div>
  );
};

export default FetchProject;
