import React from 'react';

const MapComponent: React.FC = () => {
  const showLegend = () => {
    // Define the function to show legend
  };

  return (
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
              <img alt="" role="presentation" src="http://mt1.google.com/vt/lyrs=s&amp;x=11&amp;y=6&amp;z=4" className="leaflet-tile leaflet-tile-loaded" style={{ width: '256px', height: '256px', transform: 'translate3d(100px, -70px, 0px)', opacity: 1 }} />
              {/* Repeat for other tiles */}
            </div>
          </div>
        </div>
        {/* Other leaflet panes */}
        <div className="leaflet-control-container">
          <div className="leaflet-top leaflet-left">
            <div className="leaflet-control-zoom leaflet-bar leaflet-control">
              <a className="leaflet-control-zoom-in" href="#" title="Zoom in" role="button" aria-label="Zoom in">+</a>
              <a className="leaflet-control-zoom-out leaflet-disabled" href="#" title="Zoom out" role="button" aria-label="Zoom out">−</a>
            </div>
            <div className="leaflet-draw leaflet-control">
              <div className="leaflet-draw-section">
                <div className="leaflet-draw-toolbar leaflet-bar leaflet-draw-toolbar-top">
                  <a className="leaflet-draw-draw-polygon" href="#" title="Draw a polygon">
                    <span className="sr-only">Draw a polygon</span>
                  </a>
                  <a className="leaflet-draw-draw-rectangle" href="#" title="Draw a rectangle">
                    <span className="sr-only">Draw a rectangle</span>
                  </a>
                </div>
                <ul className="leaflet-draw-actions"></ul>
              </div>
              <div className="leaflet-draw-section">
                <div className="leaflet-draw-toolbar leaflet-bar">
                  <a className="leaflet-draw-edit-edit leaflet-disabled" href="#" title="No layers to edit">
                    <span className="sr-only">Edit layers</span>
                  </a>
                  <a className="leaflet-draw-edit-remove leaflet-disabled" href="#" title="No layers to delete">
                    <span className="sr-only">Delete layers</span>
                  </a>
                </div>
                <ul className="leaflet-draw-actions"></ul>
              </div>
            </div>
          </div>
          <div className="leaflet-top leaflet-right">
            <div className="leaflet-control-layers leaflet-control-layers-expanded leaflet-control" aria-haspopup="true">
              <a className="leaflet-control-layers-toggle" href="#" title="Layers"></a>
              <section className="leaflet-control-layers-list">
                <div className="leaflet-control-layers-base">
                  <label>
                    <div>
                      <input type="radio" className="leaflet-control-layers-selector" name="leaflet-base-layers_63" checked />
                      <span> Google Satellite</span>
                    </div>
                  </label>
                  <label>
                    <div>
                      <input type="radio" className="leaflet-control-layers-selector" name="leaflet-base-layers_63" />
                      <span> Open StreetMap</span>
                    </div>
                  </label>
                </div>
                <div className="leaflet-control-layers-separator"></div>
                <div className="leaflet-control-layers-overlays">
                  <label>
                    <div>
                      <input type="checkbox" className="leaflet-control-layers-selector" defaultChecked />
                      <span> AOI</span>
                    </div>
                  </label>
                  <label>
                    <div>
                      <input type="checkbox" className="leaflet-control-layers-selector" />
                      <span> VIIRS Suomi NPP 24hrs fires/hotspots</span>
                    </div>
                  </label>
                </div>
              </section>
            </div>
          </div>
          <div className="leaflet-bottom leaflet-left">
            <div className="leaflet-control-scale leaflet-control">
              <div className="leaflet-control-scale-line" style={{ width: '55px' }}>500 km</div>
              <div className="leaflet-control-scale-line" style={{ width: '89px' }}>500 mi</div>
            </div>
          </div>
          <div className="leaflet-bottom leaflet-right">
            <div className="leaflet-control-attribution leaflet-control">
              <a href="https://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
