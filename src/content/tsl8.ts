export type SettingOption = { value: string; label: string };

export type SettingRow = {
  id: string;
  label: string;
  labelKoApp?: string;
  labelZh?: string;
  valueExample?: string;
  options?: SettingOption[];
  help?: string;
  caution?: "info" | "warning";
};

export type SettingSection = {
  id: string;
  title: string;
  titleZh?: string;
  rows: SettingRow[];
};

export const tsl8ApAssistParams: SettingSection = {
  id: "ap-assist-params",
  title: "AP 보조 매개변수 설정",
  titleZh: "AP辅助参数设置",
  rows: [
    {
      id: "ap_auto_assist",
      label: "AP 자동 지원",
      labelKoApp: "AP 자동 지원",
      labelZh: "AP自动辅助",
      valueExample: "AP 따라가기 (기본값)",
      help: "AP 상태에 맞춰 보조 동작을 따라가도록 설정합니다.",
    },
    {
      id: "ap_assist_mode",
      label: "AP 지원 방식",
      labelKoApp: "AP 지원 방법",
      labelZh: "AP辅助方式",
      valueExample: "무감지 보조",
      help: "앱에서 표시되는 보조 방식 옵션을 선택합니다.",
    },
    {
      id: "module_auto_op",
      label: "모듈 자동 조작",
      labelKoApp: "모듈 자동 조작",
      labelZh: "模块自动操作",
      valueExample: "오른쪽 스크롤휠 - 속도",
      help: "자동 조작에 사용할 입력(예: 오른쪽 스크롤휠)을 선택합니다.",
    },
    {
      id: "wheel_op_interval",
      label: "스크롤휠 조작 주기",
      labelKoApp: "롤러 작동 시간",
      labelZh: "滚轮操作时间",
      valueExample: "2~3초 랜덤 (기본값)",
      help: "자동 조작을 실행하는 시간 간격(주기)을 설정합니다.",
    },
    {
      id: "wheel_random",
      label: "랜덤 주기 사용",
      labelKoApp: "롤러 랜덤 시간",
      labelZh: "滚轮随机时间",
      valueExample: "켜기 (기본값)",
      help: "주기를 고정하지 않고 랜덤으로 적용할지 여부입니다.",
    },
    {
      id: "inc_dec_interval",
      label: "증감(±) 간격",
      labelKoApp: "시간 간격을 곱하기",
      labelZh: "加减时间间隔",
      valueExample: "0.5초",
      help: "자동 조작 시 증/감 동작 사이의 간격을 의미합니다.",
    },
    {
      id: "inc_dec_type",
      label: "자동 증감 유형",
      labelKoApp: "자동 곱하기 유형",
      labelZh: "自动加减类型",
      valueExample: "먼저 줄이고, 그 다음 늘리기 (기본값)",
      help: "자동 조작 시 ‘줄이기/늘리기’ 적용 순서를 선택합니다.",
    },
  ],
};

