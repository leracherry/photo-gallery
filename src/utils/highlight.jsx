export default function highlightTitle(title, searchTerm) {
  if (!searchTerm) return title;

  const regex = new RegExp(`\\b\\w*${searchTerm}\\w*\\b`, "gi");
  return title.split(" ").map((word, i) => {
    const isLastWord = i === title.split(" ").length - 1;
    const space = isLastWord ? "" : " ";
    
    return word.match(regex) ? 
      <span key={i}><i>{word}</i>{space}</span> : 
      word + space;
  });
}