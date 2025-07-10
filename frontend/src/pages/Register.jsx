import { TextField, PrimaryButton, Stack, MessageBar } from '@fluentui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
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
    <Stack tokens={{ childrenGap: 15 }} styles={{ root: { width: 300, margin: '50px auto' } }}>
      <h2>Register</h2>
      {error && <MessageBar messageBarType={2}>{error}</MessageBar>}
      {success && <MessageBar messageBarType={4}>{success}</MessageBar>}
      <TextField label="Email" value={form.email} onChange={(_, val) => handleChange('email', val)} />
      <TextField label="Password" type="password" value={form.password} onChange={(_, val) => handleChange('password', val)} />
      <PrimaryButton text="Register" onClick={handleRegister} />
    </Stack>
  );
};

export default Register;
