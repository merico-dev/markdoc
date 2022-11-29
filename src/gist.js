import { uniq, trim } from "lodash";

// 匹配 {[@placeholder]} 形式的文档占位符
const CUSTOM_VAR_MATCH_REGEX = /\{\[@( ?[a-z_][\w ]*)\]\}/i;
const CUSTOM_VAR_MATCH_GLOBAL_REGEX = new RegExp(CUSTOM_VAR_MATCH_REGEX, "gi");

// 将文档中所有匹配 {[@placeholder]} 形式的占位符替换为指定数据
export const inflateDocWithData = (doc, data = {}) => {
  if (!doc || !data) {
    return doc;
  }
  const varMatched = doc.match(CUSTOM_VAR_MATCH_GLOBAL_REGEX);
  if (!Array.isArray(varMatched)) {
    return doc;
  }
  uniq(varMatched).forEach(item => {
    const placeholderMatched = item.match(CUSTOM_VAR_MATCH_REGEX);
    const placeholder = trim(placeholderMatched?.[1]);
    const targetValue = placeholder && data[placeholder];
    if (!targetValue) {
      return;
    }
    // please make sure your runtime environment supports string.replaceAll
    doc = doc.replaceAll(item, targetValue);
  });
  return doc;
};
