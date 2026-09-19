import React from 'react';
import {StyleSheet, View} from 'react-native';
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
} from 'react-native-maps';

import {
  ChargingStation,
} from '../api/chargingStationApi';
import ChargingStationMarker from './ChargingStationMarker';

type MapViewComponentProps = {
  latitude: number;
  longitude: number;
  stations: ChargingStation[];
};

const MapViewComponent = ({
  latitude,
  longitude,
  stations,
}: MapViewComponentProps) => {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}>

        <Marker
          coordinate={{
            latitude,
            longitude,
          }}
          title="Your Location"
          description="You are here"
          pinColor="#2563EB"
        />

        {stations.map(station => (
          <ChargingStationMarker
            key={station.id}
            station={station}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 250,
    borderRadius: 18,
    overflow: 'hidden',
  },

  map: {
    flex: 1,
  },
});

export default MapViewComponent;