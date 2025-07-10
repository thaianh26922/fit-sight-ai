import { Card, Col, Input, Row, Table, Typography } from 'antd'
import moment from 'moment'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context'

const { Title } = Typography

// Khai báo lại interface User cho đồng bộ với file AuthContext
interface User {
  id: number
  email: string
  name: string
  password: string
  createDate: string
}

const Manager: React.FC = () => {
  // Lấy userList từ AuthContext
  const { userList } = useContext(AuthContext)
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  // Sử dụng useEffect để cập nhật danh sách người dùng khi userList hoặc searchTerm thay đổi
  useEffect(() => {
    if (userList) {
      // Lọc danh sách người dùng dựa trên searchTerm
      const filtered = userList.filter((user) =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredUsers(filtered as User[])
    }
  }, [searchTerm, userList])

  const columns = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createDate', // Sửa từ 'createdAt' thành 'createDate' để khớp với AuthContext
      key: 'createDate',
      render: (date: string) => moment(date).format('DD/MM/YYYY HH:mm'),
    },
  ]

  return (
    <div style={{ padding: '24px' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={3}>Quản lý người dùng</Title>
        </Col>
        <Col>
          <Card>
            <Title level={5} style={{ margin: 0 }}>
              Tổng số người dùng: {userList ? userList.length : 0}
            </Title>
          </Card>
        </Col>
      </Row>

      <Row style={{ marginBottom: 16 }}>
        <Col span={24}>
          <Input.Search
            placeholder="Tìm theo email"
            allowClear
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
      </Row>

      <Table
        dataSource={filteredUsers} // Đổi dataSource thành filteredUsers để bảng hiển thị dữ liệu đã lọc
        columns={columns}
        rowKey="id"
        loading={!userList} // Cập nhật trạng thái loading, hiển thị khi userList chưa có dữ liệu
        pagination={{ pageSize: 10 }}
      />
    </div>
  )
}

export default Manager