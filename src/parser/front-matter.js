import matter from "gray-matter";

export function readAndParseFrontMatter(doc) {
  return matter.read(doc);
}
