import React from 'react';
import { modalStyles } from '../styles/modalStyles';

interface URLSectionProps {
  url: string;
}

export const URLSection: React.FC<URLSectionProps> = ({ url }) => {
  return (
    <div style={modalStyles.section}>
      <div style={modalStyles.label}>URL:</div>
      <div style={modalStyles.urlDisplay}>{url}</div>
    </div>
  );
};
