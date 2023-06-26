const requiredField = {
  required: '* O campo é obrigatório',
}

const apartmentValidator = {
  number: {
    required: requiredField.required,
  },
  floor: {
    required: requiredField.required,
  },
  block: {
    required: requiredField.required,
  }
}

export default apartmentValidator