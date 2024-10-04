export function toTitleCase(str) {
  const words = str.toLowerCase().split(" ");

  const titleCaseWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  const titleCaseStr = titleCaseWords.join(" ");

  return titleCaseStr;
}
