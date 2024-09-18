import './aboutUs.scss'

import { Fade, Bounce } from "react-awesome-reveal";

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <div className="header">
        <Bounce>
          <img src='/assets/about.png' alt="About Us Header" />
        </Bounce>
      </div>

      <div className="content">
        <Fade>
          <p>
          FCF India is leading global efforts to deliver climate solutions to be FAIR INCLUSIVE AND TRANSPARENT. We partner with all stakeholders from small holder farmer communities to world's leading businesses to deliver high quality carbon projects that focuses on impact.<br />
        Driven by passion and commitment we are a team with high expertise in carbon markets. We are equipped with the knowledge and understanding of ground realities of small holder farmers across Asia and Africa. We believe in the strength and resilience of our planet and in human beings.
          </p>
        </Fade>
      </div>

      <div className="image-grid">
        <div className="grid-item">
          <Fade className='fade'>
            <div className="hover-zoom">
              <img src='/assets/se1.png' alt="Zoomed Image" />
              <div className="overlay"></div>
              
            </div>
          </Fade>
        </div>
        <div className="grid-item">
          <Fade className='fade'>
            <div className="hover-zoom">
              <img src='/assets/se2.png' alt="Zoomed Image" />
              <div className="overlay"></div>
              
            </div>
          </Fade>
        </div>
        <div className="grid-item">
          <Fade className='fade'>
            <div className="hover-zoom">
              <img src='/assets/se3.png' alt="Zoomed Image" />
              <div className="overlay"></div>
            </div>
          </Fade>
        </div>
      </div>
    </div>
  )
}

export default AboutUs
