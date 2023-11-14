export const initialState = {
    userData: {},
    users: [],
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "FETCH_USERS":
            return {
                ...state,
                users: action.users,
            };
        
        case "FETCH_USER":
            return {
                ...state,
                userData: action.userData,
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