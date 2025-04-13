import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NavigatorScreenParams, RouteProp } from '@react-navigation/native';

export interface Todo {
    id: number;
    todo: string;
    completed: boolean;
    userId: number;
}

export type ArtistStackParamList = {
  Home: undefined;
  Gallery: undefined;
};

export type TodoStackParamList = {
  TodoList: { newTodo?: Todo } | undefined;
  AddTodo: undefined;
};

export type ProtocolStackParamList = {
  ProtocolMain: undefined;
  ParticipantA: undefined;
  ParticipantB: undefined;
  Damage: undefined;
};

export type RootTabParamList = {
  ArtistStack: NavigatorScreenParams<ArtistStackParamList>;
  TodoStack: NavigatorScreenParams<TodoStackParamList>;
  ProtocolStack: NavigatorScreenParams<ProtocolStackParamList>;
};

export type HomeScreenProps = NativeStackScreenProps<ArtistStackParamList, 'Home'>;
export type GalleryScreenProps = NativeStackScreenProps<ArtistStackParamList, 'Gallery'>;
export type ArtistNavigationProp = NativeStackScreenProps<ArtistStackParamList>['navigation'];

export type TodoListNavProps = NativeStackScreenProps<TodoStackParamList, 'TodoList'>;
export type AddTodoNavProps = NativeStackScreenProps<TodoStackParamList, 'AddTodo'>;
export type TodoNavigationProp = NativeStackScreenProps<TodoStackParamList>['navigation'];
export type TodoListRouteProp = RouteProp<TodoStackParamList, 'TodoList'>;

export type ProtocolMainScreenProps = NativeStackScreenProps<ProtocolStackParamList, 'ProtocolMain'>;
export type ParticipantAFormProps = NativeStackScreenProps<ProtocolStackParamList, 'ParticipantA'>;
export type ParticipantBFormProps = NativeStackScreenProps<ProtocolStackParamList, 'ParticipantB'>;
export type DamageScreenProps = NativeStackScreenProps<ProtocolStackParamList, 'Damage'>;
export type ProtocolNavigationProp = NativeStackScreenProps<ProtocolStackParamList>['navigation'];