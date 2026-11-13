import React, { useState, useRef } from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  Eye,
  EyeOff,
  Search,
  RefreshCw,
  ShieldCheck,
  PieChart,
  Bell,
  Rotate3d,
  Sparkles,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Layers,
  Lock,
  X
} from 'lucide-react';

interface CryptoAsset {
  id: string;
  name: string;
  symbol: string;
  amount: number;
  priceBrl: number;
  change24h: number;
  color: string;
  accentGradient: string;
  sparkline: number[];
}

const INITIAL_ASSETS: CryptoAsset[] = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    amount: 0.145,
    priceBrl: 542890.0,
    change24h: 4.82,
    color: '#F59E0B',
    accentGradient: 'from-amber-500/30 via-amber-500/10 to-slate-900',
    sparkline: [42, 48, 45, 56, 62, 59, 74]
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    amount: 2.35,
    priceBrl: 18940.5,
    change24h: 3.15,
    color: '#22D3EE',
    accentGradient: 'from-cyan-500/30 via-cyan-500/10 to-slate-900',
    sparkline: [30, 34, 33, 40, 44, 49, 55]
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    amount: 18.5,
    priceBrl: 1185.0,
    change24h: 7.64,
    color: '#A855F7',
    accentGradient: 'from-purple-500/30 via-purple-500/10 to-slate-900',
    sparkline: [20, 28, 35, 32, 48, 58, 68]
  },
  {
    id: 'cardano',
    name: 'Cardano',
    symbol: 'ADA',
    amount: 4200,
    priceBrl: 4.92,
    change24h: -1.42,
    color: '#38BDF8',
    accentGradient: 'from-sky-500/30 via-sky-500/10 to-slate-900',
    sparkline: [55, 52, 50, 48, 49, 46, 45]
  },
  {
    id: 'tether',
    name: 'Tether USD',
    symbol: 'USDT',
    amount: 1450.0,
    priceBrl: 5.78,
    change24h: 0.12,
    color: '#10B981',
    accentGradient: 'from-emerald-500/30 via-emerald-500/10 to-slate-900',
    sparkline: [50, 50, 51, 50, 51, 50, 51]
  }
];

const TIMEFRAME_DATA: Record<
  '24H' | '7D' | '1M' | '1A',
  { gainText: string; curve: number[]; positive: boolean }
> = {
  '24H': {
    gainText: '+R$ 4.892,40 (+3,94%)',
    curve: [32, 38, 35, 44, 52, 49, 64, 72],
    positive: true
  },
  '7D': {
    gainText: '+R$ 12.410,80 (+9,18%)',
    curve: [20, 26, 34, 31, 45, 58, 62, 78],
    positive: true
  },
  '1M': {
    gainText: '+R$ 28.950,00 (+22,6%)',
    curve: [15, 22, 19, 35, 48, 54, 70, 86],
    positive: true
  },
  '1A': {
    gainText: '+R$ 74.320,15 (+84,2%)',
    curve: [10, 18, 28, 25, 42, 60, 74, 92],
    positive: true
  }
};

/* =========================================================
   COMPONENTE: MOEDA 3D METÁLICA GIRATÓRIA
   ========================================================= */
function Coin3D({ fast = false, onClick }: { fast?: boolean; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      title="Toque para girar em 3D"
      className="scene-3d w-12 h-12 cursor-pointer select-none flex items-center justify-center"
    >
      <div
        className={`relative w-11 h-11 rounded-full ${
          fast ? 'coin-3d-spin-fast' : 'coin-3d-spin'
        }`}
      >
        {/* Face Frontal da Moeda 3D */}
        <div className="backface-hidden absolute inset-0 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 p-[2px] shadow-[0_0_20px_rgba(245,158,11,0.45)]">
          <div className="w-full h-full rounded-full bg-[#0B1120] flex items-center justify-center border border-amber-400/60">
            <span className="font-black text-sm tracking-tighter text-amber-400">CW</span>
          </div>
        </div>

        {/* Face Traseira da Moeda 3D */}
        <div className="backface-hidden rotate-y-180 absolute inset-0 rounded-full bg-gradient-to-br from-cyan-300 via-cyan-500 to-blue-700 p-[2px] shadow-[0_0_20px_rgba(34,211,238,0.45)]">
          <div className="w-full h-full rounded-full bg-[#0B1120] flex items-center justify-center border border-cyan-400/60">
            <span className="font-black text-xs text-cyan-400">#28</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   COMPONENTE: MINI SPARKLINE SVG
   ========================================================= */
function MiniChart({ points, positive }: { points: number[]; positive: boolean }) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const coords = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * 64;
      const y = 24 - ((p - min) / range) * 20;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width="68" height="28" viewBox="0 0 68 28" className="overflow-visible">
      <polyline
        fill="none"
        stroke={positive ? '#22D3EE' : '#F43F5E'}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={coords}
      />
    </svg>
  );
}

