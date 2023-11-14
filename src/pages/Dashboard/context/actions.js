import { APIMethods, createCommandService } from "services";

const actions = dispatch => {
    const fulfillTotals = totals => ({
        type: "FETCH_TOTALS",
        totals,
    });

    const fulfillTop5CompaniesUsers = top5CompaniesUsers => ({
        type: "FETCH_TOP_5_COMPANIES_USERS",
        top5CompaniesUsers,
    });

    const fulfillDataGraphic = dataGraphic => ({
        type: "FETCH_DATA_GRAPHIC",
        dataGraphic,
    }); 

    const fetchTotals = () =>
        createCommandService({
            url: "/statistics/totals",
            method: APIMethods.GET,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("sessionToken")}`
              },
            onSuccess: ({ data }) => {
                dispatch(fulfillTotals(data.data));
                console.log('Totals',data.data)
            },
            onCustomError: e => {
                //debugger;
                console.log('ESSE É O ERRO!!',e)
            }
        });
    
    const fetchTop5CompaniesUsers = () =>
        createCommandService({
            url: "statistics/top5Plans",
            method: APIMethods.GET,
            onSuccess: ({ data }) => {
                dispatch(fulfillTop5CompaniesUsers(data.data));
            },
            onCustomError: e => {
               // debugger;
                console.log('ESSE É O ERRO!!',e)
            }
        });
    
   const fetchDataGraphic = () =>
        createCommandService({
            url: "statistics/compareChart",
            method: APIMethods.GET,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("sessionToken")}`
              },
            onSuccess: ({ data }) => {
                dispatch(fulfillDataGraphic(data.data));
                console.log('GRAFICO AQUI', data.data)
            },
            onCustomError: e => {
                //debugger;
                console.log('ESSE É O ERRO!!',e)
            }
        }); 

    return {
        fetchTotals,
        fetchTop5CompaniesUsers,
        fetchDataGraphic,
    };
}

export default actions;