'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Users, 
  Phone, 
  Mail, 
  MapPin, 
  TrendingUp, 
  Clock,
  DollarSign,
  FileText,
  CheckCircle,
  Building2,
  Calendar,
  Plus,
  X,
  Trash2,
  Star,
  Globe,
  Scan,
  Loader2,
  List,
  MessageCircle
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { POStatus, Supplier, SupplierContact } from '@/types';
import { AppLayout } from '@/components/layout/AppLayout';

const statusConfig: Record<POStatus, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  pending_signature: { label: '待确认', variant: 'secondary' },
  signed: { label: '已确认', variant: 'default' },
  shipped: { label: '已发货', variant: 'default' },
  delivered: { label: '已收货', variant: 'default' },
  invoiced: { label: '已收票', variant: 'default' },
  paid: { label: '已付款', variant: 'default' },
  exception: { label: '异常', variant: 'destructive' },
};

interface SupplierWithDetails extends Supplier {
  address?: string;
  totalTransactionAmount: number;
  lastTransactionDate: string;
  activePOCount: number;
  rating: number;
}

interface SupplierPO {
  id: string;
  poNumber: string;
  productName: string;
  quantity: number;
  totalAmount: number;
  status: POStatus;
  createdAt: string;
  deliveryDate: string;
}

interface NewSupplierForm {
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  categories: string;
  // 新增字段
  registeredAddress: string;
  businessLicenseNumber: string;
  businessScope: string;
  contacts: Omit<SupplierContact, 'id'>[];
}

