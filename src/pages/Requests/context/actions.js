import { createCommandService, APIMethods } from "services";
import debounce from "lodash/debounce";
import { DEBOUNCE_TIME } from "utils/constans";

import toast from "utils/toast";

const actions = dispatch => {
    const fulfillRequests = requests => ({
        type: "FETCH_REQUESTS",
        requests,
    })

    const fulfillRequestData = requestData => ({
        type: "FETCH_REQUEST_DATA",
        requestData,
    });

    const fulfillSpecificData = ({ dataIndex, value }) => dispatch({
        type: "FULFILL_SPECIFIC_DATA",
        dataIndex,
        value,
    });

    const fulfillImage = image => fulfillSpecificData({
        dataIndex: "image",
        value: image,
    });

    const fetchRequests = () =>
        createCommandService({
            url: "/orders/requests",
            method: APIMethods.GET,
            onSuccess: ({ data }) => {
                dispatch(fulfillRequests(data.data));
            },
            onCustomError: e => {
                debugger;
            }
        });
    
    const fetchRequestData = idOrder =>
        createCommandService({
            url: `/orders/data/${idOrder}`,
            method: APIMethods.GET,
            onSuccess: ({ data }) => {
                dispatch(fulfillRequestData(data.data[0]));
            },
            onCustomError: e => {
                debugger;
            }
        });
    
    const newData = data =>
        createCommandService({
            method: APIMethods.POST,
            payload: data,
            url: "companies/add",
            onSuccess: ({ data }) => {
                toast.success("Registro criado com sucesso!");
            },
            onCustomError: e => {
                debugger;
            }
        });
    
    const updateData = data =>
        createCommandService({
            method: APIMethods.PUT,
            payload: data,
            url: `companies/${data.idCompany}`,
            onSuccess: ({ data }) => {
                toast.success("Registro salvo com sucesso!");
            },
            onCustomError: e => {
                debugger;
            }
        });
    
    const saveData = data => {
        if (data.idCompany) {
            return updateData(data);
        }
        return newData(data);
    }
        

    return {
        fetchRequests,
        fetchRequestData,
        fulfillSpecificData: debounce(fulfillSpecificData, DEBOUNCE_TIME),
        fulfillImage,
        saveData,
    };
}

export default actions;