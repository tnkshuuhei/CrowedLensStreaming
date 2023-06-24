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

export interface FieldProps {
  labelName: string;
  placeholder: string;
  inputType: any;
  isTextArea: boolean;
  value: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}
