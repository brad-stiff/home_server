import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainNavigationBar } from "./components/MainNavigationBar";
import { HomePage } from './pages/HomePage';
import { CardsPage } from './pages/CardsPage';
import { MoviesPage } from "./pages/MoviesPage";
import { GamesPage } from "./pages/GamesPage";

function App() {
  return (
    <BrowserRouter>
      <MainNavigationBar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cards" element={<CardsPage />} />
        <Route path="/movies" element={<MoviesPage />} />
        <Route path="/games" element={<GamesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
