import React from 'react'
import { createUseStyles } from 'react-jss'
import classNames from 'classnames/bind'

// styling
const useStyles = createUseStyles({
  progressModalStyles: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(247,248,249,.75)'
  },
  progressModalContainer: {
    padding: '20px 24px',
    borderRadius: '15px',
    maxWidth: '498px',
    backgroundColor: 'white',
    boxShadow: '0 0.2rem 0.5rem rgb(48 55 66 / 30%)'
  },
  progressModalBody: {
    padding: [[0], '!important']
  }
})

const ProgressModal = ({ children, open }) => {
  const classes = useStyles()
  const cx = classNames.bind(classes)
  const progressModalStyles = cx({
    progressModalStyles: true
  })
  const progressModalContainerStyles = cx({
    progressModalContainer: true
  })
  const progressModalBodyStyles = cx({
    progressModalBody: true
  })

  return (
    <>
      {
        open &&
          <div className={progressModalStyles}>
            <div className={progressModalContainerStyles}>
              <div className={progressModalBodyStyles}>
                {
                  children
                }
              </div>
            </div>
          </div>
      }
    </>
  )
}

export default ProgressModal
