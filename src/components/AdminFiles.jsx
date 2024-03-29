import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState, useRef } from 'react';

import { useDisclosure } from '@mantine/hooks';
import { Container, Center, Button, Modal, TextInput, NativeSelect, Space, FileInput, Group } from '@mantine/core';

import File from './File';
import Loading from './Loading';

import { uploadFile } from '../redux/slices/fileSlice';
import { loadFiles, loadUsers } from '../redux/slices/adminSlice';


export default function AdminFiles() {
  const dispatch = useDispatch();
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const { files, users, loading, error } = useSelector((state) => state.admin) || {};
  const usernames = users.map(user => user.username);
  const [uploadBy, setUploadBy] = useState(JSON.parse(sessionStorage.getItem('user')).username)
  const [filename, setFilename] = useState('')
  const [description, setDescription] = useState('');

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (selectedFile) {

      if (filename === '') {
        setFilename(selectedFile.name)
      }

      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('filename', filename);
      formData.append('description', description);
      formData.append('by_user', users.find(user => user.username === uploadBy)?.id);
      dispatch(uploadFile(formData))
        .then(() => {
          dispatch(loadFiles());
          setSelectedFile(null);
        })
        .catch((error) => {
          console.error('Error uploading file:', error);
        });
    }
    close();
    setFilename('');
    setDescription('');
    setSelectedFile(null);
  };

  useEffect(() => {
    dispatch(loadFiles());
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
            <h2>Files</h2>
            <Button variant='light' onClick={open}>Upload new file</Button>
          </Center>

          {files && files.map((file) => (
            <File key={file.id} file={file} />
          ))}

        </Container>
      )}

      <Modal opened={opened} onClose={close} title="Upload new file" centered>
        <TextInput
          label="File name"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
        />
        <Space h="xs" />
        <TextInput
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Space h="lg" />
        <input
          type="file"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleFileInputChange}
        />
        <Group>
          <FileInput
            onClick={() => fileInputRef.current.click()}
            placeholder={selectedFile ? selectedFile.name : 'Upload files'}
            variant="default" multiple style={{ borderRadius: '5px', flex: '1' }} />
          <Button
            variant="light"
            onClick={() => fileInputRef.current.click()}
          >
            Choose files
          </Button>
        </Group>
        <Space h="xs" />
        <NativeSelect
          label="by user"
          data={usernames}
          defaultValue={JSON.parse(sessionStorage.getItem('user')).username}
          onChange={(e) => setUploadBy(e.target.value)} />
        <Space h="lg" />
        <Center>
          <Button
            onClick={handleUpload}>Upload file</Button>
        </Center>
      </Modal>
    </>
  );
}