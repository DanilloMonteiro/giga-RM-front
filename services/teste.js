import Api from "./api";

const TesteServices = {
  index: () => Api.get("/"),
  find: (codeTeste) => Api.get(`/teste?teste=${codeTeste}`),
};

export default TesteServices;
