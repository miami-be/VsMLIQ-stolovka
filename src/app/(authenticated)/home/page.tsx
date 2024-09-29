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
import { useSnackbar } from 'notistack'
import { Api } from '@/core/trpc'
import { PageLayout } from '@/designSystem'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()
  const { user } = useUserContext()
  const { enqueueSnackbar } = useSnackbar()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [cart, setCart] = useState<{ meal: any; quantity: number }[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [paymentType, setPaymentType] = useState<string>('Balance')
  const [isCustomerDropdownVisible, setIsCustomerDropdownVisible] = useState(false)

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
    <PageLayout layout="full-width">
      <Row gutter={[0, 16]} className="bg-white">
        <Col xs={24} md={16} className="px-4">
          <Space wrap className="mb-4">
            {tags?.map(tag => (
              <Tag
                key={tag.id}
                className={`cursor-pointer ${
                  selectedTags.includes(tag.name || '') ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'
                }`}
                onClick={() => {
                  if (selectedTags.includes(tag.name || '')) {
                    setSelectedTags(selectedTags.filter(t => t !== tag.name))
                  } else {
                    setSelectedTags([...selectedTags, tag.name || ''])
                  }
                }}
              >
                {tag.name}
              </Tag>
            ))}
          </Space>

          <Row gutter={[16, 16]}>
            {filteredMeals?.map(meal => (
              <Col xs={12} sm={8} md={6} key={meal.id}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={meal.name}
                      src={meal.photoUrl}
                      className="h-32 object-cover"
                    />
                  }
                  actions={[
                    <Button
                      key="add"
                      type="text"
                      icon={<ShoppingCartOutlined />}
                      onClick={() => addToCart(meal)}
                      className="text-blue-600 hover:text-blue-800"
                    />,
                  ]}
                  className="h-full"
                >
                  <Card.Meta
                    title={<span className="text-lg font-semibold">{meal.name}</span>}
                    description={
                      <Text strong className="text-gray-700">{meal.price}</Text>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </Col>

        <Col xs={24} md={8} className="px-4">
          <Card title="Shopping Cart" className="bg-white shadow-md">
            {cart.length === 0 ? (
              <Text className="text-gray-500">No data</Text>
            ) : (
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.meal.id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <Text strong className="text-lg">{item.meal.name}</Text>
                      <Text className="block text-gray-600">Quantity: {item.quantity}</Text>
                    </div>
                    <div className="text-right">
                      <Text className="block font-semibold">
                        ${(parseFloat(item.meal.price || '0') * item.quantity).toFixed(2)}
                      </Text>
                      <Button
                        size="small"
                        danger
                        onClick={() => removeFromCart(item.meal.id)}
                        className="mt-1"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="text-right pt-4 border-t">
              <Text strong className="text-xl">Total: {getTotalAmount().toFixed(2)}</Text>
            </div>

            <div className="mt-6">
              <Input
                placeholder="Search for a customer"
                prefix={<SearchOutlined className="text-gray-400" />}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onPressEnter={() => refetchCustomers()}
                className="mb-2"
                onClick={() => setIsCustomerDropdownVisible(true)}
                onBlur={() => setTimeout(() => setIsCustomerDropdownVisible(false), 200)}
              />
              {isCustomerDropdownVisible && (
                <div className="max-h-40 overflow-y-auto border rounded">
                  {customers?.map(customer => (
                    <div
                      key={customer.id}
                      className={`p-2 cursor-pointer hover:bg-gray-100 ${
                        selectedCustomer?.id === customer.id ? 'bg-blue-100' : ''
                      }`}
                      onClick={() => {
                        setSelectedCustomer(customer)
                        setIsCustomerDropdownVisible(false)
                      }}
                    >
                      <Text>{customer.name}</Text>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6">
              <Radio.Group
                value={paymentType}
                onChange={e => setPaymentType(e.target.value)}
                optionType="button"
                buttonStyle="solid"
                className="w-full"
              >
                <Radio.Button value="Balance" className="flex-1 text-center">Balance</Radio.Button>
                <Radio.Button value="Cash" className="flex-1 text-center">Cash</Radio.Button>
                <Radio.Button value="Card" className="flex-1 text-center">Card</Radio.Button>
              </Radio.Group>
            </div>

            <Button
              type="primary"
              onClick={handleOrder}
              block
              className="mt-6 h-12 text-lg font-semibold"
            >
              Confirm Order
            </Button>
          </Card>
        </Col>
      </Row>
    </PageLayout>
  )
}
