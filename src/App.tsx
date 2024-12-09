import './App.scss';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import HomePage from './HomePage';
import AboutUsPage from './AboutUsPage';
import ContactPage from './Contact';
import Logout from './LogoutPage';
import MainComponent from './components/HomePage/Home/pages/AreaOfinterest/AreaOfinterest';
import SectorForm from './components/HomePage/Home/pages/CreateSector/createsector';
import OrthoMosaicImage from './components/HomePage/Home/pages/orthomoasicimage/orthomoasicimage';
import CreateProject from './components/HomePage/Home/pages/CreateProject/CreateProject';
import FetchProject from './components/HomePage/Home/pages/FetchProject/FetchProject';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/Logout" element={<Logout />} />
        <Route path="/AreaOfinterest" element={<MainComponent />} />
        <Route path="/createsector" element={<SectorForm />} />
        <Route path="/CreateProject" element={<CreateProject />} />
        <Route path="/orthomoasicimage" element={<OrthoMosaicImage />} />
        <Route path="/FetchProject" element={<FetchProject />} />
      </Routes>
    </Router>
  );
};

export default App;
