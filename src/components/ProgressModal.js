import React from 'react'
import { SimpleDialog } from '@rmwc/dialog'

const ProgressModal = ({ children, open }) => {
  return (
    <SimpleDialog
      renderToPortal
      open={open}
      children={children}
      preventOutsideDismiss
      acceptLabel={null}
      cancelLabel={null}
    />
  )
}

export default ProgressModal
