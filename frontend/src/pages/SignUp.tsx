import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button, Form, Input } from 'antd';
import { GoogleOutlined, UserOutlined } from '@ant-design/icons';

import { useSignUpMutation } from '../store/api';
import { useNotification } from '../context';
import { getErrorMessage } from '../utils';
import { API_URL } from '../store/api/base';

import type { IAuth } from '../interfaces';

export const SignUpPage = () => {
  const navigate = useNavigate();
  const api = useNotification();
  const [form] = Form.useForm();
  const [signUp, { isLoading, isSuccess, isError, error }] = useSignUpMutation();

  const onFinish = (values: IAuth) => {
    signUp(values);
  };

  useEffect(() => {
    if (isSuccess) {
      api.success({
        title: 'Sign up successful',
        description: 'You have been successfully signed up.',
      });

      navigate('/auth/sign-in');
    }

    if (isError) {
      api.error({
        title: 'Sign up failed',
        description: getErrorMessage(error),
      });
    }
  }, [isSuccess, isError]);

  const onGoogleAuth = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <>
      <h2 style={ { margin: 0 } }><UserOutlined style={ { fontSize: '3rem' } } /></h2>
      <h2>Sign Up</h2>
      <div className="sign-in-by">
        <Button
          onClick={ onGoogleAuth }
          shape="circle"
          icon={ <GoogleOutlined /> }
        />
      </div>
      <Form
        form={ form }
        name="sign-up"
        labelCol={ { span: 8 } }
        wrapperCol={ { span: 16 } }
        style={ { maxWidth: 600 } }
        initialValues={ { remember: true } }
        onFinish={ onFinish }
        autoComplete="off"
      >
        <Form.Item
          label="Name"
          name="name"
          rules={ [{ required: true, message: 'Please input your name!' }] }
        >
          <Input size="large" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={ [{ required: true, message: 'Please input your email!' }] }
        >
          <Input size="large" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={ [{ required: true, message: 'Please input your password!' }] }
        >
          <Input.Password size="large" />
        </Form.Item>

        <Form.Item label={ null }>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={ isLoading }
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
