import Api from "./api";

const TesteServices = {
  index: () => Api.get("/"),
  find: (codeTeste, RE) => Api.get(`/teste?teste=${codeTeste}&RE=${RE}`),
  start: () => Api.get("/start"),
  stop: () => Api.get("/stop"),
  reprove: () => Api.get("/reprove"),
  aprove: () => Api.get("/aprove"),
  gigaFind: () => Api.get("/GIGA"),
};

export default TesteServices;
