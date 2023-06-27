const requiredField = {
  required: '* O campo é obrigatório',
}

const parkingValidator = {
  localization: {
    required: requiredField.required,
  },
  plate: {
    required: requiredField.required,
  },
  apartment: {
    required: requiredField.required,
  },
}

export default parkingValidator