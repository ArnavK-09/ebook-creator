/**
 * Prompts for Gen AI
 */

interface BasePrompt {
	gemini: string;
	default?: string;
}

export const SEPERATOR = `|||`;

export const characterPrompt: BasePrompt = {
	gemini: `Act as an author!, always answer in markdown`,
};

export const initPrompts: {
	gemini: (title: string) => string;
} = {
	gemini: (title: string) => {
		return `${characterPrompt.gemini}\nCreate me index for book titled "${title}" in 10 sections`;
	},
};

export const metaPrompts: BasePrompt = {
	gemini: `give me title and description for page seperated by ${SEPERATOR}`,
};

export const bookPlaceholders = {
	title: "{{title}}",
	introduction: "{{introduction}}",
	conclusion: "{{conclusion}}",
	content: "{{pages_content}}",
};
