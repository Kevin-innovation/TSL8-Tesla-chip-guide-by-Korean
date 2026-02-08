import fs from "node:fs/promises";
import path from "node:path";

export type Tsl6Item = {
  id: string;
  zh: string;
  koRaw: string;
  ko: string;
  categoryZh: string;
  categoryKo: string;
  prohibited: boolean;
};

export type Tsl6Data = {
  updatedAt?: string;
  otaVersion?: string;
  functions: Tsl6Item[];
  entities: Tsl6Item[];
};

const HAS_HANGUL = /[가-힣]/;
const HAS_CJK = /[\u3400-\u9FFF]/;
type ZhKoState = "zh1" | "ko1" | "zh2" | "ko2";

function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function normalizeKorean(koRaw: string): string {
  const replacements: Array<[RegExp, string]> = [
    [/운적석/g, "운전석"],
    [/안절벨트/g, "안전벨트"],
    [/커졌을 때/g, "켜졌을 때"],
    [/커졌을 시/g, "켜졌을 시"],
    [/커졌을/g, "켜졌을"],
    [/더블 클릭/g, "두 번 누르기"],
    [/더블클릭/g, "두 번 누르기"],
    [/길게 클릭/g, "길게 누르기"],
    [/짧게 클릭/g, "짧게 누르기"],
    [/길게 누르고 놓기/g, "길게 누른 뒤 놓기"],
    [/짧게 누르기\\+길게 누르기/g, "짧게 누른 뒤 길게 누르기"],
    [/짧게 클릭\\+길게 클릭/g, "짧게 누른 뒤 길게 누르기"],
    [/AP따라가기/g, "AP 따라가기"],
    [/조그휠/g, "스크롤휠"],
    [/스티어링 휠/g, "핸들 스크롤휠"],
    [/도어 위로 당김/g, "창문 올림 버튼"],
    [/도어 아래로 누르기/g, "창문 내림 버튼"],
    [/도어 위로 버튼/g, "창문 올림 버튼"],
    [/도어 아래로 버튼/g, "창문 내림 버튼"],
  ];

  let ko = koRaw;
  for (const [from, to] of replacements) ko = ko.replace(from, to);
  return normalizeWhitespace(ko);
}

function stripLeadingNumberDot(text: string): string {
  return text
    .replace(/^\\d+\\.\\s*/, "")
    .replace(/\\s+\\d+\\.$/, "")
    .trim();
}

function splitZhKoPairs(line: string): {
  zh1: string;
  ko1: string;
  zh2: string;
  ko2: string;
} | null {
  const trimmed = line.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("---")) return null;

  const tokens = trimmed.split(/\s+/);

  let state: ZhKoState = "zh1";
  const parts: Record<ZhKoState, string[]> = {
    zh1: [],
    ko1: [],
    zh2: [],
    ko2: [],
  };

  for (const token of tokens) {
    const hasHangul = HAS_HANGUL.test(token);
    const hasCjk = HAS_CJK.test(token);

    if (state === "zh1" && hasHangul) state = "ko1";
    else if (state === "ko1" && hasCjk && !hasHangul) state = "zh2";
    else if (state === "zh2" && hasHangul) state = "ko2";

    parts[state].push(token);
  }

  const zh1 = normalizeWhitespace(parts.zh1.join(" "));
  const ko1 = normalizeWhitespace(parts.ko1.join(" "));
  const zh2 = normalizeWhitespace(parts.zh2.join(" "));
  const ko2 = normalizeWhitespace(parts.ko2.join(" "));

  if (!zh1 && !ko1 && !zh2 && !ko2) return null;
  return { zh1, ko1, zh2, ko2 };
}

function isHeading(zh: string, ko: string): boolean {
  if (!/^\\d+\\./.test(zh)) return false;
  if (!ko) return false;
  // "1. 좌석 제어" 같은 형태
  return true;
}

function makeId(prefix: string, idx: number): string {
  return `${prefix}_${idx.toString(36)}`;
}

export function parseTsl6Extract(raw: string): Tsl6Data {
  const updatedAt =
    raw.match(/Update\\s+(\\d{4}\\.\\d{2}\\.\\d{2})/)?.[1] ?? undefined;
  const otaVersion =
    raw.match(/TSL6\\s+-\\s+OTA\\s+([^\\s]+)\\s+기준/)?.[1] ?? undefined;

  const functions: Tsl6Item[] = [];
  const entities: Tsl6Item[] = [];

  let fnCategoryZh = "기타";
  let fnCategoryKo = "기타";
  let entCategoryZh = "기타";
  let entCategoryKo = "기타";

  let fnIdx = 0;
  let entIdx = 0;

  for (const line of raw.split(/\\r?\\n/)) {
    const parsed = splitZhKoPairs(line);
    if (!parsed) continue;

    const { zh1, ko1, zh2, ko2 } = parsed;

    if (isHeading(zh1, ko1)) {
      fnCategoryZh = stripLeadingNumberDot(zh1);
      fnCategoryKo = normalizeKorean(stripLeadingNumberDot(ko1));
    } else if (zh1 && ko1) {
      const prohibited =
        ko1.includes("사용 금지") || zh1.includes("免打扰") || zh1.includes("禁");
      functions.push({
        id: makeId("fn", fnIdx++),
        zh: zh1,
        koRaw: ko1,
        ko: normalizeKorean(ko1),
        categoryZh: fnCategoryZh,
        categoryKo: fnCategoryKo,
        prohibited,
      });
    }

    if (isHeading(zh2, ko2)) {
      entCategoryZh = stripLeadingNumberDot(zh2);
      entCategoryKo = normalizeKorean(stripLeadingNumberDot(ko2));
    } else if (zh2 && ko2) {
      const prohibited = false;
      entities.push({
        id: makeId("ent", entIdx++),
        zh: zh2,
        koRaw: ko2,
        ko: normalizeKorean(ko2),
        categoryZh: entCategoryZh,
        categoryKo: entCategoryKo,
        prohibited,
      });
    }
  }

  return { updatedAt, otaVersion, functions, entities };
}

export async function loadTsl6Data(): Promise<Tsl6Data> {
  const filePath = path.join(process.cwd(), "references", "tsl6_extract_raw.txt");
  const raw = await fs.readFile(filePath, "utf-8");
  return parseTsl6Extract(raw);
}
