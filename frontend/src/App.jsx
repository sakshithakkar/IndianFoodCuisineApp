import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home.jsx';
import DishPage from './pages/DishPage.jsx';
import NavBar from './pages/Navbar';
import DishSuggester from './pages/DishSuggester';
import Login from './pages/Login.jsx';
import AddDish from './pages/AddDish.jsx';
import PrivateRoute from './PrivateRoute.jsx';
import Register from './pages/Register.jsx';
import { loadTheme } from '@fluentui/react';
import { initializeIcons } from '@fluentui/react';

function App() {
  const location = useLocation();
  const hideHeaderOn = ['/login', '/register'];

  const showHeader = !hideHeaderOn.includes(location.pathname);


  loadTheme({
    defaultFontStyle: {
      fontSize: '18px',
    },
  });

  initializeIcons();


  return (
    <>
      {showHeader && <NavBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dish/:id" element={<DishPage />} />
        <Route path="/suggester" element={<DishSuggester />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/add-dish" element={
          <PrivateRoute>
            <AddDish />
          </PrivateRoute>
        } />
      </Routes>
    </>
  );
}

export default App;
