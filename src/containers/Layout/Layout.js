import React, { Suspense, lazy, useEffect } from 'react'
import { Switch, Route } from 'react-router-dom'
import * as firebase from 'firebase/app'
import { useQuery } from '../../utils/utils'
import FallbackPage from '../../components/FallbackPage'

const Deposit = lazy(() => import('../Deposit'))
const ScratchCard = lazy(() => import('../ScratchCard/ScratchCard'))
const TopUp = lazy(() => import('../TopUp'))
const InvalidPage = lazy(() => import('../../components/InvalidPage'))
const NotFound = lazy(() => import('../../components/NotFound'))

const Layout = (props) => {
  const analytics = firebase.analytics()
  const queryParams = useQuery()
  analytics.setUserProperties({
    merchant: queryParams.get('m'),
    currency: queryParams.get('c1'),
    requester: queryParams.get('c2'),
    reference: queryParams.get('r')
  })
  analytics.logEvent('page_loaded')

  useEffect(() => {
    const currencies = ['VND', 'THB']

    if (!currencies.includes(queryParams.get('c1'))) {
      props.history.replace('/invalid')
    }
  }, [props.history, queryParams])

  return (
    <Suspense fallback={<FallbackPage />}>
      <Switch>
        <Route exact path='/topup/bank'>
          <TopUp />
        </Route>
        <Route exact path='/deposit/bank'>
          <Deposit />
        </Route>
        <Route exact path='/deposit/scratch-card'>
          <ScratchCard />
        </Route>
        <Route path='/invalid'>
          <InvalidPage />
        </Route>
        <Route path='*'>
          <NotFound />
        </Route>
      </Switch>
    </Suspense>
  )
}

export default Layout
