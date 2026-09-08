import type { CSSProperties } from 'react';
import type { SeamId } from '../../lib/seamPaths';
import { asset } from '../../lib/asset';
import './SectionSeam.css';
type Props = { id: SeamId; accent?: boolean };
/** A torn foreground sheet and a separately textured, uneven fiber edge. */
export function SectionSeam({ id, accent = false }: Props) {
  const n = Number(id.slice(-2));
  return (
    <div className={`seam${accent ? ' seam--accent' : ''}`} aria-hidden="true" style={{
      '--edge-mask': `url("${asset(`design/paper/seam-${n}-mask.svg`)}")`,
      '--edge-fiber': `url("${asset(`design/paper/seam-${n}-fiber.svg`)}")`,
    } as CSSProperties}>
      <span className="seam__accent" />
      <span className="seam__sheet" />
      <span className="seam__fiber" />
    </div>
  );
}
