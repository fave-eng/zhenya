window.APP_CONFIG = {
  student: {
    id: "zhenya",
    nameRu: "Женя",
    nameEn: "Zhenya",
    level: "A1",
    textbook: "English File",
    textbookEdition: "4th edition Elementary"
  },

  supabase: {
    url: "",
    anonKey: "",
    tables: {
      homework: "homework_progress",
      vocabulary: "vocabulary_progress",
      vocabularyTopics: "vocabulary_topic_progress",
      grammar: "grammar_progress"
    }
  },

  interface: {
    language: "ru",
    russianTextPercent: 90
  },

  features: {
    homework: true,
    vocabulary: true,
    grammar: true,
    cloudSync: true,
    wordPronunciation: true,
    telegramNotifications: true
  }
};
