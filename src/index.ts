import { $, h, bindEvents, throttle, isFunction, unbindEvents } from './utils';

/**
 * Class implement slide verification.
 * @example
 * new SlideUnlock().init()
 */
export default class SlideUnlock {
  /**
   * 初始化滑块，处理配置
   * @param {Element} el 挂载的元素
   * @param {object} options 配置项
   */
  constructor(el = 'body', options = {}) {
    this.$el = $(el);
    this.$isSuccess = false;
    this.$options = {
      tip: '请按住滑块，拖动到最右边',
      unlockText: '验证成功',
      duration: 500,
      ...options,
    };
  }

  /**
   * @public
   * @method
   * @name init
   * @description 创建滑块的 DOM 结构，并添加鼠标在滑块上按下的监听器
   * @returns {void}
   */
  init() {
    this.$root = h('div', { class: 'slide-track' });
    this.$bg = this.$root.appendChild(h('div', { class: 'slide-bg' }));
    this.$block = this.$root.appendChild(h('div', { class: 'slide-block' }));
    this.$text = this.$root.appendChild(
      h('p', { class: 'slide-text' }, this.$options.tip),
    );
    this.$el.insertBefore(this.$root, this.$el.firstChild);
    this.bindEvents();
  }

  /**
   * @private
   * @method
   * @name bindEvents
   * @description 绑定鼠标的按下和松开事件
   * @returns {void}
   */
  bindEvents() {
    bindEvents(
      'body',
      'mousedown touchstart',
      (this.$handleMouseDown = this.handleMouseDown.bind(this)),
      this.$block,
    );
    bindEvents(
      'body',
      'mouseup touchend',
      (this.$handleMouseUp = this.handleMouseUp.bind(this)),
      document,
    );
  }

  /**
   * @private
   * @method
   * @name handleMouseDown
   * @description 滑块上鼠标按下的监听器，主要记录鼠标的横坐标并指定滑块滑动的监听器
   * @param {MouseEvent} e 一个基于 Event 的对象
   * @returns {void}
   */
  handleMouseDown(e) {
    const eve = e || window.event;
    const downx = eve.clientX || e.changedTouches[0].clientX;

    if (e.cancelable) {
      e.preventDefault(); // 阻止默认行为
    }

    if (this.$isSuccess) {
      return;
    }

    // 取消在手动滑动过程中的动画效果
    this.$bg.style.transition = '';
    this.$block.style.transition = '';

    bindEvents(
      'body',
      'mousemove touchmove',
      (this.$handleMouseMove = throttle(
        this.handleMouseMove,
        this,
        undefined,
        downx,
      )),
      this.$block,
    );
  }

  /**
   * @private
   * @method
   * @name handleMouseMove
   * @description 滑块滑动的监听器，主要更新滑块位置和背景元素的宽度
   * @param {MouseEvent} e 一个基于 Event 的对象
   * @returns {void}
   */
  handleMouseMove(downx, e) {
    const info = this.$block.getBoundingClientRect();
    const x = e.clientX || e.changedTouches[0].clientX;
    const y = e.clientY;
    const x1 = info.left;
    const y1 = info.top;
    const x2 = info.right;
    const y2 = info.bottom;
    const moveX = x - downx;

    if (this.$isSuccess) {
      return;
    }
    if (moveX < 0) {
      return;
    }
    if (x < x1 || x > x2 || y < y1 || y > y2) {
      // 当鼠标移开滑块时取消移动
      return;
    }

    this.$block.style.left = `${moveX}px`;
    this.$bg.style.width = `${moveX}px`;

    if (moveX >= this.$root.offsetWidth + x1 - x2) {
      this.$isSuccess = true;
      this.$text.textContent = this.$options.unlockText;
      this.$text.style.cssText = `color: #fff; left: 0; right: ${this.$block.offsetWidth}px;`;
      this.$block.classList.add('success');
      if (isFunction(this.$options.cb)) {
        // 为了避免阻塞成功提示界面的渲染，你可以设置两百毫秒左右的延迟
        this.$options.cb.call(this);
      }
    }
  }

  /**
   * @private
   * @method
   * @name handleMouseUp
   * @description 鼠标松开的监听器，主要用于重置
   * @param {MouseEvent} e 一个基于 Event 的对象
   * @returns {void}
   */
  handleMouseUp() {
    clearTimeout(this.$tId);
    unbindEvents(
      'body',
      'mousemove touchmove',
      this.$handleMouseMove,
      this.$block,
    );

    if (this.$isSuccess) {
      unbindEvents('body', 'mouseup touchend', this.$handleMouseUp, document);
      unbindEvents(
        'body',
        'mousedown touchstart',
        this.$handleMouseDown,
        this.$block,
      );
      return;
    }

    // 给重置过程添加动画效果
    this.$bg.style.cssText = `transition: width ${this.$options.duration}ms ease; width: 0;`;
    this.$block.style.cssText = `transition: left ${this.$options.duration}ms ease; left: 0;`;
  }

  /**
   * @public
   * @method
   * @name isSuccess
   * @description 返回当前滑块的状态
   * @returns {boolean}
   */
  isSuccess() {
    return this.$isSuccess;
  }

  /**
   * @public
   * @method
   * @name reset
   * @description 重置滑块的状态
   * @returns {void}
   */
  reset() {
    if (!this.$isSuccess) {
      return;
    }
    this.$isSuccess = false;
    this.$bg.style.cssText = `transition: width ${this.$options.duration}ms ease; width: 0;`;
    this.$block.style.cssText = `transition: left ${this.$options.duration}ms ease; left: 0;`;
    this.$text.style.cssText = `color: #5f5f5f; left: ${this.$block.offsetWidth}px; right: 0;`;
    this.$text.textContent = this.$options.tip;
    this.$block.classList.remove('success');
    this.bindEvents();
  }
}