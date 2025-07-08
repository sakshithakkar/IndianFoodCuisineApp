import { SearchBox } from '@fluentui/react/lib/SearchBox';
import { Stack, Text } from '@fluentui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchDishes } from '../services/searchService';

const Header = () => {
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  const onSearch = async (newValue) => {
    if (!newValue) return setSuggestions([]);
    const res = await searchDishes(newValue);
    setSuggestions(res.data);
  };

  return (
    <Stack tokens={{ childrenGap: 10 }} styles={{ root: { padding: 10 } }}>
      <SearchBox
        placeholder="Search dishes, ingredients, state..."
        onChange={(_, newValue) => onSearch(newValue)}
      />
      <Stack>
        {suggestions.map((s) => (
          <Text key={s.name} onClick={() => navigate(`/dish/${s.name}`)} style={{ cursor: 'pointer' }}>
            {s.name}
          </Text>
        ))}
      </Stack>
    </Stack>
  );
};

export default Header;
