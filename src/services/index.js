import api from "api";

export const APIMethods = {
    POST: "post",
    GET: "get",
    DELETE: "delete",
    PUT: "put",
};

export const createCommandService = ({
  url,
  payload,
  method = 'get',
  onStart,
  onSuccess = a => a,
  onCustomError = a => a,
  onFinally,
}) => {
  try {
    onStart?.();

    return api({
      method,
      url,
      data: payload,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("sessionToken")}`
      }
    })
      .then(data => data)
      .then(onSuccess)
      .catch(onCustomError)
      .finally(onFinally);
  } catch (e) {
    console.log(`${e.name} - ${e.message}`);
  }
};