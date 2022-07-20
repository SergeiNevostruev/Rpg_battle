interface MovesType {
  name: string; // название удара
  physicalDmg: number; // физический урон
  magicDmg: number; // магический урон
  physicArmorPercents: number; // физическая броня
  magicArmorPercents: number; // магическая броня
  cooldown: number; // ходов на восстановление
}
type ViewTypeProp = string | number;

interface ViewType {
  show(str: ViewTypeProp): void;
  showTimeout(str: ViewTypeProp): void;
  showAndMove(str: ViewTypeProp, name: string): void;
}

interface FigthersType {
  maxHealth: number;
  name: string;
  moves: MovesType[];
  choiceOfWeaponType(weapon: number): MovesType;
}

interface BattleType {
  usersFigther: FigthersType;
  cpuFigther: FigthersType;
  userCooldown: number[];
  cpuCooldown: number[];
  question(str: string): any;
  levelSelection(): void;
  setCooldownChance(
    figtherCooldown: number[],
    attackNum: number,
    attackCooldown: number
  ): number[];
  randomNum(min: number, max: number): number;
  damageCalc(attackF1: MovesType, attackF2: MovesType): number;
  figth(): void;
  hits(): void;
}

export { MovesType, ViewType, FigthersType, BattleType, ViewTypeProp };
