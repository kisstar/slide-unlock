import {
  h,
  bindEvents,
  debounce,
  isFunction,
  unbindEvents,
  isEl,
  isString,
  $,
} from './utils';
import { AnyFunction } from './types';

/**
 * Class implement slide verification.
 * @example
 * new SlideUnlock().init()
 */
export default class SlideUnlock {
  /**
   * 初始化滑块，处理配置
   * @param {Element | string} el 挂载的元素或对应的选择器
   * @param {object} options 配置项
   */

  private options: Options;

  private succeeded: boolean;

  private el?: HTMLElement;

  private rootEl?: HTMLElement;

  private bgEl?: HTMLElement;

  private blockEl?: HTMLElement;

  private textEl?: HTMLElement;

  private timer = 0;

  private debouncedHandleMouseMove?: typeof SlideUnlock.prototype.handleMouseMove;

  constructor(options?: Options) {
    this.options = {
      placeholder: 'Please drag the slider to the right',
      message: 'Unlock succeeded',
      duration: 500,
      prefix: 'ks',
      ...options,
    };
    this.succeeded = false;
  }

  /**
   * @public
   * @method
   * @name init
   * @description 创建滑块的 DOM 结构，并添加鼠标在滑块上按下的监听器
   * @returns {void}
   */
  init() {
    const { prefix, width, height } = this.options;
    const classPrefix = prefix ? `${prefix}-` : '';

    this.rootEl = h('div', {
      class: `${classPrefix}slide-track`,
      style: `width: ${width || '100%'};${height ? ` height: ${height};` : ''}`,
    });
    this.bgEl = this.rootEl.appendChild(
      h('div', { class: `${classPrefix}slide-bg` }),
    );
    this.blockEl = this.rootEl.appendChild(
      h('div', { class: `${classPrefix}slide-block` }),
    );
    this.textEl = this.rootEl.appendChild(
      h('p', { class: `${classPrefix}slide-text` }, this.options.placeholder),
    );
    this.bindEvents();
  }

  /**
   * @public
   * @method
   * @name isSucceeded
   * @description 返回当前滑块的状态
   * @param {string | HTMLElement} el 挂载点，可以是一个元素或者一个 CSS 选择器
   * @returns {void}
   */
  mount(el: keyof HTMLElementTagNameMap | HTMLElement) {
    if (isEl(el)) {
      this.el = el as HTMLElement;
    } else if (isString(el)) {
      this.el = $(el as keyof HTMLElementTagNameMap) as HTMLElement;
    }

    if (!this.el || !this.rootEl) {
      return;
    }

    this.el.insertBefore(this.rootEl, this.el.firstChild);
  }

  /**
   * @public
   * @method
   * @name isSucceeded
   * @description 返回当前滑块的状态
   * @returns {boolean}
   */
  isSucceeded() {
    return this.succeeded;
  }

  /**
   * @public
   * @method
   * @name reset
   * @description 重置滑块的状态
   * @returns {void}
   */
  reset() {
    if (!this.succeeded || !this.bgEl || !this.blockEl || !this.textEl) {
      return;
    }

    const { placeholder = '', duration, prefix } = this.options;

    this.succeeded = false;
    this.bgEl.style.cssText = `transition: width ${duration}ms ease; width: 0;`;
    this.blockEl.style.cssText = `transition: left ${duration}ms ease; left: 0;`;
    this.textEl.style.cssText = `color: #5f5f5f; left: ${this.blockEl.offsetWidth}px; right: 0;`;
    this.textEl.textContent = placeholder;
    this.blockEl.classList.remove(`${prefix ? `${prefix}-` : ''}slide-success`);
    this.bindEvents();
  }

  /**
   * @private
   * @method
   * @name bindEvents
   * @description 绑定鼠标的按下和松开事件
   * @returns {void}
   */
  private bindEvents() {
    if (!this.blockEl) {
      return;
    }

    bindEvents(this.blockEl, 'mousedown touchstart', this.handleMouseDown);
    bindEvents(document, 'mouseup touchend', this.handleMouseUp);
  }

