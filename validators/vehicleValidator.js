const requiredField = {
  required: '* O campo é obrigatório',
}

const vehicleValidator = {
  type: {
    required: requiredField.required,
  },
  plate: {
    required: requiredField.required,
  },
  model: {
    required: requiredField.required,
  },
  year: {
    required: requiredField.required,
  },
  color: {
    required: requiredField.required,
  },
  mark: {
    required: requiredField.required,
  },
  image: {
    required: requiredField.required,
  }
}

export default vehicleValidator