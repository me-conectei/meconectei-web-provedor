export const initialState = {
    companies: [],
    companieData: {},
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "FETCH_COMPANIES":
            return {
                ...state,
                companies: action.companies,
            };
        
        case "FETCH_COMPANIE":
            return {
                ...state,
                companieData: action.companieData,
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