import React from 'react';
import Home from './pages/home';
import Dashboard from './pages/dashboard';
import Onboarding from './pages/onboarding';
import Resetpassword from './pages/resetpassword';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const App = () => {
  const [cookies] = useCookies(['user']);

  const authToken = cookies.AuthToken;

  return (
    // set up the path of pages
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <Home/> } />
        { authToken && <Route path="/dashboard" element={ <Dashboard/> } /> }
        { authToken && <Route path="/onboarding" element={ <Onboarding/> } /> }
        { authToken && <Route path="/resetpassword" element={ <Resetpassword/> } /> }
      </Routes>
    </BrowserRouter>
  );
}

export default App;
