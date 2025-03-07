// Fallback data for IELTS Speaking test in case API calls fail
const fallbackData = {
  testId: "SPEAKING_TEST_001",
  testData: {
    Part1: [
      "Tell me about where you live. Do you like living there?",
      "What kind of work or study do you do? Why did you choose this field?",
      "Do you have any hobbies or interests? How did you become interested in them?",
      "How often do you use public transportation? What do you think about it?"
    ],
    Part2: {
      title: "Describe a skill you would like to learn",
      cues: [
        "What this skill is",
        "How you would learn it",
        "How long it would take to learn",
        "Why you want to learn this skill"
      ],
      final_question: "Explain why this skill would be useful to you in the future."
    },
    Part3: [
      "What skills do you think are most important for young people to learn today?",
      "How has technology changed the way people learn new skills?",
      "Do you think schools should focus more on practical skills or academic knowledge?",
      "How do you think the skills people need will change in the future?"
    ]
  }
};

export default fallbackData;