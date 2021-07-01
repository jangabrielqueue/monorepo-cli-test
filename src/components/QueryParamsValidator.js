import React, { useContext } from 'react'
import { QueryParamsContext } from '../contexts/QueryParamsContext'
import { isValidUrl } from '../utils/validation'

export const QueryParamsValidator = () => {
  const params = useContext(QueryParamsContext)
  if (!isValidUrl(params.successfulUrl) ||
     !isValidUrl(params.failedUrl) ||
     !isValidUrl(params.callbackUri)) {
    throw new Error('Invalid parameters.')
  }
  return <></>
}
