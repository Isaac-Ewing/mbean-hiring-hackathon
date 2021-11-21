import './App.css';
import Whiteboard from './components/Whiteboard';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AppContextProvider } from './context/supaContext';
import LandingPage from './components/LandingPage.jsx';

function App() {
  return (
    <AppContextProvider>
        <Router>
          <Routes>
            <Route exact path='/' element={<Whiteboard />}>
            </Route>
            <Route exact path='/about' element={<LandingPage />}>
            </Route>
            <Route>Not found</Route>
          </Routes>
        </Router>
    </AppContextProvider>
  );
}

export default App;
