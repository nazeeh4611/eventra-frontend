// components/ModalPortal.js
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

const ModalPortal = ({ children }) => {
  const [modalRoot, setModalRoot] = useState(null);

  useEffect(() => {
    // Create modal root element if it doesn't exist
    let element = document.getElementById('modal-root');
    if (!element) {
      element = document.createElement('div');
      element.id = 'modal-root';
      document.body.appendChild(element);
    }
    setModalRoot(element);

    return () => {
      // Clean up only if we created it and it's empty
      if (element && element.children.length === 0) {
        element.remove();
      }
    };
  }, []);

  if (!modalRoot) return null;
  return ReactDOM.createPortal(children, modalRoot);
};

export default ModalPortal;