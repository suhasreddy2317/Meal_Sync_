export function AuthIsometricBackground() {
  return (
    <div className="auth-isometric-bg" aria-hidden="true">
      <div className="auth-grid" />

      <svg
        className="auth-platform auth-platform-left"
        viewBox="0 0 260 220"
        fill="none"
      >
        <ellipse cx="130" cy="176" rx="92" ry="18" fill="#A91D32" opacity="0.08" />
        <path d="M25 92 130 32l105 60-105 61z" fill="#FFFFFF" stroke="#EADCD6" strokeWidth="3" />
        <path d="M25 92l105 61v35L25 127z" fill="#FFBFA5" />
        <path d="m130 153 105-61v35l-105 61z" fill="#EF6A32" opacity="0.82" />

        <ellipse cx="130" cy="96" rx="53" ry="30" fill="#FFF5EF" stroke="#FFBFA5" strokeWidth="5" />
        <ellipse cx="130" cy="96" rx="32" ry="18" fill="#FFFFFF" />
        <path d="M111 96c11-15 27-15 38-1-10 17-28 18-38 1z" fill="#EF6A32" />
        <circle cx="130" cy="94" r="7" fill="#A91D32" />

        <g className="auth-mini-float">
          <path d="m66 47 30-17 31 18-30 18z" fill="#FFFFFF" stroke="#EADCD6" strokeWidth="2" />
          <path d="m97 66 30-18v28l-30 18z" fill="#F7CDBA" />
          <path d="M66 47l31 19v28l-31-19z" fill="#FFF5EF" />
        </g>
      </svg>

      <svg
        className="auth-platform auth-platform-right"
        viewBox="0 0 280 230"
        fill="none"
      >
        <ellipse cx="140" cy="184" rx="102" ry="20" fill="#A91D32" opacity="0.08" />
        <path d="M20 112 140 44l120 68-120 69z" fill="#FFFFFF" stroke="#EADCD6" strokeWidth="3" />
        <path d="M20 112l120 69v32L20 144z" fill="#FFBFA5" />
        <path d="m140 181 120-69v32l-120 69z" fill="#EF6A32" opacity="0.82" />

        <g className="auth-mini-float-delayed">
          <path d="m82 91 40-23 43 24-40 24z" fill="#FFF5EF" stroke="#FFBFA5" strokeWidth="3" />
          <path d="m125 116 40-24v35l-40 23z" fill="#F2A98A" />
          <path d="M82 91l43 25v34l-43-25z" fill="#FFFFFF" />
          <ellipse cx="125" cy="87" rx="25" ry="14" fill="#A91D32" />
          <ellipse cx="125" cy="83" rx="14" ry="8" fill="#EF6A32" />
        </g>

        <g transform="translate(42 38)">
          <path d="m0 18 34-19 36 20-34 20z" fill="#FFFFFF" stroke="#EADCD6" strokeWidth="2" />
          <rect x="10" y="24" width="40" height="7" rx="3.5" fill="#FFBFA5" transform="skewY(-30)" />
        </g>
      </svg>

      <div className="auth-orb auth-orb-one" />
      <div className="auth-orb auth-orb-two" />
      <div className="auth-diamond auth-diamond-one" />
      <div className="auth-diamond auth-diamond-two" />
      <div className="auth-tray auth-tray-one" />
      <div className="auth-tray auth-tray-two" />
    </div>
  );
}
