import { createCommandService, APIMethods } from "services";
import debounce from "lodash/debounce";
import { DEBOUNCE_TIME } from "utils/constans";

import toast from "utils/toast";

const actions = dispatch => {
    const fulfillRegions = regions => ({
        type: "FETCH_REGIONS",
        regions,
    });

    const fulfillregionData = regionData => ({
        type: "FETCH_REGION",
        regionData,
    });

    const fulfillSpecificData = ({ dataIndex, value }) => dispatch({
        type: "FULFILL_SPECIFIC_DATA",
        dataIndex,
        value,
    });

    const fulfillSstatus = value => fulfillSpecificData({ dataIndex: "status", value });

    const fetchRegions = () =>
        createCommandService({
            url: "regions",
            method: APIMethods.GET,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("sessionToken")}`
              },
            onSuccess: ({ data }) => {
                dispatch(fulfillRegions(data.data));
                console.log('Regions', data.data)
            },
            onCustomError: e => {
                debugger;
            }
        });
    
    const fetchRegionData = regionId =>
        createCommandService({
            url: `regions/${regionId}`,
            method: APIMethods.GET,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("sessionToken")}`
              },
            onSuccess: ({ data }) => {
                dispatch(fulfillregionData(data.data));
                console.log(data.data)
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
        fetchRegions,
        fetchRegionData,
        fulfillSstatus,
        fulfillSpecificData: debounce(fulfillSpecificData, DEBOUNCE_TIME),
    };
}

export default actions;
