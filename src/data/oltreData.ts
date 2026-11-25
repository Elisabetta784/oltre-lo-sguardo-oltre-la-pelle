import { ArchiveItem } from "./archiveData";

export type OltreCategoryKey =
  | "eroicizzazione"
  | "denuncia"
  | "testimonianza"
  | "normalizzazione"
  | "risignificazione";

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
    label: "EROICIZZAZIONE",
    tabLabel: "Eroicizzazione",
    tagline: "Celebrazione, fierezza & riscatto",
    description:
      "La cicatrice come trofeo di sopravvivenza, forza e riscatto. Il corpo esibisce il segno con fierezza celebrativa, trasformando la vulnerabilità in monumento di resilienza.",
  },
  {
    id: "denuncia",
    num: "02",
    label: "DENUNCIA POLITICA",
    tabLabel: "Denuncia",
    tagline: "Rivendicazione, accusa & giustizia sociale",
    description:
      "La ferita come atto d'accusa contro violenze sistemiche, abusi patriarcali o conflitti armati. Il corpo segnato si fa manifesto politico e prova tangibile di ingiustizia sociale.",
  },
  {
    id: "testimonianza",
    num: "03",
    label: "TESTIMONIANZA & ARCHIVIO",
    tabLabel: "Testimonianza",
    tagline: "Memoria storica, archivio & documento",
    description:
      "Il corpo come documento storico e archivio vivente. La cicatrice si fa traccia testimoniale indelebile per custodire la memoria collettiva e resistere all'oblio del tempo.",
  },
  {
    id: "normalizzazione",
    num: "04",
    label: "NORMALIZZAZIONE",
    tabLabel: "Normalizzazione",
    tagline: "De-stigmatizzazione & pelle reale",
    description:
      "La cicatrice restituita alla sua ordinaria umanità e quotidianità. Rifiuto dei canoni omologati e della retorica epica, a favore della de-stigmatizzazione della pelle reale.",
  },
  {
    id: "risignificazione",
    num: "05",
    label: "RISIGNIFICAZIONE ESTETICA",
    tabLabel: "Risignificazione",
    tagline: "Kintsugi, sublimazione poetica & trasfigurazione",
    description:
      "La ferita risemantizzata attraverso il gesto artistico, l'ornamento e la poetica del kintsugi. La cicatrice non viene celata, ma sublimata in nuovo linguaggio visivo.",
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

  // 05 RISIGNIFICAZIONE ESTETICA (10 casi)
  "caso-009": "risignificazione",
  "caso-013": "risignificazione",
  "caso-014": "risignificazione",
  "caso-019": "risignificazione",
  "caso-022": "risignificazione",
  "caso-027": "risignificazione",
  "caso-028": "risignificazione",
  "caso-051": "risignificazione",
  "caso-052": "risignificazione",
  "caso-061": "risignificazione",
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
