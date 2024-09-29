import React from 'react';
import { Card, Typography } from 'antd';

const { Title } = Typography;

interface TagGroupProps {
  tag: string;
  meals: {
    id: string;
    name: string;
    price: string;
    photoUrl?: string;
  }[];
  addToCart: (meal: any) => void;
}

export const TagGroup: React.FC<TagGroupProps> = ({ tag, meals, addToCart }) => {
  return (
    <div className="mb-8">
      <Title level={3} className="mb-4">{tag}</Title>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
        {meals.map((meal) => (
          <Card
            key={meal.id}
            hoverable
            size="small"
            cover={<img alt={meal.name} src={meal.photoUrl || '/default-meal-image.jpg'} className="h-24 object-cover" />}
            onClick={() => addToCart(meal)}
          >
            <Card.Meta
              title={meal.name}
              description={`$${parseFloat(meal.price).toFixed(2)}`}
            />
          </Card>
        ))}
      </div>
    </div>
  );
};
