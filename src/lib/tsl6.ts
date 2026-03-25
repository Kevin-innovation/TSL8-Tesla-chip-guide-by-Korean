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
    [/짧게 누르기\+길게 누르기/g, "짧게 누른 뒤 길게 누르기"],
    [/짧게 누르기 \+ 길게 누르기/g, "짧게 누른 뒤 길게 누르기"],
    [/짧게 클릭\+길게 클릭/g, "짧게 누른 뒤 길게 누르기"],
    [/짧게 당김 \+ 길게 당김/g, "짧게 당긴 뒤 길게 당기기"],
    [/AP따라가기/g, "AP 따라가기"],
    [/조그휠/g, "스크롤휠"],
    [/스티어링 휠/g, "핸들 스크롤휠"],
    [/도어 위로 당김/g, "창문 올림 버튼"],
    [/도어 아래로 누르기/g, "창문 내림 버튼"],
    [/도어 위로 버튼/g, "창문 올림 버튼"],
    [/도어 아래로 버튼/g, "창문 내림 버튼"],
    [/5\. 에어컨 제어/g, "5. 공조 제어"],
    [/2열 에어컨/g, "2열 공조"],
    [/내부 및 외부 전환/g, "공조 내기/외기 전환"],
    [/에어컨 외부 순환/g, "공조 외기 순환"],
    [/에어컨 내부 순환/g, "공조 내기 순환"],
    [/백미러 접기\/펴기/g, "사이드미러 접기/펼치기"],
    [/백미러 상하 뒤집음\(기어R 조건\)/g, "후진 시 사이드미러 각도 조정"],
    [/백미러 디밍 스위치\(기어D 조건\)/g, "주행 시 미러 눈부심 방지 전환(기어 D 조건)"],
    [/6\. 백미러/g, "6. 미러 제어"],
    [/기어 스위치/g, "기어 전환"],
    [/전면 안개등/g, "앞 안개등"],
    [/후면 안개등/g, "뒤 안개등"],
    [/상향등 플래시/g, "상향등 빠른 점멸"],
    [/앞 안개등 플래시/g, "앞 안개등 빠른 점멸"],
    [/뒤 안개등 플래시/g, "뒤 안개등 빠른 점멸"],
    [/앞 안개등 파일럿/g, "앞 안개등 연동"],
    [/뒤 안개등 파일럿/g, "뒤 안개등 연동"],
    [/경적 가볍게 (\d회)/g, "짧은 경적 $1"],
    [/경적 인사/g, "인사 경적"],
    [/긴 물방울 소리 재생/g, "긴 알림음 재생"],
    [/긴 물방울 소리 (\d회)/g, "긴 알림음 $1"],
    [/재생 알림음(\d)/g, "알림음 $1 재생"],
    [/모듈 활성화 비활성화\(모듈 마스터 스위치\)/g, "모듈 켜기/끄기(모듈 전체 스위치)"],
    [/모듈 비활성화\(모듈 마스터 스위치\)/g, "모듈 끄기(모듈 전체 스위치)"],
    [/모듈 활성화\(모듈 마스터 스위치\)/g, "모듈 켜기(모듈 전체 스위치)"],
  ];

  let ko = koRaw;
  for (const [from, to] of replacements) ko = ko.replace(from, to);
  ko = ko.replace(/\s+\d+\.$/, "");
  return normalizeWhitespace(ko);
}

function stripLeadingNumberDot(text: string): string {
  return text
    .replace(/^\d+\.\s*/, "")
    .replace(/\s+\d+\.$/, "")
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
  if (!/^\d+\./.test(zh)) return false;
  if (!ko) return false;
  // "1. 좌석 제어" 같은 형태
  return true;
}

function makeId(prefix: string, idx: number): string {
  return `${prefix}_${idx.toString(36)}`;
}

const EXCLUDED_FUNCTION_LABELS = new Set([
  "작업 없음 (기본값)",
  "기준 (2024/9/17)",
  "스크린 중국 제품",
]);

const EXCLUDED_FUNCTION_CATEGORIES = new Set(["에어컨 제어"]);

