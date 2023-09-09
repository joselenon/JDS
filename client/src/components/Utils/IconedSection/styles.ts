import styled from 'styled-components';

interface Props {
  $isCarousel: boolean;
}

export const SectionContainer = styled.div<Props>`
  display: flex;
  flex-direction: column;
  gap: ${(props) => (props.$isCarousel ? '0.25rem' : '0.75rem')};
`;
