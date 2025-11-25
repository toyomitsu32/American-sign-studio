# 技術アーキテクチャ詳細

## システムアーキテクチャ図

```
┌─────────────────────────────────────────────────────────────┐
│                        クライアント層                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   React UI   │  │  Three.js    │  │ Web Speech   │     │
│  │   Components │  │  3D Preview  │  │    API       │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                      アプリケーション層                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Next.js / Express API                      │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐    │  │
│  │  │  Template  │  │   Order    │  │    AI      │    │  │
│  │  │   Service  │  │  Service   │  │  Service   │    │  │
│  │  └────────────┘  └────────────┘  └────────────┘    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                        データ層                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  PostgreSQL  │  │   Redis      │  │   S3/R2      │     │
│  │   Database   │  │   Cache      │  │  Storage     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      外部サービス層                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   OpenAI     │  │  Google STT  │  │   Stripe     │     │
│  │   GPT-4      │  │    API       │  │   Payment    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

## フロントエンド詳細設計

### ディレクトリ構造

```
frontend/
├── public/
│   ├── templates/          # テンプレート画像
│   ├── 3d-models/          # 3Dモデルファイル
│   └── icons/              # アイコン類
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Loading.tsx
│   │   ├── home/
│   │   │   ├── Hero.tsx
│   │   │   ├── Features.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   └── Testimonials.tsx
│   │   ├── category/
│   │   │   ├── CategorySelector.tsx
│   │   │   └── CategoryCard.tsx
│   │   ├── template/
│   │   │   ├── TemplateGrid.tsx
│   │   │   ├── TemplateCard.tsx
│   │   │   └── TemplateFilter.tsx
│   │   ├── editor/
│   │   │   ├── EditorLayout.tsx
│   │   │   ├── ControlPanel/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── VoiceInput.tsx
│   │   │   │   ├── TextEditor.tsx
│   │   │   │   ├── ColorPicker.tsx
│   │   │   │   ├── SizeSelector.tsx
│   │   │   │   └── MaterialSelector.tsx
│   │   │   └── PreviewPanel/
│   │   │       ├── index.tsx
│   │   │       ├── Sign3DPreview.tsx
│   │   │       ├── EnvironmentPreview.tsx
│   │   │       └── MeasurementOverlay.tsx
│   │   └── checkout/
│   │       ├── OrderSummary.tsx
│   │       ├── CustomerForm.tsx
│   │       ├── ShippingForm.tsx
│   │       └── PaymentSection.tsx
│   ├── pages/
│   │   ├── index.tsx              # ホーム
│   │   ├── categories.tsx         # カテゴリー選択
│   │   ├── templates/[id].tsx     # テンプレート選択
│   │   ├── editor/[templateId].tsx # エディター
│   │   └── checkout.tsx           # チェックアウト
│   ├── hooks/
│   │   ├── useVoiceInput.ts
│   │   ├── useSignDesign.ts
│   │   ├── useOrderCalculation.ts
│   │   ├── use3DPreview.ts
│   │   └── useAIProcessing.ts
│   ├── store/
│   │   ├── designStore.ts         # デザイン状態管理
│   │   ├── orderStore.ts          # 注文状態管理
│   │   └── userStore.ts           # ユーザー状態管理
│   ├── services/
│   │   ├── api/
│   │   │   ├── templates.ts
│   │   │   ├── orders.ts
│   │   │   ├── ai.ts
│   │   │   └── pricing.ts
│   │   └── audio/
│   │       ├── speechRecognition.ts
│   │       └── audioProcessor.ts
│   ├── utils/
│   │   ├── designHelpers.ts
│   │   ├── priceCalculator.ts
│   │   ├── validators.ts
│   │   └── formatters.ts
│   ├── types/
│   │   ├── design.ts
│   │   ├── template.ts
│   │   ├── order.ts
│   │   └── api.ts
│   └── styles/
│       ├── globals.css
│       └── tailwind.config.js
├── package.json
└── tsconfig.json
```

### 主要コンポーネント実装例

#### 1. VoiceInput コンポーネント

```typescript
// components/editor/ControlPanel/VoiceInput.tsx
interface VoiceInputProps {
  onTranscript: (text: string) => void;
  onCommand: (command: ParsedCommand) => void;
}

interface ParsedCommand {
  type: 'text' | 'color' | 'size' | 'style';
  action: string;
  value: string;
}
```

**機能**:
- マイクボタンで音声録音開始/停止
- リアルタイムで音声をテキスト変換
- AIで意図を解析して適切なコマンドに変換
- ビジュアルフィードバック（録音中のアニメーション）

#### 2. Sign3DPreview コンポーネント

```typescript
// components/editor/PreviewPanel/Sign3DPreview.tsx
interface Sign3DPreviewProps {
  design: SignDesign;
  showMeasurements?: boolean;
  enableInteraction?: boolean;
}

