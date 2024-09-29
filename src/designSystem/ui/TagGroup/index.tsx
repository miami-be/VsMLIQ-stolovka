import React from 'react';
import { Card, Typography } from 'antd';

const { Title } = Typography;

interface TagGroupProps {
  tag: string;
  meals: any[];
  addToCart: (meal: any) => void;
}

export const TagGroup: React.FC<TagGroupProps> = ({ tag, meals, addToCart }) => {
  return (
    <div className="mb-8">
      <Title level={3} className="mb-4">{tag}</Title>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {meals.map((meal) => (
          <Card
            key={meal.id}
            hoverable
            size="small"
            cover={<img alt={meal.name} src={meal.imageUrl} className="h-36 object-cover" />}
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
