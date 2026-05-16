import { useEffect } from 'react'
import { Outlet, useMatches, useNavigate, type UIMatch } from 'react-router'
import { Layout, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useSignOutMutation } from '../../store/api'
import { Logo } from '../../components/logo'
import { getErrorMessage } from '../../utils'
import { useNotification } from '../../context'
import { CreateType } from '../../interfaces/enums'

import './style.scss'

const { Header, Content, Footer } = Layout

export const DashboardLayout = () => {
  const matches = useMatches() as UIMatch<
    unknown,
    { createType?: CreateType }
  >[]
  const navigate = useNavigate()
  const api = useNotification()
  const [submitSignOut, payloadSignOut] = useSignOutMutation()

  const lastMatch = matches[matches.length - 1]

  const isShowCreateBtn = !!lastMatch.handle?.createType

  const handleCreate = () => {
    if (lastMatch?.handle?.createType === CreateType.TASK) {
      navigate('/tasks/create')
    }
    if (lastMatch?.handle?.createType === CreateType.BOARD) {
      navigate('/boards/create')
    }
  }

  const handleSignOut = () => {
    submitSignOut()
  }

  useEffect(() => {
    if (payloadSignOut.isSuccess) {
      api.success({
        title: 'You have been signed out',
        description: 'Task workflow has been successfully updated.',
      })

      navigate('auth/sign-in')
    }

    if (payloadSignOut.isError) {
      api.error({
        title: 'Sign Out Failed',
        description: getErrorMessage(payloadSignOut.error),
      })
    }
  }, [payloadSignOut.isSuccess, payloadSignOut.isError])

  return (
    <Layout className="tasks-manager dashboard-layout">
      <Header className="tasks-manager__header">
        <Logo
          className="tasks-manager__header-logo"
          onClick={() => navigate('/')}
        />
        {isShowCreateBtn && (
          <Button
            type="primary"
            size="large"
            color="orange"
            variant="solid"
            icon={<PlusOutlined />}
            className="tasks-manager__header-btn dashboard-layout__header-btn-create"
            onClick={handleCreate}
          >
            Create
          </Button>
        )}

        <Button
          type="primary"
          size="large"
          color="default"
          variant="outlined"
          ghost
          className="tasks-manager__header-btn dashboard-layout__header-btn-logout"
          onClick={handleSignOut}
        >
          Logout
        </Button>
      </Header>
      <Content className="tasks-manager__content">
        <Outlet />
      </Content>
      <Footer className="tasks-manager__footer">
        Tasks Manager ©2026 Created by Yehor
      </Footer>
    </Layout>
  )
}
