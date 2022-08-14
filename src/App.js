import { MapComponent } from "./components/TripPage/map"
import { Home } from './components/HomePage/home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "@mui/material";
import {theme} from './styles/theme'
import { withCookies } from 'react-cookie'

function App() {

  return (<>
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route exact path='/trip' element={<MapComponent key='null'/>} />
          <Route path='/trip/:tripId' element={<MapComponent key='custom'/>} />
        </Routes>
      </Router>
    </ThemeProvider>

  </>
  );
}

export default withCookies(App);
