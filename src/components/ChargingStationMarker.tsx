import React from 'react';
import {Text} from 'react-native';
import {Marker} from 'react-native-maps';

import {ChargingStation} from '../api/chargingStationApi';

type ChargingStationMarkerProps = {
  station: ChargingStation;
};

const ChargingStationMarker = ({
  station,
}: ChargingStationMarkerProps) => {
  return (
    <Marker
      coordinate={{
        latitude: station.latitude,
        longitude: station.longitude,
      }}
      title={station.name}
      description={`${station.power} • ${station.connector}`}
      pinColor="#16A34A">
      <Text style={{fontSize: 28}}>⚡</Text>
    </Marker>
  );
};

export default ChargingStationMarker;