import { AnyFunction } from '../types';
import { $ } from './dom';
import { isString } from './type-is';

/**
 * @public
 * @function
 * @name bindEvents
 * @param {string | Element | Document} element 绑定事件的选择器或元素
 * @param {string} events 一个以空格分开的字符串，指定了要绑定的事件
 * @param {function} handler 事件监听器
 * @param {boolean | object} options 指定有关 handler 属性的可选参数对象
 * @returns {void}
 */
export const bindEvents = (
  element: string | Element | Document,
  events: string,
  handler: AnyFunction,
  options: boolean | AddEventListenerOptions = false,
) => {
  let targetEl: typeof element | null = element;

  if (isString(element)) {
    targetEl = $(element as string);
  }

  if (!targetEl) {
    return;
  }

  events.split(' ').forEach((event) => {
    (targetEl as Element).addEventListener(event, handler, options);
  });
};

/**
 * @public
 * @function
 * @name unbindEvents
 * @param {string | Element | Document} element 绑定事件的选择器或元素
 * @param {string} events 一个以空格分开的字符串，指定了要取消的事件
 * @param {function} handler 事件监听器
 * @param {boolean | object} options 指定有关 handler 属性的可选参数对象
 * @returns {void}
 */
export const unbindEvents = (
  element: string | Element | Document,
  events: string,
  handler: AnyFunction,
  options: boolean | AddEventListenerOptions = false,
) => {
  let targetEl: typeof element | null = element;

  if (isString(element)) {
    targetEl = $(element as string);
  }

  if (!targetEl) {
    return;
  }

  events.split(' ').forEach((event) => {
    (targetEl as Element).removeEventListener(event, handler, options);
  });
};
