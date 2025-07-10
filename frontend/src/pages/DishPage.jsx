import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Stack,
  Text,
  DefaultButton,
  Breadcrumb,
  Icon
} from '@fluentui/react';
import { getDishById } from '../services/dishService';

const InfoRow = ({ icon, label, value }) => (
  <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
    <Icon iconName={icon} />
    <Text variant="mediumPlus" styles={{ root: { fontWeight: 600 } }}>
      {label}:
    </Text>
    <Text>{value}</Text>
  </Stack>
);

const DishPage = () => {
  const { id } = useParams();
  const [dish, setDish] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getDishById(id).then((res) => {
      setDish(res.data.data[0]);
    });
  }, [id]);

  if (!dish) return <Text>Loading...</Text>;

  const breadcrumbItems = [
    { text: 'Home', key: 'home', onClick: () => navigate('/') },
    {
      text: `Dishes / ${dish.name}`,
      key: 'dishName',
      isCurrentItem: true,
    },
  ];

  return (
    <Stack
      tokens={{ childrenGap: 16 }}
      styles={{
        root: {
          padding: 24,
          maxWidth: 800,
          margin: 'auto',
          backgroundColor: '#ffffff',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      }}
    >
      <Breadcrumb items={breadcrumbItems} />

      {/* <Text variant="xxLarge" styles={{ root: { fontWeight: 600 } }}>
        {dish.name}
      </Text> */}

      <Stack
        horizontal
        verticalAlign="center"
        tokens={{ childrenGap: 10 }}
        styles={{
          root: {
            padding: '12px 0',
            borderBottom: '2px solid #e0e0e0',
            marginBottom: 12,
          },
        }}
      >
        <Icon iconName="FavoriteStar" styles={{ root: { fontSize: 24, color: '#ffaa44' } }} />
        <Text
          variant="superLarge"
          styles={{
            root: {
              fontWeight: 700,
              color: '#323130',
              textTransform: 'capitalize',
              letterSpacing: '0.5px',
            },
          }}
        >
          {dish.name}
        </Text>
      </Stack>


      <Stack tokens={{ childrenGap: 12 }} styles={{ root: { marginTop: 16 } }}>
        <InfoRow icon="ShoppingCart" label="Ingredients" value={dish.ingredients} />
        {/* <InfoRow icon="Heart" label="Diet" value={dish.diet} /> */}

        <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
          <Icon iconName="Heart" />
          <Text variant="mediumPlus" styles={{ root: { fontWeight: 600 } }}>
            Diet:
          </Text>
          <Text
            styles={{
              root: {
                color: dish.diet?.toLowerCase() == 'vegetarian' ? 'green' : 'crimson',
                fontWeight: 500,
              },
            }}
          >
            {dish.diet}
          </Text>
        </Stack>

        <InfoRow icon="Timer" label="Prep Time" value={`${dish.prep_time} mins`} />
        <InfoRow icon="SetAction" label="Cook Time" value={`${dish.cook_time} mins`} />
        <InfoRow icon="ExploreContent" label="Flavor" value={dish.flavor_profile} />
        <InfoRow icon="GroupedList" label="Course" value={dish.course} />
        <InfoRow icon="MapPin" label="State" value={dish.state} />
        <InfoRow icon="Globe" label="Region" value={dish.region} />
      </Stack>

      <DefaultButton
        text="Back"
        iconProps={{ iconName: 'ChevronLeft' }}
        onClick={() => navigate(-1)}
        styles={{
          root: {
            marginTop: 20,
            padding: '8px 20px',
            borderRadius: 6,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            backgroundColor: '#f3f2f1',
            width: '30%'
          },
          icon: {
            fontSize: 14,
            color: '#605e5c',
          },
          rootHovered: {
            backgroundColor: '#e1dfdd',
          },
        }}
      />



    </Stack>
  );
};

export default DishPage;
