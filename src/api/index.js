import axios from "axios";

export const baseURL = "https://me-conectei-svc-temp-4f6577936f24.herokuapp.com/company"

export default axios.create({
    baseURL
});