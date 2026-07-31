export interface SmartPromptOptions {
  category?: string;
  filters?: {
    difficulty?: string;
    mood?: string;
    lighting?: string;
    perspective?: string;
    colorPalette?: string;
    action?: string;
    emotion?: string;
    constraints?: string;
    artStyle?: string;
  };
  customKeywords?: string;
  lengthPreference?: "micro" | "standard" | "detailed" | string;
  wheelState?: {
    subject?: string;
    mood?: string;
    weather?: string;
    lighting?: string;
    location?: string;
    twist?: string;
  };
}

export interface GeneratedPromptResult {
  title: string;
  prompt: string;
  category: string;
}

// Memory buffer of recently generated prompt signatures to ensure ZERO repetition
const recentPromptHashes = new Set<string>();
const MAX_RECENT_HASHES = 300;

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Vast vocabulary banks categorized by domain
const CATEGORY_VOCABULARY: Record<
  string,
  {
    subjects: string[];
    settings: string[];
    actions: string[];
    twists: string[];
  }
> = {
  "Character Design": {
    subjects: [
      "a weary clockwork wanderer",
      "a wandering potion herbalist",
      "a masked royal assassin",
      "a veteran starship mechanic",
      "a nomadic desert stargazer",
      "a retired lighthouse keeper",
      "a young apprentice wizard",
      "a solemn forest archer",
      "an eccentric antique clockmaker",
      "a traveling street musician",
      "a cyberpunk rooftop courier",
      "a Victorian moth researcher",
      "a quiet tea master",
      "a tavern storyteller",
      "a shadow weaver sorcerer",
      "a deep-sea diver",
      "a royal knight scholar",
      "a sun-baked cartographer",
      "a wandering monk",
      "a mechanical dollmaker",
      "a ghost hunter",
      "a sky-captain aeronaut",
      "a celestial constellation mapper",
      "a forest herbalist with fox ears",
      "a blind weapon smith"
    ],
    settings: [
      "in a snowy pine forest at twilight",
      "inside a cozy wooden cabin filled with dried herbs",
      "on an overgrown stone balcony overlooking the sea",
      "in a neon-lit alleyway in a rainy metropolis",
      "inside a grand vaulted library with spiral staircases",
      "at an ancient crossroads beneath a giant ancient oak",
      "in a sunlit greenhouse filled with exotic ferns",
      "upon a windy coastal cliff with a towering lighthouse",
      "inside a cluttered clockwork repair workshop",
      "at a bustling night market surrounded by glowing lanterns",
      "in a forgotten sanctuary hidden deep in a bamboo grove",
      "on a rusty airship deck above sea of clouds",
      "inside a moonlit stone ruin covered in ivy",
      "in a quiet underground cavern with glowing crystal veins",
      "at a rustic roadside tavern fireplace"
    ],
    actions: [
      "holding a small brass lantern that lights up the surrounding darkness",
      "carefully inspecting a glowing glass vial filled with luminous liquid",
      "adjusting a weathered leather cloak as the wind catches the edges",
      "sketching intricate diagrams in a worn leather journal",
      "sharpening an ornate dagger with focused concentration",
      "brewing a steaming cup of tea over a small copper stove",
      "reading a dusty ancient scroll by candle light",
      "tuning a wooden string instrument with practiced fingers",
      "reaching out to touch a floating speck of magical light",
      "resting against a mossy stone pillar while watching the horizon",
      "fastening a set of intricate brass goggles over their eyes",
      "feeding a tiny glowing bird perched on their gloved fingers"
    ],
    twists: [
      "wearing a coat embroidered with glowing silver constellation maps",
      "accompanied by a small mechanical clockwork owl on their shoulder",
      "with subtle golden glowing patterns traced along their skin",
      "holding a vintage brass compass whose needle spins towards magic",
      "surrounded by floating paper lanterns casting warm orange shadows",
      "leaving a gentle trail of luminous blue embers in their footsteps",
      "with a pocket watch that displays celestial phases instead of hours",
      "wearing a velvet scarf adorned with polished raven feathers"
    ]
  },

  "Creature Design": {
    subjects: [
      "a majestic crystal-antlered deer",
      "a playful baby shadow dragon",
      "a towering moss-covered forest guardian",
      "a bioluminescent deep-sea leviathan",
      "a phoenix with iridescent sapphire feathers",
      "a winged panther with owl feathers",
      "a subterranean glass-shelled tortoise",
      "a celestial fox with constellation tails",
      "a stone gargoyle coming to life",
      "a serpent made of flowing river water and lotus blossoms",
      "a giant fluffy moth creature",
      "a crystal-scaled desert drake",
      "an antlered wolf guardian of the tundra",
      "a miniature tea-cup badger dragon",
      "a spectral stag woven from starlight"
    ],
    settings: [
      "at the edge of a serene mountain lake in morning mist",
      "resting on a pile of dusty ancient books inside a sunlit library",
      "in an enchanted glade where giant glowing mushrooms grow",
      "submerged in turquoise cavern waters illuminated by sunbeams",
      "perched high atop a snow-dusted cathedral spire at sunset",
      "in a volcanic basalt canyon with glowing red lava veins",
      "amidst a field of glowing night lilies under a crescent moon",
      "inside a hollowed giant redwood tree lined with soft moss",
      "on a floating island amidst golden morning clouds"
    ],
    actions: [
      "drinking calmly from a crystal-clear reflection pool",
      "curled up asleep while blowing tiny wisps of colorful smoke",
      "stretching wings wide to catch the golden rays of dawn",
      "guarding an ancient glowing rune stone buried in moss",
      "leaping gracefully across a wide chasm between rocky cliffs",
      "curiously investigating a glowing floating orb of light",
      "shaking off crystalline frost after a sudden winter breeze",
      "watching a swarm of glowing fireflies dance through the air"
    ],
    twists: [
      "with flowers and small vines blossoming directly from its spine",
      "its scales reflecting an entire starry galaxy in deep blue and purple",
      "wearing a brass armored collar engraved with ancient symbols",
      "casting a shadow that moves independent of its body",
      "surrounded by floating rings of soft golden light",
      "leaving frosted ice crystals wherever its paws touch the ground"
    ]
  },

  "Environment & Landscapes": {
    subjects: [
      "an ancient overgrown stone temple ruin",
      "a forgotten sunken city buried under turquoise sea waters",
      "a cozy cliffside village with winding cobblestone paths",
      "a vast sea of clouds at sunset with floating islands",
      "a misty pine forest intersected by a glass-like river",
      "a dramatic canyon with towering basalt columns and waterfalls",
      "an autumnal birch woodland bathed in warm golden light",
      "a glowing bioluminescent cave with underground pools",
      "a serene Japanese zen garden after a fresh rainfall",
      "a desert oasis with palm trees and ancient sandstone arches",
      "a snow-capped mountain pass with a lonely traveler shrine",
      "a field of giant glowing poppies beneath a twilight sky"
    ],
    settings: [
      "under the soft golden light of a setting autumn sun",
      "shrouded in thick dramatic mountain fog during early dawn",
      "illuminated by the gentle glow of a full moon and starry sky",
      "during a warm summer rain shower with reflections everywhere",
      "at the break of day as shafts of sunlight slice through trees",
      "under a vibrant pink and purple aurora borealis"
    ],
    actions: [
      "where cascading waterfalls carve paths through emerald moss",
      "where wind sweeps fallen crimson leaves across stone pathways",
      "where gentle ripples spread across the mirror-like water surface",
      "where shafts of volumetric light illuminate drifting dust specks",
      "where ancient stone steps wind upwards into hidden mist"
    ],
    twists: [
      "featuring giant ancient sword blades buried deep in the landscape",
      "with glowing rune stones lining the forgotten stone walkways",
      "where water flows upwards in soft magical currents",
      "with paper lanterns hanging from weeping willow branches"
    ]
  },

  "Sci-Fi & Cyberpunk": {
    subjects: [
      "a neon-drenched street market in a futuristic metropolis",
      "a sleek orbital space station corridor with earth views",
      "a cybernetic street runner pausing on a rain-slicked roof",
      "a futuristic hacker den filled with glowing holographic displays",
      "a high-speed hovercraft racing through a canyon of skyscrapers",
      "a robotic mechanic repair bay with suspended android limbs",
      "a cyberpunk food stall serving steaming noodles under neon signs",
      "an abandoned terraforming colony on a red desert planet",
      "a futuristic greenhouse garden inside a glass dome on Mars",
      "a cyborg bounty hunter resting in a dimly lit retro synth bar"
    ],
    settings: [
      "during a heavy nocturnal rainstorm with neon reflections on asphalt",
      "in the deep silence of low Earth orbit with brilliant planetary sunrise",
      "inside a dense subterranean city layer beneath towering mega-structures",
      "at sunset on a dusty rust-colored alien desert world"
    ],
    actions: [
      "illuminated by flickering holographic advertisements in pink and cyan",
      "surrounded by hovering repair drones emitting blue diagnostic lasers",
      "adjusting a glowing visor while scanning complex data streams",
      "connecting fiber optic cables to a high-tech central terminal"
    ],
    twists: [
      "with subtle geometric circuitry patterns glowing beneath polished metal",
      "featuring a vintage vinyl record player setup inside a futuristic lab",
      "with rain droplets deflecting off an invisible energy barrier field"
    ]
  },

  "Fantasy Worlds": {
    subjects: [
      "a floating island kingdom anchored by massive golden chains",
      "a crystal spire citadel rising out of a sea of clouds",
      "a wizard's tower filled with floating books and glowing globes",
      "an ancient tree of life whose roots stretch across a valley",
      "a sunken dragon temple illuminated by underwater crystals",
      "a celestial bridge constructed from solid starlight across a void",
      "a fairy market nestled inside the hollow of a giant oak tree",
      "a dark sorcerer's castle perched on an active lava ridge"
    ],
    settings: [
      "under twin moons in a deep violet midnight sky",
      "at the golden hour of dawn when magical energy glows brightest",
      "during a magical eclipse that turns the sky deep crimson"
    ],
    actions: [
      "where rivers of liquid starlight flow gently over crystal rocks",
      "where floating spell books drift lazily between carved marble arches",
      "where ethereal spirits in soft blue light glide through the air"
    ],
    twists: [
      "surrounded by floating stone monoliths carved with glowing runes",
      "where giant pastel bubbles drift through the air carrying tiny lights"
    ]
  },

  "Historical Environments": {
    subjects: [
      "a 19th-century Parisian street after a fresh spring rain",
      "a medieval marketplace bustling with merchants and colorful stalls",
      "a traditional Japanese tea house surrounded by cherry blossoms",
      "an ancient Roman forum bathed in afternoon Mediterranean sun",
      "a Victorian library with velvet armchairs and gas lamps",
      "a Viking longhouse interior with a central blazing fire hearth"
    ],
    settings: [
      "under the warm ambient glow of vintage street gas lamps",
      "at golden sunset with reflections gleaming on wet cobblestones",
      "on a quiet snowy morning in an ancient stone courtyard"
    ],
    actions: [
      "where horse-drawn carriages leave track marks on wet stone",
      "where steam rises softly from hot copper tea kettles",
      "where merchants display hand-woven textiles and brass wares"
    ],
    twists: [
      "with detailed period-accurate clothing textures and architectural trim",
      "lit by soft warm candlelight casting rich deep shadow gradients"
    ]
  },

  "Cozy & Whimsical": {
    subjects: [
      "a cute little frog wearing a tiny yellow raincoat and rain boots",
      "a cozy bakery run by a friendly bear wearing an apron",
      "a mouse asleep inside a hollowed-out teacup with a blanket",
      "a hedgehog carrying red autumn apples on its back through leaves",
      "a kitten sitting on a windowsill watching rain fall outside",
      "a tiny cottage built inside a giant red-spotted mushroom"
    ],
    settings: [
      "inside a warm sunlit kitchen smelling of fresh cinnamon pastries",
      "under a leaf umbrella during a gentle warm spring shower",
      "in a miniature garden surrounded by oversized dandelions and daisies"
    ],
    actions: [
      "happily sipping a hot mug of cocoa with tiny marshmallow cubes",
      "reading a miniature fairy tale book using a firefly for light",
      "baking fresh blueberry pies on a wooden counter"
    ],
    twists: [
      "with tiny string lights woven through climbing sweet-pea vines",
      "wearing tiny hand-knitted woolen scarves and mittens"
    ]
  },

  "Dark Fantasy & Horror": {
    subjects: [
      "a mysterious hooded traveler at a ruined castle gate at midnight",
      "an ancient stone gargoyle weeping liquid silver under a full moon",
      "a dark necromancer surrounded by floating bone runes",
      "a haunted Gothic cathedral with shattered stained glass windows",
      "a spectral phantom coach pulled by shadowy skeletal horses"
    ],
    settings: [
      "shrouded in heavy nocturnal graveyard mist and cold moonlight",
      "lit by eerie emerald torch fire flickering against crumbling stone"
    ],
    actions: [
      "holding a brass lantern that casts long haunting shadows",
      "whispering ancient incantations as dark smoke coils through the air"
    ],
    twists: [
      "surrounded by swarms of black crows taking flight into the night",
      "with dark thorns and withered black roses creeping over the ground"
    ]
  }
};

