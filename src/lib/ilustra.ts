/* Avatar ilustrado da tela Conta (perfil fictício). */
export function svgAvatar(): string {
  return '<svg viewBox="0 0 120 120" aria-hidden="true" focusable="false">' +
    '<defs><linearGradient id="av-fundo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F5F5F5"/><stop offset="1" stop-color="#C9D3DC"/></linearGradient></defs>' +
    '<circle cx="60" cy="60" r="60" fill="url(#av-fundo)"/>' +
    '<path d="M22 120c2-22 18-32 38-32s36 10 38 32Z" fill="#1E2A36"/>' +
    '<path d="M50 78h20v14c-3 4-17 4-20 0Z" fill="#F2C3A6"/>' +
    '<path d="M34 54c0-20 12-32 28-32 15 0 26 11 26 28 0 10-3 18-3 30-5-2-8-8-9-16-4 3-12 5-20 4-8 0-15-3-18-8-2 6-3 12-2 22-4-6-2-18-2-28Z" fill="#E0703A"/>' +
    '<ellipse cx="61" cy="56" rx="17" ry="21" fill="#F7CFB4"/>' +
    '<path d="M44 46c6-12 22-16 34-6-6 1-14 1-20-3-3 5-8 8-14 9Z" fill="#E0703A"/>' +
    '<path d="M40 44c-4 6-4 14-2 18" stroke="#1E2A36" stroke-width="4" fill="none" stroke-linecap="round"/>' +
    '<rect x="34" y="56" width="7" height="12" rx="3" fill="#1E2A36"/>' +
    '<path d="M56 66c3 2 7 2 10 0" stroke="#B5634A" stroke-width="2" fill="none" stroke-linecap="round"/>' +
  '</svg>';
}
