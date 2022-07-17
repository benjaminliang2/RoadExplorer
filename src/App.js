import { MapComponent } from "./map"
import { Home } from './home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "@mui/material";
import {theme} from './theme'
import { withCookies } from 'react-cookie'

function App() {

  return (<>
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route path='/trip' element={<MapComponent />} />
        </Routes>
      </Router>
    </ThemeProvider>

  </>
  );
}

export default withCookies(App);