/* =========================================================
   COMPONENTE: GRÁFICO DE ÁREA INTERATIVO DO PORTFÓLIO
   ========================================================= */
function PortfolioAreaChart({ points }: { points: number[] }) {
  const width = 320;
  const height = 68;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;

  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * width;
    const y = height - 8 - ((p - min) / range) * (height - 16);
    return { x, y };
  });

  const linePath = coords.map((c) => `${c.x},${c.y}`).join(' ');
  const areaPath = `0,${height} ${linePath} ${width},${height}`;
  const last = coords[coords.length - 1];

  return (
    <div className="w-full overflow-hidden mt-3">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-16 overflow-visible">
        <defs>
          <linearGradient id="cwAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <polygon points={areaPath} fill="url(#cwAreaGrad)" />
        <polyline
          fill="none"
          stroke="#22D3EE"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={linePath}
        />
        {last && (
          <>
            <circle cx={last.x} cy={last.y} r="6" fill="#22D3EE" fillOpacity="0.25" />
            <circle cx={last.x} cy={last.y} r="3.2" fill="#FBBF24" />
          </>
        )}
      </svg>
    </div>
  );
}

/* =========================================================
   COMPONENTE: ITEM DE CRIPTO COM INCLINAÇÃO 3D INTERATIVA
   ========================================================= */
