import { device, Container } from "melonjs";
import onload from "./game"

device.onReady(() => {
  device.pauseOnBlur = false;
  onload();
});