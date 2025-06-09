import {
  FileImageOutlined,
  CloseOutlined,
  SendOutlined,
} from '@ant-design/icons';
import {
  Button,
  Col,
  Form,
  Image,
  Input,
  Row,
  Upload,
  Space,
} from 'antd';
import type { UploadFile } from 'antd';
import type { RcFile, UploadChangeParam } from 'antd/es/upload';
import React, { useState, type ChangeEvent } from 'react';

type TSendMessageFormProps = {
  onSend?: (text: string, images: UploadFile[]) => void;
};

const SendMessageForm: React.FC<TSendMessageFormProps> = ({ onSend }) => {
  const [form] = Form.useForm();
  const [images, setImages] = useState<UploadFile[]>([]);

  const handleImageChange = ({ fileList }: UploadChangeParam<UploadFile>) => {
    setImages(fileList);
  };

  const handleRemoveImage = (uid: string) => {
    setImages((prev) => prev.filter((file) => file.uid !== uid));
  };

  const handleCameraCapture = (e: ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (files && files.length > 0) {
    const file = files[0] as RcFile;
    file.uid = `${Date.now()}`;
    const newFile: UploadFile = {
      uid: file.uid,
      name: file.name,
      status: 'done',
      originFileObj: file,
      url: URL.createObjectURL(file),
    };

    setImages((prev) => [...prev, newFile]);
    e.target.value = ''; // Reset lại input
  }
};

  const handleSubmit = ({ message }: { message: string }) => {
    const trimmed = message.trim();
    if (!trimmed && images.length === 0) return;
    onSend?.(trimmed, images);
    form.resetFields();
    setImages([]);
  };

  return (
    <Form form={form} onFinish={handleSubmit}>
      <Row gutter={[24, 24]}>
        {/* Image preview row */}
        {images.length > 0 && (
          <Col span={24}>
            <Space>
              {images.map((file) => (
                <div key={file.uid} style={{ position: 'relative' }}>
                  <Image
                    width={48}
                    height={48}
                    src={URL.createObjectURL(file.originFileObj as Blob)}
                    style={{ objectFit: 'cover', borderRadius: 4 }}
                    preview={false}
                  />
                  <Button
                    size="small"
                    shape="circle"
                    icon={<CloseOutlined style={{ fontSize: 12 }} />}
                    type="text"
                    onClick={() => handleRemoveImage(file.uid)}
                    style={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      background: '#fff',
                      boxShadow: '0 0 2px rgba(0,0,0,0.3)',
                    }}
                  />
                </div>
              ))}
            </Space>
          </Col>
        )}

        {/* Input and actions */}
        <Col span={24}>
          <Row gutter={8} align="bottom" wrap={false}>
            <Col flex="auto">
              <Form.Item name="message" noStyle>
                <Input.TextArea
                  autoSize={{ minRows: 1, maxRows: 4 }}
                  placeholder="Nhập tin nhắn..."
                  onPressEnter={(e) => {
                    if (!e.shiftKey) {
                      e.preventDefault();
                      form.submit();
                    }
                  }}
                />
              </Form.Item>
            </Col>

            {/* Nút upload ảnh từ thư viện */}
            <Col>
              <Upload
                listType="picture"
                fileList={images}
                maxCount={5}
                multiple
                accept="image/png,image/jpeg,image/jpg,image/gif"
                beforeUpload={() => false}
                onChange={handleImageChange}
                showUploadList={false}
              >
                <Button icon={<FileImageOutlined />} />
              </Upload>
            </Col>

            {/* Nút mở camera chụp ảnh */}
            <Col>
              <label>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleCameraCapture}
                  style={{ display: 'none' }}
                />
                <Button>📸</Button>
              </label>
            </Col>

            {/* Nút gửi */}
            <Col>
              <Button type="primary" htmlType="submit" icon={<SendOutlined />} />
            </Col>
          </Row>
        </Col>
      </Row>
    </Form>
  );
};

export default SendMessageForm;
