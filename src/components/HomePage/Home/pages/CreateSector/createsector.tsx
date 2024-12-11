import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

import "./createsector.scss"; // Updated SCSS file name to match the new class name

const CreateSectorForm: React.FC = () => {
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Initialize the navigation hook


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "https://backend.fitclimate.com/api/projects/sector-type",
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
        setFormData({ name: "", description: "" });
        navigate("/CreateProject");
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
      setLoading(false);
    }
  };

  return (
    <div className="create-sector-form">
      <div className="create-sector-form__container">
        <h2>Create Sector</h2>
        <form onSubmit={handleSubmit}>
          <div className="create-sector-form__group">
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
          <div className="create-sector-form__group">
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
        {error && <p className="create-sector-form__error">{error}</p>}
      </div>
    </div>
  );
};

export default CreateSectorForm;
