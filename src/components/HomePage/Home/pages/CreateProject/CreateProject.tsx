import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CreateProject.scss";

const CreateProject: React.FC = () => {
  const [formData, setFormData] = useState<{
    name: string;
    sectorType: string;
    kmlFile: File | null;
    projectDescription: string;
    projectArea: number;
    startDate: string;
    projectStatus: string;
    spgImpact: string;
  }>({
    name: "",
    sectorType: "",
    kmlFile: null,
    projectDescription: "",
    projectArea: 0,
    startDate: "",
    projectStatus: "",
    spgImpact: "",
  });

  const [sectors, setSectors] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSectors = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://backend.fitclimate.com/api/projects/fetch-all-sectors"
        );

        if (response.data) {
          const parsedSectors = response.data.map((sector: any) => ({
            id: sector.id,
            name: sector.sectorName || "Unnamed Sector",
          }));
          setSectors(parsedSectors);
        } else {
          setSectors([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchSectors();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, kmlFile: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Create a FormData instance
      const submissionData = new FormData();

      // Append the KML file to the form data
      if (formData.kmlFile) {
        submissionData.append("file", formData.kmlFile);
      } else {
        alert("Please upload a KML file.");
        return;
      }

      // Append the project details as JSON string
      const projectData = {
        name: formData.name,
        area: formData.projectArea,
        status: formData.projectStatus,
        impact: formData.spgImpact,
        sectorId: sectors.find((sector) => sector.name === formData.sectorType)?.id, // Match sectorType to sectorId
        projectDesc: formData.projectDescription,
        startDate: formData.startDate,
      };

      submissionData.append("project", JSON.stringify(projectData));

      // Send the POST request using axios
      const response = await axios.post(
        "https://backend.fitclimate.com/api/projects/create-project",
        submissionData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Handle success
      alert("Project created successfully!");
      console.log("Response:", response.data);
    } catch (err) {
      console.error("Error submitting the form:", err);
      alert("Failed to submit the form. Please try again.");
    }
  };

  return (
    <div className="sidebar">
      <div className="form-con">
        <h2>Create Project</h2>
        <form onSubmit={handleSubmit}>
          {/* Sector Type */}
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
              {loading && <option>Loading sectors...</option>}
              {!loading && sectors.length > 0 ? (
                sectors.map((sector) => (
                  <option key={sector.id} value={sector.name}>
                    {sector.name}
                  </option>
                ))
              ) : (
                <option>No sectors available</option>
              )}
            </select>
            {error && <p className="error-message">{error}</p>}
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
            <label htmlFor="projectDescription">Project Description</label>
            <textarea
              name="projectDescription"
              id="projectDescription"
              placeholder="Enter project description"
              value={formData.projectDescription}
              onChange={handleChange}
              required
            />
          </div>

          {/* Project Area */}
          <div className="form-group">
            <label htmlFor="projectArea">Project Area (in sq km)</label>
            <input
              type="number"
              id="projectArea"
              name="projectArea"
              placeholder="Enter project area"
              value={formData.projectArea}
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
              required
            />
          </div>

          {/* Project Status */}
          <div className="form-group">
            <label htmlFor="projectStatus">Project Status</label>
            <input
              type="text"
              id="projectStatus"
              name="projectStatus"
              placeholder="Enter project status"
              value={formData.projectStatus}
              onChange={handleChange}
              required
            />
          </div>

          {/* SPG Impact */}
          <div className="form-group">
            <label htmlFor="spgImpact">SPG Impact</label>
            <input
              type="text"
              id="spgImpact"
              name="spgImpact"
              placeholder="Enter SPG impact"
              value={formData.spgImpact}
              onChange={handleChange}
              required
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
