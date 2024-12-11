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

  const handleOrthoMosaicImage = (): void => {
    navigate('/orthomoasicimage');
  };
  
  const handleprojectdescription = (): void => {
    navigate('/createsector');
  };
  
  return (
    <>
      <div className="sidebar-container">
        <h1 className="sidebar-title">Our Services</h1>
        <div className="service-box">
          <p>
            Area of Interest feature supports GeoJSON, KML, and zipped ESRI shapefiles. Upload files to visualize regions, generate KML, and download for use in GIS or mapping platforms.
          </p>
          <button onClick={handleAreaOfInterest}>Area of Interest</button>
        </div>
        <div className="service-box">
          <p>
           In this Panel i am create the " Create-Project sector " , and  Give "Create-Project-details " ,and "Fetch Project details " retrieves and displays project details with Fetched image.
          </p>
          <button onClick={handleprojectdescription}>Project Description Panel</button>
        </div>
        <div className="service-box">
          <img src="public/assets/download.png" alt="Sentinel Hub Logo" />
          <p>
            Sentinel Hub is a powerful tool used for Earth Observation data. It provides easy access to satellite imagery.
          </p>
          <button onClick={Sentinel}>Sentinel</button>
        </div>
        
        <div className="service-box">
          <p>
            An orthomosaic image is a high-resolution, geometrically corrected map created from multiple overlapping aerial or satellite images.
          </p>
          <button onClick={handleOrthoMosaicImage}>Orthomosaic Image</button>
        </div>
        
      </div>

      {/* Footer Section */}
      <footer className="footer-container">
        <div className="footer-content">
          <div className="footer-column">
            <h3>Latest News</h3>
            <ul>
              <li>
<<<<<<< HEAD
                <img src="assets/r3.jpg" alt="News 1" />
                <p>North Meets South!</p>
              </li>
              <li>
                <img src="assets/r2.jpg" alt="News 2" />
                <p>Our experience with Clean Cookstove projects</p>
              </li>
              <li>
                <img src="assets/hj.jpg" alt="News 3" />
=======
                <img src="/assets/r3.jpg" alt="News 1" />
                <p>North Meets South!</p>
              </li>
              <li>
                <img src="/assets/r2.jpg" alt="News 2" />
                <p>Our experience with Clean Cookstove projects</p>
              </li>
              <li>
                <img src="/assets/hj.jpg" alt="News 3" />
>>>>>>> 9ed5223e2c1d62e3bd3aa54de706e05c691ac68e
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
<<<<<<< HEAD
              <a href=""><img src="assets/dh.png" alt="Facebook" /></a>
              <a href="https://x.com/home"><img src="assets/dhg.png" alt="Twitter" /></a>
              <a href="https://www.facebook.com/p/FCF-India-100093362305578/?_rdr"><img src="assets/download.jpeg" alt="LinkedIn" /></a>
=======
              <a href=""><img src="/assets/dh.png" alt="Facebook" /></a>
              <a href="https://x.com/home"><img src="/assets/dhg.png" alt="Twitter" /></a>
              <a href="https://www.facebook.com/p/FCF-India-100093362305578/?_rdr"><img src="/assets/download.jpeg" alt="LinkedIn" /></a>
>>>>>>> 9ed5223e2c1d62e3bd3aa54de706e05c691ac68e
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Home;
