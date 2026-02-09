// src/layouts/public/components/Header/Header.tsx

import { HeaderNav } from "./HeaderNav";
import { HeaderActions } from "./HeaderActions";

export function Header() {
  return (
    <header role="banner" className="header">
      <div className="header__container">
        <div className="header__brand">
          <a href="/" aria-label="MediTrack Home">
            <strong>MediTrack</strong>
          </a>
        </div>

        <HeaderNav />
        <HeaderActions />
      </div>
    </header>
  );
}
