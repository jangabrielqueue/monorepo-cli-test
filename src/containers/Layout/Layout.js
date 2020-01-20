import React from 'react';
import {
    Switch,
    Route
  } from 'react-router-dom';
import ScratchCard from '../ScratchCard/ScratchCard';
import TopUp from '../TopUp';
import Deposit from '../Deposit';
import './styles.scss';
import InvalidPage from '../../components/InvalidPage';
import NotFound from '../../components/NotFound';

const Layout = () => {
    return (
        <div className="main">
            <div className='logo-container'>
                <h1>GAME <span>WALLET</span></h1>
            </div>
            <Switch>
                <Route exact path='/topup/bank' component={TopUp} />
                <Route exact path='/deposit/bank' component={Deposit} />
                <Route exact path='/deposit/scratch-card' component={ScratchCard} />
                <Route path='/invalid' component={InvalidPage} />
                <Route path='*' component={NotFound} />
            </Switch>
        </div>
    )
}

export default Layout;
