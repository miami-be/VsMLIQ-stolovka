import React from 'react';
import { Card, Typography } from 'antd';

const { Title, Text } = Typography;

interface TagGroupProps {
  tag: string;
  meals: {
    id: string;
    name: string;
    price: string;
    photoUrl?: string;
  }[];
  addToCart: (meal: any) => void;
  smallFontSize?: boolean;
}

export const TagGroup: React.FC<TagGroupProps> = ({ tag, meals, addToCart, smallFontSize = false }) => {
  const titleStyle = smallFontSize ? { fontSize: '18px' } : {};
  const textStyle = smallFontSize ? { fontSize: '12px' } : {};

  return (
    <div className="mb-8">
      <Title level={3} className="mb-4" style={titleStyle}>{tag}</Title>
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-1">
        {meals.map((meal) => (
          <Card
            key={meal.id}
            hoverable
            size="small"
            cover={<img alt={meal.name} src={meal.photoUrl || '/default-meal-image.jpg'} className="h-16 object-cover" />}
            onClick={() => addToCart(meal)}
          >
            <Card.Meta
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', ...textStyle }}>
                  <Text>{meal.name}</Text>
                  <Text>{Math.round(parseFloat(meal.price))}</Text>
                </div>
              }
            />
          </Card>
        ))}
      </div>
    </div>
  );
};
