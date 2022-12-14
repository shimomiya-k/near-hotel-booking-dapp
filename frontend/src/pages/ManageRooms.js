import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";

import AddRoom from "../components/AddRoom";

import PropTypes from "prop-types";
import { Wallet } from "../../near-wallet";
import { Contract } from "../../near-interface";
import { formatNearAmount } from "near-api-js/lib/utils/format";

const ManageRooms = ({ isSignedIn, wallet, contract }) => {
  const [registeredRooms, setRegisteredRooms] = useState([]);

  // オーナーが登録した部屋のデータを取得
  const getRooms = async () => {
    try {
      setRegisteredRooms(
        await contract.get_rooms_registered_by_owner(wallet.accountId)
      );
    } catch (error) {
      console.log({ error });
    }
  };

  const addRoom = async (data) => {
    // 同じ名前の部屋を登録しないかチェック
    let exist = await contract.exists(wallet.accountId, data.name);
    if (exist == true) {
      alert("Error: " + data.name + " is already registered.");
      return;
    }
    await contract.add_room_to_owner(data);
    getRooms();
  };

  useEffect(() => {
    getRooms();
  }, []);

  // NEAR Walletに接続されていない時
  if (!isSignedIn) {
    return (
      <>
        <h2>Please connect NEAR wallet.</h2>
      </>
    );
  }
  // NEAR Walletに接続されている時
  // // 登録した部屋を表示
  return (
    <>
      <Row>
        <Col>
          <h2>ROOM LIST</h2>
        </Col>
        <Col xs={1} style={{ marginTop: "5px" }}>
          <div>
            <AddRoom save={addRoom} />
          </div>
        </Col>
      </Row>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th scope="col">Room Name</th>
            <th scope="col">Image</th>
            <th scope="col">Beds</th>
            <th scope="col">Description</th>
            <th scope="col">Location</th>
            <th scope="col">Price per night</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        {registeredRooms.map((_room) => (
          <tbody key={`${_room.name}`}>
            {/* 部屋が空室の時 */}
            {_room.status === "Available" && (
              <tr>
                <td>{_room.name}</td>
                <td>
                  <img src={_room.image} width="100" />
                </td>
                <td>{_room.beds}</td>
                <td>{_room.description}</td>
                <td>{_room.location}</td>
                <td>{formatNearAmount(_room.price)} NEAR</td>
                <td>{_room.status}</td>
              </tr>
            )}
            {/* 部屋が滞在中の時、背景を赤で表示 */}
            {_room.status !== "Available" && (
              <tr style={{ backgroundColor: "#FFC0CB" }}>
                <td>{_room.name}</td>
                <td>
                  <img src={_room.image} width="100" />
                </td>
                <td>{_room.beds}</td>
                <td>{_room.description}</td>
                <td>{_room.location}</td>
                <td>{formatNearAmount(_room.price)} NEAR</td>
                <td>Stay</td>
              </tr>
            )}
          </tbody>
        ))}
      </Table>
    </>
  );
};

ManageRooms.propTypes = {
  isSignedIn: PropTypes.bool,
  wallet: PropTypes.instanceOf(Wallet),
  contract: PropTypes.instanceOf(Contract),
};

export default ManageRooms;
