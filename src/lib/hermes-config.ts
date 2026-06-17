// Hermes Agent 配置
export const HERMES_CONFIG = {
  baseUrl: process.env.HERMES_AGENT_URL || '',
  apiKey: process.env.HERMES_API_KEY || '',
  // 备用API Key
  apiKeyAlt: process.env.HERMES_API_KEY_ALT || '',
  enabled: process.env.HERMES_ENABLED !== 'false',
  
  // API端点
  endpoints: {
    chat: '/chat/completions',
    models: '/models',
  }
} as const;
