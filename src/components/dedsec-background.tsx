/** Fixed ambient DedSec-style background layers. */

export function DedSecBackground() {
  return (
    <div className="dedsec-bg-root" aria-hidden="true">
      <div className="dedsec-bg-texture">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/dedsec/texture-alley-mural.jpg" alt="" />
      </div>
      <div className="dedsec-bg-grid-img">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/dedsec/grid-overlay.jpg" alt="" />
      </div>
      <div className="dedsec-bg-css-grid" />
      <div className="dedsec-bg-vignette" />
      <div className="dedsec-bg-scanlines" />
    </div>
  );
}
