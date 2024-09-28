import { View } from "react-native";
import { ScrollView } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { StyleSheet } from "react-native";
import Header from "@/components/Header";
import { Collapsible } from "@/components/Collapsible";
import data from "../../assets/concept.json";

export default function LearnScreen() {
    return (
      <ScrollView>
        <Header />
        <ThemedView style={styles.container}>
          {/* Loop through each chapter */}
          {data.AnatomyCourse.Chapters.map((chapter, chapterIndex) => (
            <Collapsible key={chapterIndex} title={chapter.ChapterTitle}>
              {/* Loop through each subtopic in the chapter */}
              {chapter.Subtopics.map((subtopic, subtopicIndex) => (
                <Collapsible key={subtopicIndex} title={subtopic}>
                  
                </Collapsible>
              ))}
            </Collapsible>
          ))}
        </ThemedView>
      </ScrollView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      padding: 10, // Add some padding to the container
    },
  });