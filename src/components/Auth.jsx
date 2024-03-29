import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Container, Center, TextInput, PasswordInput, Space, Button, Anchor } from '@mantine/core';

import { login, signUp } from '../redux/slices/authSlice';


function Auth({ action }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const [error, setError] = useState();

  const handleLogin = async () => {
    const response = await dispatch(login({ username, password }));
    if (login.fulfilled.match(response)) {
      navigate('/');
    } else {
      setError('Login failed. Incorrect data.');
    }
  };

  const handleSignUp = async () => {
    const response = await dispatch(signUp({ username, password }));
    if (signUp.fulfilled.match(response)) {
      navigate('/');
    } else {
      setError('Sign up failed. Try again with another username.');
    }
  }


  return (
    <Center h={700}>
      <Container>
        <TextInput
          style={{ width: '400px' }}
          label="Login"
          size='md'
          value={username}
          {...(error && { error: error })}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Space h="lg" />
        <PasswordInput
          style={{ width: '400px' }}
          size="md"
          label="Password"
          value={password}
          {...(error && { error: error })}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
        />
        <Space h="xl" />
        {action === 'signin' ? (
          <>
            <Center>
              <Button variant="filled" size='md' style={{ width: '150px' }} onClick={handleLogin}>
                Login
              </Button>
            </Center>
            <Space h="md" />
            <Center>
              <Anchor href="signup">
                Sign up
              </Anchor>
            </Center>
          </>
        ) : (
          <Center>
            <Button variant="filled" size='md' style={{ width: '150px' }} onClick={handleSignUp}>
              Sign up
            </Button>
          </Center>
        )}
      </Container>
    </Center>
  );
}


export default Auth;