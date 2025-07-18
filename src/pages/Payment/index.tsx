import { Button, Card, Col, Row, Space, Typography, Modal } from 'antd'
import React, { useState } from 'react'

const { Title, Text } = Typography

const plans = [
  {
    key: 'monthly',
    title: 'Gói Tháng',
    price: '59.000đ / tháng',
    description: 'Truy cập Premium trong 30 ngày',
    qrCode: '/images/59.jpg', 
  },
  {
    key: 'quarterly',
    title: 'Gói Quý',
    price: '159.000đ / 3 tháng',
    description: 'Tiết kiệm 16%, gia hạn 3 tháng',
    qrCode: ' /images/159.jpg',
  },
  {
    key: 'yearly',
    title: 'Gói Năm',
    price: '490.000đ / năm',
    description: 'Tiết kiệm 33%, dùng 12 tháng',
    qrCode: '',
  },
]

const Payment: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [currentQrCode, setCurrentQrCode] = useState<string | null>(null)

  const handleSubscribe = (planKey: string) => {
    const selectedPlan = plans.find((plan) => plan.key === planKey)
    if (selectedPlan) {
      setCurrentQrCode(selectedPlan.qrCode)
      setIsModalVisible(true)
    }
  }

  const handleOk = () => {
    setIsModalVisible(false)
    setCurrentQrCode(null)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    setCurrentQrCode(null)
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
                <Text strong style={{ fontSize: 18 }}>
                  {plan.price}
                </Text>
                <Text>{plan.description}</Text>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title="Quét mã QR để thanh toán"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Đóng
          </Button>,
        ]}
      >
        {currentQrCode && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <img src={currentQrCode} alt="QR Code" style={{ maxWidth: '100%', height: 'auto' }} />
            <Text type="secondary" style={{ marginTop: '10px', display: 'block' }}>
              Vui lòng quét mã QR này để hoàn tất thanh toán. Thông tin chuyển khoản bao gồm email đăng ký
            </Text>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Payment