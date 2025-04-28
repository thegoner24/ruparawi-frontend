import { useState, useCallback, ChangeEvent } from 'react';

type ValidationFunction<T> = (value: T) => boolean;
type ValidationRule<T> = {
  validate: ValidationFunction<T>;
  errorMessage: string;
};

type FieldConfig<T> = {
  value: T;
  rules?: ValidationRule<T>[];
};

export type FormState<T> = {
  [K in keyof T]: {
    value: T[K];
    error: string | null;
    touched: boolean;
  };
};

export type FormErrors<T> = {
  [K in keyof T]?: string;
};

/**
 * Custom hook for form handling with validation
 * @param initialValues - Initial form values
 * @returns Form handling methods and state
 */
export function useForm<T extends Record<string, any>>(
  initialValues: { [K in keyof T]: FieldConfig<T[K]> }
) {
  // Initialize form state
  const initialState = Object.entries(initialValues).reduce(
    (acc, [key, config]) => {
      acc[key as keyof T] = {
        value: config.value,
        error: null,
        touched: false,
      };
      return acc;
    },
    {} as FormState<T>
  );

  const [formState, setFormState] = useState<FormState<T>>(initialState);

  // Validate a single field
  const validateField = useCallback(
    (name: keyof T, value: any): string | null => {
      const fieldRules = initialValues[name]?.rules || [];
      
      for (const rule of fieldRules) {
        if (!rule.validate(value)) {
          return rule.errorMessage;
        }
      }
      
      return null;
    },
    [initialValues]
  );

  // Handle input change
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;
      
      // Handle checkbox inputs
      const fieldValue = type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : value;
      
      const error = validateField(name as keyof T, fieldValue);
      
      setFormState((prev) => ({
        ...prev,
        [name]: {
          value: fieldValue,
          error,
          touched: true,
        },
      }));
    },
    [validateField]
  );

  // Set a field value programmatically
  const setFieldValue = useCallback(
    (name: keyof T, value: any) => {
      const error = validateField(name, value);
      
      setFormState((prev) => ({
        ...prev,
        [name]: {
          value,
          error,
          touched: true,
        },
      }));
    },
    [validateField]
  );

  // Validate all fields
  const validateForm = useCallback((): boolean => {
    let isValid = true;
    const newFormState = { ...formState };

    Object.keys(initialValues).forEach((key) => {
      const fieldName = key as keyof T;
      const currentValue = formState[fieldName].value;
      const error = validateField(fieldName, currentValue);

      if (error) {
        isValid = false;
      }

      newFormState[fieldName] = {
        ...newFormState[fieldName],
        error,
        touched: true,
      };
    });

    setFormState(newFormState);
    return isValid;
  }, [formState, initialValues, validateField]);

  // Reset form to initial values
  const resetForm = useCallback(() => {
    setFormState(initialState);
  }, [initialState]);

  // Get all form values
  const getValues = useCallback((): T => {
    return Object.entries(formState).reduce(
      (values, [key, field]) => {
        values[key as keyof T] = field.value;
        return values;
      },
      {} as T
    );
  }, [formState]);

  // Get all form errors
  const getErrors = useCallback((): FormErrors<T> => {
    return Object.entries(formState).reduce(
      (errors, [key, field]) => {
        if (field.error) {
          errors[key as keyof T] = field.error;
        }
        return errors;
      },
      {} as FormErrors<T>
    );
  }, [formState]);

  // Check if form has any errors
  const hasErrors = useCallback((): boolean => {
    return Object.values(formState).some((field) => field.error !== null);
  }, [formState]);

  return {
    formState,
    handleChange,
    setFieldValue,
    validateForm,
    resetForm,
    getValues,
    getErrors,
    hasErrors,
  };
}
