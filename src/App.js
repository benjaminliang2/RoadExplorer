import { MapComponent } from "./map"
import { Navbar } from "./Navbar"
import { Home } from './home'


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "@mui/material";
import {theme} from './theme'
import { withCookies } from 'react-cookie'

function App() {

  return (<>
    <ThemeProvider theme={theme}>
      <Router>
        <Navbar />
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route path='/plan' element={<MapComponent />} />
        </Routes>
      </Router>
    </ThemeProvider>

  </>
  );
}

export default withCookies(App);
