import React from 'react';

import * as styles from './styles';

interface Props {
  items: JSX.Element[];
}

const Carousel = (props: Props) => {
  return <styles.CarouselItems>{props.items}</styles.CarouselItems>;
};

export default Carousel;
