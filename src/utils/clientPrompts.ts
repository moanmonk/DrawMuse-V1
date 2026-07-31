export interface ClientPromptItem {
  title: string;
  prompt: string;
  category: string;
}

export const CLIENT_PROMPTS: ClientPromptItem[] = [
  {
    category: "Character Design",
    title: "The Clockwork Wanderer",
    prompt: "A traveler wearing a brass coat and leather boots walking through a snowy pine forest, holding a small glowing lantern that lights up the dark pine trees.",
  },
  {
    category: "Character Design",
    title: "The Herbalist at Midnight",
    prompt: "A friendly herbalist in a cozy wooden cabin at night, sorting glowing plants and colorful glass bottles on a wooden desk.",
  },
  {
    category: "Creature Design",
    title: "Crystal Forest Deer",
    prompt: "A peaceful deer with glowing crystal antlers, standing at the edge of a calm forest lake in the soft morning fog.",
  },
  {
    category: "Creature Design",
    title: "Friendly Little Dragon",
    prompt: "A small dragon with shiny black scales resting on a pile of old books in a sunny library, blowing tiny wisps of blue smoke.",
  },
  {
    category: "Animal Studies",
    title: "Snow Leopard Ridge Jump",
    prompt: "A majestic snow leopard jumping across a rocky snow-covered mountain gap under a clear, crisp winter sky.",
  },
  {
    category: "Creature Hybrids",
    title: "The Owl-Panther Guard",
    prompt: "A mythical creature with the body of a sleek black panther and the head and feathered wings of a giant snowy owl, resting on a moonlit stone arch.",
  },
  {
    category: "Portraits",
    title: "The Old Sea Captain",
    prompt: "A close portrait of an old sea captain with a silver beard, weather-beaten skin, and a dark captain hat, lit by warm lantern light.",
  },
  {
    category: "Character Expressions",
    title: "Spell of Wonder",
    prompt: "A character expression study of a young wizard looking up with wide joyful eyes and a happy smile as colorful spell sparks float in the air.",
  },
  {
    category: "Character Poses",
    title: "Airborne Sword Strike",
    prompt: "A dynamic pose of a martial artist mid-air executing a swift sword strike, with flowing ribbons and clear weight distribution.",
  },
  {
    category: "Environment & Landscapes",
    title: "Ancient River Canyon",
    prompt: "An ancient overgrown stone ruin in a clear blue river valley, with morning sunlight shining through gentle mist.",
  },
  {
    category: "Fantasy Worlds",
    title: "Sunken Crystal Temple",
    prompt: "A giant underwater fantasy temple made of white marble and glowing purple crystals, illuminated by shafts of sunlight through turquoise water.",
  },
  {
    category: "Sci-Fi & Cyberpunk",
    title: "Neon Rain Market",
    prompt: "A busy futuristic street at night in the rain, filled with bright pink and blue neon signs, street food stalls, and glowing umbrella lights.",
  },
  {
    category: "Historical Environments",
    title: "Rainy Paris Cobblestones",
    prompt: "A 19th-century European street after a spring rain, with vintage horse carriages, warm streetlamps, and reflections on wet cobblestones.",
  },
  {
    category: "Architecture & Interiors",
    title: "The Winding Tower Library",
    prompt: "A tall circular library with winding wooden staircases and thousands of colorful books lining the walls from floor to ceiling.",
  },
  {
    category: "Props & Weapons",
    title: "Rune-Carved Broadsword",
    prompt: "An ancient knight's broadsword resting in a mossy stone anvil, with glowing orange runes along the blade casting warm light.",
  },
  {
    category: "Vehicles & Mecha",
    title: "Desert Explorer Mech",
    prompt: "A rugged robotic walker vehicle parked near a giant desert rock formation at sunset, showing mechanical legs and a warm glowing cockpit.",
  },
  {
    category: "Food & Still Life",
    title: "Rustic Tea & Fruit",
    prompt: "A cozy still life on a wooden table: fresh crusty bread, a bowl of red apples, a steaming tea cup, and soft morning sunlight through a window.",
  },
  {
    category: "Mythology & Folklore",
    title: "Golden Phoenix Nest",
    prompt: "A legendary golden phoenix with radiant fiery feathers resting in a nest atop an ancient marble column in a Greek temple garden.",
  },
  {
    category: "Dark Fantasy & Horror",
    title: "Lantern at the Ruined Gate",
    prompt: "A mysterious hooded traveler standing before a dark ruined castle gateway at midnight, surrounded by swirling mist and a single green torch flame.",
  },
  {
    category: "Cozy & Whimsical",
    title: "Raincoat Frog in the Garden",
    prompt: "A cute little frog wearing a tiny yellow raincoat and rain boots, sitting happily under a mushroom umbrella during a gentle rain shower.",
  },
  {
    category: "Comic & Manga Style",
    title: "Rooftop Chase Scene",
    prompt: "A dynamic comic page action scene of a hero leaping between city rooftops under a full moon, with bold ink outlines, action speed lines, and halftone shading.",
  },
  {
    category: "Watercolor & Loose Ink",
    title: "Cherry Blossom Wash",
    prompt: "A soft watercolor artwork of a blooming cherry blossom tree branch in spring, with gentle pastel paint bleeds, loose ink splatters, and soft wet background washes.",
  },
  {
    category: "Lighting & Value Focus",
    title: "Chiaroscuro Mask Study",
    prompt: "A high-contrast lighting study of a carved wooden mask resting on a dark velvet cloth beside a single burning candle, casting dramatic deep shadows.",
  }
];

export function generateClientPrompt(category?: string, filters?: any): { title: string; prompt: string; category: string } {
  let matches = CLIENT_PROMPTS;

  if (category && category !== "General Inspiration" && category !== "random") {
    const catLower = category.toLowerCase();
    const filtered = matches.filter((p) => {
      const pCat = p.category.toLowerCase();
      return pCat.includes(catLower) || catLower.includes(pCat);
    });
    if (filtered.length > 0) {
      matches = filtered;
    }
  }

  const selected = matches[Math.floor(Math.random() * matches.length)];
  let promptText = selected.prompt;

  if (filters) {
    const addOns: string[] = [];
    if (filters.lighting && filters.lighting !== 'Any') addOns.push(`lit with ${filters.lighting.toLowerCase()} lighting`);
    if (filters.mood && filters.mood !== 'Any') addOns.push(`with a ${filters.mood.toLowerCase()} mood`);
    if (filters.colorPalette && filters.colorPalette !== 'Any') addOns.push(`using a ${filters.colorPalette.toLowerCase()} color style`);
    if (filters.artStyle && filters.artStyle !== 'Any') addOns.push(`in the style of ${filters.artStyle.toLowerCase()}`);

    if (addOns.length > 0) {
      promptText += ` (${addOns.join(', ')}).`;
    }
  }

  return {
    title: selected.title,
    prompt: promptText,
    category: category || selected.category || 'General Inspiration',
  };
}

export function getClientDailyPrompt(): { title: string; prompt: string; category: string; date: string } {
  const dateStr = new Date().toISOString().split('T')[0];
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % CLIENT_PROMPTS.length;
  const selected = CLIENT_PROMPTS[index];

  return {
    title: selected.title,
    prompt: selected.prompt,
    category: 'Daily Spotlight',
    date: dateStr,
  };
}
