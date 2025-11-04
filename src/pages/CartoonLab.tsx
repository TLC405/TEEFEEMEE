import React from 'react';

/**
 * @deprecated This component is an old version and is no longer in use.
 * The active and correct implementation is located at `src/pages/Cartoonifier.tsx`.
 * This component returns null to prevent accidental rendering.
 */
export const CartoonLab: React.FC = () => {
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      'Warning: The deprecated `CartoonLab` component was rendered. Please use `Cartoonifier` instead.'
    );
  }
  return null;
};
