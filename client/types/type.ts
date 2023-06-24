export interface IconProps {
  styles: string;
  name: string;
  imgUrl: string;
  isActive: string;
  disabled: boolean | undefined;
  handleClick: () => void;
}

export interface ButtonProps {
  btnType: undefined | "button";
  title: string;
  handleClick: () => void;
  styles: string;
}
