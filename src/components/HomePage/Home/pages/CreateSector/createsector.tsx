import React, { useState } from "react";
import axios from "axios";
import "./createsector.scss";

const SectorForm: React.FC = () => {
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false); // Track loading state
  const [error, setError] = useState<string | null>(null); // Track error message

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Start loading
    setError(null); // Clear previous errors

    try {
      const response = await axios.post(
        'https://backend.fitclimate.com/api/projects/sector-type',
        {
          sectorName: formData.name,
          sectorDesc: formData.description,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200 || response.status === 201) {
        alert("Sector created successfully!");
        console.log("Created sector:", response.data);

        // Reset the form
        setFormData({ name: "", description: "" });
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error: any) {
      console.error("Error creating sector:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "An unknown error occurred"
      );
      alert(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="sidebar">
      <div className="form-container">
        <h2>Create Sector</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Sector Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter sector name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Enter sector description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default SectorForm;