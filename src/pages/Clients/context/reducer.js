export const initialState = {
    clientData: {},
    clients: [],
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "FETCH_CLIENTS":
            return {
                ...state,
                clients: action.clients,
            };
        
        case "FETCH_CLIENT":
            return {
                ...state,
                clientData: action.clientData,
            };
        
        case "FULFILL_SPECIFIC_DATA":
            if (state.userData[action.dataIndex] === undefined) {
                console.error("You must pass an exist dataIndex!");

                return state;
            }

            
            return {
                ...state,
                userData: {
                    ...state.userData,
                    [action.dataIndex]: action.value,
                },
            };
            
        default:
            return state;
    }
};

export default reducer;