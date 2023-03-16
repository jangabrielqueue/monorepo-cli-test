import 'url-search-params-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import QueryParamsContext from './contexts/QueryParamsContext'
import FirebaseContext from './contexts/FirebaseContext'

ReactDOM.render(
  <FirebaseContext>
    <QueryParamsContext>
      <App />
    </QueryParamsContext>
  </FirebaseContext>
  ,
  document.getElementById('root')
)
