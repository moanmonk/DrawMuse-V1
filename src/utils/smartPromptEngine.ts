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
  provider?: string;
}

// Memory buffer of recently generated prompt signatures to ensure ZERO repetition
const recentPromptHashes = new Set<string>();
const MAX_RECENT_HASHES = 500;

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Massive, exhaustive vocabulary database for all 34 artist category sections
export const CATEGORY_VOCABULARY: Record<
  string,
  {
    subjects: string[];
    settings: string[];
    actions: string[];
    twists: string[];
  }
> = {
  // --- CHARACTER & CREATURES ---
  "Character Design": {
    subjects: [
      "a weary clockwork wanderer adorned with brass gear trinkets and oiled leather robes",
      "a wandering potion herbalist carrying a wicker pack bursting with luminous glass vials",
      "a masked royal assassin in velvet silk attire holding a delicate silver stiletto dagger",
      "a veteran starship mechanic wiping engine grease onto torn denim overalls under neon light",
      "a nomadic desert stargazer wearing wind-blown indigo drapes and carrying a brass astrolabe",
      "a retired lighthouse keeper wrapped in a heavy wool coat, smoking a long briar pipe",
      "a young apprentice wizard clutching a spellbook larger than their torso with floating pages",
      "a solemn forest archer wearing woven bark armor and carrying a recurve yew bow",
      "an eccentric antique clockmaker surrounded by ticking pendulum walls and brass magnifying goggles",
      "a traveling street musician playing a worn oak lutina decorated with dried floral ribbons",
      "a cyberpunk rooftop courier with glowing chrome ocular implants and a reflective windbreaker",
      "a Victorian moth researcher wearing a velvet waistcoat and brass pin-cushion spectacles",
      "a quiet tea master in traditional ceremonial kimono carefully warming clay teapots",
      "a tavern storyteller leaning over a roaring hearth with dramatic hand gestures",
      "a shadow weaver sorcerer drawing ribbons of dark violet ink from a floating obsidian sphere",
      "a deep-sea diver in a heavy vintage copper helmet with a glowing underwater search lantern",
      "a royal knight scholar wearing silver engraved plate armor over embroidered velvet tunics",
      "a sun-baked cartographer unrolling massive parchment maps across a rough oak workbench",
      "a wandering monk carrying a tall wooden staff adorned with ringing brass prayer bells",
      "a mechanical dollmaker carefully adjusting delicate porcelain joints with tiny brass screwdrivers",
      "a ghost hunter holding a glowing spirit lantern and a leather-bound notebook of banishment runes",
      "a sky-captain aeronaut in a high-collared leather aviator jacket and brass flight goggles",
      "a celestial constellation mapper wearing robes patterned after the night sky with silver thread",
      "a forest herbalist with soft red fox ears grinding dried lavender in a stone mortar",
      "a blind weapon smith holding a glowing heated blade over a heavy steel anvil by ear alone",
      "a Victorian herbalist apothecary organizing amber glass jars on floor-to-ceiling oak shelves",
      "a steampunk train engineer pulling a heavy steam valve while covered in soot and brass dust",
      "a sun elf gardener tending to glowing crystalline orchids inside a domed greenhouse",
      "a desert falconer with an obsidian-beaked hunting hawk perched on an embroidered leather gauntlet",
      "a deep forest ranger crouching quietly behind mossy oak roots with a drawn feather arrow"
    ],
    settings: [
      "in a snowy pine forest at twilight under a pale silver crescent moon",
      "inside a cozy wooden cabin filled with dried herb bundles hanging from timber beams",
      "on an overgrown stone balcony overlooking a stormy sea with crashing white foam",
      "in a neon-lit alleyway in a rainy metropolis with glowing rain puddle reflections",
      "inside a grand vaulted library with spiral staircases and towering leather-bound shelves",
      "at an ancient crossroads beneath a giant gnarled oak tree draped in glowing lanterns",
      "in a sunlit greenhouse filled with exotic tropical ferns, climbing ivy, and mist",
      "upon a windy coastal cliff beside a towering whitewashed stone lighthouse",
      "inside a cluttered clockwork repair workshop littered with gears, springs, and blueprints",
      "at a bustling night market surrounded by glowing silk lanterns and steaming food stalls",
      "in a forgotten sanctuary hidden deep within a tranquil bamboo grove with stone stupas",
      "on a rusty airship deck high above a rolling sea of sunset-gilded clouds",
      "inside a moonlit stone ruin covered in creeping ivy and wild white roses",
      "in a quiet underground cavern illuminated by veins of glowing blue crystal clusters",
      "at a rustic roadside tavern fireplace with crackling amber embers and oak furniture",
      "in a sun-dappled cobblestone courtyard surrounded by terracotta pots and climbing vines",
      "inside a dimly lit alchemist laboratory filled with bubbling glass retorts and glowing liquids",
      "on a wooden dock stretching into a mist-shrouded mountain lake at early morning dawn"
    ],
    actions: [
      "holding a small brass lantern that lights up the surrounding darkness with a warm golden amber glow",
      "carefully inspecting a glowing glass vial filled with swirling luminous azure liquid",
      "adjusting a weathered leather cloak as a sudden cold autumn gust catches the frayed edges",
      "sketching intricate anatomical diagrams into a worn leather journal with a graphite pencil",
      "sharpening an ornate damascus dagger with steady, focused concentration on a wet whetstone",
      "brewing a steaming cup of herbal tea over a small copper stove while listening to rain",
      "reading a dusty ancient scroll by the gentle light of a flickering beeswax candle",
      "tuning a carved wooden string instrument with practiced fingers and a listening posture",
      "reaching out to touch a floating speck of magical light drifting through the quiet room",
      "resting against a mossy stone pillar while gazing thoughtfully out toward the far horizon",
      "fastening a set of intricate brass flight goggles over their eyes before steping into wind",
      "feeding a tiny glowing spirit bird perched gently on their gloved fingers",
      "examining a complex star chart with a pair of brass calipers under hanging oil lamps",
      "weaving glowing golden threads between their fingers to mend a tear in an ancient shroud"
    ],
    twists: [
      "wearing a heavy coat intricately embroidered with glowing silver constellation maps that shimmer",
      "accompanied by a loyal little mechanical clockwork owl perched on their leather shoulder pad",
      "with subtle golden glowing arcane patterns traced delicate along the skin of their hands",
      "holding a vintage brass compass whose needle spins erratically toward nearby magical energy",
      "surrounded by floating paper lanterns casting warm orange and pink shadows across the scene",
      "leaving a gentle trail of luminous blue embers whenever their boots press into the ground",
      "with a pocket watch that displays celestial planetary orbits instead of standard hours",
      "wearing a dark velvet scarf adorned with polished raven feathers and silver talismans",
      "wrapped in an overgrown woven mantle where tiny living wildflowers bloom directly from the fabric",
      "casting a soft shadow on the stone wall behind them that mimics a majestic horned creature"
    ]
  },

  "Creature Design": {
    subjects: [
      "a majestic crystal-antlered forest stag with moss-covered velvet hide",
      "a playful baby shadow dragon with iridescent obsidian scales and tiny smoke puffs",
      "a towering moss-covered forest guardian spirit shaped like an ancient walking oak tree",
      "a bioluminescent deep-sea leviathan with glowing turquoise barbels and translucent fins",
      "a phoenix with iridescent sapphire feathers that leave trails of cool silver sparks",
      "a winged panther with horned owl feathers, soft fur, and razor-sharp talons",
      "a subterranean glass-shelled tortoise with glowing internal amber magma veins",
      "a celestial nine-tailed fox with starlight constellation trails weaving through its fur",
      "a stone gargoyle coming to life as lichen and cracks crumble off its muscular shoulders",
      "a serpent woven from flowing river water, lotus blossoms, and shimmering fish scales",
      "a giant fluffy moth creature with velvet antennae and silk patterned wings resting on bark",
      "a crystal-scaled desert drake basking on sun-warmed red sandstone arches",
      "an antlered tundra wolf guardian with frosted white fur and icy blue eyes",
      "a miniature teacup dragon curled around a warm ceramic cup with steam swirling",
      "a spectral stag woven from starlight, drifting weightlessly above a quiet woodland pool",
      "a coral-scaled sea griffin with eagle talons and iridescent fish tail fins",
      "a thunderbird with storm-cloud feathers crackling with gentle blue static sparks",
      "a cave salamander made of jagged amethyst crystal clusters and smooth basalt stone",
      "a swamp hydra with lilypad skin and mossy snouts peering out of murky water"
    ],
    settings: [
      "at the edge of a serene mountain lake in morning mist with perfect mirror reflections",
      "resting on a pile of dusty ancient leather-bound books inside a sunlit archive room",
      "in an enchanted glade where giant glowing violet mushrooms illuminate the dark soil",
      "submerged in turquoise cavern waters bathed in golden sunbeams slicing through a ceiling sinkhole",
      "perched high atop a snow-dusted cathedral gargoyle spire at sunset overlooking a valley",
      "in a volcanic basalt canyon with glowing red lava veins pulsing softly in dark stone",
      "amidst a field of glowing night lilies under a bright pale crescent moon and starry sky",
      "inside a hollowed giant redwood tree trunk lined with soft emerald moss and fireflies",
      "on a floating mossy island suspended amidst golden morning cloud banks high in the sky"
    ],
    actions: [
      "drinking calmly from a crystal-clear reflection pool while soft ripples spread outward",
      "curled up asleep while blowing tiny wisps of colorful iridescent smoke from its nostrils",
      "stretching broad wings wide to catch the warm golden rays of a rising morning sun",
      "guarding an ancient glowing rune stone buried deep in overgrown ferns and ivy",
      "leaping gracefully across a wide chasm between jagged mossy rocky cliffs",
      "curiously investigating a glowing floating orb of magical light hovering in the air",
      "shaking off crystalline frost from its mane after a sudden cold winter mountain breeze",
      "watching a playful swarm of glowing gold fireflies dance through the quiet night air"
    ],
    twists: [
      "with colorful wild lilies and trailing vines blossoming directly along its spine",
      "its scales reflecting an entire starry galaxy in deep indigo, purple, and silver tones",
      "wearing an ornate brass armored collar engraved with ancient protective runes",
      "casting a soft shadow on the ground that moves independent of its physical body",
      "surrounded by floating concentric rings of soft warm golden light and floating dust",
      "leaving frosted ice crystal patterns wherever its paws press into the soft earth"
    ]
  },

  "Animal Studies": {
    subjects: [
      "a snow leopard mid-leap across a jagged, ice-slicked mountain ridge in a blizzard",
      "a majestic red fox pausing in a sunlit birch forest with its tail brushed against snow",
      "a barn owl perched motionless on a weathered fence post under a pale twilight sky",
      "a grizzly bear standing in a roaring river catching a leaping salmon with splashing water",
      "a majestic royal stag with a 12-point rack standing in a misty autumnal fern grove",
      "a sea otter floating calmly on its back in kelp beds cradling a smooth sea stone",
      "a raven perched on a mossy gravestone holding a shiny brass key in its beak",
      "a family of emperor penguins standing huddled together against swirling polar ice winds",
      "a chameleon blended into tropical palm bark with eyes turned in opposing directions",
      "a cheetah resting on an acacia branch overlooking vast golden African savannah grasslands"
    ],
    settings: [
      "in a dense mountain forest bathed in golden morning light breaking through tree trunks",
      "along a rocky coastal shore with crashing white waves and spray under dramatic clouds",
      "in a quiet autumn forest carpeted in crimson and golden amber fallen leaves",
      "on a sun-baked desert plain with acacia tree silhouettes against a fiery orange sunset"
    ],
    actions: [
      "captured in mid-motion with extreme muscular anatomy focus and crisp fur detail",
      "preening soft feathers meticulously while perched on a lichen-covered birch branch",
      "scanning the vast horizon with intense amber eyes locked onto a distant movement",
      "pouncing gracefully through deep powdery snow with tail outstretched for balance"
    ],
    twists: [
      "rendered with anatomical precision highlighting bone structure, fur direction, and light rim",
      "framed with a soft-focus depth of field that makes the subject pop with lifelike realism"
    ]
  },

  "Creature Hybrids": {
    subjects: [
      "a owl-panther chimera with sleek black fur, razor talons, and massive golden owl eyes",
      "a dragon-carp hybrid with iridescent ruby scales, long whisker barbels, and fan fins",
      "a wolf-crow hybrid with feathered wings along its flanks and obsidian taloned paws",
      "a stag-beetle centaur creature with iridescence on its shell and mossy wooden antlers",
      "a lion-scorpion sphinx guarding an ancient sandstone desert temple doorway",
      "a fox-peacock hybrid with a magnificent trailing tail of iridescent sapphire eyespots"
    ],
    settings: [
      "perched stealthily on an ancient carved stone archway covered in climbing ivy",
      "submerged up to its chest in a tranquil lilypad pond illuminated by moonbeams",
      "crouched high in the canopy branches of a ancient rainforest draped in orchids"
    ],
    actions: [
      "coiled stealthily, ready to strike while its eyes catch a sharp golden glint of light",
      "grooming its hybrid plumage with slow methodical care atop a weathered boulder"
    ],
    twists: [
      "seamlessly blending mammalian fur, avian feathers, and reptilian scale textures",
      "with dual-colored heterochromia eyes that glow softly in dark ambient light"
    ]
  },

  "Portraits": {
    subjects: [
      "a weathered sea captain with salt-stained skin, deep wrinkles, and piercing gray eyes",
      "a young Renaissance noblewoman with braided amber hair wearing an embroidered velvet gown",
      "a cyberpunk cyborg girl with glowing cyan fiber-optic freckles and asymmetrical hair",
      "an elderly tribal elder with silver braided hair and painted clay ritual markings",
      "a sun-dappled freckled gardener wearing a wide straw hat with wildflowers tucked in the band",
      "a warrior knight with a prominent cheek scar, heavy jawline, and steel gorget collar",
      "a desert nomad with intense dark eyes peering out from a draped indigo cotton scarf",
      "a jazz trumpeter with closed eyes, sweat glinting on temple, under a smoky blue spotlight"
    ],
    settings: [
      "under dramatic side-lighting (chiaroscuro) casting deep atmospheric shadow falloff",
      "bathed in soft diffused window daylight beside an old wooden frame with sheer curtains",
      "lit by warm golden hour sunlight coming from a 45-degree angle creating rich skin tones"
    ],
    actions: [
      "gazing thoughtfully directly into the viewer with a subtle, expressive hint of emotion",
      "turned in three-quarter view with sharp focal focus on the eyes and softer background blur"
    ],
    twists: [
      "emphasizing skin texture, subsurface scattering on ear edges, and glinting iris highlights",
      "framed with expressive classical oil paint brushstrokes or clean digital gouache rendering"
    ]
  },

  "Character Expressions": {
    subjects: [
      "a young wizard experiencing wide-eyed joyful surprise as a magic spell bursts into star clusters",
      "a veteran general with a grim, resolute expression and tight jaw under heavy rain",
      "a mischievous rogue sporting a lopsided smirking grin while holding a lifted gold coin",
      "a heartbroken prince with tear-glistening eyes reflecting a flickering candle flame",
      "an ecstatic inventor laughing triumphantly as a copper automaton hums to life with sparks"
    ],
    settings: [
      "focused closely on micro-expressions, facial muscle tension, eyebrow angles, and eye glints",
      "framed in a tight portrait crop against a dark neutral atmospheric background"
    ],
    actions: [
      "capturing the precise peak moment of intense emotional reaction and facial energy",
      "showing dynamic shift from calm surprise to open wonderment across eyes and mouth"
    ],
    twists: [
      "lit by a single dramatic directional light source to emphasize expressive face contours",
      "with subtle skin flush, eye moisture reflections, and dynamic eyebrow arch"
    ]
  },

  "Character Poses": {
    subjects: [
      "a martial artist executing a dynamic airborne spin kick with flowing silk sash ribbons",
      "a dancer frozen mid-leap in a graceful ballet jeté with outstretched fingertips",
      "a sword master dropping into a low crouched stance with blade drawn back along the hip",
      "an archer leaning back at an angle drawing a heavy bowstring to full tension",
      "a superhero landing heavily in a 3-point stance with ground dust billowing outward"
    ],
    settings: [
      "drawn with strong dynamic action lines, foreshortening, weight distribution, and balance",
      "framed against a clean directional grid background or subtle atmospheric dust"
    ],
    actions: [
      "emphasizing gesture flow, foreshortened limbs, and weight transferring through the feet",
      "capturing fluid secondary motion in hair, clothing drapery, and trailing sashes"
    ],
    twists: [
      "using extreme foreshortening on the lead hand to push dramatic depth towards viewer",
      "with high-contrast silhouette clarity so the pose reads instantly at a glance"
    ]
  },

  // --- ENVIRONMENTS & WORLD ---
  "Environment & Landscapes": {
    subjects: [
      "an ancient overgrown stone temple ruin hidden deep within a tropical rainforest",
      "a forgotten sunken city buried under turquoise sea waters with coral growing on towers",
      "a cozy cliffside coastal village with winding cobblestone paths and whitewashed cottages",
      "a vast sea of rolling clouds at sunset with floating mossy stone islands and bridges",
      "a misty alpine pine forest intersected by a glass-like river reflecting mountain peaks",
      "a dramatic volcanic canyon with towering basalt columns and cascading blue waterfalls",
      "an autumnal birch woodland bathed in warm golden light with amber leaves falling",
      "a glowing bioluminescent cave with underground crystal pools and stalactite ceilings",
      "a serene Japanese zen garden after a fresh spring rainfall with wet stone lanterns",
      "a desert oasis with date palm trees, reflecting turquoise pool, and sandstone arches",
      "a snow-capped mountain pass with a lonely wooden traveler shrine draped in prayer flags",
      "a field of giant glowing purple poppies beneath a twilight sky filled with two moons"
    ],
    settings: [
      "under the soft golden light of a setting autumn sun casting long purple shadows",
      "shrouded in thick dramatic mountain fog during early morning dawn with soft light rays",
      "illuminated by the gentle silver glow of a full moon and twinkling starlight galaxy",
      "during a warm summer rain shower with glass-like water puddle reflections everywhere",
      "at the break of day as shafts of volumetric sunlight slice through towering tree trunks"
    ],
    actions: [
      "where cascading waterfalls carve winding paths through emerald moss and river stones",
      "where wind sweeps fallen crimson leaves across ancient stone pathways in swirling gusts",
      "where gentle ripples spread across the mirror-like water surface reflecting sky colors",
      "where shafts of light illuminate drifting dust specks and rising mist in the damp air"
    ],
    twists: [
      "featuring giant ancient sword blades buried deep in the earth as towering monuments",
      "with glowing rune stones lining the forgotten stone walkways guiding the eyes deep into scene",
      "where water flows upwards in soft magical levitating currents toward floating clouds",
      "with paper lanterns hanging from weeping willow branches casting warm orange circles"
    ]
  },

  "Architecture": {
    subjects: [
      "a grand Gothic cathedral cathedral spire reaching into dramatic storm clouds",
      "an ancient desert fortress carved directly out of red sandstone cliffs with grand colonnades",
      "a futuristic brutalist skyscraper overgrown with hanging botanical sky gardens",
      "a Japanese pagoda perched on a cliff edge surrounded by blooming cherry blossoms",
      "a fantasy castle built atop a massive stone arch spanning across a deep ocean bay",
      "a Venetian canal palace with arched marble balconies and gondolas tied to posts"
    ],
    settings: [
      "bathed in dramatic warm late-afternoon sunlight highlighting architectural depth and relief",
      "shrouded in cool blue morning mist with soft glowing lanterns lit along stone walkways"
    ],
    actions: [
      "showcasing intricate masonry carving, perspective vanishing points, and structural rhythm",
      "framed with a dramatic 3-point perspective looking up from ground level"
    ],
    twists: [
      "with glowing stained glass windows projecting vivid kaleidoscopic color patterns onto stone",
      "where ancient carved gargoyles and relief statues line every buttress and lintel"
    ]
  },

  "Interior Design": {
    subjects: [
      "an astronomer's attic study filled with brass telescopes, star maps, and steaming tea",
      "a cozy rustic kitchen with stone hearth, hanging copper pans, and oak timber beams",
      "a dusty alchemist workshop with floor-to-ceiling apothecary shelves and potion bottles",
      "a sunlit artist loft studio with large glass skylights, paint canvases, and potted plants",
      "a Victorian tea parlor with velvet armchairs, floral wallpaper, and silver tea services"
    ],
    settings: [
      "illuminated by warm ambient candlelight and soft golden afternoon window sunlight",
      "filled with lived-in storytelling details, organized clutter, and warm color harmonies"
    ],
    actions: [
      "where dust motes float lazily through warm sunbeams breaking through tall glass panes",
      "creating an inviting, cozy atmosphere that makes the viewer feel inside the room"
    ],
    twists: [
      "featuring intricate patterned rugs, polished hardwood floor reflections, and soft blankets",
      "with steam rising gently from a porcelain cup resting beside an open handwritten book"
    ]
  },

  "Background Practice": {
    subjects: [
      "a cobblestone alleyway in autumn, framed by wet leaves, brick walls, and glowing street lamps",
      "a quiet train platform at dusk with overhead wire silhouettes and distant city lights",
      "a wooden forest bridge over a babbling brook with mossy rocks and sun dappled water",
      "a sunlit meadow path winding toward a distant windmill under fluffy white summer clouds"
    ],
    settings: [
      "focusing on atmospheric perspective, foreground framing elements, and middle-ground depth",
      "using soft value grouping to establish clear background separation and spatial distance"
    ],
    actions: [
      "guiding the viewer's eye along leading perspective lines toward a focal light source",
      "balancing detail density between crisp foreground elements and soft background values"
    ],
    twists: [
      "with rich color temperature contrast between cool blue shadows and warm golden lights",
      "framed with overhanging tree branches or archways that form a natural vignette"
    ]
  },

  "Urban Sketching": {
    subjects: [
      "a corner ramen shop in Kyoto bathed in rain puddle reflections and glowing red neon signs",
      "a busy European café terrace with striped awnings, outdoor tables, and pedestrians",
      "a bustling street market in Marrakech with hanging carpets, brass lamps, and spice stalls",
      "a vintage tram rattling along cobblestone streets flanked by pastel-colored townhouses"
    ],
    settings: [
      "captured with loose expressive ink line work and vibrant watercolor wash accents",
      "under the energetic atmosphere of a lively city afternoon with dynamic perspective"
    ],
    actions: [
      "capturing daily human activity, street architecture, and urban storytelling beats",
      "framing street vendor stalls, bicycle silhouettes, and sidewalk café life"
    ],
    twists: [
      "with wet asphalt reflections doubling the glowing neon street signage below",
      "rendered with crisp ink outlines and selective focal color spots"
    ]
  },

  "Nature Sketching": {
    subjects: [
      "gnarled ancient oak tree roots gripping a mossy riverbank near a babbling stream",
      "a cascading mountain waterfall carving through dark basalt rocks into a crystal pool",
      "a forest floor micro-scene with pine needles, glowing mushrooms, and lichen-covered bark",
      "a jagged coastal rock formation standing resilient against crashing white ocean spray"
    ],
    settings: [
      "bathed in natural dappled sunlight filtering through a leafy woodland canopy",
      "emphasizing organic wood grain textures, stone strata, and aquatic transparency"
    ],
    actions: [
      "studying organic shapes, natural symmetry, plant growth flow, and geological layers",
      "rendering delicate moss textures alongside hard rock edges and fluid water movement"
    ],
    twists: [
      "with translucent water droplets clinging to ferns and smooth river stones",
      "highlighting the contrast between rough decaying bark and fresh green moss shoots"
    ]
  },

  // --- OBJECTS & PROPS ---
  "Botanical Studies": {
    subjects: [
      "a cluster of wild blue bellflowers covered in glistening morning dew droplets",
      "a detailed study of a blooming English rose with layered translucent crimson petals",
      "an exotic monstera leaf with intricate fenestrations and natural glossy shine",
      "a botanical cross-section of a poppy seed pod showing internal symmetrical chambers",
      "a sprig of lavender and dried eucalyptus tied with a rustic twine ribbon"
    ],
    settings: [
      "placed against a neutral vintage parchment background with fine line shading",
      "lit by soft diffused natural daylight emphasizing leaf venation and petal translucency"
    ],
    actions: [
      "rendered with scientific precision, subtle color gradients, and delicate texture lines",
      "showcasing plant anatomy from bud unfolding to full bloom state"
    ],
    twists: [
      "including magnified inset circles showing microscopic leaf cell structures",
      "drawn with vintage botanical illustration styling and fine ink hatching"
    ]
  },

  "Object Design": {
    subjects: [
      "an ornate antique pocket watch powered by a glowing captured firefly inside brass housing",
      "a leather-bound wizard grimoire secured with iron clasps and glowing sapphire cabochons",
      "a vintage brass microscope with crystal lenses inspecting a glowing mineral sample",
      "a steampunk compass with multiple inner spinning rings, celestial dials, and leather strap",
      "an apothecary potion kit in a carved mahogany box with velvet slots and blown glass jars"
    ],
    settings: [
      "displayed on a polished dark oak table surface with soft warm directional studio light",
      "focusing on material rendering: polished brass, aged leather, glass transparency, and iron"
    ],
    actions: [
      "highlighting functional mechanical joints, decorative engravings, and surface wear",
      "showing orthographic callouts or exploded view angles for prop designers"
    ],
    twists: [
      "with subtle brass scratches, patina tarnishing, and glinting specular highlights",
      "emitting a gentle ambient glow from internal magical crystals or clockwork mechanisms"
    ]
  },

  "Vehicle Design": {
    subjects: [
      "a dieselpunk cargo airship anchored to a high mountain summit mooring tower",
      "a sleek retro-futuristic hover speeder bike resting outside a neon desert diner",
      "a Victorian steam locomotive with polished copper boiler pipes and snowplow grill",
      "a deep-sea exploration submersible with mechanical claw arms and search lamps",
      "a solar-sailed exploration vessel gliding through planetary rings in deep space"
    ],
    settings: [
      "parked in a gritty industrial hangar bay with dramatic rim lighting and floor oil reflections",
      "focusing on mechanical form language, rivet placement, exhaust ports, and aerodynamic silhouette"
    ],
    actions: [
      "showcasing functional industrial design, heavy mechanical mass, and engine detail",
      "capturing high-speed motion blurs or resting parked power stance"
    ],
    twists: [
      "with visible welding seams, chipped paint weathering along panel edges, and heat discoloration",
      "featuring custom hand-painted pin-up graphics or squad insignias on the nose cone"
    ]
  },

  "Weapons & Equipment": {
    subjects: [
      "a sun-forged broadsword with glowing runes along the fuller and carved ivory hilt",
      "a ceremonial elf archer bow carved from white ash with silver wire filigree wrapping",
      "a veteran adventurer's leather survival backpack loaded with bedroll, rope, and lantern",
      "a pair of daggers with obsidian blades and serpent-wrapped bronze quillons",
      "a paladin's kite shield engraved with a heraldic griffin coat of arms in gold leaf"
    ],
    settings: [
      "displayed resting on a heavy anvil or velvet armory bench under focused warm spotlight",
      "emphasizing edge sharpness, metal sheen, leather cross-stitching, and grip texture"
    ],
    actions: [
      "rendering realistic weapon balance points, crossguard proportions, and blade bevels",
      "highlighting battle wear, notch scratches on the steel, and grip patina"
    ],
    twists: [
      "with magical element energy crackling softly along the fuller channel of the blade",
      "wrapped in leather leather straps with small brass pouch attachments"
    ]
  },

  "Fashion Design": {
    subjects: [
      "an avant-garde haute couture ballgown constructed from cascading layered iridescent organza",
      "a Victorian winter coat made of heavy burgundy wool with plush faux fur collar and brass buttons",
      "a cyberpunk street-fashion outfit featuring a high-neck LED windbreaker and cargo trousers",
      "a royal ceremonial mantle embroidered with golden thread peacock feather motifs",
      "a desert traveler ensemble with draped indigo linen robes and brass armor clasps"
    ],
    settings: [
      "modeled on a mannequin or runway posture against a clean high-contrast studio backdrop",
      "focusing on fabric drape, fold tension, weave texture, seam stitching, and silhouette"
    ],
    actions: [
      "demonstrating heavy wool drop, sheer fabric translucency, and stiff metallic armor structure",
      "highlighting costume design layers from undergarments to outer cloaks"
    ],
    twists: [
      "including fabric pattern swatch circles and material texture callouts",
      "with dynamic fabric movement caught mid-swirl under studio spotlights"
    ]
  },

  // --- ARTISTIC STYLES ---
  "Digital Painting": {
    subjects: [
      "a dramatic warrior guardian standing atop a stormy cliff facing a towering sea monster",
      "a sunlit fantasy forest clearing with a glowing magical stag drinking from a pond",
      "a futuristic metropolis skyline bathed in fiery golden sunset light and hovercraft trails"
    ],
    settings: [
      "rendered with soft blended brushwork, painterly edges, and rich value hierarchies",
      "emphasizing color temperature shifts between warm highlights and cool atmospheric shadows"
    ],
    actions: [
      "utilizing digital custom brushes, textured edge controls, and atmospheric depth blurs",
      "building form through loose painterly blocking refined into crisp focal detail"
    ],
    twists: [
      "with dynamic rim lighting separating focal subjects cleanly from dark backgrounds",
      "incorporating painterly canvas texture overlays and vibrant color accents"
    ]
  },

  "Watercolor & Ink": {
    subjects: [
      "a serene Japanese koi pond with lily pads and flowing orange fish under soft water bleeds",
      "a misty mountain valley with pine tree silhouettes rendered in wet-on-wet ink washes",
      "a cozy vintage café storefront with loose watercolor color splatters and fine fountain pen lines"
    ],
    settings: [
      "featuring organic paint blooms, pigment granulations, soft edges, and delicate paper texture",
      "combining precise waterproof ink line work with loose expressive watercolor washes"
    ],
    actions: [
      "letting colors bleed naturally across damp cold-press paper surfaces",
      "balancing soft unpainted white paper negative space with dark saturated ink spots"
    ],
    twists: [
      "with spontaneous paint drips and blooms adding whimsical artistic energy",
      "framed with expressive line weight variation from thin hair lines to bold brush strokes"
    ]
  },

  "Charcoal & Graphite": {
    subjects: [
      "a dramatic portrait study of an old fisherman with deep skin furrows and silver beard",
      "a high-contrast architectural study of Gothic arches and shadow vaults",
      "a still life of weathered skulls, dripping candles, and antique leather books"
    ],
    settings: [
      "focusing on rich deep black values, smooth smudged mid-tones, and erased white highlights",
      "rendered on textured gray toned paper using willow charcoal, compressed black, and white chalk"
    ],
    actions: [
      "carving form out of dark values using kneaded erasers to pull out focal light points",
      "building intense tonal contrast and dramatic light direction across forms"
    ],
    twists: [
      "with dramatic cross-hatching and expressive smudged finger strokes",
      "framed on warm gray toned paper with bright white charcoal highlights popping"
    ]
  },

  "Comic & Manga": {
    subjects: [
      "a heroic sword fighter leaping through the air with dynamic speed lines and dramatic impact frame",
      "a mecha robot unleashing an energy beam blast across a destroyed city street",
      "a high school anime protagonist standing on a school rooftop at sunset as cherry petals blow"
    ],
    settings: [
      "drawn with bold variable line art, screen tone halftone patterns, and dynamic camera angles",
      "featuring expressive action speed lines, sound effect lettering, and panel framing"
    ],
    actions: [
      "emphasizing extreme foreshortening, exaggerated pose gesture, and high-energy pacing",
      "using dramatic black ink fills and sharp spot shadows for graphic punch"
    ],
    twists: [
      "framed in a dynamic diagonal comic book panel cutout with dramatic perspective",
      "with bold Japanese sound effect kanji drawn directly into the background composition"
    ]
  },

  "Concept Art": {
    subjects: [
      "a thumbnail exploration sheet of 4 unique sci-fi helmet silhouettes and visor options",
      "an environment keyframe design showing an alien bazaar inside a hollowed asteroid",
      "a creature keyframe showing an encounter with a swamp monster in murky green fog"
    ],
    settings: [
      "designed for film or video game production with clear readability, functional logic, and visual appeal",
      "focusing on strong silhouette design, focal point emphasis, and believable world-building"
    ],
    actions: [
      "establishing mood, scale, and lighting direction for production team reference",
      "balancing broad quick shape language with clear material texture callouts"
    ],
    twists: [
      "including human scale reference figures beside massive structures or creatures",
      "with color key variations showing day, night, and stormy lighting conditions"
    ]
  },

  "Line Art & Ink": {
    subjects: [
      "an intricate stippled illustration of an octopus entangled around a nautical anchor",
      "a detailed architectural line drawing of an elaborate Victorian glass greenhouse",
      "a fine pen-and-ink mandala pattern incorporating botanical ferns and moth wings"
    ],
    settings: [
      "created with pure black ink line art using varied nib widths, cross-hatching, and stippling",
      "emphasizing clean contour lines, line weight variation, and density hatching for shadow"
    ],
    actions: [
      "building depth solely through line density, direction, and cross-hatching technique",
      "maintaining crisp vector-like line precision across complex intricate patterns"
    ],
    twists: [
      "rendered entirely in pointillism stippling dots creating soft tonal gradients",
      "with thick bold outer silhouette outlines containing delicate thin internal detail lines"
    ]
  },

  // --- THEMES & NARRATIVE ---
  "Sci-Fi & Cyberpunk": {
    subjects: [
      "a neon-drenched street market in a futuristic metropolis under heavy nocturnal rain",
      "a sleek orbital space station corridor with panoramic views of Earth's blue horizon below",
      "a cybernetic street runner pausing on a rain-slicked skyscraper rooftop at 3 AM",
      "a futuristic hacker den filled with floating holographic displays and glowing servers",
      "a high-speed hovercraft racing through a canyon of neon-lit megastructures",
      "a robotic mechanic repair bay with suspended android limbs and diagnostic lasers",
      "a cyberpunk food stall serving steaming noodles under flickering pink and cyan signs",
      "an abandoned terraforming colony on a red dusty Martian planet under twin moons",
      "a futuristic greenhouse garden inside a reinforced glass dome on a frozen ice planet",
      "a cyborg bounty hunter resting in a dimly lit retro synthwave bar with a glowing visor"
    ],
    settings: [
      "during a heavy nocturnal rainstorm with vivid pink, cyan, and amber reflections on wet asphalt",
      "in the deep silence of low Earth orbit with brilliant planetary sunrise breaking over the hull",
      "inside a subterranean city layer beneath towering mega-corporation skyscrapers",
      "at sunset on a dusty rust-colored alien planet with strange rock spires and purple sky"
    ],
    actions: [
      "illuminated by flickering holographic advertisements and glowing fiber optic cables",
      "surrounded by hovering repair drones emitting precise blue diagnostic scan lines",
      "adjusting a glowing cybernetic eye optic while scanning complex streams of data",
      "connecting glowing cables to a high-tech central terminal core with floating code"
    ],
    twists: [
      "with subtle geometric circuitry patterns glowing beneath polished metal skin plates",
      "featuring a vintage vinyl record player setup inside a high-tech futuristic room",
      "with rain droplets deflecting off an invisible forcefield barrier around the figure"
    ]
  },

  "Fantasy Worlds": {
    subjects: [
      "a floating island kingdom anchored to the mountain below by massive golden forged chains",
      "a crystal spire citadel rising out of a vast sea of rolling sunset clouds",
      "a wizard's tower library filled with floating spellbooks and glowing celestial globes",
      "an ancient tree of life whose glowing roots stretch across an entire enchanted valley",
      "a sunken dragon temple illuminated by underwater turquoise crystals and swimming carp",
      "a celestial bridge constructed from solid starlight spanning across a cosmic void",
      "a fairy market nestled inside the hollow of a giant ancient redwood tree trunk",
      "a dark sorcerer's castle perched precariously on an active volcanic lava ridge"
    ],
    settings: [
      "under twin moons shining in a deep violet and indigo midnight sky",
      "at the golden hour of dawn when ambient magical energy sparkles through morning air",
      "during a rare magical eclipse that turns the sky deep crimson with silver solar flares"
    ],
    actions: [
      "where rivers of liquid starlight flow gently over crystal rocks casting soft light",
      "where floating spell books drift lazily between carved marble arches and staircases",
      "where ethereal spirit creatures in soft blue glow glide peacefully through the canopy"
    ],
    twists: [
      "surrounded by floating stone monoliths carved with ancient glowing blue runes",
      "where giant pastel bubbles drift through the air carrying tiny glowing firefly lights inside"
    ]
  },

  "Historical Environments": {
    subjects: [
      "a 19th-century Parisian street after a fresh spring rain with gas lamps reflecting on wet stone",
      "a bustling medieval marketplace with wooden merchant stalls, banners, and cobblestones",
      "a traditional Japanese tea house surrounded by blooming pink cherry blossoms and moss",
      "an ancient Roman forum bathed in afternoon Mediterranean sun with grand marble columns",
      "a Victorian library with deep red velvet armchairs, gas lamps, and high stained glass",
      "a Viking longhouse interior with a central blazing fire hearth and carved wooden shields"
    ],
    settings: [
      "under the warm ambient glow of vintage gas street lamps at dusk",
      "at golden sunset with reflections gleaming on wet cobblestones and carriage tracks",
      "on a quiet snowy morning in an ancient stone courtyard with rising chimney smoke"
    ],
    actions: [
      "where horse-drawn carriages leave fresh wheel tracks on wet stone streets",
      "where steam rises softly from hot copper tea kettles inside a quiet room",
      "where merchants display hand-woven textiles, brass wares, and fresh baked bread"
    ],
    twists: [
      "rendered with detailed period-accurate clothing textures, hat styles, and architecture trim",
      "lit by soft warm candlelight casting rich deep classical shadow gradients across forms"
    ]
  },

  "Cozy & Whimsical": {
    subjects: [
      "a cute little frog wearing a tiny yellow raincoat and red rain boots holding a mushroom",
      "a cozy treehouse bakery run by a friendly bear wearing an apron with fresh pastries",
      "a mouse asleep inside a hollowed-out porcelain teacup with a tiny knitted blanket",
      "a hedgehog carrying red autumn apples on its back through a bed of golden leaves",
      "a kitten sitting on a wooden windowsill watching raindrops fall on a flower garden outside",
      "a tiny fairy cottage built inside a giant red-spotted mushroom with a chimney smoking"
    ],
    settings: [
      "inside a warm sunlit kitchen smelling of fresh blueberry pies and cinnamon pastries",
      "under a large green leaf umbrella during a gentle warm spring rain shower",
      "in a miniature garden surrounded by oversized dandelions, daisies, and bumblebees"
    ],
    actions: [
      "happily sipping a hot mug of cocoa with tiny floating marshmallow cubes",
      "reading a miniature fairy tale storybook using a firefly in a jar for reading light",
      "baking fresh flower petal cookies on a tiny oak counter with flour dusting"
    ],
    twists: [
      "with tiny string lights woven through climbing sweet-pea vines around the window frame",
      "wearing tiny hand-knitted woolen scarves, mittens, and pom-pom beanies"
    ]
  },

  "Dark Fantasy & Horror": {
    subjects: [
      "a mysterious hooded traveler at a ruined gothic castle gate at midnight under a blood moon",
      "an ancient stone gargoyle weeping liquid silver tears under a cold full moon",
      "a dark necromancer surrounded by floating bone runes and coiling emerald smoke",
      "a haunted Gothic cathedral with shattered stained glass windows and moonlight beams",
      "a spectral phantom coach pulled by shadowy skeletal horses galloping through fog"
    ],
    settings: [
      "shrouded in heavy nocturnal graveyard mist, twisted iron gates, and cold moonlight",
      "lit by eerie emerald torch fire flickering against crumbling dark stone walls"
    ],
    actions: [
      "holding an old brass lantern that casts long haunting shadows across gravestones",
      "whispering ancient forbidden incantations as dark shadow tendrils coil around them"
    ],
    twists: [
      "surrounded by swarms of black crows taking flight into the stormy night sky",
      "with dark thorns and withered black roses creeping aggressively over the ground"
    ]
  },

  "Surreal & Abstract": {
    subjects: [
      "a giant pocket watch melting over a floating marble staircase in a desert void",
      "a person with a galaxy filled with swirling stars inside a glass sphere for a head",
      "a staircase floating into an endless ocean in the sky where cloud whales swim",
      "a piano whose keys transform into flying white origami swans as they are pressed"
    ],
    settings: [
      "set in an impossible dreamscape with floating gravity-defying architecture and geometric shadows",
      "bathed in painterly pastel twilight gradients and floating liquid metal droplets"
    ],
    actions: [
      "challenging spatial logic, scale expectation, and physics through dream symbolism",
      "blending anatomical realism with dreamlike surrealist juxtapositions"
    ],
    twists: [
      "where clouds are made of spun cotton candy and water flows sideways into infinity",
      "incorporating Salvador Dali inspired melting forms and geometric tessellations"
    ]
  },

  // --- TECHNICAL & PRACTICE ---
  "Anatomy & Gesture": {
    subjects: [
      "an anatomical muscle torso study showing deep chest, shoulder, and abdominal muscle groups",
      "a dynamic 30-second gesture sketch capturing a sprinter bursting out of starting blocks",
      "a detailed hand study showing complex foreshortened fingers gripping a smooth sphere",
      "a foot and ankle structure study showcasing bone landmarks and tendon connections"
    ],
    settings: [
      "drawn with construction lines, cross-contour wraps, value planes, and muscle insertion points",
      "rendered on neutral paper using red terracotta and white chalk for form demonstration"
    ],
    actions: [
      "breaking complex human anatomy down into clean simple 3D geometric volumes",
      "capturing weight transfer, line of action, rhythm, and dynamic balance"
    ],
    twists: [
      "showing side-by-side skeletal ecorche structure alongside surface skin muscle rendering",
      "with directional arrows indicating dynamic muscle tension and force flow"
    ]
  },

  "Lighting & Color": {
    subjects: [
      "a sphere illuminated by warm red key light, cool blue fill light, and crisp yellow rim light",
      "a figure sitting beside a campfire with dramatic warm orange under-lighting against dark night",
      "a glass prism splitting a beam of sunlight into a vivid rainbow spectrum across a desk"
    ],
    settings: [
      "focusing on core shadow, bounced reflected light, specular highlights, and ambient occlusion",
      "demonstrating color temperature harmony: warm light / cool shadow dynamics"
    ],
    actions: [
      "studying light falloff curves, subsurface scattering on skin, and cast shadow edges",
      "rendering high dynamic range lighting contrast across varied material spheres"
    ],
    twists: [
      "with a clear color palette swatch bar displayed alongside the lighting study",
      "showing the dramatic difference between hard direct sunlight and soft overcast lighting"
    ]
  },

  "Perspective Studies": {
    subjects: [
      "a 3-point perspective study of a city canyon looking down from a high skyscraper window",
      "a 2-point perspective grid showing an interior room with furniture boxes aligned to vanishing points",
      "a 1-point perspective study of infinite railroad tracks stretching toward a setting sun horizon"
    ],
    settings: [
      "drawn with explicit horizon lines, vanishing points, perspective grid overlays, and foreshortening",
      "emphasizing spatial depth, foreshortened scale reduction, and clean converging lines"
    ],
    actions: [
      "constructing complex geometric forms accurately within a multi-point perspective grid",
      "demonstrating worm's-eye view looking up versus bird's-eye view looking down"
    ],
    twists: [
      "including red and blue construction guide lines showing vanishing point alignment",
      "with dramatic wide-angle fisheye lens distortion curving the grid lines outward"
    ]
  },

  "Material & Texture": {
    subjects: [
      "a material rendering sheet with 4 spheres: polished chrome, rusted iron, clear glass, and mossy stone",
      "a study of draped satin silk fabric showing sharp high-contrast specular fold highlights",
      "a texture study of dragon scales, leather grain, weathered oak wood, and ice crystals"
    ],
    settings: [
      "focusing on surface reflectivity, roughness values, translucency, and micro-texture detail",
      "lit by consistent neutral directional light to compare material properties fairly"
    ],
    actions: [
      "rendering hard metallic reflection highlights alongside soft matte diffuse surfaces",
      "capturing subtle edge refraction in glass and internal glow in translucent amber"
    ],
    twists: [
      "including microscopic zoom-in circles showing fine surface grain and scratches",
      "demonstrating weathered aging: rust spots on metal, cracks in stone, and fraying on cloth"
    ]
  }
};

