import { createCommandService, APIMethods } from "services";
import debounce from "lodash/debounce";
import { DEBOUNCE_TIME } from "utils/constans";


const actions = (dispatch) => {
  const fulfillPlans = (plans) => ({
    type: "FETCH_PLANS",
    plans,
  });

  const fulfillPlanData = (planData) => ({
    type: "FETCH_PLAN_DATA",
    planData,
  });

  const fulfillSpecificData = ({ dataIndex, value }) =>
    dispatch({
      type: "FULFILL_SPECIFIC_DATA",
      dataIndex,
      value,
    });

  /* const fulfillImage = image => fulfillSpecificData({
        dataIndex: "image",
        value: image,
    });*/

  const fetchPlan = () =>
    createCommandService({
      url: "/plans",
      method: APIMethods.GET,
      onSuccess: ({ data }) => {
        dispatch(fulfillPlans(data.data));
        console.log('O que temos!!', data.data)
      },
      onCustomError: (e) => {
        debugger;
      },
    });

  const fetchPlanData = (idPlans) =>
    createCommandService({
      url: `/plans/${idPlans}`,
      method: APIMethods.GET,
      onSuccess: ({ data }) => {
        dispatch(fulfillPlanData(data.data));
      },
      onCustomError: (e) => {
        debugger;
      },
    });

  /* const newData = data =>
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
        });*/

  /* const saveData = data => {
        if (data.idCompany) {
            return updateData(data);
        }
        return newData(data);
    }*/

  return {
    fetchPlan,
    fetchPlanData,
    fulfillSpecificData: debounce(fulfillSpecificData, DEBOUNCE_TIME),
    //fulfillImage,
    //saveData,
  };
};

export default actions;