function AssetCard3D({
  asset,
  hideBalance,
  formatBrl,
  onSelect
}: {
  asset: CryptoAsset;
  hideBalance: boolean;
  formatBrl: (v: number) => string;
  onSelect: (asset: CryptoAsset) => void;
}) {
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const holdingValue = asset.amount * asset.priceBrl;
  const isPositive = asset.change24h >= 0;

  const handleMove = (clientX: number, clientY: number, el: HTMLDivElement) => {
    const rect = el.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width - 0.5;
    const y = (clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -y * 12, ry: x * 14 });
  };

  return (
    <div className="scene-3d">
      <div
        onClick={() => onSelect(asset)}
        onMouseMove={(e) => handleMove(e.clientX, e.clientY, e.currentTarget)}
        onMouseLeave={() => setTilt({ rx: 0, ry: 0 })}
        onTouchMove={(e) => {
          if (e.touches[0]) {
            handleMove(e.touches[0].clientX, e.touches[0].clientY, e.currentTarget);
          }
        }}
        onTouchEnd={() => setTilt({ rx: 0, ry: 0 })}
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transition: tilt.rx === 0 && tilt.ry === 0 ? 'transform 0.35s ease' : 'transform 0.08s linear'
        }}
        className="preserve-3d cursor-pointer p-3.5 rounded-2xl bg-slate-900/85 border border-slate-800/90 hover:border-cyan-500/40 flex items-center justify-between shadow-lg"
      >
        <div className="flex items-center gap-3 z-layer-1">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center font-extrabold text-sm text-slate-950 shadow-md"
            style={{
              backgroundColor: asset.color,
              boxShadow: `0 6px 18px ${asset.color}44`
            }}
          >
            {asset.symbol}
          </div>
          <div>
            <div className="font-bold text-sm text-white flex items-center gap-1.5">
              {asset.name}
            </div>
            <div className="text-xs text-slate-400">
              {hideBalance ? '••••' : `${asset.amount} ${asset.symbol}`}
            </div>
          </div>
        </div>

        <div className="z-layer-1">
          <MiniChart points={asset.sparkline} positive={isPositive} />
        </div>

        <div className="text-right z-layer-1">
          <div className="font-bold text-sm text-white">
            {hideBalance ? 'R$ ••••' : formatBrl(holdingValue)}
          </div>
          <div
            className={`text-xs font-semibold flex items-center justify-end gap-0.5 ${
              isPositive ? 'text-cyan-400' : 'text-rose-400'
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {isPositive ? '+' : ''}
            {asset.change24h}%
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [assets, setAssets] = useState<CryptoAsset[]>(INITIAL_ASSETS);
  const [hideBalance, setHideBalance] = useState(false);
  const [search, setSearch] = useState('');
  const [timeframe, setTimeframe] = useState<'24H' | '7D' | '1M' | '1A'>('24H');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [turboCoin, setTurboCoin] = useState(false);

  // Estados 3D do Cartão Principal
  const [cardTilt, setCardTilt] = useState({ rx: 0, ry: 0, glareX: 50, glareY: 50 });
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  // Navegação e Carrossel 3D
  const [activeTab, setActiveTab] = useState<'wallet' | 'stage3d'>('wallet');
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Modais
  const [modalType, setModalType] = useState<'deposit' | 'send' | null>(null);
  const [selectedSymbol, setSelectedSymbol] = useState('BTC');
  const [amountInput, setAmountInput] = useState('');
  const [detailAsset, setDetailAsset] = useState<CryptoAsset | null>(null);

  const heroRef = useRef<HTMLDivElement | null>(null);

  const totalBrl = assets.reduce((acc, item) => acc + item.amount * item.priceBrl, 0);

  const formatBrl = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const handleHeroPointer = (clientX: number, clientY: number) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const normX = (clientX - rect.left) / rect.width;
    const normY = (clientY - rect.top) / rect.height;
    setCardTilt({
      rx: -(normY - 0.5) * 16,
      ry: (normX - 0.5) * 18,
      glareX: normX * 100,
      glareY: normY * 100
    });
  };

  const resetHeroPointer = () => {
    setCardTilt({ rx: 0, ry: 0, glareX: 50, glareY: 50 });
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTurboCoin(true);
    setTimeout(() => {
      setAssets((prev) =>
        prev.map((a) => {
          const delta = (Math.random() - 0.45) * 0.018;
          const newPrice = +(a.priceBrl * (1 + delta)).toFixed(2);
          const newChange = +(a.change24h + delta * 100).toFixed(2);
          return {
            ...a,
            priceBrl: newPrice,
            change24h: newChange,
            sparkline: [
              ...a.sparkline.slice(1),
              Math.max(10, Math.min(90, a.sparkline[a.sparkline.length - 1] + delta * 800))
            ]
          };
        })
      );
      setIsRefreshing(false);
      setTurboCoin(false);
    }, 650);
  };

  const handleCopyAddress = () => {
    navigator.clipboard?.writeText('0x28CW94F8B10E77D3A9C2F81E4B28');
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 1800);
  };

  const handleTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseFloat(amountInput);
    if (!qty || qty <= 0) return;

    setAssets((prev) =>
      prev.map((item) => {
        if (item.symbol !== selectedSymbol) return item;
        const updatedAmount =
          modalType === 'deposit' ? item.amount + qty : Math.max(0, item.amount - qty);
        return { ...item, amount: +updatedAmount.toFixed(6) };
      })
    );
    setAmountInput('');
    setModalType(null);
  };

  const filteredAssets = assets.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const tfInfo = TIMEFRAME_DATA[timeframe];

  return (
    <div className="min-h-screen bg-[#060B19] text-slate-100 pb-28 max-w-md mx-auto relative overflow-hidden">
      {/* Fundo com Grade 3D em Perspectiva */}
      <div className="cyber-grid-3d absolute inset-x-0 top-0 h-72 pointer-events-none opacity-60" />

      {/* Top App Bar */}
      <header className="px-5 pt-5 pb-3 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2.5">
          <Coin3D
            fast={turboCoin}
            onClick={() => {
              setTurboCoin(true);
              setTimeout(() => setTurboCoin(false), 1200);
            }}
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg font-extrabold tracking-tight leading-none">
                Crypto<span className="text-amber-400">Watch</span>
              </h1>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-cyan-500/15 text-cyan-300 border border-cyan-400/30">
                3D
              </span>
            </div>
            <p className="text-[11px] text-cyan-400 font-medium mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Carteira #28 • Protegida
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            aria-label="Atualizar cotações"
            className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-cyan-400 active:scale-95 transition shadow-md"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
          <button
            aria-label="Notificações"
            className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 relative shadow-md"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-amber-400 absolute top-2 right-2 animate-ping" />
            <span className="w-2 h-2 rounded-full bg-amber-400 absolute top-2 right-2" />
          </button>
        </div>
      </header>

      {activeTab === 'wallet' ? (
        <>
          {/* =========================================================
              HERO CARD 3D INTERATIVO (TILT + REFLEXO + GIRO 180°)
             ========================================================= */}
          <section className="px-5 mt-2 relative z-10">
            <div
              ref={heroRef}
              onMouseMove={(e) => handleHeroPointer(e.clientX, e.clientY)}
              onMouseLeave={resetHeroPointer}
              onTouchMove={(e) => {
                if (e.touches[0]) {
                  handleHeroPointer(e.touches[0].clientX, e.touches[0].clientY);
                }
              }}
              onTouchEnd={resetHeroPointer}
              className="scene-3d"
            >
              <div
                style={{
                  transform: `rotateX(${cardTilt.rx}deg) rotateY(${
                    cardTilt.ry + (isCardFlipped ? 180 : 0)
                  }deg)`,
                  transition:
                    cardTilt.rx === 0 && cardTilt.ry === 0
                      ? 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)'
                      : 'transform 0.08s linear'
                }}
                className="preserve-3d relative w-full min-h-[258px]"
              >
                {/* FACE FRONTAL DO CARTÃO 3D */}
                <div className="backface-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#0E172A] to-slate-900 border border-slate-700/70 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.65)] relative overflow-hidden">
                  {/* Reflexo Holográfico Dinâmico */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-40 transition-opacity"
                    style={{
                      background: `radial-gradient(circle at ${cardTilt.glareX}% ${cardTilt.glareY}%, rgba(34,211,238,0.28), rgba(245,158,11,0.12) 35%, transparent 70%)`
                    }}
                  />

                  <div className="flex items-center justify-between z-layer-1">
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Patrimônio Total 3D
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setHideBalance(!hideBalance)}
                        className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg bg-slate-950/60 border border-slate-800"
                        title="Ocultar saldo"
                      >
                        {hideBalance ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => setIsCardFlipped(true)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/30 text-cyan-300 text-[11px] font-bold transition"
                        title="Virar cartão em 3D"
                      >
                        <Rotate3d className="w-3.5 h-3.5" /> Cofre
                      </button>
                    </div>
                  </div>

                  {/* Valor em Camada Z Elevada */}
                  <div className="mt-2 z-layer-2">
                    <h2 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                      {hideBalance ? 'R$ ••••••••' : formatBrl(totalBrl)}
                    </h2>
                  </div>

                  <div className="mt-2 flex items-center justify-between z-layer-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-xs font-semibold">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>{tfInfo.gainText}</span>
                    </div>

                    <div className="flex gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
                      {(['24H', '7D', '1M', '1A'] as const).map((tf) => (
                        <button
                          key={tf}
                          onClick={() => setTimeframe(tf)}
                          className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition ${
                            timeframe === tf
                              ? 'bg-amber-500 text-slate-950 shadow-sm'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {tf}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Gráfico Interativo */}
                  <PortfolioAreaChart points={tfInfo.curve} />

                  {/* Botões de Ação em Camada Z */}
                  <div className="grid grid-cols-2 gap-3 mt-3 z-layer-2">
                    <button
                      onClick={() => setModalType('deposit')}
                      className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:brightness-110 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 active:scale-95 transition"
                    >
                      <ArrowDownLeft className="w-4 h-4" /> Receber / Aportar
                    </button>
                    <button
                      onClick={() => setModalType('send')}
                      className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 font-bold text-sm active:scale-95 transition"
                    >
                      <ArrowUpRight className="w-4 h-4" /> Transferir
                    </button>
                  </div>
                </div>

                {/* FACE TRASEIRA DO CARTÃO 3D (COFRE & DISTRIBUIÇÃO) */}
                <div className="backface-hidden rotate-y-180 absolute inset-0 rounded-3xl bg-gradient-to-br from-[#0F172A] via-slate-900 to-[#091224] border border-cyan-500/40 p-5 shadow-[0_20px_50px_rgba(6,182,212,0.2)] flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                        Cofre Hardware #28
                      </span>
                    </div>
                    <button
                      onClick={() => setIsCardFlipped(false)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[11px] font-bold"
                    >
                      <Rotate3d className="w-3.5 h-3.5" /> Frente
                    </button>
                  </div>

                  {/* Barra de Alocação 3D */}
                  <div className="my-2">
                    <div className="text-[11px] text-slate-400 mb-1.5 font-medium">
                      Distribuição da Carteira
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden flex p-0.5 border border-slate-800">
                      {assets.map((a) => {
                        const pct = ((a.amount * a.priceBrl) / (totalBrl || 1)) * 100;
                        return (
                          <div
                            key={a.id}
                            style={{ width: `${Math.max(4, pct)}%`, backgroundColor: a.color }}
                            className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-500"
                            title={`${a.symbol}: ${pct.toFixed(1)}%`}
                          />
                        );
                      })}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {assets.slice(0, 4).map((a) => {
                        const pct = ((a.amount * a.priceBrl) / (totalBrl || 1)) * 100;
                        return (
                          <span
                            key={a.id}
                            className="text-[10px] font-semibold text-slate-300 flex items-center gap-1"
                          >
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: a.color }}
                            />
                            {a.symbol} {pct.toFixed(0)}%
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Chave Pública com Cópia Rápida */}
                  <div className="p-3 rounded-2xl bg-slate-950/90 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400">Endereço Público Multi-Chain</div>
                      <div className="text-xs font-mono text-cyan-300 mt-0.5">
                        0x28CW...94F8B10E77D3A9C2
                      </div>
                    </div>
                    <button
                      onClick={handleCopyAddress}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-700 transition"
                    >
                      {copiedHash ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =========================================================
              LISTA DE ATIVOS DIGITAIS COM INCLINAÇÃO 3D
             ========================================================= */}
          <section className="px-5 mt-6 relative z-10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-cyan-400" /> Seus Ativos Digitais
              </h3>
              <span className="text-[11px] text-slate-400">Toque para detalhes 3D</span>
            </div>

            <div className="relative mb-4">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar Bitcoin, ETH, SOL..."
                className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60"
              />
            </div>

            <div className="space-y-3">
              {filteredAssets.map((asset) => (
                <AssetCard3D
                  key={asset.id}
                  asset={asset}
                  hideBalance={hideBalance}
                  formatBrl={formatBrl}
                  onSelect={(item) => setDetailAsset(item)}
                />
              ))}
            </div>
          </section>
        </>
      ) : (
        /* =========================================================
           ABA 2: CARROSSEL DE PALCO 3D INTERATIVO DOS ATIVOS
           ========================================================= */
        <section className="px-5 mt-3 relative z-10">
          <div className="text-center mb-4">
            <h2 className="text-base font-extrabold text-white flex items-center justify-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" /> Palco 3D de Criptoativos
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Navegue pelos cards em rotação espacial
            </p>
          </div>

          <div className="scene-3d relative h-[340px] flex items-center justify-center my-2">
            {assets.map((asset, idx) => {
              const offset = idx - carouselIndex;
              const abs = Math.abs(offset);
              const isCenter = offset === 0;
              const holding = asset.amount * asset.priceBrl;

              return (
                <div
                  key={asset.id}
                  onClick={() => setCarouselIndex(idx)}
                  style={{
                    transform: `translateX(${offset * 68}px) translateZ(${
                      isCenter ? 60 : -abs * 95
                    }px) rotateY(${offset * -24}deg)`,
                    opacity: abs > 2 ? 0 : 1 - abs * 0.28,
                    zIndex: 20 - abs,
                    transition: 'all 0.45s cubic-bezier(0.22, 1, 0.36, 1)'
                  }}
                  className={`preserve-3d absolute w-64 rounded-3xl bg-gradient-to-b ${asset.accentGradient} bg-slate-900 border ${
                    isCenter ? 'border-amber-400/60 shadow-[0_20px_50px_rgba(245,158,11,0.22)]' : 'border-slate-800'
                  } p-5 cursor-pointer select-none`}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base text-slate-950 float-3d shadow-lg"
                      style={{ backgroundColor: asset.color }}
                    >
                      {asset.symbol}
                    </div>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        asset.change24h >= 0
                          ? 'bg-cyan-500/15 text-cyan-300'
                          : 'bg-rose-500/15 text-rose-300'
                      }`}
                    >
                      {asset.change24h >= 0 ? '+' : ''}
                      {asset.change24h}%
                    </span>
                  </div>

                  <div className="mt-5">
                    <div className="text-xs text-slate-400">{asset.name}</div>
                    <div className="text-2xl font-extrabold text-white mt-0.5">
                      {hideBalance ? 'R$ ••••••' : formatBrl(holding)}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      Saldo: {hideBalance ? '••••' : `${asset.amount} ${asset.symbol}`}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Cotação unitária</span>
                    <span className="font-bold text-amber-300">{formatBrl(asset.priceBrl)}</span>
                  </div>

                  {isCenter && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSymbol(asset.symbol);
                        setModalType('deposit');
                      }}
                      className="w-full mt-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
                    >
                      Aportar {asset.symbol}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Controles do Carrossel 3D */}
          <div className="flex items-center justify-center gap-4 mt-2">
            <button
              onClick={() =>
                setCarouselIndex((prev) => (prev - 1 + assets.length) % assets.length)
              }
              className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 hover:border-cyan-400/50 active:scale-95 transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-1.5">
              {assets.map((a, i) => (
                <button
                  key={a.id}
                  onClick={() => setCarouselIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    carouselIndex === i ? 'w-6 bg-amber-400' : 'w-2 bg-slate-700'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => setCarouselIndex((prev) => (prev + 1) % assets.length)}
              className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 hover:border-cyan-400/50 active:scale-95 transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </section>
      )}

      {/* =========================================================
          DOCK DE NAVEGAÇÃO INFERIOR FLUTUANTE
         ========================================================= */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2.5rem)] max-w-sm z-40">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/70 rounded-2xl p-1.5 shadow-[0_14px_35px_rgba(0,0,0,0.75)] grid grid-cols-2 gap-1.5">
          <button
            onClick={() => setActiveTab('wallet')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'wallet'
                ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wallet className="w-4 h-4" /> Carteira
          </button>

          <button
            onClick={() => setActiveTab('stage3d')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'stage3d'
                ? 'bg-gradient-to-r from-cyan-400 to-cyan-300 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Rotate3d className="w-4 h-4" /> Palco 3D
          </button>
        </div>
      </nav>

      {/* =========================================================
          MODAL DE DETALHES DO ATIVO EM 3D
         ========================================================= */}
      {detailAsset && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-end justify-center z-50 p-4">
          <div className="animate-modal-3d w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm text-slate-950"
                  style={{ backgroundColor: detailAsset.color }}
                >
                  {detailAsset.symbol}
                </div>
                <div>
                  <h4 className="font-bold text-base text-white">{detailAsset.name}</h4>
                  <p className="text-xs text-slate-400">
                    Preço atual: {formatBrl(detailAsset.priceBrl)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDetailAsset(null)}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
              <div>
                <div className="text-[11px] text-slate-400">Saldo em Custódia</div>
                <div className="text-sm font-bold text-white mt-0.5">
                  {detailAsset.amount} {detailAsset.symbol}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] text-slate-400">Valor Total</div>
                <div className="text-sm font-bold text-amber-400 mt-0.5">
                  {formatBrl(detailAsset.amount * detailAsset.priceBrl)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setSelectedSymbol(detailAsset.symbol);
                  setDetailAsset(null);
                  setModalType('deposit');
                }}
                className="py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm"
              >
                Aportar {detailAsset.symbol}
              </button>
              <button
                onClick={() => {
                  setSelectedSymbol(detailAsset.symbol);
                  setDetailAsset(null);
                  setModalType('send');
                }}
                className="py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 font-bold text-sm"
              >
                Transferir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL DE OPERAÇÃO (APORTE / TRANSFERÊNCIA)
         ========================================================= */}
      {modalType && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-end justify-center z-50 p-4">
          <form
            onSubmit={handleTransaction}
            className="animate-modal-3d w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-5 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-base text-white">
                {modalType === 'deposit' ? 'Registrar Novo Aporte' : 'Simular Transferência'}
              </h4>
              <button
                type="button"
                onClick={() => setModalType(null)}
                className="text-xs text-slate-400 hover:text-white px-2 py-1"
              >
                Fechar
              </button>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Criptomoeda</label>
              <select
                value={selectedSymbol}
                onChange={(e) => setSelectedSymbol(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white"
              >
                {assets.map((a) => (
                  <option key={a.symbol} value={a.symbol}>
                    {a.name} ({a.symbol})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Quantidade ({selectedSymbol})
              </label>
              <input
                type="number"
                step="any"
                required
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                placeholder="Ex: 0.05"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition"
            >
              Confirmar Operação
            </button>
          </form>
        </div>
      )}
    </div>
  );
}