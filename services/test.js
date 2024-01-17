import Api from "./api";

const TestServices = {
  index: () => Api.get("/test"),
  find: (codeTeste, RE, func) =>
    Api.get(
      `/test/upload?product_code=${codeTeste}&RE=${RE}&func=${func}`
    ),
  findById: (id, params) => Api.get(`/test/${id}`, params),
  update: (id, params) => Api.put(`/test/${id}`, params),
  uploadImage: (formData) => Api.post(`/uploads/test`, formData),
  loadTest: (id) => Api.get(`/test/load/${id}`),
};

export default TestServices;
