import { motion, useInView, type Variants } from 'framer-motion';
import { useEffect, useRef, useState, type ReactNode } from 'react';

type Mode = 'rise' | 'jerk' | 'tear';

type Props = {
  children: ReactNode;
  mode?: Mode;
  delay?: number;
  className?: string;
  as?: 'div' | 'span' | 'li' | 'section' | 'p' | 'h2' | 'h3';
};

/**
 * Появление элементов при прокрутке.
 *
 * Короткое и однократное: 220–420 мс, со сдвигом и лёгким перелётом.
 * Прежний режим `glitch` мигал прозрачностью 0→1→0.35→1 и «рвал» текст —
 * это отдельно запрещено и убрано.
 *
 * При `prefers-reduced-motion: reduce` анимации нет вообще: содержимое
 * сразу на месте. Настройку слушаем, а не читаем один раз при загрузке.
 */
const VARIANTS: Record<Mode, Variants> = {
  rise: {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } },
  },
  jerk: {
    hidden: { opacity: 0, y: 34, x: -10 },
    show: { opacity: 1, y: 0, x: 0, transition: { duration: 0.38, ease: [0.16, 1.2, 0.3, 1] } },
  },
  tear: {
    hidden: { opacity: 0, y: 40, rotate: -2.2 },
    show: { opacity: 1, y: 0, rotate: 0, transition: { duration: 0.42, ease: [0.16, 1.2, 0.3, 1] } },
  },
};

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  return reduced;
}

export function Reveal({ children, mode = 'jerk', delay = 0, className = '', as = 'div' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-8% 0px -8% 0px' });
  const reduced = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;

  if (reduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
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
