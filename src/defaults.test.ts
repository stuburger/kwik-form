import { noop, getDefaultProviderValue } from './defaults'

const expected = {
  path: [],
  value: {},
  submitCount: 0,
  formIsValid: true,
  formIsDirty: false,
  initialMount: false,
  formValue: {},
  initialValue: {},
  defaultValue: {},
  components: {},
  branchProps: {},
  activeField: null,
  touched: {},
  visited: {},
  errors: {},
  errorCount: 0,
  sharedProps: {},
  submit: noop,
  resetForm: noop,
  setValue: noop,
  clearForm: noop,
  setFormTouched: noop,
  setFormVisited: noop,
  touchField: noop,
  forgetState: noop,
  visitField: noop,
  setFormValue: noop,
  registerError: noop,
  unregisterError: noop,
  registerField: noop,
  setActiveField: noop,
  unregisterField: noop
}

describe('default provider props which are present if a Field or Section component are rendered outside the Form Provider', () => {
  const result = getDefaultProviderValue()

  it('should throw for all functions', () => {
    Object.keys(result).forEach(key => {
      const maybeFunc: any = (result as any)[key]
      if (typeof maybeFunc === 'function') {
        expect(() => maybeFunc()).toThrow(
          'A Consumer component can only appear inside a <Form /> (Provider) component that belongs to the same context.'
        )
      }
    })
  })

  it('should match expected value', () => {
    expect(result).toEqual(expected)
  })
})
