import React, { useState, useEffect, useRef } from "react";
import Button from "./Button";
import TransmissionState from "../share/buttonStates";

export default function StatefulButton({
  state,
  clickHanlder
}: {
  state: string;
  clickHanlder: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
}) {
  let icon: string;
  let color: string;
  switch (state) {
    case TransmissionState.Initial: {
      icon = "icofont-arrow-right";
      color = "#cecece";
      break;
    }
    case TransmissionState.Ready: {
      icon = "icofont-arrow-right";
      break;
    }
    case TransmissionState.Sending: {
      icon = "icofont-arrow-right";
      color = "gold";
      break;
    }
    case TransmissionState.Failed: {
      icon = "icofont-close";
      break;
    }
    case TransmissionState.Successed: {
      icon = "icofont-check";
      break;
    }
  }
  return (
    <Button
      className={icon}
      onClick={clickHanlder}
      fontSize={"18px"}
      color={color}
    ></Button>
  );
}
