import { BattleType, FigthersType, MovesType } from "./interface";

class Moves implements MovesType {
  constructor(
    public name: string,
    public physicalDmg: number,
    public magicDmg: number,
    public physicArmorPercents: number,
    public magicArmorPercents: number,
    public cooldown: number
  ) {}
}

export default class Figthers implements FigthersType {
  constructor(
    public maxHealth: number,
    public name: string,
    public moves: MovesType[]
  ) {}
  choiceOfWeaponType(weapon: number) {
    return this.moves[weapon];
  }
}
