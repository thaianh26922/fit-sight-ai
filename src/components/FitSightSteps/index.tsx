import React, { useState, useRef } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Upload,
  Button,
  message,
  Space,
} from 'antd';
import { UploadOutlined, CameraOutlined } from '@ant-design/icons';
import type { RcFile, UploadFile } from 'antd/es/upload/interface';
import Webcam from 'react-webcam';

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
  const [showCamera, setShowCamera] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  const handleCapture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) return;

    fetch(imageSrc)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], 'captured.jpg', { type: 'image/jpeg' }) as RcFile;
        file.uid = String(Date.now()); // assign UID manually
        setFile({
          uid: file.uid,
          name: file.name,
          status: 'done',
          url: imageSrc,
          originFileObj: file,
        });
        setShowCamera(false);
      });
  };

  const handleFinish = () => {
    form.validateFields().then((values) => {
      if (!file || !file.originFileObj) {
        message.error('Vui lòng chọn hoặc chụp ảnh');
        return;
      }

      onSubmit({ ...values, image: file.originFileObj as RcFile });
      form.resetFields();
      setFile(null);
      onClose();
    });
  };

  return (
    <>
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
            label="Category"
            rules={[{ required: true, message: 'Vui lòng chọn loại hoạt động' }]}
          >
            <Select placeholder="Chọn loại hoạt động">
              <Select.Option value="Gym">Gym</Select.Option>
              <Select.Option value="Workout">Workout</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Ảnh cá nhân" required>
            <Space>
              <Upload
                beforeUpload={() => false}
                maxCount={1}
                accept="image/*"
                fileList={file ? [file] : []}
                onChange={(info) => setFile(info.fileList[0])}
              >
                <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
              </Upload>

              <Button
                icon={<CameraOutlined />}
                onClick={() => setShowCamera(true)}
              >
                Chụp ảnh
              </Button>
            </Space>
          </Form.Item>

          <Form.Item>
            <Button type="primary" onClick={handleFinish} block>
              Gửi thông tin
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal camera */}
      <Modal
        open={showCamera}
        title="Chụp ảnh từ camera"
        onCancel={() => setShowCamera(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowCamera(false)}>
            Hủy
          </Button>,
          <Button key="capture" type="primary" onClick={handleCapture}>
            Chụp ảnh
          </Button>,
        ]}
      >
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          style={{ width: '100%' }}
        />
      </Modal>
    </>
  );
};

export default FitSightSteps;
