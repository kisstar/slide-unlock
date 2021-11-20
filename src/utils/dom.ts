import { isObject } from './type-is';

/**
 * @public
 * @function
 * @name isEl
 * @description 判断传入的一个值是否是一个元素
 * @param value 需要检查的值
 * @returns {boolean}
 */
export function isEl(value: any) {
  return isObject(value) && value.nodeType === 1;
}

/**
 * @public
 * @function
 * @name $
 * @description 获取文档中与指定选择器或选择器组匹配的第一个 HTML 元素
 * @param {string} selectors 包含一个或多个要匹配的选择器的 DOM 字符串
 * @returns {Element | null} 如果找不到匹配项，则返回 null，否则返回对应的 Element
 */
export const $ = document.querySelector;

/**
 * @private
 * @function
 * @name h
 * @description 创建由 tagName 指定的 HTML 元素
 * @param {string} tagName 指定要创建元素类型的字符串
 * @param {object} propMap 可选的，包含 class 等额外配置项
 * @param {string} text 可选的文字节点
 * @returns {Element | HTMLUnknownElement} 如果 tagName 不被识别，则创建一个 HTMLUnknownElement
 */
export const h = (tagName: string, propMap: Attribute = {}, text?: string) => {
  const ele = document.createElement(tagName);

  Object.keys(propMap).forEach((prop) => ele.setAttribute(prop, propMap[prop]));

  if (text) {
    ele.appendChild(document.createTextNode(text));
  }

  return ele;
};

interface Attribute {
  [key: string]: string;
}
