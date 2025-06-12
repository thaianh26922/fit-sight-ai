import React, { useEffect, useState } from 'react'
import { Table, Typography, Row, Col, Card, Input } from 'antd'
import axios from 'axios'
import Cookies from 'js-cookie'
import moment from 'moment'

const { Title } = Typography

interface User {
  id: string
  email: string
  createdAt: string
}

const Manager: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = Cookies.get('accessToken')
        const response = await axios.get(
          'https://ee33-58-187-228-107.ngrok-free.app/users',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        setUsers(response.data.data)
        setFilteredUsers(response.data.data)
      } catch (error) {
        console.error('Lỗi khi tải danh sách người dùng:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  useEffect(() => {
    const filtered = users.filter((user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredUsers(filtered)
  }, [searchTerm, users])

  const columns = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
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
              Tổng số người dùng: {filteredUsers.length}
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
        dataSource={filteredUsers}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  )
}

export default Manager
