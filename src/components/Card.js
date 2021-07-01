import React from 'react'

export const Card = ({ children }) => {
  return (
    <div style={{
      margin: '0 20px',
      maxWidth: '500px',
      width: '100%',
      background: '#FFFFFF',
      borderRadius: '15px',
      boxShadow: '0px 5px 10px 0px rgba(112,112,112,0.3)',
      padding: '20px'
    }}
    >
      {children}
    </div>
  )
}
