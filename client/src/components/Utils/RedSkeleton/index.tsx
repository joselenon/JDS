// Add custom border radius
import React from 'react';

import styled, { keyframes } from 'styled-components';

const loading = keyframes`
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
`;

export const SkeletonContainer = styled.div`
  width: 100%;
  height: 100%;
  border-radius: var(--default-br);
  background: linear-gradient(90deg, transparent, var(--default-red), transparent);
  background-size: 200% 100%;
  background-color: #6e1616;
  animation: ${loading} 2.5s linear infinite;
`;

export default function RedSkeleton({ children }: any) {
  return <SkeletonContainer id="red">{children}</SkeletonContainer>;
}
