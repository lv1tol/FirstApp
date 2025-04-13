import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../src/screens/artist/HomeScreen';
import GalleryScreen from '../src/screens/artist/GalleryScreen';
import TodoListScreen from '../src/screens/todo/TodoListScreen';
import AddTodoScreen from '../src/screens/todo/AddTodoScreen';
import ProtocolMainScreen from '../src/screens/protocol/ProtocolMainScreen';
import ParticipantAFormScreen from '../src/screens/protocol/ParticipantAFormScreen';
import ParticipantBFormScreen from '../src/screens/protocol/ParticipantBFormScreen';
import DamageScreen from '../src/screens/protocol/DamageScreen';
import ProgressScreen from '../src/screens/progress/ProgressScreen';

import {
  RootTabParamList,
  ArtistStackParamList,
  TodoStackParamList,
  ProtocolStackParamList
} from '../src/navigation/types';

const ArtistStackNav = createNativeStackNavigator<ArtistStackParamList>();
const TodoStackNav = createNativeStackNavigator<TodoStackParamList>();
const ProtocolStackNav = createNativeStackNavigator<ProtocolStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

const navColors = {
  artistHeaderBg: '#6200ee', artistHeaderTint: '#fff',
  todoHeaderBg: '#fff', todoHeaderTint: '#212121',
  protocolHeaderBg: '#0057b7', protocolHeaderTint: '#ffd700',
  tabActive: '#0057b7', tabInactive: '#8e8e93',
};

function ArtistStackNavigator() {
  return (
    <ArtistStackNav.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: navColors.artistHeaderBg },
        headerTintColor: navColors.artistHeaderTint,
        headerTitleStyle: { fontWeight: 'bold' },
        headerShadowVisible: false,
      }}>
      <ArtistStackNav.Screen name="Home" component={HomeScreen} options={{ title: 'Інформація' }} />
      <ArtistStackNav.Screen name="Gallery" component={GalleryScreen} options={{ title: 'Галерея' }} />
    </ArtistStackNav.Navigator>
  );
}

function TodoStackNavigator() {
    return (
        <TodoStackNav.Navigator
           screenOptions={{
              headerStyle: { backgroundColor: navColors.todoHeaderBg },
              headerTintColor: navColors.todoHeaderTint,
              headerTitleStyle: { fontWeight: 'bold' },
              headerShadowVisible: true,
           }}>
            <TodoStackNav.Screen name="TodoList" component={TodoListScreen} options={{ headerShown: false }} />
            <TodoStackNav.Screen name="AddTodo" component={AddTodoScreen} options={{ title: 'Додати завдання' }} />
        </TodoStackNav.Navigator>
    );
}

function ProtocolStackNavigator() {
    return (
        <ProtocolStackNav.Navigator
           initialRouteName="ProtocolMain"
           screenOptions={{
              headerStyle: { backgroundColor: navColors.protocolHeaderBg },
              headerTintColor: navColors.protocolHeaderTint,
              headerTitleStyle: { fontWeight: 'bold' },
           }}>
            <ProtocolStackNav.Screen name="ProtocolMain" component={ProtocolMainScreen} options={{ title: 'Європротокол' }} />
            <ProtocolStackNav.Screen name="ParticipantA" component={ParticipantAFormScreen} options={{ title: 'Дані Учасника А' }} />
            <ProtocolStackNav.Screen name="ParticipantB" component={ParticipantBFormScreen} options={{ title: 'Дані Учасника Б' }} />
            <ProtocolStackNav.Screen name="Damage" component={DamageScreen} options={{ title: 'Пошкодження / Ескіз' }} />
        </ProtocolStackNav.Navigator>
    );
}

export default function App() {
  return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: navColors.tabActive,
          tabBarInactiveTintColor: navColors.tabInactive,
          tabBarStyle: {
             paddingBottom: Platform.OS === 'ios' ? 0 : 5, paddingTop: 5,
             height: Platform.OS === 'ios' ? 90 : 60, backgroundColor: '#fff',
             borderTopWidth: 1, borderTopColor: '#eee',
           },
          tabBarLabelStyle:{ fontSize: 10, fontWeight: '500' },
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = 'alert-circle-outline';

            if (route.name === 'ArtistStack') { iconName = focused ? 'color-palette' : 'color-palette-outline'; }
            else if (route.name === 'TodoStack') { iconName = focused ? 'list-circle' : 'list-circle-outline'; }
            else if (route.name === 'ProtocolStack') { iconName = focused ? 'document-text' : 'document-text-outline'; }
            else if (route.name === 'Progress') { iconName = focused ? 'stats-chart' : 'stats-chart-outline'; }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="ArtistStack" component={ArtistStackNavigator} options={{ title: 'Художник' }}/>
        <Tab.Screen name="TodoStack" component={TodoStackNavigator} options={{ title: 'Завдання' }} />
        <Tab.Screen name="ProtocolStack" component={ProtocolStackNavigator} options={{ title: 'Протокол' }} />
        <Tab.Screen name="Progress" component={ProgressScreen} options={{ title: 'Прогрес' }} />
      </Tab.Navigator>
  );
}