const FUNCTION_LABEL_OVERRIDES = new Map<string, string>([
  ["挂入D档", "D 기어 진입"],
  ["挂入R档", "R 기어 진입"],
  ["挂入P档", "P 기어 진입"],
  ["D/R档 切换", "D/R 기어 전환"],
]);

function remapFunctionCategory(item: Tsl6Item): string {
  if (item.ko.includes("도어 잠금")) return "잠금 & 잠금 해제";
  if (item.ko.includes("앞 안개등") || item.ko.includes("뒤 안개등")) return "안개등 제어";

  switch (item.categoryKo) {
    case "좌석 제어":
      return "좌석 제어";
    case "좌석 메모리(리프레쉬S/X 포함)":
      return "좌석 메모리 (신 SX에 적합)";
    case "도어 제어":
      return "문 제어";
    case "운전 보조(오파)":
      return "보조운전";
    case "백미러":
      return "백미러";
    case "기어 전환":
      return "진도 제어";
    case "배터리 & 충전":
      return "배터리 & 충전";
    case "차량 제어":
      return "차량 제어";
    case "정지 모드":
      return "중지 모드";
    case "조명 제어":
      return "조명 제어";
    case "경적 제어":
      return "스피커 제어";
    case "멀티미디어 제어":
      return "멀티미디어 제어";
    case "모듈(TSL6) 제어":
      return "모듈 제어";
    case "해피마브-차량용 LED 스크린":
      return "행복 마프 - 차량 LED 화면";
    default:
      return item.categoryKo;
  }
}

function curateFunctions(items: Tsl6Item[]): Tsl6Item[] {
  return items
    .filter(
      (item) =>
        !EXCLUDED_FUNCTION_LABELS.has(item.ko) &&
        !EXCLUDED_FUNCTION_CATEGORIES.has(item.categoryKo),
    )
    .map((item) => {
      const label = FUNCTION_LABEL_OVERRIDES.get(item.zh) ?? item.ko;
      return {
        ...item,
        ko: label,
        categoryKo: remapFunctionCategory({ ...item, ko: label }),
      };
    });
}

const EXCLUDED_ENTITY_LABELS = new Set([
  "작업 없음 (기본값)",
  "실내등 버튼(리프레쉬S/X 포함)",
  "좌석 허리 받침 버튼(리프레쉬S/X 포함)",
  "핸들 스크롤휠",
  "도어 버튼 (운전석 측)",
  "경적 버튼",
  "2열 접이식 버튼(모델Y)",
  "상향등 레버(모델3/Y)",
  "상향등 버튼(모델3-하이랜드 및 리프레쉬S/X)",
  "음성 인식 버튼(모델3-하이랜드 및 리프레쉬S/X)",
  "카메라 버튼(모델3-하이랜드)",
  "차량 상태에 따른 이벤트",
  "차량 속도에 따른 이벤트",
  "차량 조명에 따른 이벤트",
  "도어 상태에 따른 이벤트",
  "기어 변경 이벤트",
  "안전벨트 상태 이벤트(리프레쉬S/X 포함)",
  "좌석 승하차 이벤트(리프레쉬S/X 포함)",
]);

const ENTITY_LABEL_OVERRIDES = new Map<string, string>([
  ["挂入 P档时", "P 기어 진입 시"],
  ["挂入 R档时", "R 기어 진입 시"],
  ["挂入 N档时", "N 기어 진입 시"],
  ["挂入 D档时", "D 기어 진입 시"],
]);

