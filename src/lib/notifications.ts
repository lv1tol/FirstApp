// src/lib/notifications.ts
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
// Імпортуємо функції сховища замість DB функцій
import { deleteTodoStorage, getTodoStorage } from './storage';

const NOTIFICATION_CATEGORY_ID = "TASK_DEADLINE";

export async function registerForPushNotificationsAsync(): Promise<string | undefined> {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync({
        ios: { allowAlert: true, allowBadge: true, allowSound: true },
      });
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Не вдалося отримати дозвіл на сповіщення!');
      return;
    }
  } else {
    console.log('Emulator detected, skipping push token request.');
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default', importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250], lightColor: '#FF231F7C',
    });
  }
  return token;
}

export async function setupNotificationHandlers() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true, shouldPlaySound: true, shouldSetBadge: true,
    }),
  });

  Notifications.addNotificationResponseReceivedListener(async response => {
    const actionIdentifier = response.actionIdentifier;
    const notificationData = response.notification.request.content.data;
    const todoId = notificationData?.todoId as number | undefined;

    console.log('Notification Response:', actionIdentifier, notificationData);

    if (actionIdentifier === 'delete' && todoId) {
        const deleted = await deleteTodoStorage(todoId); // Використовуємо AsyncStorage
        if (deleted) {
             // Можна додати сповіщення користувачу про успішне видалення
             console.log(`Todo ${todoId} deleted via notification action.`);
        }
    } else if (actionIdentifier === 'show' || actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER) {
        console.log('Opening app or specific screen...');
    }
  });
}

export async function setupNotificationCategories() {
     await Notifications.setNotificationCategoryAsync(NOTIFICATION_CATEGORY_ID, [
       { identifier: 'show', buttonTitle: 'Переглянути', options: { opensAppToForeground: true } },
       { identifier: 'delete', buttonTitle: 'Видалити Завдання', options: { isDestructive: true, opensAppToForeground: false } },
     ]);
     console.log('Notification categories set up.');
}

export async function scheduleTaskNotification(
    taskId: number,
    taskText: string,
    deadline: number
): Promise<string | null> {
    if (deadline <= Date.now()) {
        console.log(`Deadline for task ${taskId} is in the past. Skipping notification.`);
        return null;
    }
    try {
        const identifier = await Notifications.scheduleNotificationAsync({
          content: {
            title: "⏰ Нагадування про дедлайн!", body: `Завдання "${taskText}" потребує уваги.`,
            data: { todoId: taskId }, categoryIdentifier: NOTIFICATION_CATEGORY_ID, sound: 'default',
          },
          trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: Math.max(0, (deadline - Date.now()) / 1000) }
        });
        console.log(`Notification scheduled for task ${taskId} with id: ${identifier}`);
        return identifier;
    } catch (error) {
        console.error(`Error scheduling notification for task ${taskId}:`, error);
        return null;
    }
}

export async function cancelTaskNotification(notificationId: string | null | undefined) {
    if (!notificationId) return;
    try {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
        console.log(`Cancelled notification: ${notificationId}`);
    } catch (error) {
        console.error(`Error cancelling notification ${notificationId}:`, error);
    }
}

export async function cancelNotificationForTodo(todoId: number) {
    try {
        const todo = await getTodoStorage(todoId); // Використовуємо AsyncStorage
        if (todo?.notificationId) {
            await cancelTaskNotification(todo.notificationId);
        }
    } catch (error) {
        console.error(`Error fetching notificationId for todo ${todoId} to cancel:`, error);
    }
}