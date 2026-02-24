import React from 'react';
import { modalStyles } from '../styles/modalStyles';
import type { ThreatInfo } from '../config/threatConfig';

interface ModalHeaderProps {
  info: ThreatInfo;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({ info }) => {
  return (
    <div style={modalStyles.header(info.color, info.bgColor)}>
      <div style={{ marginBottom: '16px', fontSize: '48px' }}>
        {info.icon}
      </div>
      <h2 style={modalStyles.title(info.color)}>
        {info.title}
      </h2>
      <p style={modalStyles.description}>
        {info.description}
      </p>
    </div>
  );
};
