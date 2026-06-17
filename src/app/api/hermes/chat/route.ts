import { NextRequest } from 'next/server';

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

    // 创建流式响应
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        try {
          // 这里应该调用Hermes Agent的gateway/api
          // 暂时使用模拟响应来演示流式输出
          // 实际项目中需要替换为真实的Hermes Agent API调用
          
          const mockResponses = [
            '好的，我理解你的需求了。',
            '让我帮你处理这个采购任务。',
            '\n\n首先，我需要确认一些关键信息：',
            '\n1. 产品名称和规格',
            '\n2. 需要的数量',
            '\n3. 期望的到货时间',
            '\n\n请提供这些信息，我将帮你创建采购需求并启动智能询价流程。',
          ];

          // 模拟流式输出
          for (const response of mockResponses) {
            for (let i = 0; i < response.length; i++) {
              const chunk = response[i];
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`)
              );
              // 模拟打字机效果的延迟
              await new Promise((resolve) => setTimeout(resolve, 30));
            }
          }

          // 发送完成信号
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();

          /* 
          // 真实的Hermes Agent API调用示例（需要根据实际API调整）
          const hermesResponse = await fetch('https://hermes-agent-gateway/api/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.HERMES_API_KEY}`,
            },
            body: JSON.stringify({
              messages: hermesMessages,
              stream: true,
            }),
          });

          if (!hermesResponse.ok) {
            throw new Error(`Hermes API error: ${hermesResponse.status}`);
          }

          const reader = hermesResponse.body?.getReader();
          if (!reader) {
            throw new Error('No reader available from Hermes API');
          }

          const decoder = new TextDecoder();
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            // 直接透传Hermes Agent的流式响应
            controller.enqueue(value);
          }
          */

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
