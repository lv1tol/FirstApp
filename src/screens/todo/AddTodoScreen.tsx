import React, { useState } from 'react';
import {
    View, Text, TextInput, Button, StyleSheet, ScrollView, Platform, TouchableOpacity
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { AddTodoNavProps, Todo } from '../../navigation/types'; // Імпортуємо Todo

interface FormData {
  title: string;
  date: Date;
  priority: 'low' | 'medium' | 'high';
}

const colors = {
    background: '#f8f9fa',
    textPrimary: '#212121',
    textSecondary: '#6c757d',
    inputBorder: '#ced4da',
    inputBackground: '#fff',
    error: '#dc3545',
    accent: '#007bff',
    white: '#fff',
};

const AddTodoScreen: React.FC<AddTodoNavProps> = ({ navigation }) => {
  const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>({
    defaultValues: {
      title: '',
      date: new Date(),
      priority: 'medium',
    },
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const selectedDate = watch('date');

  const onSubmit = (data: FormData) => {
    console.log('Form Data:', data);
    const newTodo: Todo = {
      id: Date.now(), // Генеруємо тимчасовий ID
      todo: data.title,
      completed: false,
      userId: 999, // Тимчасове значення
    };
    navigation.navigate('TodoList', { newTodo: newTodo });
  };

  const onDateChange = (event: DateTimePickerEvent, selectedDateValue?: Date) => {
    const currentDateValue = selectedDateValue || selectedDate;
    setShowDatePicker(Platform.OS === 'ios');
    setValue('date', currentDateValue, { shouldValidate: true });
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.label}>Назва завдання</Text>
      <Controller
        control={control}
        rules={{ required: 'Назва завдання є обов\'язковою' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, errors.title && styles.inputError]}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Введіть назву..."
          />
        )}
        name="title"
      />
      {errors.title && <Text style={styles.errorText}>{errors.title.message}</Text>}

      <Text style={styles.label}>Дата</Text>
      <TouchableOpacity onPress={showDatepicker} style={styles.dateButton}>
         <Text style={styles.dateButtonText}>
             {selectedDate.toLocaleDateString('uk-UA')}
         </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={selectedDate}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onDateChange}
        />
      )}
      {Platform.OS === 'ios' && showDatePicker && (
          <Button title="Готово" onPress={() => setShowDatePicker(false)} />
      )}

      <Text style={styles.label}>Пріоритет</Text>
      <Controller
        control={control}
        name="priority"
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={value}
                    onValueChange={(itemValue) => onChange(itemValue)}
                    style={styles.picker}
                    dropdownIconColor={colors.accent}
                >
                    <Picker.Item label="Низький" value="low" />
                    <Picker.Item label="Середній" value="medium" />
                    <Picker.Item label="Високий" value="high" />
                </Picker>
            </View>
        )}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.submitButtonText}>Додати Завдання</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, },
    contentContainer: { padding: 20, },
    label: { fontSize: 16, fontWeight: '500', color: colors.textSecondary, marginBottom: 8, marginTop: 15, },
    input: { backgroundColor: colors.inputBackground, borderWidth: 1, borderColor: colors.inputBorder, borderRadius: 8, paddingHorizontal: 15, paddingVertical: 12, fontSize: 16, color: colors.textPrimary, },
    inputError: { borderColor: colors.error, },
    errorText: { color: colors.error, fontSize: 12, marginTop: 4, },
    dateButton: { backgroundColor: colors.inputBackground, borderWidth: 1, borderColor: colors.inputBorder, borderRadius: 8, paddingHorizontal: 15, paddingVertical: 12, },
    dateButtonText: { fontSize: 16, color: colors.textPrimary, },
    pickerContainer: { borderWidth: 1, borderColor: colors.inputBorder, borderRadius: 8, backgroundColor: colors.inputBackground, overflow: 'hidden', },
    picker: { height: Platform.OS === 'ios' ? 120 : 50, },
    submitButton: { backgroundColor: colors.accent, paddingVertical: 15, borderRadius: 8, alignItems: 'center', marginTop: 30, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, },
    submitButtonText: { color: colors.white, fontSize: 18, fontWeight: 'bold', },
});

export default AddTodoScreen;