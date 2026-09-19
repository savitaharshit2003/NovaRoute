// import {LocationData} from '../services/locationService';

// const OCM_API_KEY = '8b7abe0f-54bf-49ea-ad60-958eaefcf55c';

// const API_URL = 'https://api.openchargemap.io/v3/poi/';

// export type ChargingStation = {
//   id: string;
//   name: string;
//   latitude: number;
//   longitude: number;
//   address: string;
//   distance: string;
//   power: string;
//   connector: string;
//   status: string;
// };

// export const getNearbyChargingStations = async (
//   location: LocationData,
// ): Promise<ChargingStation[]> => {
//   if (!OCM_API_KEY) {
//     throw new Error('Open Charge Map API key is missing.');
//   }

//   const params = new URLSearchParams({
//     output: 'json',
//     latitude: location.latitude.toString(),
//     longitude: location.longitude.toString(),
//     distance: '25',
//     distanceunit: 'KM',
//     maxresults: '50',
//     compact: 'true',
//     verbose: 'false',
//     key: OCM_API_KEY,
//   });

//   const response = await fetch(`${API_URL}?${params.toString()}`);

//   if (!response.ok) {
//     throw new Error(
//       `Charging station API failed: ${response.status}`,
//     );
//   }

//   const data = await response.json();

//   return data
//     .filter(
//       (station: any) =>
//         station.AddressInfo?.Latitude &&
//         station.AddressInfo?.Longitude,
//     )
//     .map((station: any) => {
//       const connections = station.Connections || [];

//       const powerValues = connections
//         .map((connection: any) => connection.PowerKW)
//         .filter((power: any) => power);

//       const connectorNames = connections
//         .map(
//           (connection: any) =>
//             connection.ConnectionType?.Title,
//         )
//         .filter((connector: any) => connector);

//       const power =
//         powerValues.length > 0
//           ? `${Math.max(...powerValues)} kW`
//           : 'Power unavailable';

//       const connector =
//         connectorNames.length > 0
//           ? connectorNames.join(' • ')
//           : 'Connector unavailable';

//       return {
//         id: station.ID?.toString() || Math.random().toString(),
//         name:
//           station.AddressInfo.Title ||
//           'EV Charging Station',
//         latitude: station.AddressInfo.Latitude,
//         longitude: station.AddressInfo.Longitude,
//         address: [
//           station.AddressInfo.AddressLine1,
//           station.AddressInfo.Town,
//           station.AddressInfo.StateOrProvince,
//         ]
//           .filter(Boolean)
//           .join(', '),
//         distance: station.AddressInfo.Distance
//           ? `${station.AddressInfo.Distance.toFixed(1)} km`
//           : 'Distance unavailable',
//         power,
//         connector,
//         status:
//           station.StatusType?.Title ||
//           'Status unavailable',
//       };
//     });
// };




import {LocationData} from '../services/locationService';

const OCM_API_KEY = '8b7abe0f-54bf-49ea-ad60-958eaefcf55c';
const API_URL = 'https://api.openchargemap.io/v3/poi/';

export type ChargingStation = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  distance: string;
  power: string;
  connector: string;
  status: string;
};

export const getNearbyChargingStations = async (
  location: LocationData,
): Promise<ChargingStation[]> => {
  try {
    console.log('Searching stations near:', location);

    const params = new URLSearchParams({
      output: 'json',
      latitude: location.latitude.toString(),
      longitude: location.longitude.toString(),
      distance: '500',
      distanceunit: 'KM',
      maxresults: '200',
      compact: 'false',
      verbose: 'false',
      key: OCM_API_KEY,
    });

    const url = `${API_URL}?${params.toString()}`;

    console.log('Charging station API URL:', url);

    const response = await fetch(url);

    console.log('Charging station API status:', response.status);

    const responseText = await response.text();

    console.log('Charging station API response:', responseText);

    if (!response.ok) {
      throw new Error(
        `Charging station API failed: ${response.status} ${responseText}`,
      );
    }

    const data = JSON.parse(responseText);

    console.log('Total stations received:', data.length);

    return data
      .filter(
        (station: any) =>
          station.AddressInfo?.Latitude != null &&
          station.AddressInfo?.Longitude != null,
      )
      .map((station: any) => {
        const connections = station.Connections || [];

        const powerValues = connections
          .map((connection: any) => connection.PowerKW)
          .filter((power: any) => power != null);

        const connectorNames = connections
          .map((connection: any) => connection.ConnectionType?.Title)
          .filter((connector: any) => connector);

        return {
          id: station.ID?.toString() || Math.random().toString(),
          name: station.AddressInfo.Title || 'EV Charging Station',
          latitude: station.AddressInfo.Latitude,
          longitude: station.AddressInfo.Longitude,
          address: [
            station.AddressInfo.AddressLine1,
            station.AddressInfo.Town,
            station.AddressInfo.StateOrProvince,
          ]
            .filter(Boolean)
            .join(', '),
          distance:
            station.AddressInfo.Distance != null
              ? `${station.AddressInfo.Distance.toFixed(1)} km`
              : 'Distance unavailable',
          power:
            powerValues.length > 0
              ? `${Math.max(...powerValues)} kW`
              : 'Power unavailable',
          connector:
            connectorNames.length > 0
              ? connectorNames.join(' • ')
              : 'Connector unavailable',
          status: station.StatusType?.Title || 'Status unavailable',
        };
      });
  } catch (error) {
    console.error('Charging station API error:', error);
    throw error;
  }
};