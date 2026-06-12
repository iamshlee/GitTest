// =============================================================================
// 네오클라우드 기업 데이터 (큐레이션)
// -----------------------------------------------------------------------------
// 주가(price)·뉴스는 런타임에 서버 API 라우트로 실시간 조회됩니다.
// 수주잔고(backlog/RPO)와 전력·용량 확보(GW)는 공개 API로 제공되지 않으므로
// 실적발표/공시 기반으로 직접 큐레이션한 값입니다. 분기 실적이 나올 때마다
// 아래 시계열을 갱신하세요. (모든 수치는 예시·참고용이며 투자 판단의 근거가
// 아닙니다.)
// =============================================================================

export type Point = { t: string; v: number };

export interface Company {
  symbol: string;          // 티커 (실시간 주가/뉴스 조회 키)
  name: string;            // 회사명(국문)
  legalName: string;       // 영문명
  emoji: string;           // 로고 대용 이모지
  color: string;           // 브랜드 색 (차트/뱃지)
  tags: string[];          // 분류 태그
  hq: string;              // 본사
  founded: number;         // 설립연도
  oneLiner: string;        // 한 줄 소개
  about: string;           // 설명
  // 현재 스냅샷 지표 (참고용)
  marketCap: number;       // 시가총액 (10억 USD)
  revenueTTM: number;      // 매출 TTM (10억 USD)
  backlog: number;         // 수주잔고/RPO (10억 USD)
  powerSecured: number;    // 확보 전력/용량 (GW)
  // 시계열
  backlogHistory: Point[]; // 분기별 수주잔고 (10억 USD)
  capacityHistory: Point[];// 분기별 확보 용량 (GW)
  // 투자 포인트
  catalysts: string[];     // 주가 촉매/모멘텀
  risks: string[];         // 리스크
  keyCustomers: string[];  // 주요 고객/파트너
  // 폴백용 최근가 (실시간 조회 실패 시 사용)
  fallbackPrice: number;
  fallbackChangePct: number;
}

// 분기 라벨 헬퍼
const Q = ["1Q24", "2Q24", "3Q24", "4Q24", "1Q25", "2Q25", "3Q25", "4Q25"];
const series = (vals: number[]): Point[] =>
  vals.map((v, i) => ({ t: Q[i], v }));

