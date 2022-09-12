import PropTypes from "prop-types";
import "regenerator-runtime/runtime";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./src/pages/Home";
import Search from "./src/pages/Search";
import GuestBookedList from "./src/pages/GuestBookedList";
import ManageRooms from "./src/pages/ManageRooms";
import ManageBookings from "./src/pages/ManageBookings";
import Upload from "./src/pages/Upload";

import NavBar from "./src/components/NavBar";
import "./assets/global.css";
import { Wallet } from "./near-wallet";
import { Contract } from "./near-interface";

const App = ({ isSignedIn, contract, wallet }) => {
  return (
    <BrowserRouter>
      <NavBar isSignedIn={isSignedIn} contract={contract} wallet={wallet} />
      <Routes>
        <Route
          path="/"
          element={
            <Home isSignedIn={isSignedIn} contract={contract} wallet={wallet} />
          }
        />
        <Route
          path="/search/:date"
          element={
            <Search
              isSignedIn={isSignedIn}
              contract={contract}
              wallet={wallet}
            />
          }
        />
        <Route
          path="/booked-list"
          element={
            <GuestBookedList
              isSignedIn={isSignedIn}
              contract={contract}
              wallet={wallet}
            />
          }
        />
        <Route
          path="/manage-rooms"
          element={
            <ManageRooms
              isSignedIn={isSignedIn}
              contract={contract}
              wallet={wallet}
            />
          }
        />
        <Route
          path="/manage-bookings"
          element={
            <ManageBookings
              isSignedIn={isSignedIn}
              contract={contract}
              wallet={wallet}
            />
          }
        />
        <Route path="/upload" element={<Upload />} />
      </Routes>
    </BrowserRouter>
  );
};

App.propTypes = {
  isSignedIn: PropTypes.bool,
  wallet: PropTypes.instanceOf(Wallet),
  contract: PropTypes.instanceOf(Contract),
};

export default App;
