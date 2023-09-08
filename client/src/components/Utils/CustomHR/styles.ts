import styled from 'styled-components';

import { Props } from '.';

const width = (direction: Props['direction'], width: Props['width']) => {
  if (direction === 'HORIZONTAL') {
    if (width) {
      return width;
    } else {
      return '100%';
    }
  }
  return '1px';
};

const height = (direction: Props['direction'], height: Props['height']) => {
  if (direction === 'VERTICAL') {
    if (height) {
      return height;
    } else {
      return '100%';
    }
  }
  return '1px';
};

export const HRContainer = styled.div<Props>`
  width: ${(props) => width(props.direction, props.width)};
  height: ${(props) => height(props.direction, props.height)};
  background-color: ${(props) => (props.color ? props.color : 'white')};
  display: flex;
  opacity: 0.4;
  margin: 30px 0;
`;
