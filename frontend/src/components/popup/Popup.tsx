import { Modal } from 'antd';

interface PopupProps {
  title: string
  children: React.ReactNode
  open: boolean
  handleOk: () => void
  handleCancel: () => void
  confirmLoading: boolean
}

export const Popup = ({
  title,
  children,
  open,
  confirmLoading,
  handleOk,
  handleCancel,
}: PopupProps) => {
  return (
    <Modal
      title={ title }
      open={ open }
      onOk={ handleOk }
      confirmLoading={ confirmLoading }
      onCancel={ handleCancel }
    >
      { children }
    </Modal>
  );
};
