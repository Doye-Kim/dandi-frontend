import { useEffect, useState } from 'react';

interface UseFormProps<T> {
  initialValue: T;
  validate: (values: T) => Record<keyof T, string>;
}

function useForm<T>({ initialValue, validate }: UseFormProps<T>) {
  const [values, setValues] = useState(initialValue);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChangeText = (name: keyof T, text: string) => {
    setValues({
      ...values,
      [name]: text,
    });
  };

  const handleBlur = (name: keyof T) => {
    const cleanedValue = values[name]?.toString().replace(/[\s\r\n]/g, '');

    setTouched({
      ...touched,
      [name]: true,
    });

    setValues({
      ...values,
      [name]: cleanedValue,
    });
  };

  const getTextInputProps = (name: keyof T) => {
    const value = values[name];
    const onChangeText = (text: string) => handleChangeText(name, text);
    const onBlur = () => handleBlur(name);

    return { value, onChangeText, onBlur };
  };

  useEffect(() => {
    const newErrors = validate(values);
    setErrors(newErrors);
  }, [validate, values]);

  const reset = () => {
    setValues(initialValue);
    setTouched({});
    setErrors({});
  };

  return { values, errors, touched, getTextInputProps, reset };
}

export default useForm;
