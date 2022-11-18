import React,{ useState} from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter ,Routes, Route, Link } from "react-router-dom";

import Login from "./components/Login";
import SignUp from "./components/SignUp";
import HomePage from "./components/HomePage";
import ForgotPassword from "./components/ForgotPassword";
import Profile from "./components/Profile";
import ContactPage from "./components/ContactPage";
import Error_ContactPage from "./components/Error_ContactPage";
import Error_ProfilePage from "./components/Error_ProfilePage";

function App() {
  return (
    <BrowserRouter>
            {/* to show one page ata atime we use routes it is replaced by routes */}
            <Routes>
              <Route exact path="/" element={<SignUp/>} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<SignUp />} />
              <Route path="/forgotPassword" element={<ForgotPassword />} />

              <Route path="/homePage" element={<HomePage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/errorContact" element={<Error_ContactPage/>}/>
              <Route path="/errorProfile" element={<Error_ProfilePage/>}/>
            </Routes>
        
    </BrowserRouter>
  );
}

export default App;
