import { TextField, PrimaryButton, Stack, MessageBar, Link, Icon, Text } from '@fluentui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await loginUser(email, password);
      localStorage.setItem('authToken', res.data.token);
      localStorage.setItem('userName', res.data.user.email);

      navigate('/add-dish');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <Stack
      tokens={{ childrenGap: 15 }}
      styles={{
        root: {
          width: 320,
          margin: '50px auto',
          padding: 24,
          backgroundColor: '#ffffff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: 8,
        },
      }}
    >
      <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
        <Icon iconName="Lock" styles={{ root: { fontSize: 24, color: '#0078d4' } }} />
        <Text variant="xLarge" styles={{ root: { fontWeight: 600 } }}>Login</Text>
      </Stack>

      {error && <MessageBar messageBarType={2}>{error}</MessageBar>}

      <TextField
        label="Email"
        value={email}
        onChange={(_, val) => setEmail(val)}
        autoComplete="email"
      />

      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(_, val) => setPassword(val)}
        canRevealPassword
        autoComplete="current-password"
      />

      <PrimaryButton
        text="Login"
        iconProps={{ iconName: 'Signin' }}
        onClick={handleLogin}
        styles={{
          root: {
            fontWeight: 600,
            padding: '8px 20px',
          },
          icon: {
            fontSize: 16,
          },
        }}
      />

      <Link
        onClick={() => navigate('/register')}
        styles={{
          root: {
            marginTop: 10,
            fontSize: 14,
            color: '#0078d4',
          },
          rootHovered: {
            textDecoration: 'underline',
          },
        }}
      >
        Don’t have an account? Register
      </Link>
    </Stack>
  );
};

export default Login;
