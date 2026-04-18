
import type { AIAnalysis, AIConfig } from '../types'

export async function analyzeInspiration(
  content: string,
  config: AIConfig
): Promise<AIAnalysis> {
  const prompt = `请分析以下灵感内容，提供：
1. 简洁的总结（50字以内）
2. 3-5个关键词
3. 2-3个可能的分类标签
4. 1-2个发展建议

灵感内容：
${content}

请以JSON格式返回，不要包含其他文字：
{
  "summary": "总结内容",
  "keywords": ["关键词1", "关键词2", "关键词3"],
  "categories": ["分类1", "分类2"],
  "suggestions": ["建议1", "建议2"]
}`

  try {
    let result: AIAnalysis

    switch (config.provider) {
      case 'wenxin':
        result = await callWenxinAPI(prompt, config)
        break
      case 'tongyi':
        result = await callTongyiAPI(prompt, config)
        break
      case 'zhipu':
        result = await callZhipuAPI(prompt, config)
        break
      case 'deepseek':
        result = await callDeepSeekAPI(prompt, config)
        break
      case 'openai':
        result = await callOpenAIAPI(prompt, config)
        break
      case 'gemini':
        result = await callGeminiAPI(prompt, config)
        break
      case 'custom':
        result = await callCustomAPI(prompt, config)
        break
      default:
        result = getMockAnalysis(content)
    }

    return result
  } catch (error) {
    console.error('AI analysis failed:', error)
    return getMockAnalysis(content)
  }
}

export async function callWenxinAPI(prompt: string, config: AIConfig): Promise<AIAnalysis> {
  const apiUrl = `https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/${config.model || 'ernie-lite-8k'}`

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  const data = await response.json()
  return parseAIResponse(data.result || data)
}

export async function callWenxinAPIRaw(prompt: string, config: AIConfig): Promise<string> {
  const apiUrl = `https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/${config.model || 'ernie-lite-8k'}`

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  const data = await response.json()
  return data.result || JSON.stringify(data)
}

export async function callTongyiAPI(prompt: string, config: AIConfig): Promise<AIAnalysis> {
  const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model || 'qwen-turbo',
      input: {
        messages: [{ role: 'user', content: prompt }],
      },
    }),
  })

  const data = await response.json()
  return parseAIResponse(data.output?.text || data)
}

export async function callTongyiAPIRaw(prompt: string, config: AIConfig): Promise<string> {
  const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model || 'qwen-turbo',
      input: {
        messages: [{ role: 'user', content: prompt }],
      },
    }),
  })

  const data = await response.json()
  return data.output?.text || JSON.stringify(data)
}

export async function callZhipuAPI(prompt: string, config: AIConfig): Promise<AIAnalysis> {
  const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model || 'glm-4-flash',
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  const data = await response.json()
  return parseAIResponse(data.choices?.[0]?.message?.content || data)
}

export async function callZhipuAPIRaw(prompt: string, config: AIConfig): Promise<string> {
  const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model || 'glm-4-flash',
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  const data = await response.json()
  return data.choices?.[0]?.message?.content || JSON.stringify(data)
}

export async function callCustomAPI(prompt: string, config: AIConfig): Promise<AIAnalysis> {
  if (!config.apiUrl) {
    throw new Error('Custom API URL is required')
  }

  const response = await fetch(config.apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      prompt,
      model: config.model,
    }),
  })

  const data = await response.json()
  return parseAIResponse(data)
}

export async function callCustomAPIRaw(prompt: string, config: AIConfig): Promise<string> {
  if (!config.apiUrl) {
    throw new Error('Custom API URL is required')
  }

  const response = await fetch(config.apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      prompt,
      model: config.model,
    }),
  })

  const data = await response.json()
  return JSON.stringify(data)
}

export async function callDeepSeekAPI(prompt: string, config: AIConfig): Promise<AIAnalysis> {
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model || 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  const data = await response.json()
  return parseAIResponse(data.choices?.[0]?.message?.content || data)
}

export async function callDeepSeekAPIRaw(prompt: string, config: AIConfig): Promise<string> {
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model || 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  const data = await response.json()
  return data.choices?.[0]?.message?.content || JSON.stringify(data)
}

export async function callOpenAIAPI(prompt: string, config: AIConfig): Promise<AIAnalysis> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model || 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  const data = await response.json()
  return parseAIResponse(data.choices?.[0]?.message?.content || data)
}

export async function callOpenAIAPIRaw(prompt: string, config: AIConfig): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model || 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  const data = await response.json()
  return data.choices?.[0]?.message?.content || JSON.stringify(data)
}

export async function callGeminiAPI(prompt: string, config: AIConfig): Promise<AIAnalysis> {
  const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  })

  const data = await response.json()
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text || data
  return parseAIResponse(content)
}

export async function callGeminiAPIRaw(prompt: string, config: AIConfig): Promise<string> {
  const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  })

  const data = await response.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || JSON.stringify(data)
}

function parseAIResponse(response: any): AIAnalysis {
  if (typeof response === 'string') {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
    } catch {
      console.error('Failed to parse AI response as JSON')
    }
  }

  if (response.summary && response.keywords) {
    return response as AIAnalysis
  }

  throw new Error('Invalid AI response format')
}

function getMockAnalysis(content: string): AIAnalysis {
  const keywords = content
    .split(/[\s，。！？、；：""''（）【】\.,!\?;:''""]+/)
    .filter((word) => word.length >= 2)
    .slice(0, 5)

  return {
    summary: content.length > 30 ? content.slice(0, 30) + '...' : content,
    keywords: keywords.length > 0 ? keywords : ['创意', '灵感'],
    categories: ['创意想法'],
    suggestions: ['继续深入思考这个方向', '记录相关的补充信息'],
  }
}
