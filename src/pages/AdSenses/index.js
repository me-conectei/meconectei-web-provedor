import React, { useEffect, useState } from "react";

import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/styles";

import { Grid, Button } from "@material-ui/core";
import DataTable from "components/DataTable";
import PageTitle from "components/PageTitle";
import { createCommandService, APIMethods } from "services";
import masks from '../../utils/masks'

import { useSessionContext } from "context/UserSessionContext";
//import { useCompanieContext } from "pages/Requests/context";

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

const formatInstalationPrice = (price) => {

  const value = price.toString()

  if (price !== 0 && !price) {
    return null;
  }

  if (price === 0) {
    return "Grátis";
  }

  return masks.money(value)
};


export default function Companies() {
  const [adSenses, setAdSenses] = useState([]);
    const history = useHistory();
   // const { companies, fetchCompanies } = useCompanieContext();
    const { isLoading, startLoading, finishLoading } = useSessionContext();

    const styles = useStyles()
    
    const columns = [
        {
          name: "title",
          label: "Título",
          options: {
            filter: true,
            sort: true,
          },
        },
        {
          name: "effectedAt",
          label: "Data de início",
          options: {
            filter: true,
            sort: true,
            customBodyRender:(value) => {
              const date = new Date(value)
              const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
              const month = (date.getMonth()+1) < 10 ? `0${(date.getMonth()+1)}` : (date.getMonth()+1)
              return `${day}/${month}/${date.getFullYear()}`
            }
          },
        },
        {
          name: "expiredAt",
          label: "Data de fim",
          options: {
            filter: true,
            sort: true,
            customBodyRender:(value) => {
              const date = new Date(value)
              const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
              const month = (date.getMonth()+1) < 10 ? `0${(date.getMonth()+1)}` : (date.getMonth()+1)
              return `${day}/${month}/${date.getFullYear()}`
            }
          },
        },
        {
          name: "quantityPlan",
          label: "Valor",
          options: {
            filter: true,
            sort: true,
            customBodyRender: (value) => {
              return formatInstalationPrice(value)
            }
          },
        },
        {
          name: "status",
          label: "Status",
          options: {
            filter: true,
            sort: false,
            customBodyRender: (value) => {
              return value === 1 ? 'ativo' : 'pendente'
            }
          },
        }
      ];

    const asyncFetch = async () => {
        startLoading();
        createCommandService({
          method: APIMethods.GET,
          url: `impulse/all`,
          onSuccess: ({data}) => {
            const { list } = data;
            setAdSenses(list)
            finishLoading();
          },
          onCustomError: (e) => {
            debugger;
            finishLoading();
          },
        });
    };
    
    useEffect(() => {
        asyncFetch();
    }, []);  // eslint-disable-line react-hooks/exhaustive-deps

    if (isLoading) {
        return null;
    } 

    return (
        <>
            <Grid className={styles.card}>
                <Grid>
                    <PageTitle title="Impulsionar"/>
                </Grid>
                <Grid>
                    <Button onClick={()=>{history.push("/app/impulsionar/criar-anuncio")}} className={styles.buttonBtn}>Criar campanha</Button>
                </Grid>
            </Grid>
            <Grid container spacing={4}>
                <Grid item xs={12}>
                <DataTable
                    data={adSenses}
                    columns={columns}
                />
                </Grid>
            </Grid>
        </>
  );
}
