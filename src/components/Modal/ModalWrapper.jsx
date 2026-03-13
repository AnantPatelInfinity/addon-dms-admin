// components/ModalWrapper.js
import { Modal, Button } from "react-bootstrap";

const ModalWrapper = ({ title, children, isShown, hide, footer, size = "" }) => {
    return (
        <Modal
            show={isShown}
            onHide={hide}
            centered
            backdrop="static"
            size={size}
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>

            <Modal.Body>{children}</Modal.Body>

            {footer !== false && (
                <Modal.Footer>
                    <Button className="btn btn-soft-dark border-0" onClick={hide}>
                        Close
                    </Button>
                </Modal.Footer>
            )}
        </Modal>
    );
};

export default ModalWrapper;
