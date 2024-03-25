import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';

const calculateModalPosition = () => {
  const windowHeight = window.innerHeight;
  const modalHeight = 300; // Adjust as per your modal's height
  const top = (windowHeight - modalHeight) / 2;
  return top > 0 ? top : 0;
};

const swoopIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(100%);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const swoopOut = keyframes`
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(100%);
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  
  background-color: rgba(0, 0, 0, 0.5); /* Adjust opacity as needed */
  z-index: 999; /* Ensure the overlay is above everything else */
`;

const ModalWrapper = styled.div`
  position: absolute;
  bottom: ${({ isOpen }) => (isOpen ? 'auto' : '0')};
  top: ${({ isOpen }) => (isOpen ? `${calculateModalPosition()}px` : '100%')};
  left: 50vh;
  border-radius: 10px;
  right: 0;
  background: white;
  width: 280px;
  padding: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  animation: ${({ isOpen }) =>
    isOpen
      ? css`
          ${swoopIn} 0.3s ease-in-out forwards
        `
      : css`
          ${swoopOut} 0.3s ease-in-out forwards
        `};
  z-index: 1000; /* Ensure the modal is above the overlay */
`;

const Modal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      // Recalculate modal position on window resize
      setIsOpen(false); // Close modal first to trigger animation
      setTimeout(() => setIsOpen(true), 0); // Reopen modal after animation
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <button onClick={openModal}>Open Modal</button>
      {isOpen && (
        <>
          <Overlay onClick={closeModal} />
          <ModalWrapper isOpen={isOpen}>
            <h2>Modal Content</h2>
            <p>This is the content of the modal.</p>
            <button onClick={closeModal}>Close Modal</button>
          </ModalWrapper>
        </>
      )}
    </div>
  );
};

export default Modal;
