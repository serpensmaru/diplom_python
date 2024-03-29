import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { IconEdit, IconTrash } from '@tabler/icons-react';
import { Container, Button, Space, Stack, Modal, TextInput, Center, Text, Checkbox, Group, Indicator } from '@mantine/core';

import { editUser, loadUsers, deleteUser } from '../redux/slices/adminSlice';


export default function User({ user }) {
  const dispatch = useDispatch();
  const [editingUser, setEditingUser] = useState(null);
  const [newUserName, setNewUserName] = useState('');
  const [editModalOpened, setEditModalOpened] = useState(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [isStaff, setIsStaff] = useState(null);

  const handleEdit = (user) => {
    setEditingUser(user);
    setNewUserName(user.username);
    setEditModalOpened(true);
  };

  const handleSave = () => {
    if (editingUser) {

      if (!isStaff) {
        setIsStaff(editingUser.is_staff);
      }

      dispatch(editUser({ userId: editingUser.id, newUsername: newUserName, isStaff: isStaff }))
        .then(() => {
          setEditingUser(null);
          setNewUserName('');
          dispatch(loadUsers());
        });
    }
    setEditModalOpened(false);
  };

  const handleDelete = (userId) => {
    dispatch(deleteUser(userId)).then(() => {
      dispatch(loadUsers());
    })
  };

  return (
    <>
      <Container bg="dark.5" style={{ padding: '20px', borderRadius: '8px' }}>
        <Group justify='space-between' align='center'>
          <Stack gap='0' style={{ padding: '0px 30px'}}>
          {user.is_staff ? (<Indicator inline label="staff" size={16}>
            {user.username}
            </Indicator>) : (<Text>{user.username}</Text>)}
          </Stack>
          <Group justify='center' align='center'>
            <Button
              rightSection={<IconEdit size={16} />}
              variant="light"
              size="md"
              onClick={() => handleEdit(user)}
            >
              Edit
            </Button>

            <Button
              rightSection={<IconTrash size={16} />}
              variant="light"
              size="md"
              color="red"
              onClick={() => setDeleteModalOpened(true)}
            >
              Delete
            </Button>
          </Group>
        </Group>
      </Container >
      <Space h="xs" />

      <Modal opened={editModalOpened} onClose={() => setEditModalOpened(false)} title="Edit user" centered>
        <TextInput data-autofocus label="Username" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} />
        <Space h="lg" />
        <Checkbox defaultChecked={user.is_staff} label="Grant admin privileges" onChange={(e) => setIsStaff(e.target.checked)} />
        <Space h="lg" />
        <Center>
          <Button onClick={handleSave}>Save</Button>
        </Center>
      </Modal>

      <Modal opened={deleteModalOpened} onClose={() => setDeleteModalOpened(false)} centered>
        <Center>
          <Text>Are you sure you want to delete user "{user.username}"?</Text>
        </Center>
        <Space h="md" />
        <Center>
          <Button color="red" onClick={() => handleDelete(user.id)}>Delete</Button>
        </Center>
        <Space h="md" />
      </Modal>
    </>
  );
}