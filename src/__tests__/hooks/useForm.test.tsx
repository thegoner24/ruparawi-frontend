import { renderHook, act } from '@testing-library/react';
import { useForm } from '../../hooks/useForm';
import { isValidEmail, isNotEmpty, isWithinLength } from '../../utils/validation';

describe('useForm Hook', () => {
  // Define a simple form for testing
  const initialValues = {
    name: {
      value: '',
      rules: [
        {
          validate: (value: string) => isNotEmpty(value),
          errorMessage: 'Name is required',
        },
        {
          validate: (value: string) => isWithinLength(value, 2, 50),
          errorMessage: 'Name must be between 2 and 50 characters',
        },
      ],
    },
    email: {
      value: '',
      rules: [
        {
          validate: (value: string) => isNotEmpty(value),
          errorMessage: 'Email is required',
        },
        {
          validate: (value: string) => isValidEmail(value),
          errorMessage: 'Email is not valid',
        },
      ],
    },
    agreeToTerms: {
      value: false,
      rules: [
        {
          validate: (value: boolean) => value === true,
          errorMessage: 'You must agree to the terms',
        },
      ],
    },
  };

  it('initializes with correct initial values', () => {
    const { result } = renderHook(() => useForm(initialValues));
    
    expect(result.current.formState.name.value).toBe('');
    expect(result.current.formState.email.value).toBe('');
    expect(result.current.formState.agreeToTerms.value).toBe(false);
    
    expect(result.current.formState.name.error).toBeNull();
    expect(result.current.formState.email.error).toBeNull();
    expect(result.current.formState.agreeToTerms.error).toBeNull();
    
    expect(result.current.formState.name.touched).toBe(false);
    expect(result.current.formState.email.touched).toBe(false);
    expect(result.current.formState.agreeToTerms.touched).toBe(false);
  });

  it('updates field value and validates on change', () => {
    const { result } = renderHook(() => useForm(initialValues));
    
    // Simulate input change for name field
    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'John', type: 'text' },
      } as any);
    });
    
    expect(result.current.formState.name.value).toBe('John');
    expect(result.current.formState.name.error).toBeNull();
    expect(result.current.formState.name.touched).toBe(true);
    
    // Simulate input change for email field with invalid email
    act(() => {
      result.current.handleChange({
        target: { name: 'email', value: 'invalid-email', type: 'text' },
      } as any);
    });
    
    expect(result.current.formState.email.value).toBe('invalid-email');
    expect(result.current.formState.email.error).toBe('Email is not valid');
    expect(result.current.formState.email.touched).toBe(true);
    
    // Simulate checkbox change
    act(() => {
      result.current.handleChange({
        target: { name: 'agreeToTerms', checked: true, type: 'checkbox' },
      } as any);
    });
    
    expect(result.current.formState.agreeToTerms.value).toBe(true);
    expect(result.current.formState.agreeToTerms.error).toBeNull();
    expect(result.current.formState.agreeToTerms.touched).toBe(true);
  });

  it('validates the entire form correctly', () => {
    const { result } = renderHook(() => useForm(initialValues));
    
    // Initially the form should be invalid
    let isValid;
    act(() => {
      isValid = result.current.validateForm();
    });
    
    expect(isValid).toBe(false);
    expect(result.current.formState.name.error).toBe('Name is required');
    expect(result.current.formState.email.error).toBe('Email is required');
    expect(result.current.formState.agreeToTerms.error).toBe('You must agree to the terms');
    
    // Fill in valid values
    act(() => {
      result.current.setFieldValue('name', 'John Doe');
      result.current.setFieldValue('email', 'john@example.com');
      result.current.setFieldValue('agreeToTerms', true);
    });
    
    // Now the form should be valid
    act(() => {
      isValid = result.current.validateForm();
    });
    
    expect(isValid).toBe(true);
    expect(result.current.formState.name.error).toBeNull();
    expect(result.current.formState.email.error).toBeNull();
    expect(result.current.formState.agreeToTerms.error).toBeNull();
  });

  it('resets the form to initial values', () => {
    const { result } = renderHook(() => useForm(initialValues));
    
    // Change some values
    act(() => {
      result.current.setFieldValue('name', 'John Doe');
      result.current.setFieldValue('email', 'john@example.com');
    });
    
    // Reset the form
    act(() => {
      result.current.resetForm();
    });
    
    // Values should be back to initial state
    expect(result.current.formState.name.value).toBe('');
    expect(result.current.formState.email.value).toBe('');
    expect(result.current.formState.agreeToTerms.value).toBe(false);
    
    expect(result.current.formState.name.touched).toBe(false);
    expect(result.current.formState.email.touched).toBe(false);
    expect(result.current.formState.agreeToTerms.touched).toBe(false);
  });

  it('gets all form values correctly', () => {
    const { result } = renderHook(() => useForm(initialValues));
    
    // Set some values
    act(() => {
      result.current.setFieldValue('name', 'John Doe');
      result.current.setFieldValue('email', 'john@example.com');
      result.current.setFieldValue('agreeToTerms', true);
    });
    
    // Get all values
    const values = result.current.getValues();
    
    expect(values).toEqual({
      name: 'John Doe',
      email: 'john@example.com',
      agreeToTerms: true,
    });
  });

  it('gets all form errors correctly', () => {
    const { result } = renderHook(() => useForm(initialValues));
    
    // Validate the form to generate errors
    act(() => {
      result.current.validateForm();
    });
    
    // Get all errors
    const errors = result.current.getErrors();
    
    expect(errors).toEqual({
      name: 'Name is required',
      email: 'Email is required',
      agreeToTerms: 'You must agree to the terms',
    });
  });

  it('checks if form has errors correctly', () => {
    const { result } = renderHook(() => useForm(initialValues));
    
    // Initially there are no errors because validation hasn't run
    expect(result.current.hasErrors()).toBe(false);
    
    // Validate the form to generate errors
    act(() => {
      result.current.validateForm();
    });
    
    // Now there should be errors
    expect(result.current.hasErrors()).toBe(true);
    
    // Fill in valid values
    act(() => {
      result.current.setFieldValue('name', 'John Doe');
      result.current.setFieldValue('email', 'john@example.com');
      result.current.setFieldValue('agreeToTerms', true);
    });
    
    // Now there should be no errors
    expect(result.current.hasErrors()).toBe(false);
  });
});
