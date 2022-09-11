import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

const NavBar = ({ isSignedIn, contract, wallet }) => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState("0");

  // ログインしたアカウントのNEAR残高を取得
  const getBalance = async () => {
    if (isSignedIn) {
      setBalance(await wallet.accountBalance());
    }
  };

  useEffect(() => {
    getBalance();
  });

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="/">HOTEL BOOKING</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto"></Nav>
          <Nav>
            {/* NEAR Walletに接続されていない時 */}
            {!isSignedIn && (
              <Button onClick={() => wallet.signIn()} variant="outline-light">
                Connect Wallet
              </Button>
            )}
            {/* NEAR Walletに接続されている時 */}
            {isSignedIn && (
              <>
                {/* 残高を表示 */}
                <NavDropdown
                  title={`${balance} NEAR`}
                  id="collasible-nav-dropdown"
                >
                  {/* NEAR testnet アカウントページへのリンク */}
                  <NavDropdown.Item
                    href={`https://explorer.testnet.near.org/accounts/${window.accountId}`}
                  >
                    {window.accountId}
                  </NavDropdown.Item>
                  {/* 予約一覧の画面へ遷移 */}
                  <NavDropdown.Item onClick={() => navigate(`/booked-list`)}>
                    Booked List
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={() => wallet.signOut()}>
                    Disconnect
                  </NavDropdown.Item>
                </NavDropdown>

                {/* ホテルのオーナー向けのメニューを表示 */}
                <NavDropdown
                  title="For hotel owners"
                  id="collasible-nav-dropdown"
                >
                  {/* 部屋を管理する画面へ遷移 */}
                  <NavDropdown.Item onClick={() => navigate(`/manage-rooms`)}>
                    Manage Rooms
                  </NavDropdown.Item>
                  {/* 予約を管理する画面へ遷移 */}
                  <NavDropdown.Item
                    onClick={() => navigate(`/manage-bookings`)}
                  >
                    Manage Bookings
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  {/* HOMEへのリンク */}
                  <NavDropdown.Item href="/">Home</NavDropdown.Item>
                </NavDropdown>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
