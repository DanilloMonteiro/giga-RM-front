import Api from "./api";

const TesteServices = {
  index: () => Api.get("/"),
};

export default TesteServices;
