import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
import { Button, Form, Input, message, Modal, Table } from 'antd';
import { BASE_URL } from '../constant/axios';

function KategoriProduk() {
  const [kategoriData, setKategoriData] = useState([]);
  const [addEditModalVisibilty, setAddEditModalVisibilty] = useState(false);
  const [deleteModalVisibility, setDeleteModalVisibility] = useState(false);
  const [editingKategori, setEditingKategori] = useState(null);
  const [delKategori, setDelKategori] = useState(null);
  const dispatch = useDispatch();

  const getAllKategori = () => {
    dispatch({ type: 'showLoading' });
    axios
      .get(`${BASE_URL}/api/kategori/get-all-kategori`)
      .then((response) => {
        dispatch({ type: 'hideLoading' });
        setKategoriData(response.data);
      })
      .catch((error) => {
        dispatch({ type: 'hideLoading' });
        console.log(error);
      });
  };

  const columns = [
    {
      title: 'Nama Kategori',
      dataIndex: 'namaKategori',
      sorter: (a, b) => a.namaKategori.localeCompare(b.namaKategori),
    },
    {
      title: 'Satuan',
      dataIndex: 'satuan',
    },
    {
      title: 'Actions',
      dataIndex: '_id',
      render: (id, record) => (
        <div className='d-flex'>
          <EditTwoTone
            className='mx-2'
            onClick={() => {
              setEditingKategori(record);
              setAddEditModalVisibilty(true);
            }}
          />
          <DeleteTwoTone
            twoToneColor='#eb2f96'
            className='mx-2'
            onClick={() => deleteKategori(record)}
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    getAllKategori();
  }, []);

  const onFinish = (values) => {
    dispatch({ type: 'showLoading' });
    if (editingKategori === null) {
      axios
        .post(`${BASE_URL}/api/kategori/add-kategori`, values)
        .then((response) => {
          dispatch({ type: 'hideLoading' });
          message.success('Kategori Berhasil Ditambah');
          setAddEditModalVisibilty(false);
          getAllKategori();
        })
        .catch((error) => {
          dispatch({ type: 'hideLoading' });
          message.error('Terjadi Kesalahan');
          console.log(error);
        });
    } else {
      axios
        .post(`${BASE_URL}/api/kategori/edit-kategori`, {
          ...values,
          kategoriId: editingKategori._id,
        })
        .then((response) => {
          dispatch({ type: 'hideLoading' });
          message.success('Kategori Berhasil Diubah');
          setEditingKategori(null);
          setAddEditModalVisibilty(false);
          getAllKategori();
        })
        .catch((error) => {
          dispatch({ type: 'hideLoading' });
          message.error('Terjadi Kesalahan');
          console.log(error);
        });
    }
  };

  const deleteKategori = (delKategori) => {
    dispatch({ type: 'showLoading' });
    axios
      .delete(`${BASE_URL}/api/kategori/delete-kategori/${delKategori._id}`)
      .then((response) => {
        dispatch({ type: 'hideLoading' });
        message.success('Kategori berhasil Dihapus');
        setDelKategori(null);
        setDeleteModalVisibility(false);
        getAllKategori();
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
        <h3>Kategori</h3>
        <Button type='primary' onClick={() => setAddEditModalVisibilty(true)}>
          Tambah Kategori
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={kategoriData}
        bordered
        rowKey='_id'
      />

      {addEditModalVisibilty && (
        <Modal
          onCancel={() => {
            setEditingKategori(null);
            setAddEditModalVisibilty(false);
          }}
          visible={addEditModalVisibilty}
          title={`${
            editingKategori !== null ? 'Ubah Kategori' : 'Tambah Kategori'
          }`}
          footer={false}
        >
          <Form
            initialValues={editingKategori}
            layout='vertical'
            onFinish={onFinish}
          >
            <Form.Item name='namaKategori' label='Nama Kategori'>
              <Input />
            </Form.Item>
            <Form.Item name='satuan' label='Satuan'>
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
            setDelKategori(null);
            setDeleteModalVisibility(false);
          }}
          visible={deleteModalVisibility}
          title='Hapus Kategori'
          footer={false}
        >
          <Form initialValues={delKategori} layout='vertical' onFinish={deleteKategori}>
            <div className='text-left'>
              <p>Apakah anda yakin ingin menghapus kategori ini? </p>
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

export default KategoriProduk;
