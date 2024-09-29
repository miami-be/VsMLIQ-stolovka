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

  const { data: meals, fetchNextPage, hasNextPage, isLoading, error } = Api.meal.findMany.useInfiniteQuery(
    {
      where: { isActive: true },
      include: { mealTags: true },
      take: pageSize,
    },
    {
      getNextPageParam: (lastPage, allPages) => ({ skip: allPages.length * pageSize }),
    }
  )

  useEffect(() => {
    if (error) {
      const errorMessage = error.message || 'An unexpected error occurred';
      const formattedError = error.cause?.code ? `${errorMessage} (Code: ${error.cause.code})` : errorMessage;
      enqueueSnackbar(`Error loading meals: ${formattedError}`, { variant: 'error' });
    }
  }, [error, enqueueSnackbar]);

  const { data: tags } = Api.mealTag.findMany.useQuery({})

  const { data: customers, refetch: refetchCustomers } =
    Api.customer.findMany.useQuery({
      where: { name: { contains: searchTerm, mode: 'insensitive' } },
    })

  const { mutateAsync: createOrder } = Api.order.create.useMutation()

  const filteredMeals = useMemo(() => {
    const allMeals = meals?.pages.flatMap(page => page) || [];
    return allMeals.filter(meal => 
      selectedTags.length === 0 || meal.mealTags?.some(tag => selectedTags.includes(tag.name || ''))
    );
  }, [meals, selectedTags])

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        await fetchNextPage({ pageParam: { skip: (page - 1) * pageSize, take: pageSize } });
      } catch (error) {
        const errorMessage = error.message || 'An unexpected error occurred';
        const formattedError = error.cause?.code ? `${errorMessage} (Code: ${error.cause.code})` : errorMessage;
        enqueueSnackbar(`Error fetching meals: ${formattedError}`, { variant: 'error' });
      }
    };
    fetchMeals();
  }, [fetchNextPage, enqueueSnackbar, page, pageSize]);
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
          {isLoading ? (
            <div>Loading meals...</div>
          ) : error ? (
            <div>Error loading meals: {error.message}</div>
          ) : filteredMeals && filteredMeals.length > 0 ? (
            <Row gutter={[16, 16]}>
              {filteredMeals.map(meal => (
                meal && (
                  <Col xs={12} sm={6} md={4} lg={3} key={meal.id}>
                    <Card
                      cover={
                        <img
                          alt={meal?.name}
                          src={meal?.photoUrl}
                          className="h-24 object-cover"
                        />
                      }
                      hoverable
                    >
                      <Card.Meta
                        title={meal?.name}
                        style={{ fontSize: '0.7rem' }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                        <Text style={{ fontSize: '0.7rem' }}>{meal?.price}</Text>
                        <Button 
                          type="text" 
                          icon={<ShoppingCartOutlined />}
                          onClick={() => addToCart(meal)}
                          size="small"
                        />
                      </div>
                    </Card>
                  </Col>
                )
              ))}
            </Row>
          ) : (
            <div>No meals available</div>
          )}
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
