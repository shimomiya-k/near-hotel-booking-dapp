import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";

import PropTypes from "prop-types";
import { Wallet } from "../../near-wallet";
import { Contract } from "../../near-interface";

const GuestBookedList = ({ isSignedIn, wallet, contract }) => {
  // 予約した部屋のデータを設定する
  const [guestBookedRooms, setGuestBookedRooms] = useState([]);

  const getGuestBookedRooms = async () => {
    try {
      setGuestBookedRooms(
        await contract.get_booking_info_for_guest(wallet.accountId)
      );
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    getGuestBookedRooms();
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
  // // 予約したデータをテーブルで表示
  return (
    <>
      <h2>BOOKED LIST</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th scope="col">Owner</th>
            <th scope="col">Room Name</th>
            <th scope="col">Check In</th>
          </tr>
        </thead>
        {guestBookedRooms.map((_room) => (
          <tbody key={_room.room_id}>
            <tr>
              <td>{_room.owner_id}</td>
              <td>{_room.name}</td>
              <td>{_room.check_in_date}</td>
            </tr>
          </tbody>
        ))}
      </Table>
    </>
  );
};

GuestBookedList.propTypes = {
  isSignedIn: PropTypes.bool,
  wallet: PropTypes.instanceOf(Wallet),
  contract: PropTypes.instanceOf(Contract),
};

export default GuestBookedList;