// Global fallback arrays for general composition & lighting
const GLOBAL_LIGHTINGS = [
  "soft warm golden hour sunlight with gentle volumetric rays",
  "dramatic cinematic chiaroscuro with high contrast deep shadows",
  "cool ethereal moonlight filtering through morning fog",
  "vibrant bioluminescent glow in deep cyan, turquoise, and magenta",
  "cozy warm candle light casting soft orange flickering highlights",
  "diffused overcast daylight with soft natural shadow falloff",
  "neon cyan and neon pink rim lighting reflecting on dark surfaces",
  "dappled sunlight slicing through a dense canopy of leaves"
];

const GLOBAL_MOODS = [
  "serene and peaceful",
  "mysterious and magical",
  "cozy and comforting",
  "dramatic and intense",
  "whimsical and playful",
  "melancholic and reflective",
  "majestic and awe-inspiring",
  "nostalgic and warm"
];

const GLOBAL_COLOR_PALETTES = [
  "warm terracotta, amber gold, and soft cream",
  "deep indigo blue, emerald green, and gold accents",
  "soft pastel tones with muted sage and blush pink",
  "monochromatic graphite with a single vibrant focal color",
  "rich earthy autumn palette of burnt sienna and ochre",
  "vibrant cyberpunk neon cyan, magenta, and dark charcoal"
];

