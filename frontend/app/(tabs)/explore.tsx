import React, { useState, useRef } from 'react';
import { StyleSheet, ScrollView, TextInput, Pressable, Text, View, Image, KeyboardAvoidingView, Platform } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Header from '@/components/Header';
import { ThemedView } from '@/components/ThemedView';
import axios from 'axios';  

export default function ChatBotScreen() {
  const [messages, setMessages] = useState([
    { text: 'Hello! How can I assist you today?', sender: 'bot' },
  ]);
  const [inputText, setInputText] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null); // State for the image
  const scrollViewRef = useRef<ScrollView>(null);

  const apiKey = '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';

  const fetchBotReply = async (userMessage: string) => {
    try {
      if (userMessage.toLowerCase().includes('generate an image')) {
        const imageResponse = await axios.post(
          'https://api.openai.com/v1/images/generations',
          {
            prompt: userMessage.replace('generate an image of ', '') + "based off anatomical structure",  
            n: 1,
            size: '1024x1024',
          },
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
          }
        );
        const imageUrl = imageResponse.data.data[0].url;
        setGeneratedImage(imageUrl);
        return 'Here is the image you requested:';
      } else {
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-4',
            messages: [
              { role: 'system', content: 'You are a helpful assistant.' },
              ...messages.map((msg) => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.text,
              })),
              { role: 'user', content: userMessage },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
          }
        );
        return response.data.choices[0].message.content;
      }
    } catch (error) {
      console.error('Error fetching OpenAI response:', error);
      return 'Sorry, I am having trouble responding right now.';
    }
  };

  const handleSend = async () => {
    if (inputText.trim()) {
      const userMessage = inputText.trim();
      
      // Add user's message to the chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: userMessage, sender: 'user' },
      ]);

      // Clear input
      setInputText('');

      // Fetch bot's reply or image
      const botReply = await fetchBotReply(userMessage);

      // Add bot's reply to the chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: botReply, sender: 'bot' },
      ]);
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
    }
  };

  return (
    <>
      <Header />
      <ThemedView style={styles.Bigcontainer}>
      <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
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
            {generatedImage && (
              <Image source={{ uri: generatedImage }} style={styles.generatedImage} />
            )}
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
    padding: 10,
    paddingTop: Platform.OS === 'ios' ? 25 : 10,
    
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
  generatedImage: {
    width: 300,
    height: 300,
    marginVertical: 10,
    alignSelf: 'center',
  },
});
