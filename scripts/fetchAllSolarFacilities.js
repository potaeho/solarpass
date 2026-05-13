/**
 * 전국태양광발전소 전기사업허가정보 전체 수집 스크립트
 * 실행: node scripts/fetchAllSolarFacilities.js
 * 출력: src/constants/solarFacilityData.ts
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const API_KEY = 'fc737012337588717f7a5d04bba72eb71d707e313f1fc2590a1911bd9b48baaf';
const BASE_URL = 'https://api.data.go.kr/openapi/tn_pubr_public_solar_gen_flct_api';
const ROWS_PER_PAGE = 1000;
const DELAY_MS = 300; // 요청 간격 (rate limiting)

// ── 도명 정규화 ──────────────────────────────────────────────────────────────
const SHORT_TO_PROVINCE = {
  '서울': '서울특별시',  '부산': '부산광역시',  '대구': '대구광역시',
  '인천': '인천광역시',  '광주': '광주광역시',  '대전': '대전광역시',
  '울산': '울산광역시',  '세종': '세종특별자치시',
  '경기': '경기도',      '강원': '강원도',
  '충북': '충청북도',    '충남': '충청남도',
  '전북': '전라북도',    '전남': '전라남도',
  '경북': '경상북도',    '경남': '경상남도',
  '제주': '제주특별자치도',
};
const FULL_TO_PROVINCE = {
  '서울특별시': '서울특별시',  '부산광역시': '부산광역시',  '대구광역시': '대구광역시',
  '인천광역시': '인천광역시',  '광주광역시': '광주광역시',  '대전광역시': '대전광역시',
  '울산광역시': '울산광역시',  '세종특별자치시': '세종특별자치시',
  '경기도': '경기도',          '강원도': '강원도',           '강원특별자치도': '강원도',
  '충청북도': '충청북도',      '충청남도': '충청남도',
  '전라북도': '전라북도',      '전북특별자치도': '전라북도',
  '전라남도': '전라남도',
  '경상북도': '경상북도',      '경상남도': '경상남도',
  '제주특별자치도': '제주특별자치도',
};

function parseAddress(lotAddr, roadAddr) {
  const addr = (lotAddr || roadAddr || '').trim();
  if (!addr) return { province: null, city: null };

  const parts = addr.split(/\s+/);
  if (parts.length < 2) return { province: null, city: null };

  const first = parts[0];
  let province = FULL_TO_PROVINCE[first] || SHORT_TO_PROVINCE[first] || null;

  // 시/군/구로 끝나는 두 번째 토큰을 city로
  let city = null;
  for (let i = 1; i < Math.min(parts.length, 4); i++) {
    if (/[시군구]$/.test(parts[i])) {
      city = parts[i];
      break;
    }
  }

  return { province, city };
}

// ── HTTP 요청 ─────────────────────────────────────────────────────────────────
function fetchPage(pageNo) {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}?serviceKey=${API_KEY}&pageNo=${pageNo}&numOfRows=${ROWS_PER_PAGE}&type=json`;
    const req = https.get(url, { headers: { Accept: 'application/json' }, timeout: 30000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const j = JSON.parse(data);
          const body = j?.response?.body;
          if (!body) throw new Error(`No body: ${data.slice(0, 200)}`);
          const items = Array.isArray(body.items)
            ? body.items
            : (Array.isArray(body.items?.item) ? body.items.item
              : (body.items?.item ? [body.items.item] : []));
          resolve({ items, totalCount: Number(body.totalCount) || 0 });
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
  });
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ── 집계 ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('▶ 전국 태양광발전소 데이터 수집 시작...\n');

  // 1페이지로 totalCount 확인
  const first = await fetchPage(1);
  const totalCount = first.totalCount;
  const totalPages = Math.ceil(totalCount / ROWS_PER_PAGE);
  console.log(`총 ${totalCount}건 / ${totalPages}페이지\n`);

  // 도·시군구별 집계 맵
  // key: "전라남도" or "전라남도|나주시"
  const stats = {};
  const topFacilitiesMap = {}; // key → [{name, capacityKW, status, address}]

  function ensureKey(key) {
    if (!stats[key]) {
      stats[key] = { totalCount: 0, totalCapacityKW: 0, operatingCount: 0, constructingCount: 0 };
      topFacilitiesMap[key] = [];
    }
  }

  function addItem(key, item, capacityKW) {
    ensureKey(key);
    stats[key].totalCount++;
    stats[key].totalCapacityKW += capacityKW;
    if (item.oprtngSttsSeNm === '정상가동') stats[key].operatingCount++;
    if (item.oprtngSttsSeNm === '공사중' || item.oprtngSttsSeNm === '공사') stats[key].constructingCount++;
    topFacilitiesMap[key].push({
      name: item.solarGenFcltNm || '(이름 없음)',
      capacityKW,
      status: item.oprtngSttsSeNm || '-',
      address: item.lctnLotnoAddr || item.lctnRoadNmAddr || '',
    });
  }

  // 모든 페이지 수집
  for (let page = 1; page <= totalPages; page++) {
    const items = page === 1 ? first.items : (await fetchPage(page)).items;
    process.stdout.write(`\r페이지 ${page}/${totalPages} (${items.length}건)  `);

    for (const item of items) {
      const capacityKW = parseFloat(item.capa) || 0;
      const { province, city } = parseAddress(item.lctnLotnoAddr, item.lctnRoadNmAddr);
      if (!province) continue;

      addItem(province, item, capacityKW);
      if (city) addItem(`${province}|${city}`, item, capacityKW);
    }

    if (page < totalPages) await sleep(DELAY_MS);
  }

  console.log('\n\n▶ 상위 시설 정렬 중...');

  // 각 key별 상위 20개만 용량순으로 유지
  for (const key of Object.keys(topFacilitiesMap)) {
    topFacilitiesMap[key].sort((a, b) => b.capacityKW - a.capacityKW);
    topFacilitiesMap[key] = topFacilitiesMap[key].slice(0, 20);
  }

  // ── TypeScript 파일 생성 ───────────────────────────────────────────────────
  console.log('▶ TypeScript 파일 생성 중...');

  const provinces = Object.keys(stats).filter(k => !k.includes('|')).sort();
  const cities = Object.keys(stats).filter(k => k.includes('|')).sort();

  const lines = [
    '// 이 파일은 scripts/fetchAllSolarFacilities.js 로 자동 생성됩니다.',
    `// 생성일시: ${new Date().toISOString()}`,
    `// 수집 총계: ${totalCount}건`,
    '',
    'export type FacilityStat = {',
    '  totalCount: number;',
    '  totalCapacityKW: number;',
    '  operatingCount: number;',
    '  constructingCount: number;',
    '  topFacilities: { name: string; capacityKW: number; status: string; address: string }[];',
    '};',
    '',
    '// 도·특별시 단위 집계',
    'export const PROVINCE_STATS: Record<string, FacilityStat> = {',
  ];

  for (const prov of provinces) {
    const s = stats[prov];
    const top = topFacilitiesMap[prov];
    lines.push(`  ${JSON.stringify(prov)}: {`);
    lines.push(`    totalCount: ${s.totalCount},`);
    lines.push(`    totalCapacityKW: ${Math.round(s.totalCapacityKW * 100) / 100},`);
    lines.push(`    operatingCount: ${s.operatingCount},`);
    lines.push(`    constructingCount: ${s.constructingCount},`);
    lines.push(`    topFacilities: ${JSON.stringify(top)},`);
    lines.push(`  },`);
  }
  lines.push('};', '', '// 시·군·구 단위 집계', 'export const CITY_STATS: Record<string, FacilityStat> = {');

  for (const key of cities) {
    const [prov, city] = key.split('|');
    const s = stats[key];
    const top = topFacilitiesMap[key];
    const keyStr = `${prov}_${city}`;
    lines.push(`  ${JSON.stringify(keyStr)}: {`);
    lines.push(`    totalCount: ${s.totalCount},`);
    lines.push(`    totalCapacityKW: ${Math.round(s.totalCapacityKW * 100) / 100},`);
    lines.push(`    operatingCount: ${s.operatingCount},`);
    lines.push(`    constructingCount: ${s.constructingCount},`);
    lines.push(`    topFacilities: ${JSON.stringify(top)},`);
    lines.push(`  },`);
  }
  lines.push('};', '', '// 조회 헬퍼', 'export function getFacilityStat(province: string, city?: string): FacilityStat | undefined {');
  lines.push("  if (city) return CITY_STATS[`${province}_${city}`];");
  lines.push('  return PROVINCE_STATS[province];');
  lines.push('}');

  const outPath = path.join(__dirname, '../src/constants/solarFacilityData.ts');
  fs.writeFileSync(outPath, lines.join('\n'), 'utf8');

  const fileSize = (fs.statSync(outPath).size / 1024).toFixed(1);
  console.log(`\n✅ 완료: ${outPath} (${fileSize} KB)`);
  console.log(`   - 도 단위: ${provinces.length}개`);
  console.log(`   - 시·군·구 단위: ${cities.length}개`);
}

main().catch(err => {
  console.error('\n❌ 오류:', err.message);
  process.exit(1);
});
