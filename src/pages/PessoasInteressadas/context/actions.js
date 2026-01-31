import { createCommandService, APIMethods } from "services";
import toast from "utils/toast";

const actions = dispatch => {
    const fulfillPlanosInteressados = plans => ({
        type: "FETCH_PLANOS_INTERESSADOS",
        plans,
    });

    const fulfillUpdateStatus = (id, status) => ({
        type: "UPDATE_INTERESSADO_STATUS",
        id,
        status,
    });

    const fetchPlanosInteressados = () =>
        createCommandService({
            url: "/pessoas-interessadas",
            method: APIMethods.GET,
            onSuccess: ({ data }) => {
                if (data.success && data.data) {
                    dispatch(fulfillPlanosInteressados(data.data));
                }
            },
            onCustomError: err => {
                const msg = err?.response?.data?.errorMessage || "Erro ao carregar pessoas interessadas.";
                toast.error(msg);
            },
        });

    const updateInteressadoStatus = (id, status) =>
        createCommandService({
            url: `/pessoas-interessadas/${id}`,
            method: APIMethods.PATCH,
            payload: { status },
            onSuccess: () => {
                dispatch(fulfillUpdateStatus(id, status));
                toast.success("Status atualizado.");
            },
            onCustomError: err => {
                const msg = err?.response?.data?.errorMessage || "Erro ao atualizar status.";
                toast.error(msg);
            },
        });

    return {
        fetchPlanosInteressados,
        updateInteressadoStatus,
    };
};

export default actions;
