import * as React from 'react'
import * as PropTypes from 'prop-types'
import { Path, FormProvider } from './sharedTypes'
import invariant from 'invariant'

export type InnerValidatorProps<F extends object> = FormProvider<F> & {
  msg: string
}

export class InnerError<F extends object> extends React.Component<InnerValidatorProps<F>> {
  componentDidMount() {
    const { registerError, path, msg } = this.props
    invariant(
      path && path.length > 0,
      "Invalid path. The 'path' prop on the Validator component is required when rendering a Validator " +
        'outside of the component hierarchy of any Field, Section or Repeat components. ' +
        'It is likely that you are seeing this message because you are ' +
        'rendering a Validator as a direct child of your Form component.'
    )
    registerError(path, msg)
  }

  componentWillUnmount() {
    const { unregisterError, path, msg } = this.props
    unregisterError(path, msg)
  }

  render() {
    return null
  }
}

export interface ValidatorProps {
  msg?: string | null | void
  path?: Path | null
}

const stringOrNumber = PropTypes.oneOfType([
  PropTypes.string.isRequired,
  PropTypes.number.isRequired
]).isRequired

export default function createValidator<F extends object>(
  context: React.Context<FormProvider<F, any>>
): React.ComponentType<ValidatorProps> {
  return class Validator extends React.PureComponent<ValidatorProps> {
    context!: FormProvider<F, any>

    static contextType = context
    static propTypes = {
      msg: PropTypes.string,
      path: PropTypes.arrayOf(stringOrNumber)
    }

    render() {
      const { msg, path, children } = this.props
      const ctx = this.context
      return typeof msg === 'string' ? (
        <InnerError<F> key={msg + path} {...ctx} msg={msg} path={path || ctx.path} />
      ) : (
        children || null
      )
    }
  }
}
