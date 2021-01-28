import React, { useState } from 'react'

export const QueryParamsContext = React.createContext({})

function QueryParamsProvider ({ children }) {
  const queryString = window.location.search
  const urlQueryString = new URLSearchParams(queryString)
  const [queryParams] = useState({
    bank: urlQueryString.get('b'),
    merchant: urlQueryString.get('m'),
    currency: urlQueryString.get('c1'),
    requester: urlQueryString.get('c2'),
    clientIp: urlQueryString.get('c3'),
    callbackUri: urlQueryString.get('c4'),
    amount: urlQueryString.get('a'),
    reference: urlQueryString.get('r'),
    datetime: urlQueryString.get('d'),
    signature: urlQueryString.get('k'),
    successfulUrl: urlQueryString.get('su'),
    failedUrl: urlQueryString.get('fu'),
    note: urlQueryString.get('n')
  })

  return (
    <QueryParamsContext.Provider value={queryParams}>
      {
        children
      }
    </QueryParamsContext.Provider>
  )
}

export default QueryParamsProvider
