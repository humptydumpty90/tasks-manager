import { useEffect } from 'react';
import { Button, Form, Input } from 'antd';
import { GoogleOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';

import { useSignInMutation } from '../store/api';
import { useNotification } from '../context';
import { getErrorMessage } from '../utils';
import { API_URL } from '../store/api/base';

import type { IAuth } from '../interfaces';

export const SignInPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const api = useNotification();
  const [signIn, { isLoading, isError, isSuccess, error }] = useSignInMutation();

  const onFinish = (values: Omit<IAuth, 'name'>) => {
    signIn(values);

    form.resetFields();
  };

  useEffect(() => {
    if (isSuccess) {
      api.success({
        title: 'Sign in successful',
        description: 'You have been successfully signed in.',
      });

      navigate('/boards');
    }
    if (isError) {
      api.error({
        title: 'Sign in failed',
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
      <h2>Sign In</h2>
      <div className="sign-in-by">
        <Button
          onClick={ onGoogleAuth }
          shape="circle"
          icon={ <GoogleOutlined /> }
        />
      </div>
      <Form
        form={ form }
        name="sign-in"
        labelCol={ { span: 8 } }
        wrapperCol={ { span: 16 } }
        style={ { maxWidth: 600 } }
        initialValues={ { remember: true } }
        onFinish={ onFinish }
        autoComplete="off"
      >
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
