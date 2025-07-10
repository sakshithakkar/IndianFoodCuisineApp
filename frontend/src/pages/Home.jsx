import Header from '../pages/Header';
import DishList from '../pages/DishList';
import DishSuggester from '../pages/DishSuggester';
import { Stack, DefaultButton, MessageBar } from '@fluentui/react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Home = () => {
  const navigate = useNavigate();
  // const [showMessage, setShowMessage] = useState(false);

  // const handleAddDish = () => {
  //   const token = localStorage.getItem('authToken');
  //   if (token) {
  //     navigate('/add-dish');
  //   } else {
  //     setShowMessage(true);
  //     setTimeout(() => navigate('/login'), 1500);
  //   }
  // };


  return (

    <Stack tokens={{ childrenGap: 30 }} style={{ padding: 20 }}>
      {/* <DefaultButton text="➕ Add Dish" onClick={handleAddDish} />
      {showMessage && (
        <MessageBar messageBarType={2} onDismiss={() => setShowMessage(false)}>
          Please login to add a dish.
        </MessageBar>
      )} */}
      <DishList />
    </Stack>
  )
};

export default Home;
