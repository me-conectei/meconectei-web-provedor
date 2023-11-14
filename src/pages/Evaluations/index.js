import React, { useEffect, useState } from "react";

import { useSessionContext } from "context/UserSessionContext";
import { APIMethods, createCommandService } from "services";

import { Grid } from "@material-ui/core";
import PageTitle from "components/PageTitle";
import EvaluationGraph from "components/EvaluationGraph";


import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  general: {
    color: "#3d81e8",
  },
  instalation: {
    color: "#d48a1b",
  },
  wifi: {
    color: "#3d81e8",
  },
  support: {
    color: "#179048",
  },
  containerEvaluation: {
    paddingLeft: 50,
    paddingRight: 50,
  },
  evaluations: {
    marginTop: 20,
  },
}));

export default function Evaluations() {
  // eslint-disable-next-line
  const { _nonused, startLoading, finishLoading } = useSessionContext();
  const [evaluations, setEvaluations] = useState({});

  const asyncFetch = () => {
    startLoading();
    createCommandService({
      url: "/evaluations",
      method: APIMethods.GET,
      onSuccess: ({ data }) => {
        //dispatch(fulfillTotals(data.data));
        console.log("Avaliações", data.data);
        setEvaluations(data.data);
        finishLoading();
      },
      onCustomError: (e) => {
        debugger;
        console.log(e);
      },
    });
  };

  useEffect(() => {
    asyncFetch();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const array = [
    {
      name: "Geral",
      value: [
        { stars: 5, evaluation: evaluations.general5 },
        { stars: 4, evaluation: evaluations.general4 },
        { stars: 3, evaluation: evaluations.general3 },
        { stars: 2, evaluation: evaluations.general2 },
        { stars: 1, evaluation: evaluations.general1 },
      ],
    },
    {
      name: "Instalação",
      value: [
        { stars: 5, evaluation: evaluations.instalation5 },
        { stars: 4, evaluation: evaluations.instalation4 },
        { stars: 3, evaluation: evaluations.instalation3 },
        { stars: 2, evaluation: evaluations.instalation2 },
        { stars: 1, evaluation: evaluations.instalation1 },
      ],
    },
    {
      name: "WIFI",
      value: [
        { stars: 5, evaluation: evaluations.wifi5 },
        { stars: 4, evaluation: evaluations.wifi4 },
        { stars: 3, evaluation: evaluations.wifi3 },
        { stars: 2, evaluation: evaluations.wifi2 },
        { stars: 1, evaluation: evaluations.wifi1 },
      ],
    },
    {
      name: "Suporte",
      value: [
        { stars: 5, evaluation: evaluations.support5 },
        { stars: 4, evaluation: evaluations.support4 },
        { stars: 3, evaluation: evaluations.support3 },
        { stars: 2, evaluation: evaluations.support2 },
        { stars: 1, evaluation: evaluations.support1 },
      ],
    },
  ];

  const styles = useStyles();
  return (
    <>
      <PageTitle title="Avaliações" />
      <Grid container spacing={2} className={styles.evaluations}>
        {array.map(({ name, value }, key) => (
          <Grid item lg={6} md={4} sm={6} xs={12} key={key}>
            <EvaluationGraph name={name} graphData={value} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
