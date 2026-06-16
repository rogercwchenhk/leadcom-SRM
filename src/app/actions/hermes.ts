'use server';

import { AIAnalysisResult, Supplier, SupplierQuote, SupplierRecommendation } from '@/types';

/**
 * Hermes Agent - AI Server Actions
 * 模拟 AI 需求理解、智能询价和决策建议功能
 */

// 模拟 AI 需求理解
export async function analyzePurchaseRequirement(naturalLanguageInput: string): Promise<AIAnalysisResult> {
  // 模拟 AI 分析延迟
  await new Promise(resolve => setTimeout(resolve, 1500));

  // 简单的模拟分析逻辑
  const input = naturalLanguageInput.toLowerCase();
  
  // 提取产品名称
  let productName = '未识别产品';
  if (input.includes('电脑') || input.includes('笔记本')) productName = '笔记本电脑';
  else if (input.includes('打印机')) productName = '打印机';
  else if (input.includes('显示器')) productName = '显示器';
  else if (input.includes('键盘') || input.includes('鼠标')) productName = '办公外设';
  else if (input.includes('纸张') || input.includes('打印纸')) productName = '办公用纸';
  else productName = '采购物品';

  // 提取数量
  let quantity = 1;
  const quantityMatch = input.match(/(\d+)\s*(台|个|件|套)/);
  if (quantityMatch) {
    quantity = parseInt(quantityMatch[1]);
  }

  // 提取规格
  let specifications = '标准规格';
  if (input.includes('苹果') || input.includes('mac')) specifications = 'Apple/Mac 系列';
  else if (input.includes('联想') || input.includes('lenovo')) specifications = '联想系列';
  else if (input.includes('戴尔') || input.includes('dell')) specifications = '戴尔系列';
  else if (input.includes('惠普') || input.includes('hp')) specifications = '惠普系列';

  // 提取货期
  let deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 7); // 默认7天
  
  if (input.includes('紧急') || input.includes('尽快') || input.includes('马上')) {
    deliveryDate.setDate(deliveryDate.getDate() - 4); // 紧急3天
  } else if (input.includes('一周') || input.includes('7天')) {
    deliveryDate.setDate(deliveryDate.getDate()); // 一周
  } else if (input.includes('两周') || input.includes('14天')) {
    deliveryDate.setDate(deliveryDate.getDate() + 7); // 两周
  }

  return {
    productName,
    specifications,
    quantity,
    deliveryDate: deliveryDate.toISOString().split('T')[0],
    confidence: 0.85,
    rawAnalysis: `AI分析了您的需求："${naturalLanguageInput}"，提取了关键信息。`
  };
}

// 模拟 AI 选择供应商
export async function selectSuppliersForInquiry(
  productName: string,
  specifications: string,
  allSuppliers: Supplier[]
): Promise<Supplier[]> {
  await new Promise(resolve => setTimeout(resolve, 800));

  // 简单的供应商匹配逻辑
  const matchedSuppliers = allSuppliers.filter(supplier => {
    const categories = supplier.categories.map(c => c.toLowerCase());
    const productLower = productName.toLowerCase();
    const specLower = specifications.toLowerCase();
    
    return categories.some(cat => 
      productLower.includes(cat) || 
      specLower.includes(cat) ||
      cat.includes('办公') || 
      cat.includes('电子')
    );
  });

  // 优先选择历史合作多的供应商
  const sortedSuppliers = [...matchedSuppliers].sort((a, b) => 
    b.historicalCooperationCount - a.historicalCooperationCount
  );

  // 返回最多3个供应商
  return sortedSuppliers.slice(0, Math.min(3, sortedSuppliers.length));
}

// 模拟 AI 供应商推荐和决策建议
export async function recommendSuppliers(
  quotes: Array<{ supplier: Supplier; quote: SupplierQuote }>
): Promise<SupplierRecommendation[]> {
  await new Promise(resolve => setTimeout(resolve, 1200));

  const recommendations: SupplierRecommendation[] = quotes.map(({ supplier, quote }) => {
    // 计算价格分数（越低越好）
    const prices = quotes.map(q => q.quote.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceScore = maxPrice === minPrice ? 100 : 
      Math.round(100 - ((quote.price - minPrice) / (maxPrice - minPrice)) * 50);

    // 计算交货期分数（越快越好）
    const deliveryDays = quotes.map(q => q.quote.deliveryDays);
    const minDays = Math.min(...deliveryDays);
    const maxDays = Math.max(...deliveryDays);
    const deliveryScore = maxDays === minDays ? 100 :
      Math.round(100 - ((quote.deliveryDays - minDays) / (maxDays - minDays)) * 30);

    // 计算合作历史分数
    const maxCooperation = Math.max(...quotes.map(q => q.supplier.historicalCooperationCount));
    const cooperationScore = maxCooperation === 0 ? 100 :
      Math.round((supplier.historicalCooperationCount / maxCooperation) * 20);

    // 综合分数
    const score = Math.round(priceScore * 0.5 + deliveryScore * 0.3 + cooperationScore * 0.2);

    // 生成推荐理由
    const reasons: string[] = [];
    
    if (quote.price === minPrice) {
      reasons.push('报价最低');
    } else if (priceScore >= 80) {
      reasons.push('价格具有竞争力');
    }
    
    if (quote.deliveryDays === minDays) {
      reasons.push('交货期最快');
    } else if (deliveryScore >= 80) {
      reasons.push('交货期较短');
    }
    
    if (supplier.historicalCooperationCount > 0) {
      reasons.push(`历史合作${supplier.historicalCooperationCount}次`);
    }

    const reason = reasons.length > 0 ? reasons.join('，') : '综合表现良好';

    return {
      supplier,
      quote,
      score,
      priceScore,
      deliveryScore,
      cooperationScore,
      reason
    };
  });

  // 按分数排序
  return recommendations.sort((a, b) => b.score - a.score);
}
