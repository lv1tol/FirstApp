import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
  useDerivedValue,
} from 'react-native-reanimated';
import { ProgressScreenProps } from '../../navigation/types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const PADDING = 20;
const BAR_WIDTH = SCREEN_WIDTH - PADDING * 2;

const colors = {
    background: '#f0f0f0',
    track: '#e0e0e0',
    text: '#333',
    button: '#007bff',
    green: '#4caf50',
    blue: '#2196f3',
    yellow: '#ffc107',
    red: '#f44336',
};

const ProgressScreen: React.FC<ProgressScreenProps> = () => {
  const [progressPercent, setProgressPercent] = useState(0);
  const progress = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 0.25, 0.5, 0.75, 1],
      [colors.track, colors.green, colors.blue, colors.yellow, colors.red]
    );

    return {
      width: `${progress.value * 100}%`,
      backgroundColor: backgroundColor,
    };
  });

  const progressText = useDerivedValue(() => {
       return `${Math.round(progress.value * 100)}%`;
  });

  useEffect(() => {
    progress.value = withTiming(progressPercent / 100, { duration: 500 });
  }, [progressPercent, progress]);

  const handleNextPress = () => {
    setProgressPercent(current => (current >= 100 ? 0 : current + 25));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Прогрес Бар</Text>

      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressBar, animatedStyle]} />
      </View>
        <Animated.Text style={styles.progressTextLabel}>
        </Animated.Text>


      <View style={styles.buttonContainer}>
        <Button title="Next >>" onPress={handleNextPress} color={colors.button} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: PADDING,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    color: colors.text,
  },
  progressTrack: {
    width: BAR_WIDTH,
    height: 30,
    backgroundColor: colors.track,
    borderRadius: 15,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 15,
  },
   progressTextLabel: {
      marginTop: 10,
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
   },
  buttonContainer: {
    marginTop: 50,
    width: '50%',
  },
});

export default ProgressScreen;