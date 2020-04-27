import {
  PLAN
} from './app.js';

export default class Door {
  constructor(xStart, yStart, xEnd, yEnd, thickness, color) {
    this.xStart = xStart;
    this.yStart = yStart;
    this.xEnd = xEnd;
    this.yEnd = yEnd;
    this.thickness = thickness;
    this.color = color;
  }

  drawDoor() {
    let door = PLAN.makePath(this.xStart, this.yStart, this.xEnd, this.yEnd);
    door.linewidth = this.thickness;
    door.stroke = this.color;

    PLAN.update();
  }
}