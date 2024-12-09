import React from 'react';
import './Home.scss';
import { useNavigate } from 'react-router-dom';

const Sentinel = () => {
  window.location.href = 'https://sentnel-hub.netlify.app/';
};

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleAreaOfInterest = (): void => {
    navigate('/AreaOfinterest');
  };

  const handleSatellite = (): void => {
    navigate('/Satellite');
  };

  const handleOrthoMosaicImage = (): void => {
    navigate('/orthomoasicimage');
  };
  const handlecreatesector = (): void => {
    navigate('/createsector');
  };
  const handleCreateProject = (): void => {
    navigate('/CreateProject');
  };
  const handleFetchProject = (): void => {
    navigate('/FetchProject');
  };

  return (
    <>
      <div className="sidebar">
        <h1 className="h1">Our Services</h1>
        <div className="box">
          <p>
            Area of Interest feature supports GeoJSON, KML, and zipped ESRI shapefiles. Upload files to visualize regions, generate KML, and download for use in GIS or mapping platforms.
          </p>
          <button onClick={handleAreaOfInterest}>Area of Interest</button>
        </div>
        <div className="box">
          <p>
            Satellite/Sensor Selection refers to the process of choosing the most suitable satellite or sensor based on specific project requirements.
          </p>
          <button onClick={handleSatellite}>Satellite/Sensor Selection</button>
        </div>
        <div className="box">
          <p>
            An orthomosaic image is a high-resolution, geometrically corrected map created from multiple overlapping aerial or satellite images.
          </p>
          <button onClick={handleOrthoMosaicImage}>Orthomosaic Image</button>
        </div>
        <div className="box">
          <img src="public/assets/download.png" alt="Sentinel Hub Logo" />
          <p>
            Sentinel Hub is a powerful tool used for Earth Observation data. It provides easy access to satellite imagery.
          </p>
          <button onClick={Sentinel}>Sentinel</button>
        </div>
        <div className="box">
          <p>
            Create Sector" involves defining and organizing specific business or operational areas to streamline activities, improve focus, and drive growth.
          </p>
          <button onClick={handlecreatesector}>Create Sectors</button>
        </div>
        <div className="box">
          <p>
            "Create Project" involves planning, defining objectives, allocating resources, setting timelines, and executing tasks to achieve specific project goals efficiently.
          </p>
          <button onClick={handleCreateProject}>Create Project</button>
        </div>
        <div className="box">
          <p>
            Fetch Project retrieves and displays project details effortlessly.
          </p>
          <button onClick={handleFetchProject}>Fetch Project</button>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-section">
          <div className="footer-column">
            <h3>Latest News</h3>
            <ul>
              <li>
                <img src="assets/r3.jpg" alt="News 1" />
                <p>North Meets South!</p>
              </li>
              <li>
                <img src="assets/r2.jpg" alt="News 2" />
                <p>Our experience with Clean Cookstove projects</p>
              </li>
              <li>
                <img src="assets/hj.jpg" alt="News 3" />
                <p>Way to Neutrality</p>
              </li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="https://www.fcfindia.in/about-us/">About Us</a></li>
              <li><a href="https://www.fcfindia.in/career/">Career</a></li>
              <li><a href="https://www.fcfindia.in/contact-us/">Contact us</a></li>
              <li><a href="https://www.fcfindia.in/events/">Events</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Contact Us</h3>
            <p><a href="mailto:admin@fcindia.in">admin@fcindia.in</a></p>
            <address>
              B1/H3, NH-19, Block B, Mohan Cooperative Industrial Estate,<br />
              Industrial Area, New Delhi, 110044 (India)
            </address>
            <div className="social-icons">
              <a href=""><img src="assets/dh.png" alt="Facebook" /></a>
              <a href="https://x.com/home"><img src="assets/dhg.png" alt="Twitter" /></a>
              <a href="https://www.facebook.com/p/FCF-India-100093362305578/?_rdr"><img src="assets/download.jpeg" alt="LinkedIn" /></a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Home;
