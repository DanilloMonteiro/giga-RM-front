import Api from "./api";

const GigaServices = {
  index: () => Api.get("/giga"),
  findById: (id, params) => Api.get(`/giga/${id}`, params),
  update: (id, params) => Api.put(`/giga/${id}`, params),
  updateConfig: (id, params) => Api.put(`/giga/config/${id}`, params),
  delete: (id, index, indexPoint) =>
    Api.delete(`/giga/${id}?index=${index}&indexPoint=${indexPoint}`),
  uploadImage: (formData) => Api.post(`/uploads/giga`, formData),
};

export default GigaServices;
