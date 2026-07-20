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
    url: "https://icsxxgyhlhrwhgwtiret.supabase.co",
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imljc3h4Z3lobGhyd2hnd3RpcmV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ1NTQzNjksImV4cCI6MjEwMDEzMDM2OX0.ZX4eZOzsM4IWmoqtaygbli9SVtpcY4xOF2WA03aOOlQ",
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
