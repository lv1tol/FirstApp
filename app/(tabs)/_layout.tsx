import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const navColors = {
  tabActive: '#0057b7',
  tabInactive: '#8e8e93',
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: navColors.tabActive,
        tabBarInactiveTintColor: navColors.tabInactive,
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'alert-circle-outline';

          if (route.name === 'artist') {
            iconName = focused ? 'color-palette' : 'color-palette-outline';
          } else if (route.name === 'todo') {
            iconName = focused ? 'list-circle' : 'list-circle-outline';
          } else if (route.name === 'protocol') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen
        name="artist"
        options={{ title: 'Художник' }}
      />
      <Tabs.Screen
        name="todo"
        options={{ title: 'Завдання' }}
      />
      <Tabs.Screen
        name="protocol"
        options={{ title: 'Протокол' }}
      />
    </Tabs>
  );
}