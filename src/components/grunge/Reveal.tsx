import { motion, useInView, type Variants } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

type Mode = 'mask' | 'jerk' | 'tear' | 'glitch';

type Props = {
  children: ReactNode;
  /** Как элемент выходит на экран. */
  mode?: Mode;
  delay?: number;
  className?: string;
  as?: 'div' | 'span' | 'li' | 'section' | 'p' | 'h2' | 'h3';
};

/**
 * Появление элементов в гранж-логике: резко, со смещением и рывком.
 *
 * Брифом отдельно оговорено «не использовать стерильные корпоративные
 * появления», поэтому здесь нет мягкого fade-up — вместо него маски, сдвиги
 * по кадрам и короткий glitch.
 *
 *  mask   — текст выезжает из-под маски (шторка снизу)
 *  jerk   — влетает со сдвигом и перелётом, как приклеенный рывком
 *  tear   — «отрывается» с поворотом, будто кусок бумаги
 *  glitch — дёргается по горизонтали, VHS-срыв
 */
const VARIANTS: Record<Mode, Variants> = {
  mask: {
    hidden: { y: '108%' },
    show: { y: '0%', transition: { duration: 0.62, ease: [0.16, 1.2, 0.3, 1] } },
  },
  jerk: {
    hidden: { opacity: 0, y: 46, x: -14 },
    show: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: { duration: 0.5, ease: [0.16, 1.2, 0.3, 1] },
    },
  },
  tear: {
    hidden: { opacity: 0, y: 60, rotate: -3.5, scale: 0.965 },
    show: {
      opacity: 1,
      y: 0,
      rotate: 0,
      scale: 1,
      transition: { duration: 0.58, ease: [0.16, 1.2, 0.3, 1] },
    },
  },
  glitch: {
    hidden: { opacity: 0, x: -26, skewX: 9 },
    show: {
      opacity: [0, 1, 0.35, 1],
      x: [-26, 7, -3, 0],
      skewX: [9, -4, 2, 0],
      transition: { duration: 0.4, times: [0, 0.45, 0.7, 1], ease: 'linear' },
    },
  },
};

export function Reveal({ children, mode = 'jerk', delay = 0, className = '', as = 'div' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-8% 0px -8% 0px' });
  const MotionTag = motion[as] as typeof motion.div;

  // Для маски нужен внешний контейнер с overflow: hidden, иначе шторки не будет.
  if (mode === 'mask') {
    return (
      <span ref={ref} className={className} style={{ display: 'block', overflow: 'hidden' }}>
        <motion.span
          style={{ display: 'block', willChange: 'transform' }}
          variants={VARIANTS.mask}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          transition={{ delay }}
        >
          {children}
        </motion.span>
      </span>
    );
  }

  return (
    <MotionTag
      ref={ref}
      className={className}
      variants={VARIANTS[mode]}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      transition={{ delay }}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </MotionTag>
  );
}
