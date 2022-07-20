import { ViewType, ViewTypeProp } from "./interface";

export default class View implements ViewType {
  private viewFunc: (str: ViewTypeProp) => void;
  private delay: number;
  constructor(viewFunc: () => void, delay: number) {
    this.viewFunc = viewFunc;
    this.delay = delay;
  }
  private sleep = (ms: number) => {
    const t = new Date().getTime();
    let i = 0;
    while (new Date().getTime() - t < ms) {
      i++;
    }
  };
  show(str: ViewTypeProp) {
    this.viewFunc(str + "\n");
  }
  showTimeout(str: ViewTypeProp) {
    this.sleep(this.delay);
    this.viewFunc(str + "\n");
  }
  showAndMove(str: ViewTypeProp, name: string) {
    this.viewFunc(`${name} наносит удар - `);
    this.sleep(this.delay);
    this.viewFunc(str + "\n");
  }
}
