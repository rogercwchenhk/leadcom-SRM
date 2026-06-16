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
import type { AIAnalysisResult } from '@/types';

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
    setTimeout(() => {
      router.push('/requests');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <AppLayout initialRole="requester">
        <div className="px-4 py-4">
          <div className="max-w-2xl mx-auto">
            {/* 页面头部 - 所有设备通用 */}
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-4">
                <Link href="/">
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-slate-100" aria-label="返回首页">
                    <ArrowLeft className="h-5 w-5 text-slate-600" aria-hidden="true" />
                  </Button>
                </Link>
                <div>
                  <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
                    新建采购需求
                  </h1>
                  <p className="text-slate-600 text-sm mt-1">
                    用自然语言描述您的需求
                  </p>
                </div>
              </div>

              {/* 步骤指示器 - 简洁版 */}
              <div className="flex items-center gap-2 mb-4">
                <div className={`flex items-center gap-1.5 ${step === 'input' || step === 'analyzing' || step === 'review' || step === 'submitting' ? 'text-orange-500' : 'text-slate-400'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${step === 'input' || step === 'analyzing' || step === 'review' || step === 'submitting' ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                    1
                  </div>
                  <span className="text-sm hidden sm:inline">描述</span>
                </div>
                <div className={`flex-1 h-0.5 ${step === 'analyzing' || step === 'review' || step === 'submitting' ? 'bg-orange-500' : 'bg-slate-200'}`} />
                <div className={`flex items-center gap-1.5 ${step === 'analyzing' || step === 'review' || step === 'submitting' ? 'text-orange-500' : 'text-slate-400'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${step === 'analyzing' ? 'bg-orange-500 text-white animate-pulse' : step === 'review' || step === 'submitting' ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                    {step === 'analyzing' ? (
                      <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
                    ) : (
                      '2'
                    )}
                  </div>
                  <span className="text-sm hidden sm:inline">分析</span>
                </div>
                <div className={`flex-1 h-0.5 ${step === 'review' || step === 'submitting' ? 'bg-orange-500' : 'bg-slate-200'}`} />
                <div className={`flex items-center gap-1.5 ${step === 'review' || step === 'submitting' ? 'text-orange-500' : 'text-slate-400'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${step === 'submitting' ? 'bg-orange-500 text-white animate-pulse' : step === 'review' ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                    {step === 'submitting' ? (
                      <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
                    ) : (
                      '3'
                    )}
                  </div>
                  <span className="text-sm hidden sm:inline">提交</span>
                </div>
              </div>
            </div>

            {/* Input Step */}
            {(step === 'input' || step === 'analyzing') && (
              <Card className="border-none shadow-sm">
                <CardHeader className="pb-1 pt-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
                      <Sparkles className="w-4.5 h-4.5 text-orange-500" aria-hidden="true" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold text-slate-900">描述您的需求</CardTitle>
                      <CardDescription className="text-xs text-slate-500 mt-0.5">
                        用自然语言告诉我们您需要采购什么
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="requirement-input" className="text-slate-700 font-medium text-sm">采购需求描述</Label>
                      <Textarea
                        id="requirement-input"
                        placeholder="例如：我需要采购5台联想ThinkPad X1 Carbon笔记本电脑，预算大约5万元，希望在2月底前到货…"
                        value={naturalLanguageInput}
                        onChange={(e) => setNaturalLanguageInput(e.target.value)}
                        className="min-h-[120px] resize-none bg-white border-slate-200 text-sm leading-relaxed"
                        disabled={step === 'analyzing'}
                      />
                    </div>

                    {step === 'input' && (
                      <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                        <p className="text-xs text-slate-600 mb-2 font-medium">💡 您的描述应该包含</p>
                        <ul className="text-xs text-slate-500 space-y-1">
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-orange-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                            <span>产品名称和规格型号</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-orange-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                            <span>需要的数量</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-orange-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                            <span>期望的到货时间</span>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pb-4 pt-0 flex justify-end">
                  <Button 
                    onClick={handleAnalyze} 
                    disabled={step === 'analyzing' || !naturalLanguageInput.trim()}
                    className="h-11 px-6 bg-orange-500 hover:bg-orange-600 text-white gap-2 text-sm w-full sm:w-auto"
                  >
                    {step === 'analyzing' ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        分析中…
                      </>
                    ) : (
                      <>
                        <Bot className="h-4 w-4" aria-hidden="true" />
                        让 Hermes 分析
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            )}

            {/* Review Step */}
            {(step === 'review' || step === 'submitting') && aiAnalysis && (
              <Card className="border-none shadow-sm">
                <CardHeader className="pb-1 pt-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
                      <CheckCircle2 className="w-4.5 h-4.5 text-green-500" aria-hidden="true" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold text-slate-900">AI 分析结果</CardTitle>
                      <CardDescription className="text-xs text-slate-500 mt-0.5">
                        请确认提取的信息是否正确
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="space-y-5">
                    {/* Original Input */}
                    <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                      <h3 className="text-xs font-medium text-slate-700 mb-2">您的原始描述</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">{naturalLanguageInput}</p>
                    </div>

                    <Separator className="bg-slate-200" />

                    {/* Extracted Info */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                        <Edit className="w-4 h-4 text-orange-500" aria-hidden="true" />
                        提取的采购信息（可编辑）
                      </h3>

                      <div className="space-y-3.5">
                        <div className="space-y-2">
                          <Label htmlFor="product-name" className="text-slate-700 font-medium text-sm">产品名称</Label>
                          <Input
                            id="product-name"
                            value={editedProductName}
                            onChange={(e) => setEditedProductName(e.target.value)}
                            className="h-10 bg-white border-slate-200 text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="specifications" className="text-slate-700 font-medium text-sm">规格描述</Label>
                          <Input
                            id="specifications"
                            value={editedSpecifications}
                            onChange={(e) => setEditedSpecifications(e.target.value)}
                            className="h-10 bg-white border-slate-200 text-sm"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor="quantity" className="text-slate-700 font-medium text-sm">数量</Label>
                            <Input
                              id="quantity"
                              type="number"
                              value={editedQuantity}
                              onChange={(e) => setEditedQuantity(e.target.value)}
                              className="h-10 bg-white border-slate-200 text-sm"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="delivery-date" className="text-slate-700 font-medium text-sm">期望货期</Label>
                            <Input
                              id="delivery-date"
                              value={editedDeliveryDate}
                              onChange={(e) => setEditedDeliveryDate(e.target.value)}
                              className="h-10 bg-white border-slate-200 text-sm"
                              placeholder="YYYY-MM-DD"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* AI Confidence */}
                    <Alert className="bg-orange-50 border-orange-100 rounded-xl">
                      <Sparkles className="h-4.5 w-4.5 text-orange-500" aria-hidden="true" />
                      <AlertTitle className="text-orange-800 font-medium text-sm">Hermes 分析</AlertTitle>
                      <AlertDescription className="text-orange-700 text-xs leading-relaxed">
                        AI 置信度: <span className="font-semibold">{aiAnalysis.confidence}%</span>
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
                <CardFooter className="pb-4 pt-0 flex flex-col sm:flex-row gap-3">
                  <Button 
                    variant="ghost" 
                    onClick={() => setStep('input')}
                    disabled={step === 'submitting'}
                    className="h-11 px-5 hover:bg-slate-100 text-sm w-full sm:w-auto"
                  >
                    返回修改
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    disabled={step === 'submitting'}
                    className="h-11 px-6 bg-orange-500 hover:bg-orange-600 text-white gap-2 text-sm w-full sm:w-auto"
                  >
                    {step === 'submitting' ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        提交中…
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" aria-hidden="true" />
                        确认提交
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </AppLayout>
    </div>
  );
}
