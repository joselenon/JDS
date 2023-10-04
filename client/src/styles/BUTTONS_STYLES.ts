import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { IconType } from 'react-icons/lib';

export type BtnTypes = 'TEXT' | 'CTA' | 'DANGER' | 'IMG' | 'DEFAULT' | 'BLUE';

export type IButtonTypeConfig = {
  [key in BtnTypes]: React.CSSProperties;
};

export interface IButton {
  id?: string;
  btnType: BtnTypes;
  icon?: { provider: 'fontAwesome' | 'reactIcons'; element: IconDefinition | IconType };
  label?: string | JSX.Element;
  img?: string;
  type?: 'button' | 'submit' | undefined;
  onClickFn?: (e?: any) => any;
}

const BTN_TYPES: IButtonTypeConfig = {
  DEFAULT: {
    padding: '14px 10px',
    background: 'var(--secondary-color)',
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

  BLUE: {
    padding: '14px 10px',
    background: 'var(--blue-color)',
  },
};

export { BTN_TYPES };
