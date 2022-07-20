import { BattleType, FigthersType, MovesType, ViewType } from "./interface";
import process from "process";
import readline from "readline";
import colors from "colors";

export default class Battle implements BattleType {
  public userCooldown: number[];
  public cpuCooldown: number[];
  public usersFigther: FigthersType;
  public cpuFigther: FigthersType;
  public view: ViewType;
  constructor(
    usersFigther: FigthersType,
    cpuFigther: FigthersType,
    view: ViewType
  ) {
    this.usersFigther = usersFigther;
    this.cpuFigther = cpuFigther;
    this.view = view;
    this.userCooldown = new Array(usersFigther.moves.length).fill(0);
    this.cpuCooldown = new Array(cpuFigther.moves.length).fill(0);
  }

  public async question(str: string) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    const answer = await new Promise((resolve) => {
      rl.question(str, resolve);
    });
    rl.close();
    return answer as any;
  }

  public async levelSelection() {
    let level = await this.question(
      "Выберете уровень своего персонажа от 1 до 5 (5 - самый сложный)\n"
    );
    while (+level > 5 || +level < 1) {
      level = await this.question(
        "Неверный ввод.\n Выберете уровень своего персонажа от 1 до 5 (5 - самый сложный)\n"
      );
    }

    this.usersFigther.maxHealth = 10 * (6 - level);
    // console.log(this.usersFigther.maxHealth);
  }

  public randomNum(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  public setCooldownChance(
    figtherCooldown: number[],
    attackNum: number,
    attackCooldown: number
  ) {
    const newFigtherCooldown = figtherCooldown.map((v) =>
      v === 0 ? 0 : v - 1
    );
    newFigtherCooldown[attackNum] = attackCooldown;
    return newFigtherCooldown;
  }

  public damageCalc(attackF1: MovesType, attackF2: MovesType): number {
    let magic = attackF1.magicArmorPercents - attackF2.magicDmg;
    magic = magic >= 0 ? 0 : magic;
    let physic = attackF1.physicArmorPercents - attackF2.physicalDmg;
    physic = physic >= 0 ? 0 : physic;
    return magic + physic;
  }

  public async hits() {
    // проверка возможности атаки
    const changeCpuAttackVar = this.cpuFigther.moves.map((v, i) => ({
      ...v,
      permission: !this.userCooldown[i],
    }));
    let cpuAttackNumber = this.randomNum(0, changeCpuAttackVar.length - 1);
    while (!changeCpuAttackVar[cpuAttackNumber].permission) {
      cpuAttackNumber = this.randomNum(0, changeCpuAttackVar.length - 1);
    }
    const cpuAttack = changeCpuAttackVar[cpuAttackNumber];
    this.view.showTimeout(
      `${this.cpuFigther.name} выбирает ${cpuAttack.name}...\n`
    );
    this.cpuCooldown = this.setCooldownChance(
      this.cpuCooldown,
      cpuAttackNumber,
      cpuAttack.cooldown
    );

    const changeUserAttackVar = this.usersFigther.moves.map((v, i) => ({
      ...v,
      permission: !this.userCooldown[i],
    })); // проверка возможности атаки
    // console.log("this.userCooldown -> ", this.userCooldown);
    // console.log("this.cpuCooldown -> ", this.cpuCooldown);
    const countAttack = changeUserAttackVar.length - 1;

    changeUserAttackVar.forEach((v, i) => {
      if (v.permission) {
        this.view.show(`${i} ---> ${v.name}`);
      }
    });

    let userAttackNumber = await this.question(
      `Выберете возможный номер удара\n`
    );
    while (!changeUserAttackVar[+userAttackNumber]) {
      userAttackNumber = await this.question(
        `Неверный ввод.\n Возможные к выбору номера перечислены сверху\n`
      );
    }
    while (
      (+userAttackNumber > countAttack || +userAttackNumber < 0) &&
      !changeUserAttackVar[+userAttackNumber] &&
      !changeUserAttackVar[+userAttackNumber].permission
    ) {
      userAttackNumber = await this.question(
        `Неверный ввод.\n Возможные к выбору номера перечислены сверху\n`
      );
    }

    const userAttack = this.usersFigther.moves[userAttackNumber];
    this.view.showTimeout(
      `${this.usersFigther.name} выбирает ${userAttack.name}...\n`
    );
    this.userCooldown = this.setCooldownChance(
      this.userCooldown,
      userAttackNumber,
      userAttack.cooldown
    );

    const damageToUser = this.damageCalc(userAttack, cpuAttack);
    const damageToCpu = this.damageCalc(cpuAttack, userAttack);

    this.usersFigther.maxHealth += damageToUser;
    this.cpuFigther.maxHealth += damageToCpu;

    this.view.showAndMove(cpuAttack.name, this.cpuFigther.name);
    this.view.showAndMove(userAttack.name, this.usersFigther.name);
  }

  public async figth() {
    console.log("\x1Bc");
    await this.levelSelection();
    while (this.cpuFigther.maxHealth > 0 && this.usersFigther.maxHealth > 0) {
      this.view.showTimeout("\x1Bc");
      console.log("");
      this.view.show(
        `Компьютер: ${this.cpuFigther.name}, здоровье: ${this.cpuFigther.maxHealth}\n`
      );
      this.view.show(
        `Игрок: ${this.usersFigther.name}, здоровье: ${this.usersFigther.maxHealth}\n`
      );
      await this.hits();
      if (this.cpuFigther.maxHealth > 0 && this.usersFigther.maxHealth < 0) {
        this.view.showTimeout(
          `${this.usersFigther.name} погибает. ${this.cpuFigther.name} победил.`
        );
        process.exit(0);
      }
      if (this.cpuFigther.maxHealth < 0 && this.usersFigther.maxHealth > 0) {
        this.view.showTimeout(
          `${this.cpuFigther.name} погибает. ${this.usersFigther.name} победил.`
        );
        process.exit(0);
      }
      if (this.cpuFigther.maxHealth < 0 && this.usersFigther.maxHealth < 0) {
        this.view.showTimeout("Оба игрока погибли ... ");
        process.exit(0);
      }
    }
  }
}
