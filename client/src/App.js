import Home from './pages/home';
import Dashboard from './pages/dashboard';
import Onboarding from './pages/onboarding';
import Welcome from './pages/welcome';

// route between pages
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    // set up the path of pages
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <Home/> }/>
        <Route path="/dashboard" element={ <Dashboard/> }/>
        <Route path="/onboarding" element={ <Onboarding/> }/>
        <Route path="/welcome" element={ <Welcome/> }/>
        {/* <Route path="/confirm/:confirmCode" element={ <Welcome/> } /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
