'use client'

import { useState } from 'react'
import {
  Typography,
  Table,
  Input,
  DatePicker,
  Space,
  Modal,
  Button,
} from 'antd'
import type { ReactNode } from 'react'
import {
  SearchOutlined,
  CalendarOutlined,
  UserOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons'
const { Title, Text } = Typography
import { useUserContext } from '@/core/context'
import { useRouter, useParams } from 'next/navigation'
import { useUploadPublic } from '@/core/hooks/upload'
import { useSnackbar } from 'notistack'
import dayjs from 'dayjs'
import { Api } from '@/core/trpc'
import { PageLayout } from '@/designSystem'

export default function OrdersPage() {
  const router = useRouter()
  const { user } = useUserContext()
  const { enqueueSnackbar } = useSnackbar()

  const [searchCustomer, setSearchCustomer] = useState('')
  const [searchDate, setSearchDate] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)

  const { data: orders, isLoading } = Api.order.findMany.useQuery({
    include: { customer: true, orderItems: { include: { meal: true } } },
    where: {
      ...(searchDate && { date: searchDate }),
      ...(searchCustomer && {
        customer: { name: { contains: searchCustomer, mode: 'insensitive' } },
      }),
    },
    orderBy: {
      date: 'desc',
    },
  })

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => {
        try {
          return dayjs(date).isValid() ? dayjs(date).format('YYYY-MM-DD HH:mm:ss') : 'N/A';
        } catch (error) {
          console.error('Error parsing date:', error);
          return 'N/A';
        }
      },
    },
    {
      title: 'Customer',
      dataIndex: ['customer', 'name'],
      key: 'customer',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: string) => `${parseFloat(amount).toFixed(2)}`,
    },
    {
      title: 'Payment Method',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => 'Details',
    },
  ]

  const handleDateSearch = (date: any, dateString: string) => {
    setSearchDate(dateString || null)
  }

  const handleCustomerSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchCustomer(e.target.value)
  }

  return (
    <PageLayout layout="narrow">
      <Title level={2}>Orders</Title>
      <Text>View and manage all orders</Text>

      <Space style={{ marginBottom: 16, marginTop: 16 }}>
        <Input
          placeholder="Search by customer name"
          onChange={handleCustomerSearch}
          style={{ width: 200 }}
          prefix={<UserOutlined />}
        />
        <DatePicker
          onChange={handleDateSearch}
          placeholder="Search by date"
          style={{ width: 200 }}
          prefix={<CalendarOutlined />}
        />
      </Space>

      <Table
        columns={columns}
        dataSource={orders?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())}
        loading={isLoading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
      <Button
        icon={<InfoCircleOutlined />}
        onClick={() => setSelectedOrder(record)}
        title="Details"
      />

      <Modal
        title="Order Details"
        open={!!selectedOrder}
        onCancel={() => setSelectedOrder(null)}
        footer={null}
        width={800}
      >
        {selectedOrder && (
          <div>
            <p>
              <strong>Date:</strong>{' '}
              {(() => {
                try {
                  return dayjs(selectedOrder.date).isValid() ? dayjs(selectedOrder.date).format('YYYY-MM-DD HH:mm:ss') : 'N/A';
                } catch (error) {
                  console.error('Error parsing date:', error);
                  return 'N/A';
                }
              })()}
            </p>
            <p>
              <strong>Customer:</strong> {selectedOrder.customer.name}
            </p>
            <p>
              <strong>Amount:</strong>{' '}
              {parseFloat(selectedOrder.amount).toFixed(2)}
            </p>
            <p>
              <strong>Payment Method:</strong> {selectedOrder.paymentMethod}
            </p>
            <Title level={4}>Items</Title>
            <Table
              dataSource={selectedOrder.orderItems}
              columns={[
                { title: 'Item', dataIndex: ['meal', 'name'], key: 'name' },
                { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
                {
                  title: 'Price',
                  dataIndex: ['meal', 'price'],
                  key: 'price',
                  render: (price: string) => `$${parseFloat(price).toFixed(2)}`,
                },
              ]}
              pagination={false}
              rowKey="id"
            />
          </div>
        )}
      </Modal>
    </PageLayout>
  )
}
