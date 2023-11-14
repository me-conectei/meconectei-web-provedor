import React, { useEffect } from "react";

import { useHistory, useParams } from "react-router-dom";

import { makeStyles } from "@material-ui/styles";

import { useSessionContext } from "context/UserSessionContext";
import { useEvaluationContext } from "pages/Evaluations/context";

import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";

import EvaluationGraph from "components/EvaluationGraph";
import BackButton from "components/BackButton";

const useStyles = makeStyles(theme => ({
    containerEvaluation: {
        paddingLeft: 50,
        paddingRight: 50,
    },
    evaluations: {
        marginTop: 20,
    },
}));

export default function EvaluationData() {
    const { isLoading, startLoading, finishLoading } = useSessionContext();
    const { evaluationList, fetchEvaluationData } = useEvaluationContext();
    
    const { id } = useParams();
    
    const asyncFetch = async () => {
        startLoading();
        await fetchEvaluationData(id);
        finishLoading();
    };
    
    useEffect(() => {
        asyncFetch();
    }, []);  // eslint-disable-line react-hooks/exhaustive-deps
    
    const styles = useStyles();
    
    const history = useHistory();
    
    const goBack = () => {
        history.goBack()
    }
    
    if (isLoading) {
        return null;
    }

    console.log("O que temos aqui", evaluationList)

    return (
        <Box className={styles.containerEvaluation}>
            <Box display="flex">
                <BackButton
                    onClick={goBack}
                />
            </Box>
            <Grid container spacing={2} className={styles.evaluations}>
                {evaluationList.map(({ name, data }, key) => (
                    <Grid item lg={6} md={4} sm={6} xs={12} key={key}>
                        <EvaluationGraph
                            name={name}
                            graphData={data}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
  );
}
