const _setHeightZero = (el: HTMLElement) => (el.style.height = "0px");
const _setHeightScroll = (el: HTMLElement) =>
  (el.style.height = `${el.scrollHeight}px`);
const _setHeightEmpty = (el: HTMLElement) => (el.style.height = "");
const _setOverflowHidden = (el: HTMLElement) => (el.style.overflow = "hidden");
const _setOverflowEmpty = (el: HTMLElement) => (el.style.overflow = "");

const transitionEvents: Record<string, (el: HTMLElement) => void> = {
  beforeEnter(el) {
    _setHeightZero(el);
    _setOverflowHidden(el);
  },
  enter: (el) => _setHeightScroll(el),
  afterEnter(el) {
    _setHeightEmpty(el);
    _setOverflowEmpty(el);
  },
  beforeLeave(el) {
    _setHeightScroll(el);
    _setOverflowHidden(el);
  },
  leave: (el) => _setHeightZero(el),
  afterLeave(el) {
    _setHeightEmpty(el);
    _setOverflowEmpty(el);
  },
};

export default transitionEvents;
