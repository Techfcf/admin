import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./createsector.scss";

const CreateSectorForm: React.FC = () => {
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [formErrors, setFormErrors] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate the specific field on change
    validateField(name, value);
  };

  const validateField = (name: string, value: string) => {
    let error = "";

    if (name === "name") {
      if (!value.trim()) {
        error = "Sector name is required.";
      } else if (value.length < 3) {
        error = "Sector name must be at least 3 characters long.";
      }
    } else if (name === "description") {
      if (!value.trim()) {
        error = "Description is required.";
      } else if (value.length < 10) {
        error = "Description must be at least 10 characters long.";
      }
    }

    setFormErrors({ ...formErrors, [name]: error });
  };

  const validateForm = () => {
    const errors = { name: "", description: "" };
    let isValid = true;

    if (!formData.name.trim() || formData.name.length < 3) {
      errors.name = "Sector name must be at least 3 characters long.";
      isValid = false;
    }

    if (!formData.description.trim() || formData.description.length < 10) {
      errors.description = "Description must be at least 10 characters long.";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

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

  const navigateCreateProject = () => {
    navigate("/CreateProject");
  };
  const navigateFetchproject = () => {
    navigate("/FetchProject");
  };

  return (
    <div className="create-sector-form">
      <button className="button-container" onClick={navigateCreateProject}>
        Go to CreateProject
      </button>
      <button className="Fetch-button" onClick={navigateFetchproject}>
        Go to Fetchproject
      </button>
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
            {formErrors.name && (
              <p className="create-sector-form__error">{formErrors.name}</p>
            )}
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
            {formErrors.description && (
              <p className="create-sector-form__error">{formErrors.description}</p>
            )}
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
