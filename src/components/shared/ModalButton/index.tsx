// libraries
import type { FC, ReactNode } from 'react';
import { useCallback, useState } from 'react';
// components
import { Button, Overlay2, OverlaysProvider } from '@blueprintjs/core';

interface ModalButtonProps {
  children?: (close: () => void) => ReactNode;
  buttonText: string;
}

const ModalButton: FC<ModalButtonProps> = (props) => {
  const { buttonText, children } = props;
  const [isOpen, setIsOpen] = useState(false);
  const toggleOverlay = useCallback(() => setIsOpen((open) => !open), [setIsOpen]);
  const close = () => setIsOpen(false);

  return (
    <OverlaysProvider>
      <div>
        <Button className="modal-button" onClick={toggleOverlay} text={buttonText} />
        <Overlay2 isOpen={isOpen} onClose={toggleOverlay}>
          <div className="overlay-body">
            <div className="overlay-body-content">
              {children(close)}
            </div>
          </div>
        </Overlay2>
      </div>
    </OverlaysProvider>
  );
};

export default ModalButton;
