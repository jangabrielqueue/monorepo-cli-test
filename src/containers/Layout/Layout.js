import React from "react";
import { Switch, Route } from "react-router-dom";
import ScratchCard from "../ScratchCard/ScratchCard";
import TopUp from "../TopUp";
import Deposit from "../Deposit";
import "./styles.scss";
import InvalidPage from "../../components/InvalidPage";
import NotFound from "../../components/NotFound";
import Logo from "../../components/Logo";
import { useQuery } from "../../utils/utils";

const Layout = () => {
  const queryParams = useQuery();
  const bank = queryParams.get("bank");
  return (
    <div className="main">
      <div className="logo-container">
        {/* <h1>GAME <span>WALLET</span></h1> */}
        <Logo bank={bank} />
      </div>
      <Switch>
        <Route exact path="/topup/bank" component={TopUp} />
        <Route exact path="/deposit/bank" component={Deposit} />
        <Route exact path="/deposit/scratch-card" component={ScratchCard} />
        <Route path="/invalid" component={InvalidPage} />
        <Route path="*" component={NotFound} />
      </Switch>
    </div>
  );
};

export default Layout;
