import { assetUrl } from '../lib/assetUrl.js';
import './BookCover3D.css';

/* Animated book cover: the cover artwork itself is a photographed 3D book;
   the wrapper adds a gentle idle sway, a hover tilt and a shine sweep.
   Pure CSS transforms — no animation files, no extra JS weight. */
export default function BookCover3D({ src, title, className = '' }) {
  return (
    <div className={`wj-book3d ${className}`} role="img" aria-label={`${title} — book cover`}>
      <div className="wj-book3d-stage">
        <div className="wj-book3d-inner">
          <img src={assetUrl(src)} alt="" loading="lazy" decoding="async" />
          <span className="wj-book3d-shine" aria-hidden="true" />
        </div>
        <span className="wj-book3d-shadow" aria-hidden="true" />
      </div>
    </div>
  );
}
