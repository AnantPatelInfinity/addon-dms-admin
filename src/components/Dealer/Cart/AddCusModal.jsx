  import React from 'react'
  import ModalWrapper from '../../Modal/ModalWrapper'
  import CustomerForm from './CustomerForm'

  const AddCusModal = ({ modal }) => {

    return (
      <ModalWrapper
        title="Customer Details"
        isShown={modal.isShown}
        hide={modal.hide}
        size={"xl"}
        footer={false}
      >

        <CustomerForm closeModal={modal.hide} />
      </ModalWrapper>
    )
  }

  export default AddCusModal