const GLOBAL_PERSPECTIVES = [
  "a wide-angle cinematic perspective establishing deep environment scale",
  "a dramatic low-angle view looking upward to emphasize height and majesty",
  "an intimate eye-level shot focused sharply on intricate foreground details",
  "a top-down bird's-eye view capturing rhythmic layout and composition"
];

const TITLE_ADJECTIVES = [
  "The Silent", "The Golden", "The Forgotten", "The Luminous",
  "The Celestial", "The Ancient", "The Enchanted", "The Clockwork",
  "The Misty", "The Emerald", "The Crimson", "The Whispering",
  "The Sacred", "The Wandering", "The Spectral", "The Solitary"
];

const TITLE_NOUNS = [
  "Wanderer", "Sanctuary", "Guardian", "Solitude", "Horizon",
  "Passage", "Citadel", "Echo", "Haven", "Odyssey", "Glow",
  "Archive", "Relic", "Vision", "Chronicle", "Realm"
];

export class SmartPromptEngine {
  /**
   * Generates a completely unique, highly descriptive drawing prompt.
   */
  public static generate(options: SmartPromptOptions = {}): GeneratedPromptResult {
    let cat = options.category;
    if (!cat || cat === "random" || cat === "General Inspiration") {
      const keys = Object.keys(CATEGORY_VOCABULARY);
      cat = getRandomItem(keys);
    }

    // Retrieve vocabulary for category, fallback to Character Design if missing
    const vocab = CATEGORY_VOCABULARY[cat] || CATEGORY_VOCABULARY["Character Design"];

    // Try up to 10 times to get a unique hash that hasn't been generated recently
    let attempts = 0;
    let selectedSubject = "";
    let selectedSetting = "";
    let selectedAction = "";
    let selectedTwist = "";
    let selectedLighting = "";
    let selectedMood = "";
    let selectedPalette = "";
    let selectedPerspective = "";
    let hash = "";

    while (attempts < 10) {
      selectedSubject = (options.wheelState?.subject && options.wheelState.subject !== "Any")
        ? options.wheelState.subject
        : getRandomItem(vocab.subjects);

      selectedSetting = (options.wheelState?.location && options.wheelState.location !== "Any")
        ? options.wheelState.location
        : getRandomItem(vocab.settings);

      selectedAction = getRandomItem(vocab.actions);

      selectedTwist = (options.wheelState?.twist && options.wheelState.twist !== "Any")
        ? options.wheelState.twist
        : getRandomItem(vocab.twists);

      selectedLighting = (options.filters?.lighting && options.filters.lighting !== "Any")
        ? options.filters.lighting
        : (options.wheelState?.lighting && options.wheelState.lighting !== "Any")
          ? options.wheelState.lighting
          : getRandomItem(GLOBAL_LIGHTINGS);

      selectedMood = (options.filters?.mood && options.filters.mood !== "Any")
        ? options.filters.mood
        : (options.wheelState?.mood && options.wheelState.mood !== "Any")
          ? options.wheelState.mood
          : getRandomItem(GLOBAL_MOODS);

      selectedPalette = (options.filters?.colorPalette && options.filters.colorPalette !== "Any")
        ? options.filters.colorPalette
        : getRandomItem(GLOBAL_COLOR_PALETTES);

      selectedPerspective = (options.filters?.perspective && options.filters.perspective !== "Any")
        ? options.filters.perspective
        : getRandomItem(GLOBAL_PERSPECTIVES);

      hash = `${selectedSubject}|${selectedSetting}|${selectedAction}|${selectedTwist}|${selectedLighting}`;
      if (!recentPromptHashes.has(hash)) {
        recentPromptHashes.add(hash);
        if (recentPromptHashes.size > MAX_RECENT_HASHES) {
          const firstItem = recentPromptHashes.values().next().value;
          if (firstItem) recentPromptHashes.delete(firstItem);
        }
        break;
      }
      attempts++;
    }

    // Build the prompt text based on length preference
    const length = options.lengthPreference || "standard";
    let promptText = "";

    // Sentence 1: Core Subject, Action & Setting
    let sentence1 = `A ${selectedMood} scene depicting ${selectedSubject}, ${selectedAction} ${selectedSetting}.`;
    if (options.filters?.action && options.filters.action !== "Any") {
      sentence1 = `A ${selectedMood} artwork featuring ${selectedSubject} performing ${options.filters.action.toLowerCase()}, ${selectedSetting}.`;
    }

    // Sentence 2: Lighting, Story Twist & Details
    let sentence2 = `The piece is illuminated by ${selectedLighting.toLowerCase()}, with the character ${selectedTwist}.`;
    if (cat.includes("Environment") || cat.includes("Landscape") || cat.includes("World") || cat.includes("Sci-Fi")) {
      sentence2 = `The atmosphere is bathed in ${selectedLighting.toLowerCase()}, ${selectedTwist}.`;
    }

    // Sentence 3: Composition, Palette & Constraints
    let sentence3 = `Framed from ${selectedPerspective.toLowerCase()}, using a refined palette of ${selectedPalette.toLowerCase()}.`;

    // Apply custom keywords or constraints if provided
    if (options.customKeywords && options.customKeywords.trim()) {
      sentence3 += ` Incorporate these artist elements: ${options.customKeywords.trim()}.`;
    }
    if (options.filters?.constraints && options.filters.constraints !== "Any") {
      sentence3 += ` Artistic focus: ${options.filters.constraints}.`;
    }

    if (length === "micro") {
      promptText = `${sentence1} Lit by ${selectedLighting.toLowerCase()}, ${selectedTwist}.`;
    } else if (length === "detailed") {
      promptText = `${sentence1} ${sentence2} ${sentence3} Emphasize rich surface textures, form rendering, and clean light-to-shadow transitions.`;
    } else {
      promptText = `${sentence1} ${sentence2} ${sentence3}`;
    }

    // Generate Poetic Title
    let title = `${getRandomItem(TITLE_ADJECTIVES)} ${getRandomItem(TITLE_NOUNS)}`;
    if (Math.random() > 0.5) {
      const subjectWord = selectedSubject.replace(/^(a|an|the)\s+/i, "").split(" ")[0];
      const capitalizedWord = subjectWord.charAt(0).toUpperCase() + subjectWord.slice(1);
      title = `${capitalizedWord} of ${getRandomItem(TITLE_NOUNS)}`;
    }

    return {
      title,
      prompt: promptText,
      category: options.category || cat || "General Inspiration",
    };
  }

