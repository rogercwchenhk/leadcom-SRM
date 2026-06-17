'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle, 
  ArrowLeft,
  Sparkles,
  Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';

export default function NewContractPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [contractNumber, setContractNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [remarks, setRemarks] = useState('');

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    }
  }, []);

  const removeFile = useCallback(() => {
    setFile(null);
    setUploadProgress(0);
    setUploadComplete(false);
  }, []);

  const simulateUpload = useCallback(() => {
    if (!file) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadComplete(true);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 300);
  }, [file]);

  const startProcessing = useCallback(() => {
    setIsProcessing(true);
    // 模拟AI处理
    setTimeout(() => {
      setIsProcessing(false);
      router.push('/contracts');
    }, 3000);
  }, [router]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (file && !uploadComplete) {
      simulateUpload();
    } else if (uploadComplete) {
      startProcessing();
    }
  }, [file, uploadComplete, simulateUpload, startProcessing]);

  return (
    <AppLayout initialRole="purchaser">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-3xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-slate-900 tracking-tight">
              上传销售合同
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              上传PDF合同，AI将自动生成摘要和提取关键信息
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basic Info */}
          <Card className="border-slate-200 shadow-sm mb-6">
            <CardHeader className="pb-1 pt-2 px-4">
              <CardTitle className="text-sm font-semibold text-slate-900">基本信息</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="contractNumber" className="text-xs">合同编号</Label>
                  <Input
                    id="contractNumber"
                    placeholder="例如：SC-2024-0001"
                    value={contractNumber}
                    onChange={(e) => setContractNumber(e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="customerName" className="text-xs">客户名称</Label>
                  <Input
                    id="customerName"
                    placeholder="例如：北京科技有限公司"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="remarks" className="text-xs">备注</Label>
                <Textarea
                  id="remarks"
                  placeholder="可选的备注信息..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={3}
                  className="text-sm"
                />
              </div>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card className="border-slate-200 shadow-sm mb-6">
            <CardHeader className="pb-1 pt-2 px-4">
              <CardTitle className="text-sm font-semibold text-slate-900">合同文件</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                支持PDF格式，文件大小不超过10MB
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0">
              {!file ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
                    dragOver 
                      ? 'border-orange-500 bg-orange-50' 
                      : 'border-slate-300 hover:border-orange-400 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="w-10 h-10 mx-auto rounded-full bg-slate-100 flex items-center justify-center mb-3">
                      <Upload className="w-5 h-5 text-slate-600" />
                    </div>
                    <p className="font-medium text-sm text-slate-900 mb-1">
                      拖拽PDF文件到此处
                    </p>
                    <p className="text-xs text-slate-500">
                      或点击选择文件
                    </p>
                  </label>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-red-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm text-slate-900 truncate">{file.name}</p>
                        <p className="text-[11px] text-slate-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    {!isUploading && !uploadComplete && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={removeFile}
                        className="h-8 w-8 p-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  {(isUploading || uploadComplete) && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600">
                          {uploadComplete ? '上传完成' : '上传中...'}
                        </span>
                        <span className="text-slate-500">{Math.round(uploadProgress)}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-1.5" />
                    </div>
                  )}

                  {uploadComplete && !isProcessing && (
                    <div className="flex items-center gap-2 p-2.5 bg-green-50 rounded-lg border border-green-200">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-xs text-green-700">文件上传成功，准备AI处理</span>
                    </div>
                  )}

                  {isProcessing && (
                    <div className="flex items-center gap-2 p-2.5 bg-orange-50 rounded-lg border border-orange-200">
                      <Loader2 className="w-4 h-4 text-orange-600 animate-spin" />
                      <div className="flex-1">
                        <p className="text-xs text-orange-700 font-medium">AI正在处理合同...</p>
                        <p className="text-[11px] text-orange-600">正在生成摘要和提取关键信息</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => router.back()} className="h-9 text-sm">
              取消
            </Button>
            <Button 
              type="submit"
              disabled={!file || isUploading || isProcessing}
              className="gap-1.5 h-9 text-sm"
            >
              {!uploadComplete ? (
                <>
                  <Upload className="w-4 h-4" />
                  上传合同
                </>
              ) : isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  处理中...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  开始AI处理
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
    </AppLayout>
  );
}
