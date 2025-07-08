import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import DishPage from './pages/DishPage.jsx';
import NavBar from './pages/Navbar';
import DishSuggester from './pages/DishSuggester';

function App() {
  return (
    <BrowserRouter>
    <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dish/:id" element={<DishPage />} />
         <Route path="/suggester" element={<DishSuggester />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