  /**
   * Generates a daily spotlight prompt based on the date string
   */
  public static getDaily(dateStr: string): GeneratedPromptResult {
    // Generate deterministic seed from date
    let hashNum = 0;
    for (let i = 0; i < dateStr.length; i++) {
      hashNum = (hashNum << 5) - hashNum + dateStr.charCodeAt(i);
      hashNum |= 0;
    }
    const absHash = Math.abs(hashNum);

    const keys = Object.keys(CATEGORY_VOCABULARY);
    const cat = keys[absHash % keys.length];
    const vocab = CATEGORY_VOCABULARY[cat];

    const subject = vocab.subjects[absHash % vocab.subjects.length];
    const setting = vocab.settings[(absHash + 1) % vocab.settings.length];
    const action = vocab.actions[(absHash + 2) % vocab.actions.length];
    const twist = vocab.twists[(absHash + 3) % vocab.twists.length];
    const lighting = GLOBAL_LIGHTINGS[(absHash + 4) % GLOBAL_LIGHTINGS.length];

    const promptText = `A daily spotlight artwork depicting ${subject}, ${action} ${setting}. Bathed in ${lighting}, ${twist}.`;
    const subjectWord = subject.replace(/^(a|an|the)\s+/i, "").split(" ")[0];
    const capitalizedWord = subjectWord.charAt(0).toUpperCase() + subjectWord.slice(1);

    return {
      title: `Daily Focus: ${capitalizedWord}`,
      prompt: promptText,
      category: "Daily Spotlight",
    };
  }

