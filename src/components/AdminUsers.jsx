import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Container } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, TextInput, PasswordInput, Space, Center, Checkbox } from '@mantine/core';

import User from './User';
import Loading from './Loading';
import { loadUsers, createUser } from '../redux/slices/adminSlice';


export default function AdminFiles() {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.admin) || {};
  const [opened, { open, close }] = useDisclosure(false);
  const [visible, { toggle }] = useDisclosure(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isStaff, setIsStaff] = useState(false);

  const handleCreateUser = () => {
    dispatch(createUser({ username: newUsername, password: newPassword, is_staff: isStaff }))
      .then(() => dispatch(loadUsers()));
    close();
  }

  useEffect(() => {
    dispatch(loadUsers());
  }, [dispatch]);


  return (
    <>
      {loading ? (
        <Loading />
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <Container>
          <Center inline style={{ gap: '20px' }}>
            <h2>Users</h2>
            <Button variant='light' onClick={open}>Create new user</Button>
          </Center>
          
            {users && users.map((user) => (
              <User key={user.id} user={user} />
            ))}

        </Container>
      )}

      <Modal opened={opened} onClose={close} title="Create user" centered>
        <TextInput
          label="Username"
          placeholder="Input username"
          onChange={(e) => setNewUsername(e.target.value)}
        />
        <PasswordInput
          label="Password"
          placeholder='Input password'
          visible={visible}
          onVisibilityChange={toggle}
          onChange={(e) => setNewPassword(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleCreateUser()}
        />
        <Space h="md" />
        <Checkbox
          defaultChecked={false}
          label="Grant admin privileges"
          onChange={(e) => setIsStaff(e.target.checked)}
        />
        <Space h="md" />
        <Center>
          <Button onClick={handleCreateUser}>Create user</Button>
        </Center>
      </Modal>

    </>
  );
}