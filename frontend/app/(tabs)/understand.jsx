import React, { useState } from 'react';
import { ScrollView, Pressable, View, Text, StyleSheet } from 'react-native';
import Header from '@/components/Header';
import { useRouter } from 'expo-router';
import data from '../../assets/concept.json';
import { useVisited } from '../VisitedContext'; // Import the custom hook for visited subtopics
import { useProgress } from '../ProgressContext'; // Import the custom hook for progress context

export default function LearnScreen() {
  const router = useRouter();
  const { isChapterCompleted, markSubtopicVisited, getChapterProgress, isSubtopicVisited } = useVisited(); // Added isSubtopicVisited to check individual subtopics
  const { updateChapterProgress, chapterProgress } = useProgress(); // Get the progress context data

  const [expandedChapter, setExpandedChapter] = useState(null); // Track which chapter is expanded

  const handleSubtopicPress = (chapter, subtopic) => {
    markSubtopicVisited(chapter, subtopic); // Mark subtopic as visited
    const progress = getChapterProgress(chapter);
    updateChapterProgress(chapter, progress);

    router.push({
      pathname: '/[subtopic]',
      params: { chapter, subtopic },
    });
  };

  const handleQuizPress = (chapter) => {
    router.push({
      pathname: '/quiz',
      params: { chapter },
    });
  };

  const toggleChapter = (chapter) => {
    setExpandedChapter(expandedChapter === chapter ? null : chapter); // Toggle chapter
  };

  return (
    <View>
      <Header />
      <ScrollView style={styles.scroll}>
        <View style={styles.viewContainer}>
          {data.AnatomyCourse.Chapters.map((chapter, chapterIndex) => (
            <View key={chapterIndex} style={styles.chapterBox}>
              <Pressable onPress={() => toggleChapter(chapter.ChapterTitle)}>
                <Text style={styles.chapterTitle}>{chapter.ChapterTitle}</Text>
              </Pressable>
              {expandedChapter === chapter.ChapterTitle && (
                <View style={styles.subtopicContainer}>
                  {chapter.Subtopics.map((subtopic, subtopicIndex) => (
                    <Pressable
                      key={subtopicIndex}
                      style={[
                        styles.subtopicButton,
                        isSubtopicVisited(chapter.ChapterTitle, subtopic) && styles.visitedSubtopicButton, // Apply blue background if visited
                      ]}
                      onPress={() => handleSubtopicPress(chapter.ChapterTitle, subtopic)}
                    >
                      <Text style={styles.subtopicText}>{subtopic}</Text>
                    </Pressable>
                  ))}

                  {/* Chapter Progress Bar */}
                  <View style={styles.progressBarBackground}>
                    <View
                      style={{
                        ...styles.progressBarFill,
                        width: `${chapterProgress[chapter.ChapterTitle]}%`,
                      }}
                    />
                  </View>

                  {/* Quiz button */}
                  <Pressable
                    style={[
                      styles.quizButton,
                      isChapterCompleted(chapter.ChapterTitle)
                        ? styles.quizButtonEnabled
                        : styles.quizButtonDisabled,
                    ]}
                    onPress={() => handleQuizPress(chapter.ChapterTitle)}
                    disabled={!isChapterCompleted(chapter.ChapterTitle)}
                  >
                    <Text style={styles.quizButtonText}>
                      {isChapterCompleted(chapter.ChapterTitle)
                        ? `Start Quiz for ${chapter.ChapterTitle}`
                        : `Complete all subtopics to unlock quiz`}
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: "#f5f5f5",
  },
  scroll: {
    backgroundColor: 'white',
  },
  viewContainer: {
    padding: 10,
    backgroundColor: 'white',
  },
  chapterBox: {
    backgroundColor: "#fff", // White background to match quiz/visualization style
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chapterTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  subtopicContainer: {
    marginTop: 10,
  },
  subtopicButton: {
    padding: 10,
    backgroundColor: "#f9f9f9", // Default light gray background for subtopics
    borderRadius: 8,
    marginBottom: 10,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  visitedSubtopicButton: {
    backgroundColor: "#3399FF", // Blue background if the subtopic is visited
  },
  subtopicText: {
    fontSize: 16,
    color: "#333",
  },
  progressBarBackground: {
    marginTop: 10,
    height: 20,
    backgroundColor: "#ddd",
    borderRadius: 5,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: "#3399FF",
    borderRadius: 5,
  },
  quizButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  quizButtonEnabled: {
    backgroundColor: "#3399FF",
  },
  quizButtonDisabled: {
    backgroundColor: "#d3d3d3",
  },
  quizButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
