import React, { createContext, useContext, useState } from 'react';

// Create the context
const VisitedContext = createContext();

// Custom hook to use the context easily
export const useVisited = () => useContext(VisitedContext);

// Provider component to wrap your app
export const VisitedProvider = ({ children }) => {
  
  // Initialize visited state for each chapter's subtopics based on your data structure
  const initialVisitedState = {
    "Introduction to Anatomy and Physiology": {
      visited: [],
      total: 6, // Total number of subtopics
    },
    "Cells and Tissues": {
      visited: [],
      total: 4,
    },
    "The Integumentary System": {
      visited: [],
      total: 4,
    },
    "The Skeletal System": {
      visited: [],
      total: 7,
    },
    "The Muscular System": {
      visited: [],
      total: 5,
    },
    "The Nervous System": {
      visited: [],
      total: 6,
    },
    "The Endocrine System": {
      visited: [],
      total: 4,
    },
    "The Cardiovascular System": {
      visited: [],
      total: 6,
    },
    "The Lymphatic System and Immunity": {
      visited: [],
      total: 5,
    },
    "The Respiratory System": {
      visited: [],
      total: 5,
    },
    "The Digestive System": {
      visited: [],
      total: 5,
    },
    "The Urinary System": {
      visited: [],
      total: 5,
    },
    "The Reproductive System": {
      visited: [],
      total: 6,
    },
    "The Special Senses": {
      visited: [],
      total: 4,
    },

  };

  const [visitedSubtopics, setVisitedSubtopics] = useState(initialVisitedState);

  // Function to mark a subtopic as visited
  const markSubtopicVisited = (chapter, subtopic) => {
    setVisitedSubtopics((prevState) => {
      const chapterData = prevState[chapter];

      // If chapter exists and subtopic has not already been visited
      if (chapterData && !chapterData.visited.includes(subtopic)) {
        const updatedVisited = [...chapterData.visited, subtopic];

        return {
          ...prevState,
          [chapter]: {
            ...chapterData,
            visited: updatedVisited,
          },
        };
      }

      return prevState;
    });
  };

  // Function to calculate progress as a percentage
  const getChapterProgress = (chapter) => {
    const chapterData = visitedSubtopics[chapter];
    if (chapterData) {
      const { visited, total } = chapterData;
      return (visited.length / total) * 100; // Return progress percentage
    }
    return 0;
  };
  const isSubtopicVisited = (chapter, subtopic) => {
    const chapterData = visitedSubtopics[chapter];
    return chapterData ? chapterData.visited.includes(subtopic) : false;
  };

  // Function to check if all subtopics of a chapter have been visited
  const isChapterCompleted = (chapter) => {
    const chapterData = visitedSubtopics[chapter];
    return chapterData && chapterData.visited.length === chapterData.total;
  };

  return (
    <VisitedContext.Provider
      value={{
        visitedSubtopics,
        markSubtopicVisited,
        getChapterProgress,
        isChapterCompleted,
        isSubtopicVisited,
      }}
    >
      {children}
    </VisitedContext.Provider>
  );
};
