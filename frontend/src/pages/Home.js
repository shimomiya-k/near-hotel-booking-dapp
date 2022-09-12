import React from "react";
import FormDate from "../components/FormDate";

import PropTypes from "prop-types";
import { Wallet } from "../../near-wallet";
import { Contract } from "../../near-interface";

const Home = ({ isSignedIn, wallet, contract }) => {
  return (
    <>
      <div className="text-center" style={{ margin: "200px" }}>
        <h1>Welcome.</h1>
        <h1>Select your stay dates and find a hotel!</h1>
        <FormDate />
      </div>
      <div className="text-center">
        <p>
          Owners who wish to list their rooms should connect to the NEAR Wallet.
        </p>
      </div>
    </>
  );
};

Home.propTypes = {
  isSignedIn: PropTypes.bool,
  wallet: PropTypes.instanceOf(Wallet),
  contract: PropTypes.instanceOf(Contract),
};

export default Home;
