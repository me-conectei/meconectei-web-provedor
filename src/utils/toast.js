import { toast } from 'react-toastify';

const defaultProps = {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
}

const success = message => toast.success(message, defaultProps);

const info = message => toast.info(message, defaultProps);

const warning = message => toast.warning(message, defaultProps);

const error = message => toast.error(message, defaultProps);

const toastTypes = {
    success,
    info,
    warning,
    error,
};

export default toastTypes;