import * as React from 'react'
import isEqual from 'react-fast-compare'
import get from 'lodash.get'
import memoize from 'memoize-one'
import {
  toStrPath,
  getErrors,
  getMaxArgLength,
  getArgLength,
  shouldValidateSection,
  validateName
} from './utils'
import { Name, FormProvider, FieldValidator, SectionValidateOn } from './sharedTypes'

export interface ArrayHelpers<T> {
  push: (value: T) => void
}

export interface ForkProviderConfig<F extends object, T> extends FormProvider<F, T[]> {
  name: Name
  validate?: FieldValidator<F, T[]>
  validateOn: SectionValidateOn<F, T[]>
  children: ((value: T[], utils: ArrayHelpers<T>) => React.ReactNode)
}

const listenForProps: (keyof ForkProviderConfig<any, any>)[] = [
  'value',
  'touched',
  'visited',
  'validate',
  'validateOn',
  'formErrors',
  'fieldErrors',
  'activeField',
  'submitCount'
]

function createForkProvider<F extends object>(Provider: React.Provider<FormProvider<F, any>>) {
  return class ForkProvider<T> extends React.Component<ForkProviderConfig<F, T>> {
    constructor(props: ForkProviderConfig<F, T>) {
      super(props)
      this.push = this.push.bind(this)
      this.registerField = this.registerField.bind(this)
      this.setErrorsIfNeeded = this.setErrorsIfNeeded.bind(this)
      this.registerFieldIfNeeded = this.registerFieldIfNeeded.bind(this)
      this.registerField()
    }

    shouldComponentUpdate(np: ForkProviderConfig<F, T>) {
      return (
        getMaxArgLength(np.validate) === 3 ||
        getArgLength(np.validateOn) === 2 ||
        listenForProps.some(key => !isEqual(np[key], this.props[key]))
      )
    }

    componentDidUpdate(pp: ForkProviderConfig<F, T>) {
      this.registerFieldIfNeeded()
      this.setErrorsIfNeeded(pp)
    }

    componentWillUnmount() {
      const { unregisterField, path } = this.props
      unregisterField(path)
    }

    getErrors = memoize(getErrors)

    shouldValidate = memoize(shouldValidateSection)

    registerFieldIfNeeded() {
      const { registeredFields, path } = this.props
      if (!registeredFields[toStrPath(path)]) {
        this.registerField()
      }
    }

    setErrorsIfNeeded(pp: ForkProviderConfig<F, T>) {
      const { path, name, formValue, value, validate, validateOn, unwrapFormState } = this.props
      if (
        this.shouldValidate(
          value,
          this.props.initialValue,
          this.props.touched,
          this.props.visited,
          this.props.submitCount,
          getArgLength(validateOn) === 2 && unwrapFormState(),
          this.props.validate,
          this.props.validateOn
        )
      ) {
        const errors = this.getErrors(value, formValue, name, validate)
        if (!isEqual(get(pp.fieldErrors, '_errors'), errors)) {
          this.props.setErrors(path.concat(['_errors']), errors)
        }
      }
    }

    registerField() {
      const { path, registerField } = this.props
      registerField(path, 'section')
    }

    push(valueToPush: T) {
      const { setValue, value, path } = this.props
      setValue(path, [...value, valueToPush], false)
    }

    render() {
      const { name, children, ...props } = this.props

      return (
        <Provider value={props}>
          {typeof children === 'function' ? children(props.value, { push: this.push }) : children}
        </Provider>
      )
    }
  }
}

export interface ArraySectionConfig<F extends object, T> {
  name: Name
  fallback?: T[]
  validateOn?: SectionValidateOn<F, T[]>
  validate?: FieldValidator<F, T[]>
  children: ((value: T[], utils: ArrayHelpers<T>) => React.ReactNode)
}

export default function<F extends object>(
  Provider: React.Provider<FormProvider<F, F>>,
  Consumer: React.Consumer<FormProvider<F, F>>
) {
  const InnerComponent = createForkProvider<F>(Provider)

  return class Section<T extends object> extends React.PureComponent<ArraySectionConfig<F, T>> {
    constructor(props: ArraySectionConfig<F, T>) {
      super(props)
      this._render = this._render.bind(this)
    }

    _render(incomingProps: FormProvider<F, any>) {
      const { children, name, validate, validateOn = 'submit', fallback } = this.props
      const {
        path,
        value,
        touched,
        visited,
        allErrors,
        formErrors,
        fieldErrors,
        defaultValue,
        initialValue,
        ...props
      } = incomingProps

      return (
        <InnerComponent<T>
          key={name}
          {...props}
          name={name}
          validate={validate}
          validateOn={validateOn}
          value={get(value, name, fallback)}
          path={path.concat(name)}
          touched={get(touched, name)}
          visited={get(visited, name)}
          initialValue={initialValue[name]}
          defaultValue={defaultValue[name]}
          allErrors={Object(allErrors)[name]}
          formErrors={Object(formErrors)[name]}
          fieldErrors={Object(fieldErrors)[name]}
        >
          {children}
        </InnerComponent>
      )
    }

    render() {
      validateName(this.props.name)
      return <Consumer>{this._render}</Consumer>
    }
  }
}
