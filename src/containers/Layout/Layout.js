import React from 'react';
import { Switch, Route } from 'react-router-dom';
import * as firebase from 'firebase/app';
import { useQuery } from "../../utils/utils";
import Deposit from '../Deposit';
import ScratchCard from '../ScratchCard/ScratchCard';
import TopUp from '../TopUp';
import InvalidPage from '../../components/InvalidPage';
import NotFound from '../../components/NotFound';

const Layout = (props) => {
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
    <Switch>
      <Route exact path='/topup/bank' component={TopUp} />
      <Route exact path='/deposit/bank' component={Deposit} />
      <Route exact path='/deposit/scratch-card' component={ScratchCard} />
      <Route path='/invalid' component={InvalidPage} />
      <Route path='*' component={NotFound} />
    </Switch>
  );
};

export default Layout;
