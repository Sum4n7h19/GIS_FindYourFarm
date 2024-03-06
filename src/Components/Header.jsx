import React from "react";
import { Navbar} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap"; 


const Header = () => {
  return (
    <Navbar className="header">
      <LinkContainer to="/" className="link-container">
      <Navbar.Brand>Find Your Farm</Navbar.Brand>
      </LinkContainer>
    </Navbar>
  );
};

export default Header;