// Global fallback arrays for general composition & lighting
export const GLOBAL_LIGHTINGS = [
  "soft warm golden hour sunlight with gentle volumetric rays slicing through air",
  "dramatic cinematic chiaroscuro with high contrast deep atmospheric shadows",
  "cool ethereal moonlight filtering through morning mountain fog",
  "vibrant bioluminescent glow in deep cyan, turquoise, and magenta tones",
  "cozy warm candle light casting soft orange flickering highlights",
  "diffused overcast daylight with soft natural shadow falloff and smooth values",
  "neon cyan and neon pink rim lighting reflecting on dark polished surfaces",
  "dappled sunlight slicing through a dense leafy canopy of forest branches",
  "vibrant twilight sunset sky with crimson, purple, and amber gradient glow",
  "harsh midday desert sun casting sharp high-contrast dark shadows below",
  "mysterious emerald torch light flickering against damp mossy stone walls",
  "soft diffused window daylight breaking through sheer linen curtains"
];

export const GLOBAL_MOODS = [
  "serene and peaceful",
  "mysterious and magical",
  "cozy and comforting",
  "dramatic and intense",
  "whimsical and playful",
  "melancholic and reflective",
  "majestic and awe-inspiring",
  "nostalgic and warm",
  "ethereal and dreamlike",
  "epic and heroic",
  "tense and suspenseful",
  "tranquil and contemplative"
];

