import fs from "fs";
import path from "path";

type WordEntry = {
  word: string;
  translation?: string;
  rank?: number;
};

type WordData = {
  translation: string;
  partOfSpeech: string;
  exampleSentence: string;
  exampleTranslation: string;
};

const curated: Record<
  string,
  {
    translation: string;
    partOfSpeech: string;
  }
> = {
  de: {
    translation: "of",
    partOfSpeech: "preposition",
  },
  del: {
    translation: "of the",
    partOfSpeech: "preposition",
  },
  a: {
    translation: "to",
    partOfSpeech: "preposition",
  },
  en: {
    translation: "in",
    partOfSpeech: "preposition",
  },
  con: {
    translation: "with",
    partOfSpeech: "preposition",
  },
  para: {
    translation: "for",
    partOfSpeech: "preposition",
  },
  por: {
    translation: "for / by",
    partOfSpeech: "preposition",
  },
  sin: {
    translation: "without",
    partOfSpeech: "preposition",
  },
  sobre: {
    translation: "about / on",
    partOfSpeech: "preposition",
  },

  y: {
    translation: "and",
    partOfSpeech: "conjunction",
  },
  o: {
    translation: "or",
    partOfSpeech: "conjunction",
  },
  pero: {
    translation: "but",
    partOfSpeech: "conjunction",
  },
  porque: {
    translation: "because",
    partOfSpeech: "conjunction",
  },
  que: {
    translation: "that",
    partOfSpeech: "conjunction",
  },
  si: {
    translation: "if",
    partOfSpeech: "conjunction",
  },

  el: {
    translation: "the",
    partOfSpeech: "article",
  },
  la: {
    translation: "the",
    partOfSpeech: "article",
  },
  los: {
    translation: "the (plural)",
    partOfSpeech: "article",
  },
  las: {
    translation: "the (plural)",
    partOfSpeech: "article",
  },
  un: {
    translation: "a / an",
    partOfSpeech: "article",
  },
  una: {
    translation: "a / an",
    partOfSpeech: "article",
  },

  yo: {
    translation: "I",
    partOfSpeech: "pronoun",
  },
  tú: {
    translation: "you",
    partOfSpeech: "pronoun",
  },
  él: {
    translation: "he",
    partOfSpeech: "pronoun",
  },
  ella: {
    translation: "she",
    partOfSpeech: "pronoun",
  },
  nosotros: {
    translation: "we",
    partOfSpeech: "pronoun",
  },
  ellos: {
    translation: "they",
    partOfSpeech: "pronoun",
  },

  me: {
    translation: "me",
    partOfSpeech: "pronoun",
  },
  te: {
    translation: "you",
    partOfSpeech: "pronoun",
  },
  se: {
    translation:
      "oneself / reflexive pronoun",
    partOfSpeech: "pronoun",
  },
  lo: {
    translation: "it / him",
    partOfSpeech: "pronoun",
  },
  le: {
    translation: "him / her",
    partOfSpeech: "pronoun",
  },

  ser: {
    translation: "to be",
    partOfSpeech: "verb",
  },
  estar: {
    translation: "to be",
    partOfSpeech: "verb",
  },
  tener: {
    translation: "to have",
    partOfSpeech: "verb",
  },
  tengo: {
    translation: "I have",
    partOfSpeech: "verb",
  },
  hacer: {
    translation: "to do / make",
    partOfSpeech: "verb",
  },
  ir: {
    translation: "to go",
    partOfSpeech: "verb",
  },
  ver: {
    translation: "to see",
    partOfSpeech: "verb",
  },
  dar: {
    translation: "to give",
    partOfSpeech: "verb",
  },
  decir: {
    translation: "to say",
    partOfSpeech: "verb",
  },
  poder: {
    translation: "to be able",
    partOfSpeech: "verb",
  },
  querer: {
    translation: "to want",
    partOfSpeech: "verb",
  },
  venir: {
    translation: "to come",
    partOfSpeech: "verb",
  },
  pasar: {
    translation: "to happen",
    partOfSpeech: "verb",
  },
  hablar: {
    translation: "to speak",
    partOfSpeech: "verb",
  },
  comer: {
    translation: "to eat",
    partOfSpeech: "verb",
  },
  vivir: {
    translation: "to live",
    partOfSpeech: "verb",
  },

  ahora: {
    translation: "now",
    partOfSpeech: "adverb",
  },
  ya: {
    translation: "already",
    partOfSpeech: "adverb",
  },
  muy: {
    translation: "very",
    partOfSpeech: "adverb",
  },
  más: {
    translation: "more",
    partOfSpeech: "adverb",
  },

  bueno: {
    translation: "good",
    partOfSpeech: "adjective",
  },
  grande: {
    translation: "big",
    partOfSpeech: "adjective",
  },
  pequeño: {
    translation: "small",
    partOfSpeech: "adjective",
  },

  casa: {
    translation: "house",
    partOfSpeech: "noun",
  },
  libro: {
    translation: "book",
    partOfSpeech: "noun",
  },
  frente: {
    translation: "front",
    partOfSpeech: "noun",
  },
};

