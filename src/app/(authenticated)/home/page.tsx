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
      getNextPageParam: (lastPage, allPages) => ({ skip: allPages.length * pageSize, take: pageSize }),
    }
  )

  useEffect(() => {
    if (error) {
      const errorMessage = error.message || 'An unexpected error occurred';
      const nestedError = error.cause?.message || error.cause?.code;
      const formattedError = nestedError ? `${errorMessage} (${nestedError})` : errorMessage;
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
        await fetchNextPage();
      } catch (error) {
        const errorMessage = error.message || 'An unexpected error occurred';
        const nestedError = error.cause?.message || error.cause?.code;
        const formattedError = nestedError ? `${errorMessage} (${nestedError})` : errorMessage;
        enqueueSnackbar(`Error fetching meals: ${formattedError}`, { variant: 'error' });
      }
    };
    fetchMeals();
  }, [fetchNextPage, enqueueSnackbar]);
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
    enqueueSnackbar(`${meal.name} added to cart`, { variant: 'success' })
  }, [enqueueSnackbar])

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
      <Row gutter={[16, 16]} className="bg-gray-100 px-4 py-8">
        <Col xs={24} lg={18}>
          {isLoading ? (
            <div>Loading meals...</div>
          ) : error ? (
            <div>Error loading meals: {error.message}</div>
          ) : filteredMeals && filteredMeals.length > 0 ? (
            <Row gutter={[16, 16]}>
              {filteredMeals.map(meal => (
                meal && (
                  <Col xs={12} sm={8} md={6} lg={4} key={meal.id}>
                    <Card
                      hoverable
                      onClick={() => addToCart(meal)}
                      cover={
                        <div style={{ height: '150px', overflow: 'hidden' }}>
                          <img
                            src={meal?.photoUrl || '/placeholder.jpg'}
                            alt={meal?.name || 'Meal'}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                      }
                      bodyStyle={{ padding: '12px' }}
                    >
                      <Card.Meta
                        title={<span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{meal?.name}</span>}
                        description={
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                            <span style={{ fontSize: '0.8rem' }}>{meal?.price}</span>
                          </div>
                        }
                      />
                    </Card>
                  </Col>
                )
              ))}
            </Row>
          ) : (
            <div>No meals available</div>
          )}
        </Col>
        <Col xs={24} lg={6}>
          <Card className="sticky top-4">
            <h2 className="text-xl font-bold mb-4">Shopping Cart</h2>
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
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xl font-bold">Total: {getTotalAmount.toFixed(2)}</p>
            </div>
            <Input
              placeholder="Search for a customer"
              prefix={<SearchOutlined className="text-gray-400" />}
              onChange={e => debouncedSearch(e.target.value)}
              className="mt-6"
            />
            <div className="mt-6">
              <p className="font-semibold mb-2">Payment Method</p>
              <div className="flex flex-wrap gap-2">
                {['Balance', 'Cash', 'Card'].map(method => (
                  <Button
                    key={method}
                    type={paymentType === method ? 'primary' : 'default'}
                    onClick={() => setPaymentType(method)}
                    className="flex-grow"
                  >
                    {method}
                  </Button>
                ))}
              </div>
            </div>
            <Button type="primary" block onClick={handleOrder} className="mt-6">
              Confirm Order
            </Button>
          </Card>
        </Col>
      </Row>
    </PageLayout>
  )
}
