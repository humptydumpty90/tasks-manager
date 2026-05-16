import { useEffect, useState } from 'react';
import { Form, Input } from 'antd';
import { useNavigate, useParams } from 'react-router';
import { Popup } from '../../components/popup';
import { useEditBoardMutation } from '../../store/api';
import { useNotification } from '../../context';
import { getErrorMessage } from '../../utils';

const { TextArea } = Input;

export const BoardEditPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const params = useParams();
  const [popup, setPopup] = useState({
    open: true,
    confirmLoading: false,
  });
  const [submit, { isSuccess, isError, error }] = useEditBoardMutation();
  const api = useNotification();

  const handleOk = () => {
    setPopup(prev => ({ ...prev, confirmLoading: true }));

    form.validateFields()
      .then(() => {
        return submit({
          boardId: params.boardId || '',
          body: {
            name: form.getFieldValue('name'),
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
    navigate('/boards');
  };

  useEffect(() => {
    if (isSuccess) {
      api.success({
        title: 'Board edited successfully',
        description: 'The board has been edited.',
      });

      navigate('/boards');
    }

    if (isError) {
      api.error({
        title: 'Board editing failed',
        description: getErrorMessage(error),
      });
    }
  }, [isSuccess, isError]);

  return (
    <Popup
      title="Edit Board"
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
          label="Name"
          name="name"
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
