import React, { useState, useEffect } from "react";
import axios from "axios";
import { Alert, Button } from "react-bootstrap";
import Menu from "./Menu";
import Map from "./Map";
import Details from "./Details";

const HomeScreen = () => {
  const [json, setJson] = useState(null);
  const [data, setData] = useState(null);
  const [villageInfo, setVillageInfo] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const getData = (data) => {
    setJson(null);
    setVillageInfo(data);
    if (data !== null) {
      axios
        .get(`http://localhost:5000/parcelapi/${data[1]}/${data[0]}`)
        .then((response) => {
          if (!response.data) {
            throw new Error(
              "Empty response or response data is not valid JSON"
            );
          }
          setJson(response.data[0]);
          setData(response.data);
        })
        .catch((error) => {
          // Handle CORS error
          if (error.response && error.response.status === 403) {
            setErrorMessage(
              "Access to the resource is forbidden (CORS issue)."
            );
          } else {
            setErrorMessage("Incorrect SurveyNo.");
          }
          setShowAlert(true);
          console.error("Error fetching data:", error);
        });
    }
  };
  useEffect(() => {
    if (showAlert) {
      const timeout = setTimeout(() => {
        setShowAlert(false);
        window.location.reload();
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [showAlert]);

  const info = data;
  const clickHandler = async () => {
    try {
      axios.get(
        `http://localhost:5000/downloads/${villageInfo[1]}/${villageInfo[0]}`,
        { responseType: "arraybuffer" }
      );window.location.reload();
    } catch (error) {
        if (error.response && error.response.status === 403) {
            setErrorMessage(
              "Access to the resource is forbidden (CORS issue)."
            );
          } else {
            setErrorMessage("Internal Server Error.");
          }
          setShowAlert(true);
          console.error("Error fetching data:", error);
    }
  };
  return (
    <>
      {errorMessage && (
        <Alert className="alert" variant="danger">
          <div className="alert-content">{errorMessage}</div>
        </Alert>
      )}
      <Menu onSubmit={getData} />
      {info && <Details data={info} />}
      {json && (
        <>
          <Map data={json} />
          <div className="bbox">
            <Button onClick={clickHandler}>Download Image</Button>
          </div>
        </>
      )}
    </>
  );
};

export default HomeScreen;
