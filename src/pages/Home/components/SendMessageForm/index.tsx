import {
  // FileImageOutlined,
  CloseOutlined,
  SendOutlined,
  // CameraOutlined,
} from '@ant-design/icons';
import {
  Button,
  Col,
  Form,
  Image,
  Input,
  Row,
  // Upload,
  Space,
  // Card,
} from 'antd';
import type { UploadFile } from 'antd';
// import type { UploadChangeParam } from 'antd/es/upload';
import { useState} from 'react';
// import Webcam from 'react-webcam';

type TSendMessageFormProps = {
  onChat?: (text: string, images: UploadFile[]) => void;
};

const SendMessageForm: React.FC<TSendMessageFormProps> = ({ onChat }) => {
  const [form] = Form.useForm();
  const [images, setImages] = useState<UploadFile[]>([]);
  // const [showCamera, setShowCamera] = useState(false);
  // const webcamRef = useRef<Webcam>(null);

  // const handleImageChange = ({ fileList }: UploadChangeParam<UploadFile>) => {
  //   setImages(fileList);
  // };

  const handleRemoveImage = (uid: string) => {
    setImages((prev) => prev.filter((file) => file.uid !== uid));
  };

  const handleSubmit = ({ message }: { message: string }) => {
    const trimmed = message.trim();
    if (!trimmed && images.length === 0) return;
    onChat?.(trimmed, images);
    form.resetFields();
    setImages([]);
  };

  // const handleCapture = () => {
  //   const imageSrc = webcamRef.current?.getScreenshot();
  //   if (imageSrc) {
  //     fetch(imageSrc)
  //       .then((res) => res.blob())
  //       .then((blob) => {
  //         const file = new File([blob], `camera_${Date.now()}.jpg`, {
  //           type: 'image/jpeg',
  //         });

  //         const newFile: UploadFile = {
  //           uid: `${Date.now()}`,
  //           name: file.name,
  //           status: 'done',
  //         };

  //         setImages((prev) => [...prev, newFile]);
  //         setShowCamera(false);
  //       });
  //   }
  // };

  return (
    <>
      <Form form={form} onFinish={handleSubmit}>
        <Row gutter={[24, 24]}>
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

              {/* <Col>
                <Button icon={<CameraOutlined />} onClick={() => setShowCamera(true)} />
              </Col> */}

              {/* <Col>
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
              </Col> */}

              <Col>
                <Button type="primary" htmlType="submit" icon={<SendOutlined />} />
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>

      {/* {showCamera && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 999,
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
              videoConstraints={{ facingMode: 'environment' }}
            />
          </Card>
        </div>
      )} */}
    </>
  );
};

export default SendMessageForm;
