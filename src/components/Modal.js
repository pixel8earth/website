import React from 'react';
import {
  MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBIcon
} from 'mdbreact';

import Spinner from './Spinner';
import mainStyles from '../styles';


export default function Modal(props) {
  const {
    id, isOpen, toggle, size, headerContent, bodyContent, hideCancel, hideFooter,
    cancelAction, submitColor, submitAction, submitText, submitDisabled, submitClassName,
    submitIcon, cancelColor, cancelHoverColor, submitStyle, cancelStyle = {}, submitSpinner,
    contentClassName = '', backdropClassName,
    ...rest
  } = props;

  return (
    <MDBModal
      id={id || undefined}
      isOpen={isOpen}
      toggle={toggle}
      size={size || 'md'}
      style={{ fontFamily: mainStyles.font }}
      backdropClassName={backdropClassName}
      contentClassName={contentClassName + ' modalWidthP8 borderRadiusP8'}
      { ...rest }
    >
      <MDBModalHeader toggle={toggle} className="modalHeaderP8" titleClass="modalTitleP8" tag="div">
        {headerContent}
      </MDBModalHeader>
      { bodyContent &&
        <MDBModalBody>
          <div style={{ fontWeight: '400', color: mainStyles.colors.primary, fontFamily: mainStyles.font }}>
            {bodyContent}
          </div>
        </MDBModalBody>
      }
      {!hideFooter &&
        <MDBModalFooter style={{ border: 'none' }}>
          {!hideCancel &&
            <MDBBtn
              className="btnP8Outline"
              style={{ ...cancelStyle }}
              onClick={cancelAction || toggle}
              color={cancelColor || "white"}
            >Cancel</MDBBtn>
          }
          <MDBBtn
            className={`btnP8 ${submitClassName}`}
            style={submitStyle || null}
            color={submitColor || mainStyles.colors.gradientGreen}
            type="submit"
            onClick={submitAction || toggle}
            disabled={submitDisabled || false}
          > {submitSpinner &&
              <Spinner className="btnSpinner" />
            }
            {submitSpinner && <span>&nbsp;&nbsp;</span>}
            {submitIcon && <MDBIcon icon={submitIcon} style={{ color: '#fff' }} />}
            {submitIcon && <span>&nbsp;&nbsp;</span>}
            {submitText || 'Done'}
          </MDBBtn>
        </MDBModalFooter>
      }
    </MDBModal>
  );
}
