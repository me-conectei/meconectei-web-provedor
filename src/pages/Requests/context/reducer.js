export const initialState = {
    companies: [],
    companieData: {},
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "FETCH_REQUESTS":
            return {
                ...state,
                requests: action.requests,
            };
        
        case "FETCH_REQUEST_DATA":
            return {
                ...state,
                requestData: action.requestData,
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