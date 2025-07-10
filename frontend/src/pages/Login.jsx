import { TextField, PrimaryButton, Stack, MessageBar, Link } from '@fluentui/react';
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
    <Stack tokens={{ childrenGap: 15 }} styles={{ root: { width: 300, margin: '50px auto' } }}>
      <h2>Login</h2>
      {error && <MessageBar messageBarType={2}>{error}</MessageBar>}
      <TextField label="Email" value={email} onChange={(_, val) => setEmail(val)} />
      <TextField label="Password" type="password" value={password} onChange={(_, val) => setPassword(val)} />
      <PrimaryButton text="Login" onClick={handleLogin} />
      <Link onClick={() => navigate('/register')}>Don't have an account? Register</Link>

    </Stack>
  );
};

export default Login;
