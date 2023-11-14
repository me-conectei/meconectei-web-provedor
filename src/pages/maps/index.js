import React, { useEffect, useState } from "react";

import { useHistory } from "react-router-dom";

import { Grid, Button } from "@material-ui/core";
import DataTable from "components/DataTable";
import PageTitle from "components/PageTitle";
import columns from "./columns";
import { makeStyles } from "@material-ui/styles";
import { createCommandService, APIMethods } from "services";
import { useSessionContext } from "context/UserSessionContext";

const useStyles = makeStyles((theme) => ({
  card: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonBtn: {
    backgroundColor: "#0147E9",
    color: "#ffffff",
    width: 262,
    height: 48,
  },
}));

export default function AreaList() {
  const history = useHistory();
  const [regions, setRegions] = useState([])
  const { isLoading, startLoading, finishLoading } = useSessionContext();
  const styles = useStyles();

  
 const asyncFetch = () => {
    startLoading();
    createCommandService({
      url: "regions",
      method: APIMethods.GET,
      headers: {
          'Authorization': `Bearer ${localStorage.getItem("sessionToken")}`
        },
      onSuccess: ({ data }) => {
          setRegions(data.data)
          console.log('Regions', data.data)
          finishLoading();
      },
      onCustomError: e => {
          debugger;
      }
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
      <Grid className={styles.card}>
        <Grid>
          <PageTitle title="Area de atuação" />
        </Grid>
        <Grid>
          <Button
            onClick={() => {
              history.push("/app/criar-area");
            }}
            className={styles.buttonBtn}
          >
            Criar uma área
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <DataTable data={regions} columns={columns}  options={{
              onRowClick: ([idRegion]) => {
                history.push(`/app/area/${idRegion}`);
              },
            }}/>
        </Grid>
      </Grid>
    </>
  );
}
