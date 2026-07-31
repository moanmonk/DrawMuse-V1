export interface FallbackPromptItem {
  title: string;
  prompt: string;
  category: string;
  mood?: string;
  lighting?: string;
}

export class FallbackDatabase {
  private static prompts: FallbackPromptItem[] = [
    // Character & Creatures
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

    // Environments & World
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

    // Objects & Props
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

    // Themes & Narrative
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
      category: "Cybernetic & Tech",
      title: "Workshop Robotic Arm",
      prompt: "A sleek cybernetic robotic arm on a mechanic's workbench, surrounded by copper wires, glowing blue status lights, and brass tools.",
    },
    {
      category: "Cozy & Whimsical",
      title: "Raincoat Frog in the Garden",
      prompt: "A cute little frog wearing a tiny yellow raincoat and rain boots, sitting happily under a mushroom umbrella during a gentle rain shower.",
    },

    // Artistic Styles & Technical
    {
      category: "Comic & Manga Style",
      title: "Rooftop Rooftop Chase",
      prompt: "A dynamic comic page action scene of a hero leaping between city rooftops under a full moon, with bold ink outlines, action speed lines, and halftone shading.",
    },
    {
      category: "Watercolor & Loose Ink",
      title: "Cherry Blossom Wash",
      prompt: "A soft watercolor artwork of a blooming cherry blossom tree branch in spring, with gentle pastel paint bleeds, loose ink splatters, and soft wet background washes.",
    },
    {
      category: "Impressionism & Oil",
      title: "Sunlit Water Lily Garden",
      prompt: "An impressionist oil painting of a vibrant pond filled with pink water lilies, painted with thick textured brushstrokes and dappled golden sunlight.",
    },
    {
      category: "Line Art & Inkwork",
      title: "Intricate Cliffside Castle",
      prompt: "A detailed black and white ink drawing of a fantasy castle built into a steep sea cliff, using clean hatching lines and stippling.",
    },
    {
      category: "Lighting & Value Focus",
      title: "Chiaroscuro Mask Study",
      prompt: "A high-contrast lighting study of a carved wooden mask resting on a dark velvet cloth beside a single burning candle, casting dramatic deep shadows.",
    },
    {
      category: "Anatomy & Figure Practice",
      title: "Dynamic Dancer Gesture",
      prompt: "A figure study of a ballet dancer mid-jump, focusing on gesture lines, muscle form, poise, and soft directional studio lighting.",
    },
    {
      category: "Speed Painting & Thumbnails",
      title: "Stormy Sunset Ocean",
      prompt: "A quick 15-minute speed painting of a dramatic thunderstorm brewing over a golden sunset ocean, using broad brushstrokes and strong color contrast.",
    },
    {
      category: "Color Palette Challenge",
      title: "Three-Color Night Cafe",
      prompt: "A quiet outdoor night cafe scene rendered using only three colors: deep navy blue, warm mustard yellow, and soft cream white.",
    },
  ];

  public static getRandomPrompt(category?: string, filters?: any): FallbackPromptItem {
    let matches = this.prompts;

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

    const randomIndex = Math.floor(Math.random() * matches.length);
    const selected = { ...matches[randomIndex] };

    let promptText = selected.prompt;

    // Append active filter keywords naturally if provided
    if (filters) {
      const addOns: string[] = [];
      if (filters.lighting && filters.lighting !== "Any") {
        addOns.push(`lit with ${filters.lighting.toLowerCase()} lighting`);
      }
      if (filters.mood && filters.mood !== "Any") {
        addOns.push(`with a ${filters.mood.toLowerCase()} mood`);
      }
      if (filters.colorPalette && filters.colorPalette !== "Any") {
        addOns.push(`using a ${filters.colorPalette.toLowerCase()} color style`);
      }
      if (filters.artStyle && filters.artStyle !== "Any") {
        addOns.push(`in the style of ${filters.artStyle.toLowerCase()}`);
      }

      if (addOns.length > 0) {
        promptText += ` (${addOns.join(", ")}).`;
      }
    }

    return {
      title: selected.title,
      prompt: promptText,
      category: category || selected.category || "General Inspiration",
    };
  }

  public static getDailyPrompt(dateStr: string): FallbackPromptItem {
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) {
      hash = (hash << 5) - hash + dateStr.charCodeAt(i);
      hash |= 0;
    }
    const index = Math.abs(hash) % this.prompts.length;
    return this.prompts[index];
  }

  public static getRemix(existingPrompt: string): { title: string; prompt: string } {
    const twists = [
      "Set in a bright futuristic city with colorful neon lights and rain puddles.",
      "Reimagined underwater with clear blue light streaming through calm ocean water.",
      "Set on a high mountain peak under a glowing starry night sky.",
      "Rendered with warm candlelight and soft shadows.",
      "Placed inside a cozy overgrown greenhouse filled with climbing vines and glowing flowers.",
    ];

    const randomTwist = twists[Math.floor(Math.random() * twists.length)];
    const remixedPrompt = `${existingPrompt} — ${randomTwist}`;

    return {
      title: "Remixed Concept",
      prompt: remixedPrompt,
    };
  }

  public static getExpand(existingPrompt: string): { prompt: string } {
    const expansions = [
      "Focus on adding clear background details like distant mountain silhouettes and gentle morning mist.",
      "Add storytelling details: scatter small personal items nearby, like a warm lantern, leather book, or tea cup.",
      "Highlight clear textures: pair rough stone or smooth wood with soft moss or warm fabric in natural sunlight.",
    ];

    const randomExpansion = expansions[Math.floor(Math.random() * expansions.length)];
    return {
      prompt: `${existingPrompt}\n\nArtistic Details: ${randomExpansion}`,
    };
  }
}
