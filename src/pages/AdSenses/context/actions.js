import { createCommandService, APIMethods } from "services";
import debounce from "lodash/debounce";
import { DEBOUNCE_TIME } from "utils/constans";

const actions = dispatch => {
    const fulfillCompanies = companies => ({
        type: "FETCH_COMPANIES",
        companies,
    })

    const fulfillCompanieData = companieData => ({
        type: "FETCH_COMPANIE",
        companieData,
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

    const fetchCompanies = () =>
        createCommandService({
            url: "companies",
            onSuccess: ({ data }) => {
                dispatch(fulfillCompanies(data.data));
            },
            onCustomError: e => {
                debugger;
            }
        });
    
    const fetchCompanieData = idCompany =>
        createCommandService({
            url: `companies/${idCompany}`,
            onSuccess: ({ data }) => {
                dispatch(fulfillCompanieData(data.data));
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
                console.log("Registro criado com sucesso!");
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
                console.log("Registro salvo com sucesso!");
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
        fetchCompanies,
        fetchCompanieData,
        fulfillSpecificData: debounce(fulfillSpecificData, DEBOUNCE_TIME),
        fulfillImage,
        saveData,
    };
}

export default actions;