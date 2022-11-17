import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { useDispatch } from "react-redux";
import { EditTwoTone, DeleteTwoTone } from "@ant-design/icons";
import { Button, Form, Input, message, Modal, Table, DatePicker } from "antd";
import { BASE_URL } from "../constant/axios";

function Pembelian() {
  const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY"];
  const { Search } = Input;
  const [cari, setCari] = useState("");

  const [pembelianData, setPembelianData] = useState([]);
  const [addModalVisibility, setAddModalVisibility] = useState(false);
  const [editModalVisibility, setEditModalVisibility] = useState(false);
  const [deleteModalVisibility, setDeleteModalVisibility] = useState(false);
  const [editingPembelian, setEditingPembelian] = useState(null);
  const [delPembelian, setDelPembelian] = useState(null);
  const dispatch = useDispatch();

  const searching = (data) => {
    return data.filter((v) => v.namaProduk.toLowerCase().includes(cari));
  }

  const getAllPembelian = () => {
    dispatch({ type: "showLoading" });
    axios
      .get(`${BASE_URL}/api/pembelian/get-all-pembelian`)
      .then((response) => {
        dispatch({ type: "hideLoading" });
        setPembelianData(response.data);
      })
      .catch((error) => {
        dispatch({ type: "hideLoading" });
        console.log(error);
      });
  };

  const editPembelian = (values) => {
    dispatch({ type: "showLoading" });
    axios
      .post(`${BASE_URL}/api/pembelian/edit-pembelian`, {
        ...values,
        pembelianId: editingPembelian._id,
      })
      .then((response) => {
        dispatch({ type: "hideLoading" });
        message.success("Data Pembelian Berhasil Diubah");
        setEditingPembelian(null);
        setEditModalVisibility(false);
        getAllPembelian();
      })
      .catch((error) => {
        dispatch({ type: "hideLoading" });
        message.error("Terjadi Kesalahan");
        console.log(error);
      });
  };

  const deletePembelian = (values) => {
    dispatch({ type: "showLoading" });
    axios
      .delete(`${BASE_URL}/api/pembelian/${delPembelian._id}`)
      .then((response) => {
        dispatch({ type: "hideLoading" });
        message.success("Data Pembelian Berhasil Dihapus");
        setDelPembelian(null);
        setDeleteModalVisibility(false);
        getAllPembelian();
      })
      .catch((error) => {
        dispatch({ type: "hideLoading" });
        message.error("Terjadi Kesalahan");
        console.log(error);
      });
  };

  //date formatting
  pembelianData.map((e) => {
    var date = new Date(e.tanggalPembelian);
    var sdate = {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    };
    e.newtanggalPembelian = date.toLocaleDateString("en-EN", sdate);
  });

  const columns = [
    {
      title: "Tanggal Pembelian",
      dataIndex: "newtanggalPembelian",
      sorter: (a, b) =>
        a.newtanggalPembelian.localeCompare(b.newtanggalPembelian),
    },
    {
      title: "Nama Produk",
      dataIndex: "namaProduk",
      sorter: (a, b) => a.namaProduk.localeCompare(b.namaProduk),
    },
    {
      title: "Jumlah",
      dataIndex: "jumlah",
    },
    {
      title: "Total Harga",
      dataIndex: "hargaPembelian",
      sorter: (a, b) => a.hargaPembelian - b.hargaPembelian,
    },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => (
        <div className="d-flex">
          <EditTwoTone
            className="mx-2"
            onClick={() => {
              setEditingPembelian(record);
              setEditModalVisibility(true);
            }}
          />
          <DeleteTwoTone
            twoToneColor="#eb2f96"
            className="mx-2"
            onClick={() => {
              setDelPembelian(record);
              setDeleteModalVisibility(true);
            }}
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    getAllPembelian();
  }, []);

  const onFinish = (values) => {
    dispatch({ type: "showLoading" });
    axios
      .post(`${BASE_URL}/api/pembelian/add-pembelian`, values)
      .then((response) => {
        dispatch({ type: "hideLoading" });
        message.success("Data Pembelian Berhasil Ditambah");
        setAddModalVisibility(false);
        getAllPembelian();
      })
      .catch((error) => {
        dispatch({ type: "hideLoading" });
        message.error("Terjadi Kesalahan");
        console.log(error);
      });
  };

  return (
    <div>
      <div className="d-flex justify-content-between">
        <h3>Pembelian</h3>
        <Button type="primary" onClick={() => setAddModalVisibility(true)}>
          Tambah Pembelian
        </Button>
      </div>

      <div className="d-flex">
        <Search
          placeholder="search pembelian"
          onChange={(e) => setCari(e.target.value)}
          style={{
            width: 240,
          }}
        />
      </div>

      <Table columns={columns} dataSource={searching(pembelianData)} bordered />

      {addModalVisibility && (
        <Modal
          onCancel={() => {
            setAddModalVisibility(false);
          }}
          visible = {addModalVisibility}
          title = 'Tambah Data Pembelian'
          footer = {false}
        >
          {" "}
          <Form
            initialValues={editingPembelian}
            layout="vertical"
            onFinish={onFinish}
          >
            <Form.Item name="tanggalPembelian" label="Tanggal Pembelian">
              <DatePicker defaultValue={moment()} format={dateFormatList} />
            </Form.Item>
            <Form.Item name="namaProduk" label="Nama Produk">
              <Input />
            </Form.Item>
            <Form.Item name="jumlah" label="Jumlah">
              <Input />
            </Form.Item>
            <Form.Item name="hargaPembelian" label="Total Harga">
              <Input />
            </Form.Item>
            <Form.Item name="keterangan" label="Keterangan">
              <Input.TextArea />
            </Form.Item>
            <div className="d-flex justify-content-end">
              <Button htmlType="submit" type="primary">
                SIMPAN
              </Button>
            </div>
          </Form>{" "}
        </Modal>
      )}

      {editModalVisibility && (
        <Modal
          onCancel={() => {
            setEditingPembelian(null);
            setEditModalVisibility(false);
          }}
          visible = {editModalVisibility}
          title = 'Ubah Data Pembelian'
          footer = {false}
        >
          {" "}
          <Form
            initialValues={editingPembelian}
            layout="vertical"
            onFinish={editPembelian}
          >
            <Form.Item name="namaProduk" label="Nama Produk">
              <Input />
            </Form.Item>
            <Form.Item name="jumlah" label="Jumlah">
              <Input />
            </Form.Item>
            <Form.Item name="hargaPembelian" label="Total Harga">
              <Input />
            </Form.Item>
            <Form.Item name="keterangan" label="Keterangan">
              <Input.TextArea />
            </Form.Item>
            <div className="d-flex justify-content-end">
              <Button htmlType="submit" type="primary">
                SIMPAN
              </Button>
            </div>
          </Form>{" "}
        </Modal>
      )}

      {deleteModalVisibility && (
        <Modal
          onCancel={() => {
            setDelPembelian(null);
            setDeleteModalVisibility(false);
          }}
          visible = {deleteModalVisibility}
          title = 'Hapus Data Pembelian'
          footer = {false}
        >
          <Form
            initialValues={delPembelian}
            layout="vertical"
            onFinish={deletePembelian}
          >
            <div className="text-left">
              <p>Apakah anda yakin ingin menghapus data pembelian ini? </p>
            </div>
            <div className="d-flex justify-content-end">
              <Button htmlType="submit" type="danger">
                HAPUS
              </Button>
            </div>
          </Form>
        </Modal>
      )}
    </div>
  );
}

export default Pembelian;
