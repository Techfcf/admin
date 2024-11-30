import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer } from "react-leaflet";
import "./FetchProject.scss";

const FetchProject: React.FC = () => {
  const [formData, setFormData] = useState({
    sectorType: "",
    projectId: "",
  });
  const [sectors, setSectors] = useState<{ id: string; sectorName: string; sectorDesc: string | null }[]>([]);
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);
  const [projectDetails, setProjectDetails] = useState<any>(null);
  const [kmlUrl, setKmlUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch sectors on component mount
  useEffect(() => {
    const fetchSectors = async () => {
  setLoading(true);
  try {
    const response = await axios.get(
      "https://backend.fitclimate.com/api/projects/fetch-all-sectors"
    );

    if (response.data && Array.isArray(response.data)) {
      const parsedSectors = response.data.map((sector: any) => ({
        id: sector.id,
        sectorName: sector.sectorName || "Unnamed Sector",
        sectorDesc: sector.sectorDesc || null, // Add sectorDesc field
      }));
      setSectors(parsedSectors);
    } else {
      setSectors([]);
    }
  } catch (err) {
    console.error("Error fetching sectors:", err);
    setError("Failed to fetch sectors.");
  } finally {
    setLoading(false);
  }
};

    fetchSectors();
  }, []);

  // Fetch projects based on selected sector
  const fetchProjects = async () => {
    if (formData.sectorType) {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `https://backend.fitclimate.com/api/projects/get-all-projects=${formData.sectorType}`
        );
        const fetchedProjects = response.data?.projects;

        if (Array.isArray(fetchedProjects)) {
          setProjects(fetchedProjects);
        } else {
          console.error("Unexpected response structure for projects:", response.data);
          setError("Unexpected response from server while fetching projects.");
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to fetch projects.");
      } finally {
        setLoading(false);
      }
    }
  };

  // Fetch project details and KML file
  const fetchProjectDetails = async () => {
    if (formData.projectId) {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `https://backend.fitclimate.com/api/projects/get-all-projects?sectorId=${formData.projectId}`
        );
        const projectData = response.data;

        setProjectDetails(projectData?.projectDetails || null);
        setKmlUrl(projectData?.kmlUrl || null);
      } catch (err) {
        console.error("Error fetching project details:", err);
        setError("Failed to fetch project details.");
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProjects();
  };

  // Handle project selection
  const handleProjectSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormData({ ...formData, projectId: value });
    await fetchProjectDetails();
  };

  return (
    <div className="fetch-project">
      <div className="form-container">
        <h2>Fetch Project</h2>
        <form onSubmit={handleSubmit}>
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
                <option key={sector.id} value={sector.sectorName}>
                  {sector.sectorName}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Loading Projects..." : "Fetch Projects"}
          </button>

          {projects.length > 0 && (
            <div className="form-group">
              <label htmlFor="projectId">Select Project</label>
              <select
                name="projectId"
                id="projectId"
                value={formData.projectId}
                onChange={handleProjectSelect}
                required
              >
                <option value="">-- Select Project --</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </form>

        {error && <p className="error-message">{error}</p>}

        {projectDetails && (
          <div className="project-details">
            <h3>Project Details</h3>
            <p>
              <strong>Description:</strong> {projectDetails.description || "N/A"}
            </p>
            <p>
              <strong>Start Date:</strong> {projectDetails.startDate || "N/A"}
            </p>
            <p>
              <strong>Status:</strong> {projectDetails.status || "N/A"}
            </p>
          </div>
        )}
      </div>

      <div className="map-container">
        {kmlUrl && (
          <MapContainer
            center={[51.505, -0.09]}
            zoom={13}
            style={{ width: "100%", height: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          </MapContainer>
        )}
      </div>
    </div>
  );
};

export default FetchProject;
