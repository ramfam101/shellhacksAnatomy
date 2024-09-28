import React, { useState } from 'react';
import { ScrollView, Pressable } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import Header from '@/components/Header';
import { useRouter } from 'expo-router';
import data from '../../assets/concept.json';
import { Collapsible } from '@/components/Collapsible';
import { ThemedText } from '@/components/ThemedText';

export default function LearnScreen() {
  const router = useRouter();

  const handleSubtopicPress = (chapter: string, subtopic: string) => {
    // Navigate to the dynamic subtopic page, passing both chapter and subtopic as parameters
    router.push({
      pathname: '/[subtopic]', // Dynamic route outside of the tabs directory
      params: { chapter, subtopic }, // Pass chapter and subtopic
    });
  };

  return (
    <ScrollView>
      <Header />
      <ThemedView style={{ padding: 10 }}>
        {data.AnatomyCourse.Chapters.map((chapter, chapterIndex) => (
          <Collapsible key={chapterIndex} title={chapter.ChapterTitle}>
            {chapter.Subtopics.map((subtopic, subtopicIndex) => (
              <Pressable key={subtopicIndex} onPress={() => handleSubtopicPress(chapter.ChapterTitle, subtopic)}>
                <ThemedText>{subtopic}</ThemedText>
              </Pressable>
            ))}
          </Collapsible>
        ))}
      </ThemedView>
    </ScrollView>
  );
}
