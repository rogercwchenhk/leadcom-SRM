'use client';

import { useState, useEffect } from 'react';
import { Building2, Save, Upload, Globe, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

interface CompanySettingsData {
  companyName: string;
  companyLogo: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  taxId: string;
  businessLicense: string;
}

export function CompanySettings() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [companySettings, setCompanySettings] = useState<CompanySettingsData>({
    companyName: '',
    companyLogo: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    taxId: '',
    businessLicense: '',
  });

  useEffect(() => {
    loadCompanySettings();
  }, []);

  async function loadCompanySettings() {
    setLoading(true);
    try {
      const response = await fetch('/api/settings/company');
      const result = await response.json();
      if (result.success) {
        setCompanySettings(result.data);
      }
    } catch (error) {
      console.error('Failed to load company settings:', error);
      toast.error('加载公司信息失败');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const response = await fetch('/api/settings/company', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(companySettings),
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('公司信息已保存');
      } else {
        toast.error(result.error || '保存失败');
      }
    } catch (error) {
      console.error('Failed to save company settings:', error);
      toast.error('保存失败');
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
      {/* Logo 和公司名称 */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <Building2 className="h-4 w-4 text-orange-600" />
            企业标识
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            配置公司Logo、名称等基本标识信息
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Logo 上传 */}
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24 rounded-xl border-2 border-dashed border-slate-200">
                <AvatarImage src={companySettings.companyLogo} />
                <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white text-2xl">
                  {companySettings.companyName ? companySettings.companyName.substring(0, 2) : '公'}
                </AvatarFallback>
              </Avatar>
              <Button variant="secondary" size="sm" className="gap-2">
                <Upload className="h-4 w-4" />
                上传Logo
              </Button>
            </div>

            {/* 公司名称 */}
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">公司名称 *</Label>
                <Input
                  id="company-name"
                  value={companySettings.companyName}
                  onChange={(e) => setCompanySettings({ ...companySettings, companyName: e.target.value })}
                  placeholder="请输入公司全称"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tax-id">统一社会信用代码</Label>
                <Input
                  id="tax-id"
                  value={companySettings.taxId}
                  onChange={(e) => setCompanySettings({ ...companySettings, taxId: e.target.value })}
                  placeholder="请输入统一社会信用代码"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 联系信息 */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <Mail className="h-4 w-4 text-orange-600" />
            联系信息
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            配置公司的联系方式和地址信息
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="website" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                公司官网
              </Label>
              <Input
                id="website"
                value={companySettings.website}
                onChange={(e) => setCompanySettings({ ...companySettings, website: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                联系电话
              </Label>
              <Input
                id="phone"
                value={companySettings.phone}
                onChange={(e) => setCompanySettings({ ...companySettings, phone: e.target.value })}
                placeholder="400-123-4567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                联系邮箱
              </Label>
              <Input
                id="email"
                type="email"
                value={companySettings.email}
                onChange={(e) => setCompanySettings({ ...companySettings, email: e.target.value })}
                placeholder="contact@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                公司地址
              </Label>
              <Input
                id="address"
                value={companySettings.address}
                onChange={(e) => setCompanySettings({ ...companySettings, address: e.target.value })}
                placeholder="请输入公司地址"
              />
            </div>
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
