'use client';

import { useState, useEffect } from 'react';
import { Bell, Save, Mail, MessageSquare, Smartphone, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

interface NotificationSettings {
  email: {
    enabled: boolean;
    address: string;
    contractUpload: boolean;
    approvalRequired: boolean;
    approvalCompleted: boolean;
    poCreated: boolean;
    supplierResponse: boolean;
    systemAlert: boolean;
  };
  inApp: {
    enabled: boolean;
    contractUpload: boolean;
    approvalRequired: boolean;
    approvalCompleted: boolean;
    poCreated: boolean;
    supplierResponse: boolean;
    systemAlert: boolean;
  };
  push: {
    enabled: boolean;
    contractUpload: boolean;
    approvalRequired: boolean;
    approvalCompleted: boolean;
    poCreated: boolean;
    supplierResponse: boolean;
    systemAlert: boolean;
  };
}

export function NotificationSettings() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    email: {
      enabled: true,
      address: '',
      contractUpload: true,
      approvalRequired: true,
      approvalCompleted: true,
      poCreated: true,
      supplierResponse: true,
      systemAlert: true,
    },
    inApp: {
      enabled: true,
      contractUpload: true,
      approvalRequired: true,
      approvalCompleted: true,
      poCreated: true,
      supplierResponse: true,
      systemAlert: true,
    },
    push: {
      enabled: false,
      contractUpload: false,
      approvalRequired: true,
      approvalCompleted: true,
      poCreated: false,
      supplierResponse: true,
      systemAlert: true,
    },
  });

  useEffect(() => {
    loadNotificationSettings();
  }, []);

  async function loadNotificationSettings() {
    setLoading(true);
    try {
      // 从API加载数据
      const response = await fetch('/api/settings?section=notification');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      } else {
        console.error('加载通知设置失败:', response.status);
      }
    } catch (error) {
      console.error('加载通知设置失败:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      // 保存到API
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ section: 'notification', data: settings }),
      });
      
      if (response.ok) {
        alert('保存成功！');
      } else {
        alert('保存失败');
      }
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败');
    } finally {
      setSaving(false);
    }
  }

  function updateEmailSetting(key: keyof NotificationSettings['email'], value: any) {
    setSettings({
      ...settings,
      email: { ...settings.email, [key]: value },
    });
  }

  function updateInAppSetting(key: keyof NotificationSettings['inApp'], value: any) {
    setSettings({
      ...settings,
      inApp: { ...settings.inApp, [key]: value },
    });
  }

  function updatePushSetting(key: keyof NotificationSettings['push'], value: any) {
    setSettings({
      ...settings,
      push: { ...settings.push, [key]: value },
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  const notificationItems = [
    { key: 'contractUpload', label: '合同上传', description: '有新合同上传时' },
    { key: 'approvalRequired', label: '待审批提醒', description: '需要您审批时' },
    { key: 'approvalCompleted', label: '审批完成', description: '审批流程完成时' },
    { key: 'poCreated', label: 'PO 创建', description: '采购订单创建时' },
    { key: 'supplierResponse', label: '供应商响应', description: '供应商回复询价时' },
    { key: 'systemAlert', label: '系统告警', description: '系统重要通知时' },
  ];

  return (
    <div className="space-y-6">
      {/* 邮件通知 */}
      <Card className="border-slate-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Mail className="h-4 w-4 text-orange-600" />
                邮件通知
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                通过邮件接收系统通知
              </CardDescription>
            </div>
            <Switch 
              checked={settings.email.enabled}
              onCheckedChange={(checked) => updateEmailSetting('enabled', checked)}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {settings.email.enabled && (
            <>
              <div className="space-y-2">
                <Label htmlFor="email-address">接收邮箱</Label>
                <Input
                  id="email-address"
                  type="email"
                  value={settings.email.address}
                  onChange={(e) => updateEmailSetting('address', e.target.value)}
                  placeholder="your-email@example.com"
                />
              </div>
              <Separator />
              <div className="space-y-3">
                {notificationItems.map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-medium text-slate-900">{item.label}</h4>
                      <p className="text-xs text-slate-500">{item.description}</p>
                    </div>
                    <Switch 
                      checked={Boolean(settings.email[item.key as keyof typeof settings.email])}
                      onCheckedChange={(checked) => updateEmailSetting(item.key as any, checked)}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* 站内通知 */}
      <Card className="border-slate-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <MessageSquare className="h-4 w-4 text-orange-600" />
                站内通知
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                在系统内接收通知消息
              </CardDescription>
            </div>
            <Switch 
              checked={settings.inApp.enabled}
              onCheckedChange={(checked) => updateInAppSetting('enabled', checked)}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {settings.inApp.enabled && (
            <div className="space-y-3">
              {notificationItems.map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-medium text-slate-900">{item.label}</h4>
                    <p className="text-xs text-slate-500">{item.description}</p>
                  </div>
                  <Switch 
                    checked={settings.inApp[item.key as keyof typeof settings.inApp]}
                    onCheckedChange={(checked) => updateInAppSetting(item.key as any, checked)}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 推送通知 */}
      <Card className="border-slate-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Smartphone className="h-4 w-4 text-orange-600" />
                推送通知
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                移动端推送通知
              </CardDescription>
            </div>
            <Switch 
              checked={settings.push.enabled}
              onCheckedChange={(checked) => updatePushSetting('enabled', checked)}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {settings.push.enabled && (
            <div className="space-y-3">
              {notificationItems.map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-medium text-slate-900">{item.label}</h4>
                    <p className="text-xs text-slate-500">{item.description}</p>
                  </div>
                  <Switch 
                    checked={settings.push[item.key as keyof typeof settings.push]}
                    onCheckedChange={(checked) => updatePushSetting(item.key as any, checked)}
                  />
                </div>
              ))}
            </div>
          )}
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