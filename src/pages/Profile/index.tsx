import React, { useEffect, useState } from 'react'
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
import axios from 'axios'
import PageHeader from '../../widgets/LazyLoading/PageHeader'
import Cookies from 'js-cookie'
import dayjs, { Dayjs } from 'dayjs'

const { RangePicker } = DatePicker
const COLORS = ['#FF6384', '#34c759', '#36A2EB']

type RadarStat = {
  subject: string
  A: number
  fullMark: number
}

type PieStat = {
  name: string
  value: number
}

type Workout = {
  key: number
  day: string
  activity: string
}

type Diet = {
  key: number
  day: string
  meals: string
}

type BodyStats = {
  strength: number
  endurance: number
  flexibility: number
  metabolism: number
  posture: number
}

type BodyComposition = {
  fat: number
  muscle: number
  water: number
}

type WorkoutItem = {
  day: string
  activity: string
}

type MealPlanItem = {
  day: string
  breakfast: string
  lunch: string
  dinner: string
}

type DailyStat = {
  bodyStats: BodyStats[]
  workoutSchedule: WorkoutItem[]
  mealPlan: MealPlanItem[]
}

type FitnessHistoryResponse = {
  weeklyStats?: {
    bodyStats?: BodyStats
    bodyComposition?: BodyComposition
  }
  dailyStats: DailyStat[]
}

const Profile: React.FC = () => {
  const [radarData, setRadarData] = useState<RadarStat[]>([])
  const [pieData, setPieData] = useState<PieStat[]>([])
  const [workoutSchedule, setWorkoutSchedule] = useState<Workout[]>([])
  const [dietSchedule, setDietSchedule] = useState<Diet[]>([])
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().startOf('day'),
    dayjs().endOf('day'),
  ])

  const fetchData = async (startDate: string, endDate: string) => {
    const token = Cookies.get('accessToken')
    try {
      const res = await axios.get<FitnessHistoryResponse>(
        `https://ee33-58-187-228-107.ngrok-free.app/fitness/history?start=${startDate}&end=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const result = res.data
      const stats = result.weeklyStats?.bodyStats
      const composition = result.weeklyStats?.bodyComposition

      if (stats) {
        setRadarData([
          { subject: 'Sức mạnh', A: stats.strength, fullMark: 150 },
          { subject: 'Bền bỉ', A: stats.endurance, fullMark: 150 },
          { subject: 'Dẻo dai', A: stats.flexibility, fullMark: 150 },
          { subject: 'Trao đổi chất', A: stats.metabolism, fullMark: 150 },
          { subject: 'Tư thế', A: stats.posture, fullMark: 150 },
        ])
      } else {
        setRadarData([])
      }

      if (composition) {
        setPieData([
          { name: 'Mỡ cơ thể', value: composition.fat },
          { name: 'Cơ bắp', value: composition.muscle },
          { name: 'Nước', value: composition.water },
        ])
      } else {
        setPieData([])
      }

      const todayStats = result.dailyStats.find((d) => d.bodyStats?.length > 0)

      if (todayStats) {
        const workout = todayStats.workoutSchedule ?? []
        const meal = todayStats.mealPlan ?? []

        setWorkoutSchedule(
          workout.map((item, i) => ({
            key: i,
            day: item.day,
            activity: item.activity,
          }))
        )

        setDietSchedule(
          meal.map((item, i) => ({
            key: i,
            day: item.day,
            meals: `Ăn sáng: ${item.breakfast}\nTrưa: ${item.lunch}\nTối: ${item.dinner}`,
          }))
        )
      } else {
        setWorkoutSchedule([])
        setDietSchedule([])
      }
    } catch (err) {
      message.error('Không thể tải dữ liệu từ máy chủ')
      console.error(err)
    }
  }

  useEffect(() => {
    const [start, end] = dateRange
    if (start && end) {
      fetchData(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'))
    }
  }, [dateRange])

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
