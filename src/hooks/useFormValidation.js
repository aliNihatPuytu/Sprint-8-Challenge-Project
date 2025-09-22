import { useState } from "react";
import { validateForm } from "../utils/validation";

export const useFormValidation = (initialState) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    
    if (touched[field] && errors[field]) {
      const validationErrors = validateForm({...formData, [field]: value});
      setErrors(prev => ({...prev, [field]: validationErrors[field]}));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({...prev, [field]: true}));
    const validationErrors = validateForm(formData);
    setErrors(prev => ({...prev, [field]: validationErrors[field]}));
  };

  const validateAll = () => {
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);


    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);


    return Object.values(validationErrors).every(error => error === "");
  };

  const resetForm = () => {
    setFormData(initialState);
    setErrors({});
    setTouched({});
  };

  return {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    resetForm,
    setFormData
  };
};