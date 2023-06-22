export interface IconProps {
  styles: string;
  name: string;
  imgUrl: string;
  isActive: string;
  disabled: boolean | undefined;
  handleClick: () => void;
}
