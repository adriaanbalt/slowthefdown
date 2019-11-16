import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import BASE_URL from '../BASE_URL';

// Example server, implemented in Rails: https://git.io/vKHKv
const PUSH_ENDPOINT = `${BASE_URL}/api/user/push-notification-token`;

export default function registerForPushNotificationsAsync(fbAccessToken) {
  // Android remote notification permissions are granted during the app
  // install, so this will only ask on iOS
  Permissions.askAsync(Permissions.NOTIFICATIONS).then(({ status }) => {
    // Stop here if the user did not grant permissions
    if (status !== 'granted') {
      return;
    }

    // Get the token that uniquely identifies this device
    Notifications.getExpoPushTokenAsync().then(token => {

      fetch(PUSH_ENDPOINT, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${fbAccessToken}`
        },
        body: JSON.stringify({
          token: {
            value: token,
          },
        }),
      });

    });

  });

}
