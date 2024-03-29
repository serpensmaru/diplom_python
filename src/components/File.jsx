import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { IconTrash, IconDownload, IconEdit, IconLink, IconCopy, IconCheck } from '@tabler/icons-react';
import { Container, Button, Space, Grid, Popover, Text, CopyButton, ActionIcon, Tooltip, rem, Avatar, Modal, TextInput, Center, Group, Stack, Indicator } from '@mantine/core';

import { editFile, downloadFile, deleteFile, loadFiles } from '../redux/slices/fileSlice';


export default function File({ file }) {
  const dispatch = useDispatch();
  const [editingFile, setEditingFile] = useState(null);
  const [newFilename, setNewFilename] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [editModalOpened, setEditModalOpened] = useState(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const users = useSelector((state) => state.admin.users);

  const handleEdit = (file) => {
    setEditingFile(file);
    setNewFilename(file.filename);
    setNewDescription(file.description);
    setEditModalOpened(true);
  };

  const handleSave = () => {
    if (editingFile) {
      dispatch(editFile({ fileId: editingFile.id, newFilename: newFilename, newDescription: newDescription }))
        .then(() => {
          dispatch(loadFiles());
          setEditingFile(null);
        })
        .catch((error) => {
          console.error('Error renaming file:', error);
        });
    }
    setEditingFile(null);
    setNewFilename('');
    setNewDescription('');
    setEditModalOpened(false);
  };

  const handleDelete = (fileId) => {
    dispatch(deleteFile(fileId))
      .then(() => {
        dispatch(loadFiles());
      })
      .catch((error) => {
        console.error('Error deleting file:', error);
      });
  };


  return (
    <>
      <Container bg="dark.5" style={{ padding: '20px', borderRadius: '8px' }}>
        <Group justify='center' align='center'>
          <Group justify='space-between' wrap="nowrap" gap='xl' style={{ flex: '1', padding: '0px 30px', maxWidth: '80%' }} >
            <Stack align="center" gap="0">
              {users.find(user => user.username === file.by_user && user.is_staff) ? (
                <Indicator inline label="staff" size={16}>
                  <Avatar radius="xl" size="md" variant="transparent" />
                  <Text>{file.by_user}</Text>
                </Indicator>
              ) : (
                <>
                  <Avatar radius="xl" size="md" variant="transparent" />
                  <Text>{file.by_user}</Text>
                </>)}
            </Stack>
            <Stack gap='4'>
              {file.filename}
              <Popover width={200} position="bottom" withArrow shadow="md">
                <Popover.Target>
                  <Group justify='flex-start' gap='4'>
                    <Text size='xs'>ⓘ</Text>
                    <Text size='xs' td='underline'>info</Text>
                  </Group>
                </Popover.Target>
                <Popover.Dropdown>
                  <Text size="xs">{file.description}</Text>
                </Popover.Dropdown>
              </Popover>
            </Stack>
            {file.size}
          </Group>
          <Group justify='center' align='center' gap='xs'>
            <Popover width={450} trapFocus position="bottom" withArrow shadow="md">
              <Popover.Target>
                <Button variant="light" size="md"><IconLink size={20} /></Button>
              </Popover.Target>
              <Popover.Dropdown>
                <Grid>
                  <Grid.Col span={11}>
                    <Text>
                      {file.share_link}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={1}>
                    <CopyButton value={file.share_link} timeout={1000}>
                      {({ copied, copy }) => (
                        <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                          <ActionIcon color={copied ? 'teal' : 'gray'} variant="subtle" onClick={copy}>
                            {copied ? (
                              <IconCheck style={{ width: rem(16) }} />
                            ) : (
                              <IconCopy style={{ width: rem(16) }} />
                            )}
                          </ActionIcon>
                        </Tooltip>
                      )}
                    </CopyButton>
                  </Grid.Col>
                </Grid>
              </Popover.Dropdown>
            </Popover>


            <Button rightSection={<IconEdit size={16} />} variant="light" size="md" onClick={() => handleEdit(file)}>
              Edit
            </Button>

            <Button rightSection={<IconDownload size={16} />} variant="light" size="md" onClick={() => dispatch(downloadFile(file.id))}>
              Download
            </Button>

            <Button rightSection={<IconTrash size={16} />} variant="light" size="md" color="red" onClick={() => setDeleteModalOpened(true)}>
              Delete
            </Button>
          </Group>
        </Group>
      </Container >
      <Space h="xs" />

      <Modal opened={editModalOpened} onClose={() => setEditModalOpened(false)} title="Edit file" centered>
        <TextInput
          data-autofocus
          label="File name"
          value={newFilename}
          onChange={(e) => setNewFilename(e.target.value)} />
        <Space h="xs" />
        <TextInput
          label="Description"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)} />
        <Space h="md" />
        <Center>
          <Button onClick={handleSave}>Save</Button>
        </Center>
      </Modal>

      <Modal opened={deleteModalOpened} onClose={() => setDeleteModalOpened(false)} centered>
        <Center>
          <Text>Are you sure you want to delete file "{file.filename}"?</Text>
        </Center>
        <Space h="md" />
        <Center>
          <Button color="red" onClick={() => handleDelete(file.id)}>Delete</Button>
        </Center>
        <Space h="md" />
      </Modal>

    </>
  )
}
