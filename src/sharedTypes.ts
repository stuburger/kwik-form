/* @internal */
export interface Noop {
  (): never
}

/* @internal */
export interface Person {
  name: string
  surname: string
  age: number
  gender: string
  contact: Contact
  favorites: string[]
}

/* @internal */
export interface Contact {
  tel: string
}

export type Nullable<T> = { [P in keyof T]: T[P] | null }

export interface Provider<T, P extends keyof T = keyof T> {
  fields: FormFieldState<T>
  initialValue: T
  loaded: boolean
  submitting: boolean
  isBusy: boolean
  formIsTouched: boolean
  formIsValid: boolean
  formIsDirty: boolean
  unload: (() => void)
  getFormValue: () => T
  forgetState: (() => void)
  submit: (() => void)
  resetForm: (() => void)
  submitCount: number
  clearForm: (() => void)
  validation: { [K in keyof T]: string[] }
  registerValidator: (<K extends keyof T>(fieldName: K, validators: Validator<T, K>[]) => void)
  registerField: (<K extends P>(
    fieldName: K,
    initialValue: T[K],
    validators: Validator<T, K>[]
  ) => void)
  onFieldBlur: (<K extends P>(fieldName: K) => void)
  setFieldValue: (<K extends P>(fieldName: K, value: T[K]) => void)
  setFieldValues: (partialUpdate: Partial<T>) => void
  touchField: (<K extends P>(fieldName: K | keyof T) => void)
  untouchField: (<K extends P>(fieldName: K | keyof T) => void)
  touchFields: (fieldNames: (keyof T)[]) => void
  untouchFields: (fieldNames: (keyof T)[]) => void
}

export interface FieldState<T> {
  value: T
  didBlur: boolean
  touched: boolean
  originalValue: T
}

export type FormFieldState<T> = { [K in keyof T]: FieldState<T[K]> }

export interface Validator<T, K extends keyof T = keyof T> {
  // FieldState is actually not what should be passed into here. it needs to contain isDirty value
  (value: FieldState<T[K]>, fields: FormFieldState<T>, fieldName: K): string | undefined
}

export type FormProviderState<T> = {
  fields: FormFieldState<T>
  initialValue: T
  isBusy: boolean
  loaded: boolean
  submitting: boolean
  submitCount: number
}

export interface FormProviderConfig<T> {
  initialValue?: T
  submit?: (formValue: Nullable<T>) => void
  children: React.ReactNode
  loaded?: boolean
  submitting?: boolean
  allowReinitialize?: boolean
  rememberStateOnReinitialize?: boolean
}

export interface FieldUtils<T, P extends keyof T> {
  resetForm: () => void
  getFormValue: () => T
  unload: () => void
  submit: () => void
  setFieldValue: <K extends P>(fieldName: K, value: T[K]) => void
  setFieldValues: (partialUpdate: Partial<T>) => void
  forgetState: () => void
  clearForm: () => void
  touch: <K extends keyof T>(fieldNames?: K | (keyof T)[]) => void
  untouch: <K extends keyof T>(fieldNames?: K | (keyof T)[]) => void
  setValue: (value: T[P]) => void
}

export interface InnerFieldProps<T, K extends keyof T = keyof T> {
  name: K
  initialValue?: T[K]
  validators: Validator<T, K>[]
  render?: (state: FieldProps<T, K>) => React.ReactNode
  component?: React.ComponentType<FieldProps<T, K>>
  provider: Provider<T, K>
  forwardProps: { [key: string]: any }
  field: FieldState<T[K]>
}

export interface FieldMeta<T, K extends keyof T> {
  didBlur: boolean
  isDirty: boolean
  touched: boolean
  submitCount: number
  loaded: boolean
  submitting: boolean
  isValid: boolean
  messages: string[]
  originalValue: T[K]
}

export interface InputProps<T, K extends keyof T> {
  name: K
  value: T[K]
  onBlur: (e: any) => void
  onChange: (e: any) => void
}

export interface FieldProps<T, K extends keyof T> {
  input: InputProps<T, K>
  meta: FieldMeta<T, K>
  utils: FieldUtils<T, K>
  [key: string]: any
}

export interface BaseFieldConfig<T, K extends keyof T> {
  initialValue?: T[K]
  validators?: Validator<T, K>[]
  render?: (state: FieldProps<T, K>) => React.ReactNode
  component?: React.ComponentType<FieldProps<T, K>>
  [key: string]: any
}

export interface FieldConfig<T, K extends keyof T = keyof T> extends BaseFieldConfig<T, K> {
  name: K
}

export interface ComponentConfig<T, K extends keyof T = keyof T> {
  render?: (state: ComponentProps<T, K>) => React.ReactNode
  component?: React.ComponentType<ComponentProps<T, K>>
  [key: string]: any
}

export interface FormUtils<T, P extends keyof T> {
  touch: (<K extends P>(fieldName: K | (keyof T)[]) => void)
  untouch: (<K extends P>(fieldName: K | (keyof T)[]) => void)
  resetForm: () => void
  getFormValue: () => T
  unload: () => void
  submit: () => void
  setFieldValue: <K extends P>(fieldName: K, value: T[K]) => void
  setFieldValues: (partialUpdate: Partial<T>) => void
  forgetState: () => void
  clearForm: () => void
}

export interface FormMeta<T> {
  initialValue: T
  isDirty: boolean
  touched: boolean
  submitCount: number
  loaded: boolean
  submitting: boolean
  isValid: boolean
  validation: { [K in keyof T]: string[] }
}

export interface ComponentProps<T, K extends keyof T = keyof T> {
  utils: FormUtils<T, K>
  state: FormMeta<T>
  [key: string]: any
}
