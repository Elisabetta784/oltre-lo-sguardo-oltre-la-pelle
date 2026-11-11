import { ArchiveItem } from "./archiveData";

export type OltreCategoryKey = "origine" | "intenzione" | "sguardo" | "scala" | "cromia";

export interface OltreCategoryConfig {
  id: OltreCategoryKey;
  num: string;
  label: string;
  subcategories: string[];
}

export const OLTRE_CATEGORIES: OltreCategoryConfig[] = [
  {
    id: "origine",
    num: "01",
    label: "ORIGINE",
    subcategories: ["Fisiologico", "Medico", "Violenza subita"],
  },
  {
    id: "intenzione",
    num: "02",
    label: "INTENZIONE",
    subcategories: ["Valorizzazione", "Testimonianza", "Denuncia", "Memoria"],
  },
  {
    id: "sguardo",
    num: "03",
    label: "SGUARDO",
    subcategories: ["In camera", "Volto non inquadrato", "Distolto o chiuso", "Nessun soggetto in posa"],
  },
  {
    id: "scala",
    num: "04",
    label: "SCALA",
    subcategories: ["Dettaglio o macro", "Volto o busto", "Figura intera", "Ambiente o scena"],
  },
  {
    id: "cromia",
    num: "05",
    label: "CROMIA",
    subcategories: ["bianco e nero", "colore", "misto"],
  },
];

export interface CaseOltreClassification {
  origine: "Fisiologico" | "Medico" | "Violenza subita";
  intenzione: "Valorizzazione" | "Testimonianza" | "Denuncia" | "Memoria";
  sguardo: "In camera" | "Volto non inquadrato" | "Distolto o chiuso" | "Nessun soggetto in posa";
  scala: "Dettaglio o macro" | "Volto o busto" | "Figura intera" | "Ambiente o scena";
  cromia: "bianco e nero" | "colore" | "misto";
}

