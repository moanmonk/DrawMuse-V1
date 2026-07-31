import { CategoryItem } from '../types';

export const CATEGORIES: CategoryItem[] = [
  // Character & Creatures
  {
    id: 'character-design',
    name: 'Character Design',
    iconName: 'User',
    description: 'Distinctive personalities, archetypes, costume silhouettes, and emotive figures.',
    group: 'Character & Creatures',
    sampleIdea: 'A nomadic clockmaker wearing gear-adorned robes and brass spectacles.'
  },
  {
    id: 'creature-design',
    name: 'Creature Design',
    iconName: 'Sparkles',
    description: 'Mythical beasts, chimera organisms, speculative biology, and alien fauna.',
    group: 'Character & Creatures',
    sampleIdea: 'A mossy stag with crystal antlers that emit soft bioluminescent spores.'
  },
  {
    id: 'animal-studies',
    name: 'Animal Studies',
    iconName: 'Dog',
    description: 'Realistic wildlife, zoological proportions, fur textures, and dynamic animal posture.',
    group: 'Character & Creatures',
    sampleIdea: 'A snow leopard mid-leap across a jagged glacier ridge.'
  },
  {
    id: 'creature-hybrids',
    name: 'Creature Hybrids',
    iconName: 'Flame',
    description: 'Fused animal features, mythological monsters, and fantastical anatomical blends.',
    group: 'Character & Creatures',
    sampleIdea: 'An owl-panther hybrid coiled stealthily on an ancient stone arch.'
  },
  {
    id: 'portraits',
    name: 'Portraits',
    iconName: 'Smile',
    description: 'Facial bone structure, lighting focus, emotive gazes, and hairstyle flows.',
    group: 'Character & Creatures',
    sampleIdea: 'A weathered sea captain with sea-salt stained skin under harsh golden hour light.'
  },
  {
    id: 'character-expressions',
    name: 'Character Expressions',
    iconName: 'Laugh',
    description: 'Micro-expressions, intense emotions, theatrical grimaces, and subtle smiles.',
    group: 'Character & Creatures',
    sampleIdea: 'A young wizard experiencing joyful surprise as a spell bursts into star clusters.'
  },
  {
    id: 'character-poses',
    name: 'Character Poses',
    iconName: 'Accessibility',
    description: 'Dynamic foreshortening, weight distribution, action beats, and fluid balance.',
    group: 'Character & Creatures',
    sampleIdea: 'A martial artist executing a airborne spin kick with flowing silk ribbons.'
  },

  // Environments & World
  {
    id: 'environment-landscapes',
    name: 'Environment & Landscapes',
    iconName: 'Mountain',
    description: 'Atmospheric vistas, dramatic horizons, weather systems, and organic terrain.',
    group: 'Environments & World',
    sampleIdea: 'A misty pine valley flooded with early morning sunbeams breaking through fog.'
  },
  {
    id: 'architecture',
    name: 'Architecture',
    iconName: 'Building',
    description: 'Gothic cathedrals, modern brutalism, fantasy citadels, and historic masonry.',
    group: 'Environments & World',
    sampleIdea: 'An ancient library carved directly into the heart of a seaside cliff face.'
  },
  {
    id: 'interior-design',
    name: 'Interior Design',
    iconName: 'Home',
    description: 'Cozy rooms, cluttered workshops, ambient lighting, and lived-in spaces.',
    group: 'Environments & World',
    sampleIdea: 'An astronomer’s attic study filled with brass telescopes, star maps, and tea.'
  },
  {
    id: 'background-practice',
    name: 'Background Practice',
    iconName: 'Image',
    description: 'Depth layers, focal points, atmospheric perspective, and environmental cues.',
    group: 'Environments & World',
    sampleIdea: 'A cobblestone alleyway in autumn, framed by wet leaves and glowing street lamps.'
  },
  {
    id: 'urban-sketching',
    name: 'Urban Sketching',
    iconName: 'MapPin',
    description: 'Bustling cafes, streetcars, storefront signs, pedestrians, and urban rhythm.',
    group: 'Environments & World',
    sampleIdea: 'A corner ramen shop in Kyoto bathed in rain reflections and red neon.'
  },
  {
    id: 'nature-sketching',
    name: 'Nature Sketching',
    iconName: 'Trees',
    description: 'Gnarled tree roots, forest floors, cascading waterfalls, and rock strata.',
    group: 'Environments & World',
    sampleIdea: 'An ancient oak tree draped in Spanish moss beside a mirror-still pond.'
  },

  // Objects & Props
  {
    id: 'botanical-studies',
    name: 'Botanical Studies',
    iconName: 'Flower2',
    description: 'Intricate flora, leaf venation, delicate petals, and seed pod geometry.',
    group: 'Objects & Props',
    sampleIdea: 'A cluster of wild blue bellflowers covered in morning dew droplets.'
  },
  {
    id: 'object-design',
    name: 'Object Design',
    iconName: 'Box',
    description: 'Industrial design, antique artifacts, mechanical contrivances, and daily tools.',
    group: 'Objects & Props',
    sampleIdea: 'An ornate pocket watch powered by a glowing captured firefly inside.'
  },
  {
    id: 'vehicle-design',
    name: 'Vehicle Design',
    iconName: 'Car',
    description: 'Steampunk airships, retro-futuristic speeders, vintage cars, and heavy machinery.',
    group: 'Objects & Props',
    sampleIdea: 'A dieselpunk cargo airship anchored to a mountain summit tower.'
  },
  {
    id: 'weapons-equipment',
    name: 'Weapons & Equipment',
    iconName: 'Sword',
    description: 'Runed longswords, ceremonial daggers, survival backpacks, and tactical gear.',
    group: 'Objects & Props',
    sampleIdea: 'A sun-forged broadsword with glowing runes along the fuller and ivory hilt.'
  },
  {
    id: 'fashion-design',
    name: 'Fashion Design',
    iconName: 'Shirt',
    description: 'Drape, fabric weight, haute couture silhouettes, historical attire, and textures.',
    group: 'Objects & Props',
    sampleIdea: 'An avant-garde evening gown crafted from layered iridescent organza.'
  },
  {
    id: 'food-illustration',
    name: 'Food Illustration',
    iconName: 'Utensils',
    description: 'Mouthwatering culinary spreads, bakery treats, steaming soups, and fresh fruit.',
    group: 'Objects & Props',
    sampleIdea: 'A rustic wooden table holding freshly baked sourdough, honey, and sliced figs.'
  },
  {
    id: 'prop-design',
    name: 'Prop Design',
    iconName: 'Key',
    description: 'Inventory items, potion bottles, spellbooks, chest trinkets, and relic icons.',
    group: 'Objects & Props',
    sampleIdea: 'A leather-bound alchemist ledger overflowing with pressed herbs and vial slots.'
  },
  {
    id: 'mechanical-design',
    name: 'Mechanical Design',
    iconName: 'Cog',
    description: 'Gears, pistons, hydraulics, clockwork automata, and structural joints.',
    group: 'Objects & Props',
    sampleIdea: 'A mechanical hummingbird automaton with exposed gold gearwork.'
  },
  {
    id: 'still-life',
    name: 'Still Life',
    iconName: 'Wine',
    description: 'Form study, light falloff, surface sheen, glass translucency, and grouping composition.',
    group: 'Objects & Props',
    sampleIdea: 'A brass candlestick, a half-eaten pomegranate, and a folded velvet cloth.'
  },

  // Themes & Narrative
  {
    id: 'fantasy',
    name: 'Fantasy',
    iconName: 'Wand2',
    description: 'Enchanted forests, arcana, ancient ruins, dragon riders, and mystical realms.',
    group: 'Themes & Narrative',
    sampleIdea: 'A young mage practicing levitation magic inside an overgrown moonlit shrine.'
  },
  {
    id: 'sci-fi',
    name: 'Sci-Fi',
    iconName: 'Rocket',
    description: 'Deep space stations, orbital colonies, terraforming rigs, and alien encounters.',
    group: 'Themes & Narrative',
    sampleIdea: 'An astronaut exploring a cavern of giant glowing crystalline formations.'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    iconName: 'Cpu',
    description: 'High tech low life, neon signage, augmented cyberware, rain-slicked concrete.',
    group: 'Themes & Narrative',
    sampleIdea: 'A cybernetic street courier resting under glowing holographic billboards.'
  },
  {
    id: 'horror',
    name: 'Horror',
    iconName: 'Ghost',
    description: 'Eerie shadows, eldritch imagery, macabre atmosphere, and unsettling moods.',
    group: 'Themes & Narrative',
    sampleIdea: 'A towering spectral figure looming at the end of a long fog-filled hallway.'
  },
  {
    id: 'cozy',
    name: 'Cozy',
    iconName: 'Coffee',
    description: 'Warm hearths, rainy window sills, hot cocoa, sleeping cats, and gentle comfort.',
    group: 'Themes & Narrative',
    sampleIdea: 'A sleeping tabby cat curled up on a stack of worn books next to a mug of tea.'
  },
  {
    id: 'slice-of-life',
    name: 'Slice of Life',
    iconName: 'Heart',
    description: 'Everyday human warmth, mundane beauty, nostalgic moments, and subtle emotions.',
    group: 'Themes & Narrative',
    sampleIdea: 'Two childhood friends sharing an umbrella while waiting for the morning bus.'
  },
  {
    id: 'story-illustration',
    name: 'Story Illustration',
    iconName: 'BookOpen',
    description: 'Key narrative beats, dramatic climaxes, visual storytelling, and emotion.',
    group: 'Themes & Narrative',
    sampleIdea: 'A brave wanderer standing at the threshold of a cavern holding a flickering torch.'
  },
  {
    id: 'childrens-illustration',
    name: 'Children\'s Illustration',
    iconName: 'Palette',
    description: 'Whimsical characters, soft shapes, joyful colors, and fairy tale innocence.',
    group: 'Themes & Narrative',
    sampleIdea: 'A tiny toad wearing a acorn helmet steering a lily-pad sailboat.'
  },

  // Artistic Styles
  {
    id: 'pixel-art',
    name: 'Pixel Art',
    iconName: 'Grid',
    description: 'Retro game aesthetic, sprite clarity, limited color ramps, and tile layouts.',
    group: 'Artistic Styles',
    sampleIdea: 'A 16-bit cozy cabin in a snowy mountain wood with animated smoke.'
  },
  {
    id: 'isometric',
    name: 'Isometric',
    iconName: 'Boxes',
    description: '3D orthographic projection, detailed room cutaways, and micro dioramas.',
    group: 'Artistic Styles',
    sampleIdea: 'An isometric slice of an old botanical greenhouse with glass ceiling tiles.'
  },
  {
    id: 'comic-cover',
    name: 'Comic Cover',
    iconName: 'FileText',
    description: 'Bold composition, title placement balance, dynamic action framing, and inks.',
    group: 'Artistic Styles',
    sampleIdea: 'A superhero standing atop a gargoyle against a stormy lightning backdrop.'
  },
  {
    id: 'manga',
    name: 'Manga',
    iconName: 'Feather',
    description: 'Screentones, expressive eye highlights, dynamic speedlines, and crisp ink lines.',
    group: 'Artistic Styles',
    sampleIdea: 'A dramatic close-up of a rival warrior drawing their katana under cherry blossoms.'
  },
  {
    id: 'tattoo-design',
    name: 'Tattoo Design',
    iconName: 'Brush',
    description: 'Neotraditional outlines, bold blackwork, floral framings, and skin contour flow.',
    group: 'Artistic Styles',
    sampleIdea: 'A roaring wolf head framed by geometric crescent moons and wild brambles.'
  },

  // Technical & Practice
  {
    id: 'perspective-practice',
    name: 'Perspective Practice',
    iconName: 'Compass',
    description: '1-point, 2-point, 3-point grid depth, vanishing points, and structural convergence.',
    group: 'Technical & Practice',
    sampleIdea: 'A dramatic 3-point worm\'s-eye view looking up at towering skyscraper tops.'
  },
  {
    id: 'gesture-drawing',
    name: 'Gesture Drawing',
    iconName: 'Activity',
    description: 'Fluid line of action, quick movement capture, energy flow, and relaxed rhythm.',
    group: 'Technical & Practice',
    sampleIdea: 'A dancer caught mid-leap, capturing the swooping curve of motion.'
  },
  {
    id: 'anatomy-practice',
    name: 'Anatomy Practice',
    iconName: 'Bone',
    description: 'Musculature groups, skeletal landmarks, surface tension, and strain mechanics.',
    group: 'Technical & Practice',
    sampleIdea: 'A torso study showing the shoulder blade movement in an overhead stretch.'
  },
  {
    id: 'hands',
    name: 'Hands',
    iconName: 'Hand',
    description: 'Finger foreshortening, knuckle planes, palm weight, holding gestures, and grip.',
    group: 'Technical & Practice',
    sampleIdea: 'A pair of delicate hands carefully tying a silk knot around a old letter.'
  },
  {
    id: 'feet',
    name: 'Feet',
    iconName: 'Footprints',
    description: 'Arch structure, toe alignment, ankle bone landmarks, and weight distribution.',
    group: 'Technical & Practice',
    sampleIdea: 'Bare feet stepping onto damp river pebbles, creating ripple reflections.'
  },
  {
    id: 'random',
    name: 'Random',
    iconName: 'Dice5',
    description: 'Pure spontaneous inspiration spanning any artistic domain or genre.',
    group: 'Themes & Narrative',
    sampleIdea: 'An unpredictable fusion of unexpected elements crafted by Gemini.'
  }
];
