
export const initialState = {
    evaluations: [],
    evaluationList: [],
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "FETCH_EVALUATIONS":
            return {
                ...state,
                evaluations: action.evaluations,
            };
        
        case "FETCH_EVALUATION":
            return {
                ...state,
                evaluationList: [
                    {
                        name: "Geral",
                        data: [
                            { stars: "5", evaluation: action.evaluationList.general5 },
                            { stars: "4", evaluation: action.evaluationList.general4 },
                            { stars: "3", evaluation: action.evaluationList.general3 },
                            { stars: "2", evaluation: action.evaluationList.general2 },
                            { stars: "1", evaluation: action.evaluationList.general1 },
                        ],
                    },
                    {
                        name: "Instalação",
                        data: [
                            { stars: "5", evaluation: action.evaluationList.instaltion5 },
                            { stars: "4", evaluation: action.evaluationList.instaltion4 },
                            { stars: "3", evaluation: action.evaluationList.instaltion3 },
                            { stars: "2", evaluation: action.evaluationList.instaltion2 },
                            { stars: "1", evaluation: action.evaluationList.instaltion1 },
                        ],
                    },
                    {
                        name: "Suporte",
                        data: [
                            { stars: "5", evaluation: action.evaluationList.support5 },
                            { stars: "4", evaluation: action.evaluationList.support4 },
                            { stars: "3", evaluation: action.evaluationList.support3 },
                            { stars: "2", evaluation: action.evaluationList.support2 },
                            { stars: "1", evaluation: action.evaluationList.support1 },
                        ],
                    },
                    {
                        name: "WiFi",
                        data: [
                            { stars: "5", evaluation: action.evaluationList.wifi5 },
                            { stars: "4", evaluation: action.evaluationList.wifi4 },
                            { stars: "3", evaluation: action.evaluationList.wifi3 },
                            { stars: "2", evaluation: action.evaluationList.wifi2 },
                            { stars: "1", evaluation: action.evaluationList.wifi1 },
                        ],
                    },
                ],
            };
            
        default:
            return state;
    }
};

export default reducer;