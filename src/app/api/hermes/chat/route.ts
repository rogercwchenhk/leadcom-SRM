import { NextRequest } from 'next/server';
import { HERMES_CONFIG } from '@/lib/hermes-config';

export const maxDuration = 60;

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
}

// 系统提示词 - 定义AI助手的角色和行为
const SYSTEM_PROMPT = `你是一个专业的AI采购管理助手，基于Hermes Agent驱动。你的职责是帮助用户通过自然语言操作采购管理系统。

## 你的能力
1. 理解用户的自然语言需求，将其转化为系统操作
2. 可以执行以下操作：
   - 创建采购需求
   - 查询和管理供应商信息
   - 分析报价和货期
   - 生成采购订单(PO)
   - 跟踪发货状态
   - 管理发票和付款
   - 处理退货和换货等异常情况

## 响应格式
- 使用友好、专业的语气
- 当需要执行具体操作时，清晰说明你将做什么
- 提供操作步骤说明
- 如果信息不足，询问用户必要的细节

## 系统上下文
这是一个AI驱动的采购管理系统，包含以下核心流程：
1. 初步需求 → 需求确认 → 智能询价 → 比价分析 → 确定需求 → 确定供应商 → 审批流程 → 生成PO → 跟踪发货 → 接受发票 → 付款 → 异常处理

请用中文回复，并始终保持专业、友好的态度。`;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ChatRequest;
    const { messages } = body;

    // 准备发送给Hermes Agent的消息
    const hermesMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages,
    ];

    // 如果Hermes Agent未启用，使用模拟响应
    if (!HERMES_CONFIG.enabled) {
      return createMockResponse();
    }

    try {
      // 调用本地Hermes Agent API
      const hermesResponse = await fetch(`${HERMES_CONFIG.baseUrl}${HERMES_CONFIG.endpoints.chat}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${HERMES_CONFIG.apiKey}`,
        },
        body: JSON.stringify({
          messages: hermesMessages,
          stream: true,
          temperature: 0.7,
        }),
      });

      if (!hermesResponse.ok) {
        console.error(`Hermes API error: ${hermesResponse.status}`);
        // 如果主API Key失败，尝试备用Key
        if (HERMES_CONFIG.apiKeyAlt && HERMES_CONFIG.apiKey !== HERMES_CONFIG.apiKeyAlt) {
          console.log('Trying alternative API key...');
          const fallbackResponse = await fetch(`${HERMES_CONFIG.baseUrl}${HERMES_CONFIG.endpoints.chat}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${HERMES_CONFIG.apiKeyAlt}`,
            },
            body: JSON.stringify({
              messages: hermesMessages,
              stream: true,
              temperature: 0.7,
            }),
          });
          
          if (fallbackResponse.ok) {
            return createStreamResponse(fallbackResponse);
          }
        }
        throw new Error(`Hermes API error: ${hermesResponse.status}`);
      }

      return createStreamResponse(hermesResponse);

    } catch (apiError) {
      console.error('Failed to connect to Hermes Agent:', apiError);
      console.log('Falling back to mock response...');
      return createMockResponse();
    }

  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process chat request' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

// 创建流式响应
function createStreamResponse(hermesResponse: Response) {
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      
      try {
        const reader = hermesResponse.body?.getReader();
        if (!reader) {
          throw new Error('No reader available from Hermes API');
        }

        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          // 解析Hermes Agent的流式响应
          // 假设是OpenAI兼容格式
          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;
          
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine || trimmedLine === 'data: [DONE]') continue;
            if (trimmedLine.startsWith('data: ')) {
              try {
                const data = JSON.parse(trimmedLine.slice(6));
                const content = data.choices?.[0]?.delta?.content;
                if (content) {
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
                  );
                }
              } catch (e) {
                // 忽略解析错误
              }
            }
          }
        }

        // 发送完成信号
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();

      } catch (error) {
        console.error('Stream error:', error);
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ content: '\n抱歉，处理请求时出现错误。' })}\n\n`
          )
        );
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

// 创建模拟响应（作为后备方案）
function createMockResponse() {
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      const mockResponses = [
        '好的，我理解你的需求了。',
        '让我帮你处理这个采购任务。',
        '\n\n首先，我需要确认一些关键信息：',
        '\n1. 产品名称和规格',
        '\n2. 需要的数量',
        '\n3. 期望的到货时间',
        '\n\n请提供这些信息，我将帮你创建采购需求并启动智能询价流程。',
        '\n\n💡 提示：目前连接本地Hermes Agent失败，正在使用模拟响应。请检查网络连接和API配置。'
      ];

      for (const response of mockResponses) {
        for (let i = 0; i < response.length; i++) {
          const chunk = response[i];
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`)
          );
          await new Promise((resolve) => setTimeout(resolve, 30));
        }
      }

      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
