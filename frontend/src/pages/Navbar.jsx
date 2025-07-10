import { Stack, Link, DefaultButton, Text } from '@fluentui/react';
import { Home24Regular, BowlChopsticks24Regular } from '@fluentui/react-icons';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './Header';

const NavBar = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem('userName');
    if (name) setUserName(name);
    setLoggedIn(!!localStorage.getItem('authToken'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    setLoggedIn(false);
    setUserName('');
    navigate('/login');
  };

  return (
    <Stack
      horizontal
      horizontalAlign="space-between"
      verticalAlign="center"
      wrap
      tokens={{ childrenGap: 16 }}
      styles={{
        root: {
          backgroundColor: '#004578',
          padding: '12px 32px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          flexWrap: 'wrap',
        },
      }}
    >
      {/* Left: Navigation Links with Icons */}
      <Stack horizontal tokens={{ childrenGap: 24 }} verticalAlign="center">
        <Link
          onClick={() => navigate('/')}
          styles={{
            root: {
              fontWeight: 600,
              fontSize: 24,
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              textDecoration: 'none',
              selectors: {
                ':hover': { textDecoration: 'underline', color: '#c7e0f4' },
              },
            },
          }}
        >
          <Home24Regular /> Home
        </Link>

        <Link
          onClick={() => navigate('/suggester')}
          styles={{
            root: {
              fontWeight: 600,
              fontSize: 24,
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              textDecoration: 'none',
              selectors: {
                ':hover': { textDecoration: 'underline', color: '#c7e0f4' },
              },
            },
          }}
        >
          <BowlChopsticks24Regular /> Dish Suggester
        </Link>
      </Stack>

      {/* Center: Search Header */}
      <Stack.Item grow>
        <div style={{ maxWidth: 400, margin: '0 auto' }}>
          <Header />
        </div>
      </Stack.Item>

      {/* Right: Welcome + Logout */}
      {loggedIn && (
        <Stack horizontal tokens={{ childrenGap: 16 }} verticalAlign="center">
          <Text variant="mediumPlus" styles={{ root: { fontSize: 16, color: '#ffffff' } }}>
            Welcome, <strong>{userName || 'User'}</strong> 👋
          </Text>
          <DefaultButton
            text="Logout"
            onClick={handleLogout}
            styles={{
              root: {
                height: 36,
                padding: '0 16px',
                fontSize: 14,
                backgroundColor: 'white',
                color: 'black',
                border: 'none',
              },
              rootHovered: {
                backgroundColor: '#c7e0f4',
              },
            }}
          />
        </Stack>
      )}
    </Stack>
  );
};

export default NavBar;
