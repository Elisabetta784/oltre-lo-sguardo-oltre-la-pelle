export interface ArchiveItem {
  id: string;
  number: string;
  title: string;
  authorOrSubject: string;
  year: string;
  type: "photo" | "audio" | "text";
  segno: string;
  segnoTags: string[];
  tipologia: string;
  tono: string;
  tipoDiMedia: string;
  categorie: string;
  clusterTags: string[];
  stileVisivo: string;
  sintesiConcettuale: string;
  notes: string;
  externalLink: string;
  driveLink: string;
  mascherabilita: string;
  accettabilitaSociale: string;
  percezioneSociale: string;
  percezioneEstetica: string;
  valenzaDelRicordo: string;
  sensoDiVergogna: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  galleryUrls?: string[];
  excerpt?: string;
  caption?: string;
  microKeyword?: string;
  audioDuration?: string;
  audioWaveform?: number[];
  audioTranscript?: string;
  isIllustrativeImage?: boolean;
  imageDisclaimer?: string;
  ambitoTeorico?: string;
}

export const FILTER_CATEGORIES = {
  segno: {
    label: "SEGNO",
    options: [
      "Smagliatura",
      "Parto",
      "Acne",
      "Rosacea",
      "Eczema",
      "Cicatrici chirurgiche",
      "Cicatrici da incidenti",
      "Cicatrici da mastectomia",
      "Ustione da fuoco",
      "Ustione da acido",
      "Tracce oncologiche",
      "Chemioterapia",
      "Tatuaggio imposto",
      "Marchio a fuoco",
      "Condizioni cutanee",
      "Traccia teorica",
    ],
  },
  tipologia: {
    label: "TIPOLOGIA",
    options: [
      "Serie Fotografica",
      "Pubblicazione Editoriale",
      "Mostra / Installazione",
      "Archivio / Ricerca",
      "Testimonianza personale",
      "Fotografia d'autore",
      "Performance",
      "Campagna",
      "Inchiesta giornalistica",
    ],
  },
  tono: {
    label: "TONO",
    options: [
      "Intimo / Confessionale",
      "Politico / Rivendicativo",
      "Poetico / Evocativo",
      "Normalizzazione",
      "Clinico / Scientifico",
      "Viscerale / Radicale",
    ],
  },
  tipoDiMedia: {
    label: "TIPO DI MEDIA",
    options: [
      "Fotografia",
      "Video",
      "Pittura",
      "Scultura",
      "Artefatto tessile",
      "Testo / Saggio",
      "Testimonianza scritta",
    ],
  },
  categorie: {
    label: "CATEGORIA",
    options: [
      "Traumi",
      "Trasformazione",
      "Medici",
      "Sistemici",
    ],
  },
} as const;

export type FilterCategoryId = keyof typeof FILTER_CATEGORIES;


export interface AmbitoTeoricoDef {
  id: string;
  name: string;
  shortLabel: string;
  desc: string;
  count: number;
  caseNumbers: string[];
}

export const AMBITI_TEORICI: AmbitoTeoricoDef[] = [
  {
    id: "fenomenologia-antropologia",
    name: "Fenomenologia & Antropologia",
    shortLabel: "01. FENOMENOLOGIA & ANTROPOLOGIA",
    desc: "La pelle vissuta dall'interno, sensorialità tattile e involucro dell'Io",
    count: 10,
    caseNumbers: ["072", "073", "074", "075", "076", "077", "078", "081", "083", "084"],
  },
  {
    id: "semiotica-segno",
    name: "Semiotica del segno",
    shortLabel: "02. SEMIOTICA DEL SEGNO",
    desc: "La pelle come testo e indice, deviazione dalla norma e sovranità del senso",
    count: 4,
    caseNumbers: ["085", "086", "087", "088"],
  },
  {
    id: "sociologia-biopolitica",
    name: "Sociologia & Biopolitica",
    shortLabel: "03. SOCIOLOGIA & BIOPOLITICA",
    desc: "Stigma, sguardo dell'Altro, imperativo della levigatezza e mercato estetico",
    count: 6,
    caseNumbers: ["082", "089", "090", "091", "092", "093"],
  },
  {
    id: "trauma-agency",
    name: "Trauma, Tempo & Agency",
    shortLabel: "04. TRAUMA, TEMPO & AGENCY",
    desc: "Rottura biografica, interfaccia temporale e riappropriazione della ferita",
    count: 6,
    caseNumbers: ["079", "080", "094", "095", "096", "097"],
  },
];

