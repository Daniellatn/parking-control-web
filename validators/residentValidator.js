const requiredField = {
  required: '* O campo é obrigatório',
}

const residentValidator = {
  name: {
    required: requiredField.required,
  },
  lastName: {
    required: requiredField.required,
  },
  cpf: {
    required: requiredField.required,
  },
  rg: {
  },
  email: {
    required: requiredField.required,
  },
  cellphone: {
    required: requiredField.required,
  },
  image: {
    required: requiredField.required,
  }
}

export default residentValidator