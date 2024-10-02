import { useState } from 'react';
import './Navbar.scss'
import { Link } from 'react-router-dom';
import { FaAlignJustify } from "react-icons/fa";

const Navbar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className='navbar'>
      <div className="navbar_left">
      <a className="navbar-brand" href="https://fitclimate.com/">
          <img src="./assets/new_logo.png" alt="" width="120" height="80" className="d-inline-block align-text-top" />
      </a>
      </div>
      <div className="navbar_right">
        <div className='right_group'>
        <a className="nav-link active" aria-current="page" href="https://dev.fitclimate.com/">Home</a>
        <a className="nav-link" href="https://dev.fitclimate.com/createimpact">Create Impact</a>
        <a className="nav-link" href="https://dev.fitclimate.com/about">About Us</a>
        <a className="nav-link" href="https://dev.fitclimate.com/contact" tabIndex={-1} aria-disabled="true">Contact Us</a>
        <a className="nav-link" href="https://fitclimate.com/logout/" tabIndex={-1} aria-disabled="true">Logout</a>
        </div>
      </div>
      <div className="navbar_right_mobile">
        <button>
          <FaAlignJustify className="icon" onClick={toggleDropdown} />
        </button>
        {isDropdownOpen &&
          <div className={`dropdown_content slide-in-right`}>
            <p><Link className='link' to='/'>Home</Link></p>
            <p><Link className='link' to='/createimpact'>Create Impact</Link></p>
            <p><Link className='link' to='/about'>About us</Link></p>
            <p><Link className='link' to='/contact'>Contact us</Link></p>
          </div>
        }
        {!isDropdownOpen &&
          <div className={`dropdown_content slide-out-right`}>
            <p><Link className='link' to='/'>Home</Link></p>
            <p><Link className='link' to='/createimpact'>Create Impact</Link></p>
            <p><Link className='link' to='/about'>About us</Link></p>
            <p><Link className='link' to='/contact'>Contact us</Link></p>
          </div>
        }
      </div>
    </div>
  )
}

export default Navbar
