import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
import { Button, Form, Input, message, Modal, Select, Table } from 'antd';
import { BASE_URL } from '../constant/axios';

function Items() {
  const { Search } = Input;
  const onSearch = (value) => console.log(value);

  const [itemsData, setItemsData] = useState([]);
  const [addEditModalVisibilty, setAddEditModalVisibilty] = useState(false);
  const [deleteModalVisibility, setDeleteModalVisibility] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [delItem, setDelItem] = useState(null);
  const dispatch = useDispatch();

  const getAllItems = () => {
    dispatch({ type: 'showLoading' });
    axios
      .get(`${BASE_URL}/api/users/get-all-user`)
      .then((response) => {
        dispatch({ type: 'hideLoading' });
        setItemsData(response.data);
      })
      .catch((error) => {
        dispatch({ type: 'hideLoading' });
        console.log(error);
      });
  };

  const columns = [
    {
      title: 'Nama',
      dataIndex: 'name',
    },
    {
      title: 'User ID',
      dataIndex: 'userId',
    },
    {
      title: 'Password',
      dataIndex: 'password',
    },
    {
      title: 'Role',
      dataIndex: 'role',
    },
    {
      title: 'Actions',
      dataIndex: '_id',
      render: (id, record) => (
        <div className='d-flex'>
          <EditTwoTone
            className='mx-2'
            onClick={() => {
              setEditingItem(record);
              setAddEditModalVisibilty(true);
            }}
          />
          <DeleteTwoTone
            twoToneColor='#eb2f96'
            className='mx-2'
            onClick={() => {
              setDelItem(record);
              setDeleteModalVisibility(true);
            }}
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    getAllItems();
  }, []);

  const onFinish = (values) => {
    dispatch({ type: 'showLoading' });
    if (editingItem === null) {
      axios
        .post(`${BASE_URL}/api/users/add-user`, values)
        .then((response) => {
          dispatch({ type: 'hideLoading' });
          message.success('User Berhasil Ditambah');
          setAddEditModalVisibilty(false);
          getAllItems();
        })
        .catch((error) => {
          dispatch({ type: 'hideLoading' });
          message.error('Terjadi Kesalahan');
          console.log(error);
        });
    } else {
      axios
        .post(`${BASE_URL}/api/users/edit-user`, {
          ...values,
          usersId: editingItem._id,
        })
        .then((response) => {
          dispatch({ type: 'hideLoading' });
          message.success('Data User Berhasil Diubah');
          setEditingItem(null);
          setAddEditModalVisibilty(false);
          getAllItems();
        })
        .catch((error) => {
          dispatch({ type: 'hideLoading' });
          message.error('Terjadi Kesalahan');
          console.log(error);
        });
    }
  };

  const deleteItem = (values) => {
    dispatch({ type: 'showLoading' });
    axios
      .delete(`${BASE_URL}/api/users/${delItem._id}`)
      .then((response) => {
        dispatch({ type: 'hideLoading' });
        message.success('User berhasil Dihapus');
        setDelItem(null);
        setDeleteModalVisibility(false);
        getAllItems();
      })
      .catch((error) => {
        dispatch({ type: 'hideLoading' });
        message.error('Terjadi Kesalahan');
        console.log(error);
      });
  };

  return (
    <div>
      <div className='d-flex justify-content-between'>
        <h3>User</h3>
        <Button type='primary' onClick={() => setAddEditModalVisibilty(true)}>
          Tambah User
        </Button>
      </div>

      <Table columns={columns} dataSource={itemsData} bordered rowKey='_id' />

      {addEditModalVisibilty && (
        <Modal
          onCancel={() => {
            setEditingItem(null);
            setAddEditModalVisibilty(false);
          }}
          visible={addEditModalVisibilty}
          title={`${editingItem !== null ? 'Ubah User' : 'Tambah User'}`}
          footer={false}
        >
          <Form
            initialValues={editingItem}
            layout='vertical'
            onFinish={onFinish}
          >
            <Form.Item name='name' label='Nama'>
              <Input />
            </Form.Item>
            <Form.Item name='userId' label='User ID'>
              <Input />
            </Form.Item>
            <Form.Item name='password' label='Password'>
              <Input type='password'/>
            </Form.Item>
            <Form.Item name='role' label='Role'>
              <Input />
            </Form.Item>
            <div className='d-flex justify-content-end'>
              <Button htmlType='submit' type='primary'>
                SIMPAN
              </Button>
            </div>
          </Form>
        </Modal>
      )}
      {deleteModalVisibility && (
        <Modal
          onCancel={() => {
            setDelItem(null);
            setDeleteModalVisibility(false);
          }}
          visible={deleteModalVisibility}
          title='Hapus User'
          footer={false}
        >
          <Form initialValues={delItem} layout='vertical' onFinish={deleteItem}>
            <div className='text-left'>
              <p>Apakah anda yakin ingin menghapus user ini? </p>
            </div>
            <div className='d-flex justify-content-end'>
              <Button htmlType='submit' type='danger'>
                HAPUS
              </Button>
            </div>
          </Form>
        </Modal>
      )}
    </div>
  );
}

export default Items;
