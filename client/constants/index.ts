import {
  createCampaign,
  dashboard,
  logout,
  payment,
  profile,
  withdraw,
} from "../assets";

export const navlinks = [
  {
    name: "dashboard",
    imgUrl: dashboard,
    link: "/",
    disabled: false,
  },
  {
    name: "campaign",
    imgUrl: createCampaign,
    link: "/CreateCampaign",
    disabled: false,
  },
  {
    name: "payment",
    imgUrl: payment,
    link: "/",
    disabled: false,
  },
  {
    name: "withdraw",
    imgUrl: withdraw,
    link: "/",
    disabled: false,
  },
  {
    name: "profile",
    imgUrl: profile,
    link: "/profile",
    disabled: false,
  },
  {
    name: "logout",
    imgUrl: logout,
    link: "/",
    disabled: false,
  },
];