function remapEntityCategory(item: Tsl6Item): string {
  if (item.ko.includes("핸들 스크롤휠") && item.ko.includes("+")) return "조합 버튼";
  if (item.ko.includes("실내등") || item.ko === "비상등 버튼 길게 누르기") {
    return "조명 버튼 (신 SX에 적합)";
  }
  if (item.ko.includes("허리 받침")) return "허리 받침 버튼 (새로운 SX에 적합)";
  if (item.ko.includes("핸들 스크롤휠") && !item.ko.includes("+")) return "롤러 버튼";
  if (item.ko.includes("창문") && item.ko.includes("3번 당김")) return "창문 버튼";
  if (item.ko.includes("경적 버튼")) return "스피커 버튼";
  if (item.ko.includes("접이식 버튼")) return "뒷좌석 다운 버튼 (일반 Y)";
  if (item.ko.includes("상향등 레버")) return "면라이트 스탠드 (일반 3Y)";
  if (item.ko.includes("상향등 버튼")) return "면라이트 버튼 (신 3YSX)";
  if (item.ko.includes("음성 인식 버튼")) return "음성 버튼 (새로운 3YSX)";
  if (item.ko.includes("카메라 버튼")) return "카메라 버튼 (신형 3YSX)";
  if (
    item.ko.includes("보조 주행") ||
    item.ko.includes("주 전원") ||
    item.ko.includes("차량 잠겼") ||
    item.ko.includes("차량 잠금 해제") ||
    item.ko.includes("브레이크 페달") ||
    item.ko.includes("충전 커버")
  ) {
    return "차량 사건";
  }
  if (item.ko.includes("차량 속도") || item.ko.includes("도로 제한 속도")) {
    return "자동차 속도 사건";
  }
  if (item.ko.includes("핸들이") || item.ko.includes("방향이")) return "핸들 이벤트";
  if (item.ko.startsWith("AP가") || item.ko.includes("블라인드")) return "보안 사건 (TSL8/9)";
  if (
    item.ko.includes("브레이크등") ||
    item.ko.includes("방향지시등") ||
    item.ko.includes("비상등이")
  ) {
    return "조명 사건";
  }
  if (
    item.ko.includes("도어") ||
    item.ko.includes("모든 도어") ||
    item.ko.includes("트렁크")
  ) {
    return "차 문 사건";
  }
  if (item.ko.includes("기어 진입 시")) return "변속 이벤트";
  if (item.ko.includes("안전벨트")) return "안전벨트 이벤트 (신 SX에 적합)";
  if (item.ko.includes("탑승 시") || item.ko.includes("하차 시")) {
    return "좌석 이벤트 (신 SX에 적합)";
  }
  return item.categoryKo;
}

const ENTITY_CATEGORY_ORDER = [
  "조명 버튼 (신 SX에 적합)",
  "허리 받침 버튼 (새로운 SX에 적합)",
  "롤러 버튼",
  "조합 버튼",
  "창문 버튼",
  "스피커 버튼",
  "뒷좌석 다운 버튼 (일반 Y)",
  "면라이트 스탠드 (일반 3Y)",
  "면라이트 버튼 (신 3YSX)",
  "음성 버튼 (새로운 3YSX)",
  "카메라 버튼 (신형 3YSX)",
  "차량 사건",
  "자동차 속도 사건",
  "핸들 이벤트",
  "보안 사건 (TSL8/9)",
  "조명 사건",
  "차 문 사건",
  "변속 이벤트",
  "안전벨트 이벤트 (신 SX에 적합)",
  "좌석 이벤트 (신 SX에 적합)",
] as const;

let screenshotEntityIndex = 0;

function makeScreenshotEntity(
  categoryKo: string,
  koRaw: string,
  ko = koRaw,
  zh = "",
): Tsl6Item {
  return {
    id: makeId("ent_screenshot", screenshotEntityIndex++),
    zh,
    koRaw,
    ko,
    categoryZh: "",
    categoryKo,
    prohibited: false,
  };
}

