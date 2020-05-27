import * as Yup from 'yup';

import React from 'react';
import { useFormik } from 'formik';

export const LoginForm = (props) => {
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .max(15, 'Must be 15 characters or less')
        .min(5, 'Must be at least 5 characters')
        .required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
    }),
    onSubmit: (values) => {
      props.userLoginFetch(values);
    },
  });
  return (
    <form onSubmit={formik.handleSubmit}>
      <h1 style={{ 'font-size': '50px' }}>Log In</h1>

      <h2>Email</h2>
      <input
        name="email"
        placeholder="somebody@example.com"
        {...formik.getFieldProps('email')}
      />
      {formik.touched.email && formik.errors.email ? (
        <div>{formik.errors.email}</div>
      ) : null}

      <h2>Password</h2>
      <input
        name="password"
        placeholder="********"
        type="password"
        {...formik.getFieldProps('password')}
      />
      {formik.touched.password && formik.errors.password ? (
        <div>{formik.errors.password}</div>
      ) : null}
      {props.errorMessage && (
        <div>{props.errorMessage}</div>
      )}
      <br />
      <button type="submit">
        Login
      </button>
    </form>
  );
};