export const tsl8BasicSettings: SettingSection = {
  id: "basic-settings",
  title: "기본 기능 설정",
  titleZh: "基本功能设置",
  rows: [
    {
      id: "module_master",
      label: "모듈 전체 스위치",
      labelKoApp: "모듈 총 스위치",
      labelZh: "模块总开关",
      valueExample: "모듈 사용 (기본값)",
      help: "모듈 기능을 전체적으로 활성/비활성화합니다.",
    },
    {
      id: "ap_restore",
      label: "AP 복구",
      labelKoApp: "AP 복구",
      labelZh: "AP恢复",
      valueExample: "AP 따라가기",
      help: "AP 상태에 맞춰 복구 동작을 수행하는 옵션입니다.",
    },
    {
      id: "one_key_ap",
      label: "원터치 AP",
      labelKoApp: "단단어 AP",
      labelZh: "一键AP",
      valueExample: "켜기",
      help: "앱에서 제공하는 ‘원터치 AP’ 기능의 사용 여부입니다.",
      caution: "warning",
    },
    {
      id: "ap_overspeed_exit",
      label: "AP 과속 시 자동 해제",
      labelKoApp: "AP 과속 탈퇴",
      labelZh: "AP超速退出",
      valueExample: "켜기",
      help: "AP 상태에서 과속 조건 시 자동으로 해제하도록 설정합니다.",
    },
    {
      id: "eap_assist",
      label: "EAP 보조",
      labelKoApp: "EAP 지원",
      labelZh: "EAP辅助",
      valueExample: "끄기 (기본값)",
      help: "EAP 보조 관련 옵션입니다. 차량/지역/법규에 따라 동작이 다를 수 있습니다.",
      caution: "warning",
    },
    {
      id: "disable_auto_wiper",
      label: "자동 와이퍼 끄기",
      labelKoApp: "자동 빗기 끄기",
      labelZh: "关闭自动雨刮",
      valueExample: "켜기",
      help: "‘자동 와이퍼를 끄는 기능’을 켜는 옵션입니다. (표기 주의)",
    },
    {
      id: "dynamic_brake_light",
      label: "동적 브레이크 라이트",
      labelKoApp: "동적 브레이크 라이트",
      labelZh: "动态刹车灯",
      valueExample: "끄기 (기본값)",
      help: "급감속 등 조건에서 브레이크등 점멸 형태를 바꾸는 옵션입니다.",
      caution: "warning",
    },
    {
      id: "manual_high_beam",
      label: "수동 상향등",
      labelKoApp: "수동 광경",
      labelZh: "手动远光",
      valueExample: "끄기 (기본값)",
      help: "상향등 관련 동작을 수동 모드로 제어하는 옵션입니다.",
    },
    {
      id: "high_beam_flash_3",
      label: "상향등 3회 점멸",
      labelKoApp: "멀리 빛을 세 번 깜박입니다.",
      labelZh: "远光闪3次",
      valueExample: "끄기 (기본값)",
      help: "상향등을 3회 점멸하는 동작 사용 여부입니다.",
    },
    {
      id: "high_beam_strobe_speed",
      label: "상향등 스트로브(빠른 점멸) 속도",
      labelKoApp: "원광 폭발 속도",
      labelZh: "远光爆闪速度",
      valueExample: "끄기 (기본값)",
      help: "상향등을 빠르게 점멸시키는 기능의 속도/사용 여부입니다.",
      caution: "warning",
    },
    {
      id: "front_fog_strobe",
      label: "전면 안개등 스트로브(빠른 점멸)",
      labelKoApp: "전면 스무드램프가 폭발하다",
      labelZh: "前雾灯爆闪",
      valueExample: "끄기 (기본값)",
      help: "전면 안개등을 빠르게 점멸시키는 기능입니다.",
      caution: "warning",
    },
    {
      id: "rear_fog_strobe",
      label: "후방 안개등 스트로브(빠른 점멸)",
      labelKoApp: "뒷미래등이 깜박거리다",
      labelZh: "后雾灯爆闪",
      valueExample: "끄기 (기본값)",
      help: "후방 안개등을 빠르게 점멸시키는 기능입니다.",
      caution: "warning",
    },
    {
      id: "low_speed_beep",
      label: "저속 경고음(가벼운 경적)",
      labelKoApp: "낮은 속도의 가벼운 휘파람",
      labelZh: "低速轻鸣笛",
      valueExample: "끄기 (기본값)",
      help: "저속 조건에서 가벼운 경고음을 내는 기능입니다.",
      caution: "warning",
    },
    {
      id: "pulse_horn_speed",
      label: "펄스 경적 속도",
      labelKoApp: "펄스 스피커 속도",
      labelZh: "脉冲喇叭速度",
      valueExample: "끄기 (기본값)",
      help: "펄스 경적(연속 경적) 관련 속도/사용 여부입니다.",
      caution: "warning",
    },
    {
      id: "horn_link_high_beam",
      label: "경적 → 상향등 연동",
      labelKoApp: "호파가 원광을 연결하다.",
      labelZh: "喇叭联动远光",
      valueExample: "끄기 (기본값)",
      help: "경적 동작 시 상향등 동작을 함께 수행하도록 연동합니다.",
      caution: "warning",
    },
    {
      id: "high_beam_link_horn",
      label: "상향등 → 경적 연동",
      labelKoApp: "원광연동 호어",
      labelZh: "远光联动喇叭",
      valueExample: "끄기 (기본값)",
      help: "상향등 동작 시 경적 동작을 함께 수행하도록 연동합니다.",
      caution: "warning",
    },
    {
      id: "turn_signal_priority",
      label: "방향지시등 우선",
      labelKoApp: "라이트가 우선",
      labelZh: "转向灯优先",
      valueExample: "끄기 (기본값)",
      help: "방향지시등/조명 우선 동작 관련 옵션입니다.",
    },
    {
      id: "door_open_hazard",
      label: "문 열림 시 비상등 점멸",
      labelKoApp: "문을 열어 플래그",
      labelZh: "开门双闪灯",
      valueExample: "켜기",
      help: "도어가 열릴 때 주변 차량/보행자에게 알림이 필요할 때 유용합니다.",
    },
    {
      id: "reverse_hazard",
      label: "후진 시 비상등 점멸",
      labelKoApp: "역전등",
      labelZh: "倒车双闪灯",
      valueExample: "켜기",
      help: "후진 시 비상등을 점멸시키는 옵션입니다.",
    },
    {
      id: "energy_recovery",
      label: "에너지 회수 제동(회생제동) 설정",
      labelKoApp: "에너지 회수 브레이크",
      labelZh: "能量回收制动",
      valueExample: "차량 설정(기본값)",
      help: "회생제동 동작을 차량 설정에 따를지(기본값) 등의 옵션입니다.",
      caution: "warning",
    },
    {
      id: "stop_mode_setting",
      label: "정지 모드 설정(홀드/롤/크립 등)",
      labelKoApp: "정지 모드 설정",
      labelZh: "停止模式设置",
      valueExample: "차량 설정(기본값)",
      help: "정지 모드(홀드/크립/롤) 동작을 차량 설정에 따를지 등의 옵션입니다.",
      caution: "warning",
    },
    {
      id: "auto_sport_mode",
      label: "자동 스포츠 모드",
      labelKoApp: "자동 운동 모드",
      labelZh: "自动运动模式",
      valueExample: "끄기 (기본값)",
      help: "조건에 따라 스포츠 모드를 자동으로 전환하는 옵션입니다.",
      caution: "warning",
    },
    {
      id: "auto_strong_park",
      label: "자동 강제 주차 브레이크",
      labelKoApp: "자동 강차 정차",
      labelZh: "自动强驻车",
      valueExample: "끄기 (기본값)",
      help: "조건에 따라 강제 주차 브레이크를 수행하는 옵션입니다.",
      caution: "warning",
    },
    {
      id: "passenger_easy_entry",
      label: "조수석 편의 승하차",
      labelKoApp: "부운전자가 출입이 편리하다",
      labelZh: "副驾便利进出",
      valueExample: "조수석 안전벨트 해제 시",
      help: "조수석 승하차 편의 동작을 언제 실행할지 조건을 선택합니다.",
    },
    {
      id: "handle_frunk",
      label: "도어핸들 스위치: 앞 트렁크",
      labelKoApp: "문 손잡이 스위치 앞 트렁크",
      labelZh: "门把手开关前备箱",
      valueExample: "5초 길게 당기기",
      help: "도어핸들 스위치로 프렁크를 여는 동작 설정입니다.",
    },
    {
      id: "handle_charge_port",
      label: "도어핸들 스위치: 충전 포트",
      labelKoApp: "도어 손잡이 스위치 충전 포트",
      labelZh: "门把手开关充电口",
      valueExample: "끄기 (기본값)",
      help: "도어핸들 스위치로 충전포트를 여는 동작 설정입니다.",
    },
    {
      id: "lab_features",
      label: "실험실 기능",
      labelKoApp: "실험실 기능",
      labelZh: "实验室功能",
      valueExample: "켜기",
      help: "실험/베타 기능을 활성화합니다. 동작이 바뀌거나 불안정할 수 있습니다.",
      caution: "warning",
    },
    {
      id: "ac_auto_dry",
      label: "에어컨 자동 건조",
      labelKoApp: "에어컨 자동 건조",
      labelZh: "空调自动干燥",
      valueExample: "5분 건조",
      help: "일정 조건에서 에어컨 건조를 수행하도록 설정합니다.",
    },
    {
      id: "reverse_rear_fog",
      label: "후진 후 후방 안개등 조명",
      labelKoApp: "역차 후의 안개등 조명",
      labelZh: "倒车后雾灯照明",
      valueExample: "끄기 (기본값)",
      help: "후진 후 후방 안개등 조명 관련 옵션입니다.",
    },
    {
      id: "turn_assist_light",
      label: "전환 보조 조명",
      labelKoApp: "조종 조명",
      labelZh: "转向辅助照明",
      valueExample: "끄기 (기본값)",
      help: "회전/방향지시 조건에서 보조 조명을 켜는 옵션입니다.",
    },
  ],
};