function inferPOS(word: string) {
  if (
    word.endsWith("ar") ||
    word.endsWith("er") ||
    word.endsWith("ir")
  ) {
    return "verb";
  }

  if (word.endsWith("mente")) {
    return "adverb";
  }

  return "unknown";
}

function fallbackTranslation(
  word: string
) {
  return `[TODO] ${word}`;
}

function exampleFor(
  word: string,
  translation: string,
  pos: string
) {
  switch (pos) {
    case "verb":
      return {
        exampleSentence:
          `Voy a ${word}.`,
        exampleTranslation:
          `I am going to ${translation}.`,
      };

    case "noun":
      return {
        exampleSentence:
          `Tengo un ${word}.`,
        exampleTranslation:
          `I have a ${translation}.`,
      };

    case "adjective":
      return {
        exampleSentence:
          `Es muy ${word}.`,
        exampleTranslation:
          `It is very ${translation}.`,
      };

    case "adverb":
      return {
        exampleSentence:
          `${word} estoy aquí.`,
        exampleTranslation:
          `${translation}, I am here.`,
      };

    default:
      return {
        exampleSentence:
          `Uso la palabra ${word}.`,
        exampleTranslation:
          `I use the word ${translation}.`,
      };
  }
}

const inputPath = path.join(
  process.cwd(),
  "src/data/decks/spanish-core-1000.json"
);

const outputPath = path.join(
  process.cwd(),
  "src/data/decks/spanishDictionary.ts"
);

const words: WordEntry[] =
  JSON.parse(
    fs.readFileSync(
      inputPath,
      "utf8"
    )
  );

const dictionary:
  Record<string, WordData> =
  {};

for (const item of words) {
  const word =
    item.word.toLowerCase();

  const curatedEntry =
    curated[word];

  const translation =
    curatedEntry
      ?.translation ??
    fallbackTranslation(word);

  const partOfSpeech =
    curatedEntry
      ?.partOfSpeech ??
    inferPOS(word);

  const examples =
    exampleFor(
      word,
      translation,
      partOfSpeech
    );

  dictionary[word] = {
    translation,
    partOfSpeech,
    exampleSentence:
      examples.exampleSentence,
    exampleTranslation:
      examples.exampleTranslation,
  };
}

const content = `
export type SpanishWordData = {
  translation: string;
  partOfSpeech?: string;
  exampleSentence?: string;
  exampleTranslation?: string;
};

export const spanishDictionary:
Record<string, SpanishWordData> =
${JSON.stringify(
  dictionary,
  null,
  2
)};
`;

fs.writeFileSync(
  outputPath,
  content
);

console.log(
  "Generated spanishDictionary.ts"
);