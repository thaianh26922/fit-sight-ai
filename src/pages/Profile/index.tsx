import React, { useContext, useEffect, useState } from 'react'
import { Row, Col, Card, Table, message, DatePicker } from 'antd'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import dayjs, { Dayjs } from 'dayjs'
import { AuthContext } from '../../context'
import PageHeader from '../../widgets/LazyLoading/PageHeader'

const { RangePicker } = DatePicker
const COLORS = ['#FF6384', '#34c759', '#36A2EB']

type RadarStat = { subject: string; A: number; fullMark: number }
type PieStat = { name: string; value: number }
type Workout = { key: number; day: string; activity: string }
type Diet = { key: number; day: string; meals: string }

const Profile: React.FC = () => {
  const { analysisData } = useContext(AuthContext)

  const [radarData, setRadarData] = useState<RadarStat[]>([])
  const [pieData, setPieData] = useState<PieStat[]>([])
  const [workoutSchedule, setWorkoutSchedule] = useState<Workout[]>([])
  const [dietSchedule, setDietSchedule] = useState<Diet[]>([])
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().startOf('day'),
    dayjs().endOf('day'),
  ])

  useEffect(() => {
    if (!analysisData) {
      message.warning('Không có dữ liệu phân tích!')
      return
    }

    const stats = analysisData.bodyStats
    const composition = analysisData.bodyComposition
    const workout = analysisData.workoutSchedule
    const mealPlan = analysisData.mealPlan

    // Radar data
    setRadarData([
      { subject: 'Sức mạnh', A: stats.strength, fullMark: 150 },
      { subject: 'Bền bỉ', A: stats.endurance, fullMark: 150 },
      { subject: 'Dẻo dai', A: stats.flexibility, fullMark: 150 },
      { subject: 'Trao đổi chất', A: stats.metabolism, fullMark: 150 },
      { subject: 'Tư thế', A: stats.posture, fullMark: 150 },
    ])

    // Pie data
    setPieData([
      { name: 'Mỡ cơ thể', value: parseFloat(composition.fat) },
      { name: 'Cơ bắp', value: parseFloat(composition.muscle) },
      { name: 'Nước', value: parseFloat(composition.water) },
    ])

    // Workout schedule
    const workoutArray: Workout[] = Object.entries(workout).map(([day, activity], i) => ({
      key: i,
      day,
      activity,
    }))
    setWorkoutSchedule(workoutArray)

    const dietArray: Diet[] = Object.entries(mealPlan).map(([day, meals], i) => ({
      key: i,
      day,
      meals: `Ăn sáng: ${meals.sang.ten_mon} (${meals.sang.calo_tren_100g} calo/100g)
Trưa: ${meals.trua.ten_mon} (${meals.trua.calo_tren_100g} calo/100g)
Tối: ${meals.toi.ten_mon} (${meals.toi.calo_tren_100g} calo/100g)`,
    }))

    setDietSchedule(dietArray)
  }, [analysisData])

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <PageHeader
            title="Thống kê cơ thể"
            extra={
              <Row justify="end" gutter={[16, 16]}>
                <Col>
                  <RangePicker
                    showTime={false}
                    format="YYYY-MM-DD"
                    value={dateRange}
                    onChange={(dates) => {
                      if (dates) setDateRange(dates as [Dayjs, Dayjs])
                    }}
                  />
                </Col>
              </Row>
            }
          />
        </Col>

        <Col xs={24} md={12}>
          <Card title="Radar chỉ số thể chất">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis />
                <Radar name="Chỉ số" dataKey="A" stroke="#34c759" fill="#34c759" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Tỉ lệ thành phần cơ thể">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100} label>
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Lịch tập luyện">
            <Table
              dataSource={workoutSchedule}
              pagination={false}
              columns={[
                { title: 'Ngày', dataIndex: 'day', key: 'day' },
                { title: 'Hoạt động', dataIndex: 'activity', key: 'activity' },
              ]}
            />
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Lịch ăn uống">
            <Table
              dataSource={dietSchedule}
              pagination={false}
              columns={[
                { title: 'Ngày', dataIndex: 'day', key: 'day' },
                {
                  title: 'Bữa ăn',
                  dataIndex: 'meals',
                  key: 'meals',
                  render: (text) => <pre style={{ whiteSpace: 'pre-wrap' }}>{text}</pre>,
                },
              ]}
            />

          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Profile
