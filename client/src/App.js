import Home from './pages/home';
import Dashboard from './pages/dashboard';
import Onboarding from './pages/onboarding';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const App = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['user']);

  const cookieToken = cookies.CookieToken;

  return (
    // set up the path of pages
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {cookieToken && <Route path="/dashboard" element={<Dashboard />} />}
        {cookieToken && <Route path="/onboarding" element={<Onboarding />} />}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
