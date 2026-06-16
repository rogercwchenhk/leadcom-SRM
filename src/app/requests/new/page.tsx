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
        <div className="px-8 py-12">
          <div className="max-w-3xl mx-auto">
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-8">
                <Link href="/">
                  <Button variant="ghost" size="icon" className="h-11 w-11 rounded-xl hover:bg-slate-100">
                    <ArrowLeft className="h-5 w-5 text-slate-600" />
                  </Button>
                </Link>
                <div>
                  <h1 className="text-3xl font-semibold text-slate-900 tracking-tight mb-3">
                    新建采购需求
                  </h1>
                  <p className="text-slate-600 text-lg">
                    使用自然语言描述您的采购需求，Hermes Agent 将帮您智能分析
                  </p>
                </div>
              </div>

              {/* Step Indicator */}
              <div className="flex items-center justify-center gap-4 mb-12">
                <div className="flex items-center gap-2">
                  <Badge variant={step === 'input' || step === 'analyzing' || step === 'review' || step === 'submitting' ? 'default' : 'outline'} className="h-7 px-3 rounded-lg">
                    1. 描述需求
                  </Badge>
                </div>
                <Separator className="w-12 bg-slate-200" />
                <div className="flex items-center gap-2">
                  <Badge variant={step === 'analyzing' || step === 'review' || step === 'submitting' ? 'default' : 'outline'} className="h-7 px-3 rounded-lg">
                    {step === 'analyzing' ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                    ) : step === 'review' || step === 'submitting' ? (
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                    ) : null}
                    2. AI分析
                  </Badge>
                </div>
                <Separator className="w-12 bg-slate-200" />
                <div className="flex items-center gap-2">
                  <Badge variant={step === 'review' || step === 'submitting' ? 'default' : 'outline'} className="h-7 px-3 rounded-lg">
                    {step === 'submitting' ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                    ) : step === 'review' ? (
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                    ) : null}
                    3. 确认提交
                  </Badge>
                </div>
              </div>
            </div>

            {/* Input Step */}
            {(step === 'input' || step === 'analyzing') && (
              <Card className="border-none shadow-sm">
                <CardHeader className="px-4 pb-1 pt-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold text-slate-900">描述您的需求</CardTitle>
                      <CardDescription className="text-xs text-slate-500 mt-0.5">
                        用自然语言告诉我们您需要采购什么
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label className="text-slate-700 font-medium">采购需求描述</Label>
                      <Textarea
                        placeholder="例如：我需要采购5台联想ThinkPad X1 Carbon笔记本电脑，预算大约5万元，希望在2月底前到货"
                        value={naturalLanguageInput}
                        onChange={(e) => setNaturalLanguageInput(e.target.value)}
                        className="min-h-[160px] resize-none bg-white border-slate-200 text-base leading-relaxed"
                        disabled={step === 'analyzing'}
                      />
                    </div>

                    {step === 'input' && (
                      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                        <p className="text-sm text-slate-600 mb-4 font-medium">💡 提示：您的描述应该包含</p>
                        <ul className="text-sm text-slate-500 space-y-2.5">
                          <li className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                            <span>产品名称和规格型号</span>
                          </li>
                          <li className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                            <span>需要的数量</span>
                          </li>
                          <li className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                            <span>期望的到货时间</span>
                          </li>
                          <li className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                            <span>预算范围（可选）</span>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="px-4 pb-4 pt-0 flex justify-end">
                  <Button 
                    onClick={handleAnalyze} 
                    disabled={step === 'analyzing' || !naturalLanguageInput.trim()}
                    className="h-11 px-8 bg-orange-500 hover:bg-orange-600 text-white gap-2"
                  >
                    {step === 'analyzing' ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        AI 分析中...
                      </>
                    ) : (
                      <>
                        <Bot className="h-4 w-4" />
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
                <CardHeader className="px-4 pb-1 pt-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold text-slate-900">AI 分析结果</CardTitle>
                      <CardDescription className="text-xs text-slate-500 mt-0.5">
                        请确认 Hermes Agent 提取的信息是否正确
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="space-y-8">
                    {/* Original Input */}
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                      <h3 className="text-sm font-medium text-slate-700 mb-4">您的原始描述</h3>
                      <p className="text-slate-600 text-base leading-relaxed">{naturalLanguageInput}</p>
                    </div>

                    <Separator className="bg-slate-200" />

                    {/* Extracted Info */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-3">
                        <Edit className="w-5 h-5 text-orange-500" />
                        提取的采购信息（可编辑）
                      </h3>

                      <div className="grid gap-6">
                        <div className="space-y-3">
                          <Label className="text-slate-700 font-medium">产品名称</Label>
                          <Input
                            value={editedProductName}
                            onChange={(e) => setEditedProductName(e.target.value)}
                            className="h-11 bg-white border-slate-200"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label className="text-slate-700 font-medium">规格描述</Label>
                          <Input
                            value={editedSpecifications}
                            onChange={(e) => setEditedSpecifications(e.target.value)}
                            className="h-11 bg-white border-slate-200"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <Label className="text-slate-700 font-medium">数量</Label>
                            <Input
                              type="number"
                              value={editedQuantity}
                              onChange={(e) => setEditedQuantity(e.target.value)}
                              className="h-11 bg-white border-slate-200"
                            />
                          </div>

                          <div className="space-y-3">
                            <Label className="text-slate-700 font-medium">期望货期</Label>
                            <Input
                              value={editedDeliveryDate}
                              onChange={(e) => setEditedDeliveryDate(e.target.value)}
                              className="h-11 bg-white border-slate-200"
                              placeholder="YYYY-MM-DD"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* AI Confidence */}
                    <Alert className="bg-orange-50 border-orange-100 rounded-2xl">
                      <Sparkles className="h-5 w-5 text-orange-500" />
                      <AlertTitle className="text-orange-800 font-medium">Hermes 分析</AlertTitle>
                      <AlertDescription className="text-orange-700 text-sm leading-relaxed">
                        AI 置信度: <span className="font-semibold">{aiAnalysis.confidence}%</span>
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
                <CardFooter className="px-4 pb-4 pt-0 flex justify-between">
                  <Button 
                    variant="ghost" 
                    onClick={() => setStep('input')}
                    disabled={step === 'submitting'}
                    className="h-11 px-6 hover:bg-slate-100"
                  >
                    返回修改
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    disabled={step === 'submitting'}
                    className="h-11 px-8 bg-orange-500 hover:bg-orange-600 text-white gap-2"
                  >
                    {step === 'submitting' ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        提交中...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
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
