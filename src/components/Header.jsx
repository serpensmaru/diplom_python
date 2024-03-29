import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { useDisclosure } from '@mantine/hooks';
import { IconBrandGoogleDrive } from '@tabler/icons-react';
import { Container, Button, Text, Center, Menu, Avatar, TextInput, Space, Modal, Notification, Group, PasswordInput, Stack } from '@mantine/core';

import { checkUser, logout, changeUsername, changePassword } from '../redux/slices/authSlice';


export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [newUserName, setNewUserName] = useState(JSON.parse(sessionStorage.getItem('user'))?.username);
  const [newPassword, setNewPassword] = useState('');
  const [confirmedNewPassword, setConfirmedNewPassword] = useState('');
  const [changeUsernameModalOpened, setChangeUsernameModalOpened] = useState(false);
  const [changePasswordModalOpened, setChangePasswordModalOpened] = useState(false)
  const [visible, { toggle }] = useDisclosure(false);

  const handleLogout = async () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleChangeUsername = async () => {
    if (newUserName) {
      await dispatch(changeUsername({ newUsername: newUserName }));
      setChangeUsernameModalOpened(false);
      handleShowNotification();
    }
  }

  const handleChangePassword = async () => {
    if (newPassword === confirmedNewPassword && newPassword && newPassword !== '') {
      await dispatch(changePassword({ newPassword }));
      setChangePasswordModalOpened(false);
      handleShowNotification();
    }
  }

  useEffect(() => {
    dispatch(checkUser());
  }, [dispatch]);

  return (
    <>
      <Container fluid h={50} bg="dark.7" style={{ padding: '20px 30px', marginBottom: '50px' }}>
        <Group justify='space-between'>
          <Group justify='flex-start'>
            <IconBrandGoogleDrive size={30} />
            <Text size='xl'>File manager</Text>
            </Group>
          
          {user ? (
            <>
              <Group>
                <Button
                  variant='light'
                  size="md"
                  onClick={() => navigate('/')}>My files
                </Button>
                <Menu trigger="hover" openDelay={100} closeDelay={400}>
                  <Menu.Target>
                    <Button size="md"><Avatar radius="xl" size="md" variant="transparent" />{user.username}</Button>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Label>Settings</Menu.Label>
                    <Menu.Item onClick={() => setChangeUsernameModalOpened(true)}>Change username</Menu.Item>
                    <Menu.Item onClick={() => setChangePasswordModalOpened(true)}>Change password</Menu.Item>
                    <Menu.Item color='red' onClick={handleLogout}>Logout</Menu.Item>
                    {user.is_staff ? (
                      <>
                        <Menu.Divider />
                        <Menu.Label>Admin panel</Menu.Label>
                        <Menu.Item onClick={() => navigate('/admin/files')}>Manage files</Menu.Item>
                        <Menu.Item onClick={() => navigate('/admin/users')}>Manage users</Menu.Item>
                      </>) : null}
                  </Menu.Dropdown>
                </Menu>
              </Group>
            </>
          ) : (
            <Button
              size="md" onClick={() => navigate('/login')}>Login
            </Button>
          )}
        </Group>

      </Container>

      <Modal opened={changeUsernameModalOpened} onClose={() => setChangeUsernameModalOpened(false)} title="Change username" centered>
        <TextInput data-autofocus label="New username" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} />
        <Space h="lg" />
        <Center>
          <Button
            size="md"
            variant="light"
            onClick={handleChangeUsername}
            onKeyPress={(e) => e.key === 'Enter' && handleChangeUsername()}>Change username</Button>
        </Center>
      </Modal>

      <Modal opened={changePasswordModalOpened} onClose={() => setChangePasswordModalOpened(false)} title="Change password" centered>
        <Stack>
          <PasswordInput
            label="New password"
            defaultValue=""
            visible={visible}
            onVisibilityChange={toggle}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <PasswordInput
            label="Confirm new password"
            defaultValue=""
            visible={visible}
            onVisibilityChange={toggle}
            onChange={(e) => setConfirmedNewPassword(e.target.value)}
          />
        </Stack>
        <Space h="lg" />
        <Center>
          <Button size="md" variant="light" onClick={handleChangePassword} onKeyPress={(e) => e.key === 'Enter' && handleChangePassword()}>Change password</Button>
        </Center>
      </Modal>
    </>
  )
}
