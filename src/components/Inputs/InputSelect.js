import ReactDOM from 'react-dom'
import React from 'react'
import { createUseStyles } from 'react-jss'
import usePopper from '../../hooks/usePopper'
const useStyles = createUseStyles({
  inputContainer: {
    width: '100%',
    minHeight: 38,
    border: '1px solid #e3e3e3',
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    cursor: 'pointer',
    '& p': {
      margin: 0
    }
  },
  arrow: {
    position: 'relative',
    fontSize: 20,
    '& p': {
      position: 'absolute',
      top: ({ open }) => open ? -19 : -4,
      right: 0
    }
  },
  panelContainer: {
    maxHeight: 400,
    border: '1px solid #e3e3e3',
    borderRadius: 10,
    width: ({ ref }) => ref?.clientWidth || '100%',
    padding: 5,
    zIndex: 3,
    backgroundColor: 'white',
    overflow: 'auto'
  },
  backDrop: {
    width: '100vw',
    height: '100vh',
    position: 'fixed',
    zIndex:2
  },
  options: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,0.1)' 
    }
  }
})

// Options = { label: string, value: string | number }, renderOptions: (option: Options) => JSX.Element
const InputSelect = ({ label, options = [], renderOptions, onChange, value, placeholder = 'Select ' }) => {
  const { onOpen, ref, setRef, panelRef, panelAttributes, open } = usePopper()
  const classes = useStyles({ open, ref })

  const handleOptionClick = (value) => {
    onOpen()
    onChange(value)
  }
  return (
    <>
      <label>{label}</label>
      <div className={classes.inputContainer} ref={setRef} onClick={onOpen}>
        <p>{options.find(option => option.value === value)?.label ?? placeholder}</p>
        <div className={classes.arrow}>
          <p>{open ? <>&#129169;</> : <>&#129171;</>}</p>
        </div>
      </div>
      {
        open && (
          <>
            {
              ReactDOM.createPortal(
                <div className={classes.backDrop} onClick={onOpen} />,
                document.getElementById('backdrop')
              )
            }
            <div ref={panelRef} {...panelAttributes} className={classes.panelContainer}>
              {
                options.map((option, idx) => (
                  <div className={classes.options} key={idx} onClick={() => handleOptionClick(option.value)}>
                    {renderOptions != null ? renderOptions(option) : option.label}
                  </div>
                ))
              }
            </div>
          </>
        )
      }
    </>
  )
}

export default InputSelect
