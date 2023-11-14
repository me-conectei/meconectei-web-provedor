import React, { useEffect, useState } from "react";

import { useHistory } from "react-router-dom";

import { Grid } from "@material-ui/core";
import DataTable from "components/DataTable";
import PageTitle from "components/PageTitle";
import columns from "./columns";
import { createCommandService, APIMethods } from "services";
import { useSessionContext } from "context/UserSessionContext";

export default function Clients() {
    const history = useHistory();
    const [users, setUsers] = useState([])
   // const { clients, fetchClients } = useUserContext();
    const { isLoading, startLoading, finishLoading } = useSessionContext();


   const asyncFetch =  () => {
        startLoading();
        createCommandService({
            url: "/orders/clients",
            method: APIMethods.GET,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("sessionToken")}`
              },
            onSuccess: ({ data }) => {
               // dispatch(fulfillClients(data.data));
                console.log('CLients', data.data)
                setUsers(data.data)
                finishLoading();
            },
            onCustomError: e => {
                debugger;
            }
        });
        
    }
    useEffect(() => {
        asyncFetch();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (isLoading) {
        return null;
    }
    
    const userData = users.filter((item)=>{
        if(item.status === 'contratado' || item.status === 'finalizado')
            return true


        return false
    })

    return (
        <>
            <PageTitle title="Clientes" />
            <Grid container spacing={4}>
                <Grid item xs={12}>
                <DataTable
                    data={userData}
                    columns={columns} 
                    options={{
                        onRowClick: ([uidUser, idOrder]) => {
                          history.push(`/app/clientes/${uidUser}/${idOrder}`)
                        },
                      }}
                />
                </Grid>
            </Grid>
        </>
  );
}
