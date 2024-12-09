import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import * as toGeoJSON from "@tmcw/togeojson";
import "./FetchProject.scss";

const FetchProject: React.FC = () => {
  interface Sector {
    id: string;
    sectorName: string;
    sectorDesc: string | null;
  }

  interface Project {
    id: number;
    name: string;
    createdAt?: string;
    updatedAt?: string;
    filePath?: string;
    projectDesc?: string;
    area?: number;
    startDate?: string;
    status?: string | null;
    impact?: string;
    sectorId: string;
  }

  const [formData, setFormData] = useState({
    sectorType: "",
    projectId: "",
  });
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectDetails, setProjectDetails] = useState<Project | null>(null);
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      // Fetch project details
      const response = await axios.get<Project>(
        `https://backend.fitclimate.com/api/projects/${formData.projectId}`
      );
      setProjectDetails(response.data);
  
      if (response.data.filePath) {
        const decodedFilePath = decodeURIComponent(response.data.filePath);
  
        // Use proxy to bypass CORS
        const kmlResponse = await fetch(`http://localhost:5000/proxy?url=${decodedFilePath}`);
        if (!kmlResponse.ok) {
          throw new Error(`Failed to fetch KML file: ${kmlResponse.statusText}`);
        }
  
        const kmlText = await kmlResponse.text();
  
        // Parse and convert KML to GeoJSON
        const parser = new DOMParser();
        const kmlDoc = parser.parseFromString(kmlText, "application/xml");
        const converted = toGeoJSON.kml(kmlDoc);
  
        setGeoJsonData(converted);
      }
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
      setGeoJsonData(null);
    }
  };

  const handleButtonClick = () => {
    if (formData.projectId) {
      fetchProjectDetails();
    } else {
      alert("Please select a project first!");
    }
  };

  return (
    <div className="fetch-project">
      <div className="form-container">
        <h2>Fetch Project</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchProjects();
          }}
        >
          <div className="form-group">
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
          <div className="form-group">
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
            <button type="button" onClick={handleButtonClick}>
              {loading ? "Loading..." : "Get Details"}
            </button>
          </div>
        )}

        {error && <p className="error-message">{error}</p>}

        {projectDetails && (
          <div className="project-preview">
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

      <div className="map-container">
        {geoJsonData && (
          <MapContainer
            center={[51.505, -0.09]}
            zoom={13}
            style={{ width: "100%", height: "500px" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <GeoJSON data={geoJsonData} />
          </MapContainer>
        )}
      </div>
    </div>
  );
};

export default FetchProject;