export const OLTRE_CLASSIFICATIONS: Record<string, CaseOltreClassification> = {
  "caso-001": {
    "origine": "Fisiologico",
    "intenzione": "Valorizzazione",
    "sguardo": "Nessun soggetto in posa",
    "scala": "Dettaglio o macro",
    "cromia": "bianco e nero"
  },
  "caso-070": {
    "origine": "Violenza subita",
    "intenzione": "Denuncia",
    "sguardo": "In camera",
    "scala": "Volto o busto",
    "cromia": "colore"
  },
  "caso-002": {
    "origine": "Fisiologico",
    "intenzione": "Valorizzazione",
    "sguardo": "In camera",
    "scala": "Figura intera",
    "cromia": "colore"
  },
  "caso-003": {
    "origine": "Fisiologico",
    "intenzione": "Valorizzazione",
    "sguardo": "Volto non inquadrato",
    "scala": "Dettaglio o macro",
    "cromia": "colore"
  },
  "caso-004": {
    "origine": "Fisiologico",
    "intenzione": "Testimonianza",
    "sguardo": "Volto non inquadrato",
    "scala": "Volto o busto",
    "cromia": "bianco e nero"
  },
  "caso-005": {
    "origine": "Fisiologico",
    "intenzione": "Valorizzazione",
    "sguardo": "In camera",
    "scala": "Dettaglio o macro",
    "cromia": "colore"
  },
  "caso-006": {
    "origine": "Fisiologico",
    "intenzione": "Testimonianza",
    "sguardo": "Volto non inquadrato",
    "scala": "Volto o busto",
    "cromia": "colore"
  },
  "caso-007": {
    "origine": "Fisiologico",
    "intenzione": "Testimonianza",
    "sguardo": "Nessun soggetto in posa",
    "scala": "Volto o busto",
    "cromia": "colore"
  },
  "caso-008": {
    "origine": "Fisiologico",
    "intenzione": "Valorizzazione",
    "sguardo": "In camera",
    "scala": "Dettaglio o macro",
    "cromia": "bianco e nero"
  },
  "caso-009": {
    "origine": "Fisiologico",
    "intenzione": "Valorizzazione",
    "sguardo": "In camera",
    "scala": "Volto o busto",
    "cromia": "colore"
  },
  "caso-010": {
    "origine": "Fisiologico",
    "intenzione": "Testimonianza",
    "sguardo": "Nessun soggetto in posa",
    "scala": "Figura intera",
    "cromia": "colore"
  },
  "caso-011": {
    "origine": "Fisiologico",
    "intenzione": "Valorizzazione",
    "sguardo": "In camera",
    "scala": "Dettaglio o macro",
    "cromia": "colore"
  },
  "caso-012": {
    "origine": "Fisiologico",
    "intenzione": "Valorizzazione",
    "sguardo": "Nessun soggetto in posa",
    "scala": "Ambiente o scena",
    "cromia": "colore"
  },
  "caso-013": {
    "origine": "Fisiologico",
    "intenzione": "Valorizzazione",
    "sguardo": "In camera",
    "scala": "Dettaglio o macro",
    "cromia": "bianco e nero"
  },
  "caso-014": {
    "origine": "Fisiologico",
    "intenzione": "Testimonianza",
    "sguardo": "In camera",
    "scala": "Volto o busto",
    "cromia": "colore"
  },
  "caso-015": {
    "origine": "Medico",
    "intenzione": "Testimonianza",
    "sguardo": "In camera",
    "scala": "Volto o busto",
    "cromia": "bianco e nero"
  },
  "caso-016": {
    "origine": "Medico",
    "intenzione": "Testimonianza",
    "sguardo": "In camera",
    "scala": "Volto o busto",
    "cromia": "colore"
  },
  "caso-017": {
    "origine": "Medico",
    "intenzione": "Denuncia",
    "sguardo": "Volto non inquadrato",
    "scala": "Volto o busto",
    "cromia": "misto"
  },
  "caso-018": {
    "origine": "Medico",
    "intenzione": "Denuncia",
    "sguardo": "In camera",
    "scala": "Figura intera",
    "cromia": "colore"
  },
  "caso-019": {
    "origine": "Medico",
    "intenzione": "Denuncia",
    "sguardo": "In camera",
    "scala": "Volto o busto",
    "cromia": "bianco e nero"
  },
  "caso-020": {
    "origine": "Medico",
    "intenzione": "Testimonianza",
    "sguardo": "Volto non inquadrato",
    "scala": "Volto o busto",
    "cromia": "colore"
  },
  "caso-021": {
    "origine": "Violenza subita",
    "intenzione": "Denuncia",
    "sguardo": "Volto non inquadrato",
    "scala": "Dettaglio o macro",
    "cromia": "bianco e nero"
  },
  "caso-022": {
    "origine": "Medico",
    "intenzione": "Valorizzazione",
    "sguardo": "In camera",
    "scala": "Volto o busto",
    "cromia": "colore"
  },
  "caso-023": {
    "origine": "Medico",
    "intenzione": "Testimonianza",
    "sguardo": "In camera",
    "scala": "Volto o busto",
    "cromia": "colore"
  },
  "caso-024": {
    "origine": "Fisiologico",
    "intenzione": "Valorizzazione",
    "sguardo": "In camera",
    "scala": "Volto o busto",
    "cromia": "colore"
  },
  "caso-025": {
    "origine": "Medico",
    "intenzione": "Valorizzazione",
    "sguardo": "In camera",
    "scala": "Figura intera",
    "cromia": "colore"
  },
  "caso-026": {
    "origine": "Medico",
    "intenzione": "Denuncia",
    "sguardo": "Volto non inquadrato",
    "scala": "Figura intera",
    "cromia": "colore"
  },
  "caso-027": {
    "origine": "Medico",
    "intenzione": "Valorizzazione",
    "sguardo": "In camera",
    "scala": "Volto o busto",
    "cromia": "misto"
  },
  "caso-028": {
    "origine": "Medico",
    "intenzione": "Testimonianza",
    "sguardo": "In camera",
    "scala": "Dettaglio o macro",
    "cromia": "colore"
  },
  "caso-029": {
    "origine": "Medico",
    "intenzione": "Valorizzazione",
    "sguardo": "Volto non inquadrato",
    "scala": "Volto o busto",
    "cromia": "colore"
  },
  "caso-030": {
    "origine": "Medico",
    "intenzione": "Testimonianza",
    "sguardo": "Nessun soggetto in posa",
    "scala": "Ambiente o scena",
    "cromia": "misto"
  },
  "caso-031": {
    "origine": "Medico",
    "intenzione": "Testimonianza",
    "sguardo": "In camera",
    "scala": "Ambiente o scena",
    "cromia": "colore"
  },
  "caso-032": {
    "origine": "Medico",
    "intenzione": "Valorizzazione",
    "sguardo": "In camera",
    "scala": "Figura intera",
    "cromia": "colore"
  },
  "caso-033": {
    "origine": "Medico",
    "intenzione": "Testimonianza",
    "sguardo": "In camera",
    "scala": "Volto o busto",
    "cromia": "colore"
  },
  "caso-034": {
    "origine": "Violenza subita",
    "intenzione": "Denuncia",
    "sguardo": "Nessun soggetto in posa",
    "scala": "Ambiente o scena",
    "cromia": "colore"
  },
  "caso-035": {
    "origine": "Violenza subita",
    "intenzione": "Denuncia",
    "sguardo": "Nessun soggetto in posa",
    "scala": "Figura intera",
    "cromia": "colore"
  },
  "caso-036": {
    "origine": "Violenza subita",
    "intenzione": "Denuncia",
    "sguardo": "Nessun soggetto in posa",
    "scala": "Figura intera",
    "cromia": "colore"
  },
  "caso-037": {
    "origine": "Violenza subita",
    "intenzione": "Testimonianza",
    "sguardo": "In camera",
    "scala": "Volto o busto",
    "cromia": "colore"
  },
  "caso-038": {
    "origine": "Medico",
    "intenzione": "Denuncia",
    "sguardo": "Nessun soggetto in posa",
    "scala": "Volto o busto",
    "cromia": "bianco e nero"
  },
  "caso-039": {
    "origine": "Medico",
    "intenzione": "Testimonianza",
    "sguardo": "Nessun soggetto in posa",
    "scala": "Figura intera",
    "cromia": "colore"
  },
  "caso-040": {
    "origine": "Violenza subita",
    "intenzione": "Testimonianza",
    "sguardo": "In camera",
    "scala": "Volto o busto",
    "cromia": "colore"
  },
  "caso-041": {
    "origine": "Violenza subita",
    "intenzione": "Denuncia",
    "sguardo": "In camera",
    "scala": "Volto o busto",
    "cromia": "colore"
  },
  "caso-042": {
    "origine": "Violenza subita",
    "intenzione": "Denuncia",
    "sguardo": "Volto non inquadrato",
    "scala": "Volto o busto",
    "cromia": "colore"
  },
  "caso-043": {
    "origine": "Violenza subita",
    "intenzione": "Denuncia",
    "sguardo": "Nessun soggetto in posa",
    "scala": "Volto o busto",
    "cromia": "bianco e nero"
  },
  "caso-044": {
    "origine": "Violenza subita",
    "intenzione": "Denuncia",
    "sguardo": "In camera",
    "scala": "Volto o busto",
    "cromia": "colore"
  },
  "caso-045": {
    "origine": "Violenza subita",
    "intenzione": "Denuncia",
    "sguardo": "Nessun soggetto in posa",
    "scala": "Ambiente o scena",
    "cromia": "colore"
  },
  "caso-046": {
    "origine": "Violenza subita",
    "intenzione": "Testimonianza",
    "sguardo": "In camera",
    "scala": "Volto o busto",
    "cromia": "colore"
  },
  "caso-047": {
    "origine": "Violenza subita",
    "intenzione": "Valorizzazione",
    "sguardo": "Volto non inquadrato",
    "scala": "Figura intera",
    "cromia": "colore"
  },
  "caso-048": {
    "origine": "Violenza subita",
    "intenzione": "Valorizzazione",
    "sguardo": "In camera",
    "scala": "Figura intera",
    "cromia": "colore"
  },
  "caso-049": {
    "origine": "Medico",
    "intenzione": "Memoria",
    "sguardo": "Nessun soggetto in posa",
    "scala": "Volto o busto",
    "cromia": "colore"
  },
  "caso-050": {
    "origine": "Medico",
    "intenzione": "Testimonianza",
    "sguardo": "In camera",
    "scala": "Volto o busto",
    "cromia": "bianco e nero"
  },
  "caso-051": {
    "origine": "Violenza subita",
    "intenzione": "Memoria",
    "sguardo": "Nessun soggetto in posa",
    "scala": "Ambiente o scena",
    "cromia": "misto"
  },
  "caso-052": {
    "origine": "Medico",
    "intenzione": "Testimonianza",
    "sguardo": "In camera",
    "scala": "Volto o busto",
    "cromia": "colore"
  },
  "caso-053": {
    "origine": "Medico",
    "intenzione": "Denuncia",
    "sguardo": "In camera",
    "scala": "Volto o busto",
    "cromia": "colore"
  },
  "caso-054": {
    "origine": "Violenza subita",
    "intenzione": "Memoria",
    "sguardo": "Nessun soggetto in posa",
    "scala": "Volto o busto",
    "cromia": "bianco e nero"
  },
  "caso-055": {
    "origine": "Violenza subita",
    "intenzione": "Memoria",
    "sguardo": "Volto non inquadrato",
    "scala": "Volto o busto",
    "cromia": "bianco e nero"
  },
  "caso-056": {
    "origine": "Violenza subita",
    "intenzione": "Denuncia",
    "sguardo": "Nessun soggetto in posa",
    "scala": "Ambiente o scena",
    "cromia": "colore"
  },
  "caso-057": {
    "origine": "Violenza subita",
    "intenzione": "Testimonianza",
    "sguardo": "Volto non inquadrato",
    "scala": "Ambiente o scena",
    "cromia": "colore"
  },
  "caso-058": {
    "origine": "Violenza subita",
    "intenzione": "Denuncia",
    "sguardo": "Volto non inquadrato",
    "scala": "Ambiente o scena",
    "cromia": "colore"
  },
  "caso-059": {
    "origine": "Medico",
    "intenzione": "Testimonianza",
    "sguardo": "Volto non inquadrato",
    "scala": "Ambiente o scena",
    "cromia": "colore"
  },
  "caso-060": {
    "origine": "Violenza subita",
    "intenzione": "Testimonianza",
    "sguardo": "Nessun soggetto in posa",
    "scala": "Ambiente o scena",
    "cromia": "colore"
  },
  "caso-061": {
    "origine": "Medico",
    "intenzione": "Denuncia",
    "sguardo": "Nessun soggetto in posa",
    "scala": "Ambiente o scena",
    "cromia": "misto"
  },
  "caso-062": {
    "origine": "Violenza subita",
    "intenzione": "Denuncia",
    "sguardo": "Nessun soggetto in posa",
    "scala": "Volto o busto",
    "cromia": "colore"
  },
  "caso-063": {
    "origine": "Violenza subita",
    "intenzione": "Memoria",
    "sguardo": "Nessun soggetto in posa",
    "scala": "Ambiente o scena",
    "cromia": "misto"
  },
  "caso-064": {
    "origine": "Violenza subita",
    "intenzione": "Memoria",
    "sguardo": "Volto non inquadrato",
    "scala": "Volto o busto",
    "cromia": "bianco e nero"
  },
  "caso-065": {
    "origine": "Violenza subita",
    "intenzione": "Memoria",
    "sguardo": "In camera",
    "scala": "Figura intera",
    "cromia": "misto"
  },
  "caso-066": {
    "origine": "Violenza subita",
    "intenzione": "Denuncia",
    "sguardo": "In camera",
    "scala": "Figura intera",
    "cromia": "bianco e nero"
  },
  "caso-067": {
    "origine": "Violenza subita",
    "intenzione": "Memoria",
    "sguardo": "Volto non inquadrato",
    "scala": "Volto o busto",
    "cromia": "colore"
  },
  "caso-068": {
    "origine": "Medico",
    "intenzione": "Denuncia",
    "sguardo": "Nessun soggetto in posa",
    "scala": "Volto o busto",
    "cromia": "colore"
  },
  "caso-069": {
    "origine": "Violenza subita",
    "intenzione": "Denuncia",
    "sguardo": "Nessun soggetto in posa",
    "scala": "Ambiente o scena",
    "cromia": "colore"
  },
  "caso-071": {
    "origine": "Violenza subita",
    "intenzione": "Memoria",
    "sguardo": "Volto non inquadrato",
    "scala": "Volto o busto",
    "cromia": "colore"
  },
  "caso-171": {
    "origine": "Violenza subita",
    "intenzione": "Denuncia",
    "sguardo": "In camera",
    "scala": "Volto o busto",
    "cromia": "colore"
  },
  "caso-159": {
    "origine": "Medico",
    "intenzione": "Testimonianza",
    "sguardo": "In camera",
    "scala": "Volto o busto",
    "cromia": "colore"
  },
  "caso-168": {
    "origine": "Fisiologico",
    "intenzione": "Denuncia",
    "sguardo": "In camera",
    "scala": "Volto o busto",
    "cromia": "colore"
  },
  "caso-169": {
    "origine": "Violenza subita",
    "intenzione": "Testimonianza",
    "sguardo": "Volto non inquadrato",
    "scala": "Volto o busto",
    "cromia": "colore"
  },
  "caso-172": {
    "origine": "Violenza subita",
    "intenzione": "Valorizzazione",
    "sguardo": "In camera",
    "scala": "Volto o busto",
    "cromia": "colore"
  }
};

export function getOltreClassification(caseId: string): CaseOltreClassification {
  return OLTRE_CLASSIFICATIONS[caseId] || {
    origine: "Fisiologico",
    intenzione: "Testimonianza",
    sguardo: "In camera",
    scala: "Volto o busto",
    cromia: "colore",
  };
}

export function getItemsByOltreSubcategory(
  items: ArchiveItem[],
  category: OltreCategoryKey,
  subcategory: string
): ArchiveItem[] {
  return items.filter((item) => {
    const classification = OLTRE_CLASSIFICATIONS[item.id];
    if (!classification) return false;
    return classification[category].toLowerCase() === subcategory.toLowerCase();
  });
}
