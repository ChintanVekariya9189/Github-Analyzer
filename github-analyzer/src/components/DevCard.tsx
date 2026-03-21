import { useRef } from 'react';
import { getLanguageStats } from '../utils/languageStats';
import { calculateLongestStreak } from '../utils/statsUtils';
import type { GitHubUser, GitHubRepo, HeatmapData } from '../types/github';

interface DevCardProps {
  user: GitHubUser;
  repos: GitHubRepo[];
  contributions: HeatmapData[];
}

const FONT = "'Segoe UI', system-ui, -apple-system, sans-serif";

// Helper: draw a rounded rectangle path
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

// Draw a rounded pill outline (Rank A badge style)
function drawPill(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, borderColor: string, dotColor: string, text: string) {
  const r = h / 2;
  roundRect(ctx, x, y, w, h, r);
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 1;
  ctx.stroke();

  // Green dot
  ctx.beginPath();
  ctx.arc(x + 12, y + h / 2, 3.5, 0, Math.PI * 2);
  ctx.fillStyle = dotColor;
  ctx.fill();

  // Text
  ctx.fillStyle = '#3fb950';
  ctx.font = `600 11px ${FONT}`;
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x + 22, y + h / 2);
}

// Draw GitHub octocat SVG as canvas path
function drawGithubIcon(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  const s = size / 24;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.fillStyle = color;
  const p = new Path2D('M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z');
  ctx.fill(p);
  ctx.restore();
}

