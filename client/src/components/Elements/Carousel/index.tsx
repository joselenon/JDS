import React from 'react';
import { styled } from 'styled-components';

interface Props {
  items: JSX.Element[];
}

export const CarouselItems = styled.div`
  user-select: none;
  overflow: scroll;
  overflow-y: hidden;
  display: flex;
  gap: 1rem;
  padding: 0.5rem 0;
`;

const Carousel = (props: Props) => {
  return <CarouselItems>{props.items}</CarouselItems>;
};

export default Carousel;
