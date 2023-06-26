const requiredField = {
  required: '* O campo é obrigatório',
}

const blockValidator = {
  block: {
    required: requiredField.required,
    minLength: {
      value: 1,
      message: 'A quantidade de caracteres minima é 1'
    },
    maxLength: {
      value: 1,
      message: 'A quantidade de caracteres máxima é 1'
    },
  },
  description: {
    required: requiredField.required
  }
}

export default blockValidator