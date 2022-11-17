import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table } from 'antd';
import '../resources/items.css';
import { useDispatch } from 'react-redux';
import { Button, Modal } from 'antd';
import { BASE_URL } from '../constant/axios';
import * as XLSX from "xlsx";

function LaporanPembelian() {
  const [itemsData, setItemsData] = useState([]);
  const [page, setPage] = React.useState(1);
  const dispatch = useDispatch();

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(itemsData.map(v=>{
      v["Tanggal Pembelian"] = v._id
      v["Total Pembelian"] = v.totalPembelian
      delete v._id
      delete v.totalPembelian
      return v
    }));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
    XLSX.writeFile(workbook, "Laporan Pembelian.xlsx");
  };

  const getAllPembelian = () => {
    dispatch({ type: 'showLoading' });
    axios
      .get(`${BASE_URL}/api/laporanPembelian/get-total-pembelian`)
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
      title: 'No.',
      key: 'index',
      render: (text, record, index) => (page - 1) * 10 + (index + 1),
    },
    {
      title: 'Tanggal Pembelian',
      dataIndex: '_id',
      sorter: (a, b) => a._id.localeCompare(b._id),
    },
    {
      title: 'Total Pembelian',
      dataIndex: 'totalPembelian',
    },
  ];

  useEffect(() => {
    getAllPembelian();
  }, []);

  return (
    <div>
      <div className='d-flex justify-content-between'>
        <h3>Laporan Pembelian</h3>
        <Button type='primary' onClick={() => downloadExcel()}>
          Export ke Excel
        </Button>
      </div>
      <Table 
        columns={columns} 
        dataSource={itemsData} 
        bordered rowKey='_id' 
        pagination={{
          onChange(current) {
            setPage(current);
          }
        }}/>
    </div>
  );
}

export default LaporanPembelian;
