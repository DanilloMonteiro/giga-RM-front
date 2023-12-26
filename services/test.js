import Api from "./api";

const TestServices = {
  index: () => Api.get("/test"),
  find: (codeTeste, RE, update) =>
    Api.get(`/test/upload?teste=${codeTeste}&RE=${RE}&update=${update}`),
  findById: (id, params) => Api.get(`/test/${id}`, params),
  update: (id, params) => Api.put(`/test/${id}`, params),
  uploadImage: (formData) => Api.post(`/uploads/test`, formData),
};

export default TestServices;
