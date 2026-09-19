// import Geolocation from '@react-native-community/geolocation';
// import {Linking, Platform} from 'react-native';
// export type LocationData = {
//   latitude: number;
//   longitude: number;
//   city: string;
//   state: string;
//   country: string;
// };

// export const getCurrentLocation = (): Promise<LocationData> => {
//   return new Promise((resolve, reject) => {
//     Geolocation.getCurrentPosition(
//       async position => {
//         const {latitude, longitude} = position.coords;

//         try {
//           const response = await fetch(
//             `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
//             {
//               headers: {
//                 'User-Agent': 'EVChargeFinder/1.0',
//               },
//             },
//           );

//           if (!response.ok) {
//             throw new Error('Unable to fetch location name');
//           }

//           const data = await response.json();

//           const address = data.address || {};

//           const city =
//             address.city ||
//             address.town ||
//             address.village ||
//             address.municipality ||
//             address.county ||
//             'Current Location';

//           const state = address.state || '';

//           const country = address.country || '';

//           resolve({
//             latitude,
//             longitude,
//             city,
//             state,
//             country,
//           });
//         } catch (error) {
//           console.log('Reverse geocoding error:', error);

//           // GPS worked, but location-name service failed.
//           resolve({
//             latitude,
//             longitude,
//             city: 'Current Location',
//             state: '',
//             country: '',
//           });
//         }
//       },
//       error => {
//         console.log('GPS Location Error:', error);
//         reject(error);
//       },
//       {
//   enableHighAccuracy: true,
//   timeout: 30000,
//   maximumAge: 60000,

//       },
//     );
//   });
// };

// export const openLocationSettings = async (): Promise<void> => {
//   if (Platform.OS === 'android') {
//     await Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS');
//   }
// };















import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

export type LocationData = {
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  country: string;
};

const requestLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') {
    return true;
  }

  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: 'Location Permission',
      message:
        'EVChargeFinder needs your location to find nearby charging stations.',
      buttonPositive: 'Allow',
      buttonNegative: 'Cancel',
      buttonNeutral: 'Ask Me Later',
    },
  );

  return granted === PermissionsAndroid.RESULTS.GRANTED;
};

const getPlaceName = async (
  latitude: number,
  longitude: number,
): Promise<{
  city: string;
  state: string;
  country: string;
}> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'EVChargeFinder/1.0',
        },
      },
    );

    if (!response.ok) {
      throw new Error('Unable to find place name.');
    }

    const data = await response.json();
    const address = data.address || {};

    console.log('Reverse geocoding address:', address);

    const city =
      address.city ||
      address.town ||
      address.village ||
      address.municipality ||
      address.city_district ||
      address.suburb ||
      address.county ||
      address.state_district ||
      'Unknown City';

    return {
      city,
      state: address.state || '',
      country: address.country || '',
    };
  } catch (error) {
    console.log('Reverse geocoding error:', error);

    return {
      city: 'Current Location',
      state: '',
      country: '',
    };
  }
};

export const getCurrentLocation = async (): Promise<LocationData> => {
  const hasPermission = await requestLocationPermission();

  if (!hasPermission) {
    throw new Error('Location permission denied.');
  }

  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      async position => {
        const {latitude, longitude} = position.coords;

        const place = await getPlaceName(latitude, longitude);

        resolve({
          latitude,
          longitude,
          city: place.city,
          state: place.state,
          country: place.country,
        });
      },
      error => {
        console.log('Location error:', error);

        reject(
          new Error(
            `${error.code}: ${error.message || 'Unable to get location.'}`,
          ),
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 60000,
      },
    );
  });
};