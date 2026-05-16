import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Input, Form, Button, Select } from 'antd'
import { useNotification } from '../../context'
import { useСreateTaskMutation } from '../../store/api'
import { getErrorMessage } from '../../utils'

const { TextArea } = Input

export const TaskCreatePage = () => {
  const [form] = Form.useForm()
  const params = useParams()
  const navigate = useNavigate()
  const api = useNotification()
  const [submit, createTaskMutation] = useСreateTaskMutation()

  const onFinish = () => {
    form.validateFields().then(() => {
      return submit({
        title: form.getFieldValue('title'),
        description: form.getFieldValue('description'),
        boardId: '',
      })
    })
  }

  useEffect(() => {
    if (createTaskMutation.isSuccess) {
      api.success({
        title: 'Task created successfully',
        description: 'The task has been created.',
      })

      navigate(`/tasks/${params.taskId}`)
    }
    if (createTaskMutation.isError) {
      api.error({
        title: 'Task creation failed',
        description: getErrorMessage(createTaskMutation.error),
      })
    }
  }, [createTaskMutation.isSuccess, createTaskMutation.isError])

  return (
    <>
      <div className="tasks-manager__content-container task-view-page">
        <h2 className="tasks-manager__content-title task-view-page__title">
          Create Task
        </h2>
        <div className="tasks-manager__content-body task-view-page__content">
          <Form
            form={form}
            layout="vertical"
            name="boardEdit"
            autoComplete="off"
            onFinish={onFinish}
            className="task-view-page__content-form"
          >
            <Form.Item
              label="Select a board"
              name="board"
              rules={[{ required: true, message: 'Please select a board!' }]}
            >
              <Select
                showSearch={{
                  filterOption: (input, option) =>
                    (option?.label ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase()),
                }}
                placeholder=""
                options={[
                  { value: '1', label: 'Board #1' },
                  { value: '2', label: 'Board #2' },
                  { value: '3', label: 'Board #3' },
                ]}
                size="large"
                className="task-view-page__content-form-select"
              />
            </Form.Item>

            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: 'Please input task title!' }]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item label="Description" name="description">
              <TextArea rows={4} />
            </Form.Item>

            <Form.Item label={null}>
              <Button type="primary" htmlType="submit" size="large">
                Create
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  )
}
