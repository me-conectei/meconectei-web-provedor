import { createCommandService } from "services";

const actions = dispatch => {
    const fulfillEvaluations = evaluations => ({
        type: "FETCH_EVALUATIONS",
        evaluations,
    })

    const fulfillEvaluationData = evaluationList => ({
        type: "FETCH_EVALUATION",
        evaluationList,
    });

    const fetchEvaluations = () =>
        createCommandService({
            url: "evaluations",
            onSuccess: ({ data }) => {
                dispatch(fulfillEvaluations(data.data));
            },
            onCustomError: e => {
                debugger;
            }
        });
    
    const fetchEvaluationData = idCompany =>
        createCommandService({
            url: `evaluations/${idCompany}`,
            onSuccess: ({ data }) => {
                dispatch(fulfillEvaluationData(data.data));
            },
            onCustomError: e => {
                debugger;
            }
        });

    return {
        fetchEvaluations,
        fetchEvaluationData,
    };
}

export default actions;