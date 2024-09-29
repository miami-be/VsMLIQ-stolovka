'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { Typography, Input, Button, Row, Col, Card } from 'antd'
import { ShoppingCartOutlined, SearchOutlined } from '@ant-design/icons'
const { Text } = Typography
import { useUserContext } from '@/core/context'
import { useSnackbar } from 'notistack'
import { Api } from '@/core/trpc'
import { PageLayout } from '@/designSystem'
import { useRouter } from 'next/navigation'
import debounce from 'lodash/debounce'

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
  const [page, setPage] = useState(1)
  const pageSize = 20

  const { data: meals, fetchNextPage, hasNextPage } = Api.meal.findMany.useInfiniteQuery(
    {
      include: { mealTags: true },
      take: pageSize,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  )

  const { data: tags } = Api.mealTag.findMany.useQuery({})

  const { data: customers, refetch: refetchCustomers } =
    Api.customer.findMany.useQuery({
      where: { name: { contains: searchTerm, mode: 'insensitive' } },
    })

  const { mutateAsync: createOrder } = Api.order.create.useMutation()

  const filteredMeals = useMemo(() => 
    meals?.pages.flatMap(page => page.items).filter(
      meal =>
        selectedTags.length === 0 ||
        meal.mealTags?.some(tag => selectedTags.includes(tag.name || '')),
    ),
    [meals, selectedTags]
  )

  const addToCart = useCallback((meal: any) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.meal.id === meal.id)
      if (existingItem) {
        return prevCart.map(item =>
          item.meal.id === meal.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        return [...prevCart, { meal, quantity: 1 }]
      }
    })
  }, [])

  const removeFromCart = useCallback((mealId: string) => {
    setCart(prevCart => prevCart.filter(item => item.meal.id !== mealId))
  }, [])

  const getTotalAmount = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total + parseFloat(item.meal.price || '0') * item.quantity,
      0,
    )
  }, [cart])

  const handleOrder = async () => {
    if (!selectedCustomer) {
      enqueueSnackbar('Please select a customer', { variant: 'error' })
      return
    }

    try {
      await createOrder({
        data: {
          customerId: selectedCustomer.id,
          amount: getTotalAmount.toString(),
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

  const debouncedSearch = debounce((value) => {
    setSearchTerm(value)
    refetchCustomers()
  }, 300)

  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
    if (hasNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, fetchNextPage])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return (
    <PageLayout layout="full-width">
      <Row gutter={[16, 16]} className="bg-white px-4 py-8">
        <Col xs={24} md={18}>
          <Row gutter={[16, 16]}>
            {filteredMeals?.map(meal => (
              meal && (
                <Col xs={24} sm={12} md={8} lg={6} key={meal.id}>
                  <Card
                    cover={
                      <img
                        alt={meal?.name}
                        src={meal?.photoUrl}
                        className="h-40 object-cover"
                      />
                    }
                    hoverable
                    actions={[
                      <Button 
                        key="add" 
                        type="text" 
                        icon={<ShoppingCartOutlined />}
                        onClick={() => addToCart(meal)}
                      >
                        {meal?.price}
                      </Button>
                    ]}
                  >
                    <Card.Meta
                      title={meal?.name}
                      description={meal?.mealTags?.map(tag => tag?.name).join(', ')}
                    />
                  </Card>
                </Col>
              )
            ))}
          </Row>
        </Col>
        <Col xs={24} md={6}>
          <Card title="Shopping Cart" className="sticky top-4">
            {cart.length === 0 ? (
              <Text type="secondary">No data</Text>
            ) : (
              cart.map(item => (
                <div key={item.meal?.id} className="flex justify-between mb-2">
                  <Text>{item.meal?.name} x{item.quantity}</Text>
                  <Text>{(parseFloat(item.meal?.price || '0') * item.quantity).toFixed(2)}</Text>
                </div>
              ))
            )}
            <div className="mt-4 pt-4 border-t">
              <Text strong>Total: {getTotalAmount.toFixed(2)}</Text>
            </div>
            <Input
              placeholder="Search for a customer"
              prefix={<SearchOutlined />}
              onChange={e => debouncedSearch(e.target.value)}
              className="mt-4"
            />
            <div className="mt-4">
              <Text strong>Payment Method</Text>
              <div>
                {['Balance', 'Cash', 'Card'].map(method => (
                  <Button
                    key={method}
                    type={paymentType === method ? 'primary' : 'default'}
                    onClick={() => setPaymentType(method)}
                    className="mr-2 mb-2"
                  >
                    {method}
                  </Button>
                ))}
              </div>
            </div>
            <Button type="primary" block onClick={handleOrder} className="mt-4">
              Confirm Order
            </Button>
          </Card>
        </Col>
      </Row>
    </PageLayout>
  )
}
