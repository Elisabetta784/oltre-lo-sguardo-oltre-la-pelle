"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArchiveItem } from "@/data/archiveData";
import { ArrowLeft, ZoomIn, Info } from "lucide-react";

export type BeyondCategoryId =
  | "mascherabilita"
  | "accettabilitaSociale"
  | "percezioneSociale"
  | "percezioneEstetica"
  | "valenzaDelRicordo"
  | "sensoDiVergogna";

export interface BeyondCategoryMeta {
  id: BeyondCategoryId;
  label: string;
  excelHeader: string;
  subtitle: string;
  considerations: string;
  groups: [
    {
      value: string;
      aliases?: string[];
      label: string;
      subLabel: string;
    },
    {
      value: string;
      aliases?: string[];
      label: string;
      subLabel: string;
    }
  ];
}

export const BEYOND_CATEGORIES: BeyondCategoryMeta[] = [
  {
    id: "mascherabilita",
    label: "MASCHERABILITÀ",
    excelHeader: "Mascherabilità",
    subtitle: "Visibilità corporea: occultamento vs esposizione del segno",
    considerations:
      "La mascherabilità definisce la misura per cui un segno può essere nascosto deliberatamente o esposto allo sguardo esterno. Nei casi studio analizzati la maggior parte tratta di segni camuffabili, perché presenti in aree del corpo quali addome, seno e cosce. I segni mascherabili consentono di mantenere un controllo biografico, l'individuo sceglie volontariamente a chi mostrare i propri segni cutanei e a chi rivelarne la storia. I segni più mascherabili che vengono mostrati in opere e campagne hanno più comunemente lo scopo di sensibilizzare e normalizzare.\n\nQuando invece un segno è impossibile da nascondere, diventa soggetto ad esposizioni a reazioni sociali spesso penalizzanti. Vengono ritenuti maggiormente come non accettati socialmente e come esteticamente respingenti.",
    groups: [
      {
        value: "Mascherabile",
        aliases: ["Coperto"],
        label: "MASCHERABILE",
        subLabel: "Occultabile con abiti ordinari o make-up",
      },
      {
        value: "Non mascherabile",
        aliases: ["Scoperto"],
        label: "NON MASCHERABILE",
        subLabel: "Esposto su viso, mani o estensione totale",
      },
    ],
  },
  {
    id: "accettabilitaSociale",
    label: "ACCETTABILITÀ SOCIALE",
    excelHeader: "Accettabilità Sociale",
    subtitle: "Integrazione pubblica: normalizzazione vs stigma",
    considerations:
      "Più della metà dei casi archiviati ricade nel tabù visivo del non socialmente accettato, evidenziando come le alterazioni cutanee siano soggette a giudizio esterno. Ustioni, cicatrici da traumi violenti o chirurgici sono segni che se visti da un'occhio esterno si fermano ad un giudizio estetico e non riescono ad essere empatizzati da chi non li ha vissuti. I casi socialmente accettati vedono principalmente smagliature o cicatrici da parto, segni generalmente legati a ricordi positivi e normalizzabili grazie a estetizzazione attraverso campagne di body positivity.",
    groups: [
      {
        value: "Socialmente accettato",
        aliases: ["Eroicizzato"],
        label: "SOCIALMENTE ACCETTATO",
        subLabel: "Segni normalizzati o celebrati mediaticamente",
      },
      {
        value: "Socialmente non accettato",
        aliases: ["Non eroicizzato"],
        label: "NON ACCETTATO",
        subLabel: "Segni marginalizzati, tabù o censurati",
      },
    ],
  },
  {
    id: "percezioneSociale",
    label: "PERCEZIONE SOCIALE",
    excelHeader: "Percezione Sociale",
    subtitle: "Reazione empatica collettiva: compassione vs allarme",
    considerations:
      "Nella quasi totalità dei casi, lo sguardo collettivo percepisce un segno cutaneo come compassionevole. Questo non indica direttamente la capacità del pubblico di empatizzare, anzi, spesso si ricade nell'ambivalenza tra pietà ed emarginazione estetica. La società tenta di provare empatia per la sofferenza o la maternità, ma mantiene una distanza normativa ed estetica dal corpo \"imperfetto\". La percezione del segno come minaccia si attiva in contesti ben specifici legati alla violenza sistemica, alla devianza percepita o al trauma bellico. Ancor'più se i segni sono presenti sul volto, per via di un rimando a uno stereotipo iconografico.",
    groups: [
      {
        value: "Visto in modo compassionevole",
        aliases: ["Sottrazione"],
        label: "COMPASSIONEVOLE",
        subLabel: "Sguardo empatico, assistenziale o di cura",
      },
      {
        value: "Visto come minaccia",
        aliases: ["Alterità"],
        label: "MINACCIA",
        subLabel: "Sguardo allarmato, timore o diffidenza",
      },
    ],
  },
  {
    id: "percezioneEstetica",
    label: "PERCEZIONE ESTETICA",
    excelHeader: "Percezione Estetica",
    subtitle: "Canone visivo: rottura vs risemantizzazione dell'attrazione",
    considerations:
      "Dall'analisi emerge che per la maggior parte dei casi il canone estetico della pelle liscia e levigata influisce nella percezione visiva dei segni come una caratteristica respingente, imperfetta e da correggere. Per la maggior parte si tratta di segni derivati da traumi e cure mediche. La piccola percentuale dei casi percepiti come attraenti trattano i segni cutanei come mezzo di unicità e potenza scultorea. In questi pochi casi la pelle diventa topografia viva, dotata di sensualità e bellezza non convenzionale.",
    groups: [
      {
        value: "Visto come respingente",
        aliases: ["Deconfigurazione"],
        label: "RESPINGENTE",
        subLabel: "Rottura del canone di levigatezza e simmetria",
      },
      {
        value: "Visto come attraente",
        aliases: ["Riconfigurazione"],
        label: "ATTRAENTE",
        subLabel: "Fascino scultoreo, unicità e sensualità",
      },
    ],
  },
  {
    id: "valenzaDelRicordo",
    label: "VALENZA DEL RICORDO",
    excelHeader: "Valenza del Ricordo",
    subtitle: "Memoria biografica: cicatrice come trauma vs testimonianza",
    considerations:
      "La maggioranza dei casi presi in considerazione sono legati a segni provocati da un atto traumatico: violenze, incidenti, imposizioni sistemiche. Dei casi che sono legati ad un ricordo a valenza positiva la totalità si trova al di sotto della tematica trasformazione (quindi smagliature, segni del parto, riappropriazione corporea) vengono rivendicate come simboli di vita, maternità e crescita individuale. I segni indelebili sulla pelle sono le testimonianze del nostro vissuto e la pelle agisce involontariamente come archivio di traumi e trasformazioni. Questi segni spesso non possono essere cancellati ma possono diventare testimonianze identitarie.",
    groups: [
      {
        value: "legato a un ricordo positivo",
        aliases: ["Tracciato generativo"],
        label: "RICORDO POSITIVO",
        subLabel: "Nascita, guarigione, rinascita o forza",
      },
      {
        value: "legato a un ricordo negativo",
        aliases: ["Tracciato traumatico"],
        label: "RICORDO NEGATIVO",
        subLabel: "Incidente, violenza, patologia o perdita",
      },
    ],
  },
  {
    id: "sensoDiVergogna",
    label: "SENSO DI VERGOGNA",
    excelHeader: "Senso di Vergogna",
    subtitle: "Relazione intima col sé: vergogna vs rivendicazione d'agency",
    considerations:
      "Da questa categoria emerge un dato interessante: il sentimento della vergogna è proprio solo della metà dei casi trattati. Da tenere in considerazione che la maggior parte dei casi studi trattano di segni mascherabili, quindi meno esposti al giudizio. Nonostante questo, l'equilibrio mette a confronto il senso di inadeguatezza e la riconquista dell'agency corporea. Se nel primo caso la vergogna porta all'impulso di nascondere i segni cutanei per il peso del giudizio altrui, nel secondo caso si cerca di trasformare la propria pelle in atto di presenza, come una testimonianza del proprio vissuto e convertendo la vulnerabilità in orgoglio.",
    groups: [
      {
        value: "non ne provo vergogna",
        aliases: ["Senza attrito"],
        label: "NESSUNA VERGOGNA",
        subLabel: "Orgoglio, accettazione e presenza pubblica",
      },
      {
        value: "ne provo vergogna",
        aliases: ["Con attrito"],
        label: "SENSO DI VERGOGNA",
        subLabel: "Disagio, pudore, occultamento o isolamento",
      },
    ],
  },
];

