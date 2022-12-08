import React from 'react';
import Main from './pages/Main';
import {
  Route,
  Routes,
  BrowserRouter,
} from "react-router-dom";

const App = () => {
  return (
    <>
       <BrowserRouter>       
          <Routes>   
            <Route path="/" element={<Main />} />   
          </Routes>       
       </BrowserRouter>
    </>
  );
}

export default App;
