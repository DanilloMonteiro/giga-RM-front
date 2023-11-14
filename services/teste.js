import Api from "./api";

const TesteServices = {
  index: () => Api.get("/"),
  find: (codeTeste, RE) => Api.get(`/teste?teste=${codeTeste}&RE=${RE}`),
  start: () => Api.get("/start"),
  stop: () => Api.get("/stop"),
  reprove: () => Api.get("/reprove"),
  aprove: () => Api.get("/aprove"),
  gigaFind: (params) =>
    Api.get(`/GIGA/?name=${params}`).then(console.log(params)),
  gigaUpdate: (id, params) => Api.put(`/GIGA/${id}`, params),
  testeGIGAUpdate: (id, params) => Api.put(`/GIGA/teste/${id}`, params),
  uploadImage: (formData) => Api.post(`/upload`, formData),
};

export default TesteServices;
