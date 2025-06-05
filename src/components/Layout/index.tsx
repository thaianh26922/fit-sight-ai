import { useState, useEffect, type JSX } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  NotificationOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Dropdown,
  Flex,
  Layout,
  List,
  Menu,
  Spin,
} from "antd";
import { useNavigate } from "react-router-dom";
import UserDropdownAuth from "../../widgets/UserDropdownAuth";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import axios from "axios";
import Cookies from "js-cookie";

const { Header, Sider, Content } = Layout;

interface ILayoutApp {
  children: JSX.Element;
}

export default function LayoutApp({ children }: ILayoutApp) {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("1");
  const [userName, setUserName] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(true);
  const screens = useBreakpoint();
  const navigate = useNavigate();

  const colorBgContainer = "white";
  const borderRadiusLG = 8;

  const menuKeyToPath: Record<string, string> = {
    "1": "/",
    "2": "/profile",
    "3": "/payment",
  };

  const notifications = [
    { id: 1, title: "Bạn có lịch tập mới hôm nay" },
    { id: 2, title: "Hệ thống cập nhật dữ liệu sức khỏe" },
    { id: 3, title: "Đạt mục tiêu tuần này, tuyệt vời!" }, 
  ];

  // 📱 Auto collapse nếu là màn hình mobile
  useEffect(() => {
    if (!screens.lg) {
      setCollapsed(true);
    }
  }, [screens.lg]);
 
  // 🔐 Lấy accessToken và gọi API profile
  useEffect(() => {
    const token = Cookies.get("accessToken");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "https://7b45-58-187-228-118.ngrok-free.app/auth/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserName(response.data?.email || "Người dùng");
      } catch (error) {
        console.error("Lỗi khi gọi API profile:", error);
        setUserName('');
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  return (
    <Layout style={{ minHeight: "100vh", background: "white" }}>
      <Sider trigger={null} collapsible collapsed={collapsed} style={{ background: "white" }}>
        <div />
        <Menu
          style={{ background: "white" }}
          theme="light"
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={({ key }) => {
            setSelectedKey(key);
            const path = menuKeyToPath[key];
            if (path) navigate(path);
          }}
          items={[
            {
              key: "1",
              icon: <UserOutlined />,
              label: "FitInsight AI",
            },
            {
              key: "2",
              icon: <VideoCameraOutlined />,
              label: "Profile",
            },
            {
              key: "2",
              icon: <VideoCameraOutlined />,
              label: "Payment",
            },
          ]}
        />
      </Sider>

      <Layout>
        <Header style={{ padding: "0 16px", background: "white" }}>
          <Flex justify="space-between" align="center">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: 16,
                width: 64,
                height: 64,
              }}
            />

            <Flex align="center" gap={screens.lg ? 24 : 8}>
              <Dropdown
                placement="bottomRight"
                trigger={["click"]}
                dropdownRender={() => (
                  <Card
                    title="Thông báo"
                    bordered={false}
                    style={{ width: 300, maxHeight: 300, overflowY: "auto" }}
                  >
                    <List
                      dataSource={notifications}
                      renderItem={(item) => <List.Item>{item.title}</List.Item>}
                      locale={{ emptyText: "Không có thông báo nào" }}
                    />
                  </Card>
                )}
              >
                <Button type="text" size="small">
                  <Badge dot={notifications.length > 0}>
                    <NotificationOutlined style={{ fontSize: 20 }} />
                  </Badge>
                </Button>
              </Dropdown>

              {loadingProfile ? (
                <Spin size="small" />
              ) : (
                <UserDropdownAuth name={userName} />
              )}
            </Flex>
          </Flex>
        </Header>

        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            borderRadius: borderRadiusLG,
            background: colorBgContainer,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