export const ARCHIVE_ITEMS: ArchiveItem[] = [
  {
    "id": "caso-001",
    "number": "001",
    "title": "A Beautiful Body Project: The Bodies of Mothers",
    "authorOrSubject": "Jade Beall",
    "year": "2014",
    "type": "photo",
    "segno": "Smagliatura",
    "segnoTags": [
      "Smagliatura",
      "parto"
    ],
    "tipologia": "Serie Fotografica",
    "tono": "Intimo / Confessionale",
    "tipoDiMedia": "Fotografia",
    "categorie": "Trasformazione",
    "clusterTags": [
      "Trasformazione"
    ],
    "stileVisivo": "Rassicurante, sobrio, naturale;  bianco e nero fine art; luce morbida e radente che enfatizza la texture della pelle",
    "sintesiConcettuale": "Beall ha ideato il corpus per contrastare l'ansia da prestazione del \"ritorno in forma\" post-parto. Le fotografie ritraggono le donne in pose piene di serenità, abbracciate ai figli: le smagliature vengono illuminate come linee d'oro o fiumi d'argento, definite dall'autrice e dalle partecipanti come \"le mappe del passaggio dei nostri figli al mondo\", ribaltando la vergogna in celebrazione vitale.",
    "notes": "Conservato nell'archivio.",
    "externalLink": "https://www.organiconcrete.com/2015/10/21/beatiful-body-project-jade-beall-gli-scatti-un-corpo-evoluzione/",
    "driveLink": "A Beautiful Body Project: The Bodies of Mothers",
    "mascherabilita": "Mascherabile",
    "accettabilitaSociale": "Socialmente non accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo positivo",
    "sensoDiVergogna": "non ne provo vergogna",
    "imageUrl": "/archive/case-001.jpg",
    "thumbnailUrl": "/archive/thumbs/case-001.jpg",
    "galleryUrls": [
      "/archive/case-001-1.jpg",
      "/archive/case-001-2.jpg",
      "/archive/case-001-3.jpg"
    ],
    "excerpt": "Beall ha ideato il corpus per contrastare l'ansia da prestazione del \"ritorno in forma\" post-parto. Le fotografie ritraggono le donne in pose piene di serenità, abbracciate ai figl..."
  },
  {
    "id": "caso-070",
    "number": "070",
    "title": "Rain of Fire: Israel's Unlawful Use of White Phosphorus in Gaza",
    "authorOrSubject": "Human Rights Watch",
    "year": "2009",
    "type": "photo",
    "segno": "Ustione da fuoco",
    "segnoTags": [
      "Ustione da fuoco",
      "Ustione da acido"
    ],
    "tipologia": "Pubblicazione Editoriale",
    "tono": "Clinico / Scientifico",
    "tipoDiMedia": "Fotografia",
    "categorie": "Traumi",
    "clusterTags": [
      "Traumi",
      "Sistemici"
    ],
    "stileVisivo": "Fotogiornalismo investigativo; immagini di severe ustioni chimico-termiche su corpi civili.",
    "sintesiConcettuale": "Rapporto investigativo sull'impiego di munizioni al fosforo bianco in aree urbane, che analizza le devastanti ustioni chimiche e termiche provocate alla popolazione.",
    "notes": "Rapporto di 71 pagine redatto da HRW sull'operazione Piombo Fuso (2008-2009), contenente prove fotografiche, testimonianze e perizie mediche balistiche.",
    "externalLink": "https://www.hrw.org/report/2009/03/25/rain-fire/israels-unlawful-use-white-phosphorus-gaza",
    "driveLink": "",
    "mascherabilita": "Non mascherabile",
    "accettabilitaSociale": "Socialmente non accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "ne provo vergogna",
    "imageUrl": "/archive/case-070.jpg",
    "thumbnailUrl": "/archive/thumbs/case-070.jpg",
    "galleryUrls": [],
    "excerpt": "Rapporto investigativo sull'impiego di munizioni al fosforo bianco in aree urbane, che analizza le devastanti ustioni chimiche e termiche provocate alla popolazione.",
    "microKeyword": "REPORT"
  },
  {
    "id": "caso-002",
    "number": "002",
    "title": "Epidermis",
    "authorOrSubject": "Sophie Harris-Taylor",
    "year": "2018",
    "type": "photo",
    "segno": "Acne",
    "segnoTags": [
      "Acne",
      "rosacea",
      "eczema"
    ],
    "tipologia": "Serie Fotografica",
    "tono": "Intimo / Confessionale",
    "tipoDiMedia": "Fotografia",
    "categorie": "Trasformazione",
    "clusterTags": [
      "Trasformazione"
    ],
    "stileVisivo": "Ritrattistica a figura intera e mezzo busto in luce naturale diffusa; estetica da editoriale di bellezza classico senza trucco né ritocco digitale, focalizzata sulla matericità dell'epidermide.",
    "sintesiConcettuale": "Serie fotografica che ritrae venti donne del Regno Unito affette da condizioni dermatologiche visibili (acne, rosacea, eczema). Appropriandosi dei canoni visivi della fotografia di bellezza patinata, l'opera sovverte la ricerca della pelle ideale per celebrare la vulnerabilità e de-stigmatizzare le imperfezioni cutanee.",
    "notes": "Progetto nato dall'esperienza personale dell'autrice con l'acne giovanile, esposto in mostre a Londra (tra cui The Printspace e Francesca Maffeo Gallery) ed esteso alla riflessione sul benessere psicologico e sulla salute mentale.",
    "externalLink": "https://sophieharristaylor.com/Epidermis",
    "driveLink": "https://drive.google.com/drive/folders/1dO0G_ErL8OaaGKXGTU1oXti0xcTpi758?usp=drive_link",
    "mascherabilita": "Mascherabile",
    "accettabilitaSociale": "Socialmente non accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "ne provo vergogna",
    "imageUrl": "/archive/case-002.jpg",
    "thumbnailUrl": "/archive/thumbs/case-002.jpg",
    "galleryUrls": [
      "/archive/case-002-1.jpg",
      "/archive/case-002-2.jpg",
      "/archive/case-002-3.jpg"
    ],
    "excerpt": "Serie fotografica che ritrae venti donne del Regno Unito affette da condizioni dermatologiche visibili (acne, rosacea, eczema). Appropriandosi dei canoni visivi della fotografia di..."
  },
  {
    "id": "caso-003",
    "number": "003",
    "title": "#AerieREAL",
    "authorOrSubject": "Aerie / American Eagle Outfitters",
    "year": "2014",
    "type": "photo",
    "segno": "Smagliatura",
    "segnoTags": [
      "Smagliatura"
    ],
    "tipologia": "Serie Fotografica",
    "tono": "Normalizzazione",
    "tipoDiMedia": "Fotografia",
    "categorie": "Trasformazione",
    "clusterTags": [
      "Trasformazione"
    ],
    "stileVisivo": "Fotografia commerciale e pubblicitaria non ritoccata; estetica solare e spontanea senza fotoritocco né post-produzione digitale, valorizzazione di linee, curve e texture cutanee autentiche.",
    "sintesiConcettuale": "Lanciata nel 2014 dal brand Aerie, la campagna rivoluziona la comunicazione dell'intimo eliminando del tutto l'aerografo e Photoshop. Mostrando modelle e donne reali con smagliature, cellulite e particolarità epidermiche, il progetto promuove la body positivity e ridefinisce gli standard di bellezza commerciale, trasformando la pelle reale in manifesto di autenticità e autodeterminazione.",
    "notes": "Pioniera della body positivity nel retail su scala globale guidata da Jen Foyle, la campagna ha segnato una svolta nell'advertising mainstream dell'intimo femminile, espandendosi con programmi per Role Model e iniziative di empowerment comunitario.",
    "externalLink": "https://www.ae.com/intl/en/content/aerie/aerie-real",
    "driveLink": "https://drive.google.com/drive/folders/17Aj2ZyLIFHcG-g-QFIB8iJlltFNma9eF?usp=drive_link",
    "mascherabilita": "Mascherabile",
    "accettabilitaSociale": "Socialmente non accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo positivo",
    "sensoDiVergogna": "non ne provo vergogna",
    "imageUrl": "/archive/case-003.jpg",
    "thumbnailUrl": "/archive/thumbs/case-003.jpg",
    "galleryUrls": [
      "/archive/case-003-1.jpg",
      "/archive/case-003-2.jpg"
    ],
    "excerpt": "Lanciata nel 2014 dal brand Aerie, la campagna rivoluziona la comunicazione dell'intimo eliminando del tutto l'aerografo e Photoshop. Mostrando modelle e donne reali con smagliatur..."
  },
  {
    "id": "caso-072",
    "number": "072",
    "title": "PELLE COME LIMES",
    "authorOrSubject": "David Le Breton",
    "year": "2016",
    "type": "photo",
    "segno": "Traccia teorica",
    "ambitoTeorico": "Fenomenologia & Antropologia",
    "segnoTags": [
      "Traccia teorica"
    ],
    "tipologia": "Pubblicazione Editoriale",
    "tono": "Poetico / Evocativo",
    "tipoDiMedia": "Testo / Saggio",
    "categorie": "Trasformazione",
    "clusterTags": [
      "Trasformazione",
      "Traumi"
    ],
    "stileVisivo": "Saggio antropologico e teorico; indagine sulla frontiera corporea, la pelle come limite tra Sé e alterità e la cicatrice come soglia.",
    "sintesiConcettuale": "Limes significa frontiera, confine. È la linea di demarcazione tra il noto e l'ignoto, tra il gruppo di appartenenza e l'alterità. Qui si incontrano l'identità corporea e la percezione dell'Altro. Sulla pelle segnata il confine si materializza nella cicatrice, che separa il corpo di prima dal corpo di dopo l'evento.",
    "notes": "Inquadramento antropologico e sociologico di David Le Breton sulla pelle come confine e limes identitario; riflessione sulla cicatrice come materializzazione della transizione.",
    "externalLink": "https://books.google.it/books?hl=it&lr=&id=b9Fmnmj2bpYC&oi=fnd&pg=PP1&dq=segni+della+pelle&ots=11Wiy2eJT2&sig=Rohi0S43ObWXe7KTHfjXlJXpRyI&redir_esc=y#v=onepage&q=segni%20della%20pelle&f=false",
    "driveLink": "",
    "mascherabilita": "—",
    "accettabilitaSociale": "—",
    "percezioneSociale": "—",
    "percezioneEstetica": "—",
    "valenzaDelRicordo": "—",
    "sensoDiVergogna": "—",
    "imageUrl": "/archive/case-072.jpg",
    "thumbnailUrl": "/archive/thumbs/case-072.jpg",
    "galleryUrls": [],
    "excerpt": "Limes significa frontiera, confine. È la linea di demarcazione tra il noto e l'ignoto, tra il gruppo di appartenenza e l'alterità. Qui si incontrano l'identità corporea e la percez...",
    "microKeyword": "LIMES"
  },
  {
    "id": "caso-004",
    "number": "004",
    "title": "Murmurings of the Skin",
    "authorOrSubject": "Olivia Arthur",
    "year": "2024",
    "type": "photo",
    "segno": "parto",
    "segnoTags": [
      "parto"
    ],
    "tipologia": "Pubblicazione Editoriale",
    "tono": "Intimo / Confessionale",
    "tipoDiMedia": "Fotografia",
    "categorie": "Trasformazione",
    "clusterTags": [
      "Trasformazione",
      "Traumi"
    ],
    "stileVisivo": "Ritrattistica intimista in grande formato, bianco e nero delicato; alternanza lirica tra corpi umani, gesti di contatto e tecnologie bioniche.",
    "sintesiConcettuale": "Nato dall'esperienza della prima gravidanza dell'autrice e dal mutamento percettivo del proprio corpo vissuto come macchina generatrice, indagine fotografica sul confine tra corpo umano e tecnologia. Accostando ritratti intimi, protesi bioniche e robot umanoidi, il progetto si interroga sulla fragilità fisica, sul nostro bisogno di contatto e sull'essenza stessa dell'essere umani.",
    "notes": "Photobook pubblicato da Void in collaborazione con Magnum Photos. Esplora il confine tra corporeità e innesti artificiali sviluppato lungo otto anni di ricerca.",
    "externalLink": "https://www.magnumphotos.com/arts-culture/murmurings-of-the-skin/",
    "driveLink": "https://drive.google.com/drive/folders/12D1bYAcRCnj7J0hgAkmBfUBfK09jv9Ed?usp=drive_link",
    "mascherabilita": "Mascherabile",
    "accettabilitaSociale": "Socialmente non accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo positivo",
    "sensoDiVergogna": "non ne provo vergogna",
    "imageUrl": "/archive/case-004.jpg",
    "thumbnailUrl": "/archive/thumbs/case-004.jpg",
    "galleryUrls": [
      "/archive/case-004-1.jpg",
      "/archive/case-004-2.jpg",
      "/archive/case-004-3.jpg"
    ],
    "excerpt": "Nato dall'esperienza della prima gravidanza dell'autrice e dal mutamento percettivo del proprio corpo vissuto come macchina generatrice, indagine fotografica sul confine tra corpo ..."
  },
  {
    "id": "caso-005",
    "number": "005",
    "title": "Acne Normalization",
    "authorOrSubject": "Peter DeVito",
    "year": "2018",
    "type": "photo",
    "segno": "Acne",
    "segnoTags": [
      "Acne"
    ],
    "tipologia": "Serie Fotografica",
    "tono": "Normalizzazione",
    "tipoDiMedia": "Fotografia",
    "categorie": "Trasformazione",
    "clusterTags": [
      "Trasformazione"
    ],
    "stileVisivo": "Primi piani e macro ritratti non ritoccati con lettere adesive o tatuaggi temporanei applicati direttamente sull'epidermide.",
    "sintesiConcettuale": "Serie di ritratti a figura ravvicinata; le imperfezioni cutanee e le infiammazioni acneiche vengono esposte apertamente e accompagnate da scritte di rivendicazione per promuovere l'accettazione di sé.",
    "notes": "Nato durante gli studi al FIT di New York dall'esperienza diretta dell'autore, il progetto ha riscosso eco globale sui social media ed è stato rilanciato da celebrità come Cara Delevingne.",
    "externalLink": "https://www.artshelp.com/photographer-peter-devito-beauty-standards/",
    "driveLink": "https://drive.google.com/drive/folders/1xkuPBKjAnZDYfRAdUnZgD6pn32JWhnrA?usp=drive_link",
    "mascherabilita": "Mascherabile",
    "accettabilitaSociale": "Socialmente non accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "ne provo vergogna",
    "imageUrl": "/archive/case-005.jpg",
    "thumbnailUrl": "/archive/thumbs/case-005.jpg",
    "galleryUrls": [
      "/archive/case-005-1.jpg",
      "/archive/case-005-2.jpg",
      "/archive/case-005-3.jpg",
      "/archive/case-005-4.jpg"
    ],
    "excerpt": "Serie di ritratti a figura ravvicinata; le imperfezioni cutanee e le infiammazioni acneiche vengono esposte apertamente e accompagnate da scritte di rivendicazione per promuovere l..."
  },
  {
    "id": "caso-006",
    "number": "006",
    "title": "Mother",
    "authorOrSubject": "Elinor Carucci",
    "year": "2013",
    "type": "photo",
    "segno": "Smagliatura",
    "segnoTags": [
      "Smagliatura",
      "parto"
    ],
    "tipologia": "Pubblicazione Editoriale",
    "tono": "Viscerale / Radicale",
    "tipoDiMedia": "Fotografia",
    "categorie": "Trasformazione",
    "clusterTags": [
      "Trasformazione"
    ],
    "stileVisivo": "Ritrattistica a colori intima, calda e ravvicinata; estetica pittorica e domestica priva di idealizzazioni, focalizzata su tagli, secrezioni e carnalità.",
    "sintesiConcettuale": "Monografia che documenta un decennio di maternità a partire dal parto gemellare e dal cesareo d'emergenza; Ritrae con tenerezza il ventre segnato, la spossatezza e la trasformazione irreversibile del corpo.",
    "notes": "Monografia pubblicata da Prestel nel 2013 ed esposta internazionalmente. Include scatti cardine come 'My belly after giving birth and C section' (2004).",
    "externalLink": "https://www.elinorcarucci.com/mother.html",
    "driveLink": "https://drive.google.com/drive/folders/1pZlhhZTsOo9mWryPozAHo1Gt7_CdUHCF?usp=drive_link",
    "mascherabilita": "Mascherabile",
    "accettabilitaSociale": "Socialmente non accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo positivo",
    "sensoDiVergogna": "non ne provo vergogna",
    "imageUrl": "/archive/case-006.jpg",
    "thumbnailUrl": "/archive/thumbs/case-006.jpg",
    "galleryUrls": [
      "/archive/case-006-1.jpg",
      "/archive/case-006-2.jpg"
    ],
    "excerpt": "Monografia che documenta un decennio di maternità a partire dal parto gemellare e dal cesareo d'emergenza; Ritrae con tenerezza il ventre segnato, la spossatezza e la trasformazion..."
  },
  {
    "id": "caso-073",
    "number": "073",
    "title": "PELLE-ARCHIVIO",
    "authorOrSubject": "Didier Anzieu",
    "year": "1985",
    "type": "photo",
    "segno": "Traccia teorica",
    "ambitoTeorico": "Fenomenologia & Antropologia",
    "segnoTags": [
      "Traccia teorica"
    ],
    "tipologia": "Pubblicazione Editoriale",
    "tono": "Poetico / Evocativo",
    "tipoDiMedia": "Testo / Saggio",
    "categorie": "Medici",
    "clusterTags": [
      "Medici",
      "Trasformazione"
    ],
    "stileVisivo": "Trattato teorico e psicoanalitico; concettualizzazione dell'Io-pelle come involucro psichico, superficie di iscrizione e archivio della memoria somatica.",
    "sintesiConcettuale": "La pelle costituisce la base materiale su cui si costruisce la psiche. L'Io-pelle registra come un archivio le tracce, le ferite, i segni e le trasformazioni del corpo, che corrispondono alle memorie emotive e all'attraversamento della vita.",
    "notes": "Concetto fondativo elaborato da Didier Anzieu nel volume 'L'Io-pelle' (Le Moi-peau, 1985); definisce la funzione della pelle come archivio vivente di tracce esperienziali.",
    "externalLink": "http://www.melissaangelini.com/il-significato-psicologico-della-pelle/",
    "driveLink": "",
    "mascherabilita": "—",
    "accettabilitaSociale": "—",
    "percezioneSociale": "—",
    "percezioneEstetica": "—",
    "valenzaDelRicordo": "—",
    "sensoDiVergogna": "—",
    "imageUrl": "/archive/case-073.jpg",
    "thumbnailUrl": "/archive/thumbs/case-073.jpg",
    "galleryUrls": [],
    "excerpt": "La pelle costituisce la base materiale su cui si costruisce la psiche. L'Io-pelle registra come un archivio le tracce, le ferite, i segni e le trasformazioni del corpo, che corrisp...",
    "microKeyword": "ARCHIVIO"
  },
  {
    "id": "caso-007",
    "number": "007",
    "title": "Untitled (The Female Gaze)",
    "authorOrSubject": "Harley Weir",
    "year": "2016",
    "type": "photo",
    "segno": "Smagliatura",
    "segnoTags": [
      "Smagliatura"
    ],
    "tipologia": "Serie Fotografica",
    "tono": "Intimo / Confessionale",
    "tipoDiMedia": "Fotografia",
    "categorie": "Trasformazione",
    "clusterTags": [
      "Trasformazione"
    ],
    "stileVisivo": "C-print a colori; cromie calde, fuoco ravvicinato sulla matericità epidermica senza ritocco.",
    "sintesiConcettuale": "Realizzato per lo speciale 'Female Gaze Issue' di i-D Magazine ed entrato nella collezione del museo Foam di Amsterdam, lo scatto ridefinisce l'erotismo del corpo femminile attraverso uno sguardo non oggettificante.",
    "notes": "Opera fotografica (C-print 100x80 cm) acquisita nella collezione permanente di Foam ed esposta nella personale 'Boundaries' (2016-2017).",
    "externalLink": "https://www.foam.org/artworks/untitled-harley-weir",
    "driveLink": "https://drive.google.com/drive/folders/1kYTMGBFrgKrg8ssOWPXL5p9NF5qGSbuF?usp=drive_link",
    "mascherabilita": "Mascherabile",
    "accettabilitaSociale": "Socialmente non accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come attraente",
    "valenzaDelRicordo": "legato a un ricordo positivo",
    "sensoDiVergogna": "non ne provo vergogna",
    "imageUrl": "/archive/case-007.jpg",
    "thumbnailUrl": "/archive/thumbs/case-007.jpg",
    "galleryUrls": [],
    "excerpt": "Realizzato per lo speciale 'Female Gaze Issue' di i-D Magazine ed entrato nella collezione del museo Foam di Amsterdam, lo scatto ridefinisce l'erotismo del corpo femminile attrave..."
  },
  {
    "id": "caso-008",
    "number": "008",
    "title": "Love Your Lines",
    "authorOrSubject": "Alex Elle & Erika Layne Salazar",
    "year": "2014",
    "type": "photo",
    "segno": "Smagliatura",
    "segnoTags": [
      "Smagliatura"
    ],
    "tipologia": "Serie Fotografica",
    "tono": "Normalizzazione",
    "tipoDiMedia": "Fotografia",
    "categorie": "Trasformazione",
    "clusterTags": [
      "Trasformazione"
    ],
    "stileVisivo": "Ritrattistica in bianco e nero in luce naturale; primi piani e dettagli ravvicinati su linee, texture e curvature senza ritocco digitale.",
    "sintesiConcettuale": "Campagna visiva e social media movement ideata per celebrare le smagliature femminili come linee di vita e tracce di maternità, crescita e cambiamento corporeo.",
    "notes": "Campagna virale su Instagram (@loveyourlines) creata da due madri fotografe/scrittrici per contrastare il tabù delle smagliature e raccogliere storie visive da tutto il mondo.",
    "externalLink": "https://culturacolectiva.com/en/art/photography/love-your-lines-photo-movement/",
    "driveLink": "https://drive.google.com/drive/folders/1g0Sam1IpIN2qmWbpm4JiFxTKobFzhR8H?usp=drive_link",
    "mascherabilita": "Mascherabile",
    "accettabilitaSociale": "Socialmente non accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo positivo",
    "sensoDiVergogna": "non ne provo vergogna",
    "imageUrl": "/archive/case-008.jpg",
    "thumbnailUrl": "/archive/thumbs/case-008.jpg",
    "galleryUrls": [
      "/archive/case-008-1.jpg",
      "/archive/case-008-2.jpg",
      "/archive/case-008-3.jpg"
    ],
    "excerpt": "Campagna visiva e social media movement ideata per celebrare le smagliature femminili come linee di vita e tracce di maternità, crescita e cambiamento corporeo."
  },
  {
    "id": "caso-074",
    "number": "074",
    "title": "MEMORIA VIVA",
    "authorOrSubject": "il manifesto",
    "year": "2021",
    "type": "photo",
    "segno": "Traccia teorica",
    "ambitoTeorico": "Fenomenologia & Antropologia",
    "segnoTags": [
      "Traccia teorica"
    ],
    "tipologia": "Pubblicazione Editoriale",
    "tono": "Poetico / Evocativo",
    "tipoDiMedia": "Testo / Saggio",
    "categorie": "Traumi",
    "clusterTags": [
      "Traumi",
      "Trasformazione"
    ],
    "stileVisivo": "Articolo critico e saggio divulgativo; approfondimento interdisciplinare tra psicoanalisi, corporeità e persistenza mnestica delle iscrizioni epidermiche.",
    "sintesiConcettuale": "La pelle ha il compito di «conservare le iscrizioni sensoriali ed emotive». Le modificazioni cutanee nel tempo attestano un involucro corporeo che ha funzionato da memoria viva e trattiene la continuità dell'esistenza individuale.",
    "notes": "Contributo critico pubblicato su 'il manifesto' incentrato sul nesso tra psicoanalisi, memoria cutanea e continuità identitaria attraverso i segni del corpo.",
    "externalLink": "https://ilmanifesto.it/la-psicoanalisi-tra-corpo-e-immaginazione",
    "driveLink": "",
    "mascherabilita": "—",
    "accettabilitaSociale": "—",
    "percezioneSociale": "—",
    "percezioneEstetica": "—",
    "valenzaDelRicordo": "—",
    "sensoDiVergogna": "—",
    "imageUrl": "/archive/case-074.jpg",
    "thumbnailUrl": "/archive/thumbs/case-074.jpg",
    "galleryUrls": [],
    "excerpt": "La pelle ha il compito di «conservare le iscrizioni sensoriali ed emotive». Le modificazioni cutanee nel tempo attestano un involucro corporeo che ha funzionato da memoria viva e t...",
    "microKeyword": "MEMORIA"
  },
  {
    "id": "caso-009",
    "number": "009",
    "title": "The Gold Dust Project",
    "authorOrSubject": "Grace Hill",
    "year": "2019",
    "type": "photo",
    "segno": "Smagliatura",
    "segnoTags": [
      "Smagliatura"
    ],
    "tipologia": "Serie Fotografica",
    "tono": "Poetico / Evocativo",
    "tipoDiMedia": "Fotografia",
    "categorie": "Trasformazione",
    "clusterTags": [
      "Trasformazione"
    ],
    "stileVisivo": "Luce calda, applicazione di polvere e pigmenti dorati direttamente sulle smagliature e cicatrici, contrasto tra pelle e polvere d'oro.",
    "sintesiConcettuale": "Serie fotografica ispirata alla filosofia giapponese del kintsugi, in cui smagliature e cicatrici del parto vengono decorate con polvere dorata per celebrarne la preziosità.",
    "notes": "Progetto della fotografa Grace Hill nato per supportare le madri nel percorso di riappropriazione del corpo post-partum, trasformando le cicatrici in preziose fessure dorate.",
    "externalLink": "https://www.lovewhatmatters.com/photographer-rejoices-mothers-stretch-marks-scars-with-gorgeous-gold-dust-project/",
    "driveLink": "https://drive.google.com/drive/folders/1YOCUoc0UADjGSRvww8ZTLJ6w4m7m7YkP?usp=drive_link",
    "mascherabilita": "Mascherabile",
    "accettabilitaSociale": "Socialmente accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come attraente",
    "valenzaDelRicordo": "legato a un ricordo positivo",
    "sensoDiVergogna": "non ne provo vergogna",
    "imageUrl": "/archive/case-009.jpg",
    "thumbnailUrl": "/archive/thumbs/case-009.jpg",
    "galleryUrls": [
      "/archive/case-009-1.jpg",
      "/archive/case-009-2.jpg",
      "/archive/case-009-3.jpg"
    ],
    "excerpt": "Serie fotografica ispirata alla filosofia giapponese del kintsugi, in cui smagliature e cicatrici del parto vengono decorate con polvere dorata per celebrarne la preziosità."
  },
  {
    "id": "caso-010",
    "number": "010",
    "title": "The Postpartum Body Image Project",
    "authorOrSubject": "Kaitlyn McEntire",
    "year": "2017",
    "type": "photo",
    "segno": "Smagliatura",
    "segnoTags": [
      "Smagliatura",
      "parto"
    ],
    "tipologia": "Serie Fotografica",
    "tono": "Intimo / Confessionale",
    "tipoDiMedia": "Fotografia",
    "categorie": "Trasformazione",
    "clusterTags": [
      "Trasformazione"
    ],
    "stileVisivo": "Ritrattistica a figura intera e mezzobusto in luce naturale di studio; documentazione fedele di pelle, addome e segni del parto.",
    "sintesiConcettuale": "Progetto documentario che esplora il rapporto intimo delle donne con il proprio corpo post-parto, affrontando dismorfia, smagliature e cambiamenti fisici dopo la nascita.",
    "notes": "Serie documentaria e di interviste ideata dalla fotografa Kaitlyn McEntire, nata per offrire uno spazio sicuro di ascolto e condivisione sulla realtà del corpo post-partum.",
    "externalLink": "https://kaitlynmcentire.com/the-postpartum-body-image-project-part-1/",
    "driveLink": "https://drive.google.com/drive/folders/1VsSz3nl9Z2o1gPvwTbp-av6rngqPd7FA?usp=drive_link",
    "mascherabilita": "Mascherabile",
    "accettabilitaSociale": "Socialmente non accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo positivo",
    "sensoDiVergogna": "non ne provo vergogna",
    "imageUrl": "/archive/case-010.jpg",
    "thumbnailUrl": "/archive/thumbs/case-010.jpg",
    "galleryUrls": [
      "/archive/case-010-1.jpg",
      "/archive/case-010-2.jpg"
    ],
    "excerpt": "Progetto documentario che esplora il rapporto intimo delle donne con il proprio corpo post-parto, affrontando dismorfia, smagliature e cambiamenti fisici dopo la nascita."
  },
  {
    "id": "caso-075",
    "number": "075",
    "title": "CONTAMINARSI",
    "authorOrSubject": "Ashley Montagu",
    "year": "1971",
    "type": "photo",
    "segno": "Traccia teorica",
    "ambitoTeorico": "Fenomenologia & Antropologia",
    "segnoTags": [
      "Traccia teorica"
    ],
    "tipologia": "Pubblicazione Editoriale",
    "tono": "Poetico / Evocativo",
    "tipoDiMedia": "Testo / Saggio",
    "categorie": "Trasformazione",
    "clusterTags": [
      "Trasformazione",
      "Traumi"
    ],
    "stileVisivo": "Saggio antropologico e psicologico; indagine sulla dimensione tattile, la pelle come soglia vitale di contatto e confine tra interno ed esterno.",
    "sintesiConcettuale": "L'essere umano ha una necessità biologica e culturale di contaminarsi con il mondo esterno attraverso il contatto. La pelle funziona da soglia di transito, il luogo in cui l'esterno scrive la sua storia su di noi.",
    "notes": "Riflessione teorica fondata sugli studi antropologici di Ashley Montagu sul valore primario del tatto e della pelle come primo tramite relazionale ed emotivo.",
    "externalLink": "https://www.universitadelsociale.org/pelle-confini-e-memoria-emotiva-quando-il-corpo-mostra-cio-che-non-riusciamo-a-dire/",
    "driveLink": "",
    "mascherabilita": "—",
    "accettabilitaSociale": "—",
    "percezioneSociale": "—",
    "percezioneEstetica": "—",
    "valenzaDelRicordo": "—",
    "sensoDiVergogna": "—",
    "imageUrl": "/archive/case-075.jpg",
    "thumbnailUrl": "/archive/thumbs/case-075.jpg",
    "galleryUrls": [],
    "excerpt": "L'essere umano ha una necessità biologica e culturale di contaminarsi con il mondo esterno attraverso il contatto. La pelle funziona da soglia di transito, il luogo in cui l'estern...",
    "microKeyword": "CONTATTO"
  },
  {
    "id": "caso-011",
    "number": "011",
    "title": "Stories Of Stretch Marks",
    "authorOrSubject": "Homegrown India",
    "year": "2021",
    "type": "photo",
    "segno": "Smagliatura",
    "segnoTags": [
      "Smagliatura"
    ],
    "tipologia": "Serie Fotografica",
    "tono": "Normalizzazione",
    "tipoDiMedia": "Fotografia",
    "categorie": "Trasformazione",
    "clusterTags": [
      "Trasformazione"
    ],
    "stileVisivo": "Ritrattistica contemporanea a colori con luce naturale diffusa; focus ravvicinato e sincero su corpi, tonalità di pelle e texture senza ritocco cosmetico.",
    "sintesiConcettuale": "Iniziativa fotografica ed editoriale che documenta il percorso verso l'accettazione di sé di sette giovani indiani attraverso le loro smagliature e memorie corporee.",
    "notes": "Pubblicazione della piattaforma culturale Homegrown India che affronta il tabù culturale delle smagliature nel contesto sudasiatico, promuovendo autorappresentazione e self-love.",
    "externalLink": "https://homegrown.co.in/homegrown-creators/stories-of-stretch-marks-we-photographed-7-young-indians-journey-towards-self-love",
    "driveLink": "https://drive.google.com/drive/folders/1NoNWCQN_6yB5o4GKHaOjrwrEEmYVCBtO?usp=drive_link",
    "mascherabilita": "Mascherabile",
    "accettabilitaSociale": "Socialmente non accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo positivo",
    "sensoDiVergogna": "non ne provo vergogna",
    "imageUrl": "/archive/case-011.jpg",
    "thumbnailUrl": "/archive/thumbs/case-011.jpg",
    "galleryUrls": [
      "/archive/case-011-1.jpg",
      "/archive/case-011-2.jpg",
      "/archive/case-011-3.jpg"
    ],
    "excerpt": "Iniziativa fotografica ed editoriale che documenta il percorso verso l'accettazione di sé di sette giovani indiani attraverso le loro smagliature e memorie corporee."
  },
  {
    "id": "caso-012",
    "number": "012",
    "title": "Maternity Photos & Stretch Marks",
    "authorOrSubject": "Christinaabiola",
    "year": "2020",
    "type": "photo",
    "segno": "Smagliatura",
    "segnoTags": [
      "Smagliatura",
      "parto"
    ],
    "tipologia": "Pubblicazione Editoriale, Testimonianza personale",
    "tono": "Normalizzazione",
    "tipoDiMedia": "Fotografia",
    "categorie": "Trasformazione",
    "clusterTags": [
      "Trasformazione"
    ],
    "stileVisivo": "Fotogiornalismo e ritrattistica; estetica naturale, empatica e luminosa centrata su addomi e segni cutanei reali.",
    "sintesiConcettuale": "Reportage editoriale che promuove la de-stigmatizzazione delle smagliature nei servizi premaman, invitando a vivere i cambiamenti epidermici con serenità e orgoglio.",
    "notes": "Iniziativa editoriale di The Bump rivolta alla community genitoriale per scardinare i canoni di perfezione estetica e valorizzare i corpi reali in gravidanza.",
    "externalLink": "https://www.thebump.com/news/maternity-photos-stretch-marks",
    "driveLink": "https://drive.google.com/drive/folders/1iuIdVxldibVtkFvpq8OWxceWeLRjvClK?usp=drive_link",
    "mascherabilita": "Mascherabile",
    "accettabilitaSociale": "Socialmente non accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo positivo",
    "sensoDiVergogna": "non ne provo vergogna",
    "imageUrl": "/archive/case-012.jpg",
    "thumbnailUrl": "/archive/thumbs/case-012.jpg",
    "galleryUrls": [
      "/archive/case-012-1.jpg",
      "/archive/case-012-2.jpg"
    ],
    "excerpt": "Reportage editoriale che promuove la de-stigmatizzazione delle smagliature nei servizi premaman, invitando a vivere i cambiamenti epidermici con serenità e orgoglio."
  },
  {
    "id": "caso-013",
    "number": "013",
    "title": "Landscapes",
    "authorOrSubject": "Jennifer Loomis",
    "year": "2013",
    "type": "photo",
    "segno": "parto",
    "segnoTags": [
      "parto"
    ],
    "tipologia": "Serie Fotografica",
    "tono": "Poetico / Evocativo",
    "tipoDiMedia": "Fotografia",
    "categorie": "Trasformazione",
    "clusterTags": [
      "Trasformazione"
    ],
    "stileVisivo": "Fotografia in bianco e nero su pellicola e luce naturale, composizioni scultoree e astrazione delle forme e della texture cutanea.",
    "sintesiConcettuale": "Serie fotografica che decostruisce il ritratto di gravidanza trasformando il corpo materno in paesaggio astratto, stimolando riflessioni sociali sul corpo e la famiglia.",
    "notes": "Corpus artistico fine art stampato in grande formato; segna una svolta radicale rispetto al ritratto di maternità convenzionale verso la pura esplorazione plastica.",
    "externalLink": "https://www.jenniferloomis.com/landscapes",
    "driveLink": "https://drive.google.com/drive/folders/1Hzlo9XlBXLRHwOsLroi8kzzpucaDuXBp?usp=drive_link",
    "mascherabilita": "Mascherabile",
    "accettabilitaSociale": "Socialmente accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come attraente",
    "valenzaDelRicordo": "legato a un ricordo positivo",
    "sensoDiVergogna": "non ne provo vergogna",
    "imageUrl": "/archive/case-013.jpg",
    "thumbnailUrl": "/archive/thumbs/case-013.jpg",
    "galleryUrls": [
      "/archive/case-013-1.jpg"
    ],
    "excerpt": "Serie fotografica che decostruisce il ritratto di gravidanza trasformando il corpo materno in paesaggio astratto, stimolando riflessioni sociali sul corpo e la famiglia."
  },
  {
    "id": "caso-076",
    "number": "076",
    "title": "CONTATTO",
    "authorOrSubject": "Maurice Merleau-Ponty",
    "year": "1964",
    "type": "photo",
    "segno": "Traccia teorica",
    "ambitoTeorico": "Fenomenologia & Antropologia",
    "segnoTags": [
      "Traccia teorica"
    ],
    "tipologia": "Pubblicazione Editoriale",
    "tono": "Poetico / Evocativo",
    "tipoDiMedia": "Testo / Saggio",
    "categorie": "Trasformazione",
    "clusterTags": [
      "Trasformazione"
    ],
    "stileVisivo": "Trattato filosofico e fenomenologico; ontologia della carne, reversibilità percettiva del sensibile e cerniera tra corpo e mondo.",
    "sintesiConcettuale": "La pelle è il punto di cerniera in cui il vedente e il visibile si toccano. Tatto e vista mostrano che siamo fatti della stessa materia del mondo: toccare significa sempre essere toccati.",
    "notes": "Concetto elaborato a partire dalla fenomenologia della carne e del chiasmo di Maurice Merleau-Ponty, in cui l'epidermide funge da cerniera tra soggetto percipiente e mondo visibile.",
    "externalLink": "https://link.springer.com/article/10.1007/s11007-024-09628-4",
    "driveLink": "",
    "mascherabilita": "—",
    "accettabilitaSociale": "—",
    "percezioneSociale": "—",
    "percezioneEstetica": "—",
    "valenzaDelRicordo": "—",
    "sensoDiVergogna": "—",
    "imageUrl": "/archive/case-076.jpg",
    "thumbnailUrl": "/archive/thumbs/case-076.jpg",
    "galleryUrls": [],
    "excerpt": "La pelle è il punto di cerniera in cui il vedente e il visibile si toccano. Tatto e vista mostrano che siamo fatti della stessa materia del mondo: toccare significa sempre essere t...",
    "microKeyword": "CERNIERA"
  },
  {
    "id": "caso-014",
    "number": "014",
    "title": "Silk & Skin Works",
    "authorOrSubject": "Katarina Riesing",
    "year": "2020",
    "type": "photo",
    "segno": "Acne",
    "segnoTags": [
      "Acne",
      "rosacea",
      "eczema"
    ],
    "tipologia": "Mostra / Installazione",
    "tono": "Viscerale / Radicale",
    "tipoDiMedia": "Artefatto tessile, Pittura",
    "categorie": "Trasformazione",
    "clusterTags": [
      "Trasformazione"
    ],
    "stileVisivo": "Pittura su seta grezza e crêpe de Chine con ricamo a mano; inquadrature ravvicinate su follicoliti, irritazioni e dettagli viscerali dell'epidermide.",
    "sintesiConcettuale": "Corpus artistico che indaga la vulnerabilità cutanea unendo la delicatezza della seta a dettagli crudi di irritazioni e imperfezioni, ridefinendo il corpo femminile.",
    "notes": "Ricerca dell'artista americana esposta presso la Asya Geisberg Gallery (tra cui le mostre 'Razor Burn' e 'She Shed'), al confine tra arte tessile, pittura e anatomia.",
    "externalLink": "https://katarinariesing.com/",
    "driveLink": "https://drive.google.com/drive/folders/1fmnAbQ1ed1ZDSQaHzCb6vSo-2waCHfC7?usp=drive_link",
    "mascherabilita": "Mascherabile",
    "accettabilitaSociale": "Socialmente non accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "ne provo vergogna",
    "imageUrl": "/archive/case-014.jpg",
    "thumbnailUrl": "/archive/thumbs/case-014.jpg",
    "galleryUrls": [
      "/archive/case-014-1.jpg",
      "/archive/case-014-2.jpg",
      "/archive/case-014-3.jpg",
      "/archive/case-014-4.jpg",
      "/archive/case-014-5.jpg"
    ],
    "excerpt": "Corpus artistico che indaga la vulnerabilità cutanea unendo la delicatezza della seta a dettagli crudi di irritazioni e imperfezioni, ridefinendo il corpo femminile."
  },
  {
    "id": "caso-015",
    "number": "015",
    "title": "The SCAR Project",
    "authorOrSubject": "David Jay",
    "year": "2011",
    "type": "photo",
    "segno": "Cicatrici da mastectomia",
    "segnoTags": [
      "Cicatrici da mastectomia",
      "Cicatrici chirurgiche"
    ],
    "tipologia": "Serie Fotografica",
    "tono": "Intimo / Confessionale",
    "tipoDiMedia": "Fotografia",
    "categorie": "Medici",
    "clusterTags": [
      "Medici"
    ],
    "stileVisivo": "Ritrattistica in grande formato in bianco e nero e colore; nudo crudo ed empatico privo di fotoritocco, focalizzato su cicatrici chirurgiche post-mastectomia.",
    "sintesiConcettuale": "Ritratti su larga scala di giovani donne con mastectomia post-cancro. Rifiutando la retorica del nastro rosa, l'opera mostra la fierezza del corpo segnato dalla chirurgia, trasformando le cicatrici in tracce di identità e resilienza.",
    "notes": "Serie avviata nel 2005 e raccolta nel libro 'The SCAR Project: Breast Cancer Is Not A Pink Ribbon' (2011). Ha coinvolto oltre 100 giovani donne tra 18 e 35 anni.",
    "externalLink": "https://www.davidjayphotography.com/Image.asp?ImageID=1931622&apid=1&gpid=1&ipid=1&AKey=QNZ9HFXP",
    "driveLink": "https://drive.google.com/drive/folders/12d1DJi_P0gGq2cSNrN3mDt1GphLj9WlO?usp=drive_link",
    "mascherabilita": "Mascherabile",
    "accettabilitaSociale": "Socialmente non accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "non ne provo vergogna",
    "imageUrl": "/archive/case-015.jpg",
    "thumbnailUrl": "/archive/thumbs/case-015.jpg",
    "galleryUrls": [
      "/archive/case-015-1.jpg",
      "/archive/case-015-2.jpg",
      "/archive/case-015-3.jpg",
      "/archive/case-015-4.jpg",
      "/archive/case-015-5.jpg"
    ],
    "excerpt": "Ritratti su larga scala di giovani donne con mastectomia post-cancro. Rifiutando la retorica del nastro rosa, l'opera mostra la fierezza del corpo segnato dalla chirurgia, trasform..."
  },
  {
    "id": "caso-077",
    "number": "077",
    "title": "CORPO VISSUTO",
    "authorOrSubject": "Maurice Merleau-Ponty",
    "year": "1945",
    "type": "photo",
    "segno": "Traccia teorica",
    "ambitoTeorico": "Fenomenologia & Antropologia",
    "segnoTags": [
      "Traccia teorica"
    ],
    "tipologia": "Pubblicazione Editoriale",
    "tono": "Poetico / Evocativo",
    "tipoDiMedia": "Testo / Saggio",
    "categorie": "Trasformazione",
    "clusterTags": [
      "Trasformazione",
      "Traumi"
    ],
    "stileVisivo": "Indagine fenomenologica ed esistenziale; concettualizzazione del corpo proprio come soggetto d'esperienza, veicolo d'essere al mondo e incarnazione dell'identità.",
    "sintesiConcettuale": "«Noi siamo il nostro corpo». Ogni cambiamento, cicatrice o segno sulla pelle modifica il modo di abitare lo spazio e di fare esperienza, e chiama in causa l'identità intera della persona.",
    "notes": "Nozione cardine di Maurice Merleau-Ponty sviluppata nella 'Phénoménologie de la perception' (1945): la pelle e le sue tracce ridefiniscono l'ancoraggio esistenziale e corporeo nel mondo.",
    "externalLink": "https://link.springer.com/article/10.1007/s11007-024-09628-4",
    "driveLink": "",
    "mascherabilita": "—",
    "accettabilitaSociale": "—",
    "percezioneSociale": "—",
    "percezioneEstetica": "—",
    "valenzaDelRicordo": "—",
    "sensoDiVergogna": "—",
    "imageUrl": "/archive/case-077.jpg",
    "thumbnailUrl": "/archive/thumbs/case-077.jpg",
    "galleryUrls": [],
    "excerpt": "«Noi siamo il nostro corpo». Ogni cambiamento, cicatrice o segno sulla pelle modifica il modo di abitare lo spazio e di fare esperienza, e chiama in causa l'identità intera della p...",
    "microKeyword": "VISSUTO"
  },
  {
    "id": "caso-016",
    "number": "016",
    "title": "Saving Faces",
    "authorOrSubject": "Mark Gilbert / Prof. Iain Hutchison",
    "year": "2002",
    "type": "photo",
    "segno": "Cicatrici chirurgiche",
    "segnoTags": [
      "Cicatrici chirurgiche"
    ],
    "tipologia": "Mostra / Installazione",
    "tono": "Clinico / Scientifico",
    "tipoDiMedia": "Pittura",
    "categorie": "Medici",
    "clusterTags": [
      "Medici"
    ],
    "stileVisivo": "Pittura a olio su tela; ritrattistica espressiva e realistica che documenta i volti prima, durante e dopo gli interventi chirurgici maxillo-facciali.",
    "sintesiConcettuale": "Residenza artistica presso il St Bartholomew's Hospital. Ritratti di pazienti di chirurgia maxillo-facciale prima e dopo l'intervento, esplorando l'elaborazione del trauma e il ruolo terapeutico dell'arte.",
    "notes": "Progetto promosso da The Facial Surgery Research Foundation ed esposto alla National Portrait Gallery di Londra (2002), pioniere nell'intersezione tra pittura e chirurgia.",
    "externalLink": "http://www.markgilbert.co.uk/index.php?/project/saving-faces/",
    "driveLink": "https://drive.google.com/drive/folders/115Bmi_KYtvZV4GzlPjehJhNqK80o6Kl3?usp=drive_link",
    "mascherabilita": "Non mascherabile",
    "accettabilitaSociale": "Socialmente non accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "ne provo vergogna",
    "imageUrl": "/archive/case-016.jpg",
    "thumbnailUrl": "/archive/thumbs/case-016.jpg",
    "galleryUrls": [
      "/archive/case-016-1.jpg",
      "/archive/case-016-2.jpg",
      "/archive/case-016-3.jpg",
      "/archive/case-016-4.jpg"
    ],
    "excerpt": "Residenza artistica presso il St Bartholomew's Hospital. Ritratti di pazienti di chirurgia maxillo-facciale prima e dopo l'intervento, esplorando l'elaborazione del trauma e il ruo..."
  },
  {
    "id": "caso-017",
    "number": "017",
    "title": "Olimpia",
    "authorOrSubject": "Katarzyna Kozyra",
    "year": "1996",
    "type": "photo",
    "segno": "Tracce oncologiche",
    "segnoTags": [
      "Tracce oncologiche",
      "chemioterapia"
    ],
    "tipologia": "Mostra / Installazione",
    "tono": "Politico / Rivendicativo",
    "tipoDiMedia": "Fotografia, Video",
    "categorie": "Medici",
    "clusterTags": [
      "Medici"
    ],
    "stileVisivo": "Trittico fotografico a colori e video documentario; ripresa frontale e integrale segnato dalle terapie.",
    "sintesiConcettuale": "L'artista reinterpreta l'Olympia di Manet esponendo il proprio corpo segnato dalle terapie oncologiche. L'opera scardina i canoni della bellezza accademica, infrangendo il tabù della malattia e della fragilità fisica.",
    "notes": "Opera manifesto dell'arte critica polacca degli anni '90, costituita da tre grandi fotografie e un video che registra la somministrazione della chemioterapia; presente nelle collezioni museali nazionali.",
    "externalLink": "https://katarzynakozyra.pl/en/katarzyna-kozyras-artworks/143276-katarzyna-kozyra-olimpia",
    "driveLink": "https://drive.google.com/drive/folders/1ZIqFjdksbfOmGveu9p905rNfrLHPvga0?usp=drive_link",
    "mascherabilita": "Mascherabile",
    "accettabilitaSociale": "Socialmente non accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "non ne provo vergogna",
    "imageUrl": "/archive/case-017.jpg",
    "thumbnailUrl": "/archive/thumbs/case-017.jpg",
    "galleryUrls": [
      "/archive/case-017-1.jpg",
      "/archive/case-017-2.jpg"
    ],
    "excerpt": "L'artista reinterpreta l'Olympia di Manet esponendo il proprio corpo segnato dalle terapie oncologiche. L'opera scardina i canoni della bellezza accademica, infrangendo il tabù del..."
  },
  {
    "id": "caso-078",
    "number": "078",
    "title": "TEMPO INCARNATO",
    "authorOrSubject": "Maurice Merleau-Ponty",
    "year": "1945",
    "type": "photo",
    "segno": "Traccia teorica",
    "ambitoTeorico": "Fenomenologia & Antropologia",
    "segnoTags": [
      "Traccia teorica"
    ],
    "tipologia": "Pubblicazione Editoriale",
    "tono": "Poetico / Evocativo",
    "tipoDiMedia": "Testo / Saggio",
    "categorie": "Trasformazione",
    "clusterTags": [
      "Trasformazione"
    ],
    "stileVisivo": "Riflessione filosofico-fenomenologica; analisi della temporalità incorporata, del tempo che si fa carne e della stratificazione mnestica cutanea.",
    "sintesiConcettuale": "Il tempo passa attraverso la carne. Il corpo invecchia, muta e registra gli eventi perché porta inscritta la sua storia temporale.",
    "notes": "Articolazione fenomenologica merleau-pontyana della temporalità vissuta, in cui l'epidermide diviene archivio temporale e testimonianza incarnata del divenire.",
    "externalLink": "https://link.springer.com/article/10.1007/s11007-024-09628-4",
    "driveLink": "",
    "mascherabilita": "—",
    "accettabilitaSociale": "—",
    "percezioneSociale": "—",
    "percezioneEstetica": "—",
    "valenzaDelRicordo": "—",
    "sensoDiVergogna": "—",
    "imageUrl": "/archive/case-078.jpg",
    "thumbnailUrl": "/archive/thumbs/case-078.jpg",
    "galleryUrls": [],
    "excerpt": "Il tempo passa attraverso la carne. Il corpo invecchia, muta e registra gli eventi perché porta inscritta la sua storia temporale.",
    "microKeyword": "TEMPO"
  },
  {
    "id": "caso-018",
    "number": "018",
    "title": "Intra-Venus",
    "authorOrSubject": "Hannah Wilke",
    "year": "1992",
    "type": "photo",
    "segno": "Tracce oncologiche",
    "segnoTags": [
      "Tracce oncologiche",
      "chemioterapia"
    ],
    "tipologia": "Serie Fotografica",
    "tono": "Politico / Rivendicativo",
    "tipoDiMedia": "Fotografia",
    "categorie": "Medici",
    "clusterTags": [
      "Medici"
    ],
    "stileVisivo": "Ritrattistica a figura intera e primi piani a colori in grande formato; focalizzato sulle tracce del linfoma e dell'immunoterapia.",
    "sintesiConcettuale": "Creata negli ultimi anni di vita dell'artista affetta da linfoma, la serie documenta il decadimento fisico e le alterazioni corporee dovute ai trattamenti chemioterapici, decostruendo l'iconografia convenzionale della bellezza e della femminilità attraverso l'autorappresentazione radicale.",
    "notes": "Corpus monumentale realizzato tra il 1992 e il 1993 con Donald Goddard, esposto postumo alla Ronald Feldman Fine Arts (1994) e considerato un pilastro dell'arte femminista e della rappresentazione della malattia.",
    "externalLink": "https://feldmangallery.com/exhibition/164-intra-venus-wilke-1-8-2-19-1994",
    "driveLink": "https://drive.google.com/drive/folders/1woW5Egysi6JxsJBxKzoWOtXdcZAeMrIw?usp=drive_link",
    "mascherabilita": "Mascherabile",
    "accettabilitaSociale": "Socialmente non accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "ne provo vergogna",
    "imageUrl": "/archive/case-018.jpg",
    "thumbnailUrl": "/archive/thumbs/case-018.jpg",
    "galleryUrls": [
      "/archive/case-018-1.jpg",
      "/archive/case-018-2.jpg",
      "/archive/case-018-3.jpg"
    ],
    "excerpt": "Creata negli ultimi anni di vita dell'artista affetta da linfoma, la serie documenta il decadimento fisico e le alterazioni corporee dovute ai trattamenti chemioterapici, decostrue..."
  },
  {
    "id": "caso-019",
    "number": "019",
    "title": "The Picture of Health?",
    "authorOrSubject": "Jo Spence",
    "year": "1982",
    "type": "photo",
    "segno": "Cicatrici da mastectomia",
    "segnoTags": [
      "Cicatrici da mastectomia"
    ],
    "tipologia": "Serie Fotografica",
    "tono": "Politico / Rivendicativo",
    "tipoDiMedia": "Fotografia",
    "categorie": "Medici",
    "clusterTags": [
      "Medici"
    ],
    "stileVisivo": "Fototerapia e ritrattistica performativa in bianco e nero e colore; autoritratti autogestiti con scritte e slogan tracciati direttamente sulla pelle e sul seno marcato dalla chirurgia.",
    "sintesiConcettuale": "In risposta alla diagnosi di cancro al seno e all'infantilizzazione subita in ambito ospedaliero, Spence sviluppa la pratica della fototerapia: documenta la mastectomia e le terapie, trasformando la cicatrice e il corpo malato in campo di battaglia.",
    "notes": "Progetto seminale della phototherapy femminista britannica (1982-1986) con Terry Dennett e Rosy Martin, poi confluito nella monografia fondamentale 'Putting Myself in the Picture' (1986).",
    "externalLink": "https://jospence.org/ https://cockpitarchives.co.uk/the-picture-of-health-jo-spence-with-rosy-martin-maggie-murray-1985/",
    "driveLink": "https://drive.google.com/drive/folders/1PgAYZkMeLdZqSkQKx27XJBeYTepvI_kw?usp=drive_link",
    "mascherabilita": "Mascherabile",
    "accettabilitaSociale": "Socialmente non accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "non ne provo vergogna",
    "imageUrl": "/archive/case-019.jpg",
    "thumbnailUrl": "/archive/thumbs/case-019.jpg",
    "galleryUrls": [
      "/archive/case-019-1.jpg",
      "/archive/case-019-2.jpg",
      "/archive/case-019-3.jpg",
      "/archive/case-019-4.jpg",
      "/archive/case-019-5.jpg"
    ],
    "excerpt": "In risposta alla diagnosi di cancro al seno e all'infantilizzazione subita in ambito ospedaliero, Spence sviluppa la pratica della fototerapia: documenta la mastectomia e le terapi..."
  },
  {
    "id": "caso-079",
    "number": "079",
    "title": "CICATRICE COME INTERRUZIONE BIOGRAFICA",
    "authorOrSubject": "Mike Bury",
    "year": "1982",
    "type": "photo",
    "segno": "Traccia teorica",
    "ambitoTeorico": "Trauma, Tempo & Agency",
    "segnoTags": [
      "Traccia teorica"
    ],
    "tipologia": "Pubblicazione Editoriale",
    "tono": "Poetico / Evocativo",
    "tipoDiMedia": "Testo / Saggio",
    "categorie": "Traumi",
    "clusterTags": [
      "Traumi",
      "Medici"
    ],
    "stileVisivo": "Saggio sociologico e teorico; concettualizzazione della malattia cronica e della cicatrice come rottura biografica e cesura temporale.",
    "sintesiConcettuale": "Un evento improvviso (un incidente, una malattia, un'operazione d'urgenza) danneggia il corpo fisico e insieme spezza la linea temporale e le aspettative di vita dell'individuo. La cicatrice è la prova materiale di una biografia interrotta, da riscrivere a partire da quel segno.",
    "notes": "Articolo seminale pubblicato su 'Sociology of Health & Illness' (1982); introduce il concetto di 'biographical disruption' per spiegare l'impatto della condizione cronica sull'identità.",
    "externalLink": "[link removed]",
    "driveLink": "",
    "mascherabilita": "—",
    "accettabilitaSociale": "—",
    "percezioneSociale": "—",
    "percezioneEstetica": "—",
    "valenzaDelRicordo": "—",
    "sensoDiVergogna": "—",
    "imageUrl": "/archive/case-079.jpg",
    "thumbnailUrl": "/archive/thumbs/case-079.jpg",
    "galleryUrls": [],
    "excerpt": "Un evento improvviso (un incidente, una malattia, un'operazione d'urgenza) danneggia il corpo fisico e insieme spezza la linea temporale e le aspettative di vita dell'individuo. La...",
    "microKeyword": "FRATTURA"
  },
  {
    "id": "caso-020",
    "number": "020",
    "title": "You Have Nothing to Worry About",
    "authorOrSubject": "Melissa Spitz",
    "year": "2014",
    "type": "photo",
    "segno": "Cicatrici da incidenti",
    "segnoTags": [
      "Cicatrici da incidenti"
    ],
    "tipologia": "Serie Fotografica",
    "tono": "Intimo / Confessionale",
    "tipoDiMedia": "Fotografia",
    "categorie": "Medici",
    "clusterTags": [
      "Medici",
      "Traumi"
    ],
    "stileVisivo": "Fotogiornalismo e ritrattistica a colori; dettagli crudi senza filtri su ecchimosi cutanee, ferite, cerotti.",
    "sintesiConcettuale": "Serie fotografica a lungo termine che racconta la vita della madre affetta da gravi disturbi mentali e dipendenze; i segni sulla pelle, i lividi e le escoriazioni diventano la manifestazione tangibile della vulnerabilità psichica.",
    "notes": "Progetto sviluppato dal 2014 e diffuso attraverso Instagram, premiato da TIME Magazine nel 2017 come Instagram Photographer of the Year e pubblicato come monografia.",
    "externalLink": "https://www.melissaspitz.com/you-have-nothing-to-worry-about",
    "driveLink": "https://drive.google.com/drive/folders/1ElGj_XGOKpSw1N9vMA30_GmIBob56wPZ?usp=drive_link",
    "mascherabilita": "Mascherabile",
    "accettabilitaSociale": "Socialmente non accettato",
    "percezioneSociale": "Visto come minaccia",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "ne provo vergogna",
    "imageUrl": "/archive/case-020.jpg",
    "thumbnailUrl": "/archive/thumbs/case-020.jpg",
    "galleryUrls": [
      "/archive/case-020-1.jpg",
      "/archive/case-020-2.jpg",
      "/archive/case-020-3.jpg"
    ],
    "excerpt": "Serie fotografica a lungo termine che racconta la vita della madre affetta da gravi disturbi mentali e dipendenze; i segni sulla pelle, i lividi e le escoriazioni diventano la mani..."
  },
  {
    "id": "caso-021",
    "number": "021",
    "title": "Every One",
    "authorOrSubject": "Sophie Ristelhueber",
    "year": "1994",
    "type": "photo",
    "segno": "Cicatrici chirurgiche",
    "segnoTags": [
      "Cicatrici chirurgiche"
    ],
    "tipologia": "Serie Fotografica",
    "tono": "Clinico / Scientifico",
    "tipoDiMedia": "Fotografia",
    "categorie": "Traumi",
    "clusterTags": [
      "Traumi",
      "Medici"
    ],
    "stileVisivo": "Macrofotografia in bianco e nero e colori desaturati; inquadrature ravvicinate su cicatrici e suture.",
    "sintesiConcettuale": "Realizzata in un ospedale a Zagabria durante il conflitto balcanico, la serie accosta le cicatrici suturate di corpi anonimi alla cartografia di un territorio sventrato dalle bombe; la carne ferita diventa metafora tangibile della devastazione della guerra.",
    "notes": "Corpus composto da quattordici stampe monumentali (180x120 cm), esposto in prestigiose istituzioni tra cui il Centre Pompidou e la Tate Modern, fondamentale nell'indagine sui segni della violenza bellica.",
    "externalLink": "https://sophie-ristelhueber.format.com/untitled-gallery#13",
    "driveLink": "https://drive.google.com/drive/folders/1Gs6ptg7z_sVyXCLQqKoQlEniPTenUzD4",
    "mascherabilita": "Non mascherabile",
    "accettabilitaSociale": "Socialmente non accettato",
    "percezioneSociale": "Visto come minaccia",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "non ne provo vergogna",
    "imageUrl": "/archive/case-021.jpg",
    "thumbnailUrl": "/archive/thumbs/case-021.jpg",
    "galleryUrls": [
      "/archive/case-021-1.jpg",
      "/archive/case-021-2.jpg",
      "/archive/case-021-3.jpg",
      "/archive/case-021-4.jpg",
      "/archive/case-021-5.jpg"
    ],
    "excerpt": "Realizzata in un ospedale a Zagabria durante il conflitto balcanico, la serie accosta le cicatrici suturate di corpi anonimi alla cartografia di un territorio sventrato dalle bombe..."
  },
  {
    "id": "caso-022",
    "number": "022",
    "title": "The Mark of Life",
    "authorOrSubject": "Mischief @ No Fixed Address / Fuck Cancer",
    "year": "2025",
    "type": "photo",
    "segno": "Tracce oncologiche",
    "segnoTags": [
      "Tracce oncologiche",
      "chemioterapia"
    ],
    "tipologia": "Serie Fotografica",
    "tono": "Normalizzazione",
    "tipoDiMedia": "Fotografia",
    "categorie": "Medici",
    "clusterTags": [
      "Medici"
    ],
    "stileVisivo": "Ritrattistica contemporanea e documentazione visiva di tatuaggi artistici su pelle; estetica incentrata sulla valorizzazione dei segni di guarigione.",
    "sintesiConcettuale": "Iniziativa che trasforma i punti indelebili della radioterapia in simboli di forza e rinascita: accoppiando pazienti oncologici a tatuatori professionisti, converte le tracce cliniche della malattia in opere d'arte personalizzate.",
    "notes": "Campagna no-profit ideata con Fuck Cancer e Mischief per offrire tatuaggi gratuiti a persone in remissione, restituendo piena autodeterminazione sul proprio corpo dopo le cure radioterapiche.",
    "externalLink": "https://themarkoflife.com/",
    "driveLink": "https://drive.google.com/drive/folders/1-WXfsC1OBYTEE6x0dGCtcKreKY3BhWqL?usp=drive_link",
    "mascherabilita": "Mascherabile",
    "accettabilitaSociale": "Socialmente accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come attraente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "non ne provo vergogna",
    "imageUrl": "/archive/case-022.jpg",
    "thumbnailUrl": "/archive/thumbs/case-022.jpg",
    "galleryUrls": [
      "/archive/case-022-1.jpg",
      "/archive/case-022-2.jpg"
    ],
    "excerpt": "Iniziativa che trasforma i punti indelebili della radioterapia in simboli di forza e rinascita: accoppiando pazienti oncologici a tatuatori professionisti, converte le tracce clini..."
  },
  {
    "id": "caso-080",
    "number": "080",
    "title": "CORPO PLASTICO",
    "authorOrSubject": "Catherine Malabou",
    "year": "2009",
    "type": "photo",
    "segno": "Traccia teorica",
    "ambitoTeorico": "Trauma, Tempo & Agency",
    "segnoTags": [
      "Traccia teorica"
    ],
    "tipologia": "Pubblicazione Editoriale",
    "tono": "Poetico / Evocativo",
    "tipoDiMedia": "Testo / Saggio",
    "categorie": "Traumi",
    "clusterTags": [
      "Traumi",
      "Trasformazione"
    ],
    "stileVisivo": "Trattato filosofico e saggio teorico; ontologia della plasticità distruttiva, metamorfosi traumatica e deviazione irreversibile della forma corporea.",
    "sintesiConcettuale": "Il corpo segnato dall'imprevisto è una forma inedita, scolpita dall'urto. La vita progettata per anni subisce una deviazione improvvisa e irreversibile.",
    "notes": "Saggio filosofico 'Ontologie de l'accident' (2009); esplora la plasticità distruttiva scaturita da eventi traumatici improvvisi che ridefiniscono irreversibilmente l'essere.",
    "externalLink": "https://www.societyandspace.org/articles/ontology-of-the-accident-by-catherine-malabou",
    "driveLink": "",
    "mascherabilita": "—",
    "accettabilitaSociale": "—",
    "percezioneSociale": "—",
    "percezioneEstetica": "—",
    "valenzaDelRicordo": "—",
    "sensoDiVergogna": "—",
    "imageUrl": "/archive/case-080.jpg",
    "thumbnailUrl": "/archive/thumbs/case-080.jpg",
    "galleryUrls": [],
    "excerpt": "Il corpo segnato dall'imprevisto è una forma inedita, scolpita dall'urto. La vita progettata per anni subisce una deviazione improvvisa e irreversibile.",
    "microKeyword": "PLASTICO"
  },
  {
    "id": "caso-023",
    "number": "023",
    "title": "Zipper",
    "authorOrSubject": "Paul Mulgrew",
    "year": "2020",
    "type": "photo",
    "segno": "Cicatrici chirurgiche",
    "segnoTags": [
      "Cicatrici chirurgiche"
    ],
    "tipologia": "Mostra / Installazione",
    "tono": "Intimo / Confessionale",
    "tipoDiMedia": "Video",
    "categorie": "Medici",
    "clusterTags": [
      "Medici"
    ],
    "stileVisivo": "Cortometraggio narrativo con inquadrature ravvicinate e delicate sul torace; estetica intimista incentrata sull'autenticità della cicatrice sternotomica.",
    "sintesiConcettuale": "Cortometraggio incentrato su un'adolescente con cicatrice da cardiochirurgia pediatrica: indaga la percezione dell'immagine corporea e l'impatto degli sguardi altrui nella riappropriazione del proprio vissuto corporeo.",
    "notes": "Opera cinematografica selezionata al Raindance Film Festival 2020; interpretata da attori che sono realmente pazienti cardiopatici con autentiche cicatrici da sternotomia.",
    "externalLink": "https://paulmulgrew.com/work-zipper.html",
    "driveLink": "https://drive.google.com/drive/folders/1rcxFb4GxndlVpCYRjmzcmJaykOJsmY94?usp=drive_link",
    "mascherabilita": "Mascherabile",
    "accettabilitaSociale": "Socialmente accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "non ne provo vergogna",
    "imageUrl": "/archive/case-023.jpg",
    "thumbnailUrl": "/archive/thumbs/case-023.jpg",
    "galleryUrls": [],
    "excerpt": "Cortometraggio incentrato su un'adolescente con cicatrice da cardiochirurgia pediatrica: indaga la percezione dell'immagine corporea e l'impatto degli sguardi altrui nella riapprop..."
  },
  {
    "id": "caso-024",
    "number": "024",
    "title": "Beyond the Scar",
    "authorOrSubject": "Little Bodhi Photography (Debbie)",
    "year": "2024",
    "type": "photo",
    "segno": "Smagliatura",
    "segnoTags": [
      "Smagliatura",
      "parto"
    ],
    "tipologia": "Serie Fotografica",
    "tono": "Intimo / Confessionale",
    "tipoDiMedia": "Fotografia",
    "categorie": "Trasformazione",
    "clusterTags": [
      "Trasformazione"
    ],
    "stileVisivo": "Ritrattistica domestica in luce naturale; inquadrature sincere e spontanee su madri, neonati e addomi segnati da taglio cesareo.",
    "sintesiConcettuale": "Progetto fotografico dedicato a celebrare la nascita con parto cesareo: attraverso ritratti autentici e raccolte di testimonianze, trasforma la cicatrice chirurgica in un simbolo di resilienza e fierezza materna.",
    "notes": "Iniziativa continuativa a Bristol volta a creare uno spazio protetto di ascolto e condivisione sulle complessità emotive e corporee legate al parto cesareo.",
    "externalLink": "https://www.littlebodhiphotography.co.uk/caesarean-section-awareness/",
    "driveLink": "https://drive.google.com/drive/folders/10tUCfxkOUNU096THCL5I8BFBfr0Yg2ov?usp=drive_link",
    "mascherabilita": "Mascherabile",
    "accettabilitaSociale": "Socialmente accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo positivo",
    "sensoDiVergogna": "non ne provo vergogna",
    "imageUrl": "/archive/case-024.jpg",
    "thumbnailUrl": "/archive/thumbs/case-024.jpg",
    "galleryUrls": [
      "/archive/case-024-1.jpg",
      "/archive/case-024-2.jpg",
      "/archive/case-024-3.jpg"
    ],
    "excerpt": "Progetto fotografico dedicato a celebrare la nascita con parto cesareo: attraverso ritratti autentici e raccolte di testimonianze, trasforma la cicatrice chirurgica in un simbolo d..."
  },
  {
    "id": "caso-081",
    "number": "081",
    "title": "TRACCE DEL VISSUTO",
    "authorOrSubject": "Michel Serres",
    "year": "1985",
    "type": "photo",
    "segno": "Traccia teorica",
    "ambitoTeorico": "Fenomenologia & Antropologia",
    "segnoTags": [
      "Traccia teorica"
    ],
    "tipologia": "Pubblicazione Editoriale",
    "tono": "Poetico / Evocativo",
    "tipoDiMedia": "Testo / Saggio",
    "categorie": "Trasformazione",
    "clusterTags": [
      "Trasformazione"
    ],
    "stileVisivo": "Saggio filosofico ed epistemologico; fenomenologia dei cinque sensi, la pelle come tessuto di pieghe, impressioni tattili e incontro con il mondo.",
    "sintesiConcettuale": "La pelle non è una scatola rigida, ma un tessuto che si piega e si segna a ogni incontro. L'accumulo di pieghe e rughe sulla superficie del corpo è letteralmente la prova visibile che abbiamo incontrato l'altro, che abbiamo toccato il mondo e ci siamo lasciati impressionare da esso.",
    "notes": "Tratto dal volume 'Les Cinq Sens' (1985); testo cardine sulla sensorialità epidermica, in cui le pieghe e i segni della pelle testimoniano la relazione e il contatto con l'ambiente.",
    "externalLink": "https://filodiariannapsicologia.it/psicosomatica-la-pelle-come-specchio-della-psiche/",
    "driveLink": "",
    "mascherabilita": "—",
    "accettabilitaSociale": "—",
    "percezioneSociale": "—",
    "percezioneEstetica": "—",
    "valenzaDelRicordo": "—",
    "sensoDiVergogna": "—",
    "imageUrl": "/archive/case-081.jpg",
    "thumbnailUrl": "/archive/thumbs/case-081.jpg",
    "galleryUrls": [],
    "excerpt": "La pelle non è una scatola rigida, ma un tessuto che si piega e si segna a ogni incontro. L'accumulo di pieghe e rughe sulla superficie del corpo è letteralmente la prova visibile ...",
    "microKeyword": "TRACCE"
  },
  {
    "id": "caso-025",
    "number": "025",
    "title": "Scars: Portraits of Personal Journeys",
    "authorOrSubject": "Henry Fernando",
    "year": "2014",
    "type": "photo",
    "segno": "Cicatrici da incidenti",
    "segnoTags": [
      "Cicatrici da incidenti",
      "Cicatrici chirurgiche"
    ],
    "tipologia": "Serie Fotografica",
    "tono": "Intimo / Confessionale",
    "tipoDiMedia": "Fotografia",
    "categorie": "Medici",
    "clusterTags": [
      "Medici"
    ],
    "stileVisivo": "Ritratti autentici a figura intera e mezzobusto senza trucco né fotoritocco, centrati sulla presenza corporea.",
    "sintesiConcettuale": "Serie fotografica che ritrae persone con cicatrici dovute a traumi, interventi chirurgici o malattie: indaga la dignità e la bellezza che scaturiscono dal superamento delle avversità, trasformando ogni cicatrice in un racconto di vittoria.",
    "notes": "Esposto in mostra a Ottawa con il patrocinio delle istituzioni locali; mira a favorire l'autostima, la body positivity e a superare lo stigma legato alle tracce visibili sulla pelle.",
    "externalLink": "https://www.henryfernando.com/scar-project",
    "driveLink": "https://drive.google.com/drive/folders/16xJSkT69vKUbW0jCVAz41ZVuAWt-N7HG?usp=drive_link",
    "mascherabilita": "Mascherabile",
    "accettabilitaSociale": "Socialmente accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "non ne provo vergogna",
    "imageUrl": "/archive/case-025.jpg",
    "thumbnailUrl": "/archive/thumbs/case-025.jpg",
    "galleryUrls": [
      "/archive/case-025-1.jpg",
      "/archive/case-025-2.jpg",
      "/archive/case-025-3.jpg",
      "/archive/case-025-4.jpg"
    ],
    "excerpt": "Serie fotografica che ritrae persone con cicatrici dovute a traumi, interventi chirurgici o malattie: indaga la dignità e la bellezza che scaturiscono dal superamento delle avversi..."
  },
  {
    "id": "caso-026",
    "number": "026",
    "title": "Beauty Out of Damage",
    "authorOrSubject": "Matuschka",
    "year": "1993",
    "type": "photo",
    "segno": "Cicatrici da mastectomia",
    "segnoTags": [
      "Cicatrici da mastectomia"
    ],
    "tipologia": "Fotografia d'autore, Archivio / Ricerca, Pubblicazione Editoriale",
    "tono": "Politico / Rivendicativo",
    "tipoDiMedia": "Fotografia",
    "categorie": "Medici",
    "clusterTags": [
      "Medici"
    ],
    "stileVisivo": "Autoritratto a figura intera; posa elegante in abito da sera che scopre il torace segnato dall'intervento.",
    "sintesiConcettuale": "Autoritratto che espone la cicatrice della mastectomia sulla copertina del New York Times Magazine (1993), rompendo il silenzio e la vergogna legati alla malattia.",
    "notes": "Opera candidata al Premio Pulitzer e manifesto dell'attivismo contro il cancro al seno con il collettivo W.H.A.M.!, pietra miliare dell'autorappresentazione corporea.",
    "externalLink": "http://www.beautyoutofdamage.com/",
    "driveLink": "https://drive.google.com/drive/folders/1RiCbwQck5NPK38pkKIcl5V8OG-_Kf--f?usp=drive_link",
    "mascherabilita": "Mascherabile",
    "accettabilitaSociale": "Socialmente non accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "non ne provo vergogna",
    "imageUrl": "/archive/case-026.jpg",
    "thumbnailUrl": "/archive/thumbs/case-026.jpg",
    "galleryUrls": [
      "/archive/case-026-1.jpg",
      "/archive/case-026-2.jpg",
      "/archive/case-026-3.jpg",
      "/archive/case-026-4.jpg",
      "/archive/case-026-5.jpg",
      "/archive/case-026-6.jpg",
      "/archive/case-026-7.jpg",
      "/archive/case-026-8.jpg",
      "/archive/case-026-9.jpg",
      "/archive/case-026-10.jpg"
    ],
    "excerpt": "Autoritratto che espone la cicatrice della mastectomia sulla copertina del New York Times Magazine (1993), rompendo il silenzio e la vergogna legati alla malattia."
  },
  {
    "id": "caso-082",
    "number": "082",
    "title": "L’IO LETTO DALL’ALTRO",
    "authorOrSubject": "Erving Goffman",
    "year": "1963",
    "type": "photo",
    "segno": "Traccia teorica",
    "ambitoTeorico": "Sociologia & Biopolitica",
    "segnoTags": [
      "Traccia teorica"
    ],
    "tipologia": "Pubblicazione Editoriale",
    "tono": "Politico / Rivendicativo",
    "tipoDiMedia": "Testo / Saggio",
    "categorie": "Sistemici",
    "clusterTags": [
      "Sistemici",
      "Trasformazione"
    ],
    "stileVisivo": "Saggio sociologico e teoria dell'interazione; concettualizzazione dello stigma, dell'identità deteriorata e dello specchio sociale.",
    "sintesiConcettuale": "La pelle è il primo \"schermo\" con cui ci presentiamo agli altri. Il soggetto non sperimenta il proprio corpo in solitudine, ma attraverso lo \"specchio sociale\" (il giudizio interiorizzato degli altri).",
    "notes": "Riflessione sociologica fondata sugli studi di Erving Goffman sullo stigma e la presentazione del sé; la pelle come interfaccia corporea e specchio del giudizio sociale interiorizzato.",
    "externalLink": "https://cris.unibo.it/handle/11585/872762",
    "driveLink": "",
    "mascherabilita": "—",
    "accettabilitaSociale": "—",
    "percezioneSociale": "—",
    "percezioneEstetica": "—",
    "valenzaDelRicordo": "—",
    "sensoDiVergogna": "—",
    "imageUrl": "/archive/case-082.jpg",
    "thumbnailUrl": "/archive/thumbs/case-082.jpg",
    "galleryUrls": [],
    "excerpt": "La pelle è il primo \"schermo\" con cui ci presentiamo agli altri. Il soggetto non sperimenta il proprio corpo in solitudine, ma attraverso lo \"specchio sociale\" (il giudizio interio...",
    "microKeyword": "SCHERMO"
  },
  {
    "id": "caso-027",
    "number": "027",
    "title": "Mes cicatrices, Je suis d'elles, entièrement tissé.e",
    "authorOrSubject": "Hélène Gugenheim",
    "year": "2015",
    "type": "photo",
    "segno": "Cicatrici da mastectomia",
    "segnoTags": [
      "Cicatrici da mastectomia",
      "Cicatrici chirurgiche"
    ],
    "tipologia": "Performance",
    "tono": "Poetico / Evocativo",
    "tipoDiMedia": "Fotografia, Video",
    "categorie": "Medici",
    "clusterTags": [
      "Medici"
    ],
    "stileVisivo": "Performance rituale e documentazione video-fotografica; applicazione meticolosa di foglie d'oro lungo i tracciati delle cicatrici cutanee.",
    "sintesiConcettuale": "Ispirandosi alla filosofia del kintsugi, l'artista riveste d'oro le cicatrici chirurgiche dei partecipanti, trasformandoo la ferita fisica in segno luminoso di resilienza e bellezza.",
    "notes": "Progetto ideato con la doratrice Flore Falcinelli ed esposto a Parigi e internazionalmente, incentrato sul rituale di riappropriazione del corpo post-traumatico.",
    "externalLink": "https://helenegugenheim.com/?page_id=3157",
    "driveLink": "https://drive.google.com/drive/folders/1If44hr3i-UaPKzMULUqC8tLf8i_-3ObB?usp=drive_link",
    "mascherabilita": "Mascherabile",
    "accettabilitaSociale": "Socialmente accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come attraente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "non ne provo vergogna",
    "imageUrl": "/archive/case-027.jpg",
    "thumbnailUrl": "/archive/thumbs/case-027.jpg",
    "galleryUrls": [
      "/archive/case-027-1.jpg",
      "/archive/case-027-2.jpg"
    ],
    "excerpt": "Ispirandosi alla filosofia del kintsugi, l'artista riveste d'oro le cicatrici chirurgiche dei partecipanti, trasformandoo la ferita fisica in segno luminoso di resilienza e bellezz..."
  },
  {
    "id": "caso-028",
    "number": "028",
    "title": "Body & Flesh",
    "authorOrSubject": "Sofia Lipskerova",
    "year": "2023",
    "type": "photo",
    "segno": "Cicatrici chirurgiche",
    "segnoTags": [
      "Cicatrici chirurgiche"
    ],
    "tipologia": "Archivio / Ricerca",
    "tono": "Viscerale / Radicale",
    "tipoDiMedia": "Pittura",
    "categorie": "Traumi",
    "clusterTags": [
      "Traumi",
      "Medici"
    ],
    "stileVisivo": "Inquadrature macro e ravvicinate su tessuti cicatriziali e suture chirurgiche; illuminazione contrastata che evidenzia la tensione tra ferita, filo di sutura e carne.",
    "sintesiConcettuale": "Esplorazione visiva e concettuale dei corpi cuciti e dei segni corporali chirurgici come cartografia del trauma, dove i punti di sutura segnano il confine tra vulnerabilità e guarigione.",
    "notes": "Progetto di ricerca incentrato sulle asimmetrie e le alterazioni cutanee post-operatorie, decostruendo i canoni accademici del corpo levigato attraverso l'onestà della carne segnata.",
    "externalLink": "https://behindtheartist.co.uk/artist-interviews/artist-interview-sofia-lipskerova https://laskari.co.uk/bodyandflesh",
    "driveLink": "https://drive.google.com/drive/folders/1AMTsxKaT350U9_-Q3kJFwd7OO-3rihHH?usp=drive_link",
    "mascherabilita": "Mascherabile",
    "accettabilitaSociale": "Socialmente non accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "ne provo vergogna",
    "imageUrl": "/archive/case-028.jpg",
    "thumbnailUrl": "/archive/thumbs/case-028.jpg",
    "galleryUrls": [
      "/archive/case-028-1.jpg",
      "/archive/case-028-2.jpg",
      "/archive/case-028-3.jpg",
      "/archive/case-028-4.jpg"
    ],
    "excerpt": "Esplorazione visiva e concettuale dei corpi cuciti e dei segni corporali chirurgici come cartografia del trauma, dove i punti di sutura segnano il confine tra vulnerabilità e guari..."
  },
  {
    "id": "caso-083",
    "number": "083",
    "title": "KÖRPER E LEIB",
    "authorOrSubject": "Maurice Merleau-Ponty",
    "year": "1945",
    "type": "photo",
    "segno": "Traccia teorica",
    "ambitoTeorico": "Fenomenologia & Antropologia",
    "segnoTags": [
      "Traccia teorica"
    ],
    "tipologia": "Pubblicazione Editoriale",
    "tono": "Poetico / Evocativo",
    "tipoDiMedia": "Testo / Saggio",
    "categorie": "Trasformazione",
    "clusterTags": [
      "Trasformazione"
    ],
    "stileVisivo": "Trattato fenomenologico ed esistenziale; dicotomia filosofica tra corpo-oggetto (Körper) anatomico e corpo-vivente/vissuto (Leib) esperienziale.",
    "sintesiConcettuale": "Il corpo si vive in due modi. Il Körper è il corpo oggetto, materiale, misurabile, osservabile dall'esterno (lo specchio che giudica). Il Leib è il corpo vissuto, il corpo proprio attraverso cui si fa esperienza del mondo senza pensarci.",
    "notes": "Concetto sviluppato nella 'Phénoménologie de la perception' (1945); indaga la tensione fenomenologica tra il corpo oggettivato dallo sguardo esterno e il corpo vissuto dall'interno.",
    "externalLink": "[link removed]",
    "driveLink": "",
    "mascherabilita": "—",
    "accettabilitaSociale": "—",
    "percezioneSociale": "—",
    "percezioneEstetica": "—",
    "valenzaDelRicordo": "—",
    "sensoDiVergogna": "—",
    "imageUrl": "/archive/case-083.jpg",
    "thumbnailUrl": "/archive/thumbs/case-083.jpg",
    "galleryUrls": [],
    "excerpt": "Il corpo si vive in due modi. Il Körper è il corpo oggetto, materiale, misurabile, osservabile dall'esterno (lo specchio che giudica). Il Leib è il corpo vissuto, il corpo proprio ...",
    "microKeyword": "LEIB"
  },
  {
    "id": "caso-029",
    "number": "029",
    "title": "Ärr / Scars",
    "authorOrSubject": "Åsa Kalmér & Jörgen Hjerdt",
    "year": "2021",
    "type": "photo",
    "segno": "Cicatrici da mastectomia",
    "segnoTags": [
      "Cicatrici da mastectomia",
      "Tracce oncologiche",
      "chemioterapia"
    ],
    "tipologia": "Mostra / Installazione",
    "tono": "Intimo / Confessionale",
    "tipoDiMedia": "Fotografia",
    "categorie": "Medici",
    "clusterTags": [
      "Medici"
    ],
    "stileVisivo": "Ritrattistica con pose teatrali e sensuali a torso nudo; illuminazione che valorizza la cicatrice della mastectomia e la corporeità androgina.",
    "sintesiConcettuale": "Serie fotografica nata per elaborare la mastectomia e le terapie oncologiche dell'attrice: l'opera rifiuta la retorica della vittima per celebrare sensualità, energia e nuova identità corporea.",
    "notes": "Mostra presentata al Fotografiska di Stoccolma e all'Alma Löv Museum, incentrata sull'estetizzazione del tabù e sul superamento degli stereotipi di genere legati al seno asportato.",
    "externalLink": "https://stockholm.fotografiska.com/sv/exhibitions/hjerdt-och-kalmer",
    "driveLink": "https://drive.google.com/drive/folders/18CQ_1KUNsJ2oAjYmzpxv7S2IpNF5ms1q?usp=drive_link",
    "mascherabilita": "Mascherabile",
    "accettabilitaSociale": "Socialmente non accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come attraente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "non ne provo vergogna",
    "imageUrl": "/archive/case-029.jpg",
    "thumbnailUrl": "/archive/thumbs/case-029.jpg",
    "galleryUrls": [
      "/archive/case-029-1.jpg",
      "/archive/case-029-2.jpg",
      "/archive/case-029-3.jpg",
      "/archive/case-029-4.jpg"
    ],
    "excerpt": "Serie fotografica nata per elaborare la mastectomia e le terapie oncologiche dell'attrice: l'opera rifiuta la retorica della vittima per celebrare sensualità, energia e nuova ident..."
  },
  {
    "id": "caso-030",
    "number": "030",
    "title": "The Scar Project",
    "authorOrSubject": "Nadia Myre",
    "year": "2005",
    "type": "photo",
    "segno": "Cicatrici chirurgiche",
    "segnoTags": [
      "Cicatrici chirurgiche"
    ],
    "tipologia": "Mostra / Installazione, Performance, Pubblicazione Editoriale",
    "tono": "Intimo / Confessionale",
    "tipoDiMedia": "Artefatto tessile",
    "categorie": "Traumi",
    "clusterTags": [
      "Traumi",
      "Medici"
    ],
    "stileVisivo": "Installazione partecipativa con piccoli telai e tele quadrate ricamate, cucite e lacerate; estetica tattile, simbolica e materica.",
    "sintesiConcettuale": "Progetto partecipativo pluriennale in cui i partecipanti descrivono e cuciono su tela le proprie cicatrici fisiche o interiori, trasformando le ferite in narrazioni condivise di guarigione e resilienza.",
    "notes": "Opera partecipativa seminale avviata nel 2005 che ha raccolto oltre 1400 tele cucite e testimonianze da diverse comunità nel mondo; entrata nelle collezioni museali canadesi.",
    "externalLink": "http://nadiamyre.net/thescarproject",
    "driveLink": "https://drive.google.com/drive/folders/1KhVBHiqItJQWlcA-wkgjfDx-_wuMSbHh?usp=drive_link",
    "mascherabilita": "Mascherabile",
    "accettabilitaSociale": "Socialmente accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "non ne provo vergogna",
    "imageUrl": "/archive/case-030.jpg",
    "thumbnailUrl": "/archive/thumbs/case-030.jpg",
    "galleryUrls": [
      "/archive/case-030-1.jpg",
      "/archive/case-030-2.jpg",
      "/archive/case-030-3.jpg",
      "/archive/case-030-4.jpg"
    ],
    "excerpt": "Progetto partecipativo pluriennale in cui i partecipanti descrivono e cuciono su tela le proprie cicatrici fisiche o interiori, trasformando le ferite in narrazioni condivise di gu..."
  },
  {
    "id": "caso-031",
    "number": "031",
    "title": "The Zipperstrong Project 2022",
    "authorOrSubject": "SheRae Hunter / Conquering CHD",
    "year": "2022",
    "type": "photo",
    "segno": "Cicatrici chirurgiche",
    "segnoTags": [
      "Cicatrici chirurgiche"
    ],
    "tipologia": "Serie Fotografica",
    "tono": "Intimo / Confessionale",
    "tipoDiMedia": "Fotografia",
    "categorie": "Medici",
    "clusterTags": [
      "Medici"
    ],
    "stileVisivo": "Ritrattistica a colori in studio e ambiente naturale; inquadrature ravvicinate e luminose sui toraci di bambini con cicatrici da sternotomia prive di ritocco cosmetico.",
    "sintesiConcettuale": "Campagna fotografica e narrativa dedicata a bambini nati con cardiopatie congenite: valorizza la cicatrice sternotomica 'zipper' come simbolo di forza, sopravvivenza e fierezza.",
    "notes": "Iniziativa fotografica continuativa creata da SheRae Hunter e affiliata all'associazione no-profit Conquering CHD, finalizzata alla sensibilizzazione e al sostegno delle famiglie con cardiopatie congenite.",
    "externalLink": "https://www.zipperstrong.org/zipperstrongproject2022",
    "driveLink": "https://drive.google.com/drive/folders/1Ri0te_zYWR-zqmNK_mL_CNtl7nlDDUaR?usp=drive_link",
    "mascherabilita": "Mascherabile",
    "accettabilitaSociale": "Socialmente accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "non ne provo vergogna",
    "imageUrl": "/archive/case-031.jpg",
    "thumbnailUrl": "/archive/thumbs/case-031.jpg",
    "galleryUrls": [
      "/archive/case-031-1.jpg",
      "/archive/case-031-2.jpg",
      "/archive/case-031-3.jpg",
      "/archive/case-031-4.jpg"
    ],
    "excerpt": "Campagna fotografica e narrativa dedicata a bambini nati con cardiopatie congenite: valorizza la cicatrice sternotomica 'zipper' come simbolo di forza, sopravvivenza e fierezza."
  },
  {
    "id": "caso-084",
    "number": "084",
    "title": "DOPPIA SENSAZIONE",
    "authorOrSubject": "Edmund Husserl",
    "year": "1952",
    "type": "photo",
    "segno": "Traccia teorica",
    "ambitoTeorico": "Fenomenologia & Antropologia",
    "segnoTags": [
      "Traccia teorica"
    ],
    "tipologia": "Pubblicazione Editoriale",
    "tono": "Poetico / Evocativo",
    "tipoDiMedia": "Testo / Saggio",
    "categorie": "Trasformazione",
    "clusterTags": [
      "Trasformazione",
      "Sistemici"
    ],
    "stileVisivo": "Indagine fenomenologica trascendentale; analisi della 'Doppelempfindung' (doppia sensazione tattile) e della localizzazione somatica della coscienza corporea.",
    "sintesiConcettuale": "Il corpo è l'unico oggetto del mondo che risulta insieme percepito dall'esterno e sentito dall'interno. Un segno sulla pelle amplifica questa spaccatura e costringe il soggetto a guardarsi con gli occhi della società, invece di vivere liberamente.",
    "notes": "Nozione fenomenologica sviluppata nelle 'Ideen II' (Idee per una fenomenologia pura e per una filosofia fenomenologica, 1952); analisi del doppio statuto della pelle e del corpo proprio.",
    "externalLink": "https://umontreal.scholaris.ca/server/api/core/bitstreams/27ba327e-b107-4575-9904-e13f0ee59dc1/content",
    "driveLink": "",
    "mascherabilita": "—",
    "accettabilitaSociale": "—",
    "percezioneSociale": "—",
    "percezioneEstetica": "—",
    "valenzaDelRicordo": "—",
    "sensoDiVergogna": "—",
    "imageUrl": "/archive/case-084.jpg",
    "thumbnailUrl": "/archive/thumbs/case-084.jpg",
    "galleryUrls": [],
    "excerpt": "Il corpo è l'unico oggetto del mondo che risulta insieme percepito dall'esterno e sentito dall'interno. Un segno sulla pelle amplifica questa spaccatura e costringe il soggetto a g...",
    "microKeyword": "SENSAZIONE"
  },
  {
    "id": "caso-032",
    "number": "032",
    "title": "Children's Healthcare of Atlanta",
    "authorOrSubject": "Kate T. Parker",
    "year": "2016",
    "type": "photo",
    "segno": "Cicatrici chirurgiche",
    "segnoTags": [
      "Cicatrici chirurgiche"
    ],
    "tipologia": "Serie Fotografica",
    "tono": "Normalizzazione",
    "tipoDiMedia": "Fotografia",
    "categorie": "Medici",
    "clusterTags": [
      "Medici"
    ],
    "stileVisivo": "Ritrattistica a figura intera e mezzobusto; inquadrature fiere, piene di energia che valorizzano cicatrici chirurgiche e vitalità infantile.",
    "sintesiConcettuale": "Serie fotografica commissionata da Children's Healthcare of Atlanta per ritrarre giovani pazienti pediatrici: le cicatrici degli interventi diventano testimonianze autentiche di coraggio, guarigione e resilienza.",
    "notes": "Progetto fotografico e campagna di sensibilizzazione realizzata in collaborazione con Children's Healthcare of Atlanta, ripresa da media nazionali (tra cui Inside Edition) per celebrare il coraggio dei piccoli pazienti.",
    "externalLink": "https://www.greenhousereps.com/post/12173/kate-t-parker-childrens-healthcare-of-atlanta",
    "driveLink": "https://drive.google.com/drive/folders/1lQ2ztohXTT3ME9YgsMrGyg6f_fu2qi7y?usp=drive_link",
    "mascherabilita": "Mascherabile",
    "accettabilitaSociale": "Socialmente accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "non ne provo vergogna",
    "imageUrl": "/archive/case-032.jpg",
    "thumbnailUrl": "/archive/thumbs/case-032.jpg",
    "galleryUrls": [
      "/archive/case-032-1.jpg",
      "/archive/case-032-2.jpg",
      "/archive/case-032-3.jpg"
    ],
    "excerpt": "Serie fotografica commissionata da Children's Healthcare of Atlanta per ritrarre giovani pazienti pediatrici: le cicatrici degli interventi diventano testimonianze autentiche di co..."
  },
  {
    "id": "caso-033",
    "number": "033",
    "title": "Behind the Scars",
    "authorOrSubject": "Sophie Mayanne",
    "year": "2017",
    "type": "photo",
    "segno": "Cicatrici da incidenti",
    "segnoTags": [
      "Cicatrici da incidenti",
      "Cicatrici chirurgiche"
    ],
    "tipologia": "Serie Fotografica",
    "tono": "Intimo / Confessionale",
    "tipoDiMedia": "Fotografia",
    "categorie": "Traumi",
    "clusterTags": [
      "Traumi",
      "Medici"
    ],
    "stileVisivo": "Ritrattistica a colori in luce naturale; primi piani e figure intere, accompagnati da testimonianze scritte delle persone ritratte.",
    "sintesiConcettuale": "Progetto fotografico che documenta centinaia di individui con cicatrici da interventi, traumi o ustioni, affiancando le loro storie scritte per ribaltare lo stigma ed esaltare la singolarità di ogni corpo.",
    "notes": "Serie avviata nel 2017 a Londra e diffusasi globalmente su Instagram e media internazionali; ha ritratto centinaia di persone promuovendo l'accettazione corporea e la visibilità delle tracce fisiche.",
    "externalLink": "https://www.canon.co.uk/view/behind-the-scars/",
    "driveLink": "https://drive.google.com/drive/folders/172Xwvp54BBi7aVYq-vBQEKYIonxO3s8e",
    "mascherabilita": "Mascherabile",
    "accettabilitaSociale": "Socialmente non accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "non ne provo vergogna",
    "imageUrl": "/archive/case-033.jpg",
    "thumbnailUrl": "/archive/thumbs/case-033.jpg",
    "galleryUrls": [
      "/archive/case-033-1.jpg",
      "/archive/case-033-2.jpg",
      "/archive/case-033-3.jpg",
      "/archive/case-033-4.jpg"
    ],
    "excerpt": "Progetto fotografico che documenta centinaia di individui con cicatrici da interventi, traumi o ustioni, affiancando le loro storie scritte per ribaltare lo stigma ed esaltare la s..."
  },
  {
    "id": "caso-085",
    "number": "085",
    "title": "PELLE COME TESTO, SEGNO COME INDICE",
    "authorOrSubject": "Charles Sanders Peirce",
    "year": "1894",
    "type": "photo",
    "segno": "Traccia teorica",
    "ambitoTeorico": "Semiotica del segno",
    "segnoTags": [
      "Traccia teorica"
    ],
    "tipologia": "Pubblicazione Editoriale",
    "tono": "Poetico / Evocativo",
    "tipoDiMedia": "Testo / Saggio",
    "categorie": "Trasformazione",
    "clusterTags": [
      "Trasformazione",
      "Traumi"
    ],
    "stileVisivo": "Trattato filosofico e semiotico; teoria della traccia indicale, legame causale tra evento corporeo e segno cutaneo.",
    "sintesiConcettuale": "Nella classificazione dei segni di Peirce la cicatrice è un indice. L'indice ha un legame fisico e causale con il suo referente: la cicatrice c'è perché c'è stata una ferita, un evento, un trauma o un'operazione. Un disegno o un simbolo arbitrario non hanno questo vincolo.",
    "notes": "Riflessione teorica fondata sulla classificazione semiotica triadica di C. S. Peirce; la cicatrice come indice non arbitrario di un'azione materiale pregressa.",
    "externalLink": "",
    "driveLink": "",
    "mascherabilita": "—",
    "accettabilitaSociale": "—",
    "percezioneSociale": "—",
    "percezioneEstetica": "—",
    "valenzaDelRicordo": "—",
    "sensoDiVergogna": "—",
    "imageUrl": "/archive/case-085.jpg",
    "thumbnailUrl": "/archive/thumbs/case-085.jpg",
    "galleryUrls": [],
    "excerpt": "Nella classificazione dei segni di Peirce la cicatrice è un indice. L'indice ha un legame fisico e causale con il suo referente: la cicatrice c'è perché c'è stata una ferita, un ev...",
    "microKeyword": "INDICE"
  },
  {
    "id": "caso-034",
    "number": "034",
    "title": "IN/VISIBLE",
    "authorOrSubject": "Ann-Christine Woehrl",
    "year": "2014",
    "type": "photo",
    "segno": "Ustione da acido",
    "segnoTags": [
      "Ustione da acido",
      "Ustione da fuoco"
    ],
    "tipologia": "Serie Fotografica",
    "tono": "Politico / Rivendicativo",
    "tipoDiMedia": "Fotografia",
    "categorie": "Traumi",
    "clusterTags": [
      "Traumi"
    ],
    "stileVisivo": "Ritrattistica documentaria a colori in luce naturale; primi piani e ritratti intimi che restituiscono la fierezza dei volti.",
    "sintesiConcettuale": "Reportage realizzato in sei Paesi che documenta la vita di donne sopravvissute ad attacchi con acido e ustioni dolose, scardinando l'invisibilità sociale attraverso l'autorappresentazione e la dignità personale.",
    "notes": "Presentato al Festival della Fotografia Etica edito da Lammerhuber nel 2014; indaga le radici sociali della violenza di genere e il percorso di riscatto e autodeterminazione delle vittime.",
    "externalLink": "https://archivio.festivaldellafotografiaetica.it/ann-christine-woehrl-invisible-eng/",
    "driveLink": "https://drive.google.com/drive/folders/1E2RNi-Rz-EmoLUd8SZROA8TWGLX_dcPB",
    "mascherabilita": "Non mascherabile",
    "accettabilitaSociale": "Socialmente non accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "ne provo vergogna",
    "imageUrl": "/archive/case-034.jpg",
    "thumbnailUrl": "/archive/thumbs/case-034.jpg",
    "galleryUrls": [
      "/archive/case-034-1.jpg",
      "/archive/case-034-2.jpg"
    ],
    "excerpt": "Reportage realizzato in sei Paesi che documenta la vita di donne sopravvissute ad attacchi con acido e ustioni dolose, scardinando l'invisibilità sociale attraverso l'autorappresen..."
  },
  {
    "id": "caso-035",
    "number": "035",
    "title": "Fire of Hatred",
    "authorOrSubject": "Asghar Khamseh",
    "year": "2016",
    "type": "photo",
    "segno": "Ustione da acido",
    "segnoTags": [
      "Ustione da acido"
    ],
    "tipologia": "Serie Fotografica",
    "tono": "Politico / Rivendicativo",
    "tipoDiMedia": "Fotografia",
    "categorie": "Traumi",
    "clusterTags": [
      "Traumi"
    ],
    "stileVisivo": "Ritrattistica frontale a figura intera e primi piani; illuminazione chiaroscurale drammatica che evidenzia le lesioni e la fierezza dei sopravvissuti.",
    "sintesiConcettuale": "Serie documentaria e ritrattistica sui sopravvissuti ad attacchi con acido in Iran; l'opera infrange il silenzio, restituendo dignità e identità ai volti delle vittime.",
    "notes": "Serie vincitrice del prestigioso premio L'Iris d'Or (Photographer of the Year ai Sony World Photography Awards 2016); indaga le conseguenze fisiche e psicologiche della violenza con acido in contesti di conflitto intrafamiliare.",
    "externalLink": "https://www.lensculture.com/articles/asghar-khamseh-fire-of-hatred",
    "driveLink": "https://drive.google.com/drive/folders/1FLYrK_-A2dCAdPd1pYG01g-nACSuiMnz",
    "mascherabilita": "Non mascherabile",
    "accettabilitaSociale": "Socialmente non accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "ne provo vergogna",
    "imageUrl": "/archive/case-035.jpg",
    "thumbnailUrl": "/archive/thumbs/case-035.jpg",
    "galleryUrls": [
      "/archive/case-035-1.jpg",
      "/archive/case-035-2.jpg",
      "/archive/case-035-3.jpg"
    ],
    "excerpt": "Serie documentaria e ritrattistica sui sopravvissuti ad attacchi con acido in Iran; l'opera infrange il silenzio, restituendo dignità e identità ai volti delle vittime."
  },
  {
    "id": "caso-086",
    "number": "086",
    "title": "SEGNO COME DEVIAZIONE DELLA NORMA",
    "authorOrSubject": "Algirdas Julien Greimas",
    "year": "1966",
    "type": "photo",
    "segno": "Traccia teorica",
    "ambitoTeorico": "Semiotica del segno",
    "segnoTags": [
      "Traccia teorica"
    ],
    "tipologia": "Pubblicazione Editoriale",
    "tono": "Poetico / Evocativo",
    "tipoDiMedia": "Testo / Saggio",
    "categorie": "Trasformazione",
    "clusterTags": [
      "Trasformazione",
      "Sistemici"
    ],
    "stileVisivo": "Trattato semiotico e strutturale; opposizioni binarie della percezione visiva e semiosi dello scarto rispetto alla superficie integra.",
    "sintesiConcettuale": "La percezione visiva si organizza in opposizioni binarie: liscio/rugoso, regolare/irregolare, simmetrico/asimmetrico, norma/scarto. Il segno sulla pelle è una differenza, una deviazione dalla norma.",
    "notes": "Modello teorico strutturale applicato alla superficie corporea; l'epidermide come piano di manifestazione in cui il segno produce significazione per differenziazione.",
    "externalLink": "",
    "driveLink": "",
    "mascherabilita": "—",
    "accettabilitaSociale": "—",
    "percezioneSociale": "—",
    "percezioneEstetica": "—",
    "valenzaDelRicordo": "—",
    "sensoDiVergogna": "—",
    "imageUrl": "/archive/case-086.jpg",
    "thumbnailUrl": "/archive/thumbs/case-086.jpg",
    "galleryUrls": [],
    "excerpt": "La percezione visiva si organizza in opposizioni binarie: liscio/rugoso, regolare/irregolare, simmetrico/asimmetrico, norma/scarto. Il segno sulla pelle è una differenza, una devia...",
    "microKeyword": "NORMA"
  },
  {
    "id": "caso-036",
    "number": "036",
    "title": "Pakistani Acid Attack Victims",
    "authorOrSubject": "Emilio Morenatti / Associated Press",
    "year": "2008",
    "type": "photo",
    "segno": "Ustione da acido",
    "segnoTags": [
      "Ustione da acido"
    ],
    "tipologia": "Serie Fotografica",
    "tono": "Politico / Rivendicativo",
    "tipoDiMedia": "Fotografia",
    "categorie": "Traumi",
    "clusterTags": [
      "Traumi"
    ],
    "stileVisivo": "Ritrattistica a figura intera e mezzo busto su sfondo neutro; primi piani intensi e rigorosi che mettono a nudo le cicatrici cutanee e lo sguardo delle sopravvissute.",
    "sintesiConcettuale": "Reportage fotogiornalistico che documenta le storie di donne pakistane sopravvissute ad aggressioni con l'acido; l'indagine scardina il silenzio sui delitti d'onore e sulle ritorsioni di genere, sollecitando un cambiamento legislativo e culturale.",
    "notes": "Serie realizzata dal fotoreporter Emilio Morenatti per Associated Press, pluripremiata a livello internazionale per aver documentato il dramma sociale degli attacchi con l'acido in Pakistan.",
    "externalLink": "https://hellobeautiful.com/2729801/pakistani-acid-attacks-against-women/",
    "driveLink": "https://drive.google.com/drive/folders/1STfO8A6Z6kGeo2OmX14sH4rBINhj6cFd",
    "mascherabilita": "Non mascherabile",
    "accettabilitaSociale": "Socialmente non accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "ne provo vergogna",
    "imageUrl": "/archive/case-036.jpg",
    "thumbnailUrl": "/archive/thumbs/case-036.jpg",
    "galleryUrls": [
      "/archive/case-036-1.jpg",
      "/archive/case-036-2.jpg",
      "/archive/case-036-3.jpg"
    ],
    "excerpt": "Reportage fotogiornalistico che documenta le storie di donne pakistane sopravvissute ad aggressioni con l'acido; l'indagine scardina il silenzio sui delitti d'onore e sulle ritorsi..."
  },
  {
    "id": "caso-037",
    "number": "037",
    "title": "State of Grace",
    "authorOrSubject": "Doug Auld",
    "year": "2006",
    "type": "photo",
    "segno": "Ustione da fuoco",
    "segnoTags": [
      "Ustione da fuoco"
    ],
    "tipologia": "Mostra / Installazione",
    "tono": "Intimo / Confessionale",
    "tipoDiMedia": "Pittura",
    "categorie": "Traumi",
    "clusterTags": [
      "Traumi",
      "Medici"
    ],
    "stileVisivo": "Ritrattistica a olio su tela di grande formato; stile fotorealistico e chiaroscurale che esalta i volti segnati da profonde ustioni.",
    "sintesiConcettuale": "Serie di intensi ritratti a olio dedicata a giovani sopravvissuti a gravi ustioni, nata dalla collaborazione con un centro grandi ustionati, per restituire valore al vissuto e alla dignità di ciascun soggetto.",
    "notes": "Realizzato in collaborazione con il Burn Center del Saint Barnabas Medical Center nel New Jersey; l'opera 'Shayla' è stata finalista all'Outwin Boochever Portrait Competition 2006 presso la Smithsonian National Portrait Gallery.",
    "externalLink": "https://www.dougauld.com/state-of-grace",
    "driveLink": "https://drive.google.com/drive/folders/1jurTy3rAY6vXxykNzgpP6pLS4VQktUfT",
    "mascherabilita": "Non mascherabile",
    "accettabilitaSociale": "Socialmente non accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "ne provo vergogna",
    "imageUrl": "/archive/case-037.jpg",
    "thumbnailUrl": "/archive/thumbs/case-037.jpg",
    "galleryUrls": [
      "/archive/case-037-1.jpg",
      "/archive/case-037-2.jpg"
    ],
    "excerpt": "Serie di intensi ritratti a olio dedicata a giovani sopravvissuti a gravi ustioni, nata dalla collaborazione con un centro grandi ustionati, per restituire valore al vissuto e alla..."
  },
  {
    "id": "caso-038",
    "number": "038",
    "title": "Living with the Enemy",
    "authorOrSubject": "Donna Ferrato",
    "year": "1991",
    "type": "photo",
    "segno": "Cicatrici chirurgiche",
    "segnoTags": [
      "Cicatrici chirurgiche"
    ],
    "tipologia": "Pubblicazione Editoriale",
    "tono": "Politico / Rivendicativo",
    "tipoDiMedia": "Fotografia",
    "categorie": "Traumi",
    "clusterTags": [
      "Traumi",
      "Sistemici"
    ],
    "stileVisivo": "Fotogiornalismo documentario in bianco e nero; scatti diretti, dinamici e non filtrati in contesti domestici, pronto soccorso e centri antiviolenza.",
    "sintesiConcettuale": "Indagine fotogiornalistica pionieristica che documenta la violenza domestica e i traumi fisici inflitti alle donne, rompendo il tabù dell'abuso intrafamiliare.",
    "notes": "Pubblicato nel 1991 da Aperture e conservato nell'archivio dell'International Center of Photography (ICP); progetto fondamentale per la sensibilizzazione sui centri antiviolenza e i diritti delle donne.",
    "externalLink": "https://www.icp.org/browse/archive/collections/donna-ferrato-living-with-the-enemy",
    "driveLink": "https://drive.google.com/drive/folders/1L74EqUspOfA5pejsmPUoqDhtaciJCH7P",
    "mascherabilita": "Mascherabile",
    "accettabilitaSociale": "Socialmente non accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "ne provo vergogna",
    "imageUrl": "/archive/case-038.jpg",
    "thumbnailUrl": "/archive/thumbs/case-038.jpg",
    "galleryUrls": [
      "/archive/case-038-1.jpg",
      "/archive/case-038-2.jpg"
    ],
    "excerpt": "Indagine fotogiornalistica pionieristica che documenta la violenza domestica e i traumi fisici inflitti alle donne, rompendo il tabù dell'abuso intrafamiliare."
  },
  {
    "id": "caso-087",
    "number": "087",
    "title": "SEGNO E STEREOTIPO",
    "authorOrSubject": "Asia Benedetti / Edizioni Ca' Foscari",
    "year": "2025",
    "type": "photo",
    "segno": "Traccia teorica",
    "ambitoTeorico": "Semiotica del segno",
    "segnoTags": [
      "Traccia teorica"
    ],
    "tipologia": "Pubblicazione Editoriale",
    "tono": "Politico / Rivendicativo",
    "tipoDiMedia": "Testo / Saggio",
    "categorie": "Sistemici",
    "clusterTags": [
      "Sistemici",
      "Traumi"
    ],
    "stileVisivo": "Saggio accademico e teoria critica; analisi semiotica della codifica culturale e degli stereotipi narrativi associati al corpo segnato.",
    "sintesiConcettuale": "Nelle narrazioni tradizionali (cinema, TV, fiabe) il corpo segnato è un testo scritto dagli eventi o dagli altri sul personaggio: il cattivo segnato dalla sfortuna o dalla violenza, la vittima marchiata. Chi guarda decodifica il segno con uno stereotipo preconfezionato.",
    "notes": "Studio semiotico pubblicato nei Quaderni di Venezia Arti (2025); decostruzione della narrazione egemonica e dello sguardo oggettificante sul corpo imperfetto.",
    "externalLink": "https://edizionicafoscari.unive.it/media/pdf/books/979-12-5742-001-7/979-12-5742-001-7-ch-10.pdf",
    "driveLink": "",
    "mascherabilita": "—",
    "accettabilitaSociale": "—",
    "percezioneSociale": "—",
    "percezioneEstetica": "—",
    "valenzaDelRicordo": "—",
    "sensoDiVergogna": "—",
    "imageUrl": "/archive/case-087.jpg",
    "thumbnailUrl": "/archive/thumbs/case-087.jpg",
    "galleryUrls": [],
    "excerpt": "Nelle narrazioni tradizionali (cinema, TV, fiabe) il corpo segnato è un testo scritto dagli eventi o dagli altri sul personaggio: il cattivo segnato dalla sfortuna o dalla violenza...",
    "microKeyword": "STEREOTIPO"
  },
  {
    "id": "caso-039",
    "number": "039",
    "title": "Cicatrici",
    "authorOrSubject": "Niccolò Zorza / Perimetro",
    "year": "2024",
    "type": "photo",
    "segno": "Cicatrici da incidenti",
    "segnoTags": [
      "Cicatrici da incidenti",
      "Cicatrici chirurgiche"
    ],
    "tipologia": "Serie Fotografica",
    "tono": "Intimo / Confessionale",
    "tipoDiMedia": "Fotografia",
    "categorie": "Traumi",
    "clusterTags": [
      "Traumi",
      "Medici"
    ],
    "stileVisivo": "Ritrattistica a figura intera e mezzobusto in bianco; illuminazione da studio curata che valorizza la matericità cutanea e lo sguardo dei soggetti.",
    "sintesiConcettuale": "Progetto documentario corale che attraverso il ritratto fotografico e le parole dirette dei protagonisti valorizza le cicatrici fisiche e interiori come segni di resilienza e rinascita.",
    "notes": "Pubblicato sulla testata visiva indipendente Perimetro nella rubrica 'fuoriperimetro'; raccoglie testimonianze dirette e ritratti che trasformano il trauma corporeo in unicità ed espressione identitaria.",
    "externalLink": "https://perimetro.eu/fuoriperimetro/cicatrici/",
    "driveLink": "https://drive.google.com/drive/folders/15p8aW3DobRSlnJyorOqNI9EySx72Nfv_",
    "mascherabilita": "Mascherabile",
    "accettabilitaSociale": "Socialmente accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "non ne provo vergogna",
    "imageUrl": "/archive/case-039.jpg",
    "thumbnailUrl": "/archive/thumbs/case-039.jpg",
    "galleryUrls": [
      "/archive/case-039-1.jpg",
      "/archive/case-039-2.jpg",
      "/archive/case-039-3.jpg"
    ],
    "excerpt": "Progetto documentario corale che attraverso il ritratto fotografico e le parole dirette dei protagonisti valorizza le cicatrici fisiche e interiori come segni di resilienza e rinas..."
  },
  {
    "id": "caso-040",
    "number": "040",
    "title": "Changing the Conversation",
    "authorOrSubject": "Sujata Setia",
    "year": "2021",
    "type": "photo",
    "segno": "Ustione da fuoco",
    "segnoTags": [
      "Ustione da fuoco",
      "Ustione da acido"
    ],
    "tipologia": "Serie Fotografica",
    "tono": "Intimo / Confessionale",
    "tipoDiMedia": "Fotografia",
    "categorie": "Traumi",
    "clusterTags": [
      "Traumi"
    ],
    "stileVisivo": "Ritrattistica in luce naturale; pose intime ed eleganti che mettono in risalto la bellezza e la fierezza dei corpi segnati da ustioni e cicatrici.",
    "sintesiConcettuale": "Serie fotografica che ritrae persone con cicatrici estese, ustioni e differenze corporee visibili, sovvertendo gli standard convenzionali di bellezza e promuovendo l'inclusione.",
    "notes": "Progetto fotografico pluripremiato a livello internazionale nato per combattere la discriminazione estetica e ridefinire la rappresentazione delle differenze corporee nei media e nell'arte.",
    "externalLink": "https://sujatasetia.com/changing-the-conversation",
    "driveLink": "https://drive.google.com/drive/folders/1N9ia01QUiMh8zJqFbIE4BaDh08I7zwyS",
    "mascherabilita": "Non mascherabile",
    "accettabilitaSociale": "Socialmente non accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come attraente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "non ne provo vergogna",
    "imageUrl": "/archive/case-040.jpg",
    "thumbnailUrl": "/archive/thumbs/case-040.jpg",
    "galleryUrls": [
      "/archive/case-040-1.jpg",
      "/archive/case-040-2.jpg",
      "/archive/case-040-3.jpg"
    ],
    "excerpt": "Serie fotografica che ritrae persone con cicatrici estese, ustioni e differenze corporee visibili, sovvertendo gli standard convenzionali di bellezza e promuovendo l'inclusione."
  },
  {
    "id": "caso-088",
    "number": "088",
    "title": "RIBALTAMENTO SEMIOTICO DEL CORPO",
    "authorOrSubject": "Asia Benedetti / Edizioni Ca' Foscari",
    "year": "2025",
    "type": "photo",
    "segno": "Traccia teorica",
    "ambitoTeorico": "Semiotica del segno",
    "segnoTags": [
      "Traccia teorica"
    ],
    "tipologia": "Pubblicazione Editoriale",
    "tono": "Poetico / Evocativo",
    "tipoDiMedia": "Testo / Saggio",
    "categorie": "Trasformazione",
    "clusterTags": [
      "Trasformazione",
      "Sistemici"
    ],
    "stileVisivo": "Saggio critico e semiotica del corpo; teoria dell'enunciazione corporea, riappropriazione del testo cutaneo e autodeterminazione visiva.",
    "sintesiConcettuale": "Quando il soggetto sceglie di non coprire la cicatrice, la semiotica del corpo si capovolge. Chi la porta diventa il soggetto dell'enunciazione: riprende in mano il proprio testo cutaneo e lo riscrive. Il segno smette di denotare la violenza subita (passato) e comincia a denotare la sovranità sul proprio corpo (presente e futuro).",
    "notes": "Contributo in 'Reading the Void: Nil Yalter\\'s Semiotics of the Body' (2025); trasformazione del segno cutaneo da marchio passivo a testo attivo di sovranità identitaria.",
    "externalLink": "https://edizionicafoscari.unive.it/media/pdf/books/979-12-5742-001-7/979-12-5742-001-7-ch-10.pdf",
    "driveLink": "",
    "mascherabilita": "—",
    "accettabilitaSociale": "—",
    "percezioneSociale": "—",
    "percezioneEstetica": "—",
    "valenzaDelRicordo": "—",
    "sensoDiVergogna": "—",
    "imageUrl": "/archive/case-088.jpg",
    "thumbnailUrl": "/archive/thumbs/case-088.jpg",
    "galleryUrls": [],
    "excerpt": "Quando il soggetto sceglie di non coprire la cicatrice, la semiotica del corpo si capovolge. Chi la porta diventa il soggetto dell'enunciazione: riprende in mano il proprio testo c...",
    "microKeyword": "RIBALTAMENTO"
  },
  {
    "id": "caso-041",
    "number": "041",
    "title": "Survivors",
    "authorOrSubject": "Ken Hermann",
    "year": "2014",
    "type": "photo",
    "segno": "Ustione da acido",
    "segnoTags": [
      "Ustione da acido"
    ],
    "tipologia": "Serie Fotografica",
    "tono": "Politico / Rivendicativo",
    "tipoDiMedia": "Fotografia",
    "categorie": "Traumi",
    "clusterTags": [
      "Traumi"
    ],
    "stileVisivo": "Ritrattistica frontale in esterni con luce naturale; inquadrature a mezzo busto e primo piano che restituiscono forza, fierezza e dignità ai volti segnati.",
    "sintesiConcettuale": "Serie di ritratti che documenta le donne e gli uomini sopravvissuti ad attacchi con l'acido in Bangladesh, trasformando la visibilità delle ferite in un atto di denuncia sociale.",
    "notes": "Serie fotografica realizzata a Dhaka in collaborazione con Acid Survivors Foundation (ASF) per sensibilizzare l'opinione pubblica globale e denunciare la violenza di genere.",
    "externalLink": "https://kenhermann.dk/portfolio/survivors/",
    "driveLink": "https://drive.google.com/drive/folders/1JtY62AgVsyZzg4i-DwJm3jr4oi8NRo8F",
    "mascherabilita": "Non mascherabile",
    "accettabilitaSociale": "Socialmente non accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "ne provo vergogna",
    "imageUrl": "/archive/case-041.jpg",
    "thumbnailUrl": "/archive/thumbs/case-041.jpg",
    "galleryUrls": [
      "/archive/case-041-1.jpg",
      "/archive/case-041-2.jpg",
      "/archive/case-041-3.jpg",
      "/archive/case-041-4.jpg"
    ],
    "excerpt": "Serie di ritratti che documenta le donne e gli uomini sopravvissuti ad attacchi con l'acido in Bangladesh, trasformando la visibilità delle ferite in un atto di denuncia sociale."
  },
  {
    "id": "caso-042",
    "number": "042",
    "title": "Without a Face",
    "authorOrSubject": "Izabella Demavlys",
    "year": "2009",
    "type": "photo",
    "segno": "Ustione da acido",
    "segnoTags": [
      "Ustione da acido"
    ],
    "tipologia": "Serie Fotografica",
    "tono": "Politico / Rivendicativo",
    "tipoDiMedia": "Fotografia",
    "categorie": "Traumi",
    "clusterTags": [
      "Traumi"
    ],
    "stileVisivo": "Ritrattistica in medio e grande formato in luce soffusa; inquadrature ravvicinate e intime che mettono in risalto la femminilità, lo sguardo e l'umanità oltre le cicatrici.",
    "sintesiConcettuale": "Progetto ritrattistico dedicato alle donne pakistane sfigurate da attacchi con l'acido, volto a restituire dignità, identità e visibilità a chi viene emarginato dalla società per le proprie ferite.",
    "notes": "Serie documentaria a lungo termine esposta a livello internazionale (inclusa la mostra al Griffin Museum of Photography) per promuovere la consapevolezza sui diritti umani e la ricostruzione chirurgica.",
    "externalLink": "https://griffinmuseum.org/show/isabella-demavlys/",
    "driveLink": "https://drive.google.com/drive/folders/12sptYlQ9t3BiTFa1gyuozvUWMx1ixeAq",
    "mascherabilita": "Non mascherabile",
    "accettabilitaSociale": "Socialmente non accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "ne provo vergogna",
    "imageUrl": "/archive/case-042.jpg",
    "thumbnailUrl": "/archive/thumbs/case-042.jpg",
    "galleryUrls": [
      "/archive/case-042-1.jpg",
      "/archive/case-042-2.jpg"
    ],
    "excerpt": "Progetto ritrattistico dedicato alle donne pakistane sfigurate da attacchi con l'acido, volto a restituire dignità, identità e visibilità a chi viene emarginato dalla società per l..."
  },
  {
    "id": "caso-089",
    "number": "089",
    "title": "PELLE COME SEGNO DI PRESTAZIONE",
    "authorOrSubject": "Byung-Chul Han",
    "year": "2010",
    "type": "photo",
    "segno": "Traccia teorica",
    "ambitoTeorico": "Sociologia & Biopolitica",
    "segnoTags": [
      "Traccia teorica"
    ],
    "tipologia": "Pubblicazione Editoriale",
    "tono": "Politico / Rivendicativo",
    "tipoDiMedia": "Testo / Saggio",
    "categorie": "Sistemici",
    "clusterTags": [
      "Sistemici",
      "Trasformazione"
    ],
    "stileVisivo": "Saggio filosofico e teoria critica; analisi della società della prestazione, imperativo dell'autodisciplina e mercificazione del corpo liscio.",
    "sintesiConcettuale": "La pelle contemporanea è caricata dell'obbligo di attestare efficienza e prestazione. L'epidermide liscia e tonica segnala giovinezza, disciplina morale e idoneità produttiva, mentre i segni dell'invecchiamento generano angoscia espellendo il corpo dalle dinamiche di mercato.",
    "notes": "Riflessione filosofica ispirata a Byung-Chul Han e alla gaze theory; decostruzione del corpo neoliberale in cui l'epidermide levigata diviene feticcio di produttività e conformità sistemica.",
    "externalLink": "https://www.edizioninottetempo.it/media/productattach/f/_/f._u._busan_alias_-_il_manifesto.pdf",
    "driveLink": "",
    "mascherabilita": "—",
    "accettabilitaSociale": "—",
    "percezioneSociale": "—",
    "percezioneEstetica": "—",
    "valenzaDelRicordo": "—",
    "sensoDiVergogna": "—",
    "imageUrl": "/archive/case-089.jpg",
    "thumbnailUrl": "/archive/thumbs/case-089.jpg",
    "galleryUrls": [],
    "excerpt": "La pelle contemporanea è caricata dell'obbligo di attestare efficienza e prestazione. L'epidermide liscia e tonica segnala giovinezza, disciplina morale e idoneità produttiva, ment...",
    "microKeyword": "PRESTAZIONE"
  },
  {
    "id": "caso-043",
    "number": "043",
    "title": "Sacred Transformations",
    "authorOrSubject": "Niraj Gera",
    "year": "2017",
    "type": "photo",
    "segno": "Ustione da acido",
    "segnoTags": [
      "Ustione da acido"
    ],
    "tipologia": "Serie Fotografica",
    "tono": "Politico / Rivendicativo",
    "tipoDiMedia": "Fotografia",
    "categorie": "Traumi",
    "clusterTags": [
      "Traumi"
    ],
    "stileVisivo": "Fotografia sociale a colori e bianco e nero; ritratti empatici catturati con luce naturale e sguardi diretti che celebrano forza interiore e riappropriazione della vita.",
    "sintesiConcettuale": "Serie fotografica e documentaria che racconta il percorso di rinascita, accettazione e coraggio delle sopravvissute ad attacchi con l'acido in India, celebrando la sacralità e la bellezza interiore di ogni donna.",
    "notes": "Campagna visiva e di attivismo sociale ampiamente esposta in India e internazionalmente, orientata all'empowerment e all'integrazione socio-lavorativa delle sopravvissute.",
    "externalLink": "https://nirajgera.com",
    "driveLink": "https://drive.google.com/drive/folders/1rPlKoe5LvHWYZDGFn9fUP1yoBSI_j5_h",
    "mascherabilita": "Non mascherabile",
    "accettabilitaSociale": "Socialmente non accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "non ne provo vergogna",
    "imageUrl": "/archive/case-043.jpg",
    "thumbnailUrl": "/archive/thumbs/case-043.jpg",
    "galleryUrls": [
      "/archive/case-043-1.jpg",
      "/archive/case-043-2.jpg",
      "/archive/case-043-3.jpg"
    ],
    "excerpt": "Serie fotografica e documentaria che racconta il percorso di rinascita, accettazione e coraggio delle sopravvissute ad attacchi con l'acido in India, celebrando la sacralità e la b..."
  },
  {
    "id": "caso-044",
    "number": "044",
    "title": "Tear Couture Lookbook",
    "authorOrSubject": "Rankin / Acid Survivors Trust International (ASTi)",
    "year": "2024",
    "type": "photo",
    "segno": "Ustione da acido",
    "segnoTags": [
      "Ustione da acido"
    ],
    "tipologia": "Pubblicazione Editoriale",
    "tono": "Politico / Rivendicativo",
    "tipoDiMedia": "Fotografia",
    "categorie": "Traumi",
    "clusterTags": [
      "Traumi",
      "Sistemici"
    ],
    "stileVisivo": "Fotografia di moda e alta sartoria sovvertita; capi lacerati e bruciati indossati con fiero portamento da sopravvissute ad attacchi con acido.",
    "sintesiConcettuale": "Campagna di sensibilizzazione di ASTi che utilizza il formato di un catalogo di moda per denunciare il legame tra l'uso di acido nell'industria tessile e gli attacchi con l'acido nel mondo. La protagonista degli scatti è Patricia LeFranc, sopravvissuta a un attacco. L'obiettivo del progetto è spingere il settore della moda verso una gestione più sicura e responsabile di queste sostanze tossiche.",
    "notes": "Progetto realizzato dal celebre fotografo Rankin per ASTi (Acid Survivors Trust International), premiato al The One Show per aver collegato la violenza dell'acido alla filiera della moda.",
    "externalLink": "https://www.oneclub.org/awards/theoneshow/-award/51997/tear-couture-lookbook/",
    "driveLink": "https://drive.google.com/drive/folders/1vbdfu9NW55OCcJckV4wxk-XOoGBzGxls",
    "mascherabilita": "Non mascherabile",
    "accettabilitaSociale": "Socialmente non accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "ne provo vergogna",
    "imageUrl": "/archive/case-044.jpg",
    "thumbnailUrl": "/archive/thumbs/case-044.jpg",
    "galleryUrls": [
      "/archive/case-044-1.jpg",
      "/archive/case-044-2.jpg"
    ],
    "excerpt": "Campagna di sensibilizzazione di ASTi che utilizza il formato di un catalogo di moda per denunciare il legame tra l'uso di acido nell'industria tessile e gli attacchi con l'acido n..."
  },
  {
    "id": "caso-090",
    "number": "090",
    "title": "IL DOPPIO STANDARD DELL'INVECCHIAMENTO",
    "authorOrSubject": "Susan Sontag",
    "year": "1972",
    "type": "photo",
    "segno": "Traccia teorica",
    "ambitoTeorico": "Sociologia & Biopolitica",
    "segnoTags": [
      "Traccia teorica"
    ],
    "tipologia": "Pubblicazione Editoriale",
    "tono": "Politico / Rivendicativo",
    "tipoDiMedia": "Testo / Saggio",
    "categorie": "Sistemici",
    "clusterTags": [
      "Sistemici",
      "Trasformazione"
    ],
    "stileVisivo": "Saggio femminista e critica culturale; decostruzione della disparità di genere nei canoni estetici e nell'attribuzione di valore sociale al corpo che invecchia.",
    "sintesiConcettuale": "La cultura occidentale applica un doppio standard al tempo sul corpo: nell'uomo i segni d'invecchiamento conferiscono autorità e fascino, mentre nella donna decretano un declino inaccettabile, subordinandone il valore alla sola giovinezza.",
    "notes": "Saggio cardine 'The Double Standard of Aging' (1972); analisi critica sul legame tra patriarcato, sguardo sociale e svalutazione sistematica del corpo femminile maturo.",
    "externalLink": "https://www.ebsco.com/research-starters/social-sciences-and-humanities/politics-appearance",
    "driveLink": "",
    "mascherabilita": "—",
    "accettabilitaSociale": "—",
    "percezioneSociale": "—",
    "percezioneEstetica": "—",
    "valenzaDelRicordo": "—",
    "sensoDiVergogna": "—",
    "imageUrl": "/archive/case-090.jpg",
    "thumbnailUrl": "/archive/thumbs/case-090.jpg",
    "galleryUrls": [],
    "excerpt": "La cultura occidentale applica un doppio standard al tempo sul corpo: nell'uomo i segni d'invecchiamento conferiscono autorità e fascino, mentre nella donna decretano un declino in...",
    "microKeyword": "INVECCHIAMENTO"
  },
  {
    "id": "caso-045",
    "number": "045",
    "title": "Acid Attack Survivors in India",
    "authorOrSubject": "Lela Edgar / Make Love Not Scars",
    "year": "2016",
    "type": "photo",
    "segno": "Ustione da acido",
    "segnoTags": [
      "Ustione da acido"
    ],
    "tipologia": "Serie Fotografica",
    "tono": "Politico / Rivendicativo",
    "tipoDiMedia": "Fotografia",
    "categorie": "Traumi",
    "clusterTags": [
      "Traumi"
    ],
    "stileVisivo": "Ritrattistica a colori in luce naturale ambientata nei rifugi di Nuova Delhi; primi piani intimi e intensi che catturano espressioni di determinazione e sorellanza.",
    "sintesiConcettuale": "Serie fotografica e reportage che racconta la resilienza delle donne sopravvissute ad attacchi con acido a Nuova Delhi, focalizzandosi sul percorso di recupero psicofisico e sulla battaglia per il bando della vendita libera di acido.",
    "notes": "Reportage realizzato per Global Citizen in collaborazione con l'ONG Make Love Not Scars, mirato a denunciare il fenomeno degli attacchi con acido in India e sostenere la riabilitazione medica ed economica.",
    "externalLink": "https://www.globalcitizen.org/en/content/acid-attack-survivors-in-india-interview/",
    "driveLink": "https://drive.google.com/drive/folders/1Nj4t0ewtO8UO8DsXJUGE2UETQ7Le9igG",
    "mascherabilita": "Non mascherabile",
    "accettabilitaSociale": "Socialmente non accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come attraente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "ne provo vergogna",
    "imageUrl": "/archive/case-045.jpg",
    "thumbnailUrl": "/archive/thumbs/case-045.jpg",
    "galleryUrls": [
      "/archive/case-045-1.jpg",
      "/archive/case-045-2.jpg"
    ],
    "excerpt": "Serie fotografica e reportage che racconta la resilienza delle donne sopravvissute ad attacchi con acido a Nuova Delhi, focalizzandosi sul percorso di recupero psicofisico e sulla ..."
  },
  {
    "id": "caso-046",
    "number": "046",
    "title": "Brûlés",
    "authorOrSubject": "Clément Marion & Clélia Lebreton",
    "year": "2021",
    "type": "photo",
    "segno": "Ustione da fuoco",
    "segnoTags": [
      "Ustione da fuoco",
      "Cicatrici chirurgiche"
    ],
    "tipologia": "Pubblicazione Editoriale",
    "tono": "Intimo / Confessionale",
    "tipoDiMedia": "Fotografia",
    "categorie": "Traumi",
    "clusterTags": [
      "Traumi",
      "Medici"
    ],
    "stileVisivo": "Ritrattistica realizzata in ferrotipia; resa materica, argentea e che sublima la pelle ustionata e le cicatrici in tracce di luce.",
    "sintesiConcettuale": "Libro e progetto fotografico che ritrae persone sopravvissute a gravi ustioni; la delicatezza del processo trasforma la pelle ferita in superficie preziosa e favorisce la riconciliazione con il proprio corpo.",
    "notes": "Opera editoriale e artistica nata dall'incontro tra il fotografo Clément Marion e Clélia Lebreton (sopravvissuta e attivista), concepita come percorso terapeutico e pubblicata in Francia.",
    "externalLink": "https://lintervalle.blog/2021/04/16/de-la-brulure-aux-chemins-de-paix-par-clement-marion-photographe-et-clelia-lebreton-messagere/",
    "driveLink": "https://drive.google.com/drive/folders/1xxtR4yDUejl8XV1gygIkUwVJjnnUbKLX",
    "mascherabilita": "Non mascherabile",
    "accettabilitaSociale": "Socialmente non accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "ne provo vergogna",
    "imageUrl": "/archive/case-046.jpg",
    "thumbnailUrl": "/archive/thumbs/case-046.jpg",
    "galleryUrls": [
      "/archive/case-046-1.jpg",
      "/archive/case-046-2.jpg"
    ],
    "excerpt": "Libro e progetto fotografico che ritrae persone sopravvissute a gravi ustioni; la delicatezza del processo trasforma la pelle ferita in superficie preziosa e favorisce la riconcili..."
  },
  {
    "id": "caso-047",
    "number": "047",
    "title": "The Skin I'm In (Carol Mayer)",
    "authorOrSubject": "Brian Cassey",
    "year": "2020",
    "type": "photo",
    "segno": "Ustione da fuoco",
    "segnoTags": [
      "Ustione da fuoco"
    ],
    "tipologia": "Serie Fotografica",
    "tono": "Intimo / Confessionale",
    "tipoDiMedia": "Fotografia",
    "categorie": "Traumi",
    "clusterTags": [
      "Traumi",
      "Medici"
    ],
    "stileVisivo": "Ritrattistica a figura intera e nudo scultoreo; luce soffusa e avvolgente che mette a nudo la pelle interamente segnata da ustioni.",
    "sintesiConcettuale": "Ritratto intimo di Carol Mayer, sopravvissuta con l'85% del corpo ustionato a un incendio domestico; l'opera celebra l'accettazione radicale come fonte di pura bellezza e forza vitale.",
    "notes": "Fotografia vincitrice e selezionata tra i finalisti del prestigioso premio Portrait of Humanity 2020 del British Journal of Photography e del World Photography Organisation.",
    "externalLink": "https://www.abc.net.au/news/2020-06-12/carol-mayer-photograph-shortlisted-in-portrait-of-humanity/12335282",
    "driveLink": "https://drive.google.com/drive/folders/1F08-OFPTJ9cIBYmB7m52asPdazwtUmET",
    "mascherabilita": "Non mascherabile",
    "accettabilitaSociale": "Socialmente non accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come attraente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "non ne provo vergogna",
    "imageUrl": "/archive/case-047.jpg",
    "thumbnailUrl": "/archive/thumbs/case-047.jpg",
    "galleryUrls": [
      "/archive/case-047-1.jpg",
      "/archive/case-047-2.jpg"
    ],
    "excerpt": "Ritratto intimo di Carol Mayer, sopravvissuta con l'85% del corpo ustionato a un incendio domestico; l'opera celebra l'accettazione radicale come fonte di pura bellezza e forza vit..."
  },
  {
    "id": "caso-091",
    "number": "091",
    "title": "MEDICALIZZAZIONE DELL'ESTETICA",
    "authorOrSubject": "Dana Alsaialy & Dino Numerato",
    "year": "2024",
    "type": "photo",
    "segno": "Traccia teorica",
    "ambitoTeorico": "Sociologia & Biopolitica",
    "segnoTags": [
      "Traccia teorica"
    ],
    "tipologia": "Pubblicazione Editoriale",
    "tono": "Clinico / Scientifico",
    "tipoDiMedia": "Testo / Saggio",
    "categorie": "Sistemici",
    "clusterTags": [
      "Sistemici",
      "Medici"
    ],
    "stileVisivo": "Studio sociologico ed etnografia clinica; analisi critica dei confini tra dermatologia clinica ed estetica, autodiagnosi e agency del paziente consumatore.",
    "sintesiConcettuale": "I normali processi fisiologici dell'invecchiamento e le variazioni cutanee vengono ridefiniti come patologie da trattare. I pazienti, guidati da guru dello skincare e trend digitali, assumono un ruolo attivo nell'autodiagnosi e nella richiesta di interventi correttivi.",
    "notes": "Ricerca sociologica pubblicata su ResearchGate; indaga il paradosso tra la medicalizzazione della bellezza e l'autonomia decisionale del paziente nella dermatologia contemporanea.",
    "externalLink": "https://www.researchgate.net/publication/390548602_Medicalizing_aesthetics_or_beautifying_illness_Exploring_the_absence_of_diagnosis_and_the_centrality_of_patient_autonomy_in_dermatology",
    "driveLink": "",
    "mascherabilita": "—",
    "accettabilitaSociale": "—",
    "percezioneSociale": "—",
    "percezioneEstetica": "—",
    "valenzaDelRicordo": "—",
    "sensoDiVergogna": "—",
    "imageUrl": "/archive/case-091.jpg",
    "thumbnailUrl": "/archive/thumbs/case-091.jpg",
    "galleryUrls": [],
    "excerpt": "I normali processi fisiologici dell'invecchiamento e le variazioni cutanee vengono ridefiniti come patologie da trattare. I pazienti, guidati da guru dello skincare e trend digital...",
    "microKeyword": "MEDICALIZZAZIONE"
  },
  {
    "id": "caso-048",
    "number": "048",
    "title": "New Icons: Portraits of Burn Survivors",
    "authorOrSubject": "Grace Athena Flott",
    "year": "2023",
    "type": "photo",
    "segno": "Ustione da fuoco",
    "segnoTags": [
      "Ustione da fuoco"
    ],
    "tipologia": "Mostra / Installazione",
    "tono": "Intimo / Confessionale",
    "tipoDiMedia": "Pittura",
    "categorie": "Traumi",
    "clusterTags": [
      "Traumi",
      "Medici"
    ],
    "stileVisivo": "Ritrattistica a olio su pannelli di alluminio e body maps con foglia d'oro; sguardi fieri che celebrano le cicatrici.",
    "sintesiConcettuale": "Nato dall'esperienza personale dell'artista sopravvissuta a un incendio, il progetto ritrae persone con cicatrici da ustione, sottraendole allo sguardo clinico per celebrarne resilienza e dignità.",
    "notes": "Progetto sostenuto dal Seattle Office of Arts & Culture esposto al Pier 69 e Hologram Gallery; include ritratti ad olio a figura intera e mappature astratte delle cicatrici.",
    "externalLink": "https://www.graceathenaflott.com/selected-work/new-icons-burn-survivor-portraits",
    "driveLink": "https://drive.google.com/drive/folders/1H-B9PjXcF4in2RZW3MUFi53l3hO3njId",
    "mascherabilita": "Non mascherabile",
    "accettabilitaSociale": "Socialmente non accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "non ne provo vergogna",
    "imageUrl": "/archive/case-048.jpg",
    "thumbnailUrl": "/archive/thumbs/case-048.jpg",
    "galleryUrls": [
      "/archive/case-048-1.jpg",
      "/archive/case-048-2.jpg",
      "/archive/case-048-3.jpg",
      "/archive/case-048-4.jpg"
    ],
    "excerpt": "Nato dall'esperienza personale dell'artista sopravvissuta a un incendio, il progetto ritrae persone con cicatrici da ustione, sottraendole allo sguardo clinico per celebrarne resil..."
  },
  {
    "id": "caso-049",
    "number": "049",
    "title": "Scars & Stories",
    "authorOrSubject": "David Woolfall",
    "year": "2015",
    "type": "photo",
    "segno": "Cicatrici da incidenti",
    "segnoTags": [
      "Cicatrici da incidenti",
      "Cicatrici chirurgiche"
    ],
    "tipologia": "Serie Fotografica",
    "tono": "Intimo / Confessionale",
    "tipoDiMedia": "Fotografia",
    "categorie": "Traumi",
    "clusterTags": [
      "Traumi",
      "Medici"
    ],
    "stileVisivo": "Ritrattistica fotografica in luce naturale accompagnata da narrazioni scritte personali; estetica che privilegia la dimensione memoriale.",
    "sintesiConcettuale": "Serie fotografica e archivio narrativo che ritrae persone con cicatrici visibili, invitandole a documentare la propria esperienza: la cicatrice diviene portale di memoria e testimonianza del percorso di guarigione.",
    "notes": "Progetto avviato a Londra dal fotografo David Woolfall per creare una monografia e una galleria aperta di ritratti e memorie sul rapporto intimo tra ferita fisica e identità.",
    "externalLink": "https://www.davidwoolfall.com/scars-stories",
    "driveLink": "https://drive.google.com/drive/folders/1NWGy8Pi6vEdudoEnZDYCguYPKOm88pFp",
    "mascherabilita": "Mascherabile",
    "accettabilitaSociale": "Socialmente accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "non ne provo vergogna",
    "imageUrl": "/archive/case-049.jpg",
    "thumbnailUrl": "/archive/thumbs/case-049.jpg",
    "galleryUrls": [
      "/archive/case-049-1.jpg",
      "/archive/case-049-2.jpg",
      "/archive/case-049-3.jpg",
      "/archive/case-049-4.jpg"
    ],
    "excerpt": "Serie fotografica e archivio narrativo che ritrae persone con cicatrici visibili, invitandole a documentare la propria esperienza: la cicatrice diviene portale di memoria e testimo..."
  },
  {
    "id": "caso-092",
    "number": "092",
    "title": "LINGUAGGIO BELLICO NEL BEAUTY",
    "authorOrSubject": "IntechOpen",
    "year": "2025",
    "type": "photo",
    "segno": "Traccia teorica",
    "ambitoTeorico": "Sociologia & Biopolitica",
    "segnoTags": [
      "Traccia teorica"
    ],
    "tipologia": "Pubblicazione Editoriale",
    "tono": "Politico / Rivendicativo",
    "tipoDiMedia": "Testo / Saggio",
    "categorie": "Trasformazione",
    "clusterTags": [
      "Trasformazione",
      "Medici"
    ],
    "stileVisivo": "Saggio critico e analisi del discorso pubblicitario; decostruzione della metafora bellica applicata all'invecchiamento e all'imperfezione cutanea.",
    "sintesiConcettuale": "Nei messaggi pubblicitari la pelle è narrata come un campo di battaglia: i segni dell'età, rughe e imperfezioni diventano nemici da combattere, attaccare ed eliminare.",
    "notes": "Capitolo accademico su IntechOpen; analisi critica della retorica militarizzata nel marketing cosmetico e della stigmatizzazione delle tracce dell'età.",
    "externalLink": "https://www.intechopen.com/online-first/1248819?",
    "driveLink": "",
    "mascherabilita": "—",
    "accettabilitaSociale": "—",
    "percezioneSociale": "—",
    "percezioneEstetica": "—",
    "valenzaDelRicordo": "—",
    "sensoDiVergogna": "—",
    "imageUrl": "/archive/case-092.jpg",
    "thumbnailUrl": "/archive/thumbs/case-092.jpg",
    "galleryUrls": [],
    "excerpt": "Nei messaggi pubblicitari la pelle è narrata come un campo di battaglia: i segni dell'età, rughe e imperfezioni diventano nemici da combattere, attaccare ed eliminare.",
    "microKeyword": "BELLICO"
  },
  {
    "id": "caso-050",
    "number": "050",
    "title": "Beauty Beyond Scars",
    "authorOrSubject": "The Phoblographer",
    "year": "2019",
    "type": "photo",
    "segno": "Cicatrici da incidenti",
    "segnoTags": [
      "Cicatrici da incidenti"
    ],
    "tipologia": "Serie Fotografica",
    "tono": "Intimo / Confessionale",
    "tipoDiMedia": "Fotografia",
    "categorie": "Traumi",
    "clusterTags": [
      "Traumi"
    ],
    "stileVisivo": "Ritrattistica in bianco e nero con composizioni empatiche incentrate sulla matericità delle cicatrici oltre il vissuto tragico.",
    "sintesiConcettuale": "Serie fotografica in bianco e nero che indaga il superamento del trauma attraverso il ritratto intimo, ridefinendo la cicatrice come segno di dignità e bellezza autentica.",
    "notes": "Approfondimento fotografico editoriale dedicato alla rappresentazione visiva delle cicatrici corporee, volto a superare lo stigma della tragedia attraverso la fotografia monocromatica.",
    "externalLink": "https://www.thephoblographer.com/2019/08/13/beauty-beyond-scars-uses-black-and-white-to-look-past-tragedy/",
    "driveLink": "https://drive.google.com/drive/folders/135ulaS69I4vBXfQbfpnBOebutYe4m10a",
    "mascherabilita": "Mascherabile",
    "accettabilitaSociale": "Socialmente accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come attraente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "non ne provo vergogna",
    "imageUrl": "/archive/case-050.jpg",
    "thumbnailUrl": "/archive/thumbs/case-050.jpg",
    "galleryUrls": [
      "/archive/case-050-1.jpg",
      "/archive/case-050-2.jpg",
      "/archive/case-050-3.jpg",
      "/archive/case-050-4.jpg"
    ],
    "excerpt": "Serie fotografica in bianco e nero che indaga il superamento del trauma attraverso il ritratto intimo, ridefinendo la cicatrice come segno di dignità e bellezza autentica."
  },
  {
    "id": "caso-051",
    "number": "051",
    "title": "The scars that write us",
    "authorOrSubject": "Yanyun Chen",
    "year": "2018",
    "type": "photo",
    "segno": "Cicatrici da incidenti",
    "segnoTags": [
      "Cicatrici da incidenti",
      "Cicatrici chirurgiche"
    ],
    "tipologia": "Mostra / Installazione",
    "tono": "Poetico / Evocativo",
    "tipoDiMedia": "Artefatto tessile",
    "categorie": "Traumi",
    "clusterTags": [
      "Traumi",
      "Trasformazione"
    ],
    "stileVisivo": "Disegni a carboncino e gesso su grande formato affiancati a rilievi in foglia d'oro su lastre d'acciaio; estetica scultorea incentrata sui cheloidi.",
    "sintesiConcettuale": "Installazione artistica che indaga le cicatrici cheloidi ereditarie nella storia familiare dell'autrice: il corpo diviene superficie memoriale e i rilievi dorati sublimano il trauma in preziosità genetica.",
    "notes": "Commissione per il President's Young Talents 2018 presso il Singapore Art Museum (SAM), vincitrice del People's Choice Award; esplora il confine tra ferita e identità ereditaria.",
    "externalLink": "https://www.yanyunchendrawings.com/thescarsthatwriteus",
    "driveLink": "https://drive.google.com/drive/folders/1kY4JpM4mTEXMXMeVpPyhSBajQhwQssLG",
    "mascherabilita": "Mascherabile",
    "accettabilitaSociale": "Socialmente accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "non ne provo vergogna",
    "imageUrl": "/archive/case-051.jpg",
    "thumbnailUrl": "/archive/thumbs/case-051.jpg",
    "galleryUrls": [
      "/archive/case-051-1.jpg",
      "/archive/case-051-2.jpg",
      "/archive/case-051-3.jpg",
      "/archive/case-051-4.jpg"
    ],
    "excerpt": "Installazione artistica che indaga le cicatrici cheloidi ereditarie nella storia familiare dell'autrice: il corpo diviene superficie memoriale e i rilievi dorati sublimano il traum..."
  },
  {
    "id": "caso-093",
    "number": "093",
    "title": "LINGUAGGIO TECNICO-SCIENTIFICO NEL BEAUTY",
    "authorOrSubject": "IntechOpen",
    "year": "2025",
    "type": "photo",
    "segno": "Traccia teorica",
    "ambitoTeorico": "Sociologia & Biopolitica",
    "segnoTags": [
      "Traccia teorica"
    ],
    "tipologia": "Pubblicazione Editoriale",
    "tono": "Clinico / Scientifico",
    "tipoDiMedia": "Testo / Saggio",
    "categorie": "Sistemici",
    "clusterTags": [
      "Sistemici",
      "Medici"
    ],
    "stileVisivo": "Studio sociologico e semiotica della comunicazione scientifica; ibridazione tra retorica cosmetica, dati quantitativi e lessico clinico-dermatologico.",
    "sintesiConcettuale": "La pubblicità cosmetica supera la sola promessa emotiva ibridando la cura con formule pseudoscientifiche (grafici, percentuali e termini clinici), trasformando l'invecchiamento cutaneo in un problema misurabile e risolvibile.",
    "notes": "Contributo teorico su IntechOpen; disamina dei meccanismi di medicalizzazione e quantificazione pseudoscientifica della cute nel mercato beauty contemporaneo.",
    "externalLink": "https://www.intechopen.com/online-first/1248819?",
    "driveLink": "",
    "mascherabilita": "—",
    "accettabilitaSociale": "—",
    "percezioneSociale": "—",
    "percezioneEstetica": "—",
    "valenzaDelRicordo": "—",
    "sensoDiVergogna": "—",
    "imageUrl": "/archive/case-093.jpg",
    "thumbnailUrl": "/archive/thumbs/case-093.jpg",
    "galleryUrls": [],
    "excerpt": "La pubblicità cosmetica supera la sola promessa emotiva ibridando la cura con formule pseudoscientifiche (grafici, percentuali e termini clinici), trasformando l'invecchiamento cut...",
    "microKeyword": "COSMESI"
  },
  {
    "id": "caso-052",
    "number": "052",
    "title": "Scarred for Life",
    "authorOrSubject": "Ted Meyer",
    "year": "2001",
    "type": "photo",
    "segno": "Cicatrici da incidenti",
    "segnoTags": [
      "Cicatrici da incidenti",
      "Cicatrici chirurgiche"
    ],
    "tipologia": "Mostra / Installazione",
    "tono": "Intimo / Confessionale",
    "tipoDiMedia": "Fotografia, Pittura",
    "categorie": "Traumi",
    "clusterTags": [
      "Traumi",
      "Medici"
    ],
    "stileVisivo": "Monostampe realizzate per contatto diretto con inchiostro sui corpi cicatrizzati, affiancate da ritratti fotografici e testimonianze.",
    "sintesiConcettuale": "Progetto artistico che preleva impronte grafiche dirette dalle cicatrici di persone operate o traumatizzate, trasformando eventi corporei dolorosi in opere d'arte visive.",
    "notes": "Progetto ventennale che unisce stampe dirette su carta, fotografia e testimonianze di persone segnate da interventi chirurgici e traumi, esposto in ospedali e spazi culturali internazionali.",
    "externalLink": "https://www.tedmeyer.com/scarred-for-life-project.html",
    "driveLink": "https://drive.google.com/drive/folders/1YYzHLO8NiRO25NZm4QAHhIJ11dPnCeFS",
    "mascherabilita": "Mascherabile",
    "accettabilitaSociale": "Socialmente accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "non ne provo vergogna",
    "imageUrl": "/archive/case-052.jpg",
    "thumbnailUrl": "/archive/thumbs/case-052.jpg",
    "galleryUrls": [
      "/archive/case-052-1.jpg",
      "/archive/case-052-2.jpg",
      "/archive/case-052-3.jpg",
      "/archive/case-052-4.jpg"
    ],
    "excerpt": "Progetto artistico che preleva impronte grafiche dirette dalle cicatrici di persone operate o traumatizzate, trasformando eventi corporei dolorosi in opere d'arte visive."
  },
  {
    "id": "caso-053",
    "number": "053",
    "title": "Behind Closed Doors",
    "authorOrSubject": "Marcelo Toledo",
    "year": "2016",
    "type": "photo",
    "segno": "Cicatrici chirurgiche",
    "segnoTags": [
      "Cicatrici chirurgiche"
    ],
    "tipologia": "Mostra / Installazione",
    "tono": "Politico / Rivendicativo",
    "tipoDiMedia": "Scultura",
    "categorie": "Traumi",
    "clusterTags": [
      "Traumi",
      "Sistemici"
    ],
    "stileVisivo": "Maschere e sculture in metallo con superfici ossidate che riproducono a rilievo le ferite e le cicatrici della violenza domestica.",
    "sintesiConcettuale": "Mostra scultorea e installativa che denuncia la violenza domestica e di genere: l'artista modella maschere metalliche con le impronte delle lesioni subite dalle vittime, rendendo tangibile il trauma.",
    "notes": "Mostra itinerante patrocinata da Amnesty International ed esposta internazionalmente per sensibilizzare sulla violenza domestica contro le donne e dare voce alle sopravvissute.",
    "externalLink": "https://www.gaslightingart.com/activism/behind-closed-doors",
    "driveLink": "https://drive.google.com/drive/folders/1ajBl1vJDOxcqePEaBFGdUr0rSY4IzdZ8",
    "mascherabilita": "Non mascherabile",
    "accettabilitaSociale": "Socialmente non accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "ne provo vergogna",
    "imageUrl": "/archive/case-053.jpg",
    "thumbnailUrl": "/archive/thumbs/case-053.jpg",
    "galleryUrls": [
      "/archive/case-053-1.jpg",
      "/archive/case-053-2.jpg"
    ],
    "excerpt": "Mostra scultorea e installativa che denuncia la violenza domestica e di genere: l'artista modella maschere metalliche con le impronte delle lesioni subite dalle vittime, rendendo t..."
  },
  {
    "id": "caso-054",
    "number": "054",
    "title": "11:02 Nagasaki",
    "authorOrSubject": "Shomei Tomatsu",
    "year": "1966",
    "type": "photo",
    "segno": "Ustione da fuoco",
    "segnoTags": [
      "Ustione da fuoco"
    ],
    "tipologia": "Pubblicazione Editoriale",
    "tono": "Politico / Rivendicativo",
    "tipoDiMedia": "Fotografia",
    "categorie": "Traumi",
    "clusterTags": [
      "Traumi",
      "Sistemici"
    ],
    "stileVisivo": "Fotografia documentaria in bianco e nero ad alto contrasto; inquadrature ravvicinate e drammatiche su cheloidi, cicatrici da ustione ed effetti delle radiazioni.",
    "sintesiConcettuale": "Monografia che documenta le conseguenze a lungo termine dell'esplosione nucleare: i corpi segnati e i cheloidi degli hibakusha testimoniano la tragedia e la memoria storica.",
    "notes": "Pubblicato nel 1966 in collaborazione con la Japan Council Against Atomic and Hydrogen Bombs; opera miliare della fotografia giapponese d'avanguardia del dopoguerra.",
    "externalLink": "https://asia-archive.si.edu/exhibition/1102-nagasaki/",
    "driveLink": "https://drive.google.com/drive/folders/1G_z3KW2ixUwCg8vzoQ-e3sPxfFZsjTNj",
    "mascherabilita": "Non mascherabile",
    "accettabilitaSociale": "Socialmente non accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "ne provo vergogna",
    "imageUrl": "/archive/case-054.jpg",
    "thumbnailUrl": "/archive/thumbs/case-054.jpg",
    "galleryUrls": [
      "/archive/case-054-1.jpg"
    ],
    "excerpt": "Monografia che documenta le conseguenze a lungo termine dell'esplosione nucleare: i corpi segnati e i cheloidi degli hibakusha testimoniano la tragedia e la memoria storica."
  },
  {
    "id": "caso-094",
    "number": "094",
    "title": "LA CICATRICE VISTA DAGLI ALTRI",
    "authorOrSubject": "The Guardian",
    "year": "2020",
    "type": "photo",
    "segno": "Traccia teorica",
    "ambitoTeorico": "Trauma, Tempo & Agency",
    "segnoTags": [
      "Traccia teorica"
    ],
    "tipologia": "Pubblicazione Editoriale, Testimonianza personale",
    "tono": "Intimo / Confessionale",
    "tipoDiMedia": "Video",
    "categorie": "Sistemici",
    "clusterTags": [
      "Sistemici",
      "Traumi"
    ],
    "stileVisivo": "Video-documentario con interviste frontali e primi piani; luce naturale e narrazione confessionale focalizzata sulla relazione tra corpo segnato e visibilità pubblica.",
    "sintesiConcettuale": "La cicatrice vive nello spazio pubblico ed è esposta allo sguardo giudicante o incuriosito degli altri. La visibilità del segno cutaneo attiva una dinamica relazionale in cui il soggetto fa esperienza della propria vulnerabilità: \"Vedo lo sguardo degli altri e non posso fare altro, forse farei lo stesso\".",
    "notes": "Riflessione teorica ed esperienziale tratta dal documentario di The Guardian 'Scars: how our wounds make us who we are' (2020); indagine sulla percezione sociale del corpo imperfetto e sulla gestione dello sguardo altrui nello spazio pubblico.",
    "externalLink": "https://www.theguardian.com/news/video/2020/apr/27/scars-how-our-wounds-make-us-who-we-are-video",
    "driveLink": "",
    "mascherabilita": "—",
    "accettabilitaSociale": "—",
    "percezioneSociale": "—",
    "percezioneEstetica": "—",
    "valenzaDelRicordo": "—",
    "sensoDiVergogna": "—",
    "imageUrl": "/archive/case-094.jpg",
    "thumbnailUrl": "/archive/thumbs/case-094.jpg",
    "galleryUrls": [],
    "excerpt": "La cicatrice vive nello spazio pubblico ed è esposta allo sguardo giudicante o incuriosito degli altri. La visibilità del segno cutaneo attiva una dinamica relazionale in cui il so...",
    "microKeyword": "SGUARDO"
  },
  {
    "id": "caso-055",
    "number": "055",
    "title": "Hiroshima",
    "authorOrSubject": "Domon Ken",
    "year": "1958",
    "type": "photo",
    "segno": "Ustione da fuoco",
    "segnoTags": [
      "Ustione da fuoco",
      "Cicatrici chirurgiche"
    ],
    "tipologia": "Pubblicazione Editoriale",
    "tono": "Clinico / Scientifico",
    "tipoDiMedia": "Fotografia",
    "categorie": "Traumi",
    "clusterTags": [
      "Traumi",
      "Medici",
      "Sistemici"
    ],
    "stileVisivo": "Realismo fotografico in bianco e nero; primi piani dettagliati su innesti di pelle, cheloidi e interventi di ricostruzione chirurgica.",
    "sintesiConcettuale": "Monografia fondamentale del realismo fotografico che registra con rigore e profonda umanità le operazioni di trapianto cutaneo e i corpi segnati dei sopravvissuti di Hiroshima.",
    "notes": "Pietra miliare dell'editoria fotografica internazionale pubblicata nel 1958; documenta il lungo decorso ospedaliero e la chirurgia plastica su vittime come Shigeru Hara.",
    "externalLink": "https://www.cultweek.com/domonken/",
    "driveLink": "https://drive.google.com/drive/folders/1cVNZqt_WPwC-h8T-ZSewGDicgQ22a2ik",
    "mascherabilita": "Non mascherabile",
    "accettabilitaSociale": "Socialmente non accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "ne provo vergogna",
    "imageUrl": "/archive/case-055.jpg",
    "thumbnailUrl": "/archive/thumbs/case-055.jpg",
    "galleryUrls": [
      "/archive/case-055-1.jpg"
    ],
    "excerpt": "Monografia fondamentale del realismo fotografico che registra con rigore e profonda umanità le operazioni di trapianto cutaneo e i corpi segnati dei sopravvissuti di Hiroshima."
  },
  {
    "id": "caso-056",
    "number": "056",
    "title": "Zakhem | Ferite. La guerra a casa",
    "authorOrSubject": "Giulio Piscitelli",
    "year": "2019",
    "type": "photo",
    "segno": "Cicatrici chirurgiche",
    "segnoTags": [
      "Cicatrici chirurgiche"
    ],
    "tipologia": "Serie Fotografica",
    "tono": "Politico / Rivendicativo",
    "tipoDiMedia": "Fotografia",
    "categorie": "Traumi",
    "clusterTags": [
      "Traumi",
      "Medici"
    ],
    "stileVisivo": "Reportage fotogiornalistico nei reparti ospedalieri; primi piani su suture, monconi e corpi segnati da schegge e proiettili.",
    "sintesiConcettuale": "Indagine visiva nei centri chirurgici di EMERGENCY a Kabul e Lashkargah: le ferite da arma da fuoco e le chirurgie d'urgenza testimoniano l'orrore quotidiano della guerra in Afghanistan.",
    "notes": "Reportage commissionato da EMERGENCY per i 25 anni dell'ONG, realizzato nei Centri chirurgici per vittime di guerra di Kabul e Lashkargah in Afghanistan con il supporto di Contrasto.",
    "externalLink": "https://www.emergency.it/blog/pace-e-diritti/zakhem-ferite-la-guerra-a-casa-la-mostra-fotografica-per-i-25-anni-di-emergency/",
    "driveLink": "https://drive.google.com/drive/folders/1D9sPmch_e5h9n_snHc3GdgiIl9AaSbnA",
    "mascherabilita": "Non mascherabile",
    "accettabilitaSociale": "Socialmente non accettato",
    "percezioneSociale": "Visto come minaccia",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "ne provo vergogna",
    "imageUrl": "/archive/case-056.jpg",
    "thumbnailUrl": "/archive/thumbs/case-056.jpg",
    "galleryUrls": [
      "/archive/case-056-1.jpg",
      "/archive/case-056-2.jpg"
    ],
    "excerpt": "Indagine visiva nei centri chirurgici di EMERGENCY a Kabul e Lashkargah: le ferite da arma da fuoco e le chirurgie d'urgenza testimoniano l'orrore quotidiano della guerra in Afghan..."
  },
  {
    "id": "caso-095",
    "number": "095",
    "title": "DALLA PASSIVITÀ ALL'AGENCY",
    "authorOrSubject": "The Guardian",
    "year": "2020",
    "type": "photo",
    "segno": "Traccia teorica",
    "ambitoTeorico": "Trauma, Tempo & Agency",
    "segnoTags": [
      "Traccia teorica"
    ],
    "tipologia": "Pubblicazione Editoriale, Testimonianza personale",
    "tono": "Intimo / Confessionale",
    "tipoDiMedia": "Video",
    "categorie": "Trasformazione",
    "clusterTags": [
      "Trasformazione",
      "Traumi"
    ],
    "stileVisivo": "Documentario testimoniale e ritrattistica video intima; inquadrature ravvicinate sulle cicatrici accompagnate da narrazione riflessiva sul superamento del trauma.",
    "sintesiConcettuale": "La ferita costituisce il passaggio cruciale dalla passività della vittima all'agency del soggetto. Il segno sulla pelle cessa di essere ricordo del dolore per farsi testimonianza di liberazione e rinascita: \"La cicatrice mi fa pensare che sono libera... piu che il brutto periodo mi ricorda che mi sono liberata\".",
    "notes": "Concettualizzazione teorica dal video di The Guardian 'Scars' (2020); analisi della riappropriazione biografica della ferita corporea come atto trasformativo di autodeterminazione e riscatto identitario.",
    "externalLink": "https://www.theguardian.com/news/video/2020/apr/27/scars-how-our-wounds-make-us-who-we-are-video",
    "driveLink": "",
    "mascherabilita": "—",
    "accettabilitaSociale": "—",
    "percezioneSociale": "—",
    "percezioneEstetica": "—",
    "valenzaDelRicordo": "—",
    "sensoDiVergogna": "—",
    "imageUrl": "/archive/case-095.jpg",
    "thumbnailUrl": "/archive/thumbs/case-095.jpg",
    "galleryUrls": [],
    "excerpt": "La ferita costituisce il passaggio cruciale dalla passività della vittima all'agency del soggetto. Il segno sulla pelle cessa di essere ricordo del dolore per farsi testimonianza d...",
    "microKeyword": "AGENCY"
  },
  {
    "id": "caso-057",
    "number": "057",
    "title": "Sudan's War: A Nation Trapped",
    "authorOrSubject": "Abdulmonam Eassa",
    "year": "2025",
    "type": "photo",
    "segno": "Ustione da fuoco",
    "segnoTags": [
      "Ustione da fuoco"
    ],
    "tipologia": "Serie Fotografica",
    "tono": "Viscerale / Radicale",
    "tipoDiMedia": "Fotografia",
    "categorie": "Traumi",
    "clusterTags": [
      "Traumi",
      "Sistemici"
    ],
    "stileVisivo": "Fotogiornalismo documentario; inquadrature ravvicinate e sincere su ustioni cutanee e macerie belliche.",
    "sintesiConcettuale": "Documentazione della devastazione umanitaria in Sudan: le ustioni e i corpi sfollati nei campi evidenziano il prezzo fisico e psicologico pagato dalla popolazione civile.",
    "notes": "Reportage per Le Monde realizzato durante il conflitto sudanese, vincitore del World Press Photo Stories (Africa) 2026 e del Festival della Fotografia Etica Short Story Award 2026.",
    "externalLink": "https://www.worldpressphoto.org/collection/photo-contest/2026/Abdulmonam-Eassa/1",
    "driveLink": "https://drive.google.com/drive/folders/1gFbHDx1lRw3cCdmGjrRiXUTUKr-V3AA6",
    "mascherabilita": "Non mascherabile",
    "accettabilitaSociale": "Socialmente non accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "ne provo vergogna",
    "imageUrl": "/archive/case-057.jpg",
    "thumbnailUrl": "/archive/thumbs/case-057.jpg",
    "galleryUrls": [],
    "excerpt": "Documentazione della devastazione umanitaria in Sudan: le ustioni e i corpi sfollati nei campi evidenziano il prezzo fisico e psicologico pagato dalla popolazione civile."
  },
  {
    "id": "caso-058",
    "number": "058",
    "title": "Peaceful rage will never die",
    "authorOrSubject": "Abdulmonam Eassa",
    "year": "2022",
    "type": "photo",
    "segno": "Cicatrici da incidenti",
    "segnoTags": [
      "Cicatrici da incidenti"
    ],
    "tipologia": "Serie Fotografica",
    "tono": "Politico / Rivendicativo",
    "tipoDiMedia": "Fotografia",
    "categorie": "Traumi",
    "clusterTags": [
      "Traumi",
      "Sistemici"
    ],
    "stileVisivo": "Fotografia diretta d'azione e ritrattistica di strada; contrasti tra gas lacrimogeni, volti feriti e gesti di resistenza civile.",
    "sintesiConcettuale": "Reportage sulla mobilitazione pro-democrazia a Khartoum e Omdurman: i traumi e le lesioni dei manifestanti raccontano la tenacia e il sacrificio della resistenza civile.",
    "notes": "Progetto documentario sulle proteste contro il golpe militare in Sudan, vincitore del Young Reporter Trophy al Bayeux Calvados-Normandy Award 2022.",
    "externalLink": "https://www.abdulmonameassa.com/stories",
    "driveLink": "https://drive.google.com/drive/folders/10G1jlbvFV2TGlE_Q1v66Wso9AQBF8W_p",
    "mascherabilita": "Mascherabile",
    "accettabilitaSociale": "Socialmente non accettato",
    "percezioneSociale": "Visto come minaccia",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "non ne provo vergogna",
    "imageUrl": "/archive/case-058.jpg",
    "thumbnailUrl": "/archive/thumbs/case-058.jpg",
    "galleryUrls": [
      "/archive/case-058-1.jpg",
      "/archive/case-058-2.jpg"
    ],
    "excerpt": "Reportage sulla mobilitazione pro-democrazia a Khartoum e Omdurman: i traumi e le lesioni dei manifestanti raccontano la tenacia e il sacrificio della resistenza civile."
  },
  {
    "id": "caso-096",
    "number": "096",
    "title": "VERIDICITÀ DEL SEGNO CUTANEO",
    "authorOrSubject": "The Guardian",
    "year": "2020",
    "type": "photo",
    "segno": "Traccia teorica",
    "ambitoTeorico": "Trauma, Tempo & Agency",
    "segnoTags": [
      "Traccia teorica"
    ],
    "tipologia": "Pubblicazione Editoriale, Testimonianza personale",
    "tono": "Intimo / Confessionale",
    "tipoDiMedia": "Video",
    "categorie": "Trasformazione",
    "clusterTags": [
      "Trasformazione",
      "Traumi"
    ],
    "stileVisivo": "Riprese macro e dettagli sull'epidermide segnata; estetica documentaria sincera e non mediata che esplora la carne come archivio visibile di verità.",
    "sintesiConcettuale": "A differenza della parola o degli abiti, la pelle è una scrittura involontaria e incancellabile in cui il segno è intrinsecamente vero (veridicità del segno). Le tracce cutanee non mentono e definiscono l'identità: \"Sulle cicatrici non puoi davvero mentire, raccontano la storia per quello che sono\" e \"Le cicatrici contribuiscono a quello che sono io\".",
    "notes": "Sviluppo teorico sul valore testimoniale della pelle dal reportage di The Guardian 'Scars' (2020); indagine sulla dimensione indicale e ontologica della cicatrice come testo veritiero e indelebile del vissuto.",
    "externalLink": "https://www.theguardian.com/news/video/2020/apr/27/scars-how-our-wounds-make-us-who-we-are-video",
    "driveLink": "",
    "mascherabilita": "—",
    "accettabilitaSociale": "—",
    "percezioneSociale": "—",
    "percezioneEstetica": "—",
    "valenzaDelRicordo": "—",
    "sensoDiVergogna": "—",
    "imageUrl": "/archive/case-096.jpg",
    "thumbnailUrl": "/archive/thumbs/case-096.jpg",
    "galleryUrls": [],
    "excerpt": "A differenza della parola o degli abiti, la pelle è una scrittura involontaria e incancellabile in cui il segno è intrinsecamente vero (veridicità del segno). Le tracce cutanee non...",
    "microKeyword": "VERIDICITÀ"
  },
  {
    "id": "caso-059",
    "number": "059",
    "title": "With Their Bare Hands",
    "authorOrSubject": "Abdulmonam Eassa",
    "year": "2018",
    "type": "photo",
    "segno": "Cicatrici da incidenti",
    "segnoTags": [
      "Cicatrici da incidenti",
      "Cicatrici chirurgiche"
    ],
    "tipologia": "Serie Fotografica",
    "tono": "Viscerale / Radicale",
    "tipoDiMedia": "Fotografia",
    "categorie": "Traumi",
    "clusterTags": [
      "Traumi",
      "Sistemici"
    ],
    "stileVisivo": "Fotogiornalismo immersivo e drammatico sul campo; primi piani su mani impolverate, escoriazioni, tagli e corpi estratti dalle macerie.",
    "sintesiConcettuale": "Cronaca dello scavo e del soccorso durante l'assedio della Ghouta orientale: le ferite e le mani nude dei soccorritori diventano emblema di resilienza e umanità estrema.",
    "notes": "Reportage fotografico realizzato durante l'assedio quinquennale della Ghouta orientale in Siria, incentrato sul salvataggio dei civili estratti a mani nude dalle macerie.",
    "externalLink": "https://www.abdulmonameassa.com/stories",
    "driveLink": "https://drive.google.com/drive/folders/1Nu8qAYVPsoQuBwmdMSbrsvh1wPOoG38J",
    "mascherabilita": "Mascherabile",
    "accettabilitaSociale": "Socialmente non accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "non ne provo vergogna",
    "imageUrl": "/archive/case-059.jpg",
    "thumbnailUrl": "/archive/thumbs/case-059.jpg",
    "galleryUrls": [
      "/archive/case-059-1.jpg"
    ],
    "excerpt": "Cronaca dello scavo e del soccorso durante l'assedio della Ghouta orientale: le ferite e le mani nude dei soccorritori diventano emblema di resilienza e umanità estrema."
  },
  {
    "id": "caso-060",
    "number": "060",
    "title": "Yemen Uprising",
    "authorOrSubject": "Samuel Aranda",
    "year": "2011",
    "type": "photo",
    "segno": "Cicatrici da incidenti",
    "segnoTags": [
      "Cicatrici da incidenti"
    ],
    "tipologia": "Serie Fotografica",
    "tono": "Intimo / Confessionale",
    "tipoDiMedia": "Fotografia",
    "categorie": "Traumi",
    "clusterTags": [
      "Traumi",
      "Sistemici"
    ],
    "stileVisivo": "Fotogiornalismo documentario a colori in luce ambiente soffusa; composizione scultorea.",
    "sintesiConcettuale": "Scatto simbolo della primavera araba nello Yemen che ritrae una madre velata mentre sostiene il figlio ferito dai gas e dalla repressione in una moschea-ospedale.",
    "notes": "Fotografia vincitrice del World Press Photo of the Year 2012, scattata per The New York Times durante le rivolte a Sana'a il 15 ottobre 2011; ritrae Fatima al-Qaws e il figlio Zayed.",
    "externalLink": "https://www.worldpressphoto.org/collection/photo-contest/2012/samuel-aranda/1",
    "driveLink": "https://drive.google.com/drive/folders/1DFR4O2wqn6bLaYKkdEMA9Ox5DfgxjbSd",
    "mascherabilita": "Mascherabile",
    "accettabilitaSociale": "Socialmente non accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "non ne provo vergogna",
    "imageUrl": "/archive/case-060.jpg",
    "thumbnailUrl": "/archive/thumbs/case-060.jpg",
    "galleryUrls": [],
    "excerpt": "Scatto simbolo della primavera araba nello Yemen che ritrae una madre velata mentre sostiene il figlio ferito dai gas e dalla repressione in una moschea-ospedale."
  },
  {
    "id": "caso-097",
    "number": "097",
    "title": "SPACCATURA TEMPORALE",
    "authorOrSubject": "The Guardian",
    "year": "2020",
    "type": "photo",
    "segno": "Traccia teorica",
    "ambitoTeorico": "Trauma, Tempo & Agency",
    "segnoTags": [
      "Traccia teorica"
    ],
    "tipologia": "Pubblicazione Editoriale, Testimonianza personale",
    "tono": "Intimo / Confessionale",
    "tipoDiMedia": "Video",
    "categorie": "Trasformazione",
    "clusterTags": [
      "Trasformazione",
      "Traumi"
    ],
    "stileVisivo": "Video-documentario e ritrattistica intima con inquadrature ravvicinate sulle cicatrici; narrazione riflessiva e testimoniale sulla cicatrice come cesura temporale e linea di demarcazione biografica.",
    "sintesiConcettuale": "La cicatrice è, per sua natura, l'interfaccia temporale. Esiste un confine netto tra il prima (l'evento, il trauma, l'operazione) e il dopo (la vita che continua). Il segno cutaneo non è solo un elemento spaziale sul corpo, ma una condensazione di tempo: materializza l'istante in cui la biografia di una persona si è fratturata per poi ricucirsi in una forma nuova: \"Sempre un prima e un dopo\".",
    "notes": "Riflessione teorica ed esperienziale dal reportage di The Guardian 'Scars: how our wounds make us who we are' (2020); indagine sulla cicatrice come interfaccia temporale, soglia biografica e condensazione materiale del tempo.",
    "externalLink": "https://www.theguardian.com/news/video/2020/apr/27/scars-how-our-wounds-make-us-who-we-are-video",
    "driveLink": "",
    "mascherabilita": "—",
    "accettabilitaSociale": "—",
    "percezioneSociale": "—",
    "percezioneEstetica": "—",
    "valenzaDelRicordo": "—",
    "sensoDiVergogna": "—",
    "imageUrl": "/archive/case-097.jpg",
    "thumbnailUrl": "/archive/thumbs/case-097.jpg",
    "galleryUrls": [],
    "excerpt": "La cicatrice è, per sua natura, l'interfaccia temporale. Esiste un confine netto tra il prima (l'evento, il trauma, l'operazione) e il dopo (la vita che continua). Il segno cutaneo...",
    "microKeyword": "SPACCATURA"
  },
  {
    "id": "caso-061",
    "number": "061",
    "title": "3 Shot Figures",
    "authorOrSubject": "Maria Kulikovska + Oleh Vinnichenko",
    "year": "2024",
    "type": "photo",
    "segno": "Cicatrici da incidenti",
    "segnoTags": [
      "Cicatrici da incidenti"
    ],
    "tipologia": "Mostra / Installazione",
    "tono": "Viscerale / Radicale",
    "tipoDiMedia": "Scultura",
    "categorie": "Traumi",
    "clusterTags": [
      "Traumi",
      "Sistemici"
    ],
    "stileVisivo": "Sculture a grandezza naturale in resina trasparente e multistrato trafitte da colpi di arma da fuoco; pelle sintetica che rivela ferite interne e frammenti.",
    "sintesiConcettuale": "Tre figure umane in resina trasparente modellate sul corpo dell'artista e crivellate di colpi, collocate nel cortile dell'ospedale pediatrico colpito dai bombardamenti per esporre la violenza bellica sui corpi.",
    "notes": "Installazione e serie scultorea realizzata a Kiev con Oleh Vinnichenko e fotografata da Andrey Avdeenko presso l'ospedale pediatrico Ohmatdyt dopo l'attacco missilistico del luglio 2024.",
    "externalLink": "https://www.mariakulikovska.net/project-page/3-shoot-figures",
    "driveLink": "https://drive.google.com/drive/folders/1E00rHm4wRqKwix3O3ajQbgSWkdKa5kcV",
    "mascherabilita": "Non mascherabile",
    "accettabilitaSociale": "Socialmente non accettato",
    "percezioneSociale": "Visto come minaccia",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "ne provo vergogna",
    "imageUrl": "/archive/case-061.jpg",
    "thumbnailUrl": "/archive/thumbs/case-061.jpg",
    "galleryUrls": [
      "/archive/case-061-1.jpg",
      "/archive/case-061-2.jpg",
      "/archive/case-061-3.jpg",
      "/archive/case-061-4.jpg"
    ],
    "excerpt": "Tre figure umane in resina trasparente modellate sul corpo dell'artista e crivellate di colpi, collocate nel cortile dell'ospedale pediatrico colpito dai bombardamenti per esporre ..."
  },
  {
    "id": "caso-062",
    "number": "062",
    "title": "Scars of War",
    "authorOrSubject": "Lin Xiang Xiong / ICBL-CMC",
    "year": "2025",
    "type": "photo",
    "segno": "Cicatrici da incidenti",
    "segnoTags": [
      "Cicatrici da incidenti"
    ],
    "tipologia": "Mostra / Installazione",
    "tono": "Politico / Rivendicativo",
    "tipoDiMedia": "Fotografia, Pittura",
    "categorie": "Traumi",
    "clusterTags": [
      "Traumi",
      "Sistemici"
    ],
    "stileVisivo": "Fotografia documentaria sociale e ritrattistica d'impatto accostata a dipinti d'arte contemporanea per la pace; testimonianza visiva di  cicatrici da mine antiuomo.",
    "sintesiConcettuale": "Esposizione internazionale d'arte e fotogiornalismo promossa per denunciare l'eredità mortale delle mine terrestri e degli ordigni inesplosi, documentando le ferite fisiche indelebili e la resilienza dei sopravvissuti.",
    "notes": "Mostra organizzata presso la Lin Xiang Xiong Art Gallery di Penang in collaborazione con la International Campaign to Ban Landmines (ICBL-CMC), con 38 scatti documentari e 4 dipinti per la pace.",
    "externalLink": "https://www.buletinmutiara.com/scars-of-war-exhibition-turns-art-into-a-call-for-peace/",
    "driveLink": "https://drive.google.com/drive/folders/1DDerQUIhoqptRjzqiKey4OLPVoQOzQu8",
    "mascherabilita": "Non mascherabile",
    "accettabilitaSociale": "Socialmente non accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "ne provo vergogna",
    "imageUrl": "/archive/case-062.jpg",
    "thumbnailUrl": "/archive/thumbs/case-062.jpg",
    "galleryUrls": [
      "/archive/case-062-1.jpg",
      "/archive/case-062-2.jpg"
    ],
    "excerpt": "Esposizione internazionale d'arte e fotogiornalismo promossa per denunciare l'eredità mortale delle mine terrestri e degli ordigni inesplosi, documentando le ferite fisiche indeleb..."
  },
  {
    "id": "caso-063",
    "number": "063",
    "title": "Testimoni dei Testimoni. Ricordare e raccontare Auschwitz",
    "authorOrSubject": "Studio Azzurro / Generazione Testimoni",
    "year": "2019",
    "type": "photo",
    "segno": "Tatuaggio imposto",
    "segnoTags": [
      "Tatuaggio imposto"
    ],
    "tipologia": "Mostra / Installazione",
    "tono": "Poetico / Evocativo",
    "tipoDiMedia": "Video, Fotografia",
    "categorie": "Traumi",
    "clusterTags": [
      "Traumi",
      "Sistemici"
    ],
    "stileVisivo": "Installazione sensibile e multimediale con videoproiezioni su tulle, monitor e ambienti sonori immersivi; frammenti di volti storici e testimonianze dirette che riaffiorano nell'interazione.",
    "sintesiConcettuale": "Percorso esperienziale e immersivo concepito per tramandare la memoria della Shoah attraverso le voci, i corpi e i numeri di matricola impressi sui deportati.",
    "notes": "Mostra prodotta da Azienda Speciale Palaexpo e Roma Capitale al Palazzo delle Esposizioni (2019) con la Comunità Ebraica di Roma e il CDEC, ideata dai giovani dei Viaggi della Memoria.",
    "externalLink": "https://www.palazzoesposizioniroma.it/mostra/testimoni-dei-testimoni-ricordare-e-raccontare-auschwitz",
    "driveLink": "https://drive.google.com/drive/folders/1gqOJE-aVutpD7858mIq-ZV_6xI19HktP",
    "mascherabilita": "Mascherabile",
    "accettabilitaSociale": "Socialmente non accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "ne provo vergogna",
    "imageUrl": "/archive/case-063.jpg",
    "thumbnailUrl": "/archive/thumbs/case-063.jpg",
    "galleryUrls": [
      "/archive/case-063-1.jpg",
      "/archive/case-063-2.jpg",
      "/archive/case-063-3.jpg",
      "/archive/case-063-4.jpg"
    ],
    "excerpt": "Percorso esperienziale e immersivo concepito per tramandare la memoria della Shoah attraverso le voci, i corpi e i numeri di matricola impressi sui deportati."
  },
  {
    "id": "caso-064",
    "number": "064",
    "title": "Tatuaggi identificativi di Auschwitz-Birkenau",
    "authorOrSubject": "Regime nazionalsocialista / Amministrazione del campo",
    "year": "1941",
    "type": "photo",
    "segno": "Tatuaggio imposto",
    "segnoTags": [
      "Tatuaggio imposto"
    ],
    "tipologia": "Archivio / Ricerca",
    "tono": "Politico / Rivendicativo",
    "tipoDiMedia": "Fotografia",
    "categorie": "Traumi",
    "clusterTags": [
      "Traumi",
      "Sistemici"
    ],
    "stileVisivo": "Documentazione storica e archivistica in bianco e nero; riprese ravvicinate dei numeri impressi sulla pelle delle vittime dell'olocausto.",
    "sintesiConcettuale": "Pratica burocratica di deumanizzazione e marcatura forzata: il tatuaggio matricolare sul braccio trasforma il prigioniero in numero seriale, divenendo traccia indelebile della Shoah e memoria corporea universale.",
    "notes": "Unico campo del sistema concentrario nazista ad applicare sistematicamente la marcatura cutanea coatta, introdotta nell'autunno 1941 sui prigionieri di guerra sovietici e poi estesa agli internati civili ed ebrei.",
    "externalLink": "https://it.euronews.com/2020/01/23/olocausto-la-storia-dei-tatuaggi-identificativi-di-auschwitz-birkenau",
    "driveLink": "https://drive.google.com/drive/folders/1P3zRwnG_9EPDrf98_H1a75emQq8pixmf",
    "mascherabilita": "Mascherabile",
    "accettabilitaSociale": "Socialmente non accettato",
    "percezioneSociale": "Visto come minaccia",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "ne provo vergogna",
    "imageUrl": "/archive/case-064.jpg",
    "thumbnailUrl": "/archive/thumbs/case-064.jpg",
    "galleryUrls": [
      "/archive/case-064-1.jpg",
      "/archive/case-064-2.jpg",
      "/archive/case-064-3.jpg"
    ],
    "excerpt": "Pratica burocratica di deumanizzazione e marcatura forzata: il tatuaggio matricolare sul braccio trasforma il prigioniero in numero seriale, divenendo traccia indelebile della Shoa..."
  },
  {
    "id": "caso-065",
    "number": "065",
    "title": "Generations: Portraits of Holocaust Survivors",
    "authorOrSubject": "Simon Roberts",
    "year": "2021",
    "type": "photo",
    "segno": "Tatuaggio imposto",
    "segnoTags": [
      "Tatuaggio imposto"
    ],
    "tipologia": "Mostra / Installazione",
    "tono": "Poetico / Evocativo",
    "tipoDiMedia": "Video, Fotografia",
    "categorie": "Traumi",
    "clusterTags": [
      "Traumi",
      "Sistemici"
    ],
    "stileVisivo": "Video-ritratti ad altissima definizione a figura intera e mezzo busto su sfondo neutro; focus sulla reliquia dermica asportata.",
    "sintesiConcettuale": "Il progetto accosta ritratti in movimento di sopravvissuti della Shoah alla reliquia cutanea del tatuaggio rimosso chirurgicamente da Jack Aizenberg, esplorando l'asportazione della ferita e la permanenza della memoria.",
    "notes": "Progetto e mostra prodotti con l'Imperial War Museum e la Royal Photographic Society a Londra; include l'inedita testimonianza della rimozione del numero di matricola conservato sotto spirito.",
    "externalLink": "https://www.simoncroberts.com/work/imperial-war-museum/",
    "driveLink": "https://drive.google.com/drive/folders/1q-KEJ1xbd2VOSBwHEklKJCBNh1SxlvN0",
    "mascherabilita": "Mascherabile",
    "accettabilitaSociale": "Socialmente non accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "ne provo vergogna",
    "imageUrl": "/archive/case-065.jpg",
    "thumbnailUrl": "/archive/thumbs/case-065.jpg",
    "galleryUrls": [
      "/archive/case-065-1.jpg"
    ],
    "excerpt": "Il progetto accosta ritratti in movimento di sopravvissuti della Shoah alla reliquia cutanea del tatuaggio rimosso chirurgicamente da Jack Aizenberg, esplorando l'asportazione dell..."
  },
  {
    "id": "caso-066",
    "number": "066",
    "title": "The Unknown Soldier",
    "authorOrSubject": "David Jay",
    "year": "2014",
    "type": "photo",
    "segno": "Ustione da fuoco",
    "segnoTags": [
      "Ustione da fuoco",
      "Cicatrici chirurgiche"
    ],
    "tipologia": "Serie Fotografica",
    "tono": "Politico / Rivendicativo",
    "tipoDiMedia": "Fotografia",
    "categorie": "Traumi",
    "clusterTags": [
      "Traumi",
      "Sistemici"
    ],
    "stileVisivo": "Ritrattistica a figura intera e primi piani in bianco e nero; illuminazione frontale che pone in evidenza innesti cutanei e ustioni estese.",
    "sintesiConcettuale": "Corpus fotografico monumentale che ritrae veterani delle guerre in Iraq e Afghanistan segnati da gravi ustioni, esplosioni e innesti cutanei, esponendo il costo corporeo e permanente del conflitto armato.",
    "notes": "Serie vincitrice agli International Photography Awards (IPA) ed entrata nelle collezioni della Library of Congress; segue il celebre 'The SCAR Project' traslando la ricerca sulle ferite visibili dei soldati.",
    "externalLink": "https://www.photoawards.com/social/zoom.php?eid=8-86309-14",
    "driveLink": "https://drive.google.com/drive/folders/1MUC5RQVHmBfHd5kE5tDVbngq3EY21w_A",
    "mascherabilita": "Non mascherabile",
    "accettabilitaSociale": "Socialmente non accettato",
    "percezioneSociale": "Visto come minaccia",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "ne provo vergogna",
    "imageUrl": "/archive/case-066.jpg",
    "thumbnailUrl": "/archive/thumbs/case-066.jpg",
    "galleryUrls": [
      "/archive/case-066-1.jpg"
    ],
    "excerpt": "Corpus fotografico monumentale che ritrae veterani delle guerre in Iraq e Afghanistan segnati da gravi ustioni, esplosioni e innesti cutanei, esponendo il costo corporeo e permanen..."
  },
  {
    "id": "caso-067",
    "number": "067",
    "title": "The Scourged Back",
    "authorOrSubject": "McPherson & Oliver",
    "year": "1863",
    "type": "photo",
    "segno": "Cicatrici da incidenti",
    "segnoTags": [
      "Cicatrici da incidenti"
    ],
    "tipologia": "Fotografia d'autore",
    "tono": "Politico / Rivendicativo",
    "tipoDiMedia": "Fotografia",
    "categorie": "Traumi",
    "clusterTags": [
      "Traumi",
      "Sistemici"
    ],
    "stileVisivo": "Ritratto in studio su lastra, inquadratura di tre quarti di schiena che mette a fuoco la complessa trama scultorea dei cheloidi e delle lacerazioni da frusta.",
    "sintesiConcettuale": "Ritratto storico della schiena martoriata dello schiavo fuggiasco Gordon: le estese cicatrici da flagellazione divennero una delle prime icone fotogiornalistiche dell'abolizionismo, trasformando la pelle segnata in prova irrefutabile della brutalità della schiavitù.",
    "notes": "Realizzata a Baton Rouge durante la guerra di secessione e diffusa come carte-de-visite da Harper's Weekly; testimonianza cardine della fotografia come strumento di denuncia sociale e memoria politica.",
    "externalLink": "https://presidentlincoln.illinois.gov/Blog/Posts/209/African-American-History/2025/9/The-story-behind-The-Scourged-Back-photograph/blog-post/",
    "driveLink": "https://drive.google.com/drive/folders/10DlvPFjdGX4Ys6SqV5MagekfeIXQ0Lnx",
    "mascherabilita": "Mascherabile",
    "accettabilitaSociale": "Socialmente non accettato",
    "percezioneSociale": "Visto come minaccia",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "ne provo vergogna",
    "imageUrl": "/archive/case-067.jpg",
    "thumbnailUrl": "/archive/thumbs/case-067.jpg",
    "galleryUrls": [],
    "excerpt": "Ritratto storico della schiena martoriata dello schiavo fuggiasco Gordon: le estese cicatrici da flagellazione divennero una delle prime icone fotogiornalistiche dell'abolizionismo..."
  },
  {
    "id": "caso-068",
    "number": "068",
    "title": "B®ANDED / Scarred Chest",
    "authorOrSubject": "Hank Willis Thomas",
    "year": "2003",
    "type": "photo",
    "segno": "Cicatrici chirurgiche",
    "segnoTags": [
      "Cicatrici chirurgiche"
    ],
    "tipologia": "Fotografia d'autore",
    "tono": "Politico / Rivendicativo",
    "tipoDiMedia": "Fotografia",
    "categorie": "Traumi",
    "clusterTags": [
      "Traumi",
      "Sistemici"
    ],
    "stileVisivo": "Ritrattistica concettuale in studio; primo piano sul petto maschile segnato dal logo come cheloide.",
    "sintesiConcettuale": "L'opera rielabora la marchiatura a fuoco del logo sportivo come cicatrice corporale, denunciando la continuità tra schiavitù e mercificazione commerciale contemporanea.",
    "notes": "Scatto iconico della serie B®ANDED (2003), esposto a livello internazionale; esplora il condizionamento visivo della pubblicità e l'oggettificazione razzializzata del corpo.",
    "externalLink": "https://museemagazine.com/features/2020/6/24/hank-willis-thomas-branding-black-identity",
    "driveLink": "https://drive.google.com/drive/folders/1Nizixxdu9yQDSulSkyvSmNrfeKohs9dQ",
    "mascherabilita": "Mascherabile",
    "accettabilitaSociale": "Socialmente non accettato",
    "percezioneSociale": "Visto come minaccia",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "ne provo vergogna",
    "imageUrl": "/archive/case-068.jpg",
    "thumbnailUrl": "/archive/thumbs/case-068.jpg",
    "galleryUrls": [
      "/archive/case-068-1.jpg"
    ],
    "excerpt": "L'opera rielabora la marchiatura a fuoco del logo sportivo come cicatrice corporale, denunciando la continuità tra schiavitù e mercificazione commerciale contemporanea."
  },
  {
    "id": "caso-069",
    "number": "069",
    "title": "Taxi to the Dark Side",
    "authorOrSubject": "Alex Gibney",
    "year": "2007",
    "type": "photo",
    "segno": "Cicatrici da incidenti",
    "segnoTags": [
      "Cicatrici da incidenti",
      "Cicatrici chirurgiche"
    ],
    "tipologia": "Archivio / Ricerca",
    "tono": "Politico / Rivendicativo",
    "tipoDiMedia": "Video",
    "categorie": "Traumi",
    "clusterTags": [
      "Traumi",
      "Sistemici"
    ],
    "stileVisivo": "Cinema documentario d'inchiesta; testimonianze dirette, registri carcerari e referti d'autopsia che evidenziano i traumi da percosse mortali.",
    "sintesiConcettuale": "Documentario d'inchiesta che ricostruisce la morte per percosse del tassista afghano Dilawar a Bagram, smascherando la tortura e gli abusi come prassi istituzionalizzata.",
    "notes": "Premio Oscar al miglior documentario (2008); analizza le violazioni della Convenzione di Ginevra e la degenerazione delle pratiche di interrogatorio post-11 settembre.",
    "externalLink": "https://it.wikipedia.org/wiki/Taxi_to_the_Dark_Side",
    "driveLink": "https://drive.google.com/drive/folders/1b4Kj2YFwyR_0uKQ5oZhxim33DBl6QZZj",
    "mascherabilita": "Non mascherabile",
    "accettabilitaSociale": "Socialmente non accettato",
    "percezioneSociale": "Visto come minaccia",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "ne provo vergogna",
    "imageUrl": "/archive/case-069.jpg",
    "thumbnailUrl": "/archive/thumbs/case-069.jpg",
    "galleryUrls": [],
    "excerpt": "Documentario d'inchiesta che ricostruisce la morte per percosse del tassista afghano Dilawar a Bagram, smascherando la tortura e gli abusi come prassi istituzionalizzata."
  },
  {
    "id": "caso-071",
    "number": "071",
    "title": "The Hiroshima Maidens",
    "authorOrSubject": "Robert Jacobs / Norman Cousins",
    "year": "1955",
    "type": "photo",
    "segno": "Ustione da fuoco",
    "segnoTags": [
      "Ustione da fuoco",
      "Cicatrici chirurgiche"
    ],
    "tipologia": "Archivio / Ricerca",
    "tono": "Clinico / Scientifico",
    "tipoDiMedia": "Fotografia",
    "categorie": "Traumi",
    "clusterTags": [
      "Traumi",
      "Medici",
      "Sistemici"
    ],
    "stileVisivo": "Fotografia documentaria d'archivio e ritrattistica, focus su cheloidi da bomba atomica, contratture e innesti di chirurgia plastica ricostruttiva.",
    "sintesiConcettuale": "Ricerca storica sul progetto che portò 25 giovani hibakusha negli Stati Uniti per interventi di chirurgia ricostruttiva sulle cicatrici e sui cheloidi da radiazioni atomiche.",
    "notes": "Saggio accademico pubblicato sulla rivista Intersections (2010); esamina l'impatto mediatico, la memoria corporea post-bellica e la diplomazia umanitaria attorno ai corpi segnati delle giovani donne.",
    "externalLink": "http://intersections.anu.edu.au/issue24/jacobs.htm",
    "driveLink": "https://drive.google.com/drive/folders/1hbArVxK5OBaYV6Lk97wDTCcH95Kfy8pl",
    "mascherabilita": "Non mascherabile",
    "accettabilitaSociale": "Socialmente non accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "ne provo vergogna",
    "imageUrl": "/archive/case-071.jpg",
    "thumbnailUrl": "/archive/thumbs/case-071.jpg",
    "galleryUrls": [
      "/archive/case-071-1.jpg"
    ],
    "excerpt": "Ricerca storica sul progetto che portò 25 giovani hibakusha negli Stati Uniti per interventi di chirurgia ricostruttiva sulle cicatrici e sui cheloidi da radiazioni atomiche."
  },
  {
    "id": "caso-171",
    "number": "171",
    "title": "Branded: Secret Sorority of NXIVM",
    "authorOrSubject": "Sarah Edmondson / ABC News (20/20)",
    "year": "2017",
    "type": "photo",
    "segno": "Marchio a fuoco",
    "segnoTags": [
      "Marchio a fuoco",
      "Tatuaggio imposto"
    ],
    "tipologia": "Inchiesta giornalistica, Testimonianza personale",
    "tono": "Politico / Rivendicativo",
    "tipoDiMedia": "Video, Fotografia, Inchiesta televisiva",
    "categorie": "Sistemici",
    "clusterTags": [
      "Sistemici",
      "Traumi"
    ],
    "stileVisivo": "Giornalismo investigativo televisivo; interviste frontali e documentazione fotografica dei segni fisici impressi a fuoco.",
    "sintesiConcettuale": "«Mi avevano promesso un piccolo tatuaggio simbolico durante un rito di iniziazione. Invece mi hanno marchiata con le iniziali del leader di NXIVM. Quel segno mi ricordava ogni giorno il tradimento e il controllo subìto. All’inizio l’ho conservato come prova: rendeva visibile agli altri una violenza difficile da spiegare.\nCon il tempo, però, non volevo più portare il suo nome sul mio corpo. Dopo diversi trattamenti, ho scelto un intervento per rimuovere il marchio. È rimasta una cicatrice, ma questa volta era il risultato di una mia decisione. Per me non significava cancellare il passato, ma riprendere possesso del mio corpo e scegliere quale significato dare a quel segno.»",
    "notes": "Inchiesta speciale della trasmissione 20/20 di ABC News che ha portato all'attenzione pubblica e giudiziaria i crimini dell'organizzazione.",
    "externalLink": "https://abcnews.com/US/nxivm-member-invited-secret-sorority-branded/story?id=51617201",
    "driveLink": "",
    "mascherabilita": "Mascherabile",
    "accettabilitaSociale": "Socialmente non accettato",
    "percezioneSociale": "Visto come minaccia",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "ne provo vergogna",
    "imageUrl": "/archive/case-171.jpg",
    "thumbnailUrl": "/archive/thumbs/case-171.jpg",
    "galleryUrls": [],
    "excerpt": "«Mi avevano promesso un piccolo tatuaggio simbolico durante un rito di iniziazione. Invece mi hanno marchiata con le iniziali del leader di NXIVM. Quel segno mi ricordava ogni gior...",
    "microKeyword": "MARCHIO"
  },
  {
    "id": "caso-159",
    "number": "159",
    "title": "Out, Damned Spots",
    "authorOrSubject": "itsbecauseisaidso (Blogger)",
    "year": "2015",
    "type": "photo",
    "segno": "Tracce oncologiche",
    "segnoTags": [
      "Tracce oncologiche",
      "chemioterapia"
    ],
    "tipologia": "Testimonianza personale",
    "tono": "Intimo / Confessionale",
    "tipoDiMedia": "Fotografia",
    "categorie": "Medici",
    "clusterTags": [
      "Medici",
      "Trasformazione"
    ],
    "stileVisivo": "Post autobiografico su blog personale; riflessione visivo-testuale sul valore simbolico dei punti di inchiostro lasciati dalle sedute radioterapiche.",
    "sintesiConcettuale": "«Sì, questa è una foto del mio petto. Se guardate in basso, verso l'anello più basso della collana (fatta da me, con perline di agata muschiata da 8 mm e minuscole perline di vetro nero), vedrete appena sopra uno dei miei tatuaggi dovuti alla radioterapia. Niente di che, vero? Ma quando lo vedo ogni singola volta che abbasso lo sguardo, ogni volta che mi rovescio qualcosa addosso (cosa che accade con una frequenza allarmante), ogni volta che mi guardo allo specchio, diventa un grosso problema. Mi sorride beffardo dicendo \"Ciao, sono ancora qui, forse avrai di nuovo bisogno di me\". Oppure proclama \"Ehi! Questa donna ha avuto un cancro al seno!\" O ancora mi prende in giro dicendo \"Ah. Pensavi che oggi non avresti pensato al cancro, eh? Ti ho beccato. Pensaci\".»",
    "notes": "Articolo pubblicato sul blog 'It's Because I Said So'. Analisi del legame tra marchi medici indelebili, ansia di recidiva oncologica e rielaborazione del sé.",
    "externalLink": "[link removed]",
    "driveLink": "https://drive.google.com/drive/folders/1pj4-IymqazbDxlE-X7hbvtyq5YgBpk6d",
    "mascherabilita": "Mascherabile",
    "accettabilitaSociale": "Socialmente accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "non ne provo vergogna",
    "imageUrl": "/archive/case-159.jpg",
    "thumbnailUrl": "/archive/thumbs/case-159.jpg",
    "galleryUrls": [],
    "excerpt": "«Sì, questa è una foto del mio petto. Se guardate in basso, verso l'anello più basso della collana (fatta da me, con perline di agata muschiata da 8 mm e minuscole perline di vetro..."
  },
  {
    "id": "caso-168",
    "number": "168",
    "title": "Daniel's Story: An Employable Appearance",
    "authorOrSubject": "Daniel / Changing Faces",
    "year": "2021",
    "type": "photo",
    "segno": "Condizioni cutanee",
    "segnoTags": [
      "Condizioni cutanee",
      "cicatrici facciali"
    ],
    "tipologia": "Testimonianza personale, Campagna",
    "tono": "Politico / Rivendicativo",
    "tipoDiMedia": "Testimonianza scritta, Fotografia",
    "categorie": "Sistemici",
    "clusterTags": [
      "Sistemici",
      "Traumi"
    ],
    "stileVisivo": "Ritrattistica editoriale a luce naturale diffusa; primo piano dignitoso senza ritocchi che valorizza i tratti del volto autentico.",
    "sintesiConcettuale": "«A sette anni un incidente stradale mi ha lasciato profonde cicatrici sul viso e sul corpo. Per anni ho cercato di nasconderle: spesso gli altri le cancellavano dalle foto, facendomi credere che il mio aspetto fosse 'sbagliato'. Anche giocando a tennis a livello professionistico ho dovuto sopportare cattiverie, con avversari e tifosi che mi chiamavano 'Scarface' per destabilizzarmi. Nel mondo del lavoro, poi, è stata dura: mi dissero addirittura che il mio viso era una 'distrazione' e che non avevo un aspetto adatto per essere assunto, distruggendo la mia autostima e mettendomi a disagio a ogni colloquio. Oggi, però, le cose sono cambiate. Ho imparato a essere orgoglioso delle mie cicatrici e di tutto ciò che ho superato, capendo che i commenti cattivi riflettono solo l'ignoranza altrui. Presto mi trasferirò negli Stati Uniti per sposarmi, e il mio messaggio per chiunque conviva con una differenza visibile è uno solo: siate fieri di chi siete, non c'è nulla di cui vergognarsi.»",
    "notes": "Campagna promossa dall'associazione benefica britannica Changing Faces contro le discriminazioni sul posto di lavoro.",
    "externalLink": "https://www.changingfaces.org.uk/story/daniels-story-i-was-told-i-didnt-have-an-employable-appearance/",
    "driveLink": "https://drive.google.com/drive/folders/1iLWeMcomUWZG4tqSUWdd8nlMJL_pLYEL",
    "mascherabilita": "Non mascherabile",
    "accettabilitaSociale": "Socialmente non accettato",
    "percezioneSociale": "Visto come minaccia",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "non ne provo vergogna",
    "imageUrl": "/archive/case-168.jpg",
    "thumbnailUrl": "/archive/thumbs/case-168.jpg",
    "galleryUrls": [],
    "excerpt": "«A sette anni un incidente stradale mi ha lasciato profonde cicatrici sul viso e sul corpo. Per anni ho cercato di nasconderle: spesso gli altri le cancellavano dalle foto, facendo..."
  },
  {
    "id": "caso-169",
    "number": "169",
    "title": "Zubaida's Story",
    "authorOrSubject": "Zubaida Hasan / Grossman Burn Foundation",
    "year": "2002",
    "type": "photo",
    "segno": "Ustione da fuoco",
    "segnoTags": [
      "Ustione da fuoco",
      "Cicatrici chirurgiche"
    ],
    "tipologia": "Testimonianza personale, Archivio / Ricerca",
    "tono": "Intimo / Confessionale",
    "tipoDiMedia": "Fotografia, Testimonianza scritta",
    "categorie": "Medici",
    "clusterTags": [
      "Medici",
      "Traumi"
    ],
    "stileVisivo": "Documentazione clinica e ritrattistica di guarigione; sequenza di scatti prima e dopo gli interventi di chirurgia ricostruttiva.",
    "sintesiConcettuale": "Percorso riabilitativo di una bambina afghana gravemente ustionata: attraverso complessi interventi chirurgici riacquista mobilita ed espressivita.",
    "notes": "Iniziativa umanitaria della Grossman Burn Foundation a Los Angeles per il sostegno a minori vittime di gravi ustioni.",
    "externalLink": "https://www.grossmanburnfoundation.org/zubaida/",
    "driveLink": "https://drive.google.com/drive/folders/152l9dhdeg8Kr7WaN1p2tg18sPSumlLlB",
    "mascherabilita": "Non mascherabile",
    "accettabilitaSociale": "Socialmente accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come respingente",
    "valenzaDelRicordo": "legato a un ricordo negativo",
    "sensoDiVergogna": "non ne provo vergogna",
    "imageUrl": "/archive/case-169.jpg",
    "thumbnailUrl": "/archive/thumbs/case-169.jpg",
    "galleryUrls": [],
    "excerpt": "Percorso riabilitativo di una bambina afghana gravemente ustionata: attraverso complessi interventi chirurgici riacquista mobilita ed espressivita."
  },
  {
    "id": "caso-172",
    "number": "172",
    "title": "Skin Deep Stories: Sarah Edmondson",
    "authorOrSubject": "Sarah Edmondson / The Global Resilience Project",
    "year": "2025",
    "type": "photo",
    "segno": "Marchio a fuoco",
    "segnoTags": [
      "Marchio a fuoco",
      "Tatuaggio cover-up"
    ],
    "tipologia": "Pubblicazione Editoriale, Testimonianza personale",
    "tono": "Intimo / Confessionale",
    "tipoDiMedia": "Testimonianza scritta, Fotografia",
    "categorie": "Sistemici",
    "clusterTags": [
      "Sistemici",
      "Traumi"
    ],
    "stileVisivo": "Ritrattistica a figura ravvicinata e saggio narrativo; documentazione visiva della riappropriazione corporea tramite tatuaggio di copertura.",
    "sintesiConcettuale": "«Dopo più di dieci anni in NXIVM, mi proposero di entrare in una sorellanza segreta. Credevo che durante l’iniziazione avrei ricevuto un tatuaggio; invece mi marchiarono la pelle senza anestesia. Il dolore fu peggiore del parto, e vedere altre donne subire e infliggere quella sofferenza fu sconvolgente. Mi dissero che il marchio era un simbolo latino. Quando riconobbi al suo interno le iniziali di Keith Raniere, reagii con rabbia: quel segno rappresentava un’appartenenza che rifiutavo. Non ero una sua proprietà. Raccontare pubblicamente ciò che era successo significava anche affermare questo.»",
    "notes": "Capitolo dell'antologia 'RESILIENT A.F.: Skin Deep Stories' pubblicata da The Global Resilience Project per celebrare storie di resilienza attraverso la pelle.",
    "externalLink": "https://theglobalresilienceproject.com/sarah-edmondson-resilient-a-f-skin-deep-stories/",
    "driveLink": "https://drive.google.com/drive/folders/1A3jF-jdmjckYItiJulmj7scNbe_gXI3V",
    "mascherabilita": "Mascherabile",
    "accettabilitaSociale": "Socialmente accettato",
    "percezioneSociale": "Visto in modo compassionevole",
    "percezioneEstetica": "Visto come attraente",
    "valenzaDelRicordo": "legato a un ricordo positivo",
    "sensoDiVergogna": "non ne provo vergogna",
    "imageUrl": "/archive/case-172.jpg",
    "thumbnailUrl": "/archive/thumbs/case-172.jpg",
    "galleryUrls": [],
    "excerpt": "«Dopo più di dieci anni in NXIVM, mi proposero di entrare in una sorellanza segreta. Credevo che durante l’iniziazione avrei ricevuto un tatuaggio; invece mi marchiarono la pelle s..."
  }
];
