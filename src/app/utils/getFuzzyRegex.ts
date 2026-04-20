export const getFuzzyRegex = (search: string): RegExp => {
  const tokens = search
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

  const fuzzyPattern = (token: string) => token.split("").join("\\w*?");

  const combinedPattern = tokens.length > 0 ? tokens.map((t) => `(?=.*${fuzzyPattern(t)})`).join("") : search;

  return new RegExp(combinedPattern, "i");
};
