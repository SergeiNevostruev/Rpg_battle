import Battle from "./classes/Battle";
import Figthers from "./classes/Figthers";
import View from "./classes/View";
import dataMoves from "./dataMoves";
const { cpuMoves, userMoves } = dataMoves;

const start = async () => {
  const myView = new View(console.log, 1000);
  const myUser = new Figthers(10, "Евстафий", userMoves);
  const cpu = new Figthers(20, "Лютый", cpuMoves);
  const myBattle = new Battle(myUser, cpu, myView);
  await myBattle.figth();
};

start();
