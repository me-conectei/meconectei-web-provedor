import { createCommandService } from "services";

const actions = dispatch => {
    const fulfillSupportList = supportList => ({
        type: "FETCH_SUPPORT_LIST",
        supportList,
    })

    const fulfillSupportTotals = supportTotals => ({
        type: "FETCH_SUPPORT_TOTALS",
        supportTotals,
    });

    const fetchSupportList = () =>
        createCommandService({
            url: "supports",
            onSuccess: ({ data }) => {
                dispatch(fulfillSupportList(data.data));
            },
            onCustomError: e => {
                debugger;
            }
        });
    
    const fetchSupportTotals = () =>
        createCommandService({
            url: "supportTotals",
            onSuccess: ({ data }) => {
                dispatch(fulfillSupportTotals(data.data));
            },
            onCustomError: e => {
                debugger;
            }
        });

    return {
        fetchSupportList,
        fetchSupportTotals,
    };
}

export default actions;