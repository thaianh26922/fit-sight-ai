import React, { useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Upload,
  Button,
  message,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { RcFile, UploadFile } from 'antd/es/upload/interface';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: {
    name: string;
    age: string;
    gender: string;
    goal: string;
    image: RcFile;
  }) => void;
}

const FitSightSteps: React.FC<Props> = ({ open, onClose, onSubmit }) => {
  const [form] = Form.useForm();
  const [file, setFile] = useState<UploadFile | null>(null);

  const handleFinish = () => {
    form.validateFields().then((values) => {
      if (!file || !file.originFileObj) {
        message.error('Vui lòng chọn ảnh');
        return;
      }

      onSubmit({ ...values, image: file.originFileObj as RcFile });
      form.resetFields();
      setFile(null);
      onClose();
    });
  };

  return (
    <Modal
      open={open}
      title="Nhập thông tin của bạn"
      onCancel={() => {
        form.resetFields();
        setFile(null);
        onClose();
      }}
      footer={null}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Họ và tên"
          rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="age"
          label="Tuổi"
          rules={[{ required: true, message: 'Vui lòng nhập tuổi' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="gender"
          label="Giới tính"
          rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
        >
          <Select placeholder="Chọn giới tính">
            <Select.Option value="Nam">Nam</Select.Option>
            <Select.Option value="Nữ">Nữ</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="goal"
          label="Mục tiêu tập luyện"
          rules={[{ required: true, message: 'Vui lòng nhập mục tiêu' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Ảnh cá nhân" required>
          <Upload
            beforeUpload={() => false}
            maxCount={1}
            accept="image/*"
            onChange={(info) => setFile(info.fileList[0])}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" onClick={handleFinish} block>
            Gửi thông tin
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FitSightSteps;
