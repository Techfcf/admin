import './App.scss'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import HomePage from './HomePage';
import CreateImpactPage from './CreateImpactPage';
import AboutUsPage from './AboutUsPage';
import ContactPage from './Contact';
import Logout from './LogoutPage';

const App = () => {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path ="/createimpact" element={<CreateImpactPage />}/>
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/Logout" element={<Logout />} />
        
      </Routes>
    </Router>
  )
}

export default App
