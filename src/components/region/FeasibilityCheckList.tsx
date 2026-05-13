import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CHECK_STATUS_CONFIG, FEASIBILITY_CHECK_LABELS } from '../../constants/feasibility';
import type { FeasibilityCheck } from '../../types/region';
import GridCapacityBar from './GridCapacityBar';

type Props = { checks: FeasibilityCheck[] };

// 항목·상태별 상세 설명 생성
function buildDetailText(check: FeasibilityCheck): string {
  const { id, status, gridCapacity } = check;

  if (id === 'grid_capacity' && gridCapacity) {
    const usageRate = Math.round((gridCapacity.usedMW / gridCapacity.totalMW) * 100);
    if (status === 'fail') {
      return `총 ${gridCapacity.totalMW.toLocaleString()}MW 중 ${gridCapacity.usedMW.toLocaleString()}MW 사용(${usageRate}%) — 잔여 ${gridCapacity.availableMW}MW, 접속 대기 ${gridCapacity.waitingQueue}건으로 신규 접속이 사실상 불가능합니다. 한전 계통 증설 일정 확인 후 재검토를 권장합니다.`;
    }
    if (status === 'warning') {
      return `총 ${gridCapacity.totalMW.toLocaleString()}MW 중 ${gridCapacity.usedMW.toLocaleString()}MW 사용(${usageRate}%) — 잔여 ${gridCapacity.availableMW}MW 남아 있으나 접속 대기 ${gridCapacity.waitingQueue}건으로 인해 접속 신청 후 수개월 이상 대기가 예상됩니다.`;
    }
    return `총 ${gridCapacity.totalMW.toLocaleString()}MW 중 ${gridCapacity.usedMW.toLocaleString()}MW 사용(${usageRate}%) — 잔여 용량 ${gridCapacity.availableMW}MW로 신규 접속이 비교적 원활합니다.`;
  }

  const DETAIL: Record<string, Record<string, string>> = {
    land_use: {
      pass:    '농지·임야 전용 허가 가능 지역으로 개발행위허가 진행에 제한이 없습니다. 필지별 정밀 확인은 luris.go.kr 토지이용규제서비스를 활용하세요.',
      warning: '일부 필지에 토지 이용 제한이 있습니다. 부지 선정 전 luris.go.kr에서 필지별 규제 사항을 반드시 확인하고, 전용 가능 여부를 담당 기관과 사전 협의하세요.',
      fail:    '보전관리지역·절대농지 등으로 지정되어 태양광 설치를 위한 농지·임야 전용이 불가합니다. 해당 지역 내 부지 확보는 현실적으로 어렵습니다.',
    },
    setback_distance: {
      pass:    '주거지역·도로·문화재·보호구역 등으로부터의 이격거리 기준을 충족합니다. 최종 부지 확정 전 인근 시설물 이격 여부를 재확인하세요.',
      warning: '일부 지역에서 주거지·도로 이격거리 기준 충족 여부의 정밀 검토가 필요합니다. 지자체별 이격거리 조례 내용을 확인하고 부지를 선정하세요.',
      fail:    '이격거리 규정상 기준을 충족하는 부지 확보가 어렵습니다. 설치 가능한 부지를 찾더라도 추가 완충 조치가 요구될 수 있습니다.',
    },
    national_law: {
      pass:    '신에너지 및 재생에너지 개발·이용·보급 촉진법, 전기사업법 등 관련 법령 요건을 충족합니다. 인허가 절차에 따라 순차 진행이 가능합니다.',
      warning: '일부 법령 요건에 대해 추가 서류 제출 또는 전문가 검토가 필요합니다. 인허가 전 전기사업법·태양광 관련 시행령을 확인하세요.',
      fail:    '현행 법령 요건을 충족하지 못하는 항목이 있습니다. 인허가 진행 전 관련 법령 전문가와 사전 검토를 받으세요.',
    },
    local_ordinance: {
      pass:    '해당 지자체의 태양광 설치 관련 조례상 특별한 추가 제한이 없습니다. 인허가 신청 시 별도의 추가 절차 없이 진행 가능합니다.',
      warning: '경관심의·주민동의서 제출 등 지자체 고유 추가 요건이 있습니다. 인허가 착수 전 담당 부서(환경·건축과)와 사전 협의를 강력히 권장합니다.',
      fail:    '지자체 조례에 의해 설치가 제한되는 지역입니다. 조례 개정 여부를 지속 모니터링하거나 인접 지역을 검토하세요.',
    },
  };

  return DETAIL[id]?.[status] ?? '';
}

const FeasibilityCheckList = ({ checks }: Props) => (
  <View style={styles.container}>
    {checks.map(check => {
      const config = CHECK_STATUS_CONFIG[check.status];
      const detail = buildDetailText(check);
      return (
        <View key={check.id} style={styles.item}>
          <View style={[styles.iconWrap, { backgroundColor: config.bg }]}>
            <Ionicons name={config.icon as never} size={20} color={config.color} />
          </View>
          <View style={styles.content}>
            <Text style={styles.title}>{FEASIBILITY_CHECK_LABELS[check.id]}</Text>
            <Text style={styles.summary}>{check.description}</Text>
            {detail ? <Text style={styles.detail}>{detail}</Text> : null}
            {check.id === 'grid_capacity' && check.gridCapacity && (
              <GridCapacityBar data={check.gridCapacity} />
            )}
          </View>
        </View>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingVertical: 8 },
  item: { flexDirection: 'row', paddingVertical: 14, gap: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  iconWrap: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginTop: 1 },
  content: { flex: 1 },
  title: { fontSize: 14, fontWeight: '700', color: '#1A1A1A', marginBottom: 3 },
  summary: { fontSize: 13, fontWeight: '500', color: '#444444', marginBottom: 4 },
  detail: { fontSize: 12, color: '#777777', lineHeight: 18 },
});

export default FeasibilityCheckList;
