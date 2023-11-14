export const initialState = {
    plans: [],
    planData: {},
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "FETCH_PLANS":
            return {
                ...state,
                plans: action.plans,
            };
        
        case "FETCH_PLAN_DATA":
            return {
                ...state,
                planData: action.planData,
            };
        
        case "FULFILL_SPECIFIC_DATA":
            if (state.companieData[action.dataIndex] === undefined) {
                console.error("You must pass an exist dataIndex!");

                return state;
            }

            
            return {
                ...state,
                companieData: {
                    ...state.companieData,
                    [action.dataIndex]: action.value,
                },
            };
            
        default:
            return state;
    }
};

export default reducer;