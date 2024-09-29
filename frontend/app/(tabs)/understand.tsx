import React from 'react';
import { ScrollView, Pressable, View } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import Header from '@/components/Header';
import { useRouter } from 'expo-router';
import data from '../../assets/concept.json';
import { Collapsible } from '@/components/Collapsible';
import { ThemedText } from '@/components/ThemedText';
import { useVisited } from './../VisitedContext'; // Import the custom hook for visited subtopics
import { useProgress } from './../ProgressContext'; // Import the custom hook for progress context

export default function LearnScreen() {
  const router = useRouter();
  const { isChapterCompleted, markSubtopicVisited, getChapterProgress } = useVisited(); // Get the context data
  const { updateChapterProgress, chapterProgress } = useProgress(); // Get the progress context data

  const handleSubtopicPress = (chapter: string, subtopic: string) => {
    // Mark subtopic as visited when it's clicked
    markSubtopicVisited(chapter, subtopic);

    // Recalculate and update the chapter's progress
    const progress = getChapterProgress(chapter);
    updateChapterProgress(chapter, progress); // Update the chapter progress in the ProgressContext

    // Navigate to the dynamic subtopic page, passing both chapter and subtopic as parameters
    router.push({
      pathname: '/[subtopic]', // Dynamic route outside of the tabs directory
      params: { chapter, subtopic }, // Pass chapter and subtopic
    });
  };

  const handleQuizPress = (chapter: string) => {
    // Navigate to the Quiz page, passing the chapter title as a parameter
    router.push({
      pathname: '/quiz', // Assuming '/quiz' is the route for your quiz page
      params: { chapter }, // Pass chapter as a parameter
    });
  };

  return (
    <ScrollView>
      <Header />
      <ThemedView style={{ padding: 10 }}>
        {data.AnatomyCourse.Chapters.map((chapter, chapterIndex) => (
          <Collapsible key={chapterIndex} title={chapter.ChapterTitle}>
            {chapter.Subtopics.map((subtopic, subtopicIndex) => (
              <Pressable
                key={subtopicIndex}
                onPress={() => handleSubtopicPress(chapter.ChapterTitle, subtopic)}
              >
                <ThemedText>{subtopic}</ThemedText>
              </Pressable>
            ))}

            {/* Chapter Progress Bar */}
            <View style={{ marginTop: 10, height: 20, backgroundColor: '#ddd', borderRadius: 5 }}>
              <View
                style={{
                  width: `${chapterProgress[chapter.ChapterTitle]}%`,
                  height: '100%',
                  backgroundColor: '#3399FF',
                  borderRadius: 5,
                }}
              />
            </View>

            {/* Quiz button at the bottom of each chapter's subtopic list */}
            <Pressable
              style={{
                marginTop: 10,
                padding: 10,
                backgroundColor: isChapterCompleted(chapter.ChapterTitle) ? '#3399FF' : '#d3d3d3',
                borderRadius: 5,
                alignItems: 'center',
              }}
              onPress={() => handleQuizPress(chapter.ChapterTitle)}
              disabled={!isChapterCompleted(chapter.ChapterTitle)} // Disable the button if not completed
            >
              <ThemedText style={{ color: '#fff', fontWeight: 'bold' }}>
                {isChapterCompleted(chapter.ChapterTitle)
                  ? `Start Quiz for ${chapter.ChapterTitle}`
                  : `Complete all subtopics to unlock quiz`}
              </ThemedText>
            </Pressable>
          </Collapsible>
        ))}
      </ThemedView>
    </ScrollView>
  );
}