export default function SupplierPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [expandedSuppliers, setExpandedSuppliers] = useState<Set<string>>(new Set());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAiQuerying, setIsAiQuerying] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [newSupplier, setNewSupplier] = useState<NewSupplierForm>({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    categories: '',
    registeredAddress: '',
    businessLicenseNumber: '',
    businessScope: '',
    contacts: [{
      name: '',
      position: '',
      phone: '',
      wechat: '',
      email: '',
      isPrimary: true
    }]
  });
  const [suppliers, setSuppliers] = useState<SupplierWithDetails[]>([
    {
      id: 'sup-001',
      name: '北京科技发展有限公司',
      contactPerson: '张明',
      phone: '138-0013-8000',
      email: 'zhangming@bjtech.com',
      address: '北京市海淀区中关村科技园区1号楼8层',
      categories: ['办公设备', '电子产品'],
      historicalCooperationCount: 45,
      averageDeliveryDays: 3.5,
      totalTransactionAmount: 528000,
      lastTransactionDate: '2024-01-20',
      activePOCount: 2,
      rating: 4.8,
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date('2024-01-20'),
    },
    {
      id: 'sup-002',
      name: '上海办公用品供应商',
      contactPerson: '李华',
      phone: '139-0013-9000',
      email: 'lihua@shoffice.com',
      address: '上海市浦东新区张江高科技园区创业路288号',
      categories: ['办公用品', '文具'],
      historicalCooperationCount: 78,
      averageDeliveryDays: 2.0,
      totalTransactionAmount: 234000,
      lastTransactionDate: '2024-01-19',
      activePOCount: 1,
      rating: 4.9,
      createdAt: new Date('2022-06-20'),
      updatedAt: new Date('2024-01-19'),
    },
    {
      id: 'sup-003',
      name: '深圳电子设备厂',
      contactPerson: '王芳',
      phone: '137-0013-7000',
      email: 'wangfang@szelec.com',
      address: '深圳市南山区科技园南区A座15层',
      categories: ['电子设备', 'IT服务'],
      historicalCooperationCount: 32,
      averageDeliveryDays: 5.0,
      totalTransactionAmount: 892000,
      lastTransactionDate: '2024-01-18',
      activePOCount: 3,
      rating: 4.5,
      createdAt: new Date('2023-03-10'),
      updatedAt: new Date('2024-01-18'),
    },
  ]);

  const supplierPOs: Record<string, SupplierPO[]> = {
    'sup-001': [
      {
        id: 'po-001',
        poNumber: 'PO-2024-0120-001',
        productName: '联想ThinkPad X1 Carbon',
        quantity: 5,
        totalAmount: 28500,
        status: 'pending_signature',
        createdAt: '2024-01-20 14:30:00',
        deliveryDate: '2024-01-27',
      },
      {
        id: 'po-002',
        poNumber: 'PO-2024-0115-003',
        productName: '戴尔显示器 U2720Q',
        quantity: 3,
        totalAmount: 14400,
        status: 'signed',
        createdAt: '2024-01-15 10:20:00',
        deliveryDate: '2024-01-22',
      },
      {
        id: 'po-003',
        poNumber: 'PO-2024-0110-008',
        productName: '罗技无线键盘鼠标套装',
        quantity: 20,
        totalAmount: 9600,
        status: 'paid',
        createdAt: '2024-01-10 16:45:00',
        deliveryDate: '2024-01-15',
      },
    ],
    'sup-002': [
      {
        id: 'po-004',
        poNumber: 'PO-2024-0119-002',
        productName: 'A4复印纸 80g',
        quantity: 100,
        totalAmount: 4500,
        status: 'shipped',
        createdAt: '2024-01-19 09:30:00',
        deliveryDate: '2024-01-21',
      },
      {
        id: 'po-005',
        poNumber: 'PO-2024-0112-005',
        productName: '得力文件夹套装',
        quantity: 50,
        totalAmount: 2250,
        status: 'delivered',
        createdAt: '2024-01-12 14:20:00',
        deliveryDate: '2024-01-14',
      },
    ],
    'sup-003': [
      {
        id: 'po-006',
        poNumber: 'PO-2024-0118-004',
        productName: '惠普 LaserJet Pro 打印机',
        quantity: 2,
        totalAmount: 7800,
        status: 'invoiced',
        createdAt: '2024-01-18 11:00:00',
        deliveryDate: '2024-01-25',
      },
      {
        id: 'po-007',
        poNumber: 'PO-2024-0114-007',
        productName: '网络交换机 24口',
        quantity: 3,
        totalAmount: 15600,
        status: 'signed',
        createdAt: '2024-01-14 15:30:00',
        deliveryDate: '2024-01-21',
      },
    ],
  };

  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.contactPerson?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedSupplierData = suppliers.find(s => s.id === selectedSupplier);
  const selectedPOs = selectedSupplier ? supplierPOs[selectedSupplier] || [] : [];

  const toggleSupplierExpand = (supplierId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newExpanded = new Set(expandedSuppliers);
    if (newExpanded.has(supplierId)) {
      newExpanded.delete(supplierId);
    } else {
      newExpanded.add(supplierId);
    }
    setExpandedSuppliers(newExpanded);
  };

  const handleAddContact = () => {
    setNewSupplier(prev => ({
      ...prev,
      contacts: [...prev.contacts, {
        name: '',
        position: '',
        phone: '',
        wechat: '',
        email: '',
        isPrimary: false
      }]
    }));
  };

  const handleRemoveContact = (index: number) => {
    if (newSupplier.contacts.length <= 1) return;
    setNewSupplier(prev => ({
      ...prev,
      contacts: prev.contacts.filter((_, i) => i !== index)
    }));
  };

  const handleUpdateContact = (index: number, field: keyof Omit<SupplierContact, 'id'>, value: any) => {
    setNewSupplier(prev => {
      const newContacts = [...prev.contacts];
      if (field === 'isPrimary' && value === true) {
        newContacts.forEach((c, i) => {
          if (i !== index) c.isPrimary = false;
        });
      }
      newContacts[index] = { ...newContacts[index], [field]: value };
      return { ...prev, contacts: newContacts };
    });
  };

  const handleAiQuery = async () => {
    if (!newSupplier.name && !newSupplier.businessLicenseNumber) {
      return;
    }
    
    setIsAiQuerying(true);
    
    setTimeout(() => {
      setNewSupplier(prev => ({
        ...prev,
        registeredAddress: prev.registeredAddress || '北京市朝阳区建国路88号',
        businessScope: prev.businessScope || '技术开发、技术咨询、技术服务；销售自行开发的产品；计算机系统服务；基础软件服务；应用软件服务',
        aiVerified: true,
        aiVerificationSource: '企查查'
      }));
      setIsAiQuerying(false);
    }, 2000);
  };

  const resetForm = () => {
    setNewSupplier({
      name: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      categories: '',
      registeredAddress: '',
      businessLicenseNumber: '',
      businessScope: '',
      contacts: [{
        name: '',
        position: '',
        phone: '',
        wechat: '',
        email: '',
        isPrimary: true
      }]
    });
    setActiveTab('basic');
  };

  const handleAddSupplier = () => {
    if (!newSupplier.name || !newSupplier.contactPerson) {
      return;
    }

    const categories = newSupplier.categories.split(',').map(c => c.trim()).filter(c => c);
    
    const supplier: SupplierWithDetails = {
      id: `sup-${String(suppliers.length + 1).padStart(3, '0')}`,
      name: newSupplier.name,
      contactPerson: newSupplier.contactPerson,
      phone: newSupplier.phone,
      email: newSupplier.email,
      address: newSupplier.address,
      registeredAddress: newSupplier.registeredAddress,
      businessLicenseNumber: newSupplier.businessLicenseNumber,
      businessScope: newSupplier.businessScope,
      contacts: newSupplier.contacts.map((c, i) => ({
        ...c,
        id: `contact-${String(Date.now())}-${i}`
      })),
      categories: categories.length > 0 ? categories : ['未分类'],
      historicalCooperationCount: 0,
      averageDeliveryDays: 0,
      totalTransactionAmount: 0,
      lastTransactionDate: '-',
      activePOCount: 0,
      rating: 5.0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // 这里应该调用API添加供应商，现在先添加到本地数据
    setSuppliers([...suppliers, supplier]);
    
    // 重置表单并关闭对话框
    resetForm();
    setIsAddDialogOpen(false);
  };

  return (
    <AppLayout initialRole="purchaser">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-semibold text-slate-900 tracking-tight">
              供应商管理
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              管理供应商信息、查看合作记录和历史订单
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" aria-hidden="true" />
              <span className="text-sm font-medium text-orange-700">共 {suppliers.length} 家供应商</span>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block">
          <div className="grid grid-cols-12 gap-4">
            {/* Left Column - Supplier List */}
            <div className="col-span-5 space-y-4">
              {/* Search and Supplier List */}
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-1 pt-2 px-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold text-slate-900">供应商列表</CardTitle>
                    <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
                      setIsAddDialogOpen(open);
                      if (!open) resetForm();
                    }}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white h-7 px-2">
                          <Plus className="w-3.5 h-3.5" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>新增供应商</DialogTitle>
                          <DialogDescription>
                            添加新的供应商信息，带 * 号的为必填项
                          </DialogDescription>
                        </DialogHeader>
                        
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="basic">基本信息</TabsTrigger>
                            <TabsTrigger value="contacts">联系人</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="basic" className="space-y-4 py-4">
                            <div className="p-3 border rounded-lg bg-slate-50 space-y-3">
                              <div className="grid gap-1">
                                <div className="flex items-center justify-between">
                                  <Label htmlFor="name" className="text-xs!">
                                    供应商名称 <span className="text-red-500">*</span>
                                  </Label>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleAiQuery}
                                    disabled={isAiQuerying || (!newSupplier.name && !newSupplier.businessLicenseNumber)}
                                    className="h-7 text-xs! gap-1"
                                  >
                                    {isAiQuerying ? (
                                      <>
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                        查询中...
                                      </>
                                    ) : (
                                      <>
                                        <Scan className="w-3 h-3" />
                                        AI查询企查查
                                      </>
                                    )}
                                  </Button>
                                </div>
                                <Input
                                  id="name"
                                  value={newSupplier.name}
                                  onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                                  placeholder="请输入供应商名称"
                                  className="h-8 text-xs!"
                                />
                              </div>
                              
                              <div className="grid grid-cols-2 gap-2">
                                <div className="grid gap-1">
                                  <Label htmlFor="contactPerson" className="text-xs!">
                                    联系人 <span className="text-red-500">*</span>
                                  </Label>
                                  <Input
                                    id="contactPerson"
                                    value={newSupplier.contactPerson}
                                    onChange={(e) => setNewSupplier({ ...newSupplier, contactPerson: e.target.value })}
                                    placeholder="主要联系人姓名"
                                    className="h-8 text-xs!"
                                  />
                                </div>
                                <div className="grid gap-1">
                                  <Label htmlFor="phone" className="text-xs!">联系电话</Label>
                                  <Input
                                    id="phone"
                                    value={newSupplier.phone}
                                    onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                                    placeholder="联系电话"
                                    className="h-8 text-xs!"
                                  />
                                </div>
                              </div>
                              
                              <div className="grid gap-1">
                                <Label htmlFor="email" className="text-xs!">电子邮箱</Label>
                                <Input
                                  id="email"
                                  type="email"
                                  value={newSupplier.email}
                                  onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                                  placeholder="example@company.com"
                                  className="h-8 text-xs!"
                                />
                              </div>
                              
                              <div className="grid gap-1">
                                <Label htmlFor="businessLicenseNumber" className="text-xs!">
                                  营业执照号
                                </Label>
                                <Input
                                  id="businessLicenseNumber"
                                  value={newSupplier.businessLicenseNumber}
                                  onChange={(e) => setNewSupplier({ ...newSupplier, businessLicenseNumber: e.target.value })}
                                  placeholder="营业执照号（选填，用于AI查询）"
                                  className="h-8 text-xs!"
                                />
                              </div>
                              
                              <div className="grid gap-1">
                                <Label htmlFor="registeredAddress" className="text-xs!">
                                  注册地址
                                </Label>
                                <Textarea
                                  id="registeredAddress"
                                  value={newSupplier.registeredAddress}
                                  onChange={(e) => setNewSupplier({ ...newSupplier, registeredAddress: e.target.value })}
                                  placeholder="注册地址"
                                  rows={2}
                                  className="text-xs!"
                                />
                              </div>
                              
                              <div className="grid gap-1">
                                <Label htmlFor="address" className="text-xs!">
                                  经营地址
                                </Label>
                                <Textarea
                                  id="address"
                                  value={newSupplier.address}
                                  onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                                  placeholder="经营地址"
                                  rows={2}
                                  className="text-xs!"
                                />
                              </div>
                              
                              <div className="grid gap-1">
                                <Label htmlFor="businessScope" className="text-xs!">
                                  经营范围
                                </Label>
                                <Textarea
                                  id="businessScope"
                                  value={newSupplier.businessScope}
                                  onChange={(e) => setNewSupplier({ ...newSupplier, businessScope: e.target.value })}
                                  placeholder="经营范围"
                                  rows={3}
                                  className="text-xs!"
                                />
                              </div>
                              
                              <div className="grid gap-1">
                                <Label htmlFor="categories" className="text-xs!">
                                  经营类别 <span className="text-xs! text-slate-500">(多个类别用逗号分隔)</span>
                                </Label>
                                <Input
                                  id="categories"
                                  value={newSupplier.categories}
                                  onChange={(e) => setNewSupplier({ ...newSupplier, categories: e.target.value })}
                                  placeholder="例如：办公设备, 电子产品, 文具"
                                  className="h-8 text-xs!"
                                />
                              </div>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="contacts" className="space-y-4 py-4">
                            <div className="flex items-center justify-between">
                              <Label className="text-xs!">联系人列表</Label>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleAddContact}
                                className="h-7 text-xs!"
                              >
                                <Plus className="w-3 h-3 mr-1" />
                                添加联系人
                              </Button>
                            </div>
                            
                            {newSupplier.contacts.map((contact, index) => (
                              <div key={index} className="p-3 border rounded-lg bg-slate-50 space-y-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs! font-medium text-slate-700">联系人 {index + 1}</span>
                                    {contact.isPrimary && (
                                      <Badge variant="secondary" className="text-xs! h-4">主要联系人</Badge>
                                    )}
                                  </div>
                                  {newSupplier.contacts.length > 1 && (
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleRemoveContact(index)}
                                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  )}
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="grid gap-1">
                                    <Label htmlFor={`contact-name-${index}`} className="text-xs!">
                                      姓名 <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                      id={`contact-name-${index}`}
                                      value={contact.name}
                                      onChange={(e) => handleUpdateContact(index, 'name', e.target.value)}
                                      placeholder="联系人姓名"
                                      className="h-8 text-xs!"
                                    />
                                  </div>
                                  <div className="grid gap-1">
                                    <Label htmlFor={`contact-position-${index}`} className="text-xs!">职位</Label>
                                    <Input
                                      id={`contact-position-${index}`}
                                      value={contact.position}
                                      onChange={(e) => handleUpdateContact(index, 'position', e.target.value)}
                                      placeholder="职位"
                                      className="h-8 text-xs!"
                                    />
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="grid gap-1">
                                    <Label htmlFor={`contact-phone-${index}`} className="text-xs!">手机</Label>
                                    <Input
                                      id={`contact-phone-${index}`}
                                      value={contact.phone}
                                      onChange={(e) => handleUpdateContact(index, 'phone', e.target.value)}
                                      placeholder="手机号码"
                                      className="h-8 text-xs!"
                                    />
                                  </div>
                                  <div className="grid gap-1">
                                    <Label htmlFor={`contact-wechat-${index}`} className="text-xs!">微信号</Label>
                                    <Input
                                      id={`contact-wechat-${index}`}
                                      value={contact.wechat}
                                      onChange={(e) => handleUpdateContact(index, 'wechat', e.target.value)}
                                      placeholder="微信号"
                                      className="h-8 text-xs!"
                                    />
                                  </div>
                                </div>
                                
                                <div className="grid gap-1">
                                  <Label htmlFor={`contact-email-${index}`} className="text-xs!">电子邮箱</Label>
                                  <Input
                                    id={`contact-email-${index}`}
                                    type="email"
                                    value={contact.email}
                                    onChange={(e) => handleUpdateContact(index, 'email', e.target.value)}
                                    placeholder="example@company.com"
                                    className="h-8 text-xs!"
                                  />
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    id={`contact-primary-${index}`}
                                    checked={contact.isPrimary}
                                    onChange={(e) => handleUpdateContact(index, 'isPrimary', e.target.checked)}
                                    className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                                  />
                                  <Label htmlFor={`contact-primary-${index}`} className="text-xs! cursor-pointer">
                                    设为主要联系人
                                  </Label>
                                </div>
                              </div>
                            ))}
                          </TabsContent>
                        </Tabs>
                        
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsAddDialogOpen(false);
                              resetForm();
                            }}
                          >
                            取消
                          </Button>
                          <Button
                            onClick={handleAddSupplier}
                            disabled={!newSupplier.name || !newSupplier.contactPerson}
                            className="bg-orange-500 hover:bg-orange-600 text-white"
                          >
                            保存
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="mt-1.5">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        type="search"
                        placeholder="搜索供应商..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-full text-sm"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4 pt-0">
                  <div className="space-y-1.5">
                    {filteredSuppliers.map((supplier) => (
                      <div 
                        key={supplier.id}
                        className={`rounded-lg border transition-all duration-200 overflow-hidden ${
                          selectedSupplier === supplier.id 
                            ? 'border-orange-300 bg-orange-50' 
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        {/* 卡片头部 - 可点击选中 */}
                        <div 
                          onClick={() => setSelectedSupplier(supplier.id)}
                          className="p-2.5 cursor-pointer"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                selectedSupplier === supplier.id ? 'bg-orange-200' : 'bg-slate-100'
                              }`}>
                                <Building2 className={`w-4 h-4 ${
                                  selectedSupplier === supplier.id ? 'text-orange-600' : 'text-slate-600'
                                }`} />
                              </div>
                              <div>
                                <h3 className={`text-sm font-semibold ${
                                  selectedSupplier === supplier.id ? 'text-orange-900' : 'text-slate-900'
                                }`}>
                                  {supplier.name}
                                </h3>
                                <p className="text-xs text-slate-500 mt-1">
                                  {supplier.categories.join(' · ')}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center">
                                <span className="text-xs font-medium text-yellow-600">★</span>
                                <span className="text-xs text-slate-600 ml-0.5">{supplier.rating}</span>
                              </div>
                              {/* 展开/收起按钮 */}
                              <button
                                type="button"
                                className="flex items-center justify-center h-7 w-7 rounded-md hover:bg-slate-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1"
                                onClick={(e) => toggleSupplierExpand(supplier.id, e)}
                                aria-label={expandedSuppliers.has(supplier.id) ? "收起详情" : "展开详情"}
                              >
                                <svg 
                                  className={`w-5 h-5 text-slate-600 transition-transform duration-200 ${
                                    expandedSuppliers.has(supplier.id) ? 'rotate-180' : ''
                                  }`} 
                                  fill="none" 
                                  viewBox="0 0 24 24" 
                                  stroke="currentColor"
                                  strokeWidth={2.5}
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-1.5 text-xs">
                            <div className="flex items-center gap-1 text-slate-600">
                              <Users className="w-3 h-3" />
                              <span>{supplier.contacts && supplier.contacts.length > 0 
                                ? supplier.contacts.find(c => c.isPrimary)?.name || supplier.contacts[0].name 
                                : supplier.contactPerson}</span>
                            </div>
                            <div className="flex items-center gap-1 text-slate-600">
                              <Phone className="w-3 h-3" />
                              <span className="truncate">{supplier.contacts && supplier.contacts.length > 0 
                                ? supplier.contacts.find(c => c.isPrimary)?.phone || supplier.contacts[0].phone 
                                : supplier.phone}</span>
                            </div>
                            <div className="flex items-center gap-1 text-slate-600">
                              <FileText className="w-3 h-3" />
                              <span>合作 {supplier.historicalCooperationCount} 次</span>
                            </div>
                            <div className="flex items-center gap-1 text-slate-600">
                              <Clock className="w-3 h-3" />
                              <span>平均 {supplier.averageDeliveryDays} 天</span>
                            </div>
                          </div>
                          
                          {supplier.aiVerified && (
                            <div className="mt-1.5 flex items-center gap-1">
                              <Badge className="h-4 px-1 text-[9px] bg-green-100 text-green-700 border-green-200">
                                AI已验证
                              </Badge>
                            </div>
                          )}

                          {supplier.activePOCount > 0 && (
                            <div className="mt-1.5 pt-1.5 border-t border-slate-200">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] text-slate-500">进行中订单</span>
                                <Badge variant="secondary" className="text-[9px] h-4 px-1">
                                  {supplier.activePOCount} 个
                                </Badge>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* 展开详情区域 */}
                        {expandedSuppliers.has(supplier.id) && (
                          <div className="border-t border-slate-200 bg-slate-50">
                            <div className="p-2.5 space-y-2.5">
                              {/* 基本详情 */}
                              <div className="space-y-1.5">
                                <h4 className="text-xs font-semibold text-slate-700">联系信息</h4>
                                <div className="grid grid-cols-1 gap-1.5 text-xs">
                                  <div className="flex items-start gap-1.5">
                                    <Mail className="w-3.5 h-3.5 text-slate-400 mt-0.5" />
                                    <span className="text-slate-600">邮箱：</span>
                                    <span className="text-slate-900 truncate flex-1">
                                      {supplier.contacts && supplier.contacts.length > 0 
                                        ? supplier.contacts.find(c => c.isPrimary)?.email || supplier.contacts[0].email || supplier.email
                                        : supplier.email}
                                    </span>
                                  </div>
                                  {supplier.address && (
                                    <div className="flex items-start gap-1.5">
                                      <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5" />
                                      <span className="text-slate-600">地址：</span>
                                      <span className="text-slate-900 text-xs leading-relaxed flex-1">
                                        {supplier.address}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* 营业信息 */}
                              {(supplier.businessLicenseNumber || supplier.registeredAddress || supplier.businessScope) && (
                                <div className="space-y-1.5">
                                  <h4 className="text-xs font-semibold text-slate-700">营业信息</h4>
                                  <div className="bg-white p-2 rounded border border-slate-200 space-y-1.5">
                                    {supplier.businessLicenseNumber && (
                                      <div className="flex items-center gap-1.5 text-xs">
                                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                                        <span className="text-slate-600">营业执照：</span>
                                        <span className="text-slate-900">{supplier.businessLicenseNumber}</span>
                                      </div>
                                    )}
                                    {supplier.registeredAddress && (
                                      <div className="flex items-start gap-1.5 text-xs">
                                        <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5" />
                                        <span className="text-slate-600">注册地址：</span>
                                        <span className="text-slate-900 text-xs leading-relaxed flex-1">
                                          {supplier.registeredAddress}
                                        </span>
                                      </div>
                                    )}
                                    {supplier.businessScope && (
                                      <div className="flex items-start gap-1.5 text-xs">
                                        <List className="w-3.5 h-3.5 text-slate-400 mt-0.5" />
                                        <span className="text-slate-600">经营范围：</span>
                                        <span className="text-slate-900 text-xs leading-relaxed flex-1">
                                          {supplier.businessScope}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* 统计数据 */}
                              <div className="grid grid-cols-4 gap-1.5">
                                <div className="bg-white p-1.5 rounded border border-slate-200 text-center">
                                  <div className="text-sm font-bold text-slate-900">{supplier.historicalCooperationCount}</div>
                                  <div className="text-[10px] text-slate-500">合作次数</div>
                                </div>
                                <div className="bg-white p-1.5 rounded border border-slate-200 text-center">
                                  <div className="text-sm font-bold text-slate-900">{supplier.averageDeliveryDays}</div>
                                  <div className="text-[10px] text-slate-500">平均货期</div>
                                </div>
                                <div className="bg-white p-1.5 rounded border border-slate-200 text-center">
                                  <div className="text-sm font-bold text-slate-900">¥{(supplier.totalTransactionAmount / 1000).toFixed(0)}K</div>
                                  <div className="text-[10px] text-slate-500">累计金额</div>
                                </div>
                                <div className="bg-white p-1.5 rounded border border-slate-200 text-center">
                                  <div className="text-sm font-bold text-slate-900">{supplier.lastTransactionDate}</div>
                                  <div className="text-[10px] text-slate-500">最后交易</div>
                                </div>
                              </div>

                              {/* 联系人列表 */}
                              {supplier.contacts && supplier.contacts.length > 1 && (
                                <div className="space-y-1.5">
                                  <h4 className="text-xs font-semibold text-slate-700">全部联系人 ({supplier.contacts.length})</h4>
                                  <div className="space-y-1">
                                    {supplier.contacts.map((contact, idx) => (
                                      <div key={idx} className="bg-white p-1.5 rounded border border-slate-200">
                                        <div className="flex items-center gap-1.5 mb-1">
                                          <span className="text-xs font-medium text-slate-900">{contact.name}</span>
                                          {contact.isPrimary && (
                                            <Badge className="h-4 px-1 text-[9px] bg-orange-100 text-orange-700 border-orange-200">
                                              主要
                                            </Badge>
                                          )}
                                          {contact.position && (
                                            <span className="text-[10px] text-slate-500">{contact.position}</span>
                                          )}
                                        </div>
                                        <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-600">
                                          {contact.phone && <span>📱 {contact.phone}</span>}
                                          {contact.email && <span className="truncate">📧 {contact.email}</span>}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Supplier Details */}
            <div className="col-span-7">
              {selectedSupplierData ? (
                <div className="space-y-4">
                  {/* Supplier Info Card */}
                  <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="pb-1 pt-2 px-4">
                      <CardTitle className="text-sm font-semibold text-slate-900">
                        供应商详情
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 pt-0">
                      <div className="space-y-3">
                        {/* Basic Info */}
                        <div className="bg-white p-2.5 rounded border border-slate-200">
                          <div className="flex items-start justify-between mb-1.5">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-xs font-semibold text-slate-900">
                                  {selectedSupplierData.name}
                                </h3>
                                {selectedSupplierData.aiVerified && (
                                  <Badge className="h-5 px-1.5 text-xs bg-green-100 text-green-700 border-green-200">
                                    AI已验证
                                  </Badge>
                                )}
                              </div>
                              <p className="text-[10px] text-slate-500 mt-1">
                                {selectedSupplierData.categories.join(' · ')}
                              </p>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-yellow-50 rounded-full">
                                <span className="text-[10px] font-medium text-yellow-600">★</span>
                                <span className="text-[10px] font-semibold text-yellow-700">{selectedSupplierData.rating}</span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            {/* 营业信息 */}
                            {(selectedSupplierData.businessLicenseNumber || selectedSupplierData.registeredAddress || selectedSupplierData.businessScope) && (
                              <div className="border-t border-slate-200 pt-3">
                                <h4 className="text-xs font-semibold text-slate-700 mb-2">营业信息</h4>
                                <div className="bg-white p-2.5 rounded border border-slate-200">
                                  <div className="grid grid-cols-1 gap-2">
                                    {selectedSupplierData.businessLicenseNumber && (
                                      <div className="flex items-center gap-1.5 text-xs">
                                        <FileText className="w-4 h-4 text-slate-400" />
                                        <span className="text-slate-600">营业执照号：</span>
                                        <span className="font-medium text-slate-900">{selectedSupplierData.businessLicenseNumber}</span>
                                      </div>
                                    )}
                                    {selectedSupplierData.registeredAddress && (
                                      <div className="flex items-start gap-1.5 text-xs">
                                        <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                                        <span className="text-slate-600">注册地址：</span>
                                        <span className="font-medium text-slate-900 flex-1 text-xs leading-relaxed">
                                          {selectedSupplierData.registeredAddress}
                                        </span>
                                      </div>
                                    )}
                                    {selectedSupplierData.businessScope && (
                                      <div className="flex items-start gap-1.5 text-xs">
                                        <List className="w-4 h-4 text-slate-400 mt-0.5" />
                                        <span className="text-slate-600">经营范围：</span>
                                        <span className="font-medium text-slate-900 flex-1 text-xs leading-relaxed">
                                          {selectedSupplierData.businessScope}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* 联系信息 - 支持多个联系人 */}
                            <div className="border-t border-slate-200 pt-3">
                              <h4 className="text-xs font-semibold text-slate-700 mb-2">联系人</h4>
                              {selectedSupplierData.contacts && selectedSupplierData.contacts.length > 0 ? (
                                <div className="space-y-2">
                                  {selectedSupplierData.contacts.map((contact, index) => (
                                    <div key={index} className="bg-white p-2.5 rounded border border-slate-200">
                                      <div className="flex items-center gap-1.5 mb-1.5">
                                        <Users className="w-4 h-4 text-slate-400" />
                                        <span className="text-xs font-semibold text-slate-900">{contact.name}</span>
                                        {contact.isPrimary && (
                                          <Badge className="h-5 px-1.5 text-xs bg-orange-100 text-orange-700 border-orange-200">
                                            主要
                                          </Badge>
                                        )}
                                        {contact.position && (
                                          <span className="text-xs text-slate-500">{contact.position}</span>
                                        )}
                                      </div>
                                      <div className="grid grid-cols-1 gap-1.5 text-xs">
                                        {contact.phone && (
                                          <div className="flex items-center gap-1">
                                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                                            <span className="text-slate-600">手机：</span>
                                            <span className="text-slate-900">{contact.phone}</span>
                                          </div>
                                        )}
                                        {contact.email && (
                                          <div className="flex items-center gap-1">
                                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                                            <span className="text-slate-600">邮箱：</span>
                                            <span className="text-slate-900 truncate">{contact.email}</span>
                                          </div>
                                        )}
                                        {contact.wechat && (
                                          <div className="flex items-center gap-1">
                                            <MessageCircle className="w-3.5 h-3.5 text-slate-400" />
                                            <span className="text-slate-600">微信：</span>
                                            <span className="text-slate-900">{contact.wechat}</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="bg-white p-2.5 rounded border border-slate-200">
                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-1.5 text-xs">
                                        <Users className="w-4 h-4 text-slate-400" />
                                        <span className="text-slate-600">联系人：</span>
                                        <span className="font-medium text-slate-900">{selectedSupplierData.contactPerson}</span>
                                      </div>
                                      <div className="flex items-center gap-1.5 text-xs">
                                        <Phone className="w-4 h-4 text-slate-400" />
                                        <span className="text-slate-600">电话：</span>
                                        <span className="font-medium text-slate-900">{selectedSupplierData.phone}</span>
                                      </div>
                                      <div className="flex items-center gap-1.5 text-xs">
                                        <Mail className="w-4 h-4 text-slate-400" />
                                        <span className="text-slate-600">邮箱：</span>
                                        <span className="font-medium text-slate-900 text-xs truncate">{selectedSupplierData.email}</span>
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <div className="flex items-start gap-1.5 text-xs">
                                        <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                                        <span className="text-slate-600">地址：</span>
                                        <span className="font-medium text-slate-900 flex-1 text-xs leading-relaxed">
                                          {selectedSupplierData.address}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-4 gap-3">
                          <div className="p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all duration-200">
                            <div className="flex items-start justify-between mb-2">
                              <FileText className="w-5 h-5 text-blue-600" aria-hidden="true" />
                            </div>
                            <div>
                              <div className="text-lg font-bold text-slate-900 leading-none">{selectedSupplierData.historicalCooperationCount}</div>
                              <div className="text-xs text-slate-500 mt-1">合作次数</div>
                            </div>
                          </div>
                          <div className="p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all duration-200">
                            <div className="flex items-start justify-between mb-2">
                              <Clock className="w-5 h-5 text-purple-600" aria-hidden="true" />
                            </div>
                            <div>
                              <div className="text-lg font-bold text-slate-900 leading-none">{selectedSupplierData.averageDeliveryDays}</div>
                              <div className="text-xs text-slate-500 mt-1">平均货期</div>
                            </div>
                          </div>
                          <div className="p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all duration-200">
                            <div className="flex items-start justify-between mb-2">
                              <DollarSign className="w-5 h-5 text-green-600" aria-hidden="true" />
                            </div>
                            <div>
                              <div className="text-lg font-bold text-slate-900 leading-none">¥{(selectedSupplierData.totalTransactionAmount / 1000).toFixed(0)}K</div>
                              <div className="text-xs text-slate-500 mt-1">累计金额</div>
                            </div>
                          </div>
                          <div className="p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all duration-200">
                            <div className="flex items-start justify-between mb-2">
                              <Calendar className="w-5 h-5 text-orange-600" aria-hidden="true" />
                            </div>
                            <div>
                              <div className="text-lg font-bold text-slate-900 leading-none">{selectedSupplierData.lastTransactionDate}</div>
                              <div className="text-xs text-slate-500 mt-1">最后交易</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Historical POs */}
                  <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="pb-1 pt-2 px-4 flex flex-row items-center justify-between">
                      <CardTitle className="text-sm font-semibold text-slate-900">历史订单</CardTitle>
                      <Button variant="ghost" size="sm" className="text-xs text-slate-500 hover:text-slate-700 h-8" aria-label="查看全部订单">
                        查看全部
                      </Button>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 pt-0">
                      <div className="rounded-lg border border-slate-200 overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-slate-50">
                              <TableHead className="py-2 px-3 text-xs font-medium">PO号</TableHead>
                              <TableHead className="py-2 px-3 text-xs font-medium">产品名称</TableHead>
                              <TableHead className="py-2 px-3 text-xs font-medium">数量</TableHead>
                              <TableHead className="py-2 px-3 text-xs font-medium">金额</TableHead>
                              <TableHead className="py-2 px-3 text-xs font-medium">状态</TableHead>
                              <TableHead className="py-2 px-3 text-right text-xs font-medium">交期</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedPOs.map((po) => (
                              <TableRow key={po.id} className="hover:bg-slate-50">
                                <TableCell className="py-2 px-3 text-xs font-medium text-slate-900">
                                  {po.poNumber}
                                </TableCell>
                                <TableCell className="py-2 px-3 text-xs text-slate-700">
                                  {po.productName}
                                </TableCell>
                                <TableCell className="py-2 px-3 text-xs text-slate-600">
                                  {po.quantity}
                                </TableCell>
                                <TableCell className="py-2 px-3 text-xs font-medium text-slate-900">
                                  ¥{po.totalAmount.toLocaleString()}
                                </TableCell>
                                <TableCell className="py-2 px-3">
                                  <Badge variant={statusConfig[po.status].variant} className="text-xs h-5 px-1.5">
                                    {statusConfig[po.status].label}
                                  </Badge>
                                </TableCell>
                                <TableCell className="py-2 px-3 text-right text-xs text-slate-600">
                                  {po.deliveryDate}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card className="border-slate-200 shadow-sm">
                  <CardContent className="p-12">
                    <div className="text-center">
                      <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-sm font-medium text-slate-900 mb-1">选择供应商</h3>
                      <p className="text-xs text-slate-500">从左侧列表选择供应商查看详情</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden space-y-4">
          {/* Search and Add Button */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-1 pt-1.5 px-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-semibold text-slate-900">供应商管理</CardTitle>
                <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
                  setIsAddDialogOpen(open);
                  if (!open) resetForm();
                }}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white h-7 px-2">
                      <Plus className="w-3.5 h-3.5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>新增供应商</DialogTitle>
                      <DialogDescription>
                        添加新的供应商信息，带 * 号的为必填项
                      </DialogDescription>
                    </DialogHeader>
                    
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="basic">基本信息</TabsTrigger>
                        <TabsTrigger value="contacts">联系人</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="basic" className="space-y-4 py-4">
                        <div className="grid gap-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="name-mobile">
                              供应商名称 <span className="text-red-500">*</span>
                            </Label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={handleAiQuery}
                              disabled={isAiQuerying || (!newSupplier.name && !newSupplier.businessLicenseNumber)}
                              className="h-7 text-xs gap-1"
                            >
                              {isAiQuerying ? (
                                <>
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                  查询中...
                                </>
                              ) : (
                                <>
                                  <Scan className="w-3 h-3" />
                                  AI查询企查查
                                </>
                              )}
                            </Button>
                          </div>
                          <Input
                            id="name-mobile"
                            value={newSupplier.name}
                            onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                            placeholder="请输入供应商名称"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="contactPerson-mobile">
                              联系人 <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="contactPerson-mobile"
                              value={newSupplier.contactPerson}
                              onChange={(e) => setNewSupplier({ ...newSupplier, contactPerson: e.target.value })}
                              placeholder="主要联系人姓名"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="phone-mobile">联系电话</Label>
                            <Input
                              id="phone-mobile"
                              value={newSupplier.phone}
                              onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                              placeholder="联系电话"
                            />
                          </div>
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="email-mobile">电子邮箱</Label>
                          <Input
                            id="email-mobile"
                            type="email"
                            value={newSupplier.email}
                            onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                            placeholder="example@company.com"
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="businessLicenseNumber-mobile">
                            营业执照号
                          </Label>
                          <Input
                            id="businessLicenseNumber-mobile"
                            value={newSupplier.businessLicenseNumber}
                            onChange={(e) => setNewSupplier({ ...newSupplier, businessLicenseNumber: e.target.value })}
                            placeholder="营业执照号（选填，用于AI查询）"
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="registeredAddress-mobile">
                            注册地址
                          </Label>
                          <Textarea
                            id="registeredAddress-mobile"
                            value={newSupplier.registeredAddress}
                            onChange={(e) => setNewSupplier({ ...newSupplier, registeredAddress: e.target.value })}
                            placeholder="注册地址"
                            rows={2}
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="address-mobile">
                            经营地址
                          </Label>
                          <Textarea
                            id="address-mobile"
                            value={newSupplier.address}
                            onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                            placeholder="经营地址"
                            rows={2}
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="businessScope-mobile">
                            经营范围
                          </Label>
                          <Textarea
                            id="businessScope-mobile"
                            value={newSupplier.businessScope}
                            onChange={(e) => setNewSupplier({ ...newSupplier, businessScope: e.target.value })}
                            placeholder="经营范围"
                            rows={3}
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="categories-mobile">
                            经营类别 <span className="text-[10px] text-slate-500">(多个类别用逗号分隔)</span>
                          </Label>
                          <Input
                            id="categories-mobile"
                            value={newSupplier.categories}
                            onChange={(e) => setNewSupplier({ ...newSupplier, categories: e.target.value })}
                            placeholder="例如：办公设备, 电子产品, 文具"
                          />
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="contacts" className="space-y-4 py-4">
                        <div className="flex items-center justify-between">
                          <Label>联系人列表</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleAddContact}
                            className="h-7 text-xs"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            添加联系人
                          </Button>
                        </div>
                        
                        {newSupplier.contacts.map((contact, index) => (
                          <div key={index} className="p-3 border rounded-lg bg-slate-50 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-slate-700">联系人 {index + 1}</span>
                                {contact.isPrimary && (
                                  <Badge variant="secondary" className="text-[9px] h-4">主要联系人</Badge>
                                )}
                              </div>
                              {newSupplier.contacts.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveContact(index)}
                                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2">
                              <div className="grid gap-1">
                                <Label htmlFor={`contact-name-mobile-${index}`} className="text-xs">
                                  姓名 <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  id={`contact-name-mobile-${index}`}
                                  value={contact.name}
                                  onChange={(e) => handleUpdateContact(index, 'name', e.target.value)}
                                  placeholder="联系人姓名"
                                  className="h-8 text-xs"
                                />
                              </div>
                              <div className="grid gap-1">
                                <Label htmlFor={`contact-position-mobile-${index}`} className="text-xs">职位</Label>
                                <Input
                                  id={`contact-position-mobile-${index}`}
                                  value={contact.position}
                                  onChange={(e) => handleUpdateContact(index, 'position', e.target.value)}
                                  placeholder="职位"
                                  className="h-8 text-xs"
                                />
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2">
                              <div className="grid gap-1">
                                <Label htmlFor={`contact-phone-mobile-${index}`} className="text-xs">手机</Label>
                                <Input
                                  id={`contact-phone-mobile-${index}`}
                                  value={contact.phone}
                                  onChange={(e) => handleUpdateContact(index, 'phone', e.target.value)}
                                  placeholder="手机号码"
                                  className="h-8 text-xs"
                                />
                              </div>
                              <div className="grid gap-1">
                                <Label htmlFor={`contact-wechat-mobile-${index}`} className="text-xs">微信号</Label>
                                <Input
                                  id={`contact-wechat-mobile-${index}`}
                                  value={contact.wechat}
                                  onChange={(e) => handleUpdateContact(index, 'wechat', e.target.value)}
                                  placeholder="微信号"
                                  className="h-8 text-xs"
                                />
                              </div>
                            </div>
                            
                            <div className="grid gap-1">
                              <Label htmlFor={`contact-email-mobile-${index}`} className="text-xs">电子邮箱</Label>
                              <Input
                                id={`contact-email-mobile-${index}`}
                                type="email"
                                value={contact.email}
                                onChange={(e) => handleUpdateContact(index, 'email', e.target.value)}
                                placeholder="example@company.com"
                                className="h-8 text-xs"
                              />
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id={`contact-primary-mobile-${index}`}
                                checked={contact.isPrimary}
                                onChange={(e) => handleUpdateContact(index, 'isPrimary', e.target.checked)}
                                className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                              />
                              <Label htmlFor={`contact-primary-mobile-${index}`} className="text-xs cursor-pointer">
                                设为主要联系人
                              </Label>
                            </div>
                          </div>
                        ))}
                      </TabsContent>
                    </Tabs>
                    
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsAddDialogOpen(false);
                          resetForm();
                        }}
                      >
                        取消
                      </Button>
                      <Button
                        onClick={handleAddSupplier}
                        disabled={!newSupplier.name || !newSupplier.contactPerson}
                        className="bg-orange-500 hover:bg-orange-600 text-white"
                      >
                        保存
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="mt-2">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    type="search"
                    placeholder="搜索供应商..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-full"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0">
              <div className="space-y-1.5">
                {filteredSuppliers.map((supplier) => (
                  <div 
                    key={supplier.id}
                    className="p-2.5 rounded-lg border border-slate-200 bg-white"
                  >
                    <div className="flex items-start justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center">
                          <Building2 className="w-3.5 h-3.5 text-slate-600" />
                        </div>
                        <div>
                          <h3 className="text-xs font-semibold text-slate-900">{supplier.name}</h3>
                          <p className="text-[10px] text-slate-500">{supplier.categories.join(' · ')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <span className="text-[10px] font-medium text-yellow-600">★</span>
                        <span className="text-[10px] text-slate-600">{supplier.rating}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-1.5 text-[10px] mb-1.5">
                      <div className="flex items-center gap-1 text-slate-600">
                        <Users className="w-2.5 h-2.5" />
                        <span>{supplier.contactPerson}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-600">
                        <Phone className="w-2.5 h-2.5" />
                        <span className="truncate">{supplier.phone}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-600">
                        <FileText className="w-2.5 h-2.5" />
                        <span>{supplier.historicalCooperationCount} 次合作</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-600">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{supplier.averageDeliveryDays} 天</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1.5 border-t border-slate-200">
                      <div className="text-[10px] text-slate-500">
                        累计 ¥{(supplier.totalTransactionAmount / 1000).toFixed(0)}K
                      </div>
                      {supplier.activePOCount > 0 && (
                        <Badge variant="secondary" className="text-[9px] h-4 px-1">
                          {supplier.activePOCount} 个进行中
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </AppLayout>
  );
}
