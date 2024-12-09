import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CreateProject.scss";

const CreateProject: React.FC = () => {
  const [formData, setFormData] = useState<{
    name: string;
    sectorId: number;
    kmlFile: File | null;
    projectDesc: string; // Changed from description to projectDesc
    area: number;
    startDate: string;
    status: string;
    impact: string;
  }>({
    name: "",
    sectorId: 12345,
    kmlFile: null,
    projectDesc: "",
    area: 0,
    startDate: "",
    status: "",
    impact: "",
  });

  const [sectors, setSectors] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch sectors from API
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
            name: sector.sectorName || "Unnamed Sector",
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

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, kmlFile: e.target.files[0] });
    }
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.sectorId) {
      alert("Please select a sector.");
      return;
    }

    try {
      const submissionData = new FormData();

      // Append the KML file
      if (formData.kmlFile) {
        submissionData.append("file", formData.kmlFile);
      } else {
        alert("Please upload a KML file.");
        return;
      }

      // Append the project details
      const projectData = {
        name: formData.name,
        area: formData.area,
        status: formData.status,
        impact: formData.impact,
        sectorId: formData.sectorId, // Convert sectorId to a number
        projectDesc: formData.projectDesc,
        startDate: formData.startDate || null,
      };

      submissionData.append("project", JSON.stringify(projectData));

      // Send POST request
      const response = await axios.post(
        "https://backend.fitclimate.com/api/projects/create-project",
        submissionData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Success
      alert("Project created successfully!");
      console.log("Response:", response.data);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        console.error("Response Error:", err.response.data);
        alert(`Error: ${err.response.data.message || "Request failed"}`);
      } else {
        console.error("Error:", err);
        alert("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="sidebar">
      <div className="form-container">
        <h2>Create Project</h2>
        <form onSubmit={handleSubmit}>
          {/* Sector Type */}
          <div className="form-group">
            <label htmlFor="sectorId">Sector Type</label>
            <select
              name="sectorId"
              id="sectorId"
              value={formData.sectorId}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Sector --</option>
              {loading && <option>Loading sectors...</option>}
              {!loading && sectors.length > 0 ? (
                sectors.map((sector) => (
                  <option key={sector.id} value={sector.id}>
                    {sector.name}
                  </option>
                ))
              ) : (
                <option disabled>No sectors available</option>
              )}
            </select>
            {error && <p className="error-message">{error}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="name">Project Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter project name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* File Upload */}
          <div className="form-group">
            <label htmlFor="kmlFile">Upload KML File</label>
            <input
              type="file"
              id="kmlFile"
              name="kmlFile"
              accept=".kml"
              onChange={handleFileChange}
              required
            />
          </div>

          {/* Project Description */}
          <div className="form-group">
            <label htmlFor="projectDesc">Project Description</label>
            <textarea
              name="projectDesc"
              id="projectDesc"
              placeholder="Enter project description"
              value={formData.projectDesc}
              onChange={handleChange}
              required
            />
          </div>

          {/* Project Area */}
          <div className="form-group">
            <label htmlFor="area">Project Area (in sq km)</label>
            <input
              type="number"
              id="area"
              name="area"
              placeholder="Enter project area"
              value={formData.area}
              onChange={handleChange}
              required
            />
          </div>

          {/* Start Date */}
          <div className="form-group">
            <label htmlFor="startDate">Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
            />
          </div>

          {/* Project Status */}
          <div className="form-group">
            <label htmlFor="status">Project Status</label>
            <input
              type="text"
              id="status"
              name="status"
              placeholder="Enter project status"
              value={formData.status}
              onChange={handleChange}
            />
          </div>

          {/* SPG Impact */}
          <div className="form-group">
            <label htmlFor="impact">SPG Impact</label>
            <input
              type="text"
              id="impact"
              name="impact"
              placeholder="Enter SPG impact"
              value={formData.impact}
              onChange={handleChange}
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-btn">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
