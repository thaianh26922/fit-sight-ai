import { UserOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Avatar, Dropdown, Flex, Row, Space, Typography } from 'antd'
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint'
import Cookies from 'js-cookie'; // 👈 Thêm dòng này
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context'

const { Text } = Typography

interface Props {
  name?: string | null;
}

export default function UserDropdownAuth({ name }: Props) {
  const screens = useBreakpoint()
  const navigate = useNavigate()
 const {currentUser} = useContext(AuthContext);
  const handleLogout = () => {
    Cookies.remove('accessToken') // 👈 Xóa token khỏi cookies
    navigate('/login')           // 👈 Điều hướng về trang đăng nhập
  }

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <Space size={10} align="center">
          <UserOutlined />
          <Text>{currentUser?.name}</Text>
        </Space>
      ),
      disabled: true,
    },
    {
      key: '2',
      label: (
        <Space size={10} align="center" onClick={handleLogout}>
          <Text type="secondary">Đăng xuất</Text>
        </Space>
      ),
    },
  ]

  return (
    <Row>
      <Dropdown menu={{ items }} placement="topRight">
        <Space align="center">
          {screens.lg && (
            <Text style={{ fontSize: 16 }}>
              {currentUser?.name}
            </Text>
          )}
          <Flex align="center" justify="center">
            <Avatar size={screens.lg ? 36 : 32} icon={<UserOutlined />} />
          </Flex>
        </Space>
      </Dropdown>
    </Row>
  )
}
