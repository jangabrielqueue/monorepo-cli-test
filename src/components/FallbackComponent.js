import React from 'react'

import { Card } from './Card'

export const FallbackComponent = ({ error }) => {
  let message = error.toString()
  if (error instanceof Error) {
    message = error.message
  }
  return (
    <Card>
      <p>
        <strong>Oops! An error occured!</strong>
      </p>
      <p>Please contact customer service</p>
      <strong>Error:</strong>
      <p>
        {message}
      </p>
    </Card>
  )
}
