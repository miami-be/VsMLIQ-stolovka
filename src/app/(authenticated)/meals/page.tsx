'use client'

import { useState, useEffect } from 'react'
import { Prisma, MealTag } from '@prisma/client'
import {
  Typography,
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Upload,
  Tag,
  Switch,
  Select,
  Space,
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  CloseCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons'
const { Title, Text } = Typography
import { useUserContext } from '@/core/context'
import { useRouter, useParams } from 'next/navigation'
import { useUploadPublic } from '@/core/hooks/upload'
import { useSnackbar } from 'notistack'
import dayjs from 'dayjs'
import { Api } from '@/core/trpc'
import { PageLayout } from '@/designSystem'

export default function MealsPage() {
  const router = useRouter()
  const { user } = useUserContext()
  const { enqueueSnackbar } = useSnackbar()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingMeal, setEditingMeal] = useState<Prisma.MealGetPayload<{
    include: { mealTags: true }
  }> | null>(null)
  const [form] = Form.useForm()
  const [searchTerm, setSearchTerm] = useState('')

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const {
    data: meals,
    isLoading,
    refetch,
  } = Api.meal.findMany.useQuery(
    {
      where: { isActive: true, name: { contains: searchTerm, mode: 'insensitive' } },
      include: { mealTags: true },
      take: pageSize,
      skip: (currentPage - 1) * pageSize,
    }
  )
  const { mutateAsync: createMeal } = Api.meal.create.useMutation()
  const { mutateAsync: updateMeal } = Api.meal.update.useMutation()
  const { mutateAsync: deleteMeal } = Api.meal.delete.useMutation()
  const { mutateAsync: upload } = useUploadPublic()

  const handleAddOrEdit = async (values: any) => {
    try {
      const uniqueTags = [...new Set(values.tags)];
      const mealData: Prisma.MealCreateInput | Prisma.MealUpdateInput = {
        name: values.name,
        price: values.price.toString(),
        photoUrl: typeof values.photoUrl === 'string' ? values.photoUrl : undefined,
        isActive: values.isActive ?? true,
        mealTags: {
          connectOrCreate: uniqueTags.map((tag: string) => ({
            where: { name: tag },
            create: { name: tag },
          })) as Prisma.MealTagCreateOrConnectWithoutMealInput[]
        },
      }

      if (editingMeal) {
        await updateMeal({
          where: { id: editingMeal.id },
          data: {
            ...mealData,
            mealTags: {
              ...mealData.mealTags,
              disconnect: editingMeal.mealTags
                .filter(tag => !uniqueTags.includes(tag.name))
                .map(tag => ({ name: tag.name })) as Prisma.MealTagWhereUniqueInput[]
            },
          },
        })
        enqueueSnackbar('Meal updated successfully', { variant: 'success' })
      } else {
        await createMeal({
          data: mealData as Prisma.MealCreateInput,
        })
        enqueueSnackbar('Meal added successfully', { variant: 'success' })
      }
      setIsModalVisible(false)
      form.resetFields()
      refetch()
    } catch (error) {
      console.error('Error saving meal:', error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        const errorMessage = error.message.split('\n').pop() || error.message;
        enqueueSnackbar(`Prisma Error: ${errorMessage}`, { variant: 'error' });
      } else if (error.cause?.code === 'BAD_REQUEST' && error.cause?.zodError) {
        const zodErrors = error.cause.zodError.fieldErrors;
        Object.entries(zodErrors).forEach(([field, errors]) => {
          enqueueSnackbar(`${field}: ${errors[0]}`, { variant: 'error' });
        });
      } else {
        enqueueSnackbar(`Error saving meal: ${error.message}`, { variant: 'error' })
      }
    }
  }

  const handleRemoveTag = (removedTag: string) => {
    const tags = form.getFieldValue('tags');
    form.setFieldsValue({
      tags: tags.filter((tag: string) => tag !== removedTag),
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMeal({ where: { id } })
      enqueueSnackbar('Meal deleted successfully', { variant: 'success' })
      refetch()
    } catch (error) {
      enqueueSnackbar('Error deleting meal', { variant: 'error' })
    }
  }

  const handleUpload = async (options: any) => {
    const { file } = options
    try {
      const { url } = await upload({ file })
      form.setFieldsValue({ photoUrl: url })
      enqueueSnackbar('Photo uploaded successfully', { variant: 'success' })
    } catch (error) {
      enqueueSnackbar('Error uploading photo', { variant: 'error' })
    }
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: string) => `$${price}`,
    },
    {
      title: 'Tags',
      dataIndex: 'mealTags',
      key: 'mealTags',
      render: (tags: any[] | undefined) => (
        <>
          {Array.from(new Set(tags?.map(tag => tag.name) || [])).map(tag => (
            <Tag color="blue" key={tag}>
              {tag}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean, record: Prisma.MealGetPayload<{ include: { mealTags: true } }>) => (
        <Switch
          checked={isActive}
          onChange={(checked) => handleStatusChange(record.id, checked)}
        />
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'dateCreated',
      key: 'dateCreated',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (
        text: string,
        record: Prisma.MealGetPayload<{ include: { mealTags: true } }>,
      ) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingMeal(record)
              form.setFieldsValue({
                ...record,
                tags: record.mealTags?.map(tag => tag.name),
              })
              setIsModalVisible(true)
            }}
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            danger
          />
        </Space>
      ),
    },
  ]

  const handleStatusChange = async (id: string, isActive: boolean) => {
    try {
      await updateMeal({
        where: { id },
        data: { isActive },
      })
      enqueueSnackbar('Meal status updated successfully', { variant: 'success' })
      refetch()
    } catch (error) {
      console.error('Error updating meal status:', error)
      enqueueSnackbar('Error updating meal status', { variant: 'error' })
    }
  }

  useEffect(() => {
    setCurrentPage(1)
    refetch()
  }, [searchTerm, refetch])

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    refetch();
  };

  return (
    <PageLayout layout="narrow">
      <Title level={2}>Meal Catalogue Management</Title>
      <Text>View, add, edit, and remove meals from the catalogue.</Text>

      <Space style={{ marginBottom: 16, marginTop: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingMeal(null)
            form.resetFields()
            setIsModalVisible(true)
          }}
        >
          Add New Meal
        </Button>
        <Input
          placeholder="Search meals by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 200 }}
          prefix={<SearchOutlined />}
        />
      </Space>

      <Table
        dataSource={meals ?? []}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: meals?.length ?? 0,
          onChange: (page) => setCurrentPage(page),
        }}
      />

      <Modal
        title={editingMeal ? 'Edit Meal' : 'Add New Meal'}
        open={isModalVisible}
        onOk={form.submit}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form 
          form={form} 
          onFinish={handleAddOrEdit} 
          layout="vertical"
        >
          <Form.Item 
            name="name" 
            label="Name" 
            rules={[
              { required: true, message: 'Please input the meal name!' },
              { max: 100, message: 'Name cannot be longer than 100 characters' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item 
            name="price" 
            label="Price" 
            rules={[
              { required: true, message: 'Please input the meal price!' },
              { validator: (_, value) => value && value > 0 ? Promise.resolve() : Promise.reject('Price must be a positive number') }
            ]}
          >
            <InputNumber min={0} step={0.01} style={{ width: '100%' }} stringMode />
          </Form.Item>
          <Form.Item name="tags" label="Tags">
            <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder="Add tags"
              filterOption={(input, option) =>
                (option?.label?.toString().toLowerCase() ?? '').includes(input.toLowerCase())
              }
              // Safely access 'meals' data to prevent TypeError when 'meals' is undefined
              // Safely handle 'meals' data to prevent TypeError when 'meals' is undefined
              options={Array.from(new Set(meals?.flatMap(meal => meal.mealTags?.map(tag => tag.name) ?? []) ?? [])).map(tag => ({
                value: tag,
                label: tag,
              }))}
              onDeselect={handleRemoveTag}
              tagRender={(props) => {
                const { label, closable, onClose } = props;
                return (
                  <Tag
                    color="blue"
                    closable={closable}
                    onClose={onClose}
                    style={{ marginRight: 3 }}
                  >
                    {label}
                    <CloseCircleOutlined
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemoveTag(label as string);
                      }}
                      style={{ marginLeft: 5 }}
                    />
                  </Tag>
                );
              }}
            />
          </Form.Item>
          <Form.Item name="photoUrl" label="Photo">
            <Upload customRequest={handleUpload} showUploadList={false}>
              <Button icon={<UploadOutlined />}>Upload Photo</Button>
            </Upload>
          </Form.Item>
          <Form.Item name="isActive" label="Status" valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </PageLayout>
  )
}
