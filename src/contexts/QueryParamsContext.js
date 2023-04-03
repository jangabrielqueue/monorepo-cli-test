import React, { useLayoutEffect, useState } from 'react'

export const QueryParamsContext = React.createContext({})
export const QueryParamsSetterContext = React.createContext(() => {})
function QueryParamsProvider ({ children }) {
  const queryString = window.location.search
  const getParams = (queryString) => {
    const urlQueryString = new URLSearchParams(queryString)
    return {
      bank: urlQueryString.get('b'),
      merchant: urlQueryString.get('m'),
      currency: urlQueryString.get('c1'),
      requester: urlQueryString.get('c2'),
      clientIp: urlQueryString.get('c3'),
      callbackUri: urlQueryString.get('c4'),
      amount: urlQueryString.get('a'),
      reference: urlQueryString.get('r'),
      dateTime: urlQueryString.get('d'),
      signature: urlQueryString.get('k'),
      successfulUrl: urlQueryString.get('su'),
      failedUrl: urlQueryString.get('fu'),
      note: urlQueryString.get('n'),
      key: urlQueryString.get('k'),
      customer: urlQueryString.get('c2'),
      datetime: urlQueryString.get('d'),
      language: urlQueryString.get('l'),
      paymentChannel: urlQueryString.get('p2'),
      paymentChannelType: urlQueryString.get('p3'),
      methodType: parseInt(urlQueryString.get('mt')),
      exchangeRate: parseInt(urlQueryString.get('er')),
      exchangeCurrency: urlQueryString.get('ec'),
      exchangeAmount: parseInt(urlQueryString.get('ea'))
    }
  }
  const [queryParams, setQueryParams] = useState(getParams(queryString))
  // for bugfix: when user click back or forward button queryparams doesnt rerenders
  useLayoutEffect(() => {
    const popstateEvent = window.addEventListener('popstate', () => {
      const queryString = window.location.search
      setQueryParams(getParams(queryString))
    })
    return () => {
      window.removeEventListener('popstate', popstateEvent)
    }
  }, [])
  return (
    <QueryParamsSetterContext.Provider value={(queryString) => { setQueryParams(getParams(queryString)) }}>
      <QueryParamsContext.Provider value={queryParams}>
        {
          children
        }
      </QueryParamsContext.Provider>
    </QueryParamsSetterContext.Provider>
  )
}

export default QueryParamsProvider
