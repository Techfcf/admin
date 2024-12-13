import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CreateProject.scss";
import { useNavigate } from "react-router-dom";

const CreateProject: React.FC = () => {
  const [formData, setFormData] = useState<{
    name: string;
    sectorId: number;
    kmlFile: File | null;
    projectDesc: string;
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
  const [formErrors, setFormErrors] = useState<{
    name: string;
    projectDesc: string;
    area: string;
    status: string;
    impact: string;
    kmlFile: string;
    sectorId: string;
  }>({
    name: "",
    projectDesc: "",
    area: "",
    status: "",
    impact: "",
    kmlFile: "",
    sectorId: "",
  });

  const navigate = useNavigate();

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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" }); // Clear error on change
  };

  // Handle file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, kmlFile: e.target.files[0] });
      setFormErrors({ ...formErrors, kmlFile: "" }); // Clear error on file selection
    }
  };

  // Validation function
  const validate = () => {
    const errors: any = {};

    // Name validation (must be non-empty)
    if (!formData.name.trim()) {
      errors.name = "Project name is required";
    }

    // Sector validation
    if (!formData.sectorId) {
      errors.sectorId = "Please select a sector";
    }

    // Project description validation (required)
    if (!formData.projectDesc.trim()) {
      errors.projectDesc = "Project description is required";
    }

    // Area validation (must be a number and greater than 0)
    if (!formData.area || formData.area <= 0) {
      errors.area = "Please enter a valid project area";
    }

    // Status validation (optional, but can add custom validation)
    if (!formData.status.trim()) {
      errors.status = "Project status is required";
    }

    // Impact validation (optional)
    if (!formData.impact.trim()) {
      errors.impact = "SPG impact is required";
    }

    // KML File validation (required)
    if (!formData.kmlFile) {
      errors.kmlFile = "Please upload a KML file";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!validate()) {
      return; // Don't submit if validation fails
    }

    try {
      const submissionData = new FormData();

      if (formData.kmlFile) {
        submissionData.append("file", formData.kmlFile);
      } else {
        alert("Please upload a KML file.");
        return;
      }

      const projectData = {
        name: formData.name,
        area: formData.area,
        status: formData.status,
        impact: formData.impact,
        sectorId: formData.sectorId,
        projectDesc: formData.projectDesc,
        startDate: formData.startDate || null,
      };

      submissionData.append("project", JSON.stringify(projectData));

      const response = await axios.post(
        "https://backend.fitclimate.com/api/projects/create-project",
        submissionData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Project created successfully!");
      navigate("/FetchProject");
    } catch (err) {
      console.error("Error:", err);
      alert("An error occurred while submitting the project.");
    }
  };

  return (
    <div className="create-project-sidebar">
      <div className="create-project-form-container">
        <h2>Create Project</h2>
        <form onSubmit={handleSubmit}>
          {/* Sector Type */}
          <div className="create-project-form-group">
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
            {formErrors.sectorId && <p className="error-message">{formErrors.sectorId}</p>}
          </div>

          {/* Project Name */}
          <div className="create-project-form-group">
            <label htmlFor="name">Project Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter project name"
              value={formData.name}
              onChange={handleChange}
            />
            {formErrors.name && <p className="error-message">{formErrors.name}</p>}
          </div>

          {/* File Upload */}
          <div className="create-project-form-group">
            <label htmlFor="kmlFile">Upload KML File</label>
            <input
              type="file"
              id="kmlFile"
              name="kmlFile"
              accept=".kml"
              onChange={handleFileChange}
              required
            />
            {formErrors.kmlFile && <p className="error-message">{formErrors.kmlFile}</p>}
          </div>

          {/* Project Description */}
          <div className="create-project-form-group">
            <label htmlFor="projectDesc">Project Description</label>
            <textarea
              name="projectDesc"
              id="projectDesc"
              placeholder="Enter project description"
              value={formData.projectDesc}
              onChange={handleChange}
              required
            />
            {formErrors.projectDesc && <p className="error-message">{formErrors.projectDesc}</p>}
          </div>

          {/* Project Area */}
          <div className="create-project-form-group">
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
            {formErrors.area && <p className="error-message">{formErrors.area}</p>}
          </div>

          {/* Start Date */}
          <div className="create-project-form-group">
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
          <div className="create-project-form-group">
            <label htmlFor="status">Project Status</label>
            <input
              type="text"
              id="status"
              name="status"
              placeholder="Enter project status"
              value={formData.status}
              onChange={handleChange}
            />
            {formErrors.status && <p className="error-message">{formErrors.status}</p>}
          </div>

          {/* SPG Impact */}
          <div className="create-project-form-group">
            <label htmlFor="impact">SPG Impact</label>
            <input
              type="text"
              id="impact"
              name="impact"
              placeholder="Enter SPG impact"
              value={formData.impact}
              onChange={handleChange}
            />
            {formErrors.impact && <p className="error-message">{formErrors.impact}</p>}
          </div>

          {/* Submit Button */}
          <button type="submit" className="create-project-submit-btn">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
