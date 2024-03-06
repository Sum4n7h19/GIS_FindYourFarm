import React, { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  Button,
} from "react-bootstrap";
import axios from "axios";
import Select from "react-dropdown-select";
import "../assests/App.css";

const Menu = (props) => {
  const [parcels, setParcels] = useState([]);
  const [parcelNo, setParcelNo] = useState();
  const [selectState, setSelectState] = useState(null);
  const [selectDistrict, setSelectDistrict] = useState(null);
  const [selectTaluk, setSelectTaluk] = useState(null);
  const [selectHobli, setSelectHobli] = useState(null);
  const [selectVillage, setSelectVillage] = useState(null);
  useEffect(() => {
    // Fetch all parcels using Axios
    axios
      .get("http://127.0.0.1:5000/parcel")
      .then((response) => {
        if (!response.data) {
          throw new Error("Empty response or response data is not valid JSON");
        }
        setParcels(response.data);
      })
      .catch((error) => console.error("Error fetching parcels:", error));
  }, []);
  const State = [
    ...new Map(
      parcels.map((parcel) => [parcel.KGISStateName, parcel])
    ).values(),
  ];
  const District = [
    ...new Map(
      parcels.map((parcel) => [parcel.KGISDistrictName, parcel])
    ).values(),
  ];
  const Taluk = [
    ...new Map(parcels.map((parcel) => [parcel.KGISTalukID, parcel])).values(),
  ];
  const Hobli = [
    ...new Map(parcels.map((parcel) => [parcel.KGISHobliID, parcel])).values(),
  ];
  const Village = [
    ...new Map(
      parcels.map((parcel) => [parcel.KGISVillageID, parcel])
    ).values(),
  ];
  const filterTaluk = Taluk.filter((taluk) => {
    return selectDistrict !== null ? taluk.KGISDistrictID === selectDistrict[0].value : true
  }
  )
  const filterHobli = Hobli.filter((hobli) => {
    return selectTaluk !== null ? hobli.KGISTalukID === selectTaluk[0].value : true
  }
  )
  const filterVillage = Village.filter((village) => {
    return selectHobli !== null ? village.KGISHobliID === selectHobli[0].value : true
  }
  )
  const stateName = State.map((parcel) => ({
    value: parcel.KGISStateID,
    label: `${parcel.KGISStateName}`,
  }));
  const distName = District.map((parcel) => ({
    value: parcel.KGISDistrictID,
    label: `${parcel.KGISDistrictName}`,
  }));
  const talukName = filterTaluk.map((parcel) => ({
    value: parcel.KGISTalukID,
    label: `${parcel.KGISTalukName}`,
  }));
  const hobliName = filterHobli.map((parcel) => ({
    value: parcel.KGISHobliID,
    label: parcel.KGISHobliName,
  }));
  const villageName = filterVillage.map((parcel) => ({
    value: parcel.KGISVillageID,
    label: parcel.KGISVillageName,
  }));
  const changeHandler = (e) => {
    setSelectVillage(e);
  };
  const submitHandler = (event) => {
    event.preventDefault();
    const villageId = selectVillage[0].value;
    const villageName = selectVillage[0].label;
    const data = [parcelNo, villageId, villageName];
    props.onSubmit(data);

    setSelectState(null);
    setSelectDistrict(null);
    setSelectTaluk(null);
    setSelectHobli(null);
    setSelectVillage(null);
    setParcelNo("");
  };

  return (
    <div className="menu">
      <div className="container-menu">
        <h1>Select the Farm</h1>
        <label htmlFor="parcelDropdown">Select Parcel:</label>
        <Select
          className="select"
          id="parcelDropdown"
          options={stateName}
          value={selectState}
          onChange={(e) => setSelectState(e)}
          placeholder="Select State"
        />
        <Select
          className="select"
          id="distName"
          options={distName}
          value={selectDistrict}
          onChange={(e) => setSelectDistrict(e)}
          placeholder="Select District"
        />
        <Select
          className="select"
          id="talukName"
          options={talukName}
          value={selectTaluk}
          onChange={(e)=> setSelectTaluk(e)}
          placeholder="Select Taluk"
        />
        <Select
          className="select"
          id="parcelDropdown"
          options={hobliName}
          value={selectHobli}
          onChange={(e)=> setSelectHobli(e)}
          placeholder="Select Hobli"
        />
        <Select
          className="select"
          id="parcelDropdown"
          options={villageName}
          value={selectVillage}
          onChange={changeHandler}
          placeholder="Select Village"
        />
        <Form onSubmit={submitHandler}>
          <FormControl
            className="surveyno"
            type="number"
            value={parcelNo}
            placeholder="Survey no"
            onChange={(e) => setParcelNo(e.target.value)}
          />
          <Button type="Submit">Submit</Button>
        </Form>
      </div>
    </div>
  );
};

export default Menu;
