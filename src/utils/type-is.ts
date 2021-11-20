/**
 * @public
 * @function
 * @name isString
 * @description 判断传入的值是否是一个字符串
 * @param {any} value 需要检测的值
 * @returns {boolean}
 */
export const isString = (value: any): boolean => {
  return typeof value === 'string';
};

/**
 * @public
 * @function
 * @name isObject
 * @description 判断传入的一个值是否是一个对象，包括数组、正则等，但不包括函数
 * @param value 需要检查的值
 * @returns {boolean}
 */
export function isObject(value: any) {
  return !!value && typeof value === 'object';
}

/**
 * @public
 * @function
 * @name isFunction
 * @description 判断传入的值是否是一个函数
 * @param {any} value 需要检测的值
 * @returns {boolean}
 */
export const isFunction = (value: any): boolean => {
  return Object.prototype.toString.call(value) === '[object Function]';
};
