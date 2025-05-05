import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const GoalsScreen = () => {
  const [goalText, setGoalText] = useState('');
  const [goals, setGoals] = useState([]);

  const addGoal = () => {
    if (goalText.trim() === '') return;
    const newGoal = {
      id: Date.now().toString(),
      text: goalText,
      completed: false,
    };
    setGoals([...goals, newGoal]);
    setGoalText('');
  };

  const toggleComplete = (id) => {
    setGoals(goals.map(goal => {
      if (goal.id === id) {
        return { ...goal, completed: !goal.completed };
      }
      return goal;
    }));
  };

  const deleteGoal = (id) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎯 Yeni Hedef Ekle</Text>
      <TextInput
        style={styles.input}
        placeholder="Hedefini yaz..."
        value={goalText}
        onChangeText={setGoalText}
      />
      <Button title="Hedefi Ekle" onPress={addGoal} />

      <Text style={styles.title}>✅ Hedeflerim</Text>
      <FlatList
        data={goals}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.goalItem}>
            <TouchableOpacity onPress={() => toggleComplete(item.id)}>
              <Ionicons
                name={item.completed ? 'checkbox' : 'square-outline'}
                size={24}
                color={item.completed ? '#4CAF50' : '#ccc'}
                style={{ marginRight: 10 }}
              />
            </TouchableOpacity>

            <Text style={[styles.goalText, item.completed && styles.completed]}>
              {item.text}
            </Text>

            <TouchableOpacity onPress={() => deleteGoal(item.id)}>
              <Ionicons name="trash" size={20} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  goalText: {
    fontSize: 16,
    flex: 1,
  },
  completed: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
});

export default GoalsScreen;
