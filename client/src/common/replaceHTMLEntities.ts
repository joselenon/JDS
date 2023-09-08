interface EntitiesMap {
  [key: string]: string;
}

export default function replaceHTMLEntities(text: string) {
  const entitiesMap: EntitiesMap = {
    '&quot;': '"',
    '&lt;': '<',
    '&gt;': '>',
    '&amp;': '&',
  };

  return text.replace(/(&quot;|&lt;|&gt;|&amp;)/g, (match) => entitiesMap[match]);
}
