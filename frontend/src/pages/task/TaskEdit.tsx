import { useEffect, useState } from 'react';
import { Input, Form } from 'antd';
import { useNavigate, useParams } from 'react-router';

import { Popup } from '../../components/popup';
import { useUpdateTaskMutation } from '../../store/api';
import { getErrorMessage } from '../../utils';
import { useNotification } from '../../context';

const { TextArea } = Input;

export const TaskEditPage = () => {
  const [form] = Form.useForm();
  const params = useParams();
  const navigate = useNavigate();
  const [popup, setPopup] = useState({
    open: true,
    confirmLoading: false,
  });
  const api = useNotification();
  const [submit, updateTaskMutation] = useUpdateTaskMutation();

  const handleOk = () => {
    setPopup(prev => ({ ...prev, confirmLoading: true }));

    form.validateFields()
      .then(() => {
        return submit({
          taskId: params.taskId || '',
          body: {
            title: form.getFieldValue('title'),
            description: form.getFieldValue('description'),
          },
        });
      })
      .then(() => {
        setPopup(prev => ({ ...prev, open: false, confirmLoading: false }));
      })
      .catch(() => {
        setPopup(prev => ({ ...prev, confirmLoading: false }));
      });
  };

  const handleCancel = () => {
    setPopup(prev => ({ ...prev, open: false }));
    navigate(`/tasks/${params.taskId}`);
  };

  useEffect(() => {
    if (updateTaskMutation.isSuccess) {
      api.success({
        title: 'Task updated successfully',
        description: 'The task has been updated.',
      });

      navigate(`/tasks/${params.taskId}`);
    }
    if (updateTaskMutation.isError) {
      api.error({
        title: 'Task update failed',
        description: getErrorMessage(updateTaskMutation.error),
      });
    }
  }, [updateTaskMutation.isSuccess, updateTaskMutation.isError]);

  return (
    <Popup
      title="Edit Task"
      open={ popup.open }
      handleOk={ handleOk }
      handleCancel={ handleCancel }
      confirmLoading={ popup.confirmLoading }
    >
      <Form
        form={ form }
        layout="vertical"
        name="boardEdit"
        autoComplete="off"
      >
        <Form.Item
          label="Title"
          name="title"
          rules={ [{ required: true, message: 'Please input task title!' }] }
        >
          <Input size="large" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
        >
          <TextArea rows={ 4 } />
        </Form.Item>
      </Form>
    </Popup>
  );
};
