// =============================================================================
// 네오클라우드 기업 데이터 (큐레이션)
// -----------------------------------------------------------------------------
// 주가(price)·뉴스는 런타임에 서버 API 라우트로 실시간 조회됩니다.
// 수주잔고(backlog/RPO)·전력용량(GW)·매출·가동률은 공개 시세 API로 제공되지
// 않으므로 실적발표/공시(2026-06 기준)를 토대로 직접 큐레이션했습니다.
// 각 회사 sources에 근거 링크를 달아두었으니 분기 실적마다 갱신하세요.
// (모든 수치는 참고용이며 투자 권유가 아닙니다.)
// =============================================================================

export type Point = { t: string; v: number };
export type Metric = "backlog" | "capacity" | "revenue";
export type Source = { label: string; url: string };

export interface Company {
  symbol: string;          // 티커(공개) 또는 식별자(비상장)
  name: string;            // 회사명(국문)
  legalName: string;       // 영문명
  emoji: string;
  color: string;           // 브랜드 색
  tags: string[];
  hq: string;
  founded: number;
  oneLiner: string;
  about: string;
  private?: boolean;       // 비상장 여부
  // 현재 스냅샷 지표
  marketCap: number;       // 시총(공개) 또는 valuation(비상장) — 10억 USD
  revenueTTM: number;      // 매출 TTM (10억 USD)
  revenueGrowthYoY: number;// 매출 YoY 성장률 (%)
  backlog: number;         // 수주잔고/RPO/계약잔여 (10억 USD)
  powerSecured: number;    // 확보 전력 (GW)
  powerPipeline: number;   // 파이프라인 포함 총 전력 (GW)
  utilization: number;     // 용량 가동률 (%)
  arrNote?: string;        // ARR 가이던스 메모
  // 시계열
  backlogHistory: Point[]; // 분기별 수주잔고 (10억 USD)
  capacityHistory: Point[];// 분기별 확보 용량 (GW)
  revenueHistory: Point[]; // 분기별 매출 (10억 USD)
  // 투자 포인트
  catalysts: string[];
  risks: string[];
  keyCustomers: string[];
  sources: Source[];
  // 폴백용 최근가 (실시간 조회 실패/비상장 시)
  fallbackPrice: number;
  fallbackChangePct: number;
}

const Q = ["3Q24", "4Q24", "1Q25", "2Q25", "3Q25", "4Q25", "1Q26", "2Q26"];
const series = (vals: number[]): Point[] => vals.map((v, i) => ({ t: Q[i], v }));

