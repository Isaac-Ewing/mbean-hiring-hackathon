import './App.css';
import Whiteboard from './components/Whiteboard';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AppContextProvider } from './context/supaContext';

function App() {
  return (
    <AppContextProvider>
        <Router>
          <Routes>
            <Route exact path='/' element={<Whiteboard />}>
            </Route>
            <Route>Not found</Route>
          </Routes>
        </Router>
    </AppContextProvider>
  );
}

export default App;
