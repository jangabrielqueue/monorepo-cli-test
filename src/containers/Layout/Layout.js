import React, { Suspense, lazy } from 'react';
import { Switch, Route } from 'react-router-dom';
import * as firebase from 'firebase/app';
import FallbackPage from '../../components/FallbackPage';
import { useQuery } from "../../utils/utils";

const Deposit = lazy(() => import('../Deposit'));
const ScratchCard = lazy(() => import('../ScratchCard/ScratchCard'));
const TopUp = lazy(() => import('../TopUp'));
const InvalidPage = lazy(() => import('../../components/InvalidPage'));
const NotFound = lazy(() => import('../../components/NotFound'));

const Layout = () => {
  const analytics = firebase.analytics();
  const queryParams = useQuery();
  analytics.setUserProperties({
    merchant: queryParams.get('m'),
    currency: queryParams.get('c1'),
    requester: queryParams.get('c2'),
    reference: queryParams.get('r'),
  });
  analytics.logEvent('page_loaded');

  return (
    <>
      <Suspense fallback={<FallbackPage />}>
        <Switch>
          <Route exact path='/topup/bank' component={TopUp} />
          <Route exact path='/deposit/bank' component={Deposit} />
          <Route exact path='/deposit/scratch-card' component={ScratchCard} />
          <Route path='/invalid' component={InvalidPage} />
          <Route path='*' component={NotFound} />
        </Switch>
      </Suspense>
    </>
  );
};

export default Layout;
