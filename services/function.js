import Api from "./api";

const FunctionServices = {
  start: () => Api.get("/start"),
  stop: () => Api.get("/stop"),
  stopBatalha: () => Api.get("/stop/batalha"),
  stopHolder: () => Api.get("/stop/holder"),
  switch: () => Api.get("/switch"),
  reprove: () => Api.get("/reprove"),
  aprove: () => Api.get("/aprove"),
  on: (status) => Api.get(`/on?status=${status}`),
  off: (status) => Api.get(`/off?status=${status}`),
  holderTest: (id, id2) => Api.get(`/holderTest/${id}/${id2}`),
};

export default FunctionServices;
