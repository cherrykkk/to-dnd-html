// 声明用于怪物卡片的中间 JSON 数据结构
export type AbilityName = "力量" | "敏捷" | "体质" | "智力" | "感知" | "魅力";

export interface AbilityEntry {
  name: AbilityName;
  score: number; // 例如 16
  mod: string; // 例如 "+3"
  save: string; // 例如 "+3"
}

export interface MonsterCard {
  eng_name: string; // 用于 <h5 id="...">
  title: string; // 第一行完整标题，如：海鬼婆Sea Hag
  subLine: string; // 第二行副标题
  ac: string; // AC 字段原样
  init: string; // 先攻
  hp: string; // HP
  speed: string; // 速度
  abilities: {
    // 6 项能力，顺序任意，但通常 STR/DEX/CON/INT/WIS/CHA
    str: AbilityEntry;
    dex: AbilityEntry;
    con: AbilityEntry;
    int: AbilityEntry;
    wis: AbilityEntry;
    cha: AbilityEntry;
  };
  equip?: string;
  senses?: string;
  languages?: string;
  cr?: string;
  traits: { name: string; text: string }[]; // 特质：名称+描述（名称行末含全角句号“。”）
  actions: { name: string; text: string }[]; // 动作：名称+描述（名称行末含全角句号“。”）
}
