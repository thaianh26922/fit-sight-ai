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
import type { RcFile } from 'antd/es/upload/interface';
import FitSightSteps from '../../components/FitSightSteps';
import Cookies from 'js-cookie';
// import { Link } from 'react-router-dom';

// const { Content, Footer } = Layout;
const { Content } = Layout;

const { Text } = Typography;

type Message = {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  images?: UploadFile[];
};

type HistoryResponse = {
  createdAt: string;
  role: 'user' | 'assistant';
  content: string;
};

type AnalyzeResponse = {
  data: {
    bodyStats: {
      strength: number;
      endurance: number;
      posture: number;
      metabolism: number;
      flexibility: number;
    };
    bodyComposition: {
      fat: number;
      muscle: number;
      water: number;
    };
    workoutSchedule: {
      day: string;
      activity: string;
    }[];
    mealPlan: {
      day: string;
      meals: {
        breakfast: string;
        lunch: string;
        dinner: string;
      };
    }[];
  };
};

// type ProfileResponse = {
//   data: {
//     user: {
//       is_chat: boolean;
//     };
//   };
// };

const Home: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  // const [isChatEnabled, setIsChatEnabled] = useState(true);
  // const [loadingProfile, setLoadingProfile] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     const token = Cookies.get('accessToken');
  //     try {
  //       const response = await fetch('https://7b45-58-187-228-118.ngrok-free.app/auth/profile', {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //       // const result: ProfileResponse = await response.json();
  //       // const user = result?.data?.user;
  //       // setIsChatEnabled(user?.is_chat !== false);
  //     } catch (error) {
  //       console.error('Lỗi khi gọi API profile:', error);
  //       // setIsChatEnabled(false);
  //     } finally {
  //       // setLoadingProfile(false);
  //     }
  //   };
  //   fetchProfile();
  // }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      const token = Cookies.get('accessToken');
      try {
        const response = await fetch('https://7b45-58-187-228-118.ngrok-free.app/chat/history', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result: { data: HistoryResponse[] } = await response.json();
        if (Array.isArray(result.data) && result.data.length > 0) {
          const history: Message[] = result.data.map((msg) => ({
            id: Date.parse(msg.createdAt),
            role: msg.role,
            content: msg.content,
          }));
          setMessages(history);
        }
      } catch (err) {
        console.error('Lỗi khi lấy lịch sử:', err);
      }
      setLoading(false);
    };
    fetchHistory();
  }, []);

  const handleChat = async (text: string, images: UploadFile[]) => {
    const userMsg: Message = {
      id: Date.now(),
      role: 'user',
      content: text,
      images,
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    const token = Cookies.get('accessToken');
    try {
      const response = await fetch('https://7b45-58-187-228-118.ngrok-free.app/chat/normal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt: text }),
      });
      const result: { reply: string } = await response.json();
      const botReply: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: result.reply,
      };
      setMessages((prev) => [...prev, botReply]);
    } catch (err) {
      console.error('Lỗi khi gửi tin nhắn:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          role: 'assistant',
          content: '⚠️ Đã xảy ra lỗi khi gửi tin nhắn.',
        },
      ]);
    }
    setLoading(false);
  };

  const handleAnalyzeSubmit = async (info: {
    name: string;
    age: string;
    gender: string;
    goal: string;
    image: RcFile;
  }) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('name', info.name);
    formData.append('age', info.age);
    formData.append('gender', info.gender);
    formData.append('goal', info.goal);
    formData.append('image', info.image);
    const token = Cookies.get('accessToken');
    try {
      const response = await fetch('https://7b45-58-187-228-118.ngrok-free.app/chat/analyze', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const result: AnalyzeResponse = await response.json();
      const { bodyStats: stats, bodyComposition: composition, workoutSchedule: schedule, mealPlan: meal } = result.data;
      const formatted = `
📊 *Chỉ số cơ thể*
- Sức mạnh: ${stats.strength}
- Sức bền: ${stats.endurance}
- Tư thế: ${stats.posture}
- Trao đổi chất: ${stats.metabolism}
- Độ dẻo dai: ${stats.flexibility}

💪 *Thành phần cơ thể*
- Mỡ: ${composition.fat}%
- Cơ: ${composition.muscle}%
- Nước: ${composition.water}%

🏋️ *Lịch tập luyện*
${schedule.map((s) => `- ${s.day}: ${s.activity}`).join('\n')}

🍽️ *Thực đơn mẫu*
${meal.map(
        (m) =>
          `- ${m.day}:\n  🥣 Sáng: ${m.meals.breakfast}\n  🍛 Trưa: ${m.meals.lunch}\n  🍲 Tối: ${m.meals.dinner}`
      ).join('\n\n')}
`;
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: 'assistant',
          content: formatted,
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: 'assistant',
          content: 'Có lỗi xảy ra khi gửi dữ liệu.',
        },
      ]);
    }
    setLoading(false);
  };

  return (
    <div style={{ height: '80vh', display: 'flex', flexDirection: 'column', border: '1px solid #f0f0f0' }}>
      <Content style={{ flex: 1, overflowY: 'auto', padding: '16px', background: '#fafafa' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          {messages.length === 0 && !loading && !modalOpen && (
            <Row justify="center">
              <Col>
                <Text type="secondary" style={{ cursor: 'pointer', fontStyle: 'italic' }} onClick={() => setModalOpen(true)}>
                  👉 Bắt đầu trò chuyện với FitSight
                </Text>
              </Col>
            </Row>
          )}

          {messages.map((msg) => (
            <Row key={msg.id} justify={msg.role === 'user' ? 'end' : 'start'} wrap>
              <Col xs={22} sm={20} md={18} lg={16}>
                <Space align="start" style={{ background: msg.role === 'user' ? '#e6f7ff' : '#f6ffed', padding: '12px', borderRadius: '12px', display: 'flex', width: '100%' }} direction="vertical">
                  <Space>
                    <Avatar icon={msg.role === 'user' ? <UserOutlined /> : <RobotOutlined />} style={{ backgroundColor: msg.role === 'user' ? '#1890ff' : '#52c41a' }} />
                    <Text style={{ whiteSpace: 'pre-line', wordBreak: 'break-word' }}>{msg.content}</Text>
                  </Space>
                  {msg.images && msg.images.length > 0 && (
                    <Space wrap>
                      {msg.images.map((file) => (
                        <img key={file.uid} src={URL.createObjectURL(file.originFileObj as Blob)} alt={file.name} style={{ maxWidth: 100, borderRadius: 8, objectFit: 'cover' }} />
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
                <Space align="start" style={{ background: '#f6ffed', padding: '12px', borderRadius: '12px', display: 'flex', width: '100%' }}>
                  <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#52c41a' }} />
                  <Spin size="small" />
                </Space>
              </Col>
            </Row>
          )}

          <div ref={bottomRef} />
        </Space>
      </Content>
      <SendMessageForm onChat={handleChat} />

      {/* {!(isChatEnabled) && (
        <Footer style={{ padding: '12px', background: '#fff', borderTop: '1px solid #f0f0f0' }}>
          {loadingProfile ? (
            <Spin />
          ) : isChatEnabled ? ( 
            <SendMessageForm onChat={handleChat} />
          ) : (
            <Space direction="vertical" style={{ width: '100%' }} align="center">
              <Text type="danger" strong>
                ⚠️ Bạn đã hết lượt chat miễn phí.
              </Text>
              <Link to="/payment" style={{ color: '#1890ff', fontWeight: 500 }}>
                👉 Nạp tiền để tiếp tục sử dụng
              </Link>
            </Space>
          )}
        </Footer>
      )} */}

      <FitSightSteps open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleAnalyzeSubmit} />
    </div>
  );
};

export default Home;