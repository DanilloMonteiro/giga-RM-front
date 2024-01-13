import Api from "./api";

const FunctionServices = {
  start: () => Api.get("/start"),
  startLoop: () => Api.get("/start/loopLed"),
  stop: () => Api.get("/stop"),
  stopBatalha: () => Api.get("/stop/battle"),
  stopHolder: () => Api.get("/stop/holder"),
  switch: () => Api.get("/switch"),
  reprove: (id) => Api.get(`/reprove/${id}`),
  aprove: (id) => Api.get(`/aprove/${id}`),
  on: (status) => Api.get(`/on?status=${status}`),
  off: (status) => Api.get(`/off?status=${status}`),
  holderTest: (id, id2) => Api.get(`/holderTest/${id}/${id2}`),
};

export default FunctionServices;
