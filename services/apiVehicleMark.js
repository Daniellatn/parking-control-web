const { default: axios } = require("axios");

const apiVehicleMark = axios.create({
  baseURL: 'https://parallelum.com.br/fipe/api/v1'
})

export default apiVehicleMark