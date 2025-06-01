import React, { useRef, useEffect, useState } from 'react';
import {
  Layout,
  Avatar,
  Typography,
  Row,
  Col,
  Space,
  Spin,
} from 'antd';
import { UserOutlined, RobotOutlined } from '@ant-design/icons';
import SendMessageForm from './components/SendMessageForm';
import type { UploadFile } from 'antd';

const { Content, Footer } = Layout;
const { Text } = Typography;

type Message = {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  images?: UploadFile[];
};

const Home: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (text: string, images: UploadFile[]) => {
    const userMsg: Message = {
      id: Date.now(),
      role: 'user',
      content: text,
      images,
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    setTimeout(() => {
      const botReply: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `Bạn vừa nói: "${text}"`,
      };
      setMessages((prev) => [...prev, botReply]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div
      style={{
        height: '80vh',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #f0f0f0',
      }}
    >
      <Content
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          background: '#fafafa',
        }}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          {messages.map((msg) => (
            <Row
              key={msg.id}
              justify={msg.role === 'user' ? 'end' : 'start'}
              wrap
            >
              <Col xs={22} sm={20} md={18} lg={16}>
                <Space
                  align="start"
                  style={{
                    background: msg.role === 'user' ? '#e6f7ff' : '#f6ffed',
                    padding: '12px',
                    borderRadius: '12px',
                    display: 'flex',
                    width: '100%',
                  }}
                  direction="vertical"
                >
                  <Space>
                    <Avatar
                      icon={msg.role === 'user' ? <UserOutlined /> : <RobotOutlined />}
                      style={{
                        backgroundColor: msg.role === 'user' ? '#1890ff' : '#52c41a',
                      }}
                    />
                    <Text style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {msg.content}
                    </Text>
                  </Space>

                  {msg.images && msg.images.length > 0 && (
                    <Space wrap>
                      {msg.images.map((file) => (
                        <img
                          key={file.uid}
                          src={URL.createObjectURL(file.originFileObj as Blob)}
                          alt={file.name}
                          style={{
                            maxWidth: 100,
                            borderRadius: 8,
                            objectFit: 'cover',
                          }}
                        />
                      ))}
                    </Space>
                  )}
                </Space>
              </Col>
            </Row>
          ))}

          {loading && (
            <Row justify="start">
              <Col xs={22} sm={20} md={18} lg={16}>
                <Space
                  align="start"
                  style={{
                    background: '#f6ffed',
                    padding: '12px',
                    borderRadius: '12px',
                    display: 'flex',
                    width: '100%',
                  }}
                >
                  <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#52c41a' }} />
                  <Spin size="small" />
                </Space>
              </Col>
            </Row>
          )}

          <div ref={bottomRef} />
        </Space>
      </Content>

      <Footer
        style={{
          padding: '12px',
          background: '#fff',
          borderTop: '1px solid #f0f0f0',
        }}
      >
        <SendMessageForm onSend={handleSend} />
      </Footer>
    </div>
  );
};

export default Home;
