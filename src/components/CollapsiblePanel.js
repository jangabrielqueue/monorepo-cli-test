import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'

// styling
const useStyles = createUseStyles({
  collapsiblePanelHeader: {
    cursor: 'pointer',
    fontFamily: 'ProductSansMedium',
    fontSize: '14px',
    height: '31px',

    '&:hover': {
      opacity: 0.7
    },

    '&:before': {
      background: (props) => {
        if (props.toggleCollapse) {
          return 'url(/icons/down-expand.png) no-repeat center'
        } else {
          return 'url(/icons/right-expand.png) no-repeat center'
        }
      },
      content: '""',
      display: 'block',
      float: 'left',
      height: '20px',
      marginRight: '15px',
      width: '20px'
    }
  },

  collapsiblePanelContent: {
    fontSize: '12px',
    overflowY: 'hidden',
    maxHeight: (props) => props.toggleCollapse ? props.topup ? '100px' : '155px' : '0',
    transitionProperty: 'all',
    transitionDuration: '.5s',
    transitionTimingFunction: 'cubic-bezier(0, 1, 0.5, 1)'
  }
})

const CollapsiblePanel = ({ children, title, topup }) => {
  const [toggleCollapse, setToggleCollapse] = useState(false)
  const classes = useStyles({ toggleCollapse, topup })

  function handleToggleCollapse () {
    setToggleCollapse(prevState => !prevState)
  }

  return (
    <section>
      <div className={classes.collapsiblePanelHeader} onClick={handleToggleCollapse}>
        {
          title
        }
      </div>
      <div className={classes.collapsiblePanelContent}>
        {
          children
        }
      </div>
    </section>
  )
}

export default CollapsiblePanel
