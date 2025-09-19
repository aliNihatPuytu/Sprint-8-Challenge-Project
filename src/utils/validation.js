export const validateName = (name) => {
  if (!name || name.trim().length < 3) {
    return "İsim en az 3 karakter olmalıdır"
  }
  return ""
}

export const validateSize = (size) => {
  if (!size) {
    return "Pizza boyutu seçilmelidir"
  }
  return ""
}

export const validateCrust = (crust) => {
  if (!crust) {
    return "Hamur kalınlığı seçilmelidir"
  }
  return ""
}

export const validateToppings = (toppings) => {
  const selectedToppings = toppings.filter(t => t.selected)
  if (selectedToppings.length < 4) {
    return "En az 4 malzeme seçmelisiniz"
  }
  if (selectedToppings.length > 10) {
    return "En fazla 10 malzeme seçebilirsiniz"
  }
  return ""
}

export const validateForm = (formData) => {
  const errors = {}

  errors.name = validateName(formData.name)
  errors.size = validateSize(formData.size)
  errors.crust = validateCrust(formData.crust)
  errors.toppings = validateToppings(formData.toppings)

  return errors
}