import Home from './pages/home';
import Dashboard from './pages/dashboard';
import Onboarding from './pages/onboarding';

// route between pages
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    // set up the path of pages
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <Home/> }/>
        <Route path="/dashboard" element={ <Dashboard/> }/>
        <Route path="/Onboarding" element={ <Onboarding/> }/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
