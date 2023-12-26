import Api from "./api";

const GigaServices = {
  index: () => Api.get("/giga"),
  findById: (id, params) => Api.get(`/giga/${id}`, params),
  update: (id, params) => Api.put(`/giga/${id}`, params),
  uploadImage: (formData) => Api.post(`/uploads/giga`, formData),
};

export default GigaServices;
