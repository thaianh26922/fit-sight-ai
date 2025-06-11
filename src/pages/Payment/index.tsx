import React from 'react'
import { Card, Col, Row, Button, Typography, Space, message } from 'antd'
import Cookies from 'js-cookie'
import { toast } from 'react-toastify'

const { Title, Text } = Typography

const plans = [
  {
    key: 'monthly',
    title: 'Gói Tháng',
    price: '59.000đ / tháng',
    description: 'Truy cập Premium trong 30 ngày',
  },
  {
    key: 'quarterly',
    title: 'Gói Quý',
    price: '159.000đ / 3 tháng',
    description: 'Tiết kiệm 16%, gia hạn 3 tháng',
  },
  {
    key: 'yearly',
    title: 'Gói Năm',
    price: '490.000đ / năm',
    description: 'Tiết kiệm 33%, dùng 12 tháng',
  },
]

// const historyData = [
//   {
//     key: '1',
//     date: '02/06/2025',
//     plan: 'Gói Tháng',
//     amount: '99.000đ',
//     status: 'Thành công',
//   },
//   {
//     key: '2',
//     date: '01/05/2025',
//     plan: 'Gói Tháng',
//     amount: '99.000đ',
//     status: 'Thành công',
//   },
// ]

// const columns = [
//   {
//     title: 'Ngày giao dịch',
//     dataIndex: 'date',
//     key: 'date',
//   },
//   {
//     title: 'Gói',
//     dataIndex: 'plan',
//     key: 'plan',
//   },
//   {
//     title: 'Số tiền',
//     dataIndex: 'amount',
//     key: 'amount',
//   },
//   {
//     title: 'Trạng thái',
//     dataIndex: 'status',
//     key: 'status',
//     render: (status: string) => (
//       <Text type={status === 'Thành công' ? 'success' : 'danger'}>
//         {status}
//       </Text>
//     ),
//   },
// ]
const Payment: React.FC = () => {
  const handleSubscribe = async (planKey: string) => {
    const token = Cookies.get('accessToken')

    if (!token) {
      message.error('Vui lòng đăng nhập để thanh toán.')
      return
    }

    try {
      const response = await fetch(
        `https://7b45-58-187-228-118.ngrok-free.app/payment/create?pkg=${planKey}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (response.ok) {
        message.success('Chuyển đến cổng thanh toán...')
      // Mở trang thanh toán
      window.location.href = data.paymentUrl
        // TODO: reload lịch sử giao dịch nếu cần
      } else {
        throw new Error(data.message || 'Có lỗi xảy ra khi thanh toán.')
      }
    } catch {
      toast.error(`Thanh toán thất bại`)
    }
  }

  return (
    <div style={{ padding: '24px' }}>
      <Title level={3}>Chọn gói Premium</Title>

      <Row gutter={[16, 16]} justify="center" style={{ marginBottom: 40 }}>
        {plans.map((plan) => (
          <Col xs={24} sm={12} md={8} key={plan.key}>
            <Card
              title={plan.title}
              bordered
              style={{ borderRadius: 12 }}
              actions={[
                <Button
                  type="primary"
                  onClick={() => handleSubscribe(plan.key)}
                  style={{ backgroundColor: '#34c759', borderColor: '#34c759' }}
                >
                  Đăng ký ngay
                </Button>,
              ]}
            >
              <Space direction="vertical" size="small">
                <Text strong style={{ fontSize: 18 }}>{plan.price}</Text>
                <Text>{plan.description}</Text>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {/* <Title level={4}>Lịch sử giao dịch</Title>
      <Table
        columns={columns}
        dataSource={historyData}
        pagination={{ pageSize: 5 }}
        bordered
        rowKey="key"
      /> */}
    </div>
  )
}

export default Payment
