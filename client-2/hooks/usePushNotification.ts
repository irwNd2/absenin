import { useState, useEffect, useRef } from "react";

import * as Device from "expo-device";
import * as Notification from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";

export interface PushNotificationState {
  notification?: Notification.Notification;
  expoPushToken?: Notification.ExpoPushToken;
}

export const usePushNotification = (): PushNotificationState => {
  Notification.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldShowAlert: true,
      shouldSetBadge: false,
    }),
  });

  const [expoPushToken, setExpoPushToken] = useState<
    Notification.ExpoPushToken | undefined
  >();

  const [notification, setNotification] = useState<
    Notification.Notification | undefined
  >();

  const notificationListener = useRef<Notification.Subscription>();
  const responseListener = useRef<Notification.Subscription>();

  async function registerPushNotificationAsync() {
    let token;

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notification.getPermissionsAsync();

      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notification.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Falied to get push token");
      }

      token = await Notification.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });

      if (Platform.OS === "android") {
        Notification.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notification.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "FF231F7C",
        });
      }

      return token;
    } else {
      console.log("ERROR: Please use a physical device!");
    }
  }

  useEffect(() => {
    registerPushNotificationAsync().then((token) => {
      setExpoPushToken(token);
    });

    notificationListener.current = Notification.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
      }
    );

    responseListener.current =
      Notification.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notification.removeNotificationSubscription(
        notificationListener.current!
      );
      Notification.removeNotificationSubscription(responseListener.current!);
    };
  }, []);

  return {
    expoPushToken,
    notification,
  };
};
