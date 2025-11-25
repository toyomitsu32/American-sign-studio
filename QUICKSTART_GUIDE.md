# クイックスタートガイド

> このガイドでは、SignCraft AI プロジェクトを即座に開始するための手順を説明します。

## 📋 事前準備チェックリスト

開発を開始する前に、以下の項目を確認・準備してください：

### ビジネス面

- [ ] **予算承認**: $360,000（開発費）+ 運用資金
- [ ] **ステークホルダー承認**: プロジェクト開始の合意
- [ ] **制作会社パートナー**: 最低1社との提携確保
- [ ] **法務確認**: 利用規約・プライバシーポリシーの準備
- [ ] **ドメイン取得**: 候補: signcraft.ai, designsign.ai 等

### 技術面

- [ ] **開発環境**: Mac/Linux/Windows（WSL2推奨）
- [ ] **Node.js**: v18.x 以上
- [ ] **Git**: バージョン管理
- [ ] **エディタ**: VS Code推奨
- [ ] **デザインツール**: Figma/Sketch（UI設計用）

### 外部サービスアカウント

- [ ] **GitHub**: リポジトリ管理
- [ ] **Vercel/Netlify**: フロントエンドホスティング
- [ ] **Supabase**: データベース（無料枠あり）
- [ ] **OpenAI**: API アカウント（GPT-4アクセス）
- [ ] **Google Cloud**: Speech-to-Text API
- [ ] **Cloudflare**: R2ストレージ・CDN
- [ ] **Stripe**: 決済処理

---

## 🚀 Week 1: プロジェクトセットアップ（Day 1-5）

### Day 1: 環境構築

#### 1. リポジトリ作成

```bash
# GitHubで新規リポジトリ作成後
git clone https://github.com/your-org/signcraft-ai.git
cd signcraft-ai

# プロジェクト構造作成
mkdir -p frontend backend database docs scripts
```

#### 2. フロントエンドセットアップ

```bash
cd frontend

# Next.js + TypeScript プロジェクト作成
npx create-next-app@latest . --typescript --tailwind --app --src-dir

# 必要なパッケージインストール
npm install zustand @tanstack/react-query axios
npm install three @react-three/fiber @react-three/drei
npm install framer-motion
npm install react-hook-form zod
npm install -D @types/three

# 開発用ツール
npm install -D eslint prettier husky lint-staged
```

#### 3. バックエンドセットアップ

```bash
cd ../backend

# Node.js プロジェクト初期化
npm init -y

# TypeScript設定
npm install -D typescript @types/node ts-node nodemon
npx tsc --init

# Express セットアップ
npm install express cors helmet dotenv
npm install -D @types/express @types/cors

# データベース
npm install pg @supabase/supabase-js
npm install -D @types/pg

# AI統合
npm install openai @google-cloud/speech
npm install ioredis
```

#### 4. 環境変数設定

**frontend/.env.local**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**backend/.env**
```env
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/signcraft
REDIS_URL=redis://localhost:6379
OPENAI_API_KEY=your-openai-key
GOOGLE_CLOUD_KEY=your-google-cloud-key
STRIPE_SECRET_KEY=your-stripe-key
CLOUDFLARE_R2_ACCESS_KEY=your-r2-key
```

---

### Day 2: データベースセットアップ

#### 1. Supabase プロジェクト作成

1. https://supabase.com でプロジェクト作成
2. SQL Editorで以下を実行：

```sql
-- カテゴリーテーブル
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon_url VARCHAR(255),
  display_order INT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- テンプレートテーブル
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  thumbnail_url VARCHAR(255),
  preview_3d_url VARCHAR(255),
  default_text JSONB DEFAULT '{}',
  default_colors JSONB DEFAULT '{}',
  base_price DECIMAL(10,2) NOT NULL,
  is_popular BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 注文テーブル
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  template_id UUID REFERENCES templates(id),
  customer_name VARCHAR(100),
  customer_email VARCHAR(255),
  customer_phone VARCHAR(20),
  design_data JSONB,
  preview_image_url VARCHAR(255),
  size VARCHAR(50),
  material VARCHAR(50),
  quantity INT DEFAULT 1,
  price DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'draft',
  notes TEXT,
  shipping_address JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- AI処理ログ
CREATE TABLE ai_processing_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  processing_type VARCHAR(50),
  input_data JSONB,
  output_data JSONB,
  processing_time_ms INT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- インデックス作成
CREATE INDEX idx_templates_category ON templates(category_id);
CREATE INDEX idx_templates_popular ON templates(is_popular) WHERE is_popular = true;
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_email ON orders(customer_email);
```

#### 2. シードデータ投入

```sql
-- カテゴリー
INSERT INTO categories (name, slug, description, display_order) VALUES
('Safety & Warning', 'safety-warning', 'Safety and warning signs', 1),
('Parking & Traffic', 'parking-traffic', 'Parking and traffic signs', 2),
('Business & Storefront', 'business-storefront', 'Business signs', 3),
('Directional & Information', 'directional-info', 'Directional signs', 4),
('Private Property', 'private-property', 'Private property signs', 5),
('Custom Design', 'custom', 'Custom sign designs', 6);

-- サンプルテンプレート（Safety & Warning カテゴリー）
INSERT INTO templates (category_id, name, description, base_price, is_popular, default_text, default_colors)
SELECT 
  id, 
  'Caution Sign',
  'Standard caution warning sign',
  79.00,
  true,
  '{"title": "CAUTION", "subtitle": "WATCH YOUR STEP"}'::jsonb,
  '{"background": "#FFD700", "text": "#000000", "border": "#000000"}'::jsonb
FROM categories WHERE slug = 'safety-warning';
```

