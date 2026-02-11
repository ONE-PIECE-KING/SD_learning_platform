import { useEffect, useRef } from 'react';

/**
 * 滾動進場動畫 Hook
 * 使用 Intersection Observer 偵測元素進入視窗，加上 'is-visible' class
 * @param {Object} options - IntersectionObserver 設定
 * @returns {React.RefObject} ref - 綁定到目標元素的 ref
 */
export default function useScrollAnimation(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // 尊重使用者減少動畫偏好
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      element.classList.add('is-visible');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
        ...options,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [options]);

  return ref;
}