const DevCard = ({ user, repos, contributions }: DevCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const totalCommits = contributions.reduce((sum, day) => sum + day.count, 0);
  const longestStreak = calculateLongestStreak(contributions);
  const topLanguages = getLanguageStats(repos).slice(0, 3);

  // === CANVAS-BASED DOWNLOAD ===
  const handleDownload = async () => {
    const SCALE = 2;
    const W = 480, H = 260, PAD = 24;

    const canvas = document.createElement('canvas');
    canvas.width = W * SCALE;
    canvas.height = H * SCALE;
    const ctx = canvas.getContext('2d')!;
    ctx.scale(SCALE, SCALE);

    // ── 1. Card Background ──
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, '#161b22');
    bgGrad.addColorStop(1, '#0d1117');
    roundRect(ctx, 0, 0, W, H, 16);
    ctx.fillStyle = bgGrad;
    ctx.fill();

    // ── 2. Card Border ──
    roundRect(ctx, 0.5, 0.5, W - 1, H - 1, 16);
    ctx.strokeStyle = '#21262d';
    ctx.lineWidth = 1;
    ctx.stroke();

    // ── 3. Subtle corner glow ──
    const glow = ctx.createRadialGradient(W - 10, 10, 0, W - 10, 10, 120);
    glow.addColorStop(0, 'rgba(88,166,255,0.08)');
    glow.addColorStop(1, 'rgba(88,166,255,0)');
    roundRect(ctx, 0, 0, W, H, 16);
    ctx.save();
    ctx.clip();
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();

    // ── 4. Avatar ──
    const AV_X = PAD, AV_Y = PAD, AV_SIZE = 64;

    // gradient ring
    const ringGrd = ctx.createLinearGradient(AV_X, AV_Y, AV_X + AV_SIZE, AV_Y + AV_SIZE);
    ringGrd.addColorStop(0, '#58a6ff');
    ringGrd.addColorStop(1, '#238636');
    roundRect(ctx, AV_X - 2, AV_Y - 2, AV_SIZE + 4, AV_SIZE + 4, 16);
    ctx.fillStyle = ringGrd;
    ctx.fill();

    // dark inner border
    roundRect(ctx, AV_X, AV_Y, AV_SIZE, AV_SIZE, 12);
    ctx.fillStyle = '#0d1117';
    ctx.fill();

    // avatar image (clipped to rounded rect)
    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const i = new Image();
        i.crossOrigin = 'anonymous';
        i.onload = () => resolve(i);
        i.onerror = reject;
        i.src = user.avatar_url + '?t=' + Date.now();
        setTimeout(() => resolve(i), 5000);
      });
      ctx.save();
      roundRect(ctx, AV_X, AV_Y, AV_SIZE, AV_SIZE, 12);
      ctx.clip();
      ctx.drawImage(img, AV_X, AV_Y, AV_SIZE, AV_SIZE);
      ctx.restore();
    } catch {
      // If avatar fails, draw a placeholder
      roundRect(ctx, AV_X, AV_Y, AV_SIZE, AV_SIZE, 12);
      ctx.fillStyle = '#30363d';
      ctx.fill();
    }

    // ── 5. Name ──
    const TXT_X = AV_X + AV_SIZE + 16;
    ctx.fillStyle = '#f0f6fc';
    ctx.font = `800 20px ${FONT}`;
    ctx.textBaseline = 'top';
    ctx.fillText(user.name ?? user.login, TXT_X, PAD + 2);

    // ── 6. Username ──
    ctx.fillStyle = '#6e7681';
    ctx.font = `400 12px monospace`;
    ctx.fillText(`@${user.login}`, TXT_X, PAD + 30);

    // ── 7. Rank A Pill ──
    const pillW = 78, pillH = 22, pillY = PAD + 52;
    drawPill(ctx, TXT_X, pillY, pillW, pillH, '#238636', '#238636', 'Rank A');

    // ── 8. Divider ──
    ctx.beginPath();
    ctx.moveTo(PAD, 122);
    ctx.lineTo(W - PAD, 122);
    ctx.strokeStyle = '#21262d';
    ctx.lineWidth = 1;
    ctx.stroke();

    // ── 9. Stats Row (4 columns now) ──
    const statLabels = ['STARS', 'COMMITS', 'STREAK', 'REPOS'];
    const statValues = [
      totalStars.toLocaleString(),
      totalCommits.toLocaleString(),
      `${longestStreak}d`,
      user.public_repos.toString(),
    ];
    const statColors = ['#e3b341', '#58a6ff', '#3fb950', '#a855f7'];
    const statW = (W - PAD * 2 - 30) / 4;
    const by = 138;
    const bh = 56; // Reduced height to fix vertical padding

    for (let i = 0; i < 4; i++) {
      const bx = PAD + i * (statW + 10);

      // Box background
      roundRect(ctx, bx, by, statW, bh, 8);
      ctx.fillStyle = '#0d1117';
      ctx.fill();
      roundRect(ctx, bx + 0.5, by + 0.5, statW - 1, bh - 1, 8);
      ctx.strokeStyle = '#21262d';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Label (moved closer to value)
      ctx.fillStyle = '#6e7681';
      ctx.font = `700 8.5px ${FONT}`;
      ctx.textBaseline = 'top';
      ctx.letterSpacing = '0.08em';
      ctx.fillText(statLabels[i], bx + 12, by + 10);
      ctx.letterSpacing = 'normal';

      // Value
      ctx.fillStyle = statColors[i];
      ctx.font = `900 19px ${FONT}`;
      ctx.fillText(statValues[i], bx + 12, by + 24);
    }

    // ── 10. Bottom Row ──
    const BOTTOM_Y = 226;

    // "STACK" label
    ctx.fillStyle = '#6e7681';
    ctx.font = `700 9px ${FONT}`;
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = '0.08em';
    ctx.fillText('STACK', PAD, BOTTOM_Y);
    ctx.letterSpacing = 'normal';

    // Tech badges colors (index 2 fixed to blue/purple)
    const langBgColors = [
      { bg: '#1c3966', text: '#79b8ff', border: '#1f4080' }, // Blue (JS-like)
      { bg: '#14532d', text: '#4ade80', border: '#166534' }, // Green (Java-like)
      { bg: '#2b213a', text: '#d8b4fe', border: '#7e22ce' }, // Purple (CSS true brand)
    ];
    let badgeX = PAD + 46;
    for (let i = 0; i < topLanguages.length; i++) {
      const lang = topLanguages[i].lang;
      const c = langBgColors[i % langBgColors.length];

      ctx.font = `600 10px ${FONT}`;
      const tw = ctx.measureText(lang).width;
      const bw = tw + 18;
      const bh = 20;
      const badgeY = BOTTOM_Y - bh / 2;

      // Badge bg
      roundRect(ctx, badgeX, badgeY, bw, bh, 10);
      ctx.fillStyle = c.bg;
      ctx.fill();
      roundRect(ctx, badgeX + 0.5, badgeY + 0.5, bw - 1, bh - 1, 10);
      ctx.strokeStyle = c.border;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Badge text
      ctx.fillStyle = c.text;
      ctx.textBaseline = 'middle';
      ctx.fillText(lang, badgeX + 9, BOTTOM_Y);

      badgeX += bw + 5;
    }

    // ── 11. GitHub branding ──
    ctx.fillStyle = '#58a6ff';
    ctx.font = `800 10px ${FONT}`;
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = '0.06em';
    const brandText = 'GITHUB ANALYZER';
    const brandTextWidth = ctx.measureText(brandText).width;
    const brandTotalWidth = 14 + 5 + brandTextWidth;
    const brandX = W - PAD - brandTotalWidth;

    drawGithubIcon(ctx, brandX, BOTTOM_Y - 7, 14, '#58a6ff');
    ctx.fillText(brandText, brandX + 19, BOTTOM_Y);
    ctx.letterSpacing = 'normal';

    // ── Download ──
    const dataUrl = canvas.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `devcard-${user.login}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Language badge colors for the UI preview
  const langColors = [
    { bg: '#1c3966', text: '#79b8ff', border: '#1f4080' },
    { bg: '#14532d', text: '#4ade80', border: '#166534' },
    { bg: '#2b213a', text: '#d8b4fe', border: '#7e22ce' }, // Purple for index 2 (CSS)
  ];

  const CARD_W = 480, CARD_H = 260, PAD = 24;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>

      {/* ─── Card Preview (UI only) ─── */}
      <div
        ref={cardRef}
        style={{
          width: `${CARD_W}px`, height: `${CARD_H}px`,
          background: 'linear-gradient(160deg, #161b22 0%, #0d1117 100%)',
          border: '1px solid #21262d', borderRadius: '16px',
          padding: `${PAD}px`, boxSizing: 'border-box',
          position: 'relative', overflow: 'hidden', fontFamily: FONT, display: 'block',
        }}
      >
        <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '140px', height: '140px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(88,166,255,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Profile Row */}
        <div style={{ position: 'absolute', top: `${PAD}px`, left: `${PAD}px`, right: `${PAD}px`, height: '86px', display: 'flex', alignItems: 'flex-start' }}>
          <div style={{ position: 'relative', width: '66px', height: '66px', flexShrink: 0, marginRight: '16px' }}>
            <div style={{ position: 'absolute', inset: '-2px', borderRadius: '14px', background: 'linear-gradient(135deg, #58a6ff, #238636)' }} />
            <div style={{ position: 'absolute', inset: '2px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#0d1117' }}>
              <img src={user.avatar_url} alt={user.login} width={62} height={62} crossOrigin="anonymous" style={{ width: '62px', height: '62px', display: 'block' }} />
            </div>
          </div>
          <div style={{ flex: 1, display: 'block' }}>
            <div style={{ fontFamily: FONT, color: '#f0f6fc', fontWeight: 800, fontSize: '20px', lineHeight: '26px', letterSpacing: '-0.01em' }}>
              {user.name ?? user.login}
            </div>
            <div style={{ fontFamily: 'monospace, monospace', color: '#6e7681', fontSize: '12px', lineHeight: '18px', marginTop: '2px' }}>
              @{user.login}
            </div>
            <div style={{ marginTop: '8px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid #238636', borderRadius: '999px', padding: '3px 10px', fontFamily: FONT, color: '#3fb950', fontSize: '11px', fontWeight: 600 }}>
                <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#238636', marginRight: '5px' }} />
                Rank A
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ position: 'absolute', top: '122px', left: `${PAD}px`, right: `${PAD}px`, height: '1px', backgroundColor: '#21262d' }} />

        {/* Stats Row (4 stats now) */}
        <div style={{ position: 'absolute', top: '138px', left: `${PAD}px`, right: `${PAD}px`, height: '56px', display: 'flex' }}>
          {[
            { label: 'Stars', value: totalStars.toLocaleString(), color: '#e3b341' },
            { label: 'Commits', value: totalCommits.toLocaleString(), color: '#58a6ff' },
            { label: 'Streak', value: `${longestStreak}d`, color: '#3fb950' },
            { label: 'Repos', value: user.public_repos.toString(), color: '#a855f7' },
          ].map((s, i) => (
            <div key={s.label} style={{ flex: 1, marginLeft: i > 0 ? '10px' : 0, backgroundColor: '#0d1117', border: '1px solid #21262d', borderRadius: '8px', padding: '10px 12px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontFamily: FONT, color: '#6e7681', fontSize: '8.5px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em', lineHeight: '1' }}>{s.label}</div>
              <div style={{ fontFamily: FONT, color: s.color, fontSize: '19px', fontWeight: 900, lineHeight: '1.2', marginTop: '4px', letterSpacing: '-0.02em' }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Bottom Row */}
        <div style={{ position: 'absolute', top: '218px', left: `${PAD}px`, right: `${PAD}px`, height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontFamily: FONT, color: '#6e7681', fontSize: '9px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em', marginRight: '8px' }}>Stack</span>
            <div style={{ display: 'flex', gap: '5px' }}>
              {topLanguages.map((s, i) => {
                const c = langColors[i % langColors.length];
                return <span key={s.lang} style={{ backgroundColor: c.bg, color: c.text, border: `1px solid ${c.border}`, borderRadius: '999px', padding: '2px 9px', fontFamily: FONT, fontSize: '10px', fontWeight: 600 }}>{s.lang}</span>;
              })}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <svg width="14" height="14" fill="#58a6ff" viewBox="0 0 24 24" style={{ marginRight: '5px' }}>
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span style={{ fontFamily: FONT, color: '#58a6ff', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Github Analyzer</span>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={handleDownload}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 32px', borderRadius: '999px', backgroundColor: '#161b22', color: '#f0f6fc', border: '1px solid #30363d', fontWeight: 700, fontSize: '14px', cursor: 'pointer', fontFamily: FONT }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#58a6ff'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#30363d'; }}
      >
        <svg width="18" height="18" fill="none" stroke="#238636" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download Dev Card
      </button>
    </div>
  );
};

export default DevCard;
