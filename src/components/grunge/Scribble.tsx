import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { SCRIBBLES, type ScribbleKind } from '../../lib/rough';

type Props = {
  kind: ScribbleKind;
  color?: string;
  width?: number;
  /** Задержка перед тем, как каракуля начнёт «рисоваться». */
  delay?: number;
  /** Растянуть каракулю по контейнеру, игнорируя пропорции.
      Нужно подчёркиваниям: иначе SVG вписывается в блок и линия уезжает
      в середину заголовка вместо того, чтобы лечь под него. */
  stretch?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Каракуля маркером, которая дорисовывается при попадании в экран
 * (брифовые «scribble-анимации» + «рисование граффити»).
 *
 * Штрих идёт быстро и с перелётом, а не плавно — чтобы читалось как росчерк
 * от руки, а не как корпоративная анимация появления.
 */
export function Scribble({
  kind,
  color = 'var(--orange)',
  width = 200,
  delay = 0,
  stretch = false,
  className = '',
  style,
}: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: '-12% 0px' });

  return (
    <svg
      ref={ref}
      className={className}
      viewBox="0 0 200 100"
      width={width}
      preserveAspectRatio={stretch ? 'none' : 'xMidYMid meet'}
      style={{ overflow: 'visible', pointerEvents: 'none', ...style }}
      aria-hidden="true"
      focusable="false"
    >
      <motion.path
        d={SCRIBBLES[kind]}
        fill="none"
        stroke={color}
        strokeWidth={kind === 'star' ? 4 : 5}
        // Без этого неравномерное масштабирование раздавило бы толщину штриха.
        vectorEffect={stretch ? 'non-scaling-stroke' : undefined}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={inView ? { pathLength: 1, opacity: 1 } : undefined}
        transition={{
          pathLength: { duration: 0.42, delay, ease: [0.85, 0, 0.15, 1] },
          opacity: { duration: 0.01, delay },
        }}
      />
    </svg>
  );
}
