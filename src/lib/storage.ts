// src/lib/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Todo {
    id: number; // Будемо використовувати timestamp як ID
    text: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
    createdAt: number; // timestamp ms
    deadline?: number | null;
    notificationId?: string | null;
}

const STORAGE_KEY = '@todos';

export const loadTodos = async (): Promise<Todo[]> => {
    try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        console.error("Failed to load todos from storage", e);
        return [];
    }
};

const saveTodos = async (todos: Todo[]): Promise<boolean> => {
     try {
        const jsonValue = JSON.stringify(todos);
        await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
        return true;
     } catch (e) {
        console.error("Failed to save todos to storage", e);
        return false;
     }
};

// Функція для додавання нового завдання
export const addTodoStorage = async (newTodoData: Omit<Todo, 'id' | 'createdAt'> & { notificationId?: string | null }): Promise<Todo | null> => {
    try {
        const currentTodos = await loadTodos();
        const newTodo: Todo = {
            ...newTodoData,
            id: Date.now(), // Використовуємо timestamp як унікальний ID
            createdAt: Date.now(),
            completed: false, // Завжди false при створенні
        };
        const updatedTodos = [newTodo, ...currentTodos]; // Додаємо на початок
        await saveTodos(updatedTodos);
        return newTodo; // Повертаємо створене завдання з ID
    } catch (e) {
        console.error("Failed to add todo", e);
        return null;
    }
};

// Функція для оновлення існуючого завдання (наприклад, статусу чи notificationId)
export const updateTodoStorage = async (updatedTodo: Todo): Promise<boolean> => {
    try {
        const currentTodos = await loadTodos();
        const todoIndex = currentTodos.findIndex(t => t.id === updatedTodo.id);
        if (todoIndex === -1) return false; // Не знайдено

        const updatedTodos = [...currentTodos];
        updatedTodos[todoIndex] = updatedTodo;
        return await saveTodos(updatedTodos);
    } catch (e) {
        console.error("Failed to update todo", e);
        return false;
    }
};

// Функція для видалення завдання
export const deleteTodoStorage = async (id: number): Promise<boolean> => {
    try {
        const currentTodos = await loadTodos();
        const updatedTodos = currentTodos.filter(todo => todo.id !== id);
        return await saveTodos(updatedTodos);
    } catch (e) {
        console.error("Failed to delete todo", e);
        return false;
    }
};

// Функція для отримання одного завдання (для скасування сповіщення)
export const getTodoStorage = async (id: number): Promise<Todo | undefined> => {
    try {
        const currentTodos = await loadTodos();
        return currentTodos.find(todo => todo.id === id);
    } catch (e) {
        console.error("Failed to get todo", e);
        return undefined;
    }
};