---

### Day 3: 基本API実装

#### backend/src/index.ts

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import categoryRoutes from './routes/categories';
import templateRoutes from './routes/templates';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ミドルウェア
app.use(helmet());
app.use(cors());
app.use(express.json());

// ルート
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/templates', templateRoutes);

// ヘルスチェック
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

#### backend/src/routes/categories.ts

```typescript
import { Router } from 'express';
import { supabase } from '../config/database';

const router = Router();

// 全カテゴリー取得
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_order');

    if (error) throw error;

    res.json({ categories: data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

export default router;
```

---

### Day 4: フロントエンド基本実装

#### frontend/src/app/page.tsx

```typescript
export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">
            AI-Powered Sign Design
          </h1>
          <p className="text-xl mb-8">
            Create professional signs in minutes with voice control
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
            Start Designing →
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {/* Feature cards */}
          </div>
        </div>
      </section>
    </main>
  );
}
```

---

### Day 5: CI/CD セットアップ

#### .github/workflows/ci.yml

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd frontend && npm ci
      - run: cd frontend && npm run lint
      - run: cd frontend && npm run build

  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd backend && npm ci
      - run: cd backend && npm run lint
      - run: cd backend && npm test
```

---

## 📅 Week 2: コア機能開発開始

### 優先実装機能

#### 1. カテゴリー選択ページ
```bash
# 実装ファイル
frontend/src/app/categories/page.tsx
frontend/src/components/category/CategoryCard.tsx
```

#### 2. テンプレート選択ページ
```bash
frontend/src/app/templates/[categoryId]/page.tsx
frontend/src/components/template/TemplateGrid.tsx
frontend/src/components/template/TemplateCard.tsx
```

#### 3. API統合
```bash
frontend/src/services/api/categories.ts
frontend/src/services/api/templates.ts
```

---

## 🛠️ 開発ワークフロー

### 日次ルーチン

**Morning Stand-up (9:00 AM)**
- 昨日の進捗報告
- 今日のタスク確認
- ブロッカーの共有

**開発時間**
- コーディング
- レビュー
- テスト

**Evening Wrap-up (5:00 PM)**
- コミット・プッシュ
- PR作成
- 翌日の準備

### Git ワークフロー

```bash
# 機能開発開始
git checkout -b feature/category-selection

# 開発・コミット
git add .
git commit -m "feat: add category selection page"

# プッシュ・PR作成
git push origin feature/category-selection
```

### コミットメッセージ規約

```
feat: 新機能追加
fix: バグ修正
docs: ドキュメント更新
style: コードスタイル変更
refactor: リファクタリング
test: テスト追加・修正
chore: ビルド・補助ツール関連
```

---

## 📊 進捗管理

### プロジェクト管理ツール

**推奨**: Jira / Linear / GitHub Projects

### スプリント構成
- **期間**: 2週間
- **プランニング**: 月曜日午前
- **レトロスペクティブ**: 隔週金曜日
- **デモ**: 各Phase完了時

### タスク管理

```
□ TODO: 未着手
⏳ IN PROGRESS: 作業中
👀 REVIEW: レビュー待ち
✅ DONE: 完了
```

---

## 🧪 テスト戦略

### フロントエンド

```bash
# ユニットテスト
npm run test

# E2Eテスト
npm run test:e2e

# カバレッジ
npm run test:coverage
```

### バックエンド

```bash
# APIテスト
npm run test

# 統合テスト
npm run test:integration
```

---

## 📚 参考資料

### 公式ドキュメント
- [Next.js](https://nextjs.org/docs)
- [React](https://react.dev)
- [Three.js](https://threejs.org/docs)
- [OpenAI API](https://platform.openai.com/docs)
- [Supabase](https://supabase.com/docs)

### 社内ドキュメント
- [設計書](./DESIGN_SPECIFICATION.md)
- [技術仕様](./TECHNICAL_ARCHITECTURE.md)
- [ロードマップ](./IMPLEMENTATION_ROADMAP.md)
- [ユーザーフロー](./USER_FLOW.md)

---

## 🆘 トラブルシューティング

### よくある問題

#### 1. Node.js バージョン問題
```bash
# nvmでバージョン管理
nvm install 18
nvm use 18
```

#### 2. 依存関係の問題
```bash
# クリーンインストール
rm -rf node_modules package-lock.json
npm install
```

#### 3. データベース接続エラー
```bash
# 環境変数確認
echo $DATABASE_URL

# Supabase接続テスト
npm run db:test
```

#### 4. AI API エラー
- APIキーの有効性確認
- 使用量クォータ確認
- ネットワーク接続確認

---

## 📞 サポート

### チーム連絡先
- **PM**: pm@signcraft.ai
- **Tech Lead**: tech@signcraft.ai
- **Slack**: #signcraft-dev

### 緊急時
- **システム障害**: ops@signcraft.ai
- **セキュリティ**: security@signcraft.ai

---

## ✅ Week 1 完了チェックリスト

開発環境が正しくセットアップされたか確認：

- [ ] GitHubリポジトリ作成完了
- [ ] フロントエンド起動成功（`npm run dev`）
- [ ] バックエンド起動成功（`npm run dev`）
- [ ] データベース接続成功
- [ ] 環境変数設定完了
- [ ] CI/CD パイプライン動作確認
- [ ] チーム全員が開発環境構築完了
- [ ] 初回ミーティング実施
- [ ] Week 2 タスク割り当て完了

---

**準備完了！開発を始めましょう！🚀**

何か問題が発生した場合は、チームに相談してください。
