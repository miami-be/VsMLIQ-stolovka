'use client'

import { useState } from 'react'
import { Typography, Table, Button, Modal, Form, Input, Space, Select } from 'antd'
import {
  UserAddOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
const { Title, Text } = Typography
import { Prisma, UserStatus } from '@prisma/client'
import { useUserContext } from '@/core/context'
import { useRouter, useParams } from 'next/navigation'
import { useUploadPublic } from '@/core/hooks/upload'
import { useSnackbar } from 'notistack'
import dayjs from 'dayjs'
import { Api } from '@/core/trpc'
import { PageLayout } from '@/designSystem'

export default function UsersPage() {
  const router = useRouter()
  const { user } = useUserContext()
  const { enqueueSnackbar } = useSnackbar()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()

  const { data: users, isLoading, refetch } = Api.user.findMany.useQuery({})
  const { mutateAsync: createUser } = Api.user.create.useMutation()
  const { mutateAsync: deleteUser } = Api.user.delete.useMutation()

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Global Role',
      dataIndex: 'globalRole',
      key: 'globalRole',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => user?.globalRole !== 'USER' && (
        <Button
          icon={<DeleteOutlined />}
          onClick={() => showDeleteConfirm(record)}
          danger
        >
          Delete
        </Button>
      ),
    },
  ]

  const handleCancel = () => {
    setIsModalVisible(false)
    form.resetFields()
  }

  const onFinish = async (values: any) => {
    try {
      await createUser({
        data: {
          name: values.name,
          email: values.email,
          password: values.password,
          globalRole: values.globalRole || 'ADMIN',
        },
      })
      enqueueSnackbar('User created successfully', { variant: 'success' })
      setIsModalVisible(false)
      form.resetFields()
      refetch()
    } catch (error) {
      enqueueSnackbar('Failed to create user', { variant: 'error' })
    }
  }

  const showDeleteConfirm = (record: any) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this user?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await deleteUser({ where: { id: record.id } })
          enqueueSnackbar('User deleted successfully', { variant: 'success' })
          refetch()
        } catch (error) {
          enqueueSnackbar('Failed to delete user', { variant: 'error' })
        }
      },
    })
  }

  return (
    <PageLayout layout="narrow">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={2}>User Management</Title>
        <Text>
          View and manage system users to control access to the application.
        </Text>

        {user?.globalRole !== 'USER' && (
          <Button type="primary" icon={<UserAddOutlined />} onClick={() => setIsModalVisible(true)}>
            Add New User
          </Button>
        )}

        <Table
          columns={columns}
          dataSource={users}
          loading={isLoading}
          rowKey="id"
        />

        <Modal
          title="Add New User"
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <Form form={form} onFinish={onFinish} layout="vertical">
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Please input the name!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please input the email!' },
                { type: 'email', message: 'Please enter a valid email!' },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: 'Please input the password!' },
                { min: 6, message: 'Password must be at least 6 characters long!' },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="globalRole"
              label="Global Role"
              rules={[
                { required: true, message: 'Please select the global role!' },
              ]}
              initialValue="ADMIN"
            >
              <Select options={[
                { value: 'ADMIN', label: 'Admin' },
                { value: 'USER', label: 'User' },
              ]} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Add User
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Space>
    </PageLayout>
  )
}