export type QuickCommandExample = {
  triggerKo: string;
  actionKo: string;
};

export const quickCommandExamples: QuickCommandExample[] = [
  { triggerKo: "운전석 허리받침 아래 버튼 두 번 누르기", actionKo: "글로브박스 열기" },
  { triggerKo: "좌측 방향이 90° 이상일 때", actionKo: "좌회전 보조 조명" },
  { triggerKo: "우측 방향이 90° 이상일 때", actionKo: "우회전 보조 조명" },
  { triggerKo: "D 기어 진입 시", actionKo: "정지 모드: 홀드 유지" },
  { triggerKo: "R 기어 진입 시", actionKo: "정지 모드: 크립(저속 진행)" },
];

export const tsl8QuickCommandTriggerSuggestions = [
  { label: "운전석 허리받침 아래 버튼 두 번 누르기", meta: "버튼" },
  { label: "좌측 방향이 90° 이상일 때", meta: "차량 상태" },
  { label: "우측 방향이 90° 이상일 때", meta: "차량 상태" },
  { label: "D 기어 진입 시", meta: "기어" },
  { label: "R 기어 진입 시", meta: "기어" },
];

export const tsl8QuickCommandActionSuggestions = [
  { label: "글로브박스 열기", meta: "차량 제어" },
  { label: "좌회전 보조 조명", meta: "조명" },
  { label: "우회전 보조 조명", meta: "조명" },
  { label: "정지 모드: 홀드 유지", meta: "정지 모드" },
  { label: "정지 모드: 크립(저속 진행)", meta: "정지 모드" },
];
