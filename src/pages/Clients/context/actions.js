import { createCommandService, APIMethods } from "services";
import debounce from "lodash/debounce";
import { DEBOUNCE_TIME } from "utils/constans";

import toast from "utils/toast";

const actions = dispatch => {
    const fulfillClients = clients => ({
        type: "FETCH_CLIENTS",
        clients,
    });

    const fulfillClientData = clientData => ({
        type: "FETCH_CLIENT",
        clientData,
    });

    const fulfillSpecificData = ({ dataIndex, value }) => dispatch({
        type: "FULFILL_SPECIFIC_DATA",
        dataIndex,
        value,
    });

    const fulfillSstatus = value => fulfillSpecificData({ dataIndex: "status", value });

    const fetchClients = () =>
        createCommandService({
            url: "/orders/clients",
            method: APIMethods.GET,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("sessionToken")}`
              },
            onSuccess: ({ data }) => {
                dispatch(fulfillClients(data.data));
                console.log('CLients', data.data)
            },
            onCustomError: e => {
                debugger;
            }
        });
    
    const fetchClientData = uidUser =>
        createCommandService({
            url: `/orders/clients/${uidUser}`,
            method: APIMethods.GET,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("sessionToken")}`
              },
            onSuccess: ({ data }) => {
                dispatch(fulfillClientData(data.data));
                console.log('Clients data', data.data)
            },
            onCustomError: e => {
                debugger;
            }
        });
    
    const updateData = data =>
        createCommandService({
            method: APIMethods.PUT,
            payload: data,
            url: `users/${data.uidUser}`,
            onSuccess: ({ data }) => {
                toast.success("Registro salvo com sucesso!");
            },
            onCustomError: e => {
                debugger;
            }
        });

    return {
        updateData,
        fetchClients,
        fetchClientData,
        fulfillSstatus,
        fulfillSpecificData: debounce(fulfillSpecificData, DEBOUNCE_TIME),
    };
}

export default actions;
