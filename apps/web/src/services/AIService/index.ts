// AI Service using Google Gemini API
// Provides content suggestions, summaries, and writing assistance

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export interface AIGenerateOptions {
  maxTokens?: number;
  temperature?: number;
}

export interface AISuggestion {
  type: 'title' | 'content' | 'tags' | 'summary' | 'improve';
  suggestion: string;
}

// Generic function to call Gemini API
async function callGeminiAPI(
  prompt: string,
  apiKey: string,
  options: AIGenerateOptions = {}
): Promise<string> {
  const { maxTokens = 1024, temperature = 0.7 } = options;

  const response = await fetch(`${GEMINI_API_BASE}?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens,
        topP: 0.95,
        topK: 40,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to generate content');
  }

  const data = await response.json();
  const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!generatedText) {
    throw new Error('No content generated');
  }

  return generatedText.trim();
}

// Generate title suggestions based on content
export async function generateTitleSuggestions(
  content: string,
  category: string,
  apiKey: string
): Promise<string[]> {
  const prompt = `You are a tech blog title generator. Based on the following content about ${category}, generate 3 catchy, SEO-friendly titles for a tech tips blog post. The titles should be engaging and include relevant keywords.

Content: ${content.substring(0, 1000)}

Return only the 3 titles, one per line, without numbering or bullet points.`;

  const result = await callGeminiAPI(prompt, apiKey, { maxTokens: 200 });
  return result
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .slice(0, 3);
}

// Suggest relevant tags based on content
export async function suggestTags(
  content: string,
  title: string,
  availableTags: string[],
  apiKey: string
): Promise<string[]> {
  const prompt = `You are a tech content tagger. Based on the following tech blog post, suggest the most relevant tags from the available list.

Title: ${title}
Content: ${content.substring(0, 800)}

Available tags: ${availableTags.join(', ')}

Return only the most relevant 3-5 tags from the available list, separated by commas. Only use tags from the provided list.`;

  const result = await callGeminiAPI(prompt, apiKey, { maxTokens: 100 });
  const suggestedTags = result
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => availableTags.includes(tag));
  
  return suggestedTags.slice(0, 5);
}

// Generate a summary of the post
export async function generateSummary(
  content: string,
  apiKey: string
): Promise<string> {
  const prompt = `Summarize the following tech blog post in 2-3 concise sentences. Focus on the key points and main takeaways.

Content: ${content.substring(0, 2000)}

Provide only the summary, no additional text.`;

  return await callGeminiAPI(prompt, apiKey, { maxTokens: 200, temperature: 0.5 });
}

// Improve writing quality
export async function improveWriting(
  content: string,
  apiKey: string
): Promise<string> {
  const prompt = `Improve the following tech blog content to make it more engaging, clear, and professional. Maintain the technical accuracy and the original meaning. Keep the same general structure but enhance readability and flow.

Original content:
${content.substring(0, 3000)}

Provide only the improved content, maintaining HTML formatting if present.`;

  return await callGeminiAPI(prompt, apiKey, { maxTokens: 2000, temperature: 0.6 });
}

// Generate content outline based on title
export async function generateContentOutline(
  title: string,
  category: string,
  apiKey: string
): Promise<string> {
  const prompt = `Create a detailed outline for a tech blog post with the following title. The outline should help the writer create comprehensive, valuable content.

Title: ${title}
Category: ${category}

Provide a structured outline with main sections and key points to cover. Format as a bullet point list.`;

  return await callGeminiAPI(prompt, apiKey, { maxTokens: 500, temperature: 0.7 });
}

// Expand on a topic/paragraph
export async function expandContent(
  content: string,
  topic: string,
  apiKey: string
): Promise<string> {
  const prompt = `Expand on the following content about "${topic}". Add more details, examples, and explanations to make it more comprehensive and helpful for readers.

Content to expand:
${content}

Provide the expanded content, maintaining HTML formatting if present.`;

  return await callGeminiAPI(prompt, apiKey, { maxTokens: 1500, temperature: 0.7 });
}

// Generate code examples based on topic
export async function generateCodeExample(
  topic: string,
  language: string,
  apiKey: string
): Promise<string> {
  const prompt = `Generate a practical, well-commented code example in ${language} that demonstrates ${topic}. Include:
1. A brief explanation of what the code does
2. The code itself with comments
3. Expected output or result

Format the response with the explanation first, then the code in a code block.`;

  return await callGeminiAPI(prompt, apiKey, { maxTokens: 1000, temperature: 0.5 });
}

// Check content for grammar and style issues
export async function checkWritingQuality(
  content: string,
  apiKey: string
): Promise<{ issues: string[]; score: number; suggestions: string[] }> {
  const prompt = `Analyze the following tech blog content for writing quality. Evaluate:
1. Grammar and spelling
2. Clarity and readability
3. Technical accuracy of language
4. Engagement level

Content:
${content.substring(0, 2000)}

Respond in this exact JSON format:
{
  "issues": ["list of specific issues found"],
  "score": <number from 1-10>,
  "suggestions": ["list of improvement suggestions"]
}`;

  const result = await callGeminiAPI(prompt, apiKey, { maxTokens: 500, temperature: 0.3 });
  
  try {
    // Try to extract JSON from the response
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Invalid response format');
  } catch {
    return {
      issues: ['Unable to analyze content'],
      score: 0,
      suggestions: ['Please try again'],
    };
  }
}

// Main AI Assistant class for easier usage
export class AIAssistant {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async suggestTitles(content: string, category: string): Promise<string[]> {
    return generateTitleSuggestions(content, category, this.apiKey);
  }

  async suggestTags(content: string, title: string, availableTags: string[]): Promise<string[]> {
    return suggestTags(content, title, availableTags, this.apiKey);
  }

  async summarize(content: string): Promise<string> {
    return generateSummary(content, this.apiKey);
  }

  async improve(content: string): Promise<string> {
    return improveWriting(content, this.apiKey);
  }

  async generateOutline(title: string, category: string): Promise<string> {
    return generateContentOutline(title, category, this.apiKey);
  }

  async expand(content: string, topic: string): Promise<string> {
    return expandContent(content, topic, this.apiKey);
  }

  async generateCode(topic: string, language: string): Promise<string> {
    return generateCodeExample(topic, language, this.apiKey);
  }

  async checkQuality(content: string): Promise<{ issues: string[]; score: number; suggestions: string[] }> {
    return checkWritingQuality(content, this.apiKey);
  }
}

export default AIAssistant;
