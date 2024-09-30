'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { Typography, Input, Button, Row, Col, Card, InputNumber, Select } from 'antd'
import { ShoppingCartOutlined, SearchOutlined, DeleteOutlined, CloseCircleOutlined } from '@ant-design/icons'
const { Text } = Typography
import { useUserContext } from '@/core/context'
import { useSnackbar } from 'notistack'
import { Api } from '@/core/trpc'
import { PageLayout } from '@/designSystem/layouts/PageLayout'
import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'
import { TagGroup } from '@/designSystem/ui/TagGroup'
import dayjs from 'dayjs'
import { ZodError } from 'zod'

const MEAL_GROUP_ORDER = ['Завтрак', 'Основное', 'Гарнир', 'Напитки', 'Хлеб']

export default function HomePage() {
  const { user } = useUserContext()
  const { enqueueSnackbar } = useSnackbar()

  const [searchTerm, setSearchTerm] = useState('')
  const [cart, setCart] = useState<{ meal: { id: string; name: string; price: string; mealTags: { name: string }[]; imageUrl?: string }; quantity: number }[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<{ id: string; name: string; parentContact: string; class: string; balance: number; dateCreated: Date; dateUpdated: Date; } | null>(null)
  const [customerBalance, setCustomerBalance] = useState<number>(0)
  const [paymentType, setPaymentType] = useState<string>('Balance')
  const [isCustomerListVisible, setIsCustomerListVisible] = useState(false)
  const [filteredMeals, setFilteredMeals] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const pageSize = 20

  const { data: meals, fetchNextPage, hasNextPage, isLoading, error } = Api.meal.findMany.useInfiniteQuery(
    {
      where: { isActive: true },
      take: pageSize,
      include: { mealTags: true },
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.length < pageSize) {
          return undefined;
        }
        return { skip: allPages.length * pageSize };
      },
    }
  )
  useEffect(() => {
    if (error) {
      const errorMessage = error.message || 'An unexpected error occurred';
      enqueueSnackbar(`Error loading meals: ${errorMessage}`, { variant: 'error' });
    }
  }, [error, enqueueSnackbar]);

  const { data: customers, refetch: refetchCustomers, error: customerError } =
    Api.customer.findMany.useQuery({
      where: { name: { contains: searchTerm, mode: 'insensitive' } },
    })

  useEffect(() => {
    if (customerError) {
      const errorMessage = customerError.message || 'An unexpected error occurred';
      enqueueSnackbar(`Error fetching customers: ${errorMessage}`, { variant: 'error' });
    }
  }, [customerError, enqueueSnackbar]);

  const { mutateAsync: createOrder } = Api.order.create.useMutation()
  const { mutateAsync: updateCustomer } = Api.customer.update.useMutation()

  const groupedMeals = useMemo(() => {
    if (!meals?.pages) return [];
    const allMeals = meals.pages.flatMap(page => page) || [];
    const groupedByTag = allMeals.reduce((acc: Record<string, Array<{ id: string; name: string; price: string; mealTags: Array<{ name: string }>; imageUrl: string }>>, meal: { id: string; name: string; price: string; mealTags: Array<{ name: string }>; imageUrl: string }) => {
      const uniqueTags = Array.from(new Set(meal.mealTags.map((tag: { name: string }) => tag.name)));
      uniqueTags.forEach(tag => {
        if (!acc[tag]) {
          acc[tag] = [];
        }
        acc[tag].push({
          ...meal,
          imageUrl: meal.imageUrl || '/default-meal-image.jpg'
        });
      });
      return acc;
    }, {});

    return Object.entries(groupedByTag).sort(([a], [b]) => {
      const indexA = MEAL_GROUP_ORDER.indexOf(a);
      const indexB = MEAL_GROUP_ORDER.indexOf(b);
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [meals])

  useEffect(() => {
    setFilteredMeals(groupedMeals);
  }, [groupedMeals]);

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
  const addToCart = useCallback((meal: { id: string; name: string; price: string; mealTags: { name: string }[]; imageUrl?: string }) => {
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
    return Math.round(cart.reduce(
      (total, item) =>
        total + parseFloat(item.meal.price || '0') * item.quantity,
      0,
    ))
  }, [cart])

  const handleOrder = async () => {
    if (!selectedCustomer) {
      enqueueSnackbar('Please select a customer', { variant: 'error' });
      return;
    }
    if (cart.length === 0) {
      enqueueSnackbar('Cart is empty', { variant: 'error' });
      return;
    }
    if (!paymentType) {
      enqueueSnackbar('Please select a payment method', { variant: 'error' });
      return;
    }

    try {
      const currentDate = dayjs().format();
      if (paymentType === 'Balance') {
        const newBalance = customerBalance - getTotalAmount;
        await updateCustomer({
          where: { id: selectedCustomer.id },
          data: { balance: newBalance },
        });
        if (newBalance < 0) {
          enqueueSnackbar('Warning: Customer balance is now negative', { variant: 'warning' });
        }
      }
      await createOrder({
        data: {
          customer: { connect: { id: selectedCustomer.id } },
          amount: getTotalAmount.toString(),
          paymentMethod: paymentType,
          date: currentDate,
          orderItems: {
            create: cart.map(item => ({
              meal: { connect: { id: item.meal.id } },
              quantity: item.quantity,
            })),
          },
        },
      })
      enqueueSnackbar('Order created successfully', { variant: 'success' })
      setCart([])
      setSelectedCustomer(null)
      setCustomerBalance(0)
      setPaymentType('Balance')
      setIsCustomerListVisible(false)
    } catch (error) {
      console.error('Order creation error:', error);
      let errorMessage = 'An unexpected error occurred';
      if (error.cause instanceof ZodError) {
        errorMessage = error.cause.issues.map(issue => issue.message).join(', ');
      } else {
        errorMessage = error.message || errorMessage;
      }
      enqueueSnackbar(`Failed to create order: ${errorMessage}`, { variant: 'error' });
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

  const handleCustomerSelect = (value: string, option: { value: string; label: string; customer: { id: string; name: string; parentContact: string; class: string; balance: number; dateCreated: Date; dateUpdated: Date; } }) => {
    setSelectedCustomer(option.customer)
    setCustomerBalance(option.customer.balance || 0)
  }

  const handleClearCustomer = () => {
    setSelectedCustomer(null)
    setCustomerBalance(0)
  }

  return (
    <PageLayout layout="full-width">
      <Row gutter={[16, 16]} className="bg-gray-100 px-1 pb-2">
        <Col xs={24} lg={18}>
          {isLoading ? (
            <div>Loading meals...</div>
          ) : error ? (
            <div>Error loading meals: {error.message}</div>
          ) : (
            groupedMeals.map(([tag, meals]) => {
              if (!Array.isArray(meals)) {
                console.error(`Expected meals to be an array for tag ${tag}, but got:`, meals);
                return null;
              }
              return (
                <TagGroup 
                  key={tag} 
                  tag={tag} 
                  meals={meals.map(meal => ({
                    id: meal.id,
                    name: meal.name,
                    price: meal.price,
                    mealTags: meal.mealTags,
                    imageUrl: meal.imageUrl
                  }))} 
                  addToCart={addToCart}
                />
              );
            })
          )}
          {hasNextPage && (
            <Button onClick={() => fetchNextPage()} loading={isLoading}>
              Load More
            </Button>
          )}
        </Col>
        <Col xs={24} lg={6}>
          <Card className="sticky top-4 px-4" style={{ width: '100%' }}>
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
                    <Text style={{ marginRight: '8px' }}>{Math.round(parseFloat(item.meal?.price || '0') * item.quantity).toString()}</Text>
                    <DeleteOutlined
                      onClick={() => removeFromCart(item.meal.id)}
                      style={{ color: 'red', cursor: 'pointer' }}
                    />
                  </div>
                </div>
              ))
            )}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xl font-bold">Total: {getTotalAmount.toString()}</p>
            </div>
            <div className="customer-search-container mt-6">
              <Select
                showSearch
                placeholder="Search for a customer"
                style={{ width: '100%' }}
                onSearch={debouncedSearch}
                onChange={(value, option) => handleCustomerSelect(value, option as { value: string; label: string; customer: { id: string; name: string; parentContact: string; class: string; balance: number; dateCreated: Date; dateUpdated: Date; } })}
                onSelect={() => setIsCustomerListVisible(false)}
                value={selectedCustomer?.id}
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
              {selectedCustomer && (
                <div className="mt-2">
                  <Text>Current Balance: {customerBalance.toFixed(2)}</Text>
                  {customerBalance < 0 && (
                    <Text type="danger"> (Negative Balance)</Text>
                  )}
                </div>
              )}
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
