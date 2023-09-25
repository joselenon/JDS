import { ReactElement } from 'react';

export type BtnTypes = 'TEXT' | 'CTA' | 'DANGER' | 'IMG' | 'DEFAULT';

export type IButtonTypeConfig = {
  [key in BtnTypes]: React.CSSProperties;
};

export interface IButton {
  id?: string;
  btnType: BtnTypes;
  icon?: ReactElement;
  label?: string | JSX.Element;
  img?: string;
  type?: 'button' | 'submit' | undefined;
  onClickFn?: (e?: any) => any;
}

const BTN_TYPES: IButtonTypeConfig = {
  DEFAULT: {
    padding: '14px 10px',
    color: 'var(--secondary-color)',
  },

  TEXT: {
    background: 'none',
  },

  CTA: {
    width: '100%',
    padding: '14px 10px',
    background: '#14b546',
  },

  DANGER: {
    padding: '14px 10px',
    background: 'var(--default-red)',
  },

  IMG: {},
};

export { BTN_TYPES };