export const COMPANIES: Company[] = [
  {
    symbol: "ORCL",
    name: "오라클",
    legalName: "Oracle Corporation",
    emoji: "🟥",
    color: "#C74634",
    tags: ["하이퍼스케일", "OCI", "RPO 1위", "Stargate"],
    hq: "미국 텍사스 오스틴",
    founded: 1977,
    oneLiner: "RPO 553조원대, 네오클라우드 수주잔고의 절대 강자",
    about:
      "Oracle Cloud Infrastructure(OCI)로 대규모 AI 학습 수요를 흡수하며 RPO(잔여 이행 의무)가 폭증했다. OpenAI와 5년 약 3,000억 달러 규모 계약, Stargate 참여로 멀티기가와트급 캐파를 확보. 전통 SW 강자에서 AI 인프라 핵심 대형주로 재평가.",
    marketCap: 560,
    revenueTTM: 60,
    revenueGrowthYoY: 12,
    backlog: 553,
    powerSecured: 7.5,
    powerPipeline: 15,
    utilization: 88,
    arrNote: "OCI 매출 전년비 +50%대 고성장",
    backlogHistory: series([99, 130, 138, 138, 455, 523, 553, 560]),
    capacityHistory: series([1.3, 1.7, 2.2, 2.9, 4.5, 6.0, 7.5, 8.5]),
    revenueHistory: series([13.3, 14.1, 12.4, 15.9, 14.9, 16.3, 15.0, 17.0]),
    catalysts: [
      "RPO 분기마다 신기록 ($138B→$455B→$523B→$553B)",
      "OpenAI 5년 ~$300B 계약·Stargate 참여",
      "OCI 매출 +50%대, AI 학습 캐파 선점",
    ],
    risks: [
      "사상 최대 캐펙스·차입 부담",
      "OpenAI 등 고객 집중도",
      "전력·납기 지연 리스크",
    ],
    keyCustomers: ["OpenAI", "xAI", "Meta", "Nvidia"],
    sources: [
      { label: "Oracle 8-K (RPO $553B)", url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001341439&type=8-K" },
      { label: "Reuters/Fool 분석", url: "https://www.fool.com/investing/2026/03/18/oracles-backlog-potential-windfall-or-ticking-time/" },
    ],
    fallbackPrice: 198.0,
    fallbackChangePct: 1.6,
  },
  {
    symbol: "CRWV",
    name: "코어위브",
    legalName: "CoreWeave, Inc.",
    emoji: "🟦",
    color: "#0A66FF",
    tags: ["네오클라우드", "GPU", "백로그 $99B", "Meta"],
    hq: "미국 뉴저지 리빙스턴",
    founded: 2017,
    oneLiner: "백로그 $99B·3.5GW, GPU 클라우드 순수 플레이어의 상징",
    about:
      "Nvidia GPU 기반 AI 전용 클라우드. 2025년 상장 후 1Q26 백로그가 $99.4B로 사상 최대 분기 수주를 기록(분기 중 $40B+ 신규, Meta $21B 포함). 총 계약 전력 약 3.5GW로 수주잔고의 실체를 뒷받침.",
    marketCap: 90,
    revenueTTM: 5.0,
    revenueGrowthYoY: 210,
    backlog: 99,
    powerSecured: 3.5,
    powerPipeline: 5.0,
    utilization: 95,
    arrNote: "백로그 36%를 24개월 내, 75%를 4년 내 인식 전망",
    backlogHistory: series([12, 15, 18, 26, 30, 58, 99, 105]),
    capacityHistory: series([0.6, 0.9, 1.3, 1.6, 1.9, 2.6, 3.5, 3.8]),
    revenueHistory: series([0.34, 0.5, 0.7, 0.9, 1.0, 1.2, 1.4, 1.6]),
    catalysts: [
      "1Q26 백로그 $99.4B, 분기 $40B+ 신규 수주",
      "Meta와 $21B 계약 체결",
      "Blackwell(GB200/GB300) 조기 도입",
    ],
    risks: [
      "분기 순손실·높은 리스/차입 부담",
      "MS·OpenAI·Meta 고객 집중",
      "GPU 감가상각·캐파 제약",
    ],
    keyCustomers: ["Microsoft", "OpenAI", "Meta", "Nvidia"],
    sources: [
      { label: "CoreWeave 1Q26 실적", url: "https://investors.coreweave.com/news/news-details/2026/CoreWeave-Reports-Strong-First-Quarter-2026-Results/" },
      { label: "CNBC Q1 리포트", url: "https://www.cnbc.com/2026/05/07/coreweave-crwv-q1-earnings-report-2026.html" },
    ],
    fallbackPrice: 102.0,
    fallbackChangePct: -2.1,
  },
  {
    symbol: "NBIS",
    name: "네비우스",
    legalName: "Nebius Group N.V.",
    emoji: "🟩",
    color: "#1FB85A",
    tags: ["네오클라우드", "풀스택", "MS 계약", "유럽"],
    hq: "네덜란드 암스테르담",
    founded: 2024,
    oneLiner: "MS 최대 $19.4B 계약, 풀스택 AI 클라우드 신성",
    about:
      "구 Yandex에서 분리된 글로벌 AI 인프라 기업. Microsoft와 최대 $19.4B 5년 계약, Meta와 $3B 계약 등 누적 약 $44B 계약을 확보. 현재 캐파는 매진 상태이며 2026년 말 2.5GW를 목표. 2026년 말 ARR $7~9B를 가이던스로 제시.",
    marketCap: 30,
    revenueTTM: 1.0,
    revenueGrowthYoY: 355,
    backlog: 44,
    powerSecured: 1.0,
    powerPipeline: 2.5,
    utilization: 100,
    arrNote: "2026년 말 ARR $7~9B 목표 (2025말 ~$1B)",
    backlogHistory: series([2, 3, 5, 9, 17, 30, 44, 48]),
    capacityHistory: series([0.2, 0.3, 0.5, 0.7, 0.9, 1.0, 1.2, 1.5]),
    revenueHistory: series([0.08, 0.12, 0.14, 0.18, 0.25, 0.35, 0.5, 0.7]),
    catalysts: [
      "Microsoft 최대 $19.4B 계약(Vineland NJ)",
      "Meta $3B 계약, 캐파 매진",
      "2026말 2.5GW·ARR $7~9B 목표",
    ],
    risks: ["짧은 트랙레코드", "현금 소진 속도", "지정학·규제 잔존 리스크"],
    keyCustomers: ["Microsoft", "Meta", "Nvidia"],
    sources: [
      { label: "Nebius 6-K (MS 계약)", url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001513845&type=6-K" },
      { label: "DCD: 2.5GW·매진", url: "https://www.datacenterdynamics.com/en/news/nebius-signs-3bn-deal-with-meta-says-current-available-capacity-is-sold-out-as-it-targets-25gw-by-end-of-2026/" },
    ],
    fallbackPrice: 116.0,
    fallbackChangePct: 3.0,
  },
  {
    symbol: "IREN",
    name: "아이렌",
    legalName: "IREN Limited",
    emoji: "🟪",
    color: "#7C5CFF",
    tags: ["네오클라우드", "자체전력 4.5GW", "MS·NVDA", "AI+BTC"],
    hq: "호주 시드니",
    founded: 2018,
    oneLiner: "확보 전력 4.5GW+, MS $9.7B·NVDA $3.4B 계약",
    about:
      "구 Iris Energy. 재생에너지 기반 자체 데이터센터를 보유하며 BTC에서 AI 클라우드로 빠르게 전환. Microsoft와 $9.7B AI 클라우드 계약(Childress 750MW, $1.9B 선수금), NVIDIA와 $3.4B 계약 체결. 오클라호마 1.6GW 추가로 확보 전력이 4.5GW를 상회.",
    marketCap: 15,
    revenueTTM: 0.6,
    revenueGrowthYoY: 200,
    backlog: 13.1,
    powerSecured: 4.5,
    powerPipeline: 6.0,
    utilization: 85,
    arrNote: "2026말 ARR $4.4B 목표 (MS+NVDA)",
    backlogHistory: series([0.2, 0.5, 1, 2, 5, 9.7, 13.1, 14]),
    capacityHistory: series([1.0, 1.4, 1.8, 2.2, 2.7, 3.5, 4.5, 5.2]),
    revenueHistory: series([0.07, 0.11, 0.14, 0.16, 0.19, 0.24, 0.3, 0.38]),
    catalysts: [
      "Microsoft $9.7B AI 클라우드 계약($1.9B 선수금)",
      "NVIDIA $3.4B Blackwell 계약",
      "오클라호마 1.6GW로 확보전력 4.5GW+",
    ],
    risks: ["BTC 가격 변동성", "AI 전환 실행 리스크", "대규모 자본조달"],
    keyCustomers: ["Microsoft", "Nvidia"],
    sources: [
      { label: "IREN: MS $9.7B 계약", url: "https://iren.com/resources/blog/iren-signs97-billion-agreement-with-microsoft-to-deploy-ai-cloud-infrastructure" },
      { label: "IREN 8-K ($44B ARR/백로그)", url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001878848&type=8-K" },
    ],
    fallbackPrice: 46.0,
    fallbackChangePct: 5.0,
  },
  {
    symbol: "APLD",
    name: "어플라이드 디지털",
    legalName: "Applied Digital Corporation",
    emoji: "🟧",
    color: "#FF7A00",
    tags: ["HPC 호스팅", "CoreWeave 임대", "노스다코타"],
    hq: "미국 텍사스 댈러스",
    founded: 2001,
    oneLiner: "CoreWeave에 400MW 임대, 계약잔고 약 $11B",
    about:
      "저렴·친환경 전력 기반 HPC/AI 데이터센터 개발·운영. CoreWeave와 15년 장기 임대(테이크-오어-페이)로 총 400MW·약 $11B 계약 수익을 확보(초기 $7B 포함). Polaris Forge 1 캠퍼스는 1GW까지 확장 설계.",
    marketCap: 5.0,
    revenueTTM: 0.3,
    revenueGrowthYoY: 80,
    backlog: 11,
    powerSecured: 0.4,
    powerPipeline: 1.0,
    utilization: 90,
    arrNote: "100MW 1동 가동, 150MW 2동 2026 중 가동 예정",
    backlogHistory: series([0.5, 1, 2, 4, 7, 9, 11, 11]),
    capacityHistory: series([0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.55]),
    revenueHistory: series([0.05, 0.06, 0.06, 0.06, 0.06, 0.07, 0.07, 0.08]),
    catalysts: [
      "CoreWeave 15년 임대·총 400MW($11B)",
      "Polaris Forge 1동(100MW) 가동",
      "추가 하이퍼스케일 고객 유치 여지",
    ],
    risks: ["단일 고객(CoreWeave) 의존", "건설·납기 지연", "증자 희석"],
    keyCustomers: ["CoreWeave"],
    sources: [
      { label: "APLD: CoreWeave 추가 150MW", url: "https://ir.applieddigital.com/news-events/press-releases/detail/128/applied-digital-finalizes-additional-150mw-lease-with" },
      { label: "JSA: $7B 15년 임대", url: "https://www.jsa.net/applied-digital-secures-7b-in-landmark-15-year-ai-infrastructure-leases-with-coreweave/" },
    ],
    fallbackPrice: 12.5,
    fallbackChangePct: -1.0,
  },
  {
    symbol: "CIFR",
    name: "사이퍼 마이닝",
    legalName: "Cipher Mining Inc.",
    emoji: "🟨",
    color: "#0EA5A5",
    tags: ["HPC 전환", "Fluidstack", "Google 백스톱"],
    hq: "미국 뉴욕",
    founded: 2020,
    oneLiner: "Fluidstack 224MW·$3.8B, 구글이 보증한 AI 호스팅",
    about:
      "BTC 채굴에서 AI/HPC 호스팅으로 전환 중. Fluidstack와 10년 AI 호스팅 계약(168MW+56MW=224MW 핵심 IT, 약 $3.8B)을 체결했고, Google이 약 $1.73B를 백스톱하며 지분을 확보. 텍사스 Barber Lake 사이트가 거점.",
    marketCap: 5.0,
    revenueTTM: 0.2,
    revenueGrowthYoY: -5,
    backlog: 3.8,
    powerSecured: 0.22,
    powerPipeline: 0.5,
    utilization: 80,
    arrNote: "Fluidstack 1·2단계 합산 ~$3.8B(10년)",
    backlogHistory: series([0, 0, 0, 0, 0, 3.0, 3.8, 3.8]),
    capacityHistory: series([0.02, 0.03, 0.05, 0.05, 0.06, 0.17, 0.22, 0.3]),
    revenueHistory: series([0.05, 0.04, 0.04, 0.05, 0.05, 0.05, 0.06, 0.06]),
    catalysts: [
      "Fluidstack 224MW·$3.8B AI 호스팅 계약",
      "Google $1.73B 백스톱·지분 참여",
      "Barber Lake 244MW 가동(2026~27)",
    ],
    risks: ["BTC 의존도 잔존", "Fluidstack 단일 고객", "건설 실행 리스크"],
    keyCustomers: ["Fluidstack (Google 백스톱)"],
    sources: [
      { label: "Cipher: 168MW Fluidstack", url: "https://investors.ciphermining.com/news-releases/news-release-details/cipher-mining-signs-168-mw-10-year-ai-hosting-agreement" },
      { label: "Cipher: 추가 56MW", url: "https://www.globenewswire.com/news-release/2025/11/20/3191801/0/en/Cipher-Mining-Signs-Additional-56-MW-10-Year-AI-Hosting-Agreement-with-Fluidstack.html" },
    ],
    fallbackPrice: 15.0,
    fallbackChangePct: 2.4,
  },
  {
    symbol: "CRUSOE",
    name: "크루소",
    legalName: "Crusoe Energy Systems",
    emoji: "⬛️",
    color: "#111827",
    tags: ["비상장", "Stargate", "Abilene 2.1GW", "AI 팩토리"],
    hq: "미국 콜로라도 덴버",
    founded: 2018,
    private: true,
    oneLiner: "OpenAI Stargate 아빌린 캠퍼스 건설사 (밸류 $10B+)",
    about:
      "친환경 전력 기반 'AI 팩토리' 개발사. OpenAI의 Stargate 프로젝트 핵심인 텍사스 아빌린 1.2GW 캠퍼스를 $11.6B 조달로 건설했고, Microsoft용 900MW를 추가해 아빌린 footprint가 약 2.1GW로 확장. 2025년 10월 Series E($1.375B)로 밸류 $10B 돌파.",
    marketCap: 10,
    revenueTTM: 0.9,
    revenueGrowthYoY: 250,
    backlog: 15,
    powerSecured: 1.2,
    powerPipeline: 2.1,
    utilization: 92,
    arrNote: "비상장 — 밸류에이션 $10B+ (Series E)",
    backlogHistory: series([1, 2, 4, 6, 9, 12, 15, 18]),
    capacityHistory: series([0.2, 0.3, 0.5, 0.7, 1.0, 1.2, 1.6, 2.1]),
    revenueHistory: series([0.15, 0.2, 0.3, 0.4, 0.5, 0.7, 0.9, 1.1]),
    catalysts: [
      "OpenAI Stargate 아빌린 1.2GW 가동",
      "Microsoft 900MW 추가 → 2.1GW",
      "$11.6B 조달, NVIDIA 등 투자 참여",
    ],
    risks: ["비상장(직접 투자 불가)", "OpenAI/MS 의존", "대규모 부채"],
    keyCustomers: ["OpenAI", "Microsoft", "Oracle"],
    sources: [
      { label: "DCD: $11.6B 아빌린", url: "https://www.datacenterdynamics.com/en/news/crusoe-secures-116bn-in-debt-and-equity-for-openais-stargate-data-center-campus-in-abilene-texas/" },
      { label: "Crusoe Series E", url: "https://www.crusoe.ai/resources/newsroom/crusoe-announces-series-e-funding" },
    ],
    fallbackPrice: 0,
    fallbackChangePct: 0,
  },
  {
    symbol: "LAMBDA",
    name: "람다",
    legalName: "Lambda, Inc.",
    emoji: "⬜️",
    color: "#6D28D9",
    tags: ["비상장", "MS 계약", "GPU 클라우드", "밸류 $6B"],
    hq: "미국 캘리포니아 샌프란시스코",
    founded: 2012,
    private: true,
    oneLiner: "Microsoft 수십억 달러 계약, 독립 GPU 클라우드 강자",
    about:
      "독립계 GPU 클라우드. 2025년 11월 Microsoft와 수십억 달러 규모 AI 인프라 계약(GB300 NVL72 포함)을 발표하고 Series E($1.5B)를 유치, 세컨더리 밸류는 최대 $6B. 캔자스시티 100MW AI 팩토리로 산업 규모 확장.",
    marketCap: 6,
    revenueTTM: 0.5,
    revenueGrowthYoY: 120,
    backlog: 6,
    powerSecured: 0.1,
    powerPipeline: 0.5,
    utilization: 95,
    arrNote: "비상장 — 밸류에이션 ~$6B (세컨더리)",
    backlogHistory: series([0.5, 1, 1.5, 2, 3, 4, 6, 7]),
    capacityHistory: series([0.02, 0.03, 0.04, 0.05, 0.06, 0.08, 0.1, 0.15]),
    revenueHistory: series([0.08, 0.1, 0.11, 0.12, 0.12, 0.13, 0.14, 0.15]),
    catalysts: [
      "Microsoft 수십억 달러 계약(GB300)",
      "Series E $1.5B 유치, 밸류 ~$6B",
      "캔자스시티 100MW AI 팩토리",
    ],
    risks: ["비상장(직접 투자 불가)", "MS 의존", "대형 경쟁사 대비 규모"],
    keyCustomers: ["Microsoft", "AI 연구소"],
    sources: [
      { label: "Lambda: MS 계약", url: "https://lambda.ai/blog/lambda-announces-multibillion-dollar-agreement-with-microsoft-to-deploy-ai-infrastructure-powered-by-tens-of-thousands-of-nvidia-gpus" },
      { label: "TechCrunch: $1.5B 라운드", url: "https://techcrunch.com/2025/11/18/ai-data-center-provider-lambda-raises-whopping-1-5b-after-multibillion-dollar-microsoft-deal/" },
    ],
    fallbackPrice: 0,
    fallbackChangePct: 0,
  },
];

export const SYMBOLS = COMPANIES.map((c) => c.symbol);
// 실시간 주가 조회는 상장사만
export const PUBLIC_SYMBOLS = COMPANIES.filter((c) => !c.private).map(
  (c) => c.symbol
);

export function getCompany(symbol: string): Company | undefined {
  return COMPANIES.find((c) => c.symbol.toLowerCase() === symbol.toLowerCase());
}

// 지표별 시계열/현재값/단위 헬퍼 (차트·랭킹 공통)
export function metricHistory(c: Company, m: Metric): Point[] {
  if (m === "capacity") return c.capacityHistory;
  if (m === "revenue") return c.revenueHistory;
  return c.backlogHistory;
}
export function metricValue(c: Company, m: Metric): number {
  if (m === "capacity") return c.powerSecured;
  if (m === "revenue") return c.revenueTTM;
  return c.backlog;
}
export const METRIC_META: Record<
  Metric,
  { label: string; short: string; unit: "$B" | "GW" }
> = {
  backlog: { label: "수주잔고", short: "잔고", unit: "$B" },
  capacity: { label: "확보 용량", short: "용량", unit: "GW" },
  revenue: { label: "매출(TTM)", short: "매출", unit: "$B" },
};

export const DATA_AS_OF = "2026-06-12";

// =============================================================================
// 밸류에이션 배수 (현재 스냅샷 기준 계산)
// 네오클라우드 특화 지표: 전력 1GW당 가치, 수주잔고 대비 시총, 수주 커버리지
// =============================================================================
export type ValMetric = "ps" | "backlogMult" | "perGW" | "coverage";

export const VAL_META: Record<
  ValMetric,
  {
    label: string;
    desc: string;
    unit: string;
    decimals: number;
    lowerBetter: boolean; // true=낮을수록 저평가/매력
  }
> = {
  ps: {
    label: "P/S (시총/매출)",
    desc: "매출 대비 시가총액. 낮을수록 매출 기준 저평가.",
    unit: "x",
    decimals: 1,
    lowerBetter: true,
  },
  backlogMult: {
    label: "시총/수주잔고",
    desc: "확보한 수주잔고 대비 시총. 낮을수록 잔고가 시총보다 큼(매력).",
    unit: "x",
    decimals: 2,
    lowerBetter: true,
  },
  perGW: {
    label: "전력 1GW당 가치",
    desc: "확보 전력 1GW당 시가총액. 낮을수록 캐파 대비 저평가.",
    unit: "$B/GW",
    decimals: 1,
    lowerBetter: true,
  },
  coverage: {
    label: "수주 커버리지",
    desc: "수주잔고가 TTM 매출의 몇 배인지(향후 매출 가시성). 높을수록 좋음.",
    unit: "년분",
    decimals: 0,
    lowerBetter: false,
  },
};

export function valValue(c: Company, m: ValMetric): number {
  switch (m) {
    case "ps":
      return c.revenueTTM ? c.marketCap / c.revenueTTM : 0;
    case "backlogMult":
      return c.backlog ? c.marketCap / c.backlog : 0;
    case "perGW":
      return c.powerSecured ? c.marketCap / c.powerSecured : 0;
    case "coverage":
      return c.revenueTTM ? c.backlog / c.revenueTTM : 0;
  }
}

export function fmtVal(v: number, m: ValMetric): string {
  const meta = VAL_META[m];
  const num = v.toFixed(meta.decimals);
  return meta.unit === "x"
    ? `${num}x`
    : meta.unit === "$B/GW"
    ? `$${num}B/GW`
    : `${num}${meta.unit}`;
}
