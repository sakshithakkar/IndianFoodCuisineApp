import Header from '../pages/Header';
import DishList from '../pages/DishList';
import DishSuggester from '../pages/DishSuggester';
import { Stack } from '@fluentui/react';

const Home = () => (
  <Stack tokens={{ childrenGap: 30 }} style={{ padding: 20 }}>
    {/* <Header /> */}
    {/* <DishSuggester /> */}
    <DishList />
  </Stack>
);

export default Home;
