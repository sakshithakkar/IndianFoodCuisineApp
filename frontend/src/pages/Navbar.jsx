import { Stack, Link } from '@fluentui/react';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const navigate = useNavigate();

  return (
    <Stack
      horizontal
      horizontalAlign="start"
      tokens={{ childrenGap: 20, padding: 10 }}
      styles={{ root: { backgroundColor: '#f3f2f1', padding: '10px 20px' } }}
    >
      <Link onClick={() => navigate('/')} styles={{ root: { fontWeight: 600 } }}>
        Home
      </Link>
      <Link onClick={() => navigate('/suggester')} styles={{ root: { fontWeight: 600 } }}>
        Dish Suggester
      </Link>
    </Stack>
  );
};

export default NavBar;
