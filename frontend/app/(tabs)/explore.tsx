import React, { useState } from 'react';
import { StyleSheet, ScrollView, TextInput, Pressable, Text, View, KeyboardAvoidingView, Platform } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Header from '@/components/Header';
import { ThemedView } from '@/components/ThemedView';

export default function ChatBotScreen() {
  const [messages, setMessages] = useState([
    { text: 'Hello! How can I assist you today?', sender: 'bot' },
  ]);
  const [inputText, setInputText] = useState('');
  const [submittedText, setSubmittedText] = useState('');

  const handleSend = () => {
    if (inputText.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: inputText, sender: 'user' },
      ]);

    
      setInputText('');

    }
  };

  return (
    <>
    <Header/ >
    <ThemedView style={styles.Bigcontainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.topBar}>
        <Ionicons name="chatbubbles-outline" size={24} color="white" style={styles.botIcon} />
        <Text style={styles.botName}>Anat bot</Text>
      </View>
        <ScrollView style={styles.messageList}>
          {messages.map((message, index) => (
            <View
              key={index}
              style={[
                styles.messageBubble,
                message.sender === 'user' ? styles.userBubble : styles.botBubble,
              ]}
            >
              <Text style={styles.messageText}>{message.text}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            placeholderTextColor="#555555"
          />
          <Pressable style={styles.sendButton} onPress={handleSend}>
            <Ionicons Feather name={"send"} size={24} color="white" />
          </Pressable>
        </View>
      </KeyboardAvoidingView> 
    </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3399FF',
    padding: 15,
    paddingTop: Platform.OS === 'ios' ? 40 : 15,
  },
  botIcon: {
    marginRight: 10, 
  },
  botName: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  Bigcontainer:{
    flex: 1,
    borderWidth: 2,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    borderColor: '#555555',
    margin: -2,

  },
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  messageList: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 20,
    marginVertical: 5,
    maxWidth: '80%',
  },
  userBubble: {
    backgroundColor: '#3399FF',
    alignSelf: 'flex-end',
  },
  botBubble: {
    backgroundColor: '#555555',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
  },
  textInput: {
    flex: 1,
    padding: 10,
    borderRadius: 25,
    backgroundColor: '#F0F0F0',
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#3399FF',
    padding: 10,
    borderRadius: 25,
  },
});