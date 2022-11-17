import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
import { Button, Form, Input, message, Modal, Select, Table } from 'antd';
import { BASE_URL } from '../constant/axios';

function Items() {
  const { Search } = Input;
  const [cari, setCari] = useState("");

  const [itemsData, setItemsData] = useState([]);
  const [addEditModalVisibilty, setAddEditModalVisibilty] = useState(false);
  const [deleteModalVisibility, setDeleteModalVisibility] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [delItem, setDelItem] = useState(null);
  const [getKategori, setKategori] = useState([]);
  const dispatch = useDispatch();

  const searching = (data) => {
    return data.filter((v) => v.namaproduk.toLowerCase().includes(cari));
  }

  const getAllItems = () => {
    dispatch({ type: 'showLoading' });
    axios
      .get(`${BASE_URL}/api/items/get-all-items`)
      .then((response) => {
        dispatch({ type: 'hideLoading' });
        setItemsData(response.data);
      })
      .catch((error) => {
        dispatch({ type: 'hideLoading' });
        console.log(error);
      });
  };

  const getAllKategori = () => {
    axios
      .get(`${BASE_URL}/api/kategori/get-all-kategori`)
      .then((response) => {
        setKategori(response.data);
        console.log(getKategori);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const columns = [
    {
      title: 'Kode Produk',
      dataIndex: 'kodeproduk',
      sorter: (a, b) => a.kodeproduk.localeCompare(b.kodeproduk),
    },
    {
      title: 'Nama Produk',
      dataIndex: 'namaproduk',
      sorter: (a, b) => a.namaproduk.localeCompare(b.namaproduk),
    },
    {
      title: 'Harga',
      dataIndex: 'harga',
      sorter: (a, b) => a.harga - b.harga,
    },
    {
      title: 'Kategori',
      dataIndex: 'kategori',
      render: (v) => v.namaKategori,
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
    getAllKategori();
  }, []);

  const onFinish = (values) => {
    dispatch({ type: 'showLoading' });
    if (editingItem === null) {
      axios
        .post(`${BASE_URL}/api/items/add-item`, values)
        .then((response) => {
          dispatch({ type: 'hideLoading' });
          message.success('Produk Berhasil Ditambah');
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
        .post(`${BASE_URL}/api/items/edit-item`, {
          ...values,
          itemId: editingItem._id,
        })
        .then((response) => {
          dispatch({ type: 'hideLoading' });
          message.success('Data Produk Berhasil Diubah');
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
      .delete(`${BASE_URL}/api/items/delete-item/${delItem._id}`)
      .then((response) => {
        dispatch({ type: 'hideLoading' });
        message.success('Produk berhasil Dihapus');
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
        <h3>Produk</h3>
        <Button type='primary' onClick={() => setAddEditModalVisibilty(true)}>
          Tambah Produk
        </Button>
      </div>

      <div className='d-flex'>
        <Search
          placeholder="search produk"
          onChange={(e) => setCari(e.target.value)}
          style={{
            width: 240,
          }}
        />
      </div>

      <Table columns={columns} dataSource={searching(itemsData)} bordered rowKey='_id' />

      {addEditModalVisibilty && (
        <Modal
          onCancel={() => {
            setEditingItem(null);
            setAddEditModalVisibilty(false);
          }}
          visible={addEditModalVisibilty}
          title={`${editingItem !== null ? 'Ubah Produk' : 'Tambah Produk'}`}
          footer={false}
        >
          <Form
            initialValues={editingItem}
            layout='vertical'
            onFinish={onFinish}
          >
            <Form.Item name='namaproduk' label='Nama Produk'>
              <Input />
            </Form.Item>
            <Form.Item name='kodeproduk' label='Kode Produk'>
              <Input />
            </Form.Item>
            <Form.Item name='harga' label='Harga'>
              <Input />
            </Form.Item>
            <Form.Item name='kategori' label='Kategori'>
              <Select>
                {getKategori.map((v) => (
                  <Select.Option value={v._id}>{v.namaKategori}</Select.Option>
                ))}
              </Select>
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
          title='Hapus Produk'
          footer={false}
        >
          <Form initialValues={delItem} layout='vertical' onFinish={deleteItem}>
            <div className='text-left'>
              <p>Apakah anda yakin ingin menghapus produk ini? </p>
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
