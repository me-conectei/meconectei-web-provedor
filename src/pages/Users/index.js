import React, { useEffect } from "react";

import { useHistory } from "react-router-dom";

import { Grid } from "@material-ui/core";
import DataTable from "components/DataTable";
import PageTitle from "components/PageTitle";
import columns from "./columns";
import { makeStyles } from "@material-ui/styles";

import { useUserContext } from "./context";
import { useSessionContext } from "context/UserSessionContext";
import ModalDialog from "./components/Modal";

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

export default function UsersPage() {
  const history = useHistory();

  const { users, fetchUsers } = useUserContext();
  const { isLoading, startLoading, finishLoading } = useSessionContext();
  const styles = useStyles();

  const asyncFetch = async () => {
    startLoading();
    await fetchUsers();
    finishLoading();
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
          <PageTitle title="Usuários" />
        </Grid>
        <Grid>
          <ModalDialog />
        </Grid>
      </Grid>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <DataTable
            data={users}
            columns={columns}
            options={{
              onRowClick: ([uidUser]) => {
                history.push(`/app/usuarios/${uidUser}`);
                console.log("Uid", uidUser);
              },
            }}
          />
        </Grid>
      </Grid>
    </>
  );
}
