import { AnyFunction } from '../types';

/**
 * @public
 * @function
 * @name debounce
 * @description 对函数进行包装，避免高频率执行损耗性能
 * @param {function} method 需要执行函数
 * @param {object} context 函数执行时的上下文环境
 * @param {number} delay 时间，以毫秒计
 * @returns {function} 包装后的函数
 */
export const debounce = <T extends AnyFunction>(
  method: AnyFunction,
  context = {},
  delay = 4,
  ...innerParams: Parameters<T>
) => {
  const withThtottle: WithThtottle<T> = (...outParams: Parameters<T>) => {
    clearTimeout(withThtottle.timer);

    function debounceCore() {
      method.apply(context, [...innerParams, ...outParams]);
    }

    debounceCore.displayName = `debounceCore(${method.name})`;
    // Why use `window`？ See: https://stackoverflow.com/a/55550147
    withThtottle.timer = window.setTimeout(debounceCore, delay);
  };

  withThtottle.displayName = `withThtottle(${method.name})`;

  return withThtottle;
};

interface WithThtottle<T extends AnyFunction> {
  displayName: string;
  timer?: number;
  (...outParams: Parameters<T>): void;
}

export default debounce;
