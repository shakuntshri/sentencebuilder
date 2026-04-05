import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { COLORS } from '../constants/theme';
import { HomeScreen } from './HomeScreen';
import { GameScreen } from './GameScreen';
import { SettingsScreen } from './SettingsScreen';
import { ParentDashboardScreen } from './ParentDashboardScreen';

const Stack = createNativeStackNavigator();

export interface RootStackParamList {
  Home: undefined;
  Game: { packId: string; mode: 'play' | 'challenge' | 'practice' };
  Settings: undefined;
  ParentDashboard: undefined;
}

const RootNavigator = () => {
  const [currentGamePack, setCurrentGamePack] = useState<string>('');
  const [currentGameMode, setCurrentGameMode] = useState<'play' | 'challenge' | 'practice'>(
    'play'
  );

  const handleStartGame = (packId: string, mode: 'play' | 'challenge' | 'practice') => {
    setCurrentGamePack(packId);
    setCurrentGameMode(mode);
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: COLORS.white,
        },
        headerTintColor: COLORS.primary,
        headerTitleStyle: {
          fontWeight: '600',
        },
        cardStyle: {
          backgroundColor: COLORS.bgLight,
        },
      }}
    >
      <Stack.Screen
        name="Home"
        options={{
          title: 'Tap & Tell',
          headerShown: false,
        }}
      >
        {() => (
          <HomeScreen
            onStartGame={(packId, mode) => {
              handleStartGame(packId, mode);
            }}
            onOpenSettings={() => {
              // Navigate to settings
            }}
          />
        )}
      </Stack.Screen>

      <Stack.Screen
        name="Game"
        options={({ route }) => ({
          title: 'Game',
          headerBackVisible: true,
        })}
      >
        {() => <GameScreen packId={currentGamePack} mode={currentGameMode} />}
      </Stack.Screen>

      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
        }}
      />

      <Stack.Screen
        name="ParentDashboard"
        component={ParentDashboardScreen}
        options={{
          title: 'Parent Dashboard',
        }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;
