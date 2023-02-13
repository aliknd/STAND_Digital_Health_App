import { create } from "apisauce";
import authStorage from "../auth/storage";
import endpointURL from "./serverPoint";

const apiClient = create({
  baseURL: endpointURL,
});

apiClient.addAsyncRequestTransform(async (request) => {
  const authToken = await authStorage.getToken();
  if (!authToken) return;
  request.headers["x-auth-token"] = authToken;
});

export default apiClient;
