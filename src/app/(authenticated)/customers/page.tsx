'use client'

import { useState } from 'react'
import {
  Typography,
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Space,
} from 'antd'
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  DollarOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import { Prisma } from '@prisma/client'
const { Title, Text } = Typography
import { useUserContext } from '@/core/context'
import { useRouter, useParams } from 'next/navigation'
import { useUploadPublic } from '@/core/hooks/upload'
import { useSnackbar } from 'notistack'
import dayjs from 'dayjs'
import { Api } from '@/core/trpc'
import { PageLayout } from '@/designSystem'

export default function CustomersPage() {
  const router = useRouter()
  const { user } = useUserContext()
  const { enqueueSnackbar } = useSnackbar()

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'topup'>('add')
  const [selectedCustomer, setSelectedCustomer] =
    useState<Prisma.CustomerGetPayload<{}> | null>(null)
  const [form] = Form.useForm()
  const [searchTerm, setSearchTerm] = useState('')

  const {
    data: customers,
    isLoading,
    refetch,
  } = Api.customer.findMany.useQuery({
    where: { name: { contains: searchTerm, mode: 'insensitive' } }
  })
  const { mutateAsync: createCustomer } = Api.customer.create.useMutation()
  const { mutateAsync: updateCustomer } = Api.customer.update.useMutation()
  const { mutateAsync: deleteCustomer } = Api.customer.delete.useMutation()

  const handleAddCustomer = () => {
    setModalMode('add')
    setSelectedCustomer(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEditCustomer = (customer: Prisma.CustomerGetPayload<{}>) => {
    setModalMode('edit')
    setSelectedCustomer(customer)
    form.setFieldsValue(customer)
    setIsModalVisible(true)
  }

  const handleTopUpBalance = (customer: Prisma.CustomerGetPayload<{}>) => {
    setModalMode('topup')
    setSelectedCustomer(customer)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleDeleteCustomer = async (id: string) => {
    try {
      await deleteCustomer({ where: { id } })
      enqueueSnackbar('Customer deleted successfully', { variant: 'success' })
      refetch()
    } catch (error) {
      enqueueSnackbar('Failed to delete customer', { variant: 'error' })
    }
  }

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()
      if (modalMode === 'add') {
        await createCustomer({ data: values })
        enqueueSnackbar('Customer added successfully', { variant: 'success' })
      } else if (modalMode === 'edit') {
        await updateCustomer({
          where: { id: selectedCustomer!.id },
          data: values,
        })
        enqueueSnackbar('Customer updated successfully', { variant: 'success' })
      } else if (modalMode === 'topup') {
        const newBalance = 
          Number(selectedCustomer!.balance || '0') +
          Number(values.topup)
        await updateCustomer({
          where: { id: selectedCustomer!.id },
          data: { balance: newBalance },
        })
        enqueueSnackbar('Balance topped up successfully', {
          variant: 'success',
        })
      }
      setIsModalVisible(false)
      refetch()
    } catch (error) {
      enqueueSnackbar('Failed to save customer', { variant: 'error' })
    }
  }

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Parent Contact',
      dataIndex: 'parentContact',
      key: 'parentContact',
    },
    { title: 'Class', dataIndex: 'class', key: 'class' },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      render: (balance: string) => Number(balance || '0').toFixed(2),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Prisma.CustomerGetPayload<{}>) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditCustomer(record)}
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteCustomer(record.id)}
            danger
          />
          <Button
            icon={<DollarOutlined />}
            onClick={() => handleTopUpBalance(record)}
          />
        </Space>
      ),
    },
  ]

  return (
    <PageLayout layout="narrow">
      <Title level={2}>Customer Management</Title>
      <Text>
        View, add, edit, and manage customer information and balances.
      </Text>

      <Space style={{ width: '100%', marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddCustomer}
        >
          Add Customer
        </Button>
        <Input
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 200 }}
          prefix={<SearchOutlined />}
        />
      </Space>

      <Table
        dataSource={customers}
        columns={columns}
        rowKey="id"
        loading={isLoading}
      />

      <Modal
        title={
          modalMode === 'add'
            ? 'Add Customer'
            : modalMode === 'edit'
              ? 'Edit Customer'
              : 'Top Up Balance'
        }
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          {modalMode !== 'topup' && (
            <>
              <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="parentContact" label="Parent Contact">
                <Input />
              </Form.Item>
              <Form.Item name="class" label="Class">
                <Input />
              </Form.Item>
            </>
          )}
          {modalMode === 'topup' && (
            <Form.Item
              name="topup"
              label="Top Up Amount"
              rules={[{ required: true }]}
            >
              <InputNumber
                min={0}
                step={0.01}
                precision={2}
                style={{ width: '100%' }}
              />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </PageLayout>
  )
}