function createScreenshotOnlyEntitiesByCategory(): Map<string, Tsl6Item[]> {
  const map = new Map<string, Tsl6Item[]>();

  map.set("롤러 버튼", [
    makeScreenshotEntity("롤러 버튼", "오른쪽 롤러 위로 슬라이드", "우측 핸들 스크롤휠 위로 밀기", "右滚轮上划"),
    makeScreenshotEntity("롤러 버튼", "오른쪽 롤러 아래로 슬라이드", "우측 핸들 스크롤휠 아래로 밀기", "右滚轮下划"),
    makeScreenshotEntity("롤러 버튼", "오른쪽 롤러 왼쪽", "우측 핸들 스크롤휠 왼쪽으로 밀기", "右滚轮左划"),
    makeScreenshotEntity("롤러 버튼", "오른쪽 롤러 오른쪽", "우측 핸들 스크롤휠 오른쪽으로 밀기", "右滚轮右划"),
  ]);

  map.set("창문 버튼", [
    makeScreenshotEntity("창문 버튼", "왼쪽 앞쪽 창 위로 키를 두 번 누르십시오.", "좌측 창문 올림 버튼 2번 당김"),
    makeScreenshotEntity("창문 버튼", "오른쪽 앞쪽 창을 올려 두 번 뽑아라.", "우측 창문 올림 버튼 2번 당김"),
    makeScreenshotEntity("창문 버튼", "왼쪽 뒤쪽 창을 올려 두 번 뽑아라.", "좌측 2열 창문 올림 버튼 2번 당김"),
    makeScreenshotEntity("창문 버튼", "오른쪽 뒤쪽 창문 키를 2번 눌러", "우측 2열 창문 올림 버튼 2번 당김"),
  ]);

  map.set("자동차 속도 사건", [
    makeScreenshotEntity("자동차 속도 사건", "속도는 0시와 같습니다.", "차량 속도 0일 때", "车速 等于0时"),
    makeScreenshotEntity("자동차 속도 사건", "속도가 0시 이상", "차량 속도 0 이상일 때"),
    makeScreenshotEntity("자동차 속도 사건", "자동차 속도 5-10사이", "차량 속도 5~10일 때"),
    makeScreenshotEntity("자동차 속도 사건", "차량 속도 15-20사이", "차량 속도 15~20일 때"),
    makeScreenshotEntity("자동차 속도 사건", "속도 25-30사이", "차량 속도 25~30일 때"),
    makeScreenshotEntity("자동차 속도 사건", "자동차 속도 35-40사이", "차량 속도 35~40일 때"),
    makeScreenshotEntity("자동차 속도 사건", "속도 45-50사이", "차량 속도 45~50일 때"),
    makeScreenshotEntity("자동차 속도 사건", "자동차 속도 55-60사이", "차량 속도 55~60일 때"),
    makeScreenshotEntity("자동차 속도 사건", "과속하지 않을 때", "과속이 아닐 때"),
    makeScreenshotEntity("자동차 속도 사건", "속도가 초과되었을 때", "과속 상태일 때"),
    makeScreenshotEntity("자동차 속도 사건", "도로 속도 제한이 낮아질 때", "도로 제한 속도가 낮아질 때", "道路限速 降低时"),
    makeScreenshotEntity("자동차 속도 사건", "도로 속도 제한이 올라갈 때", "도로 제한 속도가 높아질 때", "道路限速 升高时"),
  ]);

  map.set("핸들 이벤트", [
    makeScreenshotEntity("핸들 이벤트", "핸들이 정시에 돌아온다.", "핸들이 중앙으로 돌아올 때"),
    makeScreenshotEntity("핸들 이벤트", "방향이 왼쪽으로 20도 이상이면", "핸들이 왼쪽으로 20° 이상일 때"),
    makeScreenshotEntity("핸들 이벤트", "방향이 왼쪽으로 45도 이상이면", "핸들이 왼쪽으로 45° 이상일 때"),
    makeScreenshotEntity("핸들 이벤트", "방향이 왼쪽으로 90도 이상이면", "핸들이 왼쪽으로 90° 이상일 때"),
    makeScreenshotEntity("핸들 이벤트", "방향이 오른쪽으로 20도 이상이면", "핸들이 오른쪽으로 20° 이상일 때"),
    makeScreenshotEntity("핸들 이벤트", "방향이 오른쪽으로 45도보다 큰 경우", "핸들이 오른쪽으로 45° 이상일 때"),
    makeScreenshotEntity("핸들 이벤트", "방향이 오른쪽으로 90도 이상이면", "핸들이 오른쪽으로 90° 이상일 때"),
  ]);

  map.set("보안 사건 (TSL8/9)", [
    makeScreenshotEntity("보안 사건 (TSL8/9)", "AP가 손길이 있으면 알림을 받을 때", "AP 손 경고 알림 수신 시"),
    makeScreenshotEntity("보안 사건 (TSL8/9)", "AP가 손을 잃어버릴 때", "AP 손 감지 해제 시"),
    makeScreenshotEntity("보안 사건 (TSL8/9)", "왼쪽 뒤의 블라인드 구역 자동차가 있을 때", "좌측 후측방 차량 감지 시"),
    makeScreenshotEntity("보안 사건 (TSL8/9)", "왼쪽 뒤의 시드 구역 자동차가 없는 경우", "좌측 후측방 차량 미감지 시"),
    makeScreenshotEntity("보안 사건 (TSL8/9)", "오른쪽 뒤의 블라인드 구역 자동차가 있을 때", "우측 후측방 차량 감지 시"),
    makeScreenshotEntity("보안 사건 (TSL8/9)", "오른쪽 후방 블라인드 구역 자동차가 없는 경우", "우측 후측방 차량 미감지 시"),
  ]);

  map.set("차 문 사건", [
    makeScreenshotEntity("차 문 사건", "앞 트렁크를 열 때", "프렁크 열릴 때"),
    makeScreenshotEntity("차 문 사건", "앞 트렁크를 닫을 때", "프렁크 닫힐 때"),
    makeScreenshotEntity("차 문 사건", "트렁크를 열 때", "트렁크 열릴 때"),
    makeScreenshotEntity("차 문 사건", "트렁크를 닫을 때", "트렁크 닫힐 때"),
  ]);

  return map;
}

