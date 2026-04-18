import { ref } from 'vue'
import { analyzeInspiration } from '../utils/ai'
import { useStorage } from './useStorage'
import { useInspiration } from './useInspiration'
import { callWenxinAPI, callTongyiAPI, callZhipuAPI, callDeepSeekAPI, callOpenAIAPI, callGeminiAPI, callCustomAPI, callWenxinAPIRaw, callTongyiAPIRaw, callZhipuAPIRaw, callDeepSeekAPIRaw, callOpenAIAPIRaw, callGeminiAPIRaw, callCustomAPIRaw } from '../utils/ai'

export function useAI() {
  const { aiConfig } = useStorage()
  const { updateInspiration } = useInspiration()
  const isAnalyzing = ref(false)
  const error = ref(null)

  async function analyze(inspirationId, content) {
    if (!aiConfig.value) {
      error.value = '请先配置 AI 服务'
      return null
    }

    isAnalyzing.value = true
    error.value = null

    try {
      const analysis = await analyzeInspiration(content, aiConfig.value)
      updateInspiration(inspirationId, { aiAnalysis: analysis })
      return analysis
    } catch (err) {
      error.value = err instanceof Error ? err.message : '分析失败'
      return null
    } finally {
      isAnalyzing.value = false
    }
  }

  function setConfig(config) {
    aiConfig.value = config
  }

  function clearConfig() {
    aiConfig.value = null
  }

  async function testModel(config) {
    if (!config.apiKey) {
      return { success: false, message: '请输入API Key' }
    }

    const testPrompt = '请返回"测试成功"，不要包含其他内容'

    try {
      let responseText
      switch (config.provider) {
        case 'wenxin':
          responseText = await callWenxinAPIRaw(testPrompt, config)
          break
        case 'tongyi':
          responseText = await callTongyiAPIRaw(testPrompt, config)
          break
        case 'zhipu':
          responseText = await callZhipuAPIRaw(testPrompt, config)
          break
        case 'deepseek':
          responseText = await callDeepSeekAPIRaw(testPrompt, config)
          break
        case 'openai':
          responseText = await callOpenAIAPIRaw(testPrompt, config)
          break
        case 'gemini':
          responseText = await callGeminiAPIRaw(testPrompt, config)
          break
        case 'custom':
          if (!config.apiUrl) {
            return { success: false, message: '请输入API URL' }
          }
          responseText = await callCustomAPIRaw(testPrompt, config)
          break
        default:
          return { success: false, message: '不支持的AI提供商' }
      }

      const success = responseText.includes('测试成功')
      return {
        success,
        message: success ? '测试成功！API配置正确' : '测试失败，请检查API配置'
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : '测试失败，请检查API配置'
      }
    }
  }

  async function analyzeFeasibility(content) {
    if (!aiConfig.value) {
      throw new Error('请先配置AI服务')
    }

    const prompt = `请分析以下想法的可行性，从以下几个方面进行评估：
1. 市场潜力：这个想法是否有市场需求？目标用户群体有多大？
2. 技术可行性：实现这个想法需要哪些技术？技术难度如何？
3. 实施难度：从创意到落地需要哪些步骤？时间和资源投入如何？
4. 竞争分析：是否已有类似产品？这个想法的差异化优势是什么？
5. 潜在风险：实施过程中可能遇到哪些风险和挑战？

想法内容：
${content}

请提供：
1. 总体可行性评估（高/中/低）
2. 详细分析
3. 3-5条具体的建议

请以JSON格式返回，不要包含其他文字：
{
  "feasibility": "高/中/低",
  "analysis": "详细分析内容",
  "suggestions": ["建议1", "建议2", "建议3"]
}`

    try {
      let responseText
      switch (aiConfig.value.provider) {
        case 'wenxin':
          responseText = await callWenxinAPIRaw(prompt, aiConfig.value)
          break
        case 'tongyi':
          responseText = await callTongyiAPIRaw(prompt, aiConfig.value)
          break
        case 'zhipu':
          responseText = await callZhipuAPIRaw(prompt, aiConfig.value)
          break
        case 'deepseek':
          responseText = await callDeepSeekAPIRaw(prompt, aiConfig.value)
          break
        case 'openai':
          responseText = await callOpenAIAPIRaw(prompt, aiConfig.value)
          break
        case 'gemini':
          responseText = await callGeminiAPIRaw(prompt, aiConfig.value)
          break
        case 'custom':
          if (!aiConfig.value.apiUrl) {
            throw new Error('请输入API URL')
          }
          responseText = await callCustomAPIRaw(prompt, aiConfig.value)
          break
        default:
          throw new Error('不支持的AI提供商')
      }

      try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0])
        }
      } catch {
        return {
          feasibility: '中',
          analysis: responseText,
          suggestions: ['进一步研究市场需求', '制定详细的实施计划', '评估技术可行性']
        }
      }

      return {
        feasibility: '中',
        analysis: '分析失败，请重试',
        suggestions: ['检查AI配置', '尝试使用不同的模型', '简化想法描述']
      }
    } catch (error) {
      console.error('Feasibility analysis failed:', error)
      throw error
    }
  }

  async function chatWithAI(content, conversationHistory) {
    if (!aiConfig.value) {
      throw new Error('请先配置AI服务')
    }

    const prompt = `基于以下想法和对话历史，继续与用户进行对话：

原始想法：
${content}

对话历史：
${conversationHistory.map(msg => `${msg.role === 'user' ? '用户' : '助手'}: ${msg.content}`).join('\n')}

请以助手的身份回应，保持对话的连贯性和相关性，基于原始想法提供有价值的见解和建议。

重要：请使用纯文本格式输出，不要使用Markdown格式，不要包含任何Markdown标记（如#、**、*等）。`

    try {
      let responseText
      switch (aiConfig.value.provider) {
        case 'wenxin':
          responseText = await callWenxinAPIRaw(prompt, aiConfig.value)
          break
        case 'tongyi':
          responseText = await callTongyiAPIRaw(prompt, aiConfig.value)
          break
        case 'zhipu':
          responseText = await callZhipuAPIRaw(prompt, aiConfig.value)
          break
        case 'deepseek':
          responseText = await callDeepSeekAPIRaw(prompt, aiConfig.value)
          break
        case 'openai':
          responseText = await callOpenAIAPIRaw(prompt, aiConfig.value)
          break
        case 'gemini':
          responseText = await callGeminiAPIRaw(prompt, aiConfig.value)
          break
        case 'custom':
          if (!aiConfig.value.apiUrl) {
            throw new Error('请输入API URL')
          }
          responseText = await callCustomAPIRaw(prompt, aiConfig.value)
          break
        default:
          throw new Error('不支持的AI提供商')
      }

      const plainText = responseText
        .replace(/\#\#\#\s/g, '')
        .replace(/\#\#\s/g, '')
        .replace(/\#\s/g, '')
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '$1')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/```[\s\S]*?```/g, '')
        .trim()

      return plainText || '抱歉，我无法理解您的问题，请尝试重新表述。'
    } catch (error) {
      console.error('Chat with AI failed:', error)
      throw error
    }
  }

  return {
    aiConfig,
    isAnalyzing,
    error,
    analyze,
    setConfig,
    clearConfig,
    testModel,
    analyzeFeasibility,
    chatWithAI,
  }
}