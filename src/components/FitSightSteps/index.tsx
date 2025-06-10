import React, { useState, useRef } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Upload,
  Button,
  message,
  Image,
  Space,
  Card,
} from 'antd';
import { UploadOutlined, CameraOutlined, CloseOutlined } from '@ant-design/icons';
import Webcam from 'react-webcam';
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
  const [showCamera, setShowCamera] = useState(false);
  const webcamRef = useRef<Webcam>(null);

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

  const handleCapture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      fetch(imageSrc)
        .then((res) => res.blob())
        .then((blob) => {
          const fileObj = new File([blob], `camera_${Date.now()}.jpg`, {
            type: 'image/jpeg',
          });

          const newFile: UploadFile = {
            uid: `${Date.now()}`,
            name: fileObj.name,
            status: 'done',
          };

          setFile(newFile);
          setShowCamera(false);
        });
    }
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
            name="category"
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
                onChange={(info) => setFile(info.fileList[0])}
                showUploadList={false}
              >
                <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
              </Upload>
              <Button icon={<CameraOutlined />} onClick={() => setShowCamera(true)}>
                Chụp ảnh
              </Button>
            </Space>

            {file?.originFileObj && (
              <div style={{ marginTop: 16, position: 'relative', display: 'inline-block' }}>
                <Image
                  width={80}
                  height={80}
                  src={URL.createObjectURL(file.originFileObj)}
                  style={{ objectFit: 'cover', borderRadius: 8 }}
                  preview={false}
                />
                <Button
                  size="small"
                  shape="circle"
                  icon={<CloseOutlined />}
                  onClick={() => setFile(null)}
                  style={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    background: '#fff',
                    boxShadow: '0 0 3px rgba(0,0,0,0.3)',
                  }}
                />
              </div>
            )}
          </Form.Item>

          <Form.Item>
            <Button type="primary" block onClick={handleFinish}>
              Gửi thông tin
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {showCamera && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 9999,
            width: 340,
            maxWidth: '90%',
          }}
        >
          <Card
            title="Chụp ảnh"
            bordered
            bodyStyle={{ padding: 12 }}
            actions={[
              <Button key="capture" type="primary" onClick={handleCapture}>
                📸 Chụp
              </Button>,
              <Button key="close" onClick={() => setShowCamera(false)}>
                ❌ Đóng
              </Button>,
            ]}
          >
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              width="100%"
              videoConstraints={{ facingMode: 'user' }}
            />
          </Card>
        </div>
      )}
    </>
  );
};

export default FitSightSteps;
