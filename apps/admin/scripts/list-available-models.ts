import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEYS?.split(',')[0] || process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('No API key found!');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
  try {
    console.log('Fetching available Gemini models...\n');
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    console.log('Available models that support generateContent:\n');
    
    const models = data.models || [];
    const contentModels = models.filter((model: any) => 
      model.supportedGenerationMethods?.includes('generateContent')
    );
    
    contentModels.forEach((model: any) => {
      console.log(`✓ ${model.name}`);
      console.log(`  Display Name: ${model.displayName}`);
      console.log(`  Description: ${model.description}`);
      console.log(`  Input Token Limit: ${model.inputTokenLimit}`);
      console.log(`  Output Token Limit: ${model.outputTokenLimit}`);
      console.log('');
    });
    
    console.log(`\nTotal: ${contentModels.length} models available`);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

listModels();
