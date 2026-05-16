import { Outlet, useNavigate } from 'react-router'
import { Layout, Button } from 'antd'
import { Logo } from '../../components/logo'

import './style.scss'

const { Header, Content, Footer } = Layout

export const AuthLayout = () => {
  const navigate = useNavigate()

  return (
    <Layout className="tasks-manager auth-layout">
      <Header className="tasks-manager__header">
        <Logo
          className="tasks-manager__header-logo"
          onClick={() => navigate('/')}
        />
        <Button
          type="primary"
          size="large"
          color="green"
          variant="solid"
          className="tasks-manager__header-btn auth-layout__header-btn auth-layout__header-btn-sign-in"
          onClick={() => navigate('/auth/sign-in')}
        >
          Sign In
        </Button>
        <Button
          type="primary"
          size="large"
          color="default"
          variant="outlined"
          ghost
          className="tasks-manager__header-btn auth-layout__header-btn auth-layout__header-btn-sign-up"
          onClick={() => navigate('/auth/sign-up')}
        >
          Sign Up
        </Button>
      </Header>
      <Content className="tasks-manager__content auth-layout__content">
        <Outlet />
      </Content>
      <Footer className="tasks-manager__footer">Tasks Manager</Footer>
    </Layout>
  )
}
