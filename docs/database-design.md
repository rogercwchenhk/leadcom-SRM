# 数据库设计文档

## 核心表结构

### 1. users - 用户表
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('requester', 'purchaser', 'approver', 'finance')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2. suppliers - 供应商表
```sql
CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact_person TEXT,
  phone TEXT,
  email TEXT,
  categories TEXT[], -- 经营品类
  historical_cooperation_count INTEGER DEFAULT 0, -- 历史合作次数
  average_delivery_days INTEGER, -- 平均交货周期
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3. purchase_requests - 采购需求表
```sql
CREATE TABLE purchase_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_confirmation', 'inquiry', 'quoting', 'comparing', 'pending_approval', 'approved', 'rejected', 'po_created', 'shipped', 'invoiced', 'paid', 'exception')),
  requester_id UUID REFERENCES users(id),
  confirmer_id UUID REFERENCES users(id),
  natural_language_input TEXT, -- 自然语言输入
  product_name TEXT, -- AI提取的产品名称
  specifications TEXT, -- AI提取的规格
  quantity INTEGER, -- AI提取的数量
  delivery_date DATE, -- AI提取的期望货期
  budget DECIMAL(10,2), -- 预算
  ai_analysis_result JSONB, -- AI分析结果
  confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4. inquiry_sheets - 询价单表
```sql
CREATE TABLE inquiry_sheets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_request_id UUID REFERENCES purchase_requests(id),
  public_link_token TEXT UNIQUE NOT NULL, -- 公开链接token
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'responded', 'expired')),
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 5. supplier_quotes - 供应商报价表
```sql
CREATE TABLE supplier_quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_sheet_id UUID REFERENCES inquiry_sheets(id),
  supplier_id UUID REFERENCES suppliers(id),
  price DECIMAL(10,2) NOT NULL,
  delivery_days INTEGER NOT NULL,
  remarks TEXT,
  quoted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 6. purchase_orders - 采购订单(PO)表
```sql
CREATE TABLE purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_request_id UUID REFERENCES purchase_requests(id),
  supplier_id UUID REFERENCES suppliers(id),
  po_number TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'invoiced', 'paid', 'completed', 'cancelled')),
  total_amount DECIMAL(10,2) NOT NULL,
  confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 7. approvals - 审批表
```sql
CREATE TABLE approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_request_id UUID REFERENCES purchase_requests(id),
  approver_id UUID REFERENCES users(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  comments TEXT,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 8. approval_configs - 审批配置表
```sql
CREATE TABLE approval_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  amount_threshold DECIMAL(10,2) NOT NULL, -- 金额阈值
  approver_id UUID REFERENCES users(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 9. shipments - 发货记录表
```sql
CREATE TABLE shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id UUID REFERENCES purchase_orders(id),
  tracking_number TEXT NOT NULL,
  carrier TEXT,
  shipped_at TIMESTAMPTZ,
  estimated_delivery DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 10. invoices - 发票表
```sql
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id UUID REFERENCES purchase_orders(id),
  invoice_number TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  photo_url TEXT, -- 发票照片URL
  received_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 11. payments - 付款记录表
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id),
  amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 12. exceptions - 异常处理表
```sql
CREATE TABLE exceptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id UUID REFERENCES purchase_orders(id),
  type TEXT NOT NULL CHECK (type IN ('return', 'exchange')),
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'resolved')),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```
