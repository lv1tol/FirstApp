import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { ParticipantBFormProps } from '../../navigation/types'; // Перевірте шлях до типів

interface FormDataB {
  firstName: string;
  lastName: string;
  dob: Date;
  phone: string;
  vehicleModel: string;
  vehicleNumber: string;
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
};

const ParticipantBFormScreen: React.FC<ParticipantBFormProps> = ({ navigation }) => {
  const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormDataB>({
    defaultValues: {
      firstName: '',
      lastName: '',
      dob: new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000),
      phone: '',
      vehicleModel: '',
      vehicleNumber: '',
    },
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const selectedDate = watch('dob');

  const onSubmit = (data: FormDataB) => {
    console.log('Participant B Data:', data);
    navigation.navigate('Damage');
  };

  const onDateChange = (event: DateTimePickerEvent, selectedDateValue?: Date) => {
    const currentDateValue = selectedDateValue || selectedDate;
    setShowDatePicker(Platform.OS === 'ios');
    setValue('dob', currentDateValue, { shouldValidate: true });
  };

  const showDatepicker = () => setShowDatePicker(true);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.label}>Ім'я</Text>
      <Controller control={control} rules={{ required: 'Ім\'я є обов\'язковим' }} render={({ field: { onChange, onBlur, value } }) => (<TextInput style={[styles.input, errors.firstName && styles.inputError]} onBlur={onBlur} onChangeText={onChange} value={value} placeholder="Ім'я" autoCapitalize="words"/>)} name="firstName"/>
      {errors.firstName && <Text style={styles.errorText}>{errors.firstName.message}</Text>}

      <Text style={styles.label}>Прізвище</Text>
      <Controller control={control} rules={{ required: 'Прізвище є обов\'язковим' }} render={({ field: { onChange, onBlur, value } }) => (<TextInput style={[styles.input, errors.lastName && styles.inputError]} onBlur={onBlur} onChangeText={onChange} value={value} placeholder="Прізвище" autoCapitalize="words"/>)} name="lastName"/>
      {errors.lastName && <Text style={styles.errorText}>{errors.lastName.message}</Text>}

      <Text style={styles.label}>Дата народження</Text>
      <TouchableOpacity onPress={showDatepicker} style={styles.dateButton}>
         <Text style={styles.dateButtonText}>{selectedDate.toLocaleDateString('uk-UA')}</Text>
      </TouchableOpacity>
      {showDatePicker && (<DateTimePicker testID="dateTimePickerB" value={selectedDate} mode="date" display="spinner" onChange={onDateChange} maximumDate={new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000)} />)}
      {Platform.OS === 'ios' && showDatePicker && (<Button title="Готово" onPress={() => setShowDatePicker(false)} />)}

      <Text style={styles.label}>Телефон</Text>
      <Controller control={control} rules={{ required: 'Телефон є обов\'язковим', pattern: { value: /^\+?3?8?(0\d{9})$/, message: 'Невірний формат (+380XXXXXXXXX)' } }} render={({ field: { onChange, onBlur, value } }) => (<TextInput style={[styles.input, errors.phone && styles.inputError]} onBlur={onBlur} onChangeText={onChange} value={value} placeholder="+380XXXXXXXXX" keyboardType="phone-pad"/>)} name="phone"/>
      {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}

      <Text style={styles.label}>Модель авто</Text>
      <Controller control={control} rules={{ required: 'Модель авто є обов\'язковою' }} render={({ field: { onChange, onBlur, value } }) => (<TextInput style={[styles.input, errors.vehicleModel && styles.inputError]} onBlur={onBlur} onChangeText={onChange} value={value} placeholder="Напр., Skoda Octavia" autoCapitalize="words"/>)} name="vehicleModel"/>
      {errors.vehicleModel && <Text style={styles.errorText}>{errors.vehicleModel.message}</Text>}

      <Text style={styles.label}>Номер авто</Text>
      <Controller control={control} rules={{ required: 'Номер авто є обов\'язковим', pattern: { value: /^[А-ЯІЇЄ]{2}\d{4}[А-ЯІЇЄ]{2}$/i, message: 'Невірний формат (ВВ1234ВВ)' } }} render={({ field: { onChange, onBlur, value } }) => (<TextInput style={[styles.input, errors.vehicleNumber && styles.inputError]} onBlur={onBlur} onChangeText={(text) => onChange(text.toUpperCase())} value={value} placeholder="ВВ1234ВВ" autoCapitalize="characters" maxLength={8}/>)} name="vehicleNumber"/>
      {errors.vehicleNumber && <Text style={styles.errorText}>{errors.vehicleNumber.message}</Text>}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.submitButtonText}>Далі (Пошкодження)</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  contentContainer: { padding: 20, paddingBottom: 40 },
  label: { fontSize: 16, fontWeight: '500', color: colors.textSecondary, marginBottom: 8, marginTop: 15 },
  input: { backgroundColor: colors.inputBackground, borderWidth: 1, borderColor: colors.inputBorder, borderRadius: 8, paddingHorizontal: 15, paddingVertical: 12, fontSize: 16, color: colors.textPrimary },
  inputError: { borderColor: colors.error },
  errorText: { color: colors.error, fontSize: 12, marginTop: 4 },
  dateButton: { backgroundColor: colors.inputBackground, borderWidth: 1, borderColor: colors.inputBorder, borderRadius: 8, paddingHorizontal: 15, paddingVertical: 12 },
  dateButtonText: { fontSize: 16, color: colors.textPrimary },
  submitButton: { backgroundColor: colors.accent, paddingVertical: 15, borderRadius: 8, alignItems: 'center', marginTop: 30, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },
  submitButtonText: { color: colors.accentText, fontSize: 18, fontWeight: 'bold' },
});

export default ParticipantBFormScreen;