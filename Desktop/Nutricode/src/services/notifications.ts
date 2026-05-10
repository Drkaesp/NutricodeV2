import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import { Platform } from 'react-native';
import { addWater, saveWorkoutPlan, getWorkoutPlan, saveMealPlan, getMealPlan, getCurrentUser, saveCurrentUser } from '../utils/storage';
import { XP_REWARDS } from '@/constants/GameData';

// Background Task Name
const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';

// Configure Notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Setup Categories
export async function setupNotificationCategories() {
  await Notifications.setNotificationCategoryAsync('hydration', [
    {
      identifier: 'btn_250ml',
      buttonTitle: '250 ml',
      options: { opensAppToForeground: false },
    },
    {
      identifier: 'btn_500ml',
      buttonTitle: '500 ml',
      options: { opensAppToForeground: false },
    },
    {
      identifier: 'btn_1lt',
      buttonTitle: '1LT',
      options: { opensAppToForeground: false },
    },
  ]);

  await Notifications.setNotificationCategoryAsync('workout', [
    {
      identifier: 'btn_done',
      buttonTitle: 'Concluído',
      options: { opensAppToForeground: false },
    },
    {
      identifier: 'btn_not_yet',
      buttonTitle: 'Ainda não',
      options: { opensAppToForeground: false },
    },
  ]);

  await Notifications.setNotificationCategoryAsync('meal', [
    {
      identifier: 'btn_done',
      buttonTitle: 'Concluído',
      options: { opensAppToForeground: false },
    },
    {
      identifier: 'btn_not_yet',
      buttonTitle: 'Ainda não',
      options: { opensAppToForeground: false },
    },
  ]);
}

export async function requestNotificationPermissions() {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    return newStatus === 'granted';
  }
  return true;
}

// Background Task Definition
TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, async ({ data, error }) => {
  if (error) {
    console.error('Error handling background notification:', error);
    return;
  }
  if (data) {
    const response = data as Notifications.NotificationResponse;
    const actionId = response.actionIdentifier;
    const category = response.notification.request.content.categoryIdentifier;

    if (actionId === Notifications.DEFAULT_ACTION_IDENTIFIER || actionId === 'dismiss') {
      return;
    }

    // Load current user to add XP
    let user = await getCurrentUser();
    let xpToAdd = 0;

    if (category === 'hydration') {
      let volume = 0;
      if (actionId === 'btn_250ml') volume = 250;
      if (actionId === 'btn_500ml') volume = 500;
      if (actionId === 'btn_1lt') volume = 1000;

      if (volume > 0) {
        await addWater(volume);
        xpToAdd = XP_REWARDS.LOG_MEAL; // Using a small reward for hydration interaction
      }
    } else if (category === 'workout' && actionId === 'btn_done') {
      xpToAdd = XP_REWARDS.COMPLETE_WORKOUT;
      
      const plan = await getWorkoutPlan();
      const hoje = new Date();
      const dias = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
      const diaKey = dias[hoje.getDay()];
      
      if (plan[diaKey]) {
        plan[diaKey].completed = true;
        await saveWorkoutPlan(plan);
      }
    } else if (category === 'meal' && actionId === 'btn_done') {
      xpToAdd = XP_REWARDS.COMPLETE_MEAL;
      
      const plan = await getMealPlan();
      const hoje = new Date();
      const dias = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
      const diaKey = dias[hoje.getDay()];
      
      if (plan[diaKey]) {
         const diaAtual = plan[diaKey] as any;
         ['cafe', 'almoco', 'lanche', 'janta'].forEach(slot => {
           if (diaAtual[slot]) {
             diaAtual[slot] = { ...diaAtual[slot], completed: true };
           }
         });
         await saveMealPlan(plan);
      }
    }

    if (xpToAdd > 0 && user) {
      user.totalXP = (user.totalXP || 0) + xpToAdd;
      await saveCurrentUser(user);
    }
  }
});

// Register Task
export async function registerBackgroundNotifications() {
  await setupNotificationCategories();
  await requestNotificationPermissions();
  await Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
}

// Scheduling Functions
export async function scheduleHydrationNotification(hours: number) {
  // Cancelar todos os agendamentos anteriores de hidratação
  const allScheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const notif of allScheduled) {
    if (notif.content.categoryIdentifier === 'hydration') {
      await Notifications.cancelScheduledNotificationAsync(notif.identifier);
    }
  }

  return await Notifications.scheduleNotificationAsync({
    content: {
      title: '💧 Hora de se Hidratar!',
      body: 'Beba água para manter seu ecossistema ativo. Selecione a quantidade abaixo:',
      categoryIdentifier: 'hydration',
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: hours * 3600,
      repeats: true,
    },
  });
}

export async function scheduleWorkoutNotification(date: Date) {
  // Cancelar notificações de treino anteriores para evitar duplicatas
  const allScheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const notif of allScheduled) {
    if (notif.content.categoryIdentifier === 'workout') {
      await Notifications.cancelScheduledNotificationAsync(notif.identifier);
    }
  }

  return await Notifications.scheduleNotificationAsync({
    content: {
      title: '🏋️ Hora do Treino!',
      body: 'Bora esmagar os músculos. Já concluiu o treino de hoje?',
      categoryIdentifier: 'workout',
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
      hour: date.getHours(),
      minute: date.getMinutes(),
      repeats: true,
    },
  });
}

export async function scheduleMealNotification(date: Date) {
  // Cancelar notificações de refeição anteriores para evitar duplicatas
  const allScheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const notif of allScheduled) {
    if (notif.content.categoryIdentifier === 'meal') {
      await Notifications.cancelScheduledNotificationAsync(notif.identifier);
    }
  }

  return await Notifications.scheduleNotificationAsync({
    content: {
      title: '🍎 Hora da Refeição',
      body: 'Não pule suas refeições! Já comeu o que estava planejado?',
      categoryIdentifier: 'meal',
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
      hour: date.getHours(),
      minute: date.getMinutes(),
      repeats: true,
    },
  });
}
