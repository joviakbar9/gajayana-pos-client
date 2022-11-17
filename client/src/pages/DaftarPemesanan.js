import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { EyeOutlined, EditTwoTone, DeleteTwoTone } from "@ant-design/icons";
import { Button, Input, message, Modal, Select, Table, Form } from "antd";
import ReactToPrint from "react-to-print";
import { useReactToPrint } from "react-to-print";
import { BASE_URL } from "../constant/axios";
import logo from "../resources/PrintingLogo.png";

function DaftarPemesanan() {
  const { Search } = Input;
  const [cari, setCari] = useState("");

  const componentRef = useRef();
  const [pemesananData, setPemesananData] = useState([]);
  const [printBillModalVisibility, setPrintBillModalVisibility] = useState(false);
  const [addEditModalVisibility, setAddEditModalVisibility] = useState(false);
  const [deleteModalVisibility, setDeleteModalVisibility] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [editingBill, setEditingBill] = useState(null);
  const [delBill, setDelBill] = useState(null);
  const dispatch = useDispatch();

  const searching = (data) => {
    return data.filter((v) => v._id.toLowerCase().includes(cari));
  }

  const getAllPemesanan = () => {
    dispatch({ type: "showLoading" });
    axios
      .get(`${BASE_URL}/api/pemesanan/get-all-pemesanan`)
      .then((response) => {
        dispatch({ type: "hideLoading" });
        const data = response.data;
        data.reverse();
        setPemesananData(data);
      })
      .catch((error) => {
        dispatch({ type: "hideLoading" });
        console.log(error);
      });
  };

  //date formatting
  pemesananData.map((e) => {
    var date = new Date(e.tanggalPemesanan);
    var sdate = {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    };
    e.newtanggalPemesanan = date.toLocaleDateString("en-EN", sdate);

    var ldate = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    e.tanggalNota = date.toLocaleDateString("id-ID", ldate);
    // e.newtanggalPemesanan = date.getDay() + "/" + date.getMonth() + "/" + date.getFullYear()
  });

  const columns = [
    {
      title: "Tanggal Pemesanan",
      dataIndex: "newtanggalPemesanan",
      sorter: (a, b) =>
        a.newtanggalPemesanan.localeCompare(b.newtanggalPemesanan),
    },
    {
      title: "No. Nota",
      dataIndex: "_id",
    },
    {
      title: "Nama Customer",
      dataIndex: "customerId",
      render: (v) => v.namaCustomer,
    },
    {
      title: "No. Hp",
      dataIndex: "customerId",
      render: (v) => v.noHpCustomer,
    },
    {
      title: "DP",
      dataIndex: "uangMuka",
    },
    {
      title: "Diskon (%)",
      dataIndex: "diskon",
    },
    {
      title: "Sisa Pembayaran",
      dataIndex: "sisaPembayaran",
    },
    {
      title: "Total Harga",
      dataIndex: "totalHarga",
    },
    {
      title: "Status Pembayaran",
      dataIndex: "statusPembayaran",
      render: (v) => (v === "dp" ? "Belum Lunas" : "Lunas"),
    },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => (
        <div className="d-flex">
          <EyeOutlined
            className="mx-2"
            onClick={() => {
              setSelectedBill(record);
              setPrintBillModalVisibility(true);
            }}
          />
          <EditTwoTone
            className="mx-2"
            onClick={() => {
              setEditingBill(record);
              setAddEditModalVisibility(true);
            }}
          />
          <DeleteTwoTone
            twoToneColor="#eb2f96"
            className="mx-2"
            onClick={() => {
              setDelBill(record);
              setDeleteModalVisibility(true);
            }}
          />
        </div>
      ),
    },
  ];

  const cartcolumns = [
    {
      title: "Nama Produk",
      dataIndex: "namaproduk",
    },
    {
      title: "Harga",
      dataIndex: "harga",
    },
    {
      title: "Jumlah",
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          <b>{record.quantity}</b>
        </div>
      ),
    },
    {
      title: "Total Harga",
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          <b>{record.quantity * record.harga}</b>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getAllPemesanan();
  }, []);

  const onFinish = (values) => {
    dispatch({ type: "showLoading" });

    if (editingBill === null) {
      axios
        .post(`${BASE_URL}/api/pemesanan/add-pemesanan`, values)
        .then((response) => {
          dispatch({ type: "hideLoading" });
          message.success("Pemesanan Berhasil Ditambah");
          setAddEditModalVisibility(false);
          getAllPemesanan();
        })
        .catch((error) => {
          dispatch({ type: "hideLoading" });
          message.error("Terjadi Kesalahan");
          console.log(error);
        });
    } else {
      if (values.statusPembayaran === "lunas") {
        values.sisaPembayaran = 0;
      }
      axios
        .post(`${BASE_URL}/api/pemesanan/edit-pemesanan`, {
          ...values,
          pemesananId: editingBill._id,
        })
        .then((response) => {
          dispatch({ type: "hideLoading" });
          message.success("Data Pemesanan Berhasil Diubah");
          setEditingBill(null);
          setAddEditModalVisibility(false);
          getAllPemesanan();
        })
        .catch((error) => {
          dispatch({ type: "hideLoading" });
          message.error("Terjadi Kesalahan");
          console.log(error);
        });
    }
  };

  const deletePemesanan = (values) => {
    dispatch({ type: "showLoading" });
    axios
      .delete(`${BASE_URL}/api/pemesanan/${delBill._id}`)
      .then((response) => {
        dispatch({ type: "hideLoading" });
        message.success("Data Pemesanan Berhasil Dihapus");
        setDelBill(null);
        setDeleteModalVisibility(false);
        getAllPemesanan();
      })
      .catch((error) => {
        dispatch({ type: "hideLoading" });
        message.error("Terjadi Kesalahan");
        console.log(error);
      });
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div>
      <div className="d-flex justify-content-between">
        <h3>Daftar Pemesanan</h3>
      </div>

      <div className="d-flex">
        <Search
          placeholder="search pemesanan"
          onChange={(e) => setCari(e.target.value)}
          style={{
            width: 240,
          }}
        />
      </div>

      <Table
        columns={columns}
        dataSource={searching(pemesananData)}
        bordered
        rowKey="_id"
      />

      {addEditModalVisibility && (
        <Modal
          onCancel={() => {
            setEditingBill(null);
            setAddEditModalVisibility(false);
          }}
          visible={addEditModalVisibility}
          title={`${
            editingBill !== null ? "Ubah Data Pemesanan" : "Tambah Pemesanan"
          }`}
          footer={false}
        >
          <Form
            initialValues={editingBill}
            layout="vertical"
            onFinish={onFinish}
          >
            <Form.Item
              initialValue={"Lunas"}
              name="statusPembayaran"
              label="Status Pembayaran"
            >
              <Select>
                <Select.Option value="lunas">Lunas</Select.Option>
                <Select.Option value="dp">Belum Lunas</Select.Option>
              </Select>
            </Form.Item>
            <div className="d-flex justify-content-end">
              <Button htmlType="submit" type="primary">
                SIMPAN
              </Button>
            </div>
          </Form>
        </Modal>
      )}

      {deleteModalVisibility && (
        <Modal
          onCancel={() => {
            setDelBill(null);
            setDeleteModalVisibility(false);
          }}
          visible={deleteModalVisibility}
          title="Hapus Data Pemesanan"
          footer={false}
        >
          <Form
            initialValues={delBill}
            layout="vertical"
            onFinish={deletePemesanan}
          >
            <div className="text-left">
              <p>Apakah anda yakin ingin menghapus data pemesanan ini? </p>
            </div>
            <div className="d-flex justify-content-end">
              <Button htmlType="submit" type="danger">
                HAPUS
              </Button>
            </div>
          </Form>
        </Modal>
      )}

      {printBillModalVisibility && (
        <Modal
          onCancel={() => {
            setPrintBillModalVisibility(false);
          }}
          visible={printBillModalVisibility}
          title="Nota Pemesanan"
          footer={false}
          width={800}
        >
          <div className="bill-model p-3" ref={componentRef}>
            <div className="d-flex justify-content-between bill-header pb-2">
              <div>
                <img src={logo} height="70" width="360" />
              </div>
              <div>
                <p>Jl. Gajayana 14A Kav. 2</p>
                <p>Malang</p>
                <p>0341-552080</p>
                <p>E-mail : gajayana.digital@gmail.com</p>
              </div>
            </div>
            <div className="bill-customer-details my-2">
              <table>
                <tr>
                  <td>
                    <b>No. Nota</b>
                  </td>
                  <td> : {selectedBill._id}</td>
                </tr>
                <tr>
                  <td>
                    <b>Tanggal Pemesanan</b>
                  </td>
                  <td> : {selectedBill.tanggalNota}</td>
                </tr>
                <tr>
                  <td>
                    <b>Nama</b>
                  </td>
                  <td> : {selectedBill.customerId.namaCustomer}</td>
                </tr>
                <tr>
                  <td>
                    <b>Nomor Handphone</b>
                  </td>
                  <td> : {selectedBill.customerId.noHpCustomer}</td>
                </tr>
              </table>
            </div>

            <Table
              dataSource={selectedBill.cartItems}
              columns={cartcolumns}
              pagination={false}
              rowKey="_id"
            />

            <div className="dotted-border">
              <table>
                <tr>
                  <td>
                    <b>TOTAL HARGA</b>
                  </td>
                  <td> : Rp {selectedBill.totalHarga}</td>
                </tr>
                <tr>
                  <td>
                    <b>DISKON</b>
                  </td>
                  <td> : {selectedBill.diskon} %</td>
                </tr>
                <tr>
                  <td>
                    <b>DP</b>
                  </td>
                  <td> : Rp {selectedBill.uangMuka}</td>
                </tr>
                <tr>
                  <td>
                    <b>SISA PEMBAYARAN</b>
                  </td>
                  <td> : Rp {selectedBill.sisaPembayaran !== 0
                      ? selectedBill.totalHarga -
                        (selectedBill.totalHarga / 100) * selectedBill.diskon -
                        selectedBill.uangMuka
                      : 0
                    }
                  </td>
                </tr>
              </table>
            </div>

            <div className="nota-grand-total">
              <b>
                GRAND TOTAL : Rp{" "}
                {selectedBill.totalHarga - (selectedBill.totalHarga / 100) * selectedBill.diskon}
              </b>
            </div>
            <div className="dotted-border"></div>

            <div className="text-center">
              <p>Nota harap dibawa untuk pengambilan pesanan</p>
              <p>Pengambilan TANPA NOTA tidak dilayani</p>
              <p>Terimakasih</p>
            </div>

            <div className="text-left">
              <p>Ket : </p>
              {selectedBill.keterangan}
            </div>
          </div>

          <div className="d-flex justify-content-end">
            <Button type="primary" onClick={handlePrint}>
              Cetak Nota
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default DaftarPemesanan;
