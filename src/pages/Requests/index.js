import React, { useEffect } from "react";

import { useHistory } from "react-router-dom";
import { useSessionContext } from "context/UserSessionContext";
import { useDashboardContext } from "../Dashboard/context";
import { useRequestContext } from "pages/Requests/context";

import { Grid } from "@material-ui/core";
import DataTable from "components/DataTable";
import PageTitle from "components/PageTitle";

import columns from "./columns";

export default function Requests() {
    const history = useHistory();
    const { requests, fetchRequests } = useRequestContext();
    const { isLoading, startLoading, finishLoading } = useSessionContext();
    const { fetchTotals } = useDashboardContext();

    const asyncFetch = async () => {
        startLoading();
        fetchTotals();
        await fetchRequests();
        finishLoading();
    };
    
    useEffect(() => {
        asyncFetch();
    }, []);  // eslint-disable-line react-hooks/exhaustive-deps

    if (isLoading) {
        return null;
    }

    return (
        <>
            <PageTitle title="Solicitações" />
            <Grid container spacing={4}>
                <Grid item xs={12}>
                <DataTable
                    data={requests}
                    columns={columns}
                    options={{
                        onRowClick: ([idOrder]) => {
                            history.push(`/app/solicitacoes/${idOrder}`);
                        },
                    }}
                />
                </Grid>
            </Grid>
        </>
  );
}
