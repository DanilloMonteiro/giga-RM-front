import Api from "./api";

const TestServices = {
  index: () => Api.get("/test"),
  find: (codeTeste, RE, update, func) =>
    Api.get(
      `/test/upload?teste=${codeTeste}&RE=${RE}&update=${update}&func=${func}`
    ),
  findById: (id, params) => Api.get(`/test/${id}`, params),
  update: (id, params) => Api.put(`/test/${id}`, params),
  uploadImage: (formData) => Api.post(`/uploads/test`, formData),
  loadTest: (id) => Api.get(`/test/load/${id}`),
};

export default TestServices;
