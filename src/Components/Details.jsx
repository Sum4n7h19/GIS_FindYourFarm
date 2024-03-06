import React from "react";
import { Button } from "react-bootstrap";

const Details = ({ data }) => {
  const Link = data[1];
  const tempArea = data[2];
  const tempPerimeter = data[3];
  const area = tempArea;
  const perimeter = tempPerimeter;
  return (
    <div className="container-menu">
      <div className="bbox">
        <h4>API</h4>
        <a href={Link}>{Link}</a>
        <br />
        <br />
        <h3>Details</h3>
        <br />
        <h4>Area: {area} Acres</h4>
        <br />
        <h4>Perimeter: {perimeter} Km</h4>
        <br />
      </div>
    </div>
  );
};

export default Details;
