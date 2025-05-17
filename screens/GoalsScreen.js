import React, { useState, useEffect } from 'react';
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
import { firebase } from '../firebase/firebaseConfig';
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// 📌 Ana bileşen
const MainScreen = () => {
  return (
    <GoalsScreen title="🚀 Hedeflerin" />
  );
};

// 📌 Props alan GoalsScreen bileşeni
const GoalsScreen = ({ title }) => {
  const [goalText, setGoalText] = useState('');
  const [goals, setGoals] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const goalsRef = collection(db, 'users', user.uid, 'goals');

    const unsubscribe = onSnapshot(goalsRef, snapshot => {
      const fetchedGoals = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGoals(fetchedGoals);
    });

    return () => unsubscribe();
  }, [user]);

  const addGoal = async () => {
    if (!goalText.trim()) return;
    try {
      const goal = {
        text: goalText,
        completed: false,
        createdAt: new Date(),
      };
      await addDoc(collection(db, 'users', user.uid, 'goals'), goal);
      setGoalText('');
    } catch (err) {
      console.error('Hedef eklenirken hata:', err);
    }
  };

  const updateGoal = async () => {
    if (!editText.trim()) return;
    try {
      const goalRef = doc(db, 'users', user.uid, 'goals', editingId);
      await updateDoc(goalRef, { text: editText });
      setEditingId(null);
      setEditText('');
    } catch (err) {
      console.error('Hedef güncellenemedi:', err);
    }
  };

  const toggleComplete = async (id, currentStatus) => {
    try {
      const goalRef = doc(db, 'users', user.uid, 'goals', id);
      await updateDoc(goalRef, { completed: !currentStatus });
    } catch (err) {
      console.error('Tamamlama güncellenemedi:', err);
    }
  };

  const deleteGoal = async (id) => {
    try {
      const goalRef = doc(db, 'users', user.uid, 'goals', id);
      await deleteDoc(goalRef);
    } catch (err) {
      console.error('Silme hatası:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title || '🎯 Yeni Hedef Ekle'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Write your goal..."
        value={goalText}
        onChangeText={setGoalText}
      />
      <Button title="Add Goal" onPress={addGoal} />

      <Text style={styles.title}>✅ My Goals</Text>
      <FlatList
        data={goals}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.goalItem}>
            <TouchableOpacity onPress={() => toggleComplete(item.id, item.completed)}>
              <Ionicons
                name={item.completed ? 'checkbox' : 'square-outline'}
                size={24}
                color={item.completed ? '#4CAF50' : '#ccc'}
                style={{ marginRight: 10 }}
              />
            </TouchableOpacity>

            {editingId === item.id ? (
              <TextInput
                style={[styles.input, { flex: 1, marginBottom: 0, marginRight: 8 }]}
                value={editText}
                onChangeText={setEditText}
                autoFocus
              />
            ) : (
              <Text style={[styles.goalText, item.completed && styles.completed]}>
                {item.text}
              </Text>
            )}

            {editingId === item.id ? (
              <TouchableOpacity onPress={updateGoal}>
                <Ionicons name="checkmark" size={24} color="green" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => {
                setEditingId(item.id);
                setEditText(item.text);
              }}>
                <Ionicons name="create-outline" size={20} color="#007AFF" style={{ marginRight: 10 }} />
              </TouchableOpacity>
            )}

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

export default MainScreen;
