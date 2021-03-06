import './App.css';
import Whiteboard from './components/Whiteboard.jsx';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AppContextProvider } from './context/supaContext';
import LandingPage from './components/LandingPage.jsx';

function App() {
  return (
    <AppContextProvider>
        <Router>
          <Routes>
            <Route exact path='/' element={<LandingPage />}>
            </Route>
            <Route exact path='/paint' element={<Whiteboard />}>
            </Route>
            <Route>Not found</Route>
          </Routes>
        </Router>
    </AppContextProvider>
  );
}

export default App;
