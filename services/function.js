import Api from "./api";

const FunctionServices = {
  start: () => Api.get("/start"),
  stop: () => Api.get("/stop"),
  reprove: () => Api.get("/reprove"),
  aprove: () => Api.get("/aprove"),
  on: (status) => Api.get(`/on?status=${status}`),
  off: (status) => Api.get(`/off?status=${status}`),
};

export default FunctionServices;
