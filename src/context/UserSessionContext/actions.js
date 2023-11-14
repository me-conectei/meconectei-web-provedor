import { createCommandService, APIMethods } from "services";

const actions = dispatch => {
    const startLoading = () => dispatch({
        type: "START_LOADING"
    });

    const finishLoading = () => dispatch({
        type: "FINISH_LOADING"
    });

    const registerSession = () =>        
        createCommandService({
            url: "/registerSession",
            method: APIMethods.POST,
            payload: {
                uidUser: localStorage.getItem('id_token'),
            },
            onCustomError: e => {
                debugger;
            },
            onSuccess: ({ data }) => {
                if (data?.success) {
                    localStorage.setItem('sessionToken', data.JWT);
                } else {
                    console.error(data.errorMessage);
                }                
            }
        });

    return {
        registerSession,
        startLoading,
        finishLoading,
    };
}

export default actions;