/* eslint-disable react/sort-comp */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
import React, { Component } from 'react'
import { createFormContext } from 'yafl'
import Input from './Input'
import Select from './Select'
import { required, minLength, email, min } from './validators'
import FormatJson from './FormatJson'

const { Form, Section, Field, FormError, useYaflContext } = createFormContext()

const defaultValue = {
  fullName: '',
  age: 0,
  contact: {
    tel: '',
    email: '',
    address: {
      streetNo: '',
    },
  },
}

class DemoForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fetching: false,
      submitting: false,
      formData: defaultValue,
      asyncValidating: false,
      asyncEmailError: null,
    }

    this.setFormData = this.setFormData.bind(this)
    this.onFormValueChange = this.onFormValueChange.bind(this)
    this.validateEmailAsync = this.validateEmailAsync.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    this.setState({ fetching: true })
    this.setFormData({ ...defaultValue })
  }

  setFormData(formData) {
    this.setState({ formData, fetching: false, submitting: false })
    return formData
  }

  onFormValueChange(prev, next) {
    const currValue = next.contact.email
    const prevValue = prev.contact.email
    if (prevValue !== currValue) {
      this.validateEmailAsync(currValue)
    }
  }

  validateEmailAsync(emailAddress) {
    this.setState({ asyncValidating: true })
    setTimeout(() => {
      if (emailAddress === 'admin@admin.com') {
        this.setState({ asyncEmailError: 'Nice try!', asyncValidating: false })
      } else {
        this.setState({ asyncEmailError: null, asyncValidating: false })
      }
    }, 1000)
  }

  handleSubmit(formValue, { formIsValid, formIsDirty }) {
    if (!formIsValid) {
      return true
    }

    if (!formIsDirty) {
      // returning faluse will cause the submitCount value to remain unchanged
      return false
    }
    this.setState({ submitting: true })
    setTimeout(() => {
      this.setFormData(formValue)
      // this.setState({ submitting: false })
    }, 1000)

    return true
  }

  render() {
    const { formData, fetching, submitting, asyncEmailError, asyncValidating } = this.state
    return (
      <Form
        initialValue={formData}
        submitUnregisteredValues
        onSubmit={this.handleSubmit}
        onFormValueChange={this.onFormValueChange}
      >
        {(yafl) => {
          return (
            <form
              onSubmit={(e) => {
                yafl.submit()
                e.preventDefault()
              }}
            >
              <div className="row">
                <div className="col col--4">
                  <p className="hero__subtitle">Form Value</p>
                  <FormatJson value={yafl.formValue} />
                </div>
                <div className="col col--4">
                  <p className="hero__subtitle">Demo Form</p>
                  <Field
                    name="fullName"
                    label="Full Name"
                    placeholder="E.g. John Smith"
                    validate={[required, minLength(3)]}
                    component={Input}
                  />
                  <Field
                    name="age"
                    type="number"
                    parse={Number.parseInt}
                    label="Age"
                    validate={[required, min(5, 'Must be at least 5 years old!')]}
                    placeholder="E.g. 29"
                    component={Input}
                  />
                  <Section name="contact">
                    <Field
                      name="email"
                      label="Email"
                      placeholder="E.g. example@email.com"
                      validate={[required, email()]}
                      component={Input}
                      busy={asyncValidating}
                    />
                    <FormError path="contact.email" msg={asyncEmailError} />
                    <Section name="address">
                      <Field
                        name="postalCode"
                        label="Postal Code"
                        placeholder="Postal Code"
                        component={Input}
                      />
                    </Section>
                  </Section>
                  <Submit submitting={submitting} fetching={fetching} />
                </div>

                <div className="col col--4">
                  <p className="hero__subtitle">Meta State</p>
                  <FormatJson
                    value={{
                      activeField: yafl.activeField,
                      submitCount: yafl.submitCount,
                      errorCount: yafl.errorCount,
                      formIsValid: yafl.formIsValid,
                      formIsDirty: yafl.formIsDirty,
                      touched: yafl.touched,
                    }}
                  />
                </div>
                <div className="col col--12">
                  <p className="hero__subtitle">Errors</p>
                  <FormatJson value={{ errors: yafl.errors }} />
                </div>
              </div>
            </form>
          )
        }}
      </Form>
    )
  }
}

export default DemoForm

const Submit = ({ fetching, submitting }) => {
  const yafl = useYaflContext()
  return (
    <button
      type="submit"
      className="button button--outline button--primary text--right"
      disabled={fetching || submitting}
    >
      {fetching
        ? 'Loading ⏳'
        : submitting
        ? 'Saving ⏳'
        : yafl.formIsDirty
        ? 'Save 🚀'
        : 'Saved 👍'}
    </button>
  )
}