interface SignDesign {
  text: TextConfig;
  colors: ColorConfig;
  size: SizeConfig;
  material: Material;
}
```

**機能**:
- Three.jsで3D標識レンダリング
- マウス/タッチでの回転・ズーム
- リアルタイムテクスチャ更新
- 光源・影の設定

#### 3. AIProcessing サービス

```typescript
// services/api/ai.ts
class AIService {
  async processVoiceCommand(transcript: string): Promise<ParsedCommand>
  async optimizeText(text: string, context: string): Promise<string>
  async suggestColors(industry: string, mood: string): Promise<ColorPalette>
  async generateDesign(prompt: string): Promise<DesignSuggestion>
}
```

---

## バックエンド詳細設計

### ディレクトリ構造

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   ├── redis.ts
│   │   ├── storage.ts
│   │   └── ai.ts
│   ├── controllers/
│   │   ├── category.controller.ts
│   │   ├── template.controller.ts
│   │   ├── order.controller.ts
│   │   ├── ai.controller.ts
│   │   └── pricing.controller.ts
│   ├── services/
│   │   ├── template.service.ts
│   │   ├── order.service.ts
│   │   ├── ai/
│   │   │   ├── openai.service.ts
│   │   │   ├── speech.service.ts
│   │   │   └── design.service.ts
│   │   ├── pricing.service.ts
│   │   ├── email.service.ts
│   │   └── storage.service.ts
│   ├── models/
│   │   ├── Category.ts
│   │   ├── Template.ts
│   │   ├── Order.ts
│   │   └── AILog.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── validation.ts
│   │   ├── rateLimit.ts
│   │   └── errorHandler.ts
│   ├── routes/
│   │   ├── index.ts
│   │   ├── categories.ts
│   │   ├── templates.ts
│   │   ├── orders.ts
│   │   └── ai.ts
│   ├── utils/
│   │   ├── logger.ts
│   │   ├── validators.ts
│   │   └── helpers.ts
│   └── types/
│       ├── express.d.ts
│       └── models.d.ts
├── tests/
│   ├── unit/
│   └── integration/
├── package.json
└── tsconfig.json
```

### API エンドポイント詳細

#### カテゴリー関連

```typescript
GET /api/v1/categories
Response: {
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    description: string;
    icon_url: string;
    template_count: number;
  }>
}
```

#### テンプレート関連

```typescript
GET /api/v1/templates?category={categoryId}&popular=true&limit=12
Response: {
  templates: Array<{
    id: string;
    name: string;
    description: string;
    thumbnail_url: string;
    preview_3d_url: string;
    default_text: object;
    default_colors: object;
    base_price: number;
    is_popular: boolean;
    tags: string[];
  }>,
  pagination: {
    total: number;
    page: number;
    limit: number;
  }
}

GET /api/v1/templates/{id}
Response: {
  template: {
    // 完全なテンプレート詳細
  }
}
```

#### AI処理関連

```typescript
POST /api/v1/ai/process-voice
Request: {
  transcript: string;
  context: {
    current_design: object;
    template_id: string;
  }
}
Response: {
  command: {
    type: string;
    action: string;
    value: any;
    confidence: number;
  },
  suggestion: string;
}

POST /api/v1/ai/optimize-text
Request: {
  text: string;
  context: string;  // 'title' | 'subtitle' | 'body'
  industry: string;
}
Response: {
  optimized_text: string;
  suggestions: string[];
  readability_score: number;
}

POST /api/v1/ai/suggest-design
Request: {
  prompt: string;
  category: string;
  preferences: object;
}
Response: {
  suggestions: Array<{
    colors: ColorPalette;
    fonts: FontSuggestion[];
    layout: LayoutConfig;
    reasoning: string;
  }>
}
```

#### 価格計算関連

```typescript
POST /api/v1/pricing/calculate
Request: {
  template_id: string;
  size: string;
  material: string;
  quantity: number;
  customizations: object;
}
Response: {
  base_price: number;
  customization_fee: number;
  material_cost: number;
  size_multiplier: number;
  quantity_discount: number;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  production_time_days: number;
}
```

#### 注文関連

```typescript
POST /api/v1/orders
Request: {
  template_id: string;
  design_data: object;
  customer_info: {
    name: string;
    email: string;
    phone: string;
  };
  shipping_address: object;
  payment_method: string;
}
Response: {
  order: {
    id: string;
    order_number: string;
    status: string;
    total: number;
    preview_url: string;
  }
}

GET /api/v1/orders/{id}
Response: {
  order: {
    // 完全な注文詳細
  }
}

POST /api/v1/orders/{id}/send-to-manufacturer
Request: {
  notes: string;
}
Response: {
  success: boolean;
  tracking_id: string;
  estimated_completion: string;
}
```

---

## AI統合詳細

### OpenAI GPT-4 統合

#### 音声コマンド処理プロンプト

```typescript
const VOICE_COMMAND_PROMPT = `
あなたは標識デザインアシスタントです。
ユーザーの音声入力から意図を理解し、デザイン変更コマンドに変換してください。

現在のデザイン状態:
${JSON.stringify(currentDesign, null, 2)}

ユーザーの入力: "${transcript}"