export const GLOBAL_COLOR_PALETTES = [
  "warm terracotta, amber gold, and soft cream",
  "deep indigo blue, emerald green, and gold leaf accents",
  "soft pastel tones with muted sage green and blush pink",
  "monochromatic graphite with a single vibrant focal red highlight",
  "rich earthy autumn palette of burnt sienna, ochre, and deep moss",
  "vibrant cyberpunk neon cyan, magenta, and dark charcoal",
  "ethereal twilight purple, misty lavender, and silver starlight",
  "cozy amber, honey yellow, and warm mahogany brown",
  "deep oceanic turquoise, aquamarine, and coral pink",
  "dramatic high-contrast black, crimson red, and ivory"
];

export const GLOBAL_PERSPECTIVES = [
  "a wide-angle cinematic perspective establishing deep environment scale and horizon",
  "a dramatic low-angle view looking upward to emphasize height, majesty, and power",
  "an intimate eye-level shot focused sharply on intricate foreground details and expression",
  "a top-down bird's-eye view capturing rhythmic layout and geometric composition",
  "a dramatic 3-quarter dynamic angle pushing lead elements close to the viewer frame",
  "a close-up macro framing highlighting surface textures, glints, and fine lines"
];

export const TITLE_ADJECTIVES = [
  "The Silent", "The Golden", "The Forgotten", "The Luminous",
  "The Celestial", "The Ancient", "The Enchanted", "The Clockwork",
  "The Misty", "The Emerald", "The Crimson", "The Whispering",
  "The Sacred", "The Wandering", "The Spectral", "The Solitary",
  "The Radiant", "The Hidden", "The Eternal", "The Twilight",
  "The Azure", "The Sapphire", "The Obsidian", "The Velvet"
];

