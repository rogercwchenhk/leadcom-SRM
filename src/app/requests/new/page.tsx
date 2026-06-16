'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Bot, 
  Send, 
  Loader2, 
  CheckCircle2, 
  Edit, 
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { analyzePurchaseRequirement } from '@/app/actions/hermes';
import { AIAnalysisResult } from '@/types';

export default function NewRequestPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState<'input' | 'analyzing' | 'review' | 'submitting'>('input');
  const [naturalLanguageInput, setNaturalLanguageInput] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [editedProductName, setEditedProductName] = useState('');
  const [editedSpecifications, setEditedSpecifications] = useState('');
  const [editedQuantity, setEditedQuantity] = useState('');
  const [editedDeliveryDate, setEditedDeliveryDate] = useState('');

  const handleAnalyze = () => {
    if (!naturalLanguageInput.trim()) return;

    setStep('analyzing');
    startTransition(async () => {
      try {
        const result = await analyzePurchaseRequirement(naturalLanguageInput);
        setAiAnalysis(result);
        setEditedProductName(result.productName);
        setEditedSpecifications(result.specifications);
        setEditedQuantity(result.quantity.toString());
        setEditedDeliveryDate(result.deliveryDate);
        setStep('review');
      } catch (error) {
        console.error('AI分析失败:', error);
        setStep('input');
      }
    });
  };

  const handleSubmit = () => {
    setStep('submitting');
    // 模拟提交
    setTimeout(() => {
      router.push('/requests');
    }, 1500);
  };

  return (
    <AppLayout initialRole="requester">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">新建采购需求</h1>
            <p className="text-muted-foreground">
              使用自然语言描述您的采购需求，Hermes Agent 将帮您智能分析
            </p>
          </div>
        </div>

        {/* 步骤指示器 */}
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <Badge variant={step === 'input' || step === 'analyzing' || step === 'review' || step === 'submitting' ? 'default' : 'outline'}>
              1. 描述需求
            </Badge>
          </div>
          <Separator className="w-12" />
          <div className="flex items-center gap-2">
            <Badge variant={step === 'analyzing' || step === 'review' || step === 'submitting' ? 'default' : 'outline'}>
              {step === 'analyzing' ? (
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
              ) : step === 'review' || step === 'submitting' ? (
                <CheckCircle2 className="h-3 w-3 mr-1" />
              ) : null}
              2. AI分析
            </Badge>
          </div>
          <Separator className="w-12" />
          <div className="flex items-center gap-2">
            <Badge variant={step === 'review' || step === 'submitting' ? 'default' : 'outline'}>
              3. 确认提交
            </Badge>
          </div>
        </div>

        {step === 'input' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                描述您的采购需求
              </CardTitle>
              <CardDescription>
                用自然语言描述您需要采购什么，Hermes Agent 会智能提取关键信息
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="requirement">采购需求描述</Label>
                <Textarea
                  id="requirement"
                  placeholder="例如：我需要采购5台联想笔记本电脑，用于新员工入职，预算大概3万元，希望一周内能到货"
                  value={naturalLanguageInput}
                  onChange={(e) => setNaturalLanguageInput(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
              </div>

              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  描述建议
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>说明需要采购的物品名称和规格</li>
                  <li>说明需要的数量</li>
                  <li>说明期望的到货时间</li>
                  <li>可以说明预算范围</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link href="/">
                <Button variant="ghost">取消</Button>
              </Link>
              <Button 
                onClick={handleAnalyze} 
                disabled={!naturalLanguageInput.trim() || isPending}
                className="gap-2"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
                让AI分析
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 'analyzing' && (
          <Card>
            <CardContent className="py-12">
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <div className="relative">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <Bot className="h-6 w-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    Hermes Agent 正在分析您的需求
                  </h3>
                  <p className="text-muted-foreground">
                    AI正在从您的描述中提取产品名称、规格、数量、货期等关键信息...
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 'review' && aiAnalysis && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                AI分析完成
              </CardTitle>
              <CardDescription>
                Hermes Agent 已提取关键信息，请确认是否正确
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Sparkles className="h-4 w-4" />
                <AlertTitle>AI分析结果</AlertTitle>
                <AlertDescription>
                  置信度：{(aiAnalysis.confidence * 100).toFixed(0)}%
                </AlertDescription>
              </Alert>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="productName">产品名称</Label>
                  <div className="flex gap-2">
                    <Input
                      id="productName"
                      value={editedProductName}
                      onChange={(e) => setEditedProductName(e.target.value)}
                    />
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specifications">规格</Label>
                  <div className="flex gap-2">
                    <Input
                      id="specifications"
                      value={editedSpecifications}
                      onChange={(e) => setEditedSpecifications(e.target.value)}
                    />
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">数量</Label>
                  <div className="flex gap-2">
                    <Input
                      id="quantity"
                      type="number"
                      value={editedQuantity}
                      onChange={(e) => setEditedQuantity(e.target.value)}
                    />
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliveryDate">期望货期</Label>
                  <div className="flex gap-2">
                    <Input
                      id="deliveryDate"
                      type="date"
                      value={editedDeliveryDate}
                      onChange={(e) => setEditedDeliveryDate(e.target.value)}
                    />
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">原始描述：</span>
                  {naturalLanguageInput}
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="ghost" 
                onClick={() => setStep('input')}
              >
                返回修改
              </Button>
              <div className="flex gap-2">
                <Button 
                  variant="secondary" 
                  onClick={() => setStep('input')}
                >
                  保存草稿
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={(step as string) === 'submitting'}
                  className="gap-2"
                >
                  {(step as string) === 'submitting' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  提交需求
                </Button>
              </div>
            </CardFooter>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
