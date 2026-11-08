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
    label: "COPERTO / SCOPERTO",
    excelHeader: "Coperto / Scoperto",
    subtitle: "Visibilità corporea: occultamento vs esposizione del segno",
    considerations:
      "La dicotomia Coperto / Scoperto definisce la misura in cui un segno cutaneo può essere preservato nello spazio intimo o esposto necessariamente allo sguardo sociale. Nei casi archiviati, la maggior parte tratta di segni situati in aree ordinariamente coperte (tronco, addome, cosce, seno), consentendo all'individuo di esercitare un controllo biografico sulla propria storia. Al contrario, quando il segno risiede in aree scoperte (viso, mani, collo), esso si impone immediatamente allo sguardo altrui, sfuggendo al controllo del soggetto e determinando un impatto relazionale immediato.",
    groups: [
      {
        value: "Coperto",
        aliases: ["Mascherabile"],
        label: "COPERTO",
        subLabel: "Occultabile con abiti ordinari o collocato in aree intime",
      },
      {
        value: "Scoperto",
        aliases: ["Non mascherabile"],
        label: "SCOPERTO",
        subLabel: "Costantemente manifesto ed esposto su viso, collo o mani",
      },
    ],
  },
  {
    id: "accettabilitaSociale",
    label: "EROICIZZAZIONE",
    excelHeader: "Eroicizzazione",
    subtitle: "Discorso pubblico: narrazione eroica vs mancato riscatto e stigma",
    considerations:
      "La categoria dell'Eroicizzazione esamina la trasfigurazione del segno da ferita a trofeo sociale. Una porzione dei casi studio viene accolta mediaticamente attraverso la retorica del 'corpo combattente', della rinascita o della maternità eroicizzata (smagliature come 'fiumi d'oro', cicatrici di mastectomia come stemmi di vittoria). La maggior parte dei casi archiviati, tuttavia, rimane non eroicizzata: segni di traumi crudi, ustioni o violenze che rifiutano o non trovano spazio nella spettacolarizzazione positiva del dolore, permanendo in una condizione di attrito e marginalità visiva.",
    groups: [
      {
        value: "Eroicizzato",
        aliases: ["Socialmente accettato"],
        label: "EROICIZZATO",
        subLabel: "Segni normalizzati, celebrati mediaticamente o sublimati come trofei",
      },
      {
        value: "Non eroicizzato",
        aliases: ["Socialmente non accettato"],
        label: "NON EROICIZZATO",
        subLabel: "Segni non riscattati dal discorso pubblico: tabù, violenza o trauma crudo",
      },
    ],
  },
  {
    id: "percezioneSociale",
    label: "SOTTRAZIONE",
    excelHeader: "Sottrazione",
    subtitle: "Dinamica corporea: asportazione/perdita somatica vs alterità",
    considerations:
      "La Sottrazione indaga la cicatrice come indice di una materia corporea o di una condizione somatica sottratta: asportazioni chirurgiche, distruzioni cutanee da ustione, ablazioni e vuoti lasciati dalla patologia. Di fronte alla sottrazione, la reazione collettiva oscilla tra la risposta assistenziale/compassionevole per la perdita subita e il disorientamento. Quando il segno si manifesta come rottura violenta dell'ordine visivo, esso si trasforma in alterità radicale che scuote i canoni normativi della comunità.",
    groups: [
      {
        value: "Sottrazione",
        aliases: ["Visto in modo compassionevole"],
        label: "SOTTRAZIONE",
        subLabel: "Perdita di integrità, asportazione o cesura somatica",
      },
      {
        value: "Alterità",
        aliases: ["Non sottrazione", "Visto come minaccia"],
        label: "ALTERITÀ / ROTTURA",
        subLabel: "Presenza visiva allarmante che infrange l'ordine e suscita diffidenza",
      },
    ],
  },
  {
    id: "percezioneEstetica",
    label: "CONFIGURAZIONE",
    excelHeader: "Configurazione",
    subtitle: "Morfologia visiva: risignificazione scultorea vs deconfigurazione",
    considerations:
      "La Configurazione analizza la qualità morfologica e la presenza formale del segno sulla cute. L'egemonia del canone della levigatezza tende a catalogare ogni cicatrice o rilievo anomalo come deconfigurazione della superficie ideale. Tuttavia, nei progetti fotografici e artistici archiviati, una selezione rilevante di segni viene riconfigurata: la pelle cessa di essere 'difettosa' per farsi territorio plastico, topografia scultorea dotata di straordinaria densità visiva e bellezza non convenzionale.",
    groups: [
      {
        value: "Deconfigurazione",
        aliases: ["Visto come respingente"],
        label: "DECONFIGURAZIONE",
        subLabel: "Alterazione della norma levigata, avvallamento o discromia imperfetta",
      },
      {
        value: "Riconfigurazione",
        aliases: ["Visto come attraente"],
        label: "RICONFIGURAZIONE",
        subLabel: "Fascino scultoreo, unicità topografica e risignificazione plastica",
      },
    ],
  },
  {
    id: "valenzaDelRicordo",
    label: "TRACCIATO",
    excelHeader: "Tracciato",
    subtitle: "Memoria incisa: tracciato generativo vs tracciato traumatico",
    considerations:
      "Il Tracciato concepisce l'epidermide come piano di registrazione materiale e memoria viva del tempo. I tracciati generativi segnano eventi di transizione e crescita vitale (la maternità, il cambiamento corporeo scelto, la guarigione metabolizzata), dove il segno cutaneo è mappa del proprio divenire. I tracciati traumatici, al contrario, conservano indelebile la violenza dell'impatto originario: l'incidente, la mutilazione, la terapia forzata o il conflitto, condensando il trauma in un punto fisico non cancellabile.",
    groups: [
      {
        value: "Tracciato generativo",
        aliases: ["legato a un ricordo positivo"],
        label: "TRACCIATO GENERATIVO",
        subLabel: "Memoria di trasformazione vitale: nascita, rinascita e metamorfosi",
      },
      {
        value: "Tracciato traumatico",
        aliases: ["legato a un ricordo negativo"],
        label: "TRACCIATO TRAUMATICO",
        subLabel: "Memoria di impatto doloroso: incidente, malattia, violenza o perdita",
      },
    ],
  },
  {
    id: "sensoDiVergogna",
    label: "ATTRITO",
    excelHeader: "Attrito",
    subtitle: "Relazione col mondo: attrito sociale vs riconciliazione e agency",
    considerations:
      "L'Attrito misura il grado di conflitto fenomenologico e psicologico nell'esposizione del segno verso il mondo esterno. Nei casi connotati da attrito, il soggetto prova vergogna, imbarazzo e l'istinto all'isolamento o all'occultamento forzato sotto il peso dello sguardo altrui. Nei casi senza attrito, l'individuo trasforma la cicatrice in atto di presenza e piena agency: la vulnerabilità viene rivendicata apertamente, annullando la frizione sociale in favore della fierezza identitaria.",
    groups: [
      {
        value: "Con attrito",
        aliases: ["ne provo vergogna"],
        label: "CON ATTRITO",
        subLabel: "Tensione con lo sguardo sociale, pudore, disagio o autocensura",
      },
      {
        value: "Senza attrito",
        aliases: ["non ne provo vergogna"],
        label: "SENZA ATTRITO",
        subLabel: "Riconciliazione, piena agency corporea e assenza di conflitto",
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
      <div className="w-full z-20 px-4 sm:px-8 pr-28 sm:pr-36 pt-3.5 pb-2.5 border-b border-black/15 bg-[#F8F8F6]/95 backdrop-blur-sm">
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
      <div className="relative flex-1 w-full h-full overflow-hidden flex items-center justify-center p-3 sm:p-6 pr-16 sm:pr-24">
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

                  <div className="font-body text-[10.5px] text-black leading-relaxed text-justify opacity-95 pt-2 border-t border-black/10 whitespace-pre-line">
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
          SCORRI IN GIÙ O TRASCINA LA LINEA DESTRA PER TORNARE A{" "}
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
