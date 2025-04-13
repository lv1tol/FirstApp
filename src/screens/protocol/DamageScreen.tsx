import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  PanResponder,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import Svg, { Path } from 'react-native-svg';
import { DamageScreenProps } from '../../navigation/types'; // Перевірте шлях до типів

interface DamageFormData {
  impactSide: string;
  description: string;
}

const colors = {
  background: '#f8f9fa',
  textPrimary: '#212121',
  textSecondary: '#6c757d',
  inputBorder: '#ced4da',
  inputBackground: '#fff',
  error: '#dc3545',
  accent: '#0057b7',
  accentText: '#ffd700',
  canvasBorder: '#adb5bd',
  drawingColor: '#343a40',
  buttonSecondary: '#6c757d',
};

const { width } = Dimensions.get('window');
const canvasHeight = 300;

const DamageScreen: React.FC<DamageScreenProps> = ({ navigation }) => {
  const { control, handleSubmit, formState: { errors } } = useForm<DamageFormData>({
    defaultValues: { impactSide: '', description: '' },
  });

  const [currentPath, setCurrentPath] = useState<string>('');
  const [paths, setPaths] = useState<string[]>([]);
  const pathRef = useRef<string>('');

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pathRef.current = '';
      },
      onPanResponderMove: (evt, gestureState) => {
        const newPoint = `${gestureState.moveX.toFixed(0)},${gestureState.moveY.toFixed(0)}`;
        pathRef.current += (pathRef.current === '' ? 'M' : ' L') + newPoint;
        setCurrentPath(pathRef.current);
      },
      onPanResponderRelease: () => {
        if (pathRef.current) {
          setPaths([...paths, pathRef.current]);
        }
        setCurrentPath('');
        pathRef.current = '';
      },
    })
  ).current;

  const clearCanvas = () => {
    setPaths([]);
    setCurrentPath('');
    pathRef.current = '';
  };

   const onSubmit = (data: DamageFormData) => {
      console.log('Damage Data:', data);
      console.log('Drawing Paths:', paths);
      Alert.alert("Протокол Заповнено", "Дані та ескіз зібрано (перевірте консоль).", [
          { text: "OK", onPress: () => navigation.popToTop() }
      ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.label}>Сторона удару / пошкодження</Text>
      <Controller
        control={control}
        rules={{ required: 'Вкажіть сторону' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, errors.impactSide && styles.inputError]}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Напр., Лівий передній бік"
          />
        )}
        name="impactSide"
      />
      {errors.impactSide && <Text style={styles.errorText}>{errors.impactSide.message}</Text>}

      <Text style={styles.label}>Короткий опис пошкоджень</Text>
      <Controller
        control={control}
        rules={{ required: 'Додайте опис' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, styles.textArea, errors.description && styles.inputError]}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Опишіть пошкодження обох ТЗ..."
            multiline
            numberOfLines={4}
          />
        )}
        name="description"
      />
      {errors.description && <Text style={styles.errorText}>{errors.description.message}</Text>}

      <Text style={styles.label}>Ескіз ДТП</Text>
      <View style={styles.canvasContainer} {...panResponder.panHandlers}>
        <Svg height={canvasHeight} width="100%">
          {paths.map((path, index) => (
            <Path
              key={`path-${index}`}
              d={path}
              stroke={colors.drawingColor}
              strokeWidth={3}
              fill="none"
            />
          ))}
          <Path
            d={currentPath}
            stroke={colors.drawingColor}
            strokeWidth={3}
            fill="none"
          />
        </Svg>
      </View>
       <TouchableOpacity style={styles.clearButton} onPress={clearCanvas}>
          <Text style={styles.clearButtonText}>Очистити Ескіз</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.submitButtonText}>Завершити Протокол</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  contentContainer: { padding: 20, paddingBottom: 40 },
  label: { fontSize: 16, fontWeight: '500', color: colors.textSecondary, marginBottom: 8, marginTop: 15 },
  input: { backgroundColor: colors.inputBackground, borderWidth: 1, borderColor: colors.inputBorder, borderRadius: 8, paddingHorizontal: 15, paddingVertical: 12, fontSize: 16, color: colors.textPrimary },
  textArea: { height: 100, textAlignVertical: 'top' },
  inputError: { borderColor: colors.error },
  errorText: { color: colors.error, fontSize: 12, marginTop: 4 },
  canvasContainer: {
    height: canvasHeight,
    borderWidth: 1,
    borderColor: colors.canvasBorder,
    borderRadius: 8,
    marginTop: 10,
    backgroundColor: colors.inputBackground,
    overflow: 'hidden',
  },
   clearButton: {
      backgroundColor: colors.buttonSecondary,
      paddingVertical: 10,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 10,
      alignSelf: 'flex-end',
      paddingHorizontal: 15,
   },
   clearButtonText: {
      color: colors.background,
      fontSize: 14,
      fontWeight: '500',
   },
  submitButton: { backgroundColor: colors.accent, paddingVertical: 15, borderRadius: 8, alignItems: 'center', marginTop: 30, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },
  submitButtonText: { color: colors.accentText, fontSize: 18, fontWeight: 'bold' },
});

export default DamageScreen;