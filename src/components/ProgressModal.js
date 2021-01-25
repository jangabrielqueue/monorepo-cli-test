import React from 'react'
import { SimpleDialog } from '@rmwc/dialog'
import styled from 'styled-components'
import '@material/dialog/dist/mdc.dialog.css'
import '@rmwc/icon/icon.css'
import '@material/ripple/dist/mdc.ripple.css'

const StyledSimpleDialog = styled(SimpleDialog)`
  && {
    & .mdc-dialog__surface {
      border-radius: 15px;
    }

    @media (max-width: 37em) {
      & .mdc-dialog .mdc-dialog__surface {
        max-width: calc(100vw - 41px);
      }
    }
  }
`

const ProgressModal = ({ children, open }) => {
  return (
    <StyledSimpleDialog
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
