import React, { Suspense, lazy } from "react";
import { Switch, Route } from "react-router-dom";
import * as firebase from "firebase/app";
import "./styles.scss";
import { useQuery } from "../../utils/utils";
import FallbackPage from '../../components/FallbackPage';

const Deposit = lazy(() => import('../Deposit'));
const ScratchCard = lazy(() => import('../ScratchCard/ScratchCard'));
const TopUp = lazy(() => import('../TopUp'));
const InvalidPage = lazy(() => import('../../components/InvalidPage'));
const NotFound = lazy(() => import('../../components/NotFound'));
const Logo = lazy(() => import('../../components/Logo'));

const Layout = () => {
  const queryParams = useQuery();
  const bank = queryParams.get("b");
  const analytics = firebase.analytics();
  analytics.setUserProperties({
    merchant: queryParams.get("m"),
    currency: queryParams.get("c1"),
    requester: queryParams.get("c2"),
    reference: queryParams.get("r"),
  });
  analytics.logEvent("page_loaded");
  return (
    <div className="main">
      <div className="logo-container">
        <Suspense fallback={
          <>
            <div
              style={{
                margin: "auto",
                width: "140px",
                textAlign: "right",
              }}
            >
              <img alt="poweredBy" className="poweredby" src="/banks/PoweredBy.svg" />
            </div>
            <img alt='GameWallet' src='/banks/GW_LOGO.png' />
          </>
        }>
          <Logo bank={bank} />
        </Suspense>
      </div>
      <Suspense fallback={<FallbackPage />}>
        <Switch>
          <Route exact path="/topup/bank" component={TopUp} />
          <Route exact path="/deposit/bank" component={Deposit} />
          <Route exact path="/deposit/scratch-card" component={ScratchCard} />
          <Route path="/invalid" component={InvalidPage} />
          <Route path="*" component={NotFound} />
        </Switch>
      </Suspense>
    </div>
  );
};

export default Layout;
