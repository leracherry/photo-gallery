export default function highlightTitle(title, searchTerm) {
  const query = searchTerm.trim().toLowerCase();
  if (!query) return title;
  // Literal matching keeps punctuation safe and never interprets user input as regex.
  return title
    .split(/(\s+)/)
    .map((word, index) =>
      word.toLowerCase().includes(query) ? (
        <mark key={index}>{word}</mark>
      ) : (
        word
      ),
    );
}
