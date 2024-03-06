import React from "react";
import Header from "./Components/Header";
import { Container } from "react-bootstrap";
import Footer from "./Components/Footer";
import "./assests/App.css";
import { Outlet } from "react-router-dom";

const App = () => {
 
  return (
    <>
      <Header/>
      <main className="py-3">
    
        <Container>
       <Outlet />
        </Container>
      </main>
      <Footer />
    </>
  );
};

export default App;
