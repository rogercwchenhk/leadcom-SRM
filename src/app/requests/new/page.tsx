'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Send,
  Loader2
} from 'lucide-react';

export default function NewRequestPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    productName: '',
    specifications: '',
    quantity: '',
    deliveryDate: '',
    budget: '',
    remarks: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    if (!formData.productName.trim() || !formData.quantity) {
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      router.push('/requests');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-slate-900 tracking-tight">
              新建采购需求
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              填写采购需求信息，带 * 为必填项
            </p>
          </div>
        </div>

        {/* 主内容区域 */}
        <div className="w-full max-w-2xl">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-1 pt-2 px-4">
              <CardTitle className="text-sm font-semibold text-slate-900">采购需求信息</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0">
              <div className="space-y-4">
                {/* 产品名称 */}
                <div className="space-y-1.5">
                  <Label htmlFor="productName" className="text-sm font-medium text-slate-700">
                    产品名称 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="productName"
                    placeholder="请输入产品名称"
                    value={formData.productName}
                    onChange={(e) => handleInputChange('productName', e.target.value)}
                    className="h-9 bg-slate-50 border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-lg text-xs"
                  />
                </div>

                {/* 规格描述 */}
                <div className="space-y-1.5">
                  <Label htmlFor="specifications" className="text-sm font-medium text-slate-700">
                    规格描述
                  </Label>
                  <Input
                    id="specifications"
                    placeholder="请输入产品规格、型号等详细信息"
                    value={formData.specifications}
                    onChange={(e) => handleInputChange('specifications', e.target.value)}
                    className="h-9 bg-slate-50 border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-lg text-xs"
                  />
                </div>

                {/* 数量和预算 */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="quantity" className="text-sm font-medium text-slate-700">
                      数量 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="请输入数量"
                      value={formData.quantity}
                      onChange={(e) => handleInputChange('quantity', e.target.value)}
                      className="h-9 bg-slate-50 border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-lg text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="budget" className="text-sm font-medium text-slate-700">
                      预算金额（元）
                    </Label>
                    <Input
                      id="budget"
                      type="number"
                      placeholder="请输入预算"
                      value={formData.budget}
                      onChange={(e) => handleInputChange('budget', e.target.value)}
                      className="h-9 bg-slate-50 border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-lg text-xs"
                    />
                  </div>
                </div>

                {/* 期望货期 */}
                <div className="space-y-1.5">
                  <Label htmlFor="deliveryDate" className="text-sm font-medium text-slate-700">
                    期望货期
                  </Label>
                  <Input
                    id="deliveryDate"
                    type="date"
                    value={formData.deliveryDate}
                    onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                    className="h-9 bg-slate-50 border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-lg text-xs"
                  />
                </div>

                {/* 备注说明 */}
                <div className="space-y-1.5">
                  <Label htmlFor="remarks" className="text-sm font-medium text-slate-700">
                    备注说明
                  </Label>
                  <Textarea
                    id="remarks"
                    placeholder="请输入其他需要说明的信息"
                    value={formData.remarks}
                    onChange={(e) => handleInputChange('remarks', e.target.value)}
                    className="min-h-[100px] resize-none bg-slate-50 border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-lg text-xs"
                  />
                </div>
              </div>
            </CardContent>
            <CardContent className="px-4 pb-4 pt-0 flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => router.push('/requests')}
                disabled={isSubmitting}
                className="flex-1 border-slate-200 hover:border-slate-300 text-xs h-9"
              >
                取消
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.productName.trim() || !formData.quantity}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white text-xs h-9"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden="true" />
                    提交中…
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" aria-hidden="true" />
                    提交需求
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
