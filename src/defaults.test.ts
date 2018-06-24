import { noop, getDefaultProviderValue } from './defaults'

const expected = {
  path: [],
  value: {},
  submitCount: 0,
  formIsValid: true,
  formIsDirty: false,
  initialMount: false,
  formIsTouched: false,
  formValue: {},
  initialValue: {},
  defaultValue: {},
  componentTypes: {},
  activeField: null,
  touched: {},
  visited: {},
  allErrors: {},
  formErrors: {},
  fieldErrors: {},
  registeredFields: {},
  commonFieldProps: {},
  submit: noop,
  setErrors: noop,
  resetForm: noop,
  setValue: noop,
  clearForm: noop,
  setTouched: noop,
  setVisited: noop,
  touchField: noop,
  forgetState: noop,
  visitField: noop,
  setFormValue: noop,
  registerField: noop,
  setActiveField: noop,
  unregisterField: noop,
  unwrapFormState: noop
}

describe('default provider props which are present if a Field or Section component are rendered outside the Form Provider', () => {
  const result = getDefaultProviderValue()

  it('should throw for all functions', () => {
    Object.keys(result).forEach(key => {
      const maybeFunc: any = (result as any)[key]
      if (typeof maybeFunc === 'function') {
        expect(() => maybeFunc()).toThrow(
          'A <Field /> component can only appear inside a <Form /> component'
        )
      }
    })
  })

  it('should match expected value', () => {
    expect(result).toEqual(expected)
  })
})