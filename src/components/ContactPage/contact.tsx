
import './contact.scss';
import { Fade } from "react-awesome-reveal";

const Contact = () => {

  const CreateMap = () => {
    return (
      <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3505.75749207874!2d77.29239080950224!3d28.516943089221833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce6b633089d77%3A0xb8ef1376fb5be455!2sB1%2FH3%2C%20NH-19%2C%20Block%20B%2C%20Mohan%20Cooperative%20Industrial%20Estate%2C%20INDUSTRIAL%20AREA%2C%20New%20Delhi%2C%20Delhi%20110044%2C%20India!5e0!3m2!1sen!2sus!4v1724692898110!5m2!1sen!2sus"
      width="100%"
      height="400px"
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    >
    </iframe>
    )
  }

  return (
    <div className="image-wrapper">
      <div className="map-section">
        <Fade>
          {CreateMap()}
        </Fade>
      </div>
      <div className="info-section">
        <Fade>
          <div className="address">
            <h4>Address:</h4>
            <p>B1/H3, Mohan Cooperative Industrial Estate, New Delhi Delhi - 110 044 (India)</p>
          </div>
          <hr />
          <div className="email">
            <h4>E-mail:</h4>
            <p>admin@fcfindia.in</p>
          </div>
          <hr />
          <div className="phone">
            <h4>Phone:</h4>
            <p>+91 95600 18494</p>
          </div>
        </Fade>
      </div>
    </div>
  )
}

export default Contact