  /**
   * @private
   * @method
   * @name handleMouseDown
   * @description 滑块上鼠标按下的监听器，主要记录鼠标的横坐标并指定滑块滑动的监听器
   * @param {MouseEvent | TouchEvent} eve 一个基于 Event 的对象
   * @returns {void}
   */
  private handleMouseDown: (
    this: SlideUnlock,
    eve: MouseEvent | TouchEvent,
  ) => void = (eve) => {
    if (!this.bgEl || !this.blockEl) {
      return;
    }

    const downx =
      (eve as MouseEvent).clientX ||
      (eve as TouchEvent).changedTouches[0].clientX;

    if (eve.cancelable) {
      eve.preventDefault(); // 阻止默认行为
    }

    if (this.succeeded) {
      return;
    }

    // 取消在手动滑动过程中的动画效果
    this.bgEl.style.transition = '';
    this.blockEl.style.transition = '';

    bindEvents(
      this.blockEl,
      'mousemove touchmove',
      (this.debouncedHandleMouseMove = debounce(
        this.handleMouseMove,
        this,
        4,
        downx,
      )),
    );
  };

  /**
   * @private
   * @method
   * @name handleMouseMove
   * @description 滑块滑动的监听器，主要更新滑块位置和背景元素的宽度
   * @param {number} downx 事件发生时的应用客户端区域的水平坐标
   * @param {MouseEvent | TouchEvent} eve 一个基于 Event 的对象
   * @returns {void}
   */
  private handleMouseMove = (downx: number, eve: MouseEvent | TouchEvent) => {
    if (
      this.succeeded ||
      !this.rootEl ||
      !this.blockEl ||
      !this.bgEl ||
      !this.textEl
    ) {
      return;
    }

    const { prefix, message = '', success } = this.options;
    const info = this.blockEl.getBoundingClientRect();
    const x =
      (eve as MouseEvent).clientX ||
      (eve as TouchEvent).changedTouches[0].clientX;
    const y =
      (eve as MouseEvent).clientY ||
      (eve as TouchEvent).changedTouches[0].clientY;
    const x1 = info.left;
    const y1 = info.top;
    const x2 = info.right;
    const y2 = info.bottom;
    const moveX = x - downx;

    if (moveX < 0) {
      return;
    }
    if (x < x1 || x > x2 || y < y1 || y > y2) {
      // 当鼠标移开滑块时取消移动
      return;
    }

    this.blockEl.style.left = `${moveX}px`;
    this.bgEl.style.width = `${moveX}px`;

    if (moveX >= this.rootEl.offsetWidth + x1 - x2) {
      this.succeeded = true;
      this.textEl.textContent = message;
      this.textEl.style.cssText = `color: #fff; left: 0; right: ${this.blockEl.offsetWidth}px;`;
      this.blockEl.classList.add(`${prefix ? `${prefix}-` : ''}slide-success`);

      if (isFunction(success)) {
        // 为了避免阻塞成功提示界面的渲染，你可以设置两百毫秒左右的延迟
        (success as AnyFunction).call(this);
      }
    }
  };

  /**
   * @private
   * @method
   * @name handleMouseUp
   * @description 鼠标松开的监听器，主要用于重置
   * @param {MouseEvent} eve 一个基于 Event 的对象
   * @returns {void}
   */
  private handleMouseUp = () => {
    if (!this.blockEl || !this.bgEl || !this.debouncedHandleMouseMove) {
      return;
    }

    clearTimeout(this.timer);
    unbindEvents(
      this.blockEl,
      'mousemove touchmove',
      this.debouncedHandleMouseMove,
    );

    if (this.succeeded) {
      unbindEvents(this.blockEl, 'mousedown touchstart', this.handleMouseDown);
      unbindEvents(document, 'mouseup touchend', this.handleMouseUp);
      return;
    }

    // 给重置过程添加动画效果
    this.bgEl.style.cssText = `transition: width ${this.options.duration}ms ease; width: 0;`;
    this.blockEl.style.cssText = `transition: left ${this.options.duration}ms ease; left: 0;`;
  };
}

interface Options {
  placeholder?: string;
  message?: string;
  duration?: number;
  prefix?: string;
  width?: string;
  height?: string;
  success?: AnyFunction;
}