function curateEntities(items: Tsl6Item[]): Tsl6Item[] {
  screenshotEntityIndex = 0;

  const base = items
    .filter((item) => !EXCLUDED_ENTITY_LABELS.has(item.ko))
    .map((item) => {
      const label = ENTITY_LABEL_OVERRIDES.get(item.zh) ?? item.ko;
      return {
        ...item,
        ko: label,
        categoryKo: remapEntityCategory({ ...item, ko: label }),
      };
    })
    .filter((item) => item.categoryKo !== "기타");

  const grouped = new Map<string, Tsl6Item[]>();
  for (const category of ENTITY_CATEGORY_ORDER) grouped.set(category, []);
  for (const item of base) {
    const bucket = grouped.get(item.categoryKo);
    if (bucket) bucket.push(item);
  }

  const supplements = createScreenshotOnlyEntitiesByCategory();
  for (const [category, extraItems] of supplements.entries()) {
    const bucket = grouped.get(category) ?? [];
    if (category === "자동차 속도 사건") {
      grouped.set(category, extraItems);
      continue;
    }
    grouped.set(category, [...bucket, ...extraItems]);
  }

  return ENTITY_CATEGORY_ORDER.flatMap((category) => grouped.get(category) ?? []);
}

function curateTsl6Data(data: Tsl6Data): Tsl6Data {
  return {
    ...data,
    functions: curateFunctions(data.functions),
    entities: curateEntities(data.entities),
  };
}

export function parseTsl6Extract(raw: string): Tsl6Data {
  const updatedAt =
    raw.match(/Update\s+(\d{4}\.\d{2}\.\d{2})/)?.[1] ?? undefined;
  const otaVersion =
    raw.match(/TSL6\s+-\s+OTA\s+([^\s]+)\s+기준/)?.[1] ?? undefined;

  const functions: Tsl6Item[] = [];
  const entities: Tsl6Item[] = [];

  let fnCategoryZh = "기타";
  let fnCategoryKo = "기타";
  let entCategoryZh = "기타";
  let entCategoryKo = "기타";

  let fnIdx = 0;
  let entIdx = 0;

  for (const line of raw.split(/\r?\n/)) {
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

  return curateTsl6Data({ updatedAt, otaVersion, functions, entities });
}

export async function loadTsl6Data(): Promise<Tsl6Data> {
  const filePath = path.join(process.cwd(), "references", "tsl6_extract_raw.txt");
  const raw = await fs.readFile(filePath, "utf-8");
  return parseTsl6Extract(raw);
}
