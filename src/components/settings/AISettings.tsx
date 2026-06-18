'use client';

import { useState, useEffect } from 'react';
import { Bot, Save, RefreshCw, Terminal, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface AISettings {
  enabled: boolean;
  apiEndpoint: string;
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  autoInquiry: boolean;
  autoDecision: boolean;
}

export function AISettings() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');
  const [settings, setSettings] = useState<AISettings>({
    enabled: true,
    apiEndpoint: '',
    apiKey: '',
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2048,
    systemPrompt: '',
    autoInquiry: true,
    autoDecision: false,
  });

  useEffect(() => {
    loadAISettings();
  }, []);

  async function loadAISettings() {
    setLoading(true);
    try {
      // 模拟加载数据
      setSettings({
        enabled: true,
        apiEndpoint: 'https://api.hermes-agent.example.com/v1',
        apiKey: 'sk-********************************',
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 2048,
        systemPrompt: '你是一个专业的采购助手，帮助用户管理采购需求、分析供应商报价、提供决策建议。',
        autoInquiry: true,
        autoDecision: false,
      });
    } catch (error) {
      console.error('加载AI设置失败:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleTestConnection() {
    setTesting(true);
    setTestStatus('testing');
    setTestMessage('正在连接 Hermes Agent...');
    
    try {
      // 模拟连接测试
      await new Promise(resolve => setTimeout(resolve, 2000));
      setTestStatus('success');
      setTestMessage('连接成功！Hermes Agent 响应正常。');
    } catch (error) {
      setTestStatus('error');
      setTestMessage('连接失败，请检查 API 地址和密钥是否正确。');
    } finally {
      setTesting(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('保存成功！');
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI 总开关 */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <Bot className="h-4 w-4 text-orange-600" />
            Hermes Agent 配置
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            配置 AI 助手的基础功能开关
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-slate-900">启用 AI 助手</h4>
              <p className="text-xs text-slate-500">
                关闭后 Hermes Agent 将停止所有智能功能
              </p>
            </div>
            <Switch 
              checked={settings.enabled}
              onCheckedChange={(checked) => setSettings({ ...settings, enabled: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* 连接配置 */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-slate-900">API 连接配置</CardTitle>
          <CardDescription className="text-xs text-slate-500">
            配置 Hermes Agent 的 API 连接参数
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="api-endpoint">API 端点</Label>
              <Input
                id="api-endpoint"
                value={settings.apiEndpoint}
                onChange={(e) => setSettings({ ...settings, apiEndpoint: e.target.value })}
                placeholder="https://api.hermes-agent.example.com/v1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="api-key">API 密钥</Label>
              <Input
                id="api-key"
                type="password"
                value={settings.apiKey}
                onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                placeholder="sk-********************************"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="model">模型</Label>
              <Input
                id="model"
                value={settings.model}
                onChange={(e) => setSettings({ ...settings, model: e.target.value })}
                placeholder="gpt-4"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="temperature">温度 ({settings.temperature})</Label>
              <Input
                id="temperature"
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={settings.temperature}
                onChange={(e) => setSettings({ ...settings, temperature: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-tokens">最大 Token 数</Label>
              <Input
                id="max-tokens"
                type="number"
                value={settings.maxTokens}
                onChange={(e) => setSettings({ ...settings, maxTokens: Number(e.target.value) })}
                placeholder="2048"
              />
            </div>
          </div>

          {/* 连接测试 */}
          <div className="flex items-center gap-4 pt-2">
            <Button 
              onClick={handleTestConnection} 
              disabled={testing}
              variant="secondary"
              className="gap-2"
            >
              {testing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Terminal className="h-4 w-4" />
              )}
              {testing ? '测试中...' : '测试连接'}
            </Button>
            
            {testStatus !== 'idle' && (
              <div className="flex items-center gap-2">
                {testStatus === 'success' && (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                )}
                {testStatus === 'error' && (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <span className={`text-sm ${testStatus === 'success' ? 'text-green-600' : testStatus === 'error' ? 'text-red-600' : 'text-slate-600'}`}>
                  {testMessage}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 系统提示词 */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-slate-900">系统提示词</CardTitle>
          <CardDescription className="text-xs text-slate-500">
            定义 Hermes Agent 的角色和行为准则
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={settings.systemPrompt}
            onChange={(e) => setSettings({ ...settings, systemPrompt: e.target.value })}
            placeholder="输入系统提示词..."
            className="min-h-[150px] resize-none font-mono text-sm"
          />
        </CardContent>
      </Card>

      {/* 智能功能开关 */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-slate-900">智能功能</CardTitle>
          <CardDescription className="text-xs text-slate-500">
            配置 Hermes Agent 的自动功能开关
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium text-slate-900">自动发送询价</h4>
                <Badge variant="outline" className="text-xs">推荐</Badge>
              </div>
              <p className="text-xs text-slate-500">
                需求确认后自动向供应商发送公开询价链接
              </p>
            </div>
            <Switch 
              checked={settings.autoInquiry}
              onCheckedChange={(checked) => setSettings({ ...settings, autoInquiry: checked })}
            />
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium text-slate-900">自动供应商选择</h4>
                <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">谨慎</Badge>
              </div>
              <p className="text-xs text-slate-500">
                分析报价后自动选择最优供应商（仍需人工确认）
              </p>
            </div>
            <Switch 
              checked={settings.autoDecision}
              onCheckedChange={(checked) => setSettings({ ...settings, autoDecision: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* 保存按钮 */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          <Save className="h-4 w-4" />
          {saving ? '保存中...' : '保存设置'}
        </Button>
      </div>
    </div>
  );
}