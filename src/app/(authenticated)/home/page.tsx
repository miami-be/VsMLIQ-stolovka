'use client'

import { useState } from 'react'
import {
  Typography,
  Input,
  Card,
  Button,
  Row,
  Col,
  Tag,
  Radio,
  Space,
} from 'antd'
import { ShoppingCartOutlined, SearchOutlined } from '@ant-design/icons'
const { Title, Text } = Typography
import { useUserContext } from '@/core/context'
import { useRouter, useParams } from 'next/navigation'
import { useUploadPublic } from '@/core/hooks/upload'
import { useSnackbar } from 'notistack'
import dayjs from 'dayjs'
import { Api } from '@/core/trpc'
import { PageLayout } from '@/designSystem'

export default function HomePage() {
  const router = useRouter()
  const { user } = useUserContext()
  const { enqueueSnackbar } = useSnackbar()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [cart, setCart] = useState<{ meal: any; quantity: number }[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [paymentType, setPaymentType] = useState<string>('Balance')

  const { data: meals } = Api.meal.findMany.useQuery({
    include: { mealTags: true },
  })

  const { data: tags } = Api.mealTag.findMany.useQuery({})

  const { data: customers, refetch: refetchCustomers } =
    Api.customer.findMany.useQuery({
      where: { name: { contains: searchTerm, mode: 'insensitive' } },
    })

  const { mutateAsync: createOrder } = Api.order.create.useMutation()

  const filteredMeals = meals?.filter(
    meal =>
      selectedTags.length === 0 ||
      meal.mealTags?.some(tag => selectedTags.includes(tag.name || '')),
  )

  const addToCart = (meal: any) => {
    const existingItem = cart.find(item => item.meal.id === meal.id)
    if (existingItem) {
      setCart(
        cart.map(item =>
          item.meal.id === meal.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      )
    } else {
      setCart([...cart, { meal, quantity: 1 }])
    }
  }

  const removeFromCart = (mealId: string) => {
    setCart(cart.filter(item => item.meal.id !== mealId))
  }

  const getTotalAmount = () => {
    return cart.reduce(
      (total, item) =>
        total + parseFloat(item.meal.price || '0') * item.quantity,
      0,
    )
  }

  const handleOrder = async () => {
    if (!selectedCustomer) {
      enqueueSnackbar('Please select a customer', { variant: 'error' })
      return
    }

    try {
      await createOrder({
        data: {
          customerId: selectedCustomer.id,
          amount: getTotalAmount().toString(),
          paymentMethod: paymentType,
          orderItems: {
            create: cart.map(item => ({
              mealId: item.meal.id,
              quantity: item.quantity,
            })),
          },
        },
      })
      enqueueSnackbar('Order created successfully', { variant: 'success' })
      setCart([])
      setSelectedCustomer(null)
      setPaymentType('Balance')
    } catch (error) {
      enqueueSnackbar('Failed to create order', { variant: 'error' })
    }
  }

  return (
    <PageLayout layout="narrow">
      <Title level={2}>Meal Catalogue</Title>
      <Text>
        Browse available meals, add them to your cart, and place an order.
      </Text>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} md={16}>
          <Space wrap>
            {tags?.map(tag => (
              <Tag
                key={tag.id}
                color={
                  selectedTags.includes(tag.name || '') ? 'blue' : 'default'
                }
                onClick={() => {
                  if (selectedTags.includes(tag.name || '')) {
                    setSelectedTags(selectedTags.filter(t => t !== tag.name))
                  } else {
                    setSelectedTags([...selectedTags, tag.name || ''])
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                {tag.name}
              </Tag>
            ))}
          </Space>

          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            {filteredMeals?.map(meal => (
              <Col xs={24} sm={12} md={8} key={meal.id}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={meal.name}
                      src={meal.photoUrl}
                      style={{ height: 200, objectFit: 'cover' }}
                    />
                  }
                  actions={[
                    <Button
                      key="add"
                      type="primary"
                      icon={<ShoppingCartOutlined />}
                      onClick={() => addToCart(meal)}
                    >
                      Add to Cart
                    </Button>,
                  ]}
                >
                  <Card.Meta title={meal.name} description={`$${meal.price}`} />
                </Card>
              </Col>
            ))}
          </Row>
        </Col>

        <Col xs={24} md={8}>
          <Card title="Checkout Summary">
            {cart.map(item => (
              <div key={item.meal.id} style={{ marginBottom: 8 }}>
                <Text>{item.meal.name}</Text>
                <Text style={{ float: 'right' }}>
                  $
                  {(parseFloat(item.meal.price || '0') * item.quantity).toFixed(
                    2,
                  )}
                </Text>
                <br />
                <Text type="secondary">Quantity: {item.quantity}</Text>
                <Button
                  size="small"
                  danger
                  style={{ float: 'right' }}
                  onClick={() => removeFromCart(item.meal.id)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <div style={{ marginTop: 16 }}>
              <Text strong>Total: ${getTotalAmount().toFixed(2)}</Text>
            </div>

            <div style={{ marginTop: 16 }}>
              <Input
                placeholder="Search customer"
                prefix={<SearchOutlined />}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onPressEnter={() => refetchCustomers()}
              />
              {customers?.map(customer => (
                <div
                  key={customer.id}
                  style={{
                    padding: 8,
                    cursor: 'pointer',
                    backgroundColor:
                      selectedCustomer?.id === customer.id
                        ? '#e6f7ff'
                        : 'transparent',
                  }}
                  onClick={() => setSelectedCustomer(customer)}
                >
                  <Text>{customer.name}</Text>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 16 }}>
              <Text>Payment Type:</Text>
              <Radio.Group
                value={paymentType}
                onChange={e => setPaymentType(e.target.value)}
              >
                <Radio value="Balance">Balance</Radio>
                <Radio value="Cash">Cash</Radio>
                <Radio value="Card">Card</Radio>
              </Radio.Group>
            </div>

            <Button
              type="primary"
              style={{ marginTop: 16 }}
              onClick={handleOrder}
              block
            >
              Place Order
            </Button>
          </Card>
        </Col>
      </Row>
    </PageLayout>
  )
}
