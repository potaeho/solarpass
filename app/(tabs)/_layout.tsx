import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const TAB_CONFIG: { name: string; label: string; icon: IoniconName; activeIcon: IoniconName }[] = [
  { name: 'index',  label: '지도',       icon: 'map-outline',           activeIcon: 'map' },
  { name: 'permit', label: '인허가',     icon: 'document-text-outline', activeIcon: 'document-text' },
  { name: 'status', label: '진행현황',   icon: 'stats-chart-outline',   activeIcon: 'stats-chart' },
  { name: 'office', label: '토목사무소', icon: 'business-outline',      activeIcon: 'business' },
  { name: 'my',     label: 'MY',         icon: 'person-outline',        activeIcon: 'person' },
];

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: '#999999',
        tabBarStyle: { borderTopColor: Colors.border },
        headerShown: false,
      }}
    >
      {TAB_CONFIG.map(tab => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.label,
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons name={focused ? tab.activeIcon : tab.icon} size={size} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
