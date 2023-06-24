export interface IconProps {
  styles: string;
  name: string;
  imgUrl: string;
  isActive: string;
  disabled: boolean | undefined;
  handleClick: () => void;
}

export interface ButtonProps {
  btnType: any;
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

export interface CampaignProps {
  owner: any;
  title: any;
  description: any;
  target: any;
  deadline: any;
  amountCollected: any;
  image: any;
  handleClick: () => void;
}