export const COMPANIES: Company[] = [
  {
    symbol: "ORCL",
    name: "오라클",
    legalName: "Oracle Corporation",
    emoji: "🟥",
    color: "#C74634",
    tags: ["하이퍼스케일", "OCI", "DB", "AI 인프라"],
    hq: "미국 텍사스 오스틴",
    founded: 1977,
    oneLiner: "OCI로 AI 클라우드 수주잔고를 폭발적으로 늘리는 전통 강자",
    about:
      "Oracle Cloud Infrastructure(OCI)를 통해 대규모 AI 학습 수요를 흡수하며 RPO(잔여 이행 의무)가 급증했다. OpenAI·xAI 등과의 멀티기가와트급 계약(Stargate 포함)으로 네오클라우드 테마의 핵심 대형주로 부상.",
    marketCap: 520,
    revenueTTM: 57,
    backlog: 455,
    powerSecured: 6.0,
    backlogHistory: series([80, 98, 99, 130, 138, 138, 455, 500]),
    capacityHistory: series([0.8, 1.0, 1.3, 1.7, 2.2, 2.9, 4.5, 6.0]),
    catalysts: [
      "RPO(수주잔고) 분기마다 신기록 경신",
      "OpenAI·Stargate 멀티기가와트 캐파 계약",
      "OCI 매출 고성장(전년비 +50%대)",
    ],
    risks: ["대규모 캐펙스 부담", "고객 집중도(OpenAI 비중)", "전력·납기 리스크"],
    keyCustomers: ["OpenAI", "xAI", "Nvidia", "Meta"],
    fallbackPrice: 195.4,
    fallbackChangePct: 1.8,
  },
  {
    symbol: "CRWV",
    name: "코어위브",
    legalName: "CoreWeave, Inc.",
    emoji: "🟦",
    color: "#0A66FF",
    tags: ["네오클라우드", "GPU", "AI 전용", "IPO 25"],
    hq: "미국 뉴저지 리빙스턴",
    founded: 2017,
    oneLiner: "GPU 클라우드 순수 플레이어, 네오클라우드의 상징",
    about:
      "Nvidia GPU 기반 AI 전용 클라우드. 2025년 상장 후 대형 학습·추론 워크로드 계약으로 수주잔고가 급증. Microsoft·OpenAI 등과의 장기 계약이 백로그의 핵심.",
    marketCap: 70,
    revenueTTM: 5.0,
    backlog: 30,
    powerSecured: 2.2,
    backlogHistory: series([4, 7, 12, 15, 18, 26, 30, 33]),
    capacityHistory: series([0.3, 0.4, 0.6, 0.9, 1.3, 1.6, 1.9, 2.2]),
    catalysts: [
      "OpenAI 대형 장기계약 체결",
      "Blackwell(GB200) 조기 도입",
      "수주잔고 → 매출 전환 가속",
    ],
    risks: ["높은 부채·리스 부담", "고객 집중(MS/OpenAI)", "GPU 감가상각"],
    keyCustomers: ["Microsoft", "OpenAI", "Nvidia", "Meta"],
    fallbackPrice: 78.2,
    fallbackChangePct: -2.4,
  },
  {
    symbol: "NBIS",
    name: "네비우스",
    legalName: "Nebius Group N.V.",
    emoji: "🟩",
    color: "#1FB85A",
    tags: ["네오클라우드", "GPU", "유럽", "풀스택"],
    hq: "네덜란드 암스테르담",
    founded: 2024,
    oneLiner: "구 얀덱스 분사, 유럽 기반 풀스택 AI 클라우드",
    about:
      "Yandex에서 분리된 글로벌 AI 인프라 기업. 자체 설계 데이터센터와 소프트웨어 스택을 갖춘 풀스택 네오클라우드로, 유럽·미국에 캐파를 빠르게 확장 중. Microsoft와의 대형 캐파 계약으로 주목.",
    marketCap: 28,
    revenueTTM: 0.9,
    backlog: 19,
    powerSecured: 1.0,
    backlogHistory: series([0.5, 1, 2, 3, 5, 9, 17, 19]),
    capacityHistory: series([0.05, 0.1, 0.2, 0.3, 0.5, 0.7, 0.9, 1.0]),
    catalysts: [
      "Microsoft 대형 캐파 공급계약(~수십억 달러)",
      "Nvidia 지분 투자·파트너십",
      "자회사(Toloka, Avride) 가치",
    ],
    risks: ["짧은 트랙레코드", "지정학·규제", "현금소진 속도"],
    keyCustomers: ["Microsoft", "Nvidia", "Meta"],
    fallbackPrice: 112.6,
    fallbackChangePct: 3.1,
  },
  {
    symbol: "IREN",
    name: "아이렌",
    legalName: "IREN Limited",
    emoji: "🟪",
    color: "#7C5CFF",
    tags: ["네오클라우드", "AI+BTC", "자체전력", "호주"],
    hq: "호주 시드니",
    founded: 2018,
    oneLiner: "자체 전력·데이터센터 보유, BTC에서 AI 클라우드로 피벗",
    about:
      "구 Iris Energy. 재생에너지 기반 자체 데이터센터를 보유하며 비트코인 채굴에서 AI 클라우드(GPU)로 사업을 빠르게 전환. 전력 확보가 강점으로, 대형 AI 호스팅 계약 가능성이 모멘텀.",
    marketCap: 12,
    revenueTTM: 0.5,
    backlog: 9.7,
    powerSecured: 2.9,
    backlogHistory: series([0, 0, 0.2, 0.5, 1, 2, 9.7, 11]),
    capacityHistory: series([0.6, 0.8, 1.0, 1.4, 1.8, 2.2, 2.7, 2.9]),
    catalysts: [
      "대형 AI 클라우드 호스팅 계약 체결",
      "자체 전력 파이프라인(수 GW)",
      "AI 매출 비중 상승",
    ],
    risks: ["BTC 가격 변동성", "AI 전환 실행 리스크", "자본조달"],
    keyCustomers: ["Microsoft", "AI 스타트업"],
    fallbackPrice: 41.3,
    fallbackChangePct: 5.2,
  },
  {
    symbol: "APLD",
    name: "어플라이드 디지털",
    legalName: "Applied Digital Corporation",
    emoji: "🟧",
    color: "#FF7A00",
    tags: ["HPC 호스팅", "데이터센터", "전력"],
    hq: "미국 텍사스 댈러스",
    founded: 2001,
    oneLiner: "노스다코타 전력 거점의 HPC 데이터센터 개발·호스팅",
    about:
      "저렴한 전력을 기반으로 대규모 HPC/AI 데이터센터를 개발·운영. CoreWeave 등과의 장기 임대(테이크-오어-페이) 계약으로 백로그를 확보. 캐파 가동률 상승이 핵심 모멘텀.",
    marketCap: 4.5,
    revenueTTM: 0.3,
    backlog: 7.0,
    powerSecured: 0.4,
    backlogHistory: series([0.2, 0.3, 0.5, 1, 2, 4, 7, 11]),
    capacityHistory: series([0.05, 0.1, 0.1, 0.2, 0.25, 0.3, 0.4, 0.4]),
    catalysts: [
      "CoreWeave 장기 리스 계약(15년)",
      "Ellendale 캠퍼스 가동",
      "추가 하이퍼스케일 고객 유치",
    ],
    risks: ["건설·납기 지연", "자금조달 희석", "단일 고객 의존"],
    keyCustomers: ["CoreWeave"],
    fallbackPrice: 9.8,
    fallbackChangePct: -1.2,
  },
  {
    symbol: "WULF",
    name: "테라울프",
    legalName: "TeraWulf Inc.",
    emoji: "🟨",
    color: "#E0A800",
    tags: ["HPC 호스팅", "원자력전력", "AI 전환"],
    hq: "미국 메릴랜드",
    founded: 2021,
    oneLiner: "원자력 인접 전력으로 무탄소 AI 데이터센터 호스팅",
    about:
      "뉴욕 Lake Mariner 사이트에서 원자력 인접 전력을 활용한 무탄소 데이터센터를 운영. AI/HPC 호스팅 계약으로 사업을 전환 중이며, 전력의 친환경성이 차별점.",
    marketCap: 3.0,
    revenueTTM: 0.16,
    backlog: 3.7,
    powerSecured: 0.5,
    backlogHistory: series([0, 0, 0.1, 0.2, 0.5, 1.5, 3.7, 4.0]),
    capacityHistory: series([0.1, 0.15, 0.2, 0.25, 0.3, 0.4, 0.5, 0.5]),
    catalysts: [
      "AI 호스팅 장기계약 체결",
      "무탄소(원자력) 전력 프리미엄",
      "Lake Mariner 캐파 확장",
    ],
    risks: ["BTC 의존도 잔존", "소규모·변동성", "실행 리스크"],
    keyCustomers: ["Core42(G42)", "Fluidstack"],
    fallbackPrice: 6.4,
    fallbackChangePct: 2.0,
  },
];

export const SYMBOLS = COMPANIES.map((c) => c.symbol);

export function getCompany(symbol: string): Company | undefined {
  return COMPANIES.find((c) => c.symbol.toLowerCase() === symbol.toLowerCase());
}

// 최종 데이터 갱신일 — 화면에 노출
export const DATA_AS_OF = "2026-06-12";
