export const initialState = {
    plans: [],
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "FETCH_PLANOS_INTERESSADOS":
            return {
                ...state,
                plans: action.plans,
            };
        case "UPDATE_INTERESSADO_STATUS": {
            const { id, status } = action;
            return {
                ...state,
                plans: state.plans.map(plan => ({
                    ...plan,
                    interessados: plan.interessados.map(interessado =>
                        interessado.id === id ? { ...interessado, status } : interessado
                    ),
                })),
            };
        }
        default:
            return state;
    }
};

export default reducer;
