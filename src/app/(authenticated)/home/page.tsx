'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { Typography, Input, Button, Row, Col, Card, InputNumber, Select, Tag } from 'antd'
import { ShoppingCartOutlined, SearchOutlined, DeleteOutlined, CloseCircleOutlined } from '@ant-design/icons'
const { Text } = Typography
import { useUserContext } from '@/core/context'
import { useSnackbar } from 'notistack'
import { Api } from '@/core/trpc'
import { PageLayout } from '@/designSystem/layouts/PageLayout'
import { useRouter } from 'next/navigation'
import debounce from 'lodash/debounce'

const TagSelector = ({ tags, selectedTags, setSelectedTags, usedTags }) => {
  const handleTagClick = (tag) => {
    setSelectedTags(prevTags =>
      prevTags.includes(tag)
        ? prevTags.filter(t => t !== tag)
        : [...prevTags, tag]
    )
  }

  const uniqueTags = Array.from(new Set(tags?.filter(tag => usedTags.includes(tag.name)).map(tag => tag.name) || []));

  return (
    <div className="mb-4">
      {uniqueTags.map(tagName => (
        <Tag
          key={tagName}
          onClick={() => handleTagClick(tagName)}
          color={selectedTags.includes(tagName) ? 'blue' : 'default'}
          style={{ cursor: 'pointer', marginBottom: '8px' }}
        >
          {tagName}
        </Tag>
      ))}
    </div>
  )
}

export default function HomePage() {
  const router = useRouter()
  const { user } = useUserContext()
  const { enqueueSnackbar } = useSnackbar()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [cart, setCart] = useState<{ meal: any; quantity: number }[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [paymentType, setPaymentType] = useState<string>('Balance')
  const [isCustomerListVisible, setIsCustomerListVisible] = useState(false)
  const [page, setPage] = useState(1)
  const pageSize = 20

  const { data: meals, fetchNextPage, hasNextPage, isLoading, error } = Api.meal.findMany.useInfiniteQuery(
    {
      where: { isActive: true },
      include: { mealTags: { where: { name: { in: ['Завтрак', 'Основное', 'Гарнир', 'Напитки', 'Хлеб'] } } } },
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
    const usedTags = [];
    allMeals.forEach(meal => {
      if (selectedTags.length === 0 || meal.mealTags?.some(tag => selectedTags.includes(tag.name))) {
        meal.mealTags?.forEach(tag => {
          if (!groups[tag.name]) {
            groups[tag.name] = [];
          }
          groups[tag.name].push(meal);
          if (!usedTags.includes(tag.name)) {
            usedTags.push(tag.name);
          }
        });
      }
    });
    return { groups, usedTags };
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
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
    if (hasNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, fetchNextPage])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const handleCustomerSelect = (value: string, option: any) => {
    setSelectedCustomer(option.customer)
  }

  const handleClearCustomer = () => {
    setSelectedCustomer(null)
  }

  return (
    <PageLayout layout="full-width">
      <Row gutter={[16, 16]} className="bg-gray-100 px-4 py-8">
        <Col xs={24} lg={18}>
          <TagSelector tags={tags} selectedTags={selectedTags} setSelectedTags={setSelectedTags} usedTags={groupedMeals.usedTags} />
          {isLoading ? (
            <div>Loading meals...</div>
          ) : error ? (
            <div>Error loading meals: {error.message}</div>
          ) : (
            Object.entries(groupedMeals.groups).map(([category, meals]) => (
              <div key={category}>
                <h2 className="text-xl font-bold mb-4">{category}</h2>
                <Row gutter={[16, 16]}>
                  {meals.map(meal => (
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
                              <ShoppingCartOutlined style={{ fontSize: '1.2rem', color: '#4CAF50' }} />
                            </div>
                          }
                        />
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            ))
          )}
        </Col>
        <Col xs={24} lg={6}>
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
                onChange={handleCustomerSelect}
                onSelect={() => setIsCustomerListVisible(false)}
                value={selectedCustomer?.name || undefined}
                filterOption={false}
                notFoundContent={null}
                suffixIcon={selectedCustomer ? <CloseCircleOutlined onClick={handleClearCustomer} /> : <SearchOutlined />}
              >
                {customers?.map((customer) => (
                  <Select.Option key={customer.id} value={customer.id} customer={customer}>
                    {customer.name}
                  </Select.Option>
                ))}
              </Select>
            </div>
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
