import React from 'react'
import { Modal } from 'antd';

const ConfirmationModal = (
    {
        children,
        visible,
        keyboard = false,
        footer = null,
        closable = false,
        centered = true
    }
) => {
    return (
        <Modal
            visible={visible}
            keyboard={keyboard}
            footer={footer}
            closable={closable}
            centered={centered}
        >
            {
                children
            }
        </Modal>
    )
}

export default ConfirmationModal;
