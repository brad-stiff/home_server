import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainNavigationBar } from "./components/MainNavigationBar/MainNavigationBar";
import { HomePage } from './pages/HomePage/HomePage';
import { CardsPage } from './pages/CardsPage/CardsPage';
import { MoviesPage } from "./pages/MoviesPage/MoviesPage";
import { GamesPage } from "./pages/GamesPage/GamesPage";

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
