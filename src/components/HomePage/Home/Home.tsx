import React, { useState } from "react";
import './Home.scss';
import './map.tsx';
const MyFormComponent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("project");
  const [collapseState, setCollapseState] = useState<string>("collapseOne");

  const TabSelection = (event: React.MouseEvent<HTMLButtonElement>, tabName: string) => {
    setActiveTab(tabName);
  };

  const processSelection = (event: React.MouseEvent<HTMLButtonElement>, process: string) => {
    // Implement process selection logic
  };

  const fetchData = (type: string, element: HTMLSelectElement) => {
    // Fetch data based on type (projects or project_details)
  };

  const clearMap = () => {
    // Implement clear map logic
  };

  const showLegend = () => {
    // Implement show legend logic
  };

  return (
    <div className="form-div height_fix" style={{ background: "linear-gradient(#5d5d5d,rgb(113, 135, 137))", color: "white", padding: "0px" }}>
      <div className="tab mb-2" style={{ padding: "10px", margin: "0px", borderRadius: "0px", backgroundColor: "#2F474F" }}>
        <button
          className={`tablinks2 ${activeTab === "project" ? "active" : ""}`}
          style={{ width: "50%", borderRadius: "10px" }}
          onClick={(e) => TabSelection(e, "project")}
          id="project_desc_tab"
        >
          Project Description
        </button>
        <button
          className={`tablinks2 ${activeTab === "draw" ? "active" : ""}`}
          style={{ width: "50%", borderRadius: "10px" }}
          onClick={(e) => TabSelection(e, "draw")}
          id="data_visual_tab"
        >
          Data Visualization
        </button>
      </div>

      {/* Project Tab */}
      {activeTab === "project" && (
        <div className="accordion" id="project_tab" style={{ color: "white", overflowY: "auto", height: "90%" }}>
          <div className="row">
            <div className="col-md-12">
              <select
                id="sector_selector"
                className="form-select btn btn-primary mt-3"
                onChange={(e) => fetchData("projects", e.target)}
                style={{ width: "100%", background: "#4bb9b4", height: "50px" }}
              >
                <option value="">Select Sector Type</option>
                <option value="1">Nature based Solutions (NbS)</option>
                <option value="2">Community based Projects</option>
              </select>

              <select
                id="project_selector"
                className="form-select btn btn-primary mt-3"
                style={{ width: "100%", background: "#4bb9b4", height: "50px" }}
                onChange={(e) => fetchData("project_details", e.target)}
              >
                <option value="">Select Projects</option>
              </select>
            </div>
            <div className="col-md-12">
              <div id="project_details_div" className="mt-5" style={{ border: "3px solid", borderRadius: "10px", fontSize: "small", display: "none" }}>
                {/* Project details will be displayed here */}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Accordion */}
      {activeTab === "draw" && (
        <div className="accordion" id="accordionExample" style={{ overflowY: "auto", height: "86%", background: "linear-gradient(#5d5d5d,rgb(113, 135, 137))", color: "white" }}>
          {/* First Accordion/Step */}
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingOne">
              <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                <h5>1. Area of Interest</h5>
              </button>
            </h2>
            <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
              <div className="accordion-body">
                <p>Provide an Area of Interest (AOI).</p>
                <div className="tab" style={{ borderRadius: "20px", padding: "10px" }}>
                  <button className="tablinks1 active" style={{ width: "50%", borderRadius: "20px" }} onClick={(e) => processSelection(e, "drawAOI")} id="defaultOpen">
                    Draw AOI
                  </button>
                  <button className="tablinks1" style={{ width: "50%", borderRadius: "20px" }} onClick={(e) => processSelection(e, "uploadAOI")}>
                    Upload AOI
                  </button>
                </div>

                {/* Upload AOI */}
                <div id="uploadAOI" className="tabcontent" style={{ display: "none" }}>
                  <form action="/analytics/uploadShp" id="uploadAOIForm" encType="multipart/form-data" method="POST">
                    <p>Upload File:</p>
                    <ul>
                      <li>GeoJSON</li>
                      <li>KML</li>
                      <li>ESRI Shapefile in Zipped Format</li>
                    </ul>
                    <input type="file" name="shape" id="shape" accept=".zip,.geojson,.kml" />
                  </form>
                </div>

                {/* Draw AOI */}
                <div id="drawAOI" className="tabcontent" style={{ display: "block" }}>
                  <form action="/analytics/uploadPolygon" id="drawAOIForm" method="POST">
                    Draw polygon using tools from the map.
                    <input type="text" id="drawnPolygon" name="aoi" style={{ display: "none" }} />
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Additional accordion steps can be implemented similarly */}
        </div>
      )}

      {/* Map Container */}
      <div className="map-div height_fix leaflet-container leaflet-fade-anim leaflet-grab leaflet-touch-drag" id="map-div" tabIndex={0} style={{ position: 'relative', outline: 'none' }}>
        {/* Legend Button */}
        <button type="button" className="btn btn-info" id="legendButton" onClick={showLegend}>
          Legend &nbsp;
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path>
            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"></path>
          </svg>
        </button>
        {/* Legend DIV */}
        <div id="myDIV">
          <img src="/static/ndvi.png" height="90" alt="NDVI Legend" />
        </div>
        <div className="leaflet-pane leaflet-map-pane" style={{ transform: 'translate3d(-198px, -19px, 0px)' }}>
          <div className="leaflet-pane leaflet-tile-pane">
            <div className="leaflet-layer" style={{ zIndex: 1, opacity: 1 }}>
              <div className="leaflet-tile-container leaflet-zoom-animated" style={{ zIndex: 19, transform: 'translate3d(0px, 0px, 0px) scale(0.5)' }}></div>
              <div className="leaflet-tile-container leaflet-zoom-animated" style={{ zIndex: 20, transform: 'translate3d(273px, 88px, 0px) scale(1)' }}>
                <img alt="" role="presentation" src="http://mt1.google">
                </img>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};     
                
export default  MyFormComponent;
