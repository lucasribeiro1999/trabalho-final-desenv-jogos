import { device } from "melonjs";
import onload from "./game";

device.onReady(() => {
  device.pauseOnBlur = false;
  onload();
});