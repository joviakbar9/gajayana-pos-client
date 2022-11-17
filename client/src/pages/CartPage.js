import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Select,
  Table,
  DatePicker,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import moment from "moment";
import { BASE_URL } from "../constant/axios";
import {
  DeleteTwoTone,
  PlusCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import e from "cors";

function CartPage() {
  const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY"];
  const { cartItems } = useSelector((state) => state.rootReducer);
  const [billChargeModal, setBillChargeModal] = useState(false);
  const [subTotal, setSubTotal] = useState(0);
  const [sisaPembayaran, setSisa] = useState(0);
  // const [grandTotall, setGrandTotal] = useState(0);
  const [diskon, setDiskon] = useState(0);
  const [getCustomer, setCustomer] = useState([]);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isDp, setIsDp] = useState(false);

  const increaseQuantity = (record) => {
    console.log(record);
    dispatch({
      type: "updateCart",
      payload: { ...record, quantity: record.quantity + 1 },
    });
  };

  const setJumlah = (record, e) => {
    console.log(record);
    dispatch({
      type: "updateCart",
      payload: { ...record, quantity: +e.target.value },
    });
  };

  const decreaseQuantity = (record) => {
    if (record.quantity !== 1) {
      dispatch({
        type: "updateCart",
        payload: { ...record, quantity: record.quantity + -1 },
      });
    }
  };

  const hitungSisa = (event) => {
    setSisa(subTotal - (subTotal / 100) * diskon - event.target.value);
    form.setFieldsValue({
      sisaPembayaran: subTotal - (subTotal / 100) * diskon - event.target.value,
    });
  };

  const getAllCustomer = () => {
    axios
      .get(`${BASE_URL}/api/customer/get-all-customer`)
      .then((response) => {
        setCustomer(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const columns = [
    {
      title: "Kode Produk",
      dataIndex: "kodeproduk",
    },
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
          <MinusCircleOutlined
            className="mx-3"
            onClick={() => decreaseQuantity(record)}
          />
          <input
            value={record.quantity}
            onChange={(e) => setJumlah(record, e)}
            style={{
              width: 70,
            }}
          />
          <PlusCircleOutlined
            className="mx-3"
            onClick={() => increaseQuantity(record)}
          />
        </div>
      ),
    },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => (
        <DeleteTwoTone
          twoToneColor="#eb2f96"
          onClick={() => dispatch({ type: "deleteFromCart", payload: record })}
        />
      ),
    },
  ];

  useEffect(() => {
    let temp = 0;
    console.log(cartItems);
    cartItems.forEach((item) => {
      temp = temp + item.harga * item.quantity;
    });
    setSubTotal(temp);
    getAllCustomer();
  }, [cartItems]);

  const onFinish = (values) => {
    console.log(values);
    if (values.statusPembayaran === "lunas") {
      values.sisaPembayaran = 0;
      values.uangMuka = 0;
    }
    const reqObject = {
      ...values,
      totalHarga: subTotal,
      cartItems,
      grandTotal: Number(
        subTotal - Number(((subTotal / 100) * diskon).toFixed(2))
      ),
      userId: JSON.parse(localStorage.getItem("gajayana-pos-user"))._id,
    };

    axios
      .post(`${BASE_URL}/api/pemesanan/add-pemesanan`, reqObject)
      .then(() => {
        message.success("Pemesanan Berhasil");
        navigate("/daftarpemesanan");
        dispatch({ type: "clearCart" });
      })
      .catch(() => {
        message.error("Terjadi Kesalahan");
      });
  };
  console.log(subTotal);

  return (
    <div>
      <h3>Pemesanan</h3>
      <Table columns={columns} dataSource={cartItems} bordered pagination={false} rowKey="kodeproduk"/>
      <hr />

      <div className="d-flex justify-content-end flex-column align-items-end">
        <div className="subtotal">
          <h3>
            TOTAL HARGA : <b>Rp {subTotal}</b>
          </h3>
        </div>

        <Button type="primary" onClick={() => setBillChargeModal(true)}>
          SUBMIT PEMESANAN
        </Button>
      </div>

      <Modal
        title="Nota Pemesanan"
        visible={billChargeModal}
        footer={false}
        onCancel={() => setBillChargeModal(false)}
      >
        {" "}
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            initialValue={moment()}
            name="tanggalPemesanan"
            label="Tanggal Pemesanan"
          >
            <DatePicker initialValues={moment()} format={dateFormatList} />
          </Form.Item>
          <Form.Item name="customerId" label="Customer">
            <Select
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {getCustomer.map((v) => (
                <Select.Option value={v._id}>
                  {`${v.namaCustomer} - ${v.noHpCustomer}`}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            initialValue={"Lunas", {sisaPembayaran: 0, uangMuka: 0}}
            name="statusPembayaran"
            label="Pembayaran"
          >
            <Select
              onChange={(value) => {
                if (value === "dp") {
                  setIsDp(true);
                  return;
                }
                setIsDp(false);
                setSisa(0);
                form.setFieldsValue({ sisaPembayaran: 0, uangMuka: 0 });
              }}
            >
              <Select.Option value="lunas">Lunas</Select.Option>
              <Select.Option value="dp">DP</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item hidden={!isDp} name="uangMuka" label="DP" defaultValue>
            <Input onChange={hitungSisa} />
          </Form.Item>
          <Form.Item disabled hidden={!isDp} name="sisaPembayaran" label="Sisa">
            <Input value={sisaPembayaran} />
          </Form.Item>
          <Form.Item initialValue={0} name="diskon" label="Diskon (%)">
            <Input
              onChange={(e) => {
                setDiskon(+e.target.value);
              }}
            />
          </Form.Item>
          <Form.Item name="keterangan" label="Keterangan">
            <Input.TextArea />
          </Form.Item>

          <table>
            <tr>
              <td>Total Harga</td>
              <td> : Rp {subTotal}</td>
            </tr>
            <tr>
              <td>Diskon</td>
              <td> : Rp {(subTotal / 100) * diskon}</td>
            </tr>
            <tr>
              <td>Sisa Pembayaran</td>
              <td> : Rp {sisaPembayaran}</td>
            </tr>
            <tr>
              <td>
                <h5>
                  <b>Grand Total</b>
                </h5>
              </td>
              <td>
                <h5>
                  <b> : Rp {subTotal - (subTotal / 100) * diskon} </b>
                </h5>
              </td>
            </tr>
          </table>

          {/* <div className='sisa-pembayaran'>
            Diskon : Rp {(subTotal / 100) * diskon}
            Sisa Pembayaran : Rp {sisaPembayaran}
          </div> */}

          {/* <div className='charge-bill-amount'>
            <h5>
              Grand Total : <b>Rp {subTotal - (subTotal / 100) * diskon}</b>
            </h5>
          </div> */}

          <div className="d-flex justify-content-end">
            <Button htmlType="submit" type="primary">
              CONFIRM PEMESANAN
            </Button>
          </div>
        </Form>{" "}
      </Modal>
    </div>
  );
}

export default CartPage;
