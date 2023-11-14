export const initialState = {
    isLoading: true,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "START_LOADING":
            return {
                ...state,
                isLoading: true,
            };
        
        case "FINISH_LOADING":
            return {
                ...state,
                isLoading: false,
            };
            
        default:
            return state;
    }
};

export default reducer;