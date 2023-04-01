import { useState, useEffect } from 'react'
import { usePopper as usePopperJS } from 'react-popper'

const usePopper = () => {
  const [open, setOpen] = useState(false)
  const [buttonElement, setButtonElement] = useState(null)
  const [panelElement, setPanelElement] = useState(null)
  const { styles, attributes, update } = usePopperJS(
    buttonElement,
    panelElement,
  )
  useEffect(() => {
    if (!update) {
      return
    }

    if (open) {
      update()
    }
  }, [update, open])

  const handleOpen = () => {
    setOpen(prev => !prev)
  }

  return {
    open,
    onOpen: handleOpen,
    setRef: setButtonElement,
    panelRef: setPanelElement,
    ref: buttonElement,
    panelAttributes: {
      style: styles.popper,
      ...attributes.popper
    }
  }
};

export default usePopper
