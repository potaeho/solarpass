import { useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import type BottomSheet from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import { useMapStore } from '../../src/stores/useMapStore';
import RegionBottomSheet from '../../src/components/map/RegionBottomSheet';
import MapLegend from '../../src/components/map/MapLegend';
import SolarZoneMarker from '../../src/components/map/SolarZoneMarker';
import GridCapacityModal from '../../src/components/map/GridCapacityModal';
import { MOCK_REGIONS } from '../../src/constants/regions';
import type { Region } from '../../src/types/region';

const INITIAL_REGION = {
  latitude: 36.5,
  longitude: 127.8,
  latitudeDelta: 4.5,
  longitudeDelta: 4.5,
};

export default function MapHome() {
  const router = useRouter();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { selectedRegion, setSelectedRegion } = useMapStore();
  const [zoomLevel, setZoomLevel] = useState(7);
  const [showGridModal, setShowGridModal] = useState(false);

  const handleMarkerPress = (region: Region) => {
    setSelectedRegion(region);
    bottomSheetRef.current?.snapToIndex(0);
  };

  const handleDetailPress = (region: Region) => {
    router.push(`/region/${region.id}`);
  };

  const handleCityListPress = (region: Region) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (router.push as any)(`/province/${region.id}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        provider={PROVIDER_GOOGLE}
        initialRegion={INITIAL_REGION}
        showsUserLocation
        onRegionChange={region => {
          const zoom = Math.round(Math.log(360 / region.longitudeDelta) / Math.LN2);
          setZoomLevel(zoom);
        }}
      >
        {MOCK_REGIONS.map(region => (
          <Marker
            key={region.id}
            coordinate={{ latitude: region.latitude, longitude: region.longitude }}
            onPress={() => handleMarkerPress(region)}
            tracksViewChanges={false}
          >
            <SolarZoneMarker
              solarGrade={region.solarGrade}
              label={region.shortName}
              zoomLevel={zoomLevel}
            />
          </Marker>
        ))}
      </MapView>
      <View style={styles.legend}>
        <MapLegend />
      </View>
      <RegionBottomSheet
        ref={bottomSheetRef}
        region={selectedRegion}
        onDetailPress={handleDetailPress}
        onGridPress={() => setShowGridModal(true)}
        onCityListPress={handleCityListPress}
      />
      <GridCapacityModal
        visible={showGridModal}
        onClose={() => setShowGridModal(false)}
        region={selectedRegion}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  legend: { position: 'absolute', top: 60, left: 16 },
});
