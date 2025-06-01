import { UserOutlined } from '@ant-design/icons'
import { Avatar, Dropdown, Flex, Row, Space, Typography } from 'antd'
import type { MenuProps } from 'antd'
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint'
import { useNavigate } from 'react-router-dom'

const { Text } = Typography

function UserDropdownAuth() {
  const screens = useBreakpoint()
  const navigate = useNavigate()
  // Mock user info
  const user = {
    profile: { fullName: 'Nguyễn Văn A' },
    email: 'a@example.com',
  }

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <Space size={10} align="center">
          <UserOutlined />
          <Text>{user?.profile?.fullName || user?.email}</Text>
        </Space>
      ),
    },
    {
      key: '2',
      label: ( 
        <Space size={10} align="center">
          <Text type="secondary" onClick={()=> navigate('/login')}>Logout</Text>
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
              {user?.profile?.fullName || user?.email}
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

export default UserDropdownAuth
