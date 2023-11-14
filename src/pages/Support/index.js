import React, { useEffect } from "react";

import { useSessionContext } from "context/UserSessionContext";
import { useSupportContext } from "./context";

import { Grid } from "@material-ui/core";
import DataTable from "components/DataTable";
import PageTitle from "components/PageTitle";

import {
  People as PeopleIcon,
  CheckBox as CheckBoxIcon,
} from "@material-ui/icons";

import InfoIconCard from "components/InfoIconCard";

import columns from "./columns";

export default function Companies() {
    const {
        fetchSupportList,
        fetchSupportTotals,
        supportList,
        supportTotals,
    } = useSupportContext();
    const { isLoading, startLoading, finishLoading } = useSessionContext();

    const asyncFetch = async () => {
        startLoading();
        await Promise.all([
            fetchSupportList(),
            fetchSupportTotals(),
        ]);
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
            <PageTitle title="Chamada por suporte" />
            <Grid container spacing={4}>
                <Grid item lg={3} xs={12}>
                    <InfoIconCard
                        Icon={PeopleIcon}
                        totalNumber={supportTotals.total}
                        description="Chamados efetuados"
                        iconColor="#156d58"
                        iconBoxColor="#d8efd8"
                    />
                </Grid>
                <Grid item lg={3} xs={12}>
                    <InfoIconCard
                        Icon={CheckBoxIcon}
                        totalNumber={supportTotals.openTotal}
                        description="Chamados em aberto"
                        iconColor="#e41743"
                        iconBoxColor="#fbdce3"
                    />
                </Grid>
                <Grid item xs={12}>
                    <DataTable
                        data={supportList}
                        columns={columns}
                    />
                </Grid>
            </Grid>
        </>
  );
}
