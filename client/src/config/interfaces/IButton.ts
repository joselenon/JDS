import { ReactElement } from 'react';

export type BtnTypes = 'CTA' | 'DANGER' | 'IMG' | 'DEFAULT';

export type IButtonTypeConfig = {
  [key in BtnTypes]: {
    padding: { x: number; y: number };
    colors: { color: string; shadow_color: string };
  };
};

export default interface IButton {
  id?: string;
  btnType: keyof IButtonTypeConfig;
  icon?: ReactElement;
  label?: string | JSX.Element;
  img?: string;
  type?: 'button' | 'submit' | 'reset' | undefined;
  onClickFn?: (e?: any) => any;
}
