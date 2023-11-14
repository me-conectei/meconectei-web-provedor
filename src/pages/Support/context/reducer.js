export const initialState = {
    supportList: [],
    supportTotals: {},
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "FETCH_SUPPORT_LIST":
            return {
                ...state,
                supportList: action.supportList,
            };
        
        case "FETCH_SUPPORT_TOTALS":
            return {
                ...state,
                supportTotals: action.supportTotals,
            };
            
        default:
            return state;
    }
};

export default reducer;