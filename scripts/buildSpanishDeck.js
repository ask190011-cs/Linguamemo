const fs = require("fs");

const raw =
  fs.readFileSync(
    "spanish.txt",
    "utf8"
  );

const lines =
  raw.split("\n");

const top1000 =
  lines
    .slice(0, 1000)
    .map(
      (
        line,
        index
      ) => {
        const word =
          line
            .trim()
            .split(" ")[0];

        return {
          word,
          translation: "",
          rank:
            index + 1,
        };
      }
    );

fs.writeFileSync(
  "src/data/decks/spanish-core-1000.json",
  JSON.stringify(
    top1000,
    null,
    2
  )
);

console.log(
  "Done."
);