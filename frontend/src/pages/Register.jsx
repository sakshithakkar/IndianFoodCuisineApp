import { TextField, PrimaryButton, Stack, MessageBar, Text, Icon } from '@fluentui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';

const Register = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleRegister = async () => {
    try {
      await registerUser(form);
      setSuccess('Registration successful. You can now login.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
        <Icon iconName="Contact" styles={{ root: { fontSize: 24, color: '#0078d4' } }} />
        <Text variant="xLarge" styles={{ root: { fontWeight: 600 } }}>
          Register
        </Text>
      </Stack>

      {error && <MessageBar messageBarType={2}>{error}</MessageBar>}
      {success && <MessageBar messageBarType={4}>{success}</MessageBar>}

      <TextField
        label="Email"
        value={form.email}
        onChange={(_, val) => handleChange('email', val)}
        autoComplete="email"
      />
      <TextField
        label="Password"
        type="password"
        value={form.password}
        onChange={(_, val) => handleChange('password', val)}
        canRevealPassword
        autoComplete="new-password"
      />

      <Stack horizontal tokens={{ childrenGap: 10 }}>
        <PrimaryButton
          text="Register"
          iconProps={{ iconName: 'AddFriend' }}
          onClick={handleRegister}
          styles={{
            root: { fontWeight: 600, padding: '8px 20px' },
            icon: { fontSize: 16 },
          }}
        />

        <PrimaryButton
          text="Back"
          iconProps={{ iconName: 'Back' }}
          onClick={() => navigate(-1)}
          styles={{
            root: {
              backgroundColor: '#f3f2f1',
              color: '#323130',
              fontWeight: 500,
              padding: '8px 20px',
            },
            rootHovered: {
              backgroundColor: '#e1dfdd',
            },
            icon: { color: '#605e5c' },
          }}
        />
      </Stack>
    </Stack>
  );
};

export default Register;
