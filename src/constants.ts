/**
 * Prompts for Gen AI
 */

interface BasePrompt {
  gemini: string;
  default?: string;
}

export const SEPERATOR = `|||`;

export const characterPrompt: BasePrompt = {
  gemini: `Act as an experienced writer of eBooks, always answer in markdown. Only include content, don't act as an bot.`,
};

export const initPrompts: {
  gemini: (title: string) => string;
} = {
  gemini: (title: string) => {
    return `${characterPrompt.gemini}\nI'm aiming to write an eBook on topic "${title}". Can you assist me in outlining/table of contents for sections of book according to topic? Add 5 Sections Only! include introduction and conclusion also`;
  },
};

export const metaPromps = {
  gemini: {
    title: `Only Give me a professional and appealing title for my ebook..in single line with few words do not include anything extra else! be professional, do not give me any reasons, just content`,
    introduction: `Only Give me a professional and appealing introduction for my ebook.. in single paragraph! do not include anything extra else! be professional, do not give me any reasons, just content`,
    conclusion: `Only Give me a professional and appealing conclusion for my ebook.. in single paragraph! do not include anything extra else! be professional, do not give me any reasons, just content`,
  },
};

export const bookPlaceholders = {
  title: "{{title}}",
  introduction: "{{introduction}}",
  conclusion: "{{conclusion}}",
  content: "{{pages_content}}",
};

export const baseGenPrompt: BasePrompt = {
  gemini:
    "${characterPrompt.gemini}\nGive me content for section # {{i}}, in well formated and elaborated format!",
};
