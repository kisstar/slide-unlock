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
 * @name isFunction
 * @description 判断传入的值是否是一个函数
 * @param {any} value 需要检测的值
 * @returns {boolean}
 */
export const isFunction = (value: any): boolean => {
  return Object.prototype.toString.call(value) === '[object Function]';
};
