import Api from "./api";

const TesteServices = {
  index: () => Api.get("/"),
  find: (codeTeste, RE) => Api.get(`/teste?teste=${codeTeste}&RE=${RE}`),
};

export default TesteServices;
