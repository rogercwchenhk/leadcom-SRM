'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-lg hover:bg-slate-100" aria-label="返回首页">
                <ArrowLeft className="h-5 w-5 text-slate-600" aria-hidden="true" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
                新建采购需求
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Hermes AI 智能驱动 · 用自然语言描述您的需求
              </p>
            </div>
          </div>
        </div>

        {/* 主内容区域 */}
        <div className="w-full max-w-2xl mx-auto">
          {/* 页面头部 - 垂直布局 */}
          <div className="mb-6">
            {/* 步骤指示器 - 垂直布局 */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-orange-100 mb-6">
              <div className="space-y-5">
                <div className={`flex items-center gap-4 ${step === 'input' || step === 'analyzing' || step === 'review' || step === 'submitting' ? 'text-orange-600' : 'text-slate-400'}`}>
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-bold shadow-sm flex-shrink-0 ${step === 'input' || step === 'analyzing' || step === 'review' || step === 'submitting' ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    1
                  </div>
                  <span className="text-base font-semibold">描述需求</span>
                </div>
                
                <div className={`flex items-center gap-4 ${step === 'analyzing' || step === 'review' || step === 'submitting' ? 'text-orange-600' : 'text-slate-400'}`}>
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-bold shadow-sm flex-shrink-0 ${step === 'analyzing' ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white animate-pulse' : step === 'review' || step === 'submitting' ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {step === 'analyzing' ? (
                      <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                    ) : (
                      '2'
                    )}
                  </div>
                  <span className="text-base font-semibold">AI分析</span>
                </div>
                
                <div className={`flex items-center gap-4 ${step === 'review' || step === 'submitting' ? 'text-orange-600' : 'text-slate-400'}`}>
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-bold shadow-sm flex-shrink-0 ${step === 'submitting' ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white animate-pulse' : step === 'review' ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {step === 'submitting' ? (
                      <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                    ) : (
                      '3'
                    )}
                  </div>
                  <span className="text-base font-semibold">确认提交</span>
                </div>
              </div>
            </div>

            {/* Input Step */}
            {(step === 'input' || step === 'analyzing') && (
              <Card className="border-2 border-orange-100 shadow-lg bg-white">
                <CardHeader className="pb-4 pt-5 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg">
                      <Sparkles className="w-6 h-6 text-white" aria-hidden="true" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-slate-900">描述您的采购需求</CardTitle>
                      <CardDescription className="text-slate-600 text-sm mt-1">
                        Hermes AI 会帮您提取关键信息
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-6 pt-6">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="requirement-input" className="text-slate-700 font-bold text-base flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-orange-500" />
                        采购需求描述
                      </Label>
                      <Textarea
                        id="requirement-input"
                        placeholder="例如：我需要采购5台联想ThinkPad X1 Carbon笔记本电脑，预算大约5万元，希望在2月底前到货…"
                        value={naturalLanguageInput}
                        onChange={(e) => setNaturalLanguageInput(e.target.value)}
                        className="min-h-[180px] resize-none bg-slate-50 border-2 border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 text-base leading-relaxed rounded-xl"
                        disabled={step === 'analyzing'}
                      />
                    </div>

                    {step === 'input' && (
                      <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border-2 border-orange-200">
                        <p className="text-sm font-bold text-orange-800 mb-4 flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-orange-600" aria-hidden="true" />
                          您的描述应该包含这些信息
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm">
                            <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-orange-600 font-bold text-sm">1</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-slate-700 font-semibold text-sm">产品名称和规格</p>
                              <p className="text-slate-500 text-xs mt-1">例如：联想ThinkPad X1 Carbon</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm">
                            <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-orange-600 font-bold text-sm">2</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-slate-700 font-semibold text-sm">需要的数量</p>
                              <p className="text-slate-500 text-xs mt-1">例如：5台</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm">
                            <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-orange-600 font-bold text-sm">3</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-slate-700 font-semibold text-sm">期望的到货时间</p>
                              <p className="text-slate-500 text-xs mt-1">例如：2月底前</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pb-6 pt-0 flex flex-col gap-4">
                  <Button 
                    onClick={handleAnalyze} 
                    disabled={step === 'analyzing' || !naturalLanguageInput.trim()}
                    className="h-13 px-8 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white gap-3 text-base font-bold shadow-lg hover:shadow-xl w-full rounded-xl active:scale-[0.98] transition-transform"
                  >
                    {step === 'analyzing' ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                        Hermes 正在分析中…
                      </>
                    ) : (
                      <>
                        <Bot className="h-5 w-5" aria-hidden="true" />
                        让 Hermes AI 分析
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            )}

            {/* Review Step */}
            {(step === 'review' || step === 'submitting') && aiAnalysis && (
              <Card className="border-2 border-green-100 shadow-lg bg-white">
                <CardHeader className="pb-4 pt-5 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                      <CheckCircle2 className="w-6 h-6 text-white" aria-hidden="true" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-slate-900">AI 分析完成</CardTitle>
                      <CardDescription className="text-green-700 text-sm mt-1 font-medium">
                        Hermes 已提取采购信息，请确认后提交
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-6 pt-6">
                  <div className="space-y-7">
                    {/* Original Input */}
                    <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-5 border-2 border-slate-200">
                      <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-slate-500" />
                        您的原始描述
                      </h3>
                      <p className="text-slate-700 text-base leading-relaxed break-words">{naturalLanguageInput}</p>
                    </div>

                    <Separator className="bg-slate-300 h-0.5" />

                    {/* Extracted Info */}
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Edit className="w-5 h-5 text-green-600" aria-hidden="true" />
                          <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-1.5 rounded-full text-sm font-bold">
                            提取的采购信息（可编辑）
                          </span>
                        </div>
                      </div>

                      <div className="space-y-5">
                        <div className="space-y-3">
                          <Label htmlFor="product-name" className="text-slate-700 font-bold text-base flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            产品名称
                          </Label>
                          <Input
                            id="product-name"
                            value={editedProductName}
                            onChange={(e) => setEditedProductName(e.target.value)}
                            className="h-12 bg-white border-2 border-slate-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 text-base rounded-xl"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="specifications" className="text-slate-700 font-bold text-base flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            规格描述
                          </Label>
                          <Input
                            id="specifications"
                            value={editedSpecifications}
                            onChange={(e) => setEditedSpecifications(e.target.value)}
                            className="h-12 bg-white border-2 border-slate-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 text-base rounded-xl"
                          />
                        </div>

                        <div className="space-y-5">
                          <div className="space-y-3">
                            <Label htmlFor="quantity" className="text-slate-700 font-bold text-base flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-green-500" />
                              数量
                            </Label>
                            <Input
                              id="quantity"
                              type="number"
                              value={editedQuantity}
                              onChange={(e) => setEditedQuantity(e.target.value)}
                              className="h-12 bg-white border-2 border-slate-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 text-base rounded-xl"
                            />
                          </div>

                          <div className="space-y-3">
                            <Label htmlFor="delivery-date" className="text-slate-700 font-bold text-base flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-green-500" />
                              期望货期
                            </Label>
                            <Input
                              id="delivery-date"
                              value={editedDeliveryDate}
                              onChange={(e) => setEditedDeliveryDate(e.target.value)}
                              className="h-12 bg-white border-2 border-slate-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 text-base rounded-xl"
                              placeholder="YYYY-MM-DD"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* AI Confidence */}
                    <Alert className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-2xl">
                      <Sparkles className="h-5 w-5 text-orange-600" aria-hidden="true" />
                      <AlertTitle className="text-orange-800 font-bold text-base">Hermes AI 分析</AlertTitle>
                      <AlertDescription className="text-orange-700 text-sm mt-1.5">
                        AI 置信度: <span className="font-bold text-lg">{aiAnalysis.confidence}%</span>
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
                <CardFooter className="pb-6 pt-0 flex flex-col gap-4">
                  <Button 
                    variant="ghost" 
                    onClick={() => setStep('input')}
                    disabled={step === 'submitting'}
                    className="h-12 px-6 hover:bg-slate-100 text-slate-700 font-bold text-base w-full border-2 border-slate-200 rounded-xl active:scale-[0.98] transition-transform"
                  >
                    返回修改
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    disabled={step === 'submitting'}
                    className="h-12 px-8 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white gap-3 text-base font-bold shadow-lg hover:shadow-xl w-full rounded-xl active:scale-[0.98] transition-transform"
                  >
                    {step === 'submitting' ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                        提交中…
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" aria-hidden="true" />
                        确认提交
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