  /**
   * Generates a fresh creative remix of an existing prompt.
   */
  public static remix(existingPrompt: string, category?: string): GeneratedPromptResult {
    const twists = [
      "reimagined in a vibrant futuristic cyberpunk metropolis with neon pink and cyan light reflections on rain-slicked streets.",
      "transformed into a serene underwater domain with sunbeams streaming through deep turquoise ocean water.",
      "set on a high snow-covered mountain peak under a brilliant starry midnight galaxy.",
      "rendered with dramatic warm candlelight, deep atmospheric shadows, and rich classical oil paint brushwork.",
      "placed inside a cozy overgrown greenhouse filled with climbing ivy, ferns, and glowing fairy lights.",
      "reinterpreted as a soft pastel watercolor painting with loose expressive ink washes and soft paint bleeds."
    ];

    const randomTwist = getRandomItem(twists);
    // Strip previous remix tags if present
    const cleanBase = existingPrompt.split(" — ")[0].trim();
    const remixedText = `${cleanBase} — Reimagined ${randomTwist}`;

    return {
      title: "Remixed Concept",
      prompt: remixedText,
      category: category || "Remix Studio",
    };
  }

  /**
   * Expands an existing prompt with extra environmental and artistic details.
   */
  public static expand(existingPrompt: string): { prompt: string } {
    const expansions = [
      "Focus on adding clear environment depth: introduce distant mountain silhouettes, volumetric light rays, and soft morning mist.",
      "Add storytelling details: scatter small personal items nearby, such as a brass lantern, a leather-bound journal, or a steaming copper cup.",
      "Highlight rich surface textures: pair weathered stone or smooth polished wood with soft flowering moss and warm directional sunlight."
    ];

    const randomExpansion = getRandomItem(expansions);
    return {
      prompt: `${existingPrompt}\n\nArtistic Details & Depth: ${randomExpansion}`,
    };
  }
}
