import { RobotOutlined, UserOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import {
  Avatar,
  Col,
  Layout,
  Row,
  Space,
  Spin,
  Typography,
} from 'antd';
import Cookies from 'js-cookie';
import React, { useContext, useEffect, useRef, useState } from 'react';
import FitSightSteps from '../../components/FitSightSteps';
import { AuthContext, type AnalysisData } from '../../context';
import SendMessageForm from './components/SendMessageForm';
// Import AuthContext và AnalysisData

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

// Dữ liệu mẫu (Giữ nguyên)
const analyzeData = [
  {
    "id": 1,
    "chi_so_co_the": {
      "suc_manh": 70,
      "suc_ben": 70,
      "tu_the": 80,
      "trao_doi_chat": 75,
      "do_deo_dai": 75
    },
    "thanh_phan_co_the": {
      "mo": "15%",
      "co": "40%",
      "nuoc": "60%"
    },
    "lich_tap_luyen": {
      "thu_hai": "Chạy bộ 5km",
      "thu_ba": "Tập ngực và tay sau",
      "thu_tu": "Đi bộ nhẹ nhàng",
      "thu_nam": "Tập lưng và tay trước",
      "thu_sau": "Tập chân",
      "thu_bay": "Yoga và giãn cơ",
      "chu_nhat": "Nghỉ ngơi"
    },
    "thuc_don_mau": {
      "thu_hai": {
        "sang": "Trứng ốp la và bánh mì nguyên cám",
        "trua": "Cơm gạo lứt với ức gà",
        "toi": "Cá hồi nướng và salad"
      },
      "thu_ba": {
        "sang": "Sinh tố chuối và bơ hạt nhân",
        "trua": "Thịt bò xào rau cải xanh",
        "toi": "Gà nướng và khoai tây nghiền"
      },
      "thu_tu": {
        "sang": "Trái cây và yến mạch",
        "trua": "Cơm và cá hồi",
        "toi": "Salad ức gà và rau xanh"
      },
      "thu_nam": {
        "sang": "Bánh mì và trứng luộc",
        "trua": "Gà luộc và rau sống",
        "toi": "Thịt nướng và bông cải xanh"
      },
      "thu_sau": {
        "sang": "Yến mạch và sữa chua",
        "trua": "Thịt heo nạc và rau luộc",
        "toi": "Cá và bún gạo lứt"
      },
      "thu_bay": {
        "sang": "Smoothie rau xanh",
        "trua": "Cơm và thịt gà",
        "toi": "Mì Ý và thịt bò băm"
      },
      "chu_nhat": {
        "sang": "Bánh mì và trái cây",
        "trua": "Salad cá ngừ và khoai lang",
        "toi": "Gà hầm và rau củ"
      }
    }
  },
  {
    "id": 2,
    "chi_so_co_the": {
      "suc_manh": 65,
      "suc_ben": 75,
      "tu_the": 78,
      "trao_doi_chat": 70,
      "do_deo_dai": 80
    },
    "thanh_phan_co_the": {
      "mo": "18%",
      "co": "38%",
      "nuoc": "58%"
    },
    "lich_tap_luyen": {
      "thu_hai": "Chạy bộ 4km",
      "thu_ba": "Tập vai và tay trước",
      "thu_tu": "Bơi lội",
      "thu_nam": "Tập ngực và bụng",
      "thu_sau": "Tập toàn thân nhẹ",
      "thu_bay": "Đi bộ đường dài",
      "chu_nhat": "Nghỉ ngơi"
    },
    "thuc_don_mau": {
      "thu_hai": {
        "sang": "Yến mạch và trái cây",
        "trua": "Ức gà áp chảo và rau xanh",
        "toi": "Salad cá ngừ"
      },
      "thu_ba": {
        "sang": "Bánh mì đen và trứng ốp",
        "trua": "Cơm gạo lứt và cá diêu hồng",
        "toi": "Súp bí đỏ và hạt"
      },
      "thu_tu": {
        "sang": "Sinh tố rau xanh và protein",
        "trua": "Thịt bò nướng và khoai lang",
        "toi": "Canh rau củ"
      },
      "thu_nam": {
        "sang": "Trứng luộc và cà chua",
        "trua": "Salad gà nướng",
        "toi": "Súp lơ xanh hấp"
      },
      "thu_sau": {
        "sang": "Sữa chua không đường và hạt chia",
        "trua": "Cơm gạo lứt và tôm hấp",
        "toi": "Cá hấp gừng"
      },
      "thu_bay": {
        "sang": "Bánh mì nguyên cám và bơ đậu phộng",
        "trua": "Ức gà luộc và salad rau củ",
        "toi": "Thịt gà kho gừng"
      },
      "chu_nhat": {
        "sang": "Nước ép rau củ",
        "trua": "Miến gà",
        "toi": "Cháo yến mạch với thịt băm"
      }
    }
  },
  {
    "id": 3,
    "chi_so_co_the": {
      "suc_manh": 72,
      "suc_ben": 68,
      "tu_the": 82,
      "trao_doi_chat": 78,
      "do_deo_dai": 72
    },
    "thanh_phan_co_the": {
      "mo": "14%",
      "co": "42%",
      "nuoc": "62%"
    },
    "lich_tap_luyen": {
      "thu_hai": "Tập ngực và tay sau",
      "thu_ba": "Chạy bộ 6km",
      "thu_tu": "Tập lưng và tay trước",
      "thu_nam": "Yoga và thiền",
      "thu_sau": "Tập chân và bụng",
      "thu_bay": "Bơi lội",
      "chu_nhat": "Nghỉ ngơi"
    },
    "thuc_don_mau": {
      "thu_hai": {
        "sang": "Bánh mì đen và trứng ốp",
        "trua": "Cá nướng và rau cải luộc",
        "toi": "Ức gà hấp và măng tây"
      },
      "thu_ba": {
        "sang": "Yến mạch và chuối",
        "trua": "Thịt bò xào rau củ",
        "toi": "Súp bí ngô"
      },
      "thu_tu": {
        "sang": "Sinh tố rau chân vịt",
        "trua": "Cơm gạo lứt và cá basa kho",
        "toi": "Salad trộn"
      },
      "thu_nam": {
        "sang": "Phô mai tươi và dâu tây",
        "trua": "Gà xé phay và bắp cải",
        "toi": "Trứng luộc và cà chua"
      },
      "thu_sau": {
        "sang": "Trái cây và sữa chua",
        "trua": "Cá hồi áp chảo và cơm lứt",
        "toi": "Bông cải xanh luộc"
      },
      "thu_bay": {
        "sang": "Cháo yến mạch và hạt",
        "trua": "Ức gà luộc và salad",
        "toi": "Canh chua cá"
      },
      "chu_nhat": {
        "sang": "Bánh pancake chuối yến mạch",
        "trua": "Mì spaghetti nguyên cám và sốt thịt bò",
        "toi": "Salad ức gà"
      }
    }
  },
  {
    "id": 4,
    "chi_so_co_the": {
      "suc_manh": 68,
      "suc_ben": 72,
      "tu_the": 75,
      "trao_doi_chat": 73,
      "do_deo_dai": 77
    },
    "thanh_phan_co_the": {
      "mo": "16%",
      "co": "39%",
      "nuoc": "59%"
    },
    "lich_tap_luyen": {
      "thu_hai": "Đi bộ nhanh 45 phút",
      "thu_ba": "Tập toàn thân với tạ nhẹ",
      "thu_tu": "Đạp xe 1 tiếng",
      "thu_nam": "Tập yoga",
      "thu_sau": "Tập cơ bụng và cardio",
      "thu_bay": "Tập các bài kéo giãn",
      "chu_nhat": "Nghỉ ngơi"
    },
    "thuc_don_mau": {
      "thu_hai": {
        "sang": "Trứng luộc và khoai lang",
        "trua": "Thịt gà nướng và rau xanh",
        "toi": "Salad dưa chuột và cà chua"
      },
      "thu_ba": {
        "sang": "Sữa tươi không đường và ngũ cốc nguyên hạt",
        "trua": "Cá sốt cà chua và cơm lứt",
        "toi": "Đậu phụ luộc và rau cải"
      },
      "thu_tu": {
        "sang": "Sinh tố bơ và chuối",
        "trua": "Salad ức gà và rau củ quả",
        "toi": "Canh rau ngót thịt băm"
      },
      "thu_nam": {
        "sang": "Bánh mì nguyên cám và trứng cuộn",
        "trua": "Bún riêu cua (ít bún, nhiều rau)",
        "toi": "Cá diêu hồng hấp"
      },
      "thu_sau": {
        "sang": "Yến mạch trộn hoa quả",
        "trua": "Gà luộc xé phay và salad",
        "toi": "Súp gà và nấm"
      },
      "thu_bay": {
        "sang": "Trứng tráng và rau xanh",
        "trua": "Cơm gạo lứt và sườn nướng",
        "toi": "Rau luộc thập cẩm"
      },
      "chu_nhat": {
        "sang": "Bánh mì nướng và bơ",
        "trua": "Phở gà (ít bánh phở)",
        "toi": "Salad trái cây"
      }
    }
  },
  {
    "id": 5,
    "chi_so_co_the": {
      "suc_manh": 75,
      "suc_ben": 65,
      "tu_the": 85,
      "trao_doi_chat": 80,
      "do_deo_dai": 70
    },
    "thanh_phan_co_the": {
      "mo": "13%",
      "co": "45%",
      "nuoc": "63%"
    },
    "lich_tap_luyen": {
      "thu_hai": "Tập gym: Ngực và tay sau",
      "thu_ba": "Cardio: Chạy bộ 45 phút",
      "thu_tu": "Tập gym: Lưng và tay trước",
      "thu_nam": "Cardio: Đạp xe 45 phút",
      "thu_sau": "Tập gym: Chân và bụng",
      "thu_bay": "Yoga / Giãn cơ",
      "chu_nhat": "Nghỉ ngơi hoàn toàn"
    },
    "thuc_don_mau": {
      "thu_hai": {
        "sang": "Trứng luộc (2 quả) + Bánh mì nguyên cám (1 lát)",
        "trua": "Ức gà nướng + Salad rau xanh",
        "toi": "Cá hồi áp chảo + Bông cải xanh hấp"
      },
      "thu_ba": {
        "sang": "Yến mạch (1 bát) + Quả mọng",
        "trua": "Thịt bò xào rau củ + Cơm gạo lứt (1/2 bát)",
        "toi": "Súp bí đỏ + Ức gà xé"
      },
      "thu_tu": {
        "sang": "Smoothie protein (whey, chuối, sữa hạt)",
        "trua": "Cá basa kho tộ + Rau luộc",
        "toi": "Salad tôm + Dầu ô liu"
      },
      "thu_nam": {
        "sang": "Bánh mì đen (1 lát) + Trứng ốp la (1 quả)",
        "trua": "Gà luộc + Khoai lang (1 củ)",
        "toi": "Thịt heo nạc luộc + Cải thìa"
      },
      "thu_sau": {
        "sang": "Sữa chua không đường + Hạt chia + Trái cây",
        "trua": "Phở cuốn (3-4 cái) + Nước chấm nhạt",
        "toi": "Canh chua cá + Rau sống"
      },
      "thu_bay": {
        "sang": "Bánh kếp yến mạch + Mật ong",
        "trua": "Bún chả (ít bún, nhiều rau và chả nạc)",
        "toi": "Salad ức gà hun khói"
      },
      "chu_nhat": {
        "sang": "Omelette trứng rau củ",
        "trua": "Cơm gạo lứt + Thịt bò băm rang",
        "toi": "Súp gà nấm hương"
      }
    }
  }
]


const Home: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Lấy hàm setAnalysisData từ AuthContext
  const {setAnalysisData } = useContext(AuthContext);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);


  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      const token = Cookies.get('accessToken');
      try {
        const response = await fetch('https://d5f9-42-114-121-153.ngrok-free.app/chat/history', {
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
      const response = await fetch('https://d5f9-42-114-121-153.ngrok-free.app/chat/normal', {
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

  // Đối tượng ánh xạ từ key tiếng Anh sang tiếng Việt
  const dayMap: { [key: string]: string } = {
    "thu_hai": "Thứ hai",
    "thu_ba": "Thứ ba",
    "thu_tu": "Thứ tư",
    "thu_nam": "Thứ năm",
    "thu_sau": "Thứ sáu",
    "thu_bay": "Thứ bảy",
    "chu_nhat": "Chủ nhật",
  };

  const handleAnalyzeSubmit = async () => {
    setLoading(true);
    try {
      // Chọn một mục ngẫu nhiên từ analyzeData
      const randomIndex = Math.floor(Math.random() * analyzeData.length);
      const randomData = analyzeData[randomIndex];

      // Tạo một đối tượng dữ liệu với tên trường bằng tiếng Anh, phù hợp với type AnalysisData
      const analysisResult: AnalysisData = {
        bodyStats: {
          strength: randomData.chi_so_co_the.suc_manh,
          endurance: randomData.chi_so_co_the.suc_ben,
          posture: randomData.chi_so_co_the.tu_the,
          metabolism: randomData.chi_so_co_the.trao_doi_chat,
          flexibility: randomData.chi_so_co_the.do_deo_dai,
        },
        bodyComposition: {
          fat: randomData.thanh_phan_co_the.mo,
          muscle: randomData.thanh_phan_co_the.co,
          water: randomData.thanh_phan_co_the.nuoc,
        },
        workoutSchedule: randomData.lich_tap_luyen,
        mealPlan: randomData.thuc_don_mau,
      };

      // Lưu trữ dữ liệu phân tích vào Context
      setAnalysisData(analysisResult);

      // Định dạng dữ liệu thành chuỗi để hiển thị
      const formatted = `📊 *Chỉ số cơ thể*
- Sức mạnh: ${randomData.chi_so_co_the.suc_manh}
- Sức bền: ${randomData.chi_so_co_the.suc_ben}
- Tư thế: ${randomData.chi_so_co_the.tu_the}
- Trao đổi chất: ${randomData.chi_so_co_the.trao_doi_chat}
- Độ dẻo dai: ${randomData.chi_so_co_the.do_deo_dai}

💪 *Thành phần cơ thể*
- Mỡ: ${randomData.thanh_phan_co_the.mo}
- Cơ: ${randomData.thanh_phan_co_the.co}
- Nước: ${randomData.thanh_phan_co_the.nuoc}

🏋️ *Lịch tập luyện*
${Object.entries(randomData.lich_tap_luyen).map(([dayKey, activity]) => `- ${dayMap[dayKey] || dayKey}: ${activity}`).join('\n')}

🍽️ *Thực đơn mẫu*
${Object.entries(randomData.thuc_don_mau).map(
        ([dayKey, meals]) =>
          `- ${dayMap[dayKey] || dayKey}:\n  🥣 Sáng: ${meals.sang}\n  🍛 Trưa: ${meals.trua}\n  🍲 Tối: ${meals.toi}`
      ).join('\n\n')}`;

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            role: 'assistant',
            content: formatted,
          },
        ]);
        setLoading(false);
      }, 5000);

    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: 'assistant',
          content: 'Có lỗi xảy ra khi tạo dữ liệu phân tích.',
        },
      ]);
      setLoading(false); // Ngừng loading ngay cả khi có lỗi
    }
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

      <FitSightSteps open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleAnalyzeSubmit} />
    </div>
  );
};

export default Home;