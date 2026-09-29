export interface CommunityPreset {
  id: string;
  name: string;
  primary: string;
  description: string;
  category: string;
  lightBg: string;
  darkBg: string;
  accent: string;
}

export const COMMUNITY_COLOR_PRESETS: CommunityPreset[] = [
  {
    id: 'sindoor-crimson',
    name: 'Heritage Sindoor Crimson',
    primary: '#dc2626',
    description: 'Traditional Durga & Kali Puja, Heritage Mandir & Cultural Committees',
    category: 'Puja & Heritage',
    lightBg: '#fdf8f7',
    darkBg: '#13080a',
    accent: '#ef4444',
  },
  {
    id: 'ayodhya-kesari',
    name: 'Ayodhya Kesari & Ochre',
    primary: '#ea580c',
    description: 'Dharmic Trusts, Ram Mandir Sansthans, Annakshetra & Gurukuls',
    category: 'Religious Trusts',
    lightBg: '#fdf7f4',
    darkBg: '#140c06',
    accent: '#f97316',
  },
  {
    id: 'jaiswal-amber',
    name: 'Jaiswal Swarna Amber',
    primary: '#d97706',
    description: 'Samaj Mahasabhas, Business Panchayats, Matrimonial & Youth Wings',
    category: 'Community Samaj',
    lightBg: '#fcfaf4',
    darkBg: '#141006',
    accent: '#f59e0b',
  },
  {
    id: 'oxford-navy',
    name: 'Collegiate Oxford Navy',
    primary: '#1d4ed8',
    description: 'Educational Trusts, Vidyapeeth Academies, Schools & Scholarship Boards',
    category: 'Education & Schools',
    lightBg: '#f6f8fd',
    darkBg: '#070d18',
    accent: '#3b82f6',
  },
  {
    id: 'royal-amethyst',
    name: 'Imperial Royal Amethyst',
    primary: '#7c3aed',
    description: 'Youth Wings, Pandal Art Competitions & Cultural Celebrations',
    category: 'Cultural & Youth',
    lightBg: '#faf7fd',
    darkBg: '#0f0718',
    accent: '#8b5cf6',
  },
  {
    id: 'sacred-emerald',
    name: 'Sacred Forest Emerald',
    primary: '#059669',
    description: 'Rural Welfare, Medical Trusts, Gaushalas & Environmental Foundations',
    category: 'Welfare & Health',
    lightBg: '#f4fbf7',
    darkBg: '#06130b',
    accent: '#10b981',
  },
  {
    id: 'rosewood-maroon',
    name: 'Regal Rosewood Maroon',
    primary: '#9f1239',
    description: 'Senior Citizen Forums, Historical Archives & Clan Memorials',
    category: 'Heritage Guilds',
    lightBg: '#fdf6f8',
    darkBg: '#14070c',
    accent: '#e11d48',
  },
  {
    id: 'sandstone-terracotta',
    name: 'Sandstone Terracotta',
    primary: '#b45309',
    description: 'Pilgrimage Boards, Temple Restorations & Craft Guilds',
    category: 'Pilgrimage & Craft',
    lightBg: '#fbf8f3',
    darkBg: '#130d07',
    accent: '#d97706',
  },
  {
    id: 'presidential-slate',
    name: 'Presidential Classic Slate',
    primary: '#334155',
    description: 'Modern NGO Federations, Pan-India Foundations & Institutional ERP',
    category: 'Corporate NGO',
    lightBg: '#f8fafc',
    darkBg: '#0a0e17',
    accent: '#64748b',
  },
];

export interface ThemeColors {
  primary: string;
  primaryHover: string;
  bg: string;
  surface: string;
  surfaceMuted: string;
  border: string;
  borderFocus: string;
  textAccent: string;
  badgeBg: string;
  badgeText: string;
  glow: string;
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map((char) => char + char).join('');
  }
  const num = parseInt(cleanHex, 16);
  if (isNaN(num) || cleanHex.length !== 6) {
    return { r: 220, g: 38, b: 38 }; // Default crimson
  }
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function computeThemeVars(primaryHex: string, isDark: boolean): ThemeColors {
  const preset = COMMUNITY_COLOR_PRESETS.find(
    (p) => p.primary.toLowerCase() === primaryHex.toLowerCase()
  );

  const rgb = hexToRgb(primaryHex);

  if (isDark) {
    // Rich obsidian tinted canvas with community undertones
    const darkBg = preset ? preset.darkBg : `rgb(${Math.round(10 + rgb.r * 0.04)}, ${Math.round(14 + rgb.g * 0.04)}, ${Math.round(22 + rgb.b * 0.04)})`;
    const surface = `rgba(${Math.round(18 + rgb.r * 0.04)}, ${Math.round(24 + rgb.g * 0.04)}, ${Math.round(36 + rgb.b * 0.04)}, 0.95)`;
    const surfaceMuted = `rgba(${Math.round(24 + rgb.r * 0.06)}, ${Math.round(30 + rgb.g * 0.06)}, ${Math.round(44 + rgb.b * 0.06)}, 0.9)`;

    return {
      primary: primaryHex,
      primaryHover: adjustBrightness(primaryHex, 15),
      bg: darkBg,
      surface,
      surfaceMuted,
      border: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.22)`,
      borderFocus: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.65)`,
      textAccent: adjustBrightness(primaryHex, 25),
      badgeBg: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.18)`,
      badgeText: adjustBrightness(primaryHex, 35),
      glow: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.35)`,
    };
  } else {
    // Elegant warm ivory/tinted light canvas
    const lightBg = preset ? preset.lightBg : `rgb(${Math.round(250 + rgb.r * 0.02)}, ${Math.round(250 + rgb.g * 0.02)}, ${Math.round(250 + rgb.b * 0.02)})`;
    const surface = '#ffffff';
    const surfaceMuted = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.04)`;

    return {
      primary: primaryHex,
      primaryHover: adjustBrightness(primaryHex, -15),
      bg: lightBg,
      surface,
      surfaceMuted,
      border: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.16)`,
      borderFocus: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`,
      textAccent: primaryHex,
      badgeBg: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.10)`,
      badgeText: adjustBrightness(primaryHex, -20),
      glow: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`,
    };
  }
}

export function adjustBrightness(hex: string, percent: number): string {
  const { r, g, b } = hexToRgb(hex);
  const factor = (100 + percent) / 100;
  const newR = Math.min(255, Math.max(0, Math.round(r * factor)));
  const newG = Math.min(255, Math.max(0, Math.round(g * factor)));
  const newB = Math.min(255, Math.max(0, Math.round(b * factor)));
  return `#${((1 << 24) + (newR << 16) + (newG << 8) + newB).toString(16).slice(1)}`;
}

export function applyThemeToDocument(theme: ThemeColors) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  root.style.setProperty('--community-color', theme.primary);
  root.style.setProperty('--community-color-hover', theme.primaryHover);
  root.style.setProperty('--community-bg', theme.bg);
  root.style.setProperty('--community-surface', theme.surface);
  root.style.setProperty('--community-surface-muted', theme.surfaceMuted);
  root.style.setProperty('--community-border', theme.border);
  root.style.setProperty('--community-border-focus', theme.borderFocus);
  root.style.setProperty('--community-text-accent', theme.textAccent);
  root.style.setProperty('--community-badge-bg', theme.badgeBg);
  root.style.setProperty('--community-badge-text', theme.badgeText);
  root.style.setProperty('--community-glow', theme.glow);

  // Apply directly to body for smooth full-page rendering
  document.body.style.backgroundColor = theme.bg;
}
