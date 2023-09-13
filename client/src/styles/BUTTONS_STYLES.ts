import { IButtonTypeConfig } from '../config/interfaces/IButton';

const BTN_TYPES: IButtonTypeConfig = {
  DEFAULT: {
    padding: { x: 14, y: 10 },
    colors: {
      color: 'var(--secondary-color)',
      shadow_color: 'var(--primary-color)',
    },
  },

  CTA: {
    padding: { x: 14, y: 10 },
    colors: {
      color: '#00963b',
      shadow_color: '#01702d',
    },
  },

  DANGER: {
    padding: { x: 14, y: 10 },
    colors: {
      color: 'var(--default-red)',
      shadow_color: '#b51212',
    },
  },

  IMG: {
    padding: { x: 0, y: 0 },
    colors: {
      color: '',
      shadow_color: '',
    },
  },
};

export default BTN_TYPES;
