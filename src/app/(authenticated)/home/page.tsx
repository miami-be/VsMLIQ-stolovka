'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { Typography, Input, Button, Row, Col, Card, InputNumber, Select, Tag, Collapse, Space } from 'antd'
import { ShoppingCartOutlined, SearchOutlined, DeleteOutlined, CloseCircleOutlined, CaretRightOutlined } from '@ant-design/icons'
const { Text } = Typography
const { Panel } = Collapse
import { useUserContext } from '@/core/context'
import { useSnackbar } from 'notistack'
import { Api } from '@/core/trpc'
import { PageLayout } from '@/designSystem/layouts/PageLayout'
import { useRouter } from 'next/navigation'
import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'

export default function HomePage() {
  const router = useRouter()
  const { user } = useUserContext()
  const { enqueueSnackbar } = useSnackbar()

  const [searchTerm, setSearchTerm] = useState('')
  const [cart, setCart] = useState<{ meal: any; quantity: number }[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [paymentType, setPaymentType] = useState<string>('Balance')
  const [isCustomerListVisible, setIsCustomerListVisible] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const pageSize = 20

  const { data: meals, fetchNextPage, hasNextPage, isLoading, error } = Api.meal.findMany.useInfiniteQuery(
    {
      where: { isActive: true },
      include: { mealTags: { where: { name: { in: ['Завтрак', 'Основное', 'Гарнир', 'Напитки', 'Хлеб'] } } } },
      take: pageSize,
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.length < pageSize) {
          return undefined;
        }
        return { skip: allPages.length * pageSize, take: pageSize };
      },
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

  const { data: customers, refetch: refetchCustomers, error: customerError } =
    Api.customer.findMany.useQuery({
      where: { name: { contains: searchTerm, mode: 'insensitive' } },
    })

  useEffect(() => {
    if (customerError) {
      const errorMessage = customerError.message || 'An unexpected error occurred';
      const nestedError = customerError.cause?.message || customerError.cause?.code;
      const formattedError = nestedError ? `${errorMessage} (${nestedError})` : errorMessage;
      enqueueSnackbar(`Error fetching customers: ${formattedError}`, { variant: 'error' });
    }
  }, [customerError, enqueueSnackbar]);

  const { mutateAsync: createOrder } = Api.order.create.useMutation()

  const groupedMeals = useMemo(() => {
    const allMeals = meals?.pages.flatMap(page => page) || [];
    const groups = {};
    allMeals.forEach(meal => {
      meal.mealTags?.forEach(tag => {
        if (!groups[tag.name]) {
          groups[tag.name] = [];
        }
        groups[tag.name].push(meal);
      });
    });
    const orderPriority = ['Завтрак', 'Основное', 'Гарнир', 'Напитки', 'Хлеб'];
    return Object.entries(groups).sort((a, b) => {
      const indexA = orderPriority.indexOf(a[0]);
      const indexB = orderPriority.indexOf(b[0]);
      if (indexA === -1 && indexB === -1) return a[0].localeCompare(b[0]);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  }, [meals])

  const uniqueTags = useMemo(() => {
    return Array.from(new Set(groupedMeals.map(([tag]) => tag)));
  }, [groupedMeals])

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

  const updateCartItemQuantity = useCallback((mealId: string, newQuantity: number) => {
    setCart(prevCart => prevCart.map(item => 
      item.meal.id === mealId ? { ...item, quantity: newQuantity } : item
    ).filter(item => item.quantity > 0))
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
      setIsCustomerListVisible(false)
    } catch (error) {
      enqueueSnackbar('Failed to create order', { variant: 'error' })
    }
  }

  const debouncedSearch = debounce((value) => {
    setSearchTerm(value)
    refetchCustomers()
  }, 300)

  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop < document.documentElement.offsetHeight - 200) return;
    if (hasNextPage && !isLoading) {
      fetchNextPage()
    }
  }, [hasNextPage, fetchNextPage, isLoading])

  useEffect(() => {
    const throttledHandleScroll = throttle(handleScroll, 200);
    window.addEventListener('scroll', throttledHandleScroll)
    return () => window.removeEventListener('scroll', throttledHandleScroll)
  }, [handleScroll])

  const handleCustomerSelect = (value: string, option: any) => {
    setSelectedCustomer(option.customer)
  }

  const handleClearCustomer = () => {
    setSelectedCustomer(null)
  }

  return (
    <PageLayout layout="full-width">
      <Row gutter={[16, 16]} className="bg-gray-100 px-2 pb-4">
        <Col xs={24} lg={20}>
          <Row className="mb-4">
            <Space wrap>
              {uniqueTags.map(tag => (
                <Tag
                  key={tag}
                  color={selectedTag === tag ? 'blue' : 'default'}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                >
                  {tag}
                </Tag>
              ))}
            </Space>
          </Row>
          {isLoading ? (
            <div>Loading meals...</div>
          ) : error ? (
            <div>Error loading meals: {error.message}</div>
          ) : (
            <Collapse
              defaultActiveKey={selectedTag ? [selectedTag] : [groupedMeals[0]?.[0]]}
              expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
            >
              {groupedMeals
                .filter(([category]) => !selectedTag || category === selectedTag)
                .map(([category, meals]) => (
                  <Panel header={<h2 className="text-xl font-bold">{category}</h2>} key={category}>
                    <Row gutter={[8, 8]}>
                      {meals.map(meal => (
                        <Col xs={8} sm={6} md={4} lg={3} xl={2} key={meal.id}>
                          <Card
                            hoverable
                            onClick={() => addToCart(meal)}
                            cover={
                              <div style={{ height: '120px', overflow: 'hidden' }}>
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
                              title={<span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{meal?.name}</span>}
                              description={
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                                  <span style={{ fontSize: '0.7rem' }}>{meal?.price}</span>
                                  <ShoppingCartOutlined style={{ fontSize: '1.2rem', color: '#4CAF50' }} />
                                </div>
                              }
                            />
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </Panel>
                ))}
            </Collapse>
          )}
        </Col>
        <Col xs={24} lg={4}>
          <Card className="sticky top-4">
            <h2 className="text-xl font-bold mb-4">Shopping Cart</h2>
            {cart.length === 0 ? (
              <Text type="secondary">No data</Text>
            ) : (
              cart.map(item => (
                <div key={item.meal?.id} className="flex justify-between items-center mb-2">
                  <Text>{item.meal?.name}</Text>
                  <div className="flex items-center">
                    <InputNumber
                      min={1}
                      value={item.quantity}
                      onChange={(value) => updateCartItemQuantity(item.meal.id, value)}
                      style={{ width: '60px', marginRight: '8px' }}
                    />
                    <Text style={{ marginRight: '8px' }}>{(parseFloat(item.meal?.price || '0') * item.quantity).toFixed(2)}</Text>
                    <DeleteOutlined
                      onClick={() => removeFromCart(item.meal.id)}
                      style={{ color: 'red', cursor: 'pointer' }}
                    />
                  </div>
                </div>
              ))
            )}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xl font-bold">Total: {getTotalAmount.toFixed(2)}</p>
            </div>
            <div className="customer-search-container mt-6">
              <Select
                showSearch
                placeholder="Search for a customer"
                style={{ width: '100%' }}
                onSearch={debouncedSearch}
                onChange={(values) => {
                  handleCustomerSelect(values[0], { customer: customers?.find(c => c.id === values[0]) });
                  setSelectedTags(values.slice(1));
                }}
                onSelect={() => setIsCustomerListVisible(false)}
                value={[selectedCustomer?.id, ...selectedTags].filter(Boolean)}
                filterOption={false}
                notFoundContent={null}
                suffixIcon={selectedCustomer ? <CloseCircleOutlined onClick={handleClearCustomer} /> : <SearchOutlined />}
                mode="tags"
              >
                {customers?.map((customer) => (
                  <Select.Option key={customer.id} value={customer.id} customer={customer}>
                    {customer.name}
                  </Select.Option>
                ))}
                {Array.from(new Set(meals?.pages.flatMap(page => page.flatMap(meal => meal.mealTags?.map(tag => tag.name) ?? [])) ?? [])).map(tag => (
                  <Select.Option key={tag} value={tag}>
                    {tag}
                  </Select.Option>
                ))}
              </Select>
            </div>
            {selectedTags.length > 0 && (
              <div className='mt-4'>
                <p className='font-semibold mb-2'>Selected Tags:</p>
                {selectedTags.map(tag => (
                  <Tag key={tag} closable onClose={() => setSelectedTags(selectedTags.filter(t => t !== tag))}>
                    {tag}
                  </Tag>
                ))}
              </div>
            )}
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
