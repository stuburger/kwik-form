---
id: overview
title: Yet. Another. Form. Library.
sidebar_label: Overview
--- 

Let's face it, form libraries are a dime a dozen. There's no shortage of options to choose from when picking out an abstration to help you with your daily form needs: there's `redux-form`, `formik`, `formsy-react`, `tcomb-form`, `react-form`, `react-final-form`... the list goes on. So what distinguishes **YAFL** from the rest? Yafl does some clever things under the hood (at least I think it does) but you don't - and shouldn't - care about any of that. Yafl tries to strike a balance between ergonomics, size, and performance. Yafl also aims to be the most playful form library on NPM!

## Motivation

I didn't build Yafl because I saw the need for yet another form library. Instead, Yafl started out as an idea that has evolved throughout development. It has gone through many iterations (I dare you to go through the commit history) and on a number of occations I almost had to start from the beginning when I realized that the current code structure didn't accommodate a specific use case. Validation in particular was handled in multiple wildly different ways before I stumbled on - for better or worse - the idea of rendering a Validator.

So there you have it, the motivation for the existence of this library was pretty much of the "eh, why not" variety as opposed to the often touted "I saw a need for it" variety. That said however, I've have found Yafl extremely fun and flexible over the last 2 years - even more so, I dare say, than the alternatives.

## Philosophy

Yafl's philosophy is to "keep it super simple". While it provides a lot of functionality out of the box, it aims to keep it's API surface area as small as possible while still remaining flexible and easy to use. At the start of Yafl's development, the decision was made to leave as much of the implementation of your form up to you, the developer. Yafl aims to provide the tools to build forms without caring too much about the specific use case.

You can write content using [GitHub-flavored Markdown syntax](https://github.github.com/gfm/).

## Why use YAFL?

* Use TypeScript to create strongly typed forms that give you peace of mind and a good nights sleep. 😴
* Create multi-page forms without needing to use specialized components or a state management library like flux or redux. 😮
* Structure your components to match the shape of your data. This means no more accessing field values using string paths! 🤯
* Deeply nested forms and forms within forms! 🎁
* Render an Error! 😱
* Opt out of using Yafl's internal implementation by keeping track of your own form state and only use Yafl's context as a means to intelligently distribute state to your Fields! 🚀
* Easily use third pary validation libraries like Yup - it just works!
* Flexible. 💪
* Fun. 😻

## Installation

```bash
npm i yafl --save
```

Or if you're using yarn
```bash
yarn add yafl
```

## Basic example

If you've used other form libraries most of this will feel familiar:

```js
import React, { useState } from 'react'
import { createFormContext } from 'yafl'

const { Form, Field, Section } = createFormContext()

function ExampleForm (props) {
  function handleSubmit(formValue) {
    console.log(formValue)
    // {
    //   fullName: '',
    //   contact: {
    //     email: '',
    //     address: {
    //       line1: '',
    //       postCode: ''
    //     }
    //   }
    // }
  }

  return (
    <Form initialValue={formData} onSubmit={handleSubmit}>
      {yafl => (
        <form onSubmit={yafl.submit}>
          <Field name="fullName" component="input" />
          <Section name="contact">
            <Field name="email" component="input" validate={validateEmail} />
            <Section name="address">
              <Field name="line1" component="input" />
              <Field name="postCode" component="input" />
            </Section>
          </Section>
          <button type="submit" disabled={!yafl.formIsDirty}>
            Submit Me!
          </button>
        </form>
      )}
    </Form>
  )
}
```