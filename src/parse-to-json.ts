import { MonsterCard, AbilityEntry, AbilityName } from "card-types";

const splitSigns = /\\t|\t| /;

// 将 mock-monster 文本解析为 MonsterCard JSON
export function parseMonsterTxtToJson(txt: string): MonsterCard {
  const lines = txt
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const title = lines[0] ?? ""; // 例如：平民Commoner
  const subLine = lines[1] ?? ""; // 例如：中型或小型类人，中立
  const acAndInitLine = lines[2] ?? "";

  const getAfter = (l: string | undefined, key: string) => {
    if (!l) return "";
    const index = l.indexOf(key);
    return l.slice(index + key.length).trim();
  };

  const getSingleAfter = (l: string | undefined, key: string) => {
    console.log(getAfter(l, key), getAfter(l, key).split(splitSigns));
    return getAfter(l, key).split(splitSigns).shift();
  };

  const hpLine = lines.find((l) => l.startsWith("HP "));
  const speedLine = lines.find((l) => l.startsWith("速度 "));

  // 标题 id 取英文名（若包含英文字母），否则用原文
  const eng_name = ((title ?? "").match(/[A-Za-z][A-Za-z0-9_-]*/) || [title])[0];
  const ac = getSingleAfter(acAndInitLine, "AC ");
  const init = acAndInitLine ? getAfter(acAndInitLine, "先攻") : "";
  const hp = getAfter(hpLine, "HP ");
  const speed = getAfter(speedLine, "速度 ");

  // 能力行（两行：力量/敏捷/体质 与 智力/感知/魅力）
  const row2 = lines.find((l) => l.startsWith("力量"));
  const row3 = lines.find((l) => l.startsWith("智力"));

  function parseAbilityRow(row: string | undefined): AbilityEntry[] {
    if (!row) return [];
    // e.g. 力量\t16\t+3\t+3\t\t敏捷\t13\t+1\t+1\t\t体质\t16\t+3\t+3
    const parts = row.split(/\t+/).filter(Boolean);
    const result: AbilityEntry[] = [];
    for (let i = 0; i + 3 < parts.length; i += 4) {
      const name = parts[i] as AbilityName;
      const score = Number(parts[i + 1]);
      const mod = parts[i + 2] ?? "";
      const save = parts[i + 3] ?? "";
      result.push({ name, score, mod, save });
    }
    return result;
  }

  const abilities1 = parseAbilityRow(row2);
  const abilities2 = parseAbilityRow(row3);
  const all = [...abilities1, ...abilities2];

  function pick(name: AbilityName): AbilityEntry {
    const found = all.find((a) => a.name === name);
    if (!found) {
      return { name, score: 10, mod: "+0", save: "+0" };
    }
    return found;
  }

  const equipLine = lines.find((l) => l.startsWith("装备 "));
  const sensesLine = lines.find((l) => l.startsWith("感官 "));
  const langLine = lines.find((l) => l.startsWith("语言 "));
  const crLine = lines.find((l) => l.startsWith("CR "));

  const equip = equipLine ? equipLine.replace(/^装备\s+/, "") : "";
  const senses = sensesLine ? sensesLine.replace(/^感官\s+/, "") : "";
  const languages = langLine ? langLine.replace(/^语言\s+/, "") : "";
  const cr = crLine ? crLine.replace(/^CR\s+/, "") : "";

  const traitsIdx = lines.findIndex((l) => l.startsWith("特质"));
  const actionsIdx = lines.findIndex((l) => l.startsWith("动作"));

  const traitsLines =
    traitsIdx >= 0 && actionsIdx > traitsIdx ? lines.slice(traitsIdx + 1, actionsIdx) : [];
  const actionsLines = actionsIdx >= 0 ? lines.slice(actionsIdx + 1) : [];

  function splitNameAndText(line: string): { name: string; text: string } {
    // 形如：XXX。YYYY -> name 含结尾的“。”，text 为其后描述
    const m = line.match(/^(.+?。)(.*)$/);
    if (m) return { name: m[1] ?? "", text: m[2] ?? "" };
    return { name: "", text: line };
  }

  const traits = traitsLines.map(splitNameAndText);
  const actions = actionsLines.map(splitNameAndText);

  const id = ((title ?? "").match(/[A-Za-z][A-Za-z0-9 _'"-]*/) || [title])[0];

  return {
    eng_name: eng_name ?? "",
    title: title ?? "",
    subLine: subLine ?? "",
    ac: ac ?? "",
    init,
    hp,
    speed,
    abilities: {
      str: pick("力量"),
      dex: pick("敏捷"),
      con: pick("体质"),
      int: pick("智力"),
      wis: pick("感知"),
      cha: pick("魅力"),
    },
    equip,
    senses,
    languages,
    cr,
    traits,
    actions,
  };
}
