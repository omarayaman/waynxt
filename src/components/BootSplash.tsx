import { PUBLIC_ASSETS } from "@/lib/public-assets";

export function BootSplash() {
  return (
    <div id="waynxt-boot" aria-hidden="true" aria-busy="true" aria-label="Loading Waynx">
      <div className="waynxt-boot-aurora" aria-hidden>
        <span className="waynxt-boot-orb waynxt-boot-orb-a" />
        <span className="waynxt-boot-orb waynxt-boot-orb-b" />
      </div>

      <div className="waynxt-boot-stage">
        <div className="waynxt-boot-loader" aria-hidden>
          <span className="waynxt-boot-ring waynxt-boot-ring-outer" />
          <span className="waynxt-boot-ring waynxt-boot-ring-inner" />
          <span className="waynxt-boot-core">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={PUBLIC_ASSETS.icons.waynxt} alt="" width={52} height={52} className="waynxt-boot-logo" />
          </span>
        </div>

        <p className="waynxt-boot-tagline">Waynx</p>
        <div className="waynxt-boot-dots" aria-hidden>
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}
