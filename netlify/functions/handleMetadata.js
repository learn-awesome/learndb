// Import for webscraping in fetchContentFromURL()
const fetch = require('node-fetch'); 
import { OpenAIApi, Configuration } from 'openai';
// Import the filesystem module to read the topics.json file
const fs = require('fs');

// Function to fetch content from URL using a web scraping service
async function fetchContentFromURL(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.text();
    } catch (error) {
        console.error(`Could not fetch content from URL: ${error}`);
        throw error;
    }
}

function simplifyContent(content) {
    // Preserve the title tag and its content
    let title = content.match(/<title.*?>(.*?)<\/title>/i);
    title = title ? title[1] : '';

    // Extract the body content, if present
    let bodyContent = '';
    const bodyMatch = content.match(/<body.*?>([\s\S]*)<\/body>/i);
    if (bodyMatch) {
        bodyContent = bodyMatch[1];
    } else {
        // If no body tag, assume entire content is body
        bodyContent = content;
    }

    // Remove script and style elements and their content
    bodyContent = bodyContent.replace(/<script.*?>.*?<\/script>/gms, '');
    bodyContent = bodyContent.replace(/<style.*?>.*?<\/style>/gms, '');

    // Remove all remaining HTML tags, except for title, body, h1-h6, p, and a
    bodyContent = bodyContent.replace(/<(?!\/?(title|body|h[1-6]|p|a)( [^>]*)?>)([^>]+)>/g, '');

    // Manually replace common HTML entities
    bodyContent = bodyContent
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");

    // Remove inline CSS and JavaScript event handlers
    bodyContent = bodyContent.replace(/style\s*=\s*'.*?'/gi, '');
    bodyContent = bodyContent.replace(/on\w+\s*=\s*".*?"/gi, '');

    // Normalize whitespace without removing sentence punctuation
    bodyContent = bodyContent.replace(/\s+/g, ' ').trim();

    // Condense multiple line breaks into a single one
    bodyContent = bodyContent.replace(/(\r\n|\r|\n){2,}/g, '\n');

    // Reconstruct content with title and body
    const simplifiedContent = `<title>${title}</title><body>${bodyContent}</body>`;
    return simplifiedContent;
}

// Function to perform GPT analysis for media type and topics using Mistral-7b via OpenRouter
async function performGPTAnalysis(simplifiedContent, apiKey) {
    // Implement logic to send content to Mistral-7b via OpenRouter for GPT analysis
    // Send content and receive GPT analysis response

    // this is the code that we tried to use for the GPT Analysis 
    // try {
    //     const configuration = new Configuration({
    //         apiKey: apiKey,  // Use the provided API key
    //         baseURL: "https://openrouter.ai/api/v1" // Your custom API endpoint
    //     });
    
    //     const openai = new OpenAIApi(configuration);

    //     // Using the specified prompt
    //      const prompt = `
    //      Analyze the following text for content categorization:
    //      Text: "${simplifiedContent}"
    //      Please provide:
    //      1. The most likely media type (e.g., article, book, audio, video, chat, research_paper, wiki, etc.)
    //      2. Key topics covered in the text (list up to 5 main topics).
    //      `;
    //     const completion = await openai.createCompletion({
    //         model: "mistralai/mistral-7b-instruct",
    //         prompt: prompt,
    //         max_tokens: 150 // Adjust as needed
    //     });

    //     //return completion.data.choices[0].text.trim();
    //     return inferredMediaType;
    // } catch (error) {
    //     console.error('Error with OpenAI completion:', error);
    //     throw error;
    // }
    // however, it gives the error below: 
    // { "error": "Something went wrong", "details": "Configuration is not a constructor" }

    // Placeholder code
    const inferredMediaType = ["article"];
    const extractedTopics = ["topic1", "topic2"];
    return { inferredMediaType, extractedTopics };
}

// Function to load topics from the topics.json file
function loadTopics() {
    const topicsData = fs.readFileSync('path/to/topics.json', 'utf8');
    return JSON.parse(topicsData);
}
// Function to map inferred values to predefined formats and topics
function mapInferredValues(mediaType, topics) {
    // Implement logic to map inferred media type and topics to predefined formats and topics
    // Match inferred values with predefined taxonomy

    // Load predefined topics from topics.json
    // const predefinedTopicsList = loadTopics();

    // Map inferred topics to predefined topics
    // const predefinedTopics = topics.map(topic => {
    //     const matchedTopic = predefinedTopicsList.find(predefinedTopic => predefinedTopic.name === topic);
    //     return matchedTopic ? matchedTopic.hname || matchedTopic.name : topic;
    // });

    // Assuming the media type is always 'Article'
    // const predefinedMediaType = "Article";

    // Placeholder return value until we can fix the openai import issue 
    const predefinedMediaType = "Article";
    const predefinedTopics = ["Topic 1", "Topic 2"];
    return { predefinedMediaType, predefinedTopics };
}
// Placeholder function to format the response
function formatResponse(predefinedMediaType, predefinedTopics) {
    // Implement logic to format the extracted metadata into the desired response structure
    // Construct the response object
    // Placeholder code
    const response = {
        format: predefinedMediaType,
        topics: predefinedTopics,
    };
    return response;
}

export async function handler(event) {
    try {
        // Extract URL and API Key from the request body
        const { url, apiKey } = JSON.parse(event.body);

        // Validate if URL and API Key are present
        if (!url || !apiKey) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'URL and API Key are required' }),
            };
        }

        // Step 1: Fetch content from the URL using a web scraping service
        const fetchedContent = await fetchContentFromURL(url);

        // Step 2: Simplify the fetched content for GPT analysis
        const simplifiedContent = simplifyContent(fetchedContent);

        // Step 3: Perform GPT analysis for media type and topics
        const { inferredMediaType, extractedTopics } = await performGPTAnalysis(simplifiedContent, apiKey);

        // Step 4: Map inferred values to predefined formats and topics
        const { predefinedMediaType, predefinedTopics } = mapInferredValues(inferredMediaType, extractedTopics);

        // Step 5: Format the response
        const formattedResponse = formatResponse(predefinedMediaType, predefinedTopics);

        // Return the formatted response
        return {
            statusCode: 200,
            // returning the output of the simplifyContent function, to test the function
            body: JSON.stringify(simplifiedContent),
        };
    } catch (error) {
        console.error('Error occurred:', error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Something went wrong', details: error.message }),
        };
    }
}