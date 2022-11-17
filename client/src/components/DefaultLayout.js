import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UsergroupAddOutlined,
  FileAddOutlined,
  DatabaseOutlined,
  CopyOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
  FormOutlined,
  UserSwitchOutlined,
  UserOutlined,
  LoginOutlined,
  ShoppingCartOutlined,
  BookOutlined,
} from "@ant-design/icons";
import "../resources/layout.css";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const { Header, Sider, Footer } = Layout;

const DefaultLayout = (props) => {
  const [collapsed, setCollapsed] = useState(false);
  const { cartItems, loading } = useSelector((state) => state.rootReducer);
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const toggle = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    const authData = JSON.parse(localStorage.getItem("gajayana-pos-user"));
    setRole(authData.role);
  }, [cartItems]);

  return (
    <Layout>
      {loading && (
        <div className="spinner">
          <div className="spinner-border" role="status"></div>
        </div>
      )}
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo">
          <h3>{collapsed ? "GDP" : "Gajayana Digital Printing"}</h3>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={window.location.pathname}
        >
          <Menu.Item
            hidden={role === "kasir"}
            key="/order"
            icon={<FileAddOutlined />}
          >
            <Link to="/order">Order</Link>
          </Menu.Item>

          <Menu.SubMenu
            hidden={role === "kasir"}
            key={1}
            title="Master Data"
            icon={<DatabaseOutlined />}
          >
            <Menu.Item key="/produk" icon={<UnorderedListOutlined />}>
              <Link to="/produk">Produk</Link>
            </Menu.Item>
            <Menu.Item key="/kategoriproduk" icon={<AppstoreOutlined />}>
              <Link to="/kategoriproduk">Kategori</Link>
            </Menu.Item>
            <Menu.Item key="/customers" icon={<UsergroupAddOutlined />}>
              <Link to="/customers">Customer</Link>
            </Menu.Item>
            <Menu.Item key="/pegawai" icon={<UserSwitchOutlined />}>
              <Link to="/pegawai">Pegawai</Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.Item key="/daftarpemesanan" icon={<CopyOutlined />}>
            <Link to="/daftarpemesanan">Daftar Pemesanan</Link>
          </Menu.Item>

          <Menu.Item
            hidden={role === "kasir"}
            key="/pembelian"
            icon={<FormOutlined />}
          >
            <Link to="/pembelian">Pembelian</Link>
          </Menu.Item>

          <Menu.SubMenu
            hidden={role === "admin"}
            key={2}
            title="Laporan"
            icon={<BookOutlined />}
          >
            <Menu.Item key="/laporanpenjualan">
              <Link to="/laporanpenjualan">Laporan Penjualan</Link>
            </Menu.Item>
            <Menu.Item key="/laporanpembelian">
              <Link to="/laporanpembelian">Laporan Pembelian</Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.Item
            hidden={role === "kasir" || role === "admin"}
            key="/user"
            icon={<UserOutlined />}
          >
            <Link to="/user">User</Link>
          </Menu.Item>
          <Menu.Item
            key="/logout"
            icon={<LoginOutlined />}
            onClick={() => {
              localStorage.removeItem("gajayana-pos-user");
              navigate("/login");
            }}
          >
            Logout
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 10 }}>
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: toggle,
            }
          )}
          <div
            className="cart-count d-flex align-items-center"
            onClick={() => navigate("/pemesanan")}
          >
            <b>
              {" "}
              <p className="mt-3 mr-2">{cartItems.length}</p>
            </b>
            <ShoppingCartOutlined />
          </div>

          {/* <div className='akun-dropdown d-flex'>
            <Dropdown overlay={menu} trigger={['click']}>
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  (Tipe Akun)
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          </div> */}
        </Header>
        <main
          className="site-layout-background"
          style={{
            margin: "10px",
            padding: 24,
            minHeight: "80vh",
          }}
        >
          {props.children}
        </main>
        <Footer style={{ textAlign: "center" }}>
          Gajayana Digital Printing Malang ©2022
        </Footer>
      </Layout>
    </Layout>
  );
};

export default DefaultLayout;
