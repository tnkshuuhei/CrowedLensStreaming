import { ethers } from "ethers";
export const daysLeft = (deadline: number) => {
  const difference = new Date(deadline).getTime() - Date.now();
  const remainingDays = difference / (1000 * 3600 * 24);

  return remainingDays.toFixed(0);
};

export const calculateBarPercentage = (goal: any, raisedAmount: any) => {
  const percentage = Math.round((raisedAmount * 100) / goal);

  return percentage;
};

export const checkIfImage = (url: any, callback: any) => {
  const img = new Image();
  img.src = url;

  if (img.complete) callback(true);

  img.onload = () => callback(true);
  img.onerror = () => callback(false);
};

export const calculateFlowRate = (amountInEther: number | string) => {
  const parsedAmount = Number(amountInEther);

  if (isNaN(parsedAmount)) {
    console.log("type:", typeof amountInEther);
    alert("You can only calculate a flowRate based on a number");
    return;
  } else {
    const monthlyAmount = ethers.utils.parseEther(parsedAmount.toString());
    console.log("monthlyAmount:", monthlyAmount);
    const calculatedFlowRate = Math.floor(
      Number(monthlyAmount) / 3600 / 24 / 30
    );
    return calculatedFlowRate;
  }
};
