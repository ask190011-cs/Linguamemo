type WordInfo = {
    translation: string;
    partOfSpeech?: string;
    exampleSentence?: string;
    exampleTranslation?: string;
  };
  
  const spanishDictionary:
    Record<string, WordInfo> =
  {
    tengo: {
      translation:
        "I have",
      partOfSpeech:
        "verb",
      exampleSentence:
        "Tengo un perro.",
      exampleTranslation:
        "I have a dog.",
    },
  
    ser: {
      translation:
        "to be",
      partOfSpeech:
        "verb",
      exampleSentence:
        "Quiero ser doctor.",
      exampleTranslation:
        "I want to be a doctor.",
    },
  
    hacer: {
      translation:
        "to do / make",
      partOfSpeech:
        "verb",
      exampleSentence:
        "Voy a hacer comida.",
      exampleTranslation:
        "I am going to make food.",
    },
  
    bueno: {
      translation:
        "good",
      partOfSpeech:
        "adjective",
      exampleSentence:
        "Es un buen libro.",
      exampleTranslation:
        "It is a good book.",
    },
  
    hay: {
      translation:
        "there is / there are",
      partOfSpeech:
        "verb",
      exampleSentence:
        "Hay muchas personas aquí.",
      exampleTranslation:
        "There are many people here.",
    },
  
    hablar: {
      translation:
        "to speak",
      partOfSpeech:
        "verb",
      exampleSentence:
        "Ella habla español.",
      exampleTranslation:
        "She speaks Spanish.",
    },
  
    comer: {
      translation:
        "to eat",
      partOfSpeech:
        "verb",
      exampleSentence:
        "Voy a comer ahora.",
      exampleTranslation:
        "I am going to eat now.",
    },
  
    vivir: {
      translation:
        "to live",
      partOfSpeech:
        "verb",
      exampleSentence:
        "Vivo en Madrid.",
      exampleTranslation:
        "I live in Madrid.",
    },
  
    casa: {
      translation:
        "house",
      partOfSpeech:
        "noun",
      exampleSentence:
        "Mi casa es grande.",
      exampleTranslation:
        "My house is big.",
    },
  
    libro: {
      translation:
        "book",
      partOfSpeech:
        "noun",
      exampleSentence:
        "Estoy leyendo un libro.",
      exampleTranslation:
        "I am reading a book.",
    },
  };
  
  export async function translateWord(
    word: string,
    from = "es",
    to = "en"
  ): Promise<WordInfo> {
    const normalized =
      word.toLowerCase();
  
    if (
      spanishDictionary[
        normalized
      ]
    ) {
      return spanishDictionary[
        normalized
      ];
    }
  
    try {
      const response =
        await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
            word
          )}&langpair=${from}|${to}`
        );
  
      const data =
        await response.json();
  
      const translation =
        data
          ?.responseData
          ?.translatedText ||
        "";
  
      return {
        translation,
        partOfSpeech:
          "unknown",
        exampleSentence:
          `${word}...`,
        exampleTranslation:
          translation,
      };
    } catch (
      error
    ) {
      console.error(
        "Translation error:",
        error
      );
  
      return {
        translation: "",
        partOfSpeech:
          "unknown",
      };
    }
  }