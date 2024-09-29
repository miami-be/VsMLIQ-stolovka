import React from 'react';
import { Card, Typography } from 'antd';

const { Title, Text } = Typography;

interface TagGroupProps {
  tag: string;
  meals: {
    id: string;
    name: string;
    price: string;
    mealTags: { name: string }[];
    imageUrl?: string;
  }[];
  addToCart: (meal: any) => void;
  smallFontSize?: boolean;
  spacing?: 'small' | 'default';
}

export const TagGroup: React.FC<TagGroupProps> = ({ tag, meals, addToCart, smallFontSize = false, spacing = 'default' }) => {
  const titleStyle = smallFontSize ? { fontSize: '18px' } : {};
  const textStyle = smallFontSize ? { fontSize: '12px' } : {};

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center">
        <Title level={3} className={spacing === 'small' ? 'mb-2' : 'mb-4'} style={titleStyle}>{tag}</Title>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-1">
        {meals.map((meal) => (
          <Card
            key={meal.id}
            hoverable
            size="small"
            cover={<img alt={meal.name} src={meal.imageUrl || '/default-meal-image.jpg'} className="h-16 object-cover" />}
            onClick={() => addToCart(meal)}
          >
            <Card.Meta
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', ...textStyle }}>
                  <Text style={{ flex: 1, marginRight: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{meal.name}</Text>
                  <Text strong style={{ whiteSpace: 'nowrap' }}>{Math.round(parseFloat(meal.price)).toString()}</Text>
                </div>
              }
            />
          </Card>
        ))}
      </div>
    </div>
  );
};
