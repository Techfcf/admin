import React from 'react';

const DataVisualization: React.FC = () => {
  const fetchData = (type: string, element: HTMLSelectElement) => {
    // Fetch data based on the selected sector or project
  };

  const processSelection = (event: React.MouseEvent<HTMLButtonElement>, selectionType: string) => {
    // Handle the tab selection logic
  };

  const clearMap = () => {
    // Logic to clear the map
  };

  return (
    <div className="col-md-3 col-sm-12" style={{ paddingRight: '0px', paddingLeft: '0px' }}>
      <div className="form-div height_fix" style={{ background: 'linear-gradient(#5d5d5d, rgb(113, 135, 137))', color: 'white', padding: '0px' }}>
        <div className="tab mb-2" style={{ padding: '10px', margin: '0px', borderRadius: '0px', backgroundColor: '#2F474F' }}>
          <button className="tablinks2" style={{ width: '50%', borderRadius: '10px' }} onClick={(event) => processSelection(event, 'project')} id="project_desc_tab">
            Project Description
          </button>
          <button className="tablinks2 active" style={{ width: '50%', borderRadius: '10px' }} onClick={(event) => processSelection(event, 'draw')} id="data_visual_tab">
            Data Visualization
          </button>
        </div>

        <div className="accordion" id="project_tab" style={{ overflow: 'hidden auto', color: 'white', height: '90%', display: 'none' }}>
          <div className="row">
            <div className="col-md-12">
              <select id="sector_selector" className="form-select btn btn-primary mt-3" aria-label="Default select example" onChange={(e) => fetchData('projects', e.target)}>
                <option selected>Select Sector Type</option>
                <option value="1">Nature based Solutions (NbS)</option>
                <option value="2">Community based Projects</option>
              </select>

              <select id="project_selector" className="form-select btn btn-primary mt-3" aria-label="Default select example" onChange={(e) => fetchData('project_details', e.target)}>
                <option value="null">Select Projects</option>
              </select>
            </div>
            <div className="col-md-12">
              <div id="project_details_div" className="mt-5" style={{ border: '3px solid', borderRadius: '10px', fontSize: 'small', display: 'none' }}></div>
            </div>
          </div>
        </div>

        <div className="accordion" id="accordionExample" style={{ overflow: 'hidden auto', display: 'block', height: '86%', background: 'linear-gradient(rgb(93, 93, 93), rgb(113, 135, 137))', color: 'white' }}>
          {/* First Accordion/Step */}
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingOne">
              <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                <h5>1. Area of Interest</h5>
              </button>
            </h2>
            <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
              <div className="accordion-body">
                Provide an Area of Interest (AOI).
                <div className="tab" style={{ borderRadius: '20px', padding: '10px' }}>
                  <button className="tablinks1" style={{ width: '50%', borderRadius: '20px' }} onClick={(event) => processSelection(event, 'drawAOI')} id="defaultOpen">
                    Draw AOI
                  </button>
                  <button className="tablinks1 active" style={{ width: '50%', borderRadius: '20px' }} onClick={(event) => processSelection(event, 'uploadAOI')}>
                    Upload AOI
                  </button>
                </div>

                <div id="uploadAOI" className="tabcontent" style={{ display: 'block' }}>
                  <form action="/analytics/uploadShp" id="uploadAOIForm" encType="multipart/form-data" method="POST">
                    Upload File:<br />
                    Supported File Formats are:
                    <ul>
                      <li>GeoJSON</li>
                      <li>KML</li>
                      <li>ESRI Shapefile in Zipped Format</li>
                    </ul>
                    <input type="file" name="shape" id="shape" accept=".zip,.geojson,.kml" autoComplete="off" /><br />
                  </form>
                </div>

                <div id="drawAOI" className="tabcontent" style={{ display: 'none' }}>
                  <form action="/analytics/uploadPolygon" id="drawAOIForm" method="POST">
                    Draw polygon using tools from the map.<br />
                    <input type="text" id="drawnPolygon" name="aoi" style={{ display: 'none' }} />
                  </form>
                </div>

                <p className="alert" id="alert" style={{ color: 'black' }}></p>
              </div>
            </div>
          </div>

          {/* Second Accordion/Step */}
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingTwo">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                <h5>2. Satellite/Sensor Selection</h5>
              </button>
            </h2>
            <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
              <div className="accordion-body fix-height-collapse">
                <h5 className="form-title">Select Dataset</h5>
                <form method="post" className="fix-form-height" action="/get-image-collection" id="form-prds">
                  <label htmlFor="id_platforms">Platforms:</label>
                  <select name="platforms" className="form-control" id="id_platforms">
                    <option value="sentinel">Sentinel</option>
                  </select>

                  <label htmlFor="id_sensors">Sensors:</label>
                  <select name="sensors" className="form-control" id="id_sensors">
                    <option value="2">2</option>
                  </select>

                  <label htmlFor="id_products">Products:</label>
                  <select name="products" className="form-control" id="id_products">
                    <option value="surface">Sentinel-2 MSI</option>
                  </select>

                  <label htmlFor="id_reducer">Reducer:</label>
                  <select name="reducer" className="form-control" id="id_reducer">
                    <option value="mosaic">mosaic</option>
                    <option value="median">median</option>
                    <option value="mode">mode</option>
                    <option value="mean">mean</option>
                    <option value="min">min</option>
                    <option value="max">max</option>
                    <option value="sum">sum</option>
                    <option value="count">count</option>
                    <option value="product">product</option>
                  </select>

                  <br />
                  <label htmlFor="id_start_date">Start date:</label>
                  <input className="form-control" type="date" name="start_date" required id="id_start_date" min="2000-02-24" max="2024-09-21" /><br />
                  <label htmlFor="id_end_date">End date:</label>
                  <input className="form-control" type="date" name="end_date" required id="id_end_date" min="2000-02-24" max="2024-09-21" /><br />
                  <input type="submit" name="submit" className="btn btn-primary" id="load_map" value="Load Results" />
                </form>
              </div>
            </div>
          </div>

          {/* Third Accordion/Step */}
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingThree">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                <h5>3. Algorithm Selection</h5>
              </button>
            </h2>
            <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
              <div className="accordion-body">
                <form method="post" action="/get-result" id="form-result">
                  <input type="hidden" name="csrfmiddlewaretoken" value="your_csrf_token_here" />
                  <input className="form-control" type="text" id="uploaded_geometry" required name="uploaded_geometry" style={{ display: 'none' }} />
                  <div id="algorithm">
                    <label htmlFor="glacierProcess">Select an algorithm:</label>
                    <select className="form-control" id="glacierProcess" name="glacierProcess" form="form-result">
                      <option value="">-- Select Algorithm --</option>
                      <option value="NDVI">NDVI</option>
                    </select>
                  </div>
                  <br />
                  <input type="submit" name="submit" className="btn btn-primary" id="load_result" value="Compute" disabled style={{ background: 'radial-gradient(939px at 94.7% 50%, #5590a3 0%, rgb(163, 223, 220) 76.9%)' }} />
                </form>
                <button id="clear_map" className="btn" onClick={clearMap}>
                  Clear Results
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataVisualization;
