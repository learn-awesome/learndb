const fetch = require('node-fetch'); // Import for webscraping in fetchContentFromURL()
import { OpenAIApi, Configuration } from 'openai';
// const { Configuration, OpenAIApi } = require('openai');

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
    // Denote headings with a marker (like '###') and add a line break
    content = content.replace(/<h[1-6].*?>(.*?)<\/h[1-6]>/g, '\n### $1\n');
    // Remove script and style elements and their content
    let simplifiedContent = content.replace(/<script.*?>.*?<\/script>/gms, '');
    simplifiedContent = simplifiedContent.replace(/<style.*?>.*?<\/style>/gms, '');
    // Remove all remaining HTML tags, leaving the inner text
    simplifiedContent = simplifiedContent.replace(/<[^>]+>/g, '');
    // Manually replace common HTML entities
    simplifiedContent = simplifiedContent
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
    // Remove inline CSS and JavaScript event handlers
    simplifiedContent = simplifiedContent.replace(/style\s*=\s*'.*?'/gi, '');
    simplifiedContent = simplifiedContent.replace(/on\w+\s*=\s*".*?"/gi, '');
    // Normalize whitespace without removing sentence punctuation
    simplifiedContent = simplifiedContent.replace(/\s+/g, ' ').trim();
    // Condense multiple line breaks into a single one
    simplifiedContent = simplifiedContent.replace(/(\r\n|\r|\n){2,}/g, '\n');
    return simplifiedContent;
}


// Placeholder function to perform GPT analysis for media type and topics using Mistral-7b via OpenRouter
async function performGPTAnalysis(simplifiedContent, apiKey) {
    // Implement logic to send content to Mistral-7b via OpenRouter for GPT analysis
    // Send content and receive GPT analysis response
    // Placeholder code
    const inferredMediaType = ["article"];
    const extractedTopics = ["topic1", "topic2"];
    return { inferredMediaType, extractedTopics };
}

// Placeholder function to map inferred values to predefined formats and topics
function mapInferredValues(mediaType, topics) {
    // Implement logic to map inferred media type and topics to predefined formats and topics
    // Match inferred values with predefined taxonomy
    // Placeholder code
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