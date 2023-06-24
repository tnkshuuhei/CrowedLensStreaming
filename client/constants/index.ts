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
    link: "/Home",
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
    disabled: true,
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
    link: "/Profile",
    disabled: false,
  },
  {
    name: "logout",
    imgUrl: logout,
    link: "/",
    disabled: true,
  },
];
