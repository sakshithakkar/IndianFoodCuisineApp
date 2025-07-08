import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Stack, Text, DefaultButton, Breadcrumb } from '@fluentui/react';
import { getDishById } from '../services/dishService';

const DishPage = () => {
  const { id } = useParams();
  const [dish, setDish] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getDishById(id).then((res) => {
      console.log(res.data.data[0])
      setDish(res.data.data[0])
    });
  }, [id]);



  if (!dish) return <Text>Loading...</Text>;

  const breadcrumbItems = [
    { text: 'Home', key: 'home', onClick: () => navigate('/') },
    // { text: 'Dishes', key: 'dishes', onClick: () => navigate('/') },
    { text: 'Dishes /'.concat(dish.name), key: 'dishName', isCurrentItem: true },
  ];

  return (
    <Stack tokens={{ childrenGap: 8 }} style={{ padding: 20 }}>
      <Breadcrumb items={breadcrumbItems} />
      <Text variant="xxLarge">{dish.name}</Text>
      <Text><strong>Ingredients:</strong> {dish.ingredients}</Text>
      <Text><strong>Diet:</strong> {dish.diet}</Text>
      <Text><strong>Preparation Time:</strong> {dish.prep_time}</Text>
      <Text><strong>Cooking Time:</strong> {dish.cook_time}</Text>
      <Text><strong>Flavor:</strong> {dish.flavor}</Text>
      <Text><strong>Course:</strong> {dish.course}</Text>
      <Text><strong>State:</strong> {dish.state}</Text>
      <Text><strong>Region:</strong> {dish.region}</Text>
      <DefaultButton text="← Back to List" onClick={() => navigate(-1)} />

    </Stack>
  );
};

export default DishPage;
