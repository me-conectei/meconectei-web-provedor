import React, { useEffect, useState } from "react";
import { createCommandService, APIMethods } from "services";

import { useHistory } from "react-router-dom";

import { Button, Grid } from "@material-ui/core";
import DataTable from "components/DataTable";
import PageTitle from "components/PageTitle";
import { useSessionContext } from "context/UserSessionContext";
//import { usePlanContext } from "./context";

import columns from "./columns";
import AddPlans from "./AddPlans";

const PlanScreen = () => {
  const history = useHistory();
  const [plans, setPlans] = useState([]);
  const [open, setOpen] = React.useState(false);

  const [planName, setPlanName] = useState("");
  const [technology, setTechnology] = useState("");
  const [wifi, setWifi] = useState();
  const [camera, setCamera] = useState();
  const [phone, setPhone] = useState();
  const [fidelity, setFidelity] = useState();
  const [priceInstallation, setPriceInstallation] = useState();
  const [price, setPrice] = useState();
  const [expiredAt, setExpiredAt] = useState(new Date());
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [velocity, setVelocity] = useState()

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  //const { plans, fetchPlan } = usePlanContext();
  const { isLoading, startLoading, finishLoading } = useSessionContext();

  
  const asyncFetch = () => {
    startLoading();
    //fetchPlan();
    createCommandService({
      url: "/plans",
      method: APIMethods.GET,
      onSuccess: ({ data }) => {
        //dispatch(fulfillPlans(data.data));
        setPlans(data.data);
        finishLoading();
      },
      onCustomError: (e) => {
        debugger;
      },
    });
  };

  useEffect(() => {
    asyncFetch();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) {
    return null;
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <PageTitle title="Planos" />
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Adicionar novo plano
        </Button>
      </div>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <DataTable
            data={plans}
            columns={columns}
            options={{
              onRowClick: ([idPlan]) => {
                history.push(`/app/planos/${idPlan}`);
              },
            }}
          />
        </Grid>
        <AddPlans
        open={open}
        handleClose={handleClose}
        planName={planName}
        setPlanName={setPlanName}
        wifi={wifi}
        setWifi={setWifi}
        camera={camera}
        setCamera={setCamera}
        phone={phone}
        setPhone={setPhone}
        technology={technology}
        setTechnology={setTechnology}
        fidelity={fidelity}
        setFidelity={setFidelity}
        price={price}
        setPrice={setPrice}
        priceInstallation={priceInstallation}
        setPriceInstallation={setPriceInstallation}
        expiredAt={expiredAt}
        setExpiredAt={setExpiredAt}
        setDescription={setDescription}
        description={description}
        status={status}
        setStatus={setStatus}
        velocity={velocity}
        setVelocity={setVelocity}
      />
      </Grid>

    </>
  );
};

export default PlanScreen;
