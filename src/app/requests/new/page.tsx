'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Send,
  Loader2,
  ArrowLeft,
  FileText,
  Plus,
  Link2,
  Search,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';

// 模拟合同列表
const mockContracts = [
  {
    id: 'contract-1',
    contractNumber: 'SC-2024-0015',
    customerName: '北京科技有限公司',
    totalAmount: 158000,
    items: [
      { productName: '联想ThinkPad X1 Carbon', quantity: 10, unitPrice: 11800 },
      { productName: '戴尔OptiPlex 7010', quantity: 5, unitPrice: 8000 }
    ]
  },
  {
    id: 'contract-2',
    contractNumber: 'SC-2024-0014',
    customerName: '上海贸易集团',
    totalAmount: 286500,
    items: [
      { productName: '办公设备套装', quantity: 20, unitPrice: 14325 }
    ]
  }
];

type RequestType = 'determined' | 'undetermined';

const requestTypeConfig: Record<RequestType, { label: string; description: string; color: string }> = {
  determined: { 
    label: '确定需求', 
    description: '来自销售合同，自动填充数据',
    color: 'bg-blue-100 text-blue-700'
  },
  undetermined: { 
    label: '非确定需求', 
    description: '独立创建，支持外部询价',
    color: 'bg-orange-100 text-orange-700'
  }
};

export default function NewRequestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contractIdFromUrl = searchParams.get('contractId');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestType, setRequestType] = useState<RequestType>(
    contractIdFromUrl ? 'determined' : 'undetermined'
  );
  const [selectedContract, setSelectedContract] = useState<string>(contractIdFromUrl || '');
  const [selectedContractItem, setSelectedContractItem] = useState<string>('');
  const [showContractSelector, setShowContractSelector] = useState(false);
  
  const [formData, setFormData] = useState({
    productName: '',
    specifications: '',
    quantity: '',
    deliveryDate: '',
    budget: '',
    remarks: ''
  });

  // 获取当前选中的合同
  const currentContract = mockContracts.find(c => c.id === selectedContract);

  // 当选择合同时，自动填充数据
  useEffect(() => {
    if (selectedContract && requestType === 'determined') {
      const contract = mockContracts.find(c => c.id === selectedContract);
      if (contract) {
        // 如果选择了具体的合同项
        if (selectedContractItem) {
          const item = contract.items.find((_, idx) => idx.toString() === selectedContractItem);
          if (item) {
            setFormData(prev => ({
              ...prev,
              productName: item.productName,
              quantity: item.quantity.toString(),
              budget: (item.unitPrice * item.quantity).toString()
            }));
          }
        } else if (contract.items.length > 0) {
          // 默认选择第一个项
          const firstItem = contract.items[0];
          setFormData(prev => ({
            ...prev,
            productName: firstItem.productName,
            quantity: firstItem.quantity.toString(),
            budget: (firstItem.unitPrice * firstItem.quantity).toString()
          }));
        }
      }
    }
  }, [selectedContract, selectedContractItem, requestType]);

  // 从URL参数初始化
  useEffect(() => {
    if (contractIdFromUrl) {
      setSelectedContract(contractIdFromUrl);
      setShowContractSelector(true);
    }
  }, [contractIdFromUrl]);

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
    <AppLayout initialRole="purchaser">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-3xl mx-auto px-6 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/requests">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-slate-900 tracking-tight">
              新建采购需求
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              选择需求类型并填写信息，带 * 为必填项
            </p>
          </div>
        </div>

        {/* 需求类型选择 */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-900">需求类型</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              选择需求来源类型
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRequestType('determined')}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  requestType === 'determined'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    requestType === 'determined' ? 'bg-blue-100' : 'bg-slate-100'
                  }`}>
                    <FileText className={`w-5 h-5 ${
                      requestType === 'determined' ? 'text-blue-600' : 'text-slate-500'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-900">确定需求</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      来自销售合同，自动填充数据
                    </p>
                  </div>
                  {requestType === 'determined' && (
                    <Badge className="bg-blue-500">已选</Badge>
                  )}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRequestType('undetermined')}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  requestType === 'undetermined'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    requestType === 'undetermined' ? 'bg-orange-100' : 'bg-slate-100'
                  }`}>
                    <Plus className={`w-5 h-5 ${
                      requestType === 'undetermined' ? 'text-orange-600' : 'text-slate-500'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-900">非确定需求</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      独立创建，支持外部询价
                    </p>
                  </div>
                  {requestType === 'undetermined' && (
                    <Badge className="bg-orange-500">已选</Badge>
                  )}
                </div>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* 合同选择（仅确定需求显示） */}
        {requestType === 'determined' && (
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Link2 className="w-4 h-4" />
                关联销售合同
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                选择合同后将自动填充需求信息
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedContract} onValueChange={setSelectedContract}>
                <SelectTrigger className="h-9 bg-slate-50 border-slate-200">
                  <SelectValue placeholder="选择销售合同" />
                </SelectTrigger>
                <SelectContent>
                  {mockContracts.map((contract) => (
                    <SelectItem key={contract.id} value={contract.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{contract.contractNumber}</span>
                        <span className="text-slate-500 text-xs ml-2">
                          ¥{contract.totalAmount.toLocaleString()}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {currentContract && currentContract.items.length > 1 && (
                <Select value={selectedContractItem} onValueChange={setSelectedContractItem}>
                  <SelectTrigger className="h-9 bg-slate-50 border-slate-200">
                    <SelectValue placeholder="选择合同明细项" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentContract.items.map((item, index) => (
                      <SelectItem key={index} value={index.toString()}>
                        <div className="flex items-center justify-between w-full">
                          <span>{item.productName}</span>
                          <span className="text-slate-500 text-xs ml-2">
                            x{item.quantity}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </CardContent>
          </Card>
        )}

        {/* 需求信息表单 */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-900">采购需求信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                  预算 (元)
                </Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="请输入预算金额"
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  className="h-9 bg-slate-50 border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-lg text-xs"
                />
              </div>
            </div>

            {/* 期望交货日期 */}
            <div className="space-y-1.5">
              <Label htmlFor="deliveryDate" className="text-sm font-medium text-slate-700">
                期望交货日期
              </Label>
              <Input
                id="deliveryDate"
                type="date"
                value={formData.deliveryDate}
                onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                className="h-9 bg-slate-50 border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-lg text-xs"
              />
            </div>

            {/* 备注 */}
            <div className="space-y-1.5">
              <Label htmlFor="remarks" className="text-sm font-medium text-slate-700">
                备注
              </Label>
              <Textarea
                id="remarks"
                placeholder="请输入其他需求说明或备注信息"
                value={formData.remarks}
                onChange={(e) => handleInputChange('remarks', e.target.value)}
                rows={3}
                className="bg-slate-50 border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-lg text-xs resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* 操作按钮 */}
        <div className="flex items-center justify-end gap-3">
          <Link href="/requests">
            <Button variant="ghost">
              取消
            </Button>
          </Link>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.productName.trim() || !formData.quantity}
            className="gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                提交中...
              </>
            ) : requestType === 'undetermined' ? (
              <>
                <Search className="w-4 h-4" />
                创建并开始询价
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                创建需求
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
    </AppLayout>
  );
}