以下のJSON形式で応答してください:
{
  "type": "text" | "color" | "size" | "style" | "add" | "remove",
  "target": "title" | "subtitle" | "body" | "background" | "border",
  "action": "set" | "change" | "modify" | "add" | "remove",
  "value": "具体的な値",
  "confidence": 0.0-1.0,
  "clarification": "必要に応じて確認質問"
}
`;
```

#### テキスト最適化プロンプト

```typescript
const TEXT_OPTIMIZATION_PROMPT = `
標識のテキストを最適化してください。

要件:
1. 視認性: 遠くから読みやすい
2. 簡潔性: 必要最小限の言葉
3. 明確性: 誤解の余地がない
4. 規格準拠: アメリカの標識規格に準拠

元のテキスト: "${originalText}"
コンテキスト: ${context}
業種: ${industry}

最適化されたテキストと理由を提供してください。
`;
```

### Google Speech-to-Text 統合

```typescript
// services/ai/speech.service.ts
class SpeechService {
  async transcribe(audioBuffer: Buffer): Promise<string> {
    // Google Cloud Speech-to-Text API呼び出し
    const config = {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: 'en-US',
      model: 'command_and_search',
      useEnhanced: true,
    };
    
    // リアルタイムストリーミング認識
  }
}
```

---

## データベース最適化

### インデックス戦略

```sql
-- カテゴリー検索の高速化
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_display_order ON categories(display_order);

-- テンプレート検索の高速化
CREATE INDEX idx_templates_category ON templates(category_id);
CREATE INDEX idx_templates_popular ON templates(is_popular) WHERE is_popular = true;
CREATE INDEX idx_templates_tags ON templates USING GIN(tags);

-- 注文検索の高速化
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_order_number ON orders(order_number);

-- 全文検索
CREATE INDEX idx_templates_search ON templates USING GIN(
  to_tsvector('english', name || ' ' || description)
);
```

### キャッシング戦略

```typescript
// Redis キャッシュ設定
const CACHE_CONFIG = {
  categories: {
    key: 'categories:all',
    ttl: 3600, // 1時間
  },
  templates: {
    key: (categoryId: string) => `templates:category:${categoryId}`,
    ttl: 1800, // 30分
  },
  popularTemplates: {
    key: 'templates:popular',
    ttl: 3600,
  },
  pricing: {
    key: (params: string) => `pricing:${params}`,
    ttl: 600, // 10分
  },
};
```

---

## パフォーマンス最適化

### フロントエンド最適化

1. **コード分割**
```typescript
// 動的インポートでバンドルサイズ削減
const Editor = lazy(() => import('./pages/editor/[templateId]'));
const Checkout = lazy(() => import('./pages/checkout'));
```

2. **画像最適化**
- WebP形式の使用
- レスポンシブ画像
- 遅延読み込み
- プログレッシブJPEG

3. **3Dモデル最適化**
- GLTFバイナリ形式
- Draco圧縮
- テクスチャ圧縮
- LOD (Level of Detail)

### バックエンド最適化

1. **データベースクエリ最適化**
- N+1問題の回避
- 適切なJOIN使用
- ページネーション実装
- クエリキャッシング

2. **API レスポンス最適化**
- Gzip圧縮
- HTTP/2使用
- CDN配信
- ETags活用

3. **AI処理最適化**
- バッチ処理
- 結果キャッシング
- 非同期処理
- タイムアウト設定

---

## モニタリング・ログ

### ログ戦略

```typescript
// utils/logger.ts
enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  service: string;
  message: string;
  metadata?: object;
  trace_id?: string;
}
```

### メトリクス収集

```typescript
// モニタリング対象
const METRICS = {
  api: {
    request_count: 'APIリクエスト数',
    response_time: 'レスポンスタイム',
    error_rate: 'エラー率',
  },
  ai: {
    processing_time: 'AI処理時間',
    api_calls: 'API呼び出し回数',
    cost: 'コスト',
  },
  business: {
    orders_created: '注文作成数',
    conversion_rate: 'コンバージョン率',
    average_order_value: '平均注文額',
  },
};
```

---

## デプロイメント戦略

### 環境構成

```
Development → Staging → Production
```

### CI/CD パイプライン

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main, staging]

jobs:
  test:
    - lint
    - unit tests
    - integration tests
    
  build:
    - build frontend
    - build backend
    
  deploy:
    - staging (auto)
    - production (manual approval)
```

### インフラ構成

**推奨構成**:
- **Frontend**: Vercel / Netlify
- **Backend**: AWS ECS / Google Cloud Run
- **Database**: Supabase / AWS RDS
- **Cache**: Redis Cloud / AWS ElastiCache
- **Storage**: Cloudflare R2 / AWS S3
- **CDN**: Cloudflare

---

## セキュリティチェックリスト

- [ ] HTTPS強制
- [ ] CORS設定
- [ ] レート制限実装
- [ ] 入力バリデーション
- [ ] SQLインジェクション対策
- [ ] XSS対策
- [ ] CSRF対策
- [ ] APIキー暗号化
- [ ] 環境変数管理
- [ ] 定期的な依存関係更新
- [ ] セキュリティヘッダー設定
- [ ] ログの適切な管理

---

**ドキュメントバージョン**: 1.0  
**作成日**: 2025-11-25
