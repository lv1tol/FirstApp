import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { TodoListNavProps, TodoListRouteProp, Todo } from '../../navigation/types';

const colors = {
  background: '#f0f8ff',
  headerBackground: '#fff',
  textPrimary: '#212121',
  textSecondary: '#757575',
  accent: '#007bff',
  completed: '#4caf50',
  pending: '#bdbdbd',
  white: '#fff',
  fab: '#ff5252',
  shadowColor: '#000',
  error: '#dc3545',
};

const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  const day = date.getDate();
  let daySuffix = 'th';
  if (day === 1 || day === 21 || day === 31) daySuffix = 'st';
  else if (day === 2 || day === 22) daySuffix = 'nd';
  else if (day === 3 || day === 23) daySuffix = 'rd';
  let formatted = new Intl.DateTimeFormat('en-GB', options).format(date);
  formatted = formatted.replace(day.toString(), `${day}${daySuffix}`);
  return formatted;
};

const TodoListScreen: React.FC<TodoListNavProps> = ({ navigation }) => {
  const route = useRoute<TodoListRouteProp>();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<string>('');

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('https://dummyjson.com/todos');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data && Array.isArray(data.todos)) {
          setTodos(data.todos);
      } else {
          throw new Error('Invalid data structure received');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error("Fetch error: ", err);
      setTodos([]);
    } finally {
      setLoading(false);
    }
  }, []);

   useFocusEffect(
     useCallback(() => {
       setCurrentDate(formatDate(new Date()));
       if (todos.length === 0) {
           fetchTodos();
       }
     }, [fetchTodos, todos.length])
   );

   useEffect(() => {
     if (route.params?.newTodo) {
         const newTodoItem = route.params.newTodo;
         setTodos(prevTodos => [newTodoItem, ...prevTodos]);
         navigation.setParams({ newTodo: undefined });
     }
   }, [route.params?.newTodo, navigation]);

  const toggleTodoStatus = (id: number) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteLocalTodo = (id: number) => {
       setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  }

  const renderTodoItem = ({ item }: { item: Todo }) => (
    <TouchableOpacity
        style={styles.todoItem}
        onPress={() => toggleTodoStatus(item.id)}
        onLongPress={() => deleteLocalTodo(item.id)}
        activeOpacity={0.7}
    >
      <Ionicons
        name={item.completed ? 'checkmark-circle' : 'ellipse-outline'}
        size={24}
        color={item.completed ? colors.completed : colors.pending}
        style={styles.todoIcon}
      />
      <Text style={[styles.todoText, item.completed && styles.todoTextCompleted]}>
        {item.todo}
      </Text>
       <TouchableOpacity onPress={() => deleteLocalTodo(item.id)} style={styles.deleteButton}>
           <Ionicons name="trash-outline" size={20} color={colors.error} />
       </TouchableOpacity>
    </TouchableOpacity>
  );

  const ListEmptyState = () => (
      <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Список завдань порожній.</Text>
          <Text style={styles.emptySubText}>Натисніть "+", щоб додати нове завдання.</Text>
      </View>
  );


  return (
    <SafeAreaView style={styles.safeArea}>
       <StatusBar barStyle="dark-content" backgroundColor={colors.headerBackground} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>TODO List (API)</Text>
        <Text style={styles.headerDate}>{currentDate}</Text>
      </View>

      {loading && <ActivityIndicator size="large" color={colors.accent} style={styles.loader} />}
      {error && !loading && <Text style={styles.errorText}>Помилка завантаження: {error}</Text>}

      {!loading && !error && (
        <FlatList
          data={todos}
          renderItem={renderTodoItem}
          keyExtractor={(item, index) => `${item.id}-${index}`} // Use index for potentially non-unique IDs
          contentContainerStyle={styles.listContentContainer}
          style={styles.list}
          ListEmptyComponent={ListEmptyState}
        />
      )}

      <TouchableOpacity
         style={styles.fab}
         activeOpacity={0.8}
         onPress={() => navigation.navigate('AddTodo')}
      >
        <Ionicons name="add" size={30} color={colors.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background, },
    header: { paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 15 : 10, paddingBottom: 15, backgroundColor: colors.headerBackground, borderBottomWidth: 1, borderBottomColor: '#eee', },
    headerTitle: { fontSize: 28, fontWeight: 'bold', color: colors.textPrimary, textAlign: 'center', },
    headerDate: { fontSize: 16, color: colors.textSecondary, textAlign: 'center', marginTop: 4, },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center'},
    errorText: { color: 'red', textAlign: 'center', marginTop: 40, paddingHorizontal: 20, fontSize: 16 },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50, paddingHorizontal: 20 },
    emptyText: { textAlign: 'center', fontSize: 18, color: colors.textSecondary, marginBottom: 10 },
    emptySubText: { textAlign: 'center', fontSize: 14, color: colors.pending },
    list: { flex: 1, },
    listContentContainer: { paddingBottom: 80, flexGrow: 1 },
    todoItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, paddingVertical: 15, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', },
    todoIcon: { marginRight: 15, },
    todoText: { fontSize: 16, color: colors.textPrimary, flex: 1, marginRight: 10, },
    todoTextCompleted: { textDecorationLine: 'line-through', color: colors.pending, },
    deleteButton: { padding: 5, },
    fab: { position: 'absolute', bottom: 30, right: 30, backgroundColor: colors.fab, width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', shadowColor: colors.shadowColor, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4.65, elevation: 8, },
});

export default TodoListScreen;