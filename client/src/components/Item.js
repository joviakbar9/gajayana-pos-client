import { Button } from 'antd'
import React from 'react'
import { useDispatch } from 'react-redux'

function Item({item}) {
  const dispatch = useDispatch()
  function addTocart(){
      dispatch({type:'addToCart' , payload : {...item , quantity:1}})
  }
  return (
    <div className='item'>
        <h4 className='kodeproduk'>{item.kodeproduk}</h4>
        <h4 className='namaproduk'>{item.nama}</h4>
        <h4 className='harga'><b>Harga : </b>Rp {item.harga}</h4>
        <div className="d-flex justify-content-end">
            <Button onClick={()=>addTocart()}>Tambah</Button>
        </div>
    </div>
  )
}

export default Item