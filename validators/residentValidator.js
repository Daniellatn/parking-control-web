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
    minLength: {
      value: 11,
      message: 'A quantidade de caracteres minima é 11'
    },
    maxLength: {
      value: 11,
      message: 'A quantidade de caracteres máxima é 11'
    },
  },
  rg: {
    minLength: {
      value: 7,
      message: 'A quantidade de caracteres minima é 7'
    },
    maxLength: {
      value: 7,
      message: 'A quantidade de caracteres máxima é 7'
    },
  },
  email: {
    required: requiredField.required,
  },
  cellphone: {
    required: requiredField.required,
    minLength: {
      value: 11,
      message: 'A quantidade de caracteres minima é 11'
    },
    maxLength: {
      value: 11,
      message: 'A quantidade de caracteres máxima é 11'
    },
  },
  image: {
    required: requiredField.required,
  }
}

export default residentValidator