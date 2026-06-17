// Hermes Agent 配置
export const HERMES_CONFIG = {
  baseUrl: process.env.HERMES_AGENT_URL || 'http://192.168.2.105:8642/V1',
  apiKey: process.env.HERMES_API_KEY || '691b5dc834e04f39807e49f4bcb1715c98d610bed4',
  // 备用API Key
  apiKeyAlt: 'e009566f4b0c875d3482c9',
  enabled: process.env.HERMES_ENABLED !== 'false',
  
  // API端点
  endpoints: {
    chat: '/chat/completions',
    models: '/models',
  }
} as const;
