import { AnyFunction } from '../types';

export * from './dom';
export * from './event';
export * from './type-is';

/**
 * @public
 * @function
 * @name throttle
 * @description 对函数进行包装，避免高频率执行损耗性能
 * @param {function} method 需要执行函数
 * @param {object} context 函数执行时的上下文环境
 * @param {number} delay 时间，以毫秒计
 * @returns {function} 包装后的函数
 */
export const throttle = <T extends AnyFunction>(
  method: AnyFunction,
  context = {},
  delay = 4,
  ...outParams: Parameters<T>
) => {
  function withThtottle(...innerParams) {
    clearTimeout(context.$$tId);

    function throttleCore() {
      method.apply(context, [...outParams, ...innerParams]);
    }

    throttleCore.displayName = `throttleCore(${method.name})`;
    // eslint-disable-next-line no-param-reassign
    context.$$tId = setTimeout(throttleCore, delay);
  }

  withThtottle.displayName = `withThtottle(${method.name})`;

  return withThtottle;
};
