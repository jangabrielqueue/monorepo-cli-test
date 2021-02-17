import React from 'react'
import { createUseStyles } from 'react-jss'
import classNames from 'classnames/bind'

// styling
const useStyles = createUseStyles({
  progressModalContainer: {
    padding: '20px 24px',
    borderRadius: '15px',
    maxWidth: '498px'
  },
  progressModalBody: {
    padding: [[0], '!important']
  }
})

const ProgressModal = ({ children, open }) => {
  const classes = useStyles()
  const cx = classNames.bind(classes)
  const progressModalStyles = cx({
    modal: true,
    active: open
  })
  const progressModalContainerStyles = cx({
    'modal-container': true,
    progressModalContainer: true
  })
  const progressModalBodyStyles = cx({
    'modal-body': true,
    progressModalBody: open
  })

  return (
    <div className={progressModalStyles}>
      <div className='modal-overlay' />
      <div className={progressModalContainerStyles}>
        <div className={progressModalBodyStyles}>
          {
            children
          }
        </div>
      </div>
    </div>
  )
}

export default ProgressModal
