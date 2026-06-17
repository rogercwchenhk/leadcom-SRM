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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Header - 与首页一致 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-lg hover:bg-slate-100" aria-label="返回首页">
                <ArrowLeft className="h-5 w-5 text-slate-600" aria-hidden="true" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
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
          {/* 步骤指示器 */}
          <div className="mb-4">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-1 pt-2 px-4">
                <CardTitle className="text-sm font-semibold text-slate-900">创建步骤</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0">
                <div className="space-y-3">
                  <div className={`flex items-center gap-3 ${step === 'input' || step === 'analyzing' || step === 'review' || step === 'submitting' ? 'text-orange-600' : 'text-slate-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm flex-shrink-0 ${step === 'input' || step === 'analyzing' || step === 'review' || step === 'submitting' ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      1
                    </div>
                    <span className="text-sm font-medium">描述需求</span>
                  </div>
                  
                  <div className={`flex items-center gap-3 ${step === 'analyzing' || step === 'review' || step === 'submitting' ? 'text-orange-600' : 'text-slate-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm flex-shrink-0 ${step === 'analyzing' ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white animate-pulse' : step === 'review' || step === 'submitting' ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      {step === 'analyzing' ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                      ) : (
                        '2'
                      )}
                    </div>
                    <span className="text-sm font-medium">AI分析</span>
                  </div>
                  
                  <div className={`flex items-center gap-3 ${step === 'review' || step === 'submitting' ? 'text-orange-600' : 'text-slate-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm flex-shrink-0 ${step === 'submitting' ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white animate-pulse' : step === 'review' ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      {step === 'submitting' ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                      ) : (
                        '3'
                      )}
                    </div>
                    <span className="text-sm font-medium">确认提交</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Input Step */}
          {(step === 'input' || step === 'analyzing') && (
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-1 pt-2 px-4">
                <CardTitle className="text-sm font-semibold text-slate-900">描述您的采购需求</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="requirement-input" className="text-sm font-medium text-slate-700">
                      采购需求描述
                    </Label>
                    <Textarea
                      id="requirement-input"
                      placeholder="例如：我需要采购5台联想ThinkPad X1 Carbon笔记本电脑，预算大约5万元，希望在2月底前到货…"
                      value={naturalLanguageInput}
                      onChange={(e) => setNaturalLanguageInput(e.target.value)}
                      className="min-h-[120px] resize-none bg-slate-50 border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm leading-relaxed rounded-lg"
                      disabled={step === 'analyzing'}
                    />
                  </div>

                  {step === 'input' && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <p className="text-xs font-semibold text-orange-800 mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-orange-600" aria-hidden="true" />
                        您的描述应该包含这些信息
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2 bg-white rounded-lg p-2.5 border border-orange-100">
                          <div className="w-6 h-6 rounded-md bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-orange-600 font-bold text-xs">1</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-slate-700 font-medium text-xs">产品名称和规格</p>
                            <p className="text-slate-500 text-[11px] mt-0.5">例如：联想ThinkPad X1 Carbon</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 bg-white rounded-lg p-2.5 border border-orange-100">
                          <div className="w-6 h-6 rounded-md bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-orange-600 font-bold text-xs">2</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-slate-700 font-medium text-xs">需要的数量</p>
                            <p className="text-slate-500 text-[11px] mt-0.5">例如：5台</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 bg-white rounded-lg p-2.5 border border-orange-100">
                          <div className="w-6 h-6 rounded-md bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-orange-600 font-bold text-xs">3</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-slate-700 font-medium text-xs">期望的到货时间</p>
                            <p className="text-slate-500 text-[11px] mt-0.5">例如：2月底前</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardContent className="px-4 pb-4 pt-0">
                <Button 
                  onClick={handleAnalyze} 
                  disabled={step === 'analyzing' || !naturalLanguageInput.trim()}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                >
                  {step === 'analyzing' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden="true" />
                      Hermes 正在分析中…
                    </>
                  ) : (
                    <>
                      <Bot className="h-4 w-4 mr-2" aria-hidden="true" />
                      让 Hermes AI 分析
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Review Step */}
          {(step === 'review' || step === 'submitting') && aiAnalysis && (
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-1 pt-2 px-4">
                <CardTitle className="text-sm font-semibold text-slate-900">AI 分析完成</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0">
                <div className="space-y-4">
                  {/* Original Input */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <h3 className="text-xs font-semibold text-slate-700 mb-2">
                      您的原始描述
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{naturalLanguageInput}</p>
                  </div>

                  <Separator className="bg-slate-200" />

                  {/* Extracted Info */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                      <Edit className="w-4 h-4 text-green-600" aria-hidden="true" />
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                        提取的采购信息（可编辑）
                      </span>
                    </h3>

                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="product-name" className="text-sm font-medium text-slate-700">
                          产品名称
                        </Label>
                        <Input
                          id="product-name"
                          value={editedProductName}
                          onChange={(e) => setEditedProductName(e.target.value)}
                          className="h-9 bg-white border-slate-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm rounded-lg"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="specifications" className="text-sm font-medium text-slate-700">
                          规格描述
                        </Label>
                        <Input
                          id="specifications"
                          value={editedSpecifications}
                          onChange={(e) => setEditedSpecifications(e.target.value)}
                          className="h-9 bg-white border-slate-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm rounded-lg"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="quantity" className="text-sm font-medium text-slate-700">
                            数量
                          </Label>
                          <Input
                            id="quantity"
                            type="number"
                            value={editedQuantity}
                            onChange={(e) => setEditedQuantity(e.target.value)}
                            className="h-9 bg-white border-slate-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm rounded-lg"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="delivery-date" className="text-sm font-medium text-slate-700">
                            期望货期
                          </Label>
                          <Input
                            id="delivery-date"
                            value={editedDeliveryDate}
                            onChange={(e) => setEditedDeliveryDate(e.target.value)}
                            className="h-9 bg-white border-slate-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm rounded-lg"
                            placeholder="YYYY-MM-DD"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Confidence */}
                  <Alert className="bg-orange-50 border-orange-200 rounded-lg">
                    <Sparkles className="h-4 w-4 text-orange-600" aria-hidden="true" />
                    <AlertTitle className="text-sm font-semibold text-orange-800">Hermes AI 分析</AlertTitle>
                    <AlertDescription className="text-xs text-orange-700 mt-1">
                      AI 置信度: <span className="font-semibold text-sm">{aiAnalysis.confidence}%</span>
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
              <CardContent className="px-4 pb-4 pt-0 flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setStep('input')}
                  disabled={step === 'submitting'}
                  className="flex-1 border-slate-200"
                >
                  返回修改
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={step === 'submitting'}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  {step === 'submitting' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden="true" />
                      提交中…
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" aria-hidden="true" />
                      确认提交
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