export const TITLE_NOUNS = [
  "Wanderer", "Sanctuary", "Guardian", "Solitude", "Horizon",
  "Passage", "Citadel", "Echo", "Haven", "Odyssey", "Glow",
  "Archive", "Relic", "Vision", "Chronicle", "Realm",
  "Embassy", "Mirage", "Sentinel", "Labyrinth", "Vessel", "Summit"
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

    while (attempts < 15) {
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

    const length = options.lengthPreference || "standard";
    let promptText = "";

    // Sentence 1: Core Subject, Action & Setting
    let sentence1 = `A ${selectedMood} scene depicting ${selectedSubject}, ${selectedAction} ${selectedSetting}.`;
    if (options.filters?.action && options.filters.action !== "Any") {
      sentence1 = `A ${selectedMood} artwork featuring ${selectedSubject} performing ${options.filters.action.toLowerCase()}, ${selectedSetting}.`;
    }

    // Sentence 2: Lighting & Story Twist
    let sentence2 = `The piece is illuminated by ${selectedLighting.toLowerCase()}, with ${selectedTwist}.`;

    // Sentence 3: Perspective, Palette & Constraints
    let sentence3 = `Framed from ${selectedPerspective.toLowerCase()}, utilizing a refined color palette of ${selectedPalette.toLowerCase()}.`;

    if (options.customKeywords && options.customKeywords.trim()) {
      sentence3 += ` Incorporate these artist keywords: ${options.customKeywords.trim()}.`;
    }
    if (options.filters?.constraints && options.filters.constraints !== "Any") {
      sentence3 += ` Artistic constraint: ${options.filters.constraints}.`;
    }

    if (length === "micro") {
      promptText = `${sentence1} Lit by ${selectedLighting.toLowerCase()}, ${selectedTwist}.`;
    } else if (length === "detailed") {
      promptText = `${sentence1} ${sentence2} ${sentence3} Focus on rendering rich surface textures, form volume, and crisp edge highlights against soft atmospheric shadows.`;
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
      provider: "DrawMuse Smart Offline Engine",
    };
  }

  /**
   * Generates a daily spotlight prompt based on the date string
   */
  public static getDaily(dateStr: string): GeneratedPromptResult {
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
      provider: "DrawMuse Smart Offline Engine",
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
    const cleanBase = existingPrompt.split(" — ")[0].trim();
    const remixedText = `${cleanBase} — Reimagined ${randomTwist}`;

    return {
      title: "Remixed Concept",
      prompt: remixedText,
      category: category || "Remix Studio",
      provider: "DrawMuse Smart Offline Engine",
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