interface BeyondViewProps {
  items: ArchiveItem[];
  activeItemId: string;
  onSelectItem: (item: ArchiveItem) => void;
  onBackToMacro: () => void;
}

export function BeyondView({
  items,
  activeItemId,
  onSelectItem,
  onBackToMacro,
}: BeyondViewProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<BeyondCategoryId>("mascherabilita");
  const [hoveredItem, setHoveredItem] = useState<ArchiveItem | null>(null);

  const activeCategory = useMemo(() => {
    return BEYOND_CATEGORIES.find((c) => c.id === activeCategoryId) || BEYOND_CATEGORIES[0];
  }, [activeCategoryId]);

  const visualItems = useMemo(() => {
    return items.filter((item) => item.type !== "text");
  }, [items]);

  const groupedData = useMemo(() => {
    return activeCategory.groups.map((group) => {
      const groupItems = visualItems.filter((item) => {
        const itemVal = (item[activeCategory.id] || "").trim().toLowerCase();
        const targetVal = group.value.trim().toLowerCase();
        if (itemVal === targetVal) return true;
        if (group.aliases && group.aliases.some((a) => a.trim().toLowerCase() === itemVal)) return true;
        return false;
      });

      return {
        ...group,
        items: groupItems,
      };
    });
  }, [visualItems, activeCategory]);

  const leftGroup = groupedData[0];
  const rightGroup = groupedData[1];
  const totalAnalyzed = leftGroup.items.length + rightGroup.items.length;
  const leftPercent = totalAnalyzed > 0 ? Math.round((leftGroup.items.length / totalAnalyzed) * 100) : 50;
  const rightPercent = 100 - leftPercent;

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let accumulatedDelta = 0;
    let timer: NodeJS.Timeout | null = null;
    let isLocked = false;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isLocked) return;

      const isZoomIn = (e.ctrlKey && e.deltaY < 0) || (!e.ctrlKey && e.deltaY > 0);

      if (isZoomIn) {
        accumulatedDelta += Math.abs(e.deltaY);
        if (accumulatedDelta > 45) {
          isLocked = true;
          accumulatedDelta = 0;
          onBackToMacro();
        }
      }

      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        accumulatedDelta = 0;
      }, 350);
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", handleWheel);
      if (timer) clearTimeout(timer);
    };
  }, [onBackToMacro]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden flex flex-col justify-between bg-[#F8F8F6] text-black font-body select-none"
    >
      {/* 1. TOP CONTROL BAR */}
      <div className="w-full z-20 px-4 sm:px-8 pt-3.5 pb-2.5 border-b border-black/15 bg-[#F8F8F6]/95 backdrop-blur-sm">
        <div className="w-full flex flex-col md:flex-row md:items-center justify-start gap-4 sm:gap-8">
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={onBackToMacro}
              className="flex items-center gap-1.5 font-display text-[11px] font-bold text-black hover:opacity-75 uppercase tracking-wider cursor-pointer group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>← MACRO</span>
            </button>
            <span className="text-black/30">|</span>
            <span className="font-display text-xs sm:text-[13px] font-black tracking-widest text-black uppercase whitespace-nowrap">
              OLTRE · VISIONE SISTEMICA
            </span>
          </div>

          {/* Symmetrical 2-Row Layout of Categories */}
          <div className="flex flex-col items-start gap-1.5 flex-shrink-0">
            <div className="flex flex-wrap items-center gap-1.5">
              {BEYOND_CATEGORIES.slice(0, 3).map((cat) => {
                const isActive = cat.id === activeCategoryId;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategoryId(cat.id)}
                    className={`font-display text-[10px] tracking-wider uppercase px-2.5 py-1 border transition-all cursor-pointer whitespace-nowrap rounded-none ${
                      isActive
                        ? "border-black bg-black text-[#F8F8F6] font-bold shadow-sm"
                        : "border-black/20 text-black/80 hover:border-black hover:text-black bg-transparent"
                    }`}
                  >
                    [{cat.label}]
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {BEYOND_CATEGORIES.slice(3, 6).map((cat) => {
                const isActive = cat.id === activeCategoryId;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategoryId(cat.id)}
                    className={`font-display text-[10px] tracking-wider uppercase px-2.5 py-1 border transition-all cursor-pointer whitespace-nowrap rounded-none ${
                      isActive
                        ? "border-black bg-black text-[#F8F8F6] font-bold shadow-sm"
                        : "border-black/20 text-black/80 hover:border-black hover:text-black bg-transparent"
                    }`}
                  >
                    [{cat.label}]
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN CANVAS: Symmetrical 3-Column Layout */}
      <div className="relative flex-1 w-full h-full overflow-hidden flex items-center justify-center p-3 sm:p-6 px-4 sm:px-8">
        <div className="absolute top-0 left-0 right-0 h-8 edge-fade-top pointer-events-none z-10" />
        <div className="absolute bottom-0 left-0 right-0 h-8 edge-fade-bottom pointer-events-none z-10" />

        <div className="relative w-full h-full max-w-7xl flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6 my-auto">
          {(() => {
            const renderOrbitGroup = (group: typeof leftGroup, isLeft: boolean) => {
              const totalInGroup = group.items.length;
              const numRings = totalInGroup > 50 ? 3 : totalInGroup > 22 ? 2 : 1;
              const orbitDiameter = 340;
              const center = orbitDiameter / 2;

              return (
                <motion.div
                  key={`${isLeft ? "left" : "right"}-${activeCategory.id}-${group.value}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="relative flex items-center justify-center"
                  style={{ width: `${orbitDiameter}px`, height: `${orbitDiameter}px` }}
                >
                  <div className="absolute inset-0 rounded-full border border-dashed border-black/20 pointer-events-none" />
                  {numRings >= 2 && (
                    <div
                      className="absolute rounded-full border border-dotted border-black/15 pointer-events-none"
                      style={{
                        width: numRings === 3 ? "245px" : "210px",
                        height: numRings === 3 ? "245px" : "210px",
                      }}
                    />
                  )}
                  {numRings === 3 && (
                    <div
                      className="absolute rounded-full border border-dotted border-black/10 pointer-events-none"
                      style={{ width: "170px", height: "170px" }}
                    />
                  )}

                  {/* SQUADRATO CENTER BADGE */}
                  <div className="z-10 flex flex-col items-center justify-center text-center p-3.5 bg-white border-2 border-black shadow-lg max-w-[155px] select-none rounded-none">
                    <span className="font-display text-[11px] sm:text-xs font-black tracking-wider text-black uppercase leading-tight">
                      {group.label}
                    </span>
                    <span className="font-display text-[10px] text-black font-bold mt-1">
                      {group.items.length} CASI ({isLeft ? leftPercent : rightPercent}%)
                    </span>
                    <span className="font-body text-[8px] text-black/60 leading-tight mt-1 max-w-[130px]">
                      {group.subLabel}
                    </span>
                  </div>

                  {/* Orbiting Case Study Miniatures with translucency */}
                  {group.items.map((item, itemIdx) => {
                    const ringIdx = itemIdx % numRings;
                    const itemsInThisRing = Math.ceil(totalInGroup / numRings);
                    const indexInRing = Math.floor(itemIdx / numRings);

                    let currentRadius = 158;
                    if (numRings === 2) {
                      currentRadius = ringIdx === 0 ? 158 : 105;
                    } else if (numRings === 3) {
                      currentRadius = ringIdx === 0 ? 162 : ringIdx === 1 ? 122 : 85;
                    }

                    const angle = (indexInRing / Math.max(1, itemsInThisRing)) * 2 * Math.PI - Math.PI / 2;
                    const x = center + currentRadius * Math.cos(angle);
                    const y = center + currentRadius * Math.sin(angle);
                    const tileSize = totalInGroup > 50 ? 22 : totalInGroup > 22 ? 26 : 30;
                    const isItemActive = item.id === activeItemId;

                    return (
                      <div
                        key={item.id}
                        onClick={() => onSelectItem(item)}
                        onMouseEnter={() => setHoveredItem(item)}
                        onMouseLeave={() => setHoveredItem(null)}
                        style={{
                          position: "absolute",
                          left: `${x}px`,
                          top: `${y}px`,
                          width: `${tileSize}px`,
                          height: `${tileSize}px`,
                          transform: "translate(-50%, -50%)",
                        }}
                        className="cursor-pointer group/node z-20"
                      >
                        <motion.div
                          whileHover={{ scale: 1.8, zIndex: 50 }}
                          transition={{ duration: 0.2 }}
                          className={`w-full h-full rounded-none overflow-hidden bg-white border transition-all shadow-sm ${
                            isItemActive
                              ? "border-2 border-black ring-1 ring-black"
                              : "border-black/30 group-hover/node:border-black group-hover/node:shadow-md"
                          }`}
                        >
                          {item.type === "photo" && (
                            <img
                              src={item.thumbnailUrl || item.imageUrl || ""}
                              alt=""
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover rounded-none block pointer-events-none"
                            />
                          )}
                          {item.type === "audio" && (
                            <div className="w-full h-full flex items-center justify-center p-0.5 bg-white">
                              <div className="w-1.5 h-1.5 bg-black" />
                            </div>
                          )}
                        </motion.div>
                      </div>
                    );
                  })}
                </motion.div>
              );
            };

            return (
              <>
                {/* LEFT SECTION: CIRCULAR CONSTELLATION POLO A */}
                <div className="relative flex-1 flex items-center justify-center min-w-[280px]">
                  {renderOrbitGroup(leftGroup, true)}
                </div>

                {/* CENTER SECTION: SQUADRATO CARD CON CONSIDERAZIONI */}
                <motion.div
                  key={`center-${activeCategory.id}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45 }}
                  className="w-full max-w-[340px] sm:max-w-[380px] max-h-[82vh] overflow-y-auto custom-scrollbar bg-white border-2 border-black p-5 shadow-xl select-none rounded-none flex-shrink-0 z-30"
                >
                  <div className="flex items-center justify-between border-b border-black/15 pb-2 mb-3">
                    <div className="flex items-center gap-1.5 font-display text-[10px] font-bold uppercase tracking-wider text-black">
                      <Info className="w-3.5 h-3.5" />
                      <span>CONSIDERAZIONI SISTEMICHE</span>
                    </div>
                    <span className="font-body text-[10px] text-black/60 font-semibold">
                      DOC. {totalAnalyzed} / {visualItems.length}
                    </span>
                  </div>

                  <h3 className="font-display text-sm sm:text-base font-black text-black tracking-tight uppercase mb-1">
                    {activeCategory.label}
                  </h3>
                  <p className="font-body text-[10px] text-black/65 mb-3 leading-tight">
                    {activeCategory.subtitle}
                  </p>

                  <div className="w-full mb-3">
                    <div className="flex justify-between font-display text-[9px] font-bold text-black mb-1">
                      <span>{leftGroup.label} ({leftPercent}%)</span>
                      <span>{rightGroup.label} ({rightPercent}%)</span>
                    </div>
                    <div className="w-full h-2.5 bg-[#EAEAE5] flex overflow-hidden border border-black">
                      <div
                        style={{ width: `${leftPercent}%` }}
                        className="h-full bg-black transition-all duration-500"
                      />
                      <div
                        style={{ width: `${rightPercent}%` }}
                        className="h-full bg-black/40 transition-all duration-500"
                      />
                    </div>
                  </div>

                  <div className="font-body text-[10.5px] text-black leading-relaxed text-justify hyphens-auto opacity-95 pt-2 border-t border-black/10 whitespace-pre-line">
                    {activeCategory.considerations}
                  </div>

                  <div className="mt-4 pt-2 border-t border-black/15 flex items-center justify-between font-body text-[8.5px] text-black/60 uppercase tracking-wider">
                    <span>POLO A: {leftGroup.items.length}</span>
                    <span className="w-1 h-1 bg-black/40" />
                    <span>POLO B: {rightGroup.items.length}</span>
                    <span className="w-1 h-1 bg-black/40" />
                    <span>{visualItems.length} CASI VISIVI</span>
                  </div>
                </motion.div>

                {/* RIGHT SECTION: CIRCULAR CONSTELLATION POLO B */}
                <div className="relative flex-1 flex items-center justify-center min-w-[280px]">
                  {renderOrbitGroup(rightGroup, false)}
                </div>
              </>
            );
          })()}
        </div>

        {/* Live Hover Tooltip for any orbiting miniature */}
        <AnimatePresence>
          {hoveredItem && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-5 left-1/2 -translate-x-1/2 z-40 bg-white border-2 border-black shadow-2xl p-3 flex items-center gap-3.5 max-w-lg pointer-events-none select-none rounded-none"
            >
              {hoveredItem.imageUrl && (
                <div className="w-11 h-11 border border-black/20 overflow-hidden flex-shrink-0 bg-white">
                  <img
                    src={hoveredItem.thumbnailUrl || hoveredItem.imageUrl}
                    alt=""
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-display text-[10px] font-bold text-black">
                    SEG-{hoveredItem.number}
                  </span>
                  <span className="font-body text-[8.5px] text-black/60 uppercase">
                    [{hoveredItem.tipoDiMedia}]
                  </span>
                </div>
                <div className="font-display text-xs font-bold text-black truncate leading-tight mt-0.5">
                  {hoveredItem.title}
                </div>
                <div className="font-body text-[10px] text-black/60 truncate">
                  {hoveredItem.authorOrSubject} ({hoveredItem.year}) · Segno: {hoveredItem.segno}
                </div>
              </div>
              <div className="flex items-center gap-1 font-display text-[9px] text-black font-bold uppercase pl-2 border-l border-black/20">
                <ZoomIn className="w-3.5 h-3.5" />
                <span>APRI</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. BOTTOM FOOTER HINT */}
      <div className="w-full z-20 px-6 py-2 border-t border-black/15 bg-[#F8F8F6]/95 flex items-center justify-between font-body text-[10px] text-black/60">
        <span>
          SCORRI IN GIÙ PER TORNARE A{" "}
          <button
            type="button"
            onClick={onBackToMacro}
            className="text-black font-display font-bold underline cursor-pointer hover:opacity-75"
          >
            MACRO
          </button>
        </span>
        <span className="hidden sm:inline">
          {visualItems.length} CASI STUDIO VISIVI • 2 POLI DIALETTICI • 6 DIMENSIONI SOCIOLOGICHE
        </span>
      </div>
    </div>
  );
}
