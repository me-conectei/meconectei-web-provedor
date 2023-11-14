export const initialState = {
    regionData: {},
    regions: [],
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "FETCH_REGIONS":
            return {
                ...state,
                regions: action.regions,
            };
        
        case "FETCH_REGION":
            return {
                ...state,
                regionData: action.regionData,
            };
        
        case "FULFILL_SPECIFIC_DATA":
            if (state.regionData[action.dataIndex] === undefined) {
                console.error("You must pass an exist dataIndex!");

                return state;
            }

            
            return {
                ...state,
                regionData: {
                    ...state.regionData,
                    [action.dataIndex]: action.value,
                },
            };
            
        default:
            return state;
    }
};

export default reducer;