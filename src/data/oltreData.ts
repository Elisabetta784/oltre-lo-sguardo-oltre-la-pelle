import { ArchiveItem } from "./archiveData";

export type OltreCategoryKey =
  | "eroicizzazione"
  | "denuncia"
  | "testimonianza"
  | "normalizzazione";

export interface OltreCategoryConfig {
  id: OltreCategoryKey;
  num: string;
  label: string;
  tabLabel: string;
  tagline: string;
  description: string;
}

export const OLTRE_CATEGORIES: OltreCategoryConfig[] = [
  {
    id: "eroicizzazione",
    num: "01",
    label: "EROICO",
    tabLabel: "Eroico",
    tagline: "Celebrazione, fierezza & riscatto",
    description:
      "La cicatrice come segno di forza, sopravvivenza e riscatto.",
  },
  {
    id: "denuncia",
    num: "02",
    label: "DENUNCIA",
    tabLabel: "Denuncia",
    tagline: "Rivendicazione, accusa & giustizia sociale",
    description:
      "Il corpo segnato denuncia violenze e ingiustizie sociali.",
  },
  {
    id: "testimonianza",
    num: "03",
    label: "POLITICO",
    tabLabel: "Politico",
    tagline: "Memoria storica, archivio & documento",
    description:
      "La cicatrice custodisce la memoria e diventa voce collettiva.",
  },
  {
    id: "normalizzazione",
    num: "04",
    label: "NORMALIZZATO",
    tabLabel: "Normalizzato",
    tagline: "De-stigmatizzazione & pelle reale",
    description:
      "La pelle reale diventa espressione, presenza e quotidianità.",
  },
];

export const OLTRE_CLASSIFICATIONS: Record<string, OltreCategoryKey> = {
  // 01 EROICIZZAZIONE (14 casi)
  "caso-015": "eroicizzazione",
  "caso-017": "eroicizzazione",
  "caso-018": "eroicizzazione",
  "caso-025": "eroicizzazione",
  "caso-026": "eroicizzazione",
  "caso-031": "eroicizzazione",
  "caso-037": "eroicizzazione",
  "caso-040": "eroicizzazione",
  "caso-043": "eroicizzazione",
  "caso-045": "eroicizzazione",
  "caso-047": "eroicizzazione",
  "caso-048": "eroicizzazione",
  "caso-050": "eroicizzazione",
  "caso-169": "eroicizzazione",

  // 02 DENUNCIA POLITICA (21 casi)
  "caso-034": "denuncia",
  "caso-035": "denuncia",
  "caso-036": "denuncia",
  "caso-038": "denuncia",
  "caso-041": "denuncia",
  "caso-042": "denuncia",
  "caso-044": "denuncia",
  "caso-053": "denuncia",
  "caso-056": "denuncia",
  "caso-057": "denuncia",
  "caso-058": "denuncia",
  "caso-059": "denuncia",
  "caso-060": "denuncia",
  "caso-062": "denuncia",
  "caso-066": "denuncia",
  "caso-067": "denuncia",
  "caso-068": "denuncia",
  "caso-069": "denuncia",
  "caso-070": "denuncia",
  "caso-168": "denuncia",
  "caso-171": "denuncia",

  // 03 TESTIMONIANZA & ARCHIVIO (14 casi)
  "caso-016": "testimonianza",
  "caso-021": "testimonianza",
  "caso-030": "testimonianza",
  "caso-033": "testimonianza",
  "caso-039": "testimonianza",
  "caso-046": "testimonianza",
  "caso-049": "testimonianza",
  "caso-054": "testimonianza",
  "caso-055": "testimonianza",
  "caso-063": "testimonianza",
  "caso-064": "testimonianza",
  "caso-065": "testimonianza",
  "caso-071": "testimonianza",
  "caso-172": "testimonianza",

  // 04 NORMALIZZAZIONE (17 casi)
  "caso-001": "normalizzazione",
  "caso-002": "normalizzazione",
  "caso-003": "normalizzazione",
  "caso-004": "normalizzazione",
  "caso-005": "normalizzazione",
  "caso-006": "normalizzazione",
  "caso-007": "normalizzazione",
  "caso-008": "normalizzazione",
  "caso-010": "normalizzazione",
  "caso-011": "normalizzazione",
  "caso-012": "normalizzazione",
  "caso-020": "normalizzazione",
  "caso-023": "normalizzazione",
  "caso-024": "normalizzazione",
  "caso-029": "normalizzazione",
  "caso-032": "normalizzazione",
  "caso-159": "normalizzazione",

  // Risignificazione estetica, inclusa nella narrazione Normalizzato (10 casi)
  "caso-009": "normalizzazione",
  "caso-013": "normalizzazione",
  "caso-014": "normalizzazione",
  "caso-019": "normalizzazione",
  "caso-022": "normalizzazione",
  "caso-027": "normalizzazione",
  "caso-028": "normalizzazione",
  "caso-051": "normalizzazione",
  "caso-052": "normalizzazione",
  "caso-061": "normalizzazione",
};

export function getOltreCategoryForCase(caseId: string): OltreCategoryKey {
  return OLTRE_CLASSIFICATIONS[caseId] || "eroicizzazione";
}

export function getItemsByOltreCategory(
  items: ArchiveItem[],
  category: OltreCategoryKey
): ArchiveItem[] {
  return items.filter((item) => {
    const cat = OLTRE_CLASSIFICATIONS[item.id];
    return cat === category;
  });
}
