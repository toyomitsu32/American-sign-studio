# AI標識デザインサービス - 設計書

## プロジェクト概要

### サービス名（仮）
**SignCraft AI - AI搭載アメリカ標識デザインサービス**

### コンセプト
ユーザーがテンプレートを選び、AIによる音声・テキスト入力で簡単にカスタマイズされた標識デザインを生成し、制作会社に直接依頼できるサービス

---

## 1. システム要件定義

### 1.1 目的
- ユーザーが簡単に標識をカスタマイズできる体験の提供
- AI技術を活用した直感的なデザイン変更
- 制作会社への効率的な注文フロー

### 1.2 ターゲットユーザー
- 小規模事業者（レストラン、小売店、オフィス等）
- イベント主催者
- 不動産管理会社
- 個人（住宅用標識）

### 1.3 主要機能
1. **テンプレート選択機能**
2. **AI音声入力によるカスタマイズ**
3. **テキスト編集機能**
4. **リアルタイムプレビュー**
5. **見積もり自動生成**
6. **注文送信機能**

---

## 2. ユーザージャーニー

### ステップ1: ホームページ
- サービス概要の表示
- 「デザインを始める」ボタン

### ステップ2: カテゴリー選択
標識の用途カテゴリーを選択
- 🚫 **安全・警告標識** (Safety & Warning)
- 🚗 **駐車場・交通標識** (Parking & Traffic)
- 🏢 **ビジネス・店舗標識** (Business & Storefront)
- ℹ️ **案内・情報標識** (Directional & Information)
- 🏠 **プライベート・住宅用** (Private Property)
- 🎨 **カスタム** (Custom Design)

### ステップ3: テンプレート選択
- カテゴリー内の人気テンプレート表示（6〜12個）
- 各テンプレートのサムネイル表示
- ホバーで詳細情報表示

### ステップ4: カスタマイズ
**左パネル: コントロール**
- 🎤 音声入力ボタン
- ✏️ テキスト直接編集
- 🎨 簡単なカラー選択（3〜5色程度）
- 📏 サイズ選択（Small/Medium/Large/Custom）
- 🖼️ 素材選択（アルミニウム、プラスチック、木製等）

**右パネル: プレビュー**
- リアルタイム3Dプレビュー
- 実際の設置イメージ（背景合成）

### ステップ5: 確認・見積もり
- デザイン最終確認
- 価格自動計算表示
- 製作期間表示
- 配送オプション

### ステップ6: 注文
- ユーザー情報入力（簡易）
- 配送先情報
- 注文確定
- 制作会社へ自動転送

---

## 3. 技術仕様

### 3.1 フロントエンド

#### 技術スタック
- **フレームワーク**: React 18 + TypeScript
- **スタイリング**: Tailwind CSS
- **3Dプレビュー**: Three.js / React Three Fiber
- **状態管理**: Zustand または React Context
- **音声入力**: Web Speech API (fallback: Google Speech-to-Text API)
- **ルーティング**: React Router v6

#### 主要コンポーネント構成
```
src/
├── components/
│   ├── home/
│   │   ├── Hero.tsx
│   │   └── HowItWorks.tsx
│   ├── category/
│   │   └── CategorySelector.tsx
│   ├── template/
│   │   ├── TemplateGrid.tsx
│   │   └── TemplateCard.tsx
│   ├── editor/
│   │   ├── EditorLayout.tsx
│   │   ├── ControlPanel.tsx
│   │   ├── VoiceInput.tsx
│   │   ├── TextEditor.tsx
│   │   ├── ColorPicker.tsx
│   │   └── PreviewPanel.tsx
│   ├── preview/
│   │   ├── Sign3DPreview.tsx
│   │   └── EnvironmentPreview.tsx
│   └── checkout/
│       ├── OrderSummary.tsx
│       └── CustomerForm.tsx
├── pages/
│   ├── HomePage.tsx
│   ├── CategoryPage.tsx
│   ├── TemplatePage.tsx
│   ├── EditorPage.tsx
│   └── CheckoutPage.tsx
├── hooks/
│   ├── useVoiceInput.ts
│   ├── useSignDesign.ts
│   └── useOrderCalculation.ts
└── utils/
    ├── aiProcessing.ts
    └── priceCalculator.ts
```

### 3.2 バックエンド

#### 技術スタック
- **フレームワーク**: Node.js + Express または Next.js API Routes
- **データベース**: PostgreSQL (Supabase推奨)
- **ファイルストレージ**: AWS S3 または Cloudflare R2
- **AI統合**: 
  - OpenAI GPT-4 API (デザイン提案・テキスト最適化)
  - Stability AI / DALL-E (カスタムグラフィック生成)
  - Google Cloud Speech-to-Text (音声認識)

#### API エンドポイント設計
```
GET    /api/categories              # カテゴリー一覧
GET    /api/templates/:categoryId   # テンプレート取得
POST   /api/ai/process-voice        # 音声処理
POST   /api/ai/generate-design      # AIデザイン生成
POST   /api/ai/optimize-text        # テキスト最適化
GET    /api/pricing/calculate       # 価格計算
POST   /api/orders                  # 注文作成
GET    /api/orders/:orderId         # 注文詳細
POST   /api/orders/:orderId/send    # 制作会社へ送信
```

### 3.3 データベース設計

#### テーブル構成

**categories（カテゴリー）**
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon_url VARCHAR(255),
  display_order INT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**templates（テンプレート）**
```sql
CREATE TABLE templates (
  id UUID PRIMARY KEY,
  category_id UUID REFERENCES categories(id),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  thumbnail_url VARCHAR(255),
  preview_3d_url VARCHAR(255),
  default_text JSONB,  -- {title: "", subtitle: "", etc}
  default_colors JSONB, -- {bg: "#fff", text: "#000", etc}
  base_price DECIMAL(10,2),
  is_popular BOOLEAN DEFAULT false,
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);
```

**orders（注文）**
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  template_id UUID REFERENCES templates(id),
  customer_name VARCHAR(100),
  customer_email VARCHAR(255),
  customer_phone VARCHAR(20),
  design_data JSONB,  -- 完全なデザイン設定
  preview_image_url VARCHAR(255),
  size VARCHAR(50),
  material VARCHAR(50),
  quantity INT DEFAULT 1,
  price DECIMAL(10,2),
  status VARCHAR(50), -- draft, submitted, in_production, shipped
  notes TEXT,
  shipping_address JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**ai_processing_logs（AI処理ログ）**
```sql
CREATE TABLE ai_processing_logs (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  processing_type VARCHAR(50), -- voice, design_gen, text_optimize
  input_data JSONB,
  output_data JSONB,
  processing_time_ms INT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 4. AI機能詳細

### 4.1 音声入力処理フロー

1. **音声キャプチャ**: Web Speech API で音声認識
2. **テキスト変換**: リアルタイムで文字起こし
3. **意図解析**: GPT-4で以下を判定
   - テキスト変更要求
   - 色変更要求
   - サイズ変更要求
   - その他のカスタマイズ要求
4. **デザイン適用**: 解析結果をデザインに反映

#### 音声コマンド例
```
✅ "タイトルをWelcomeに変更して"
✅ "背景色を青にして"
✅ "もっと大きいサイズにして"
✅ "テキストを太字にして"
✅ "営業時間9時から5時って追加して"
```

### 4.2 AIデザイン提案

ユーザーの業種・用途に基づいて：
- 最適な色の組み合わせ提案
- フォントの推奨
- レイアウトの最適化
- アメリカの標識規格準拠チェック

### 4.3 テキスト最適化

- スペルチェック
- 可読性向上の提案
- 標識として適切な表現への言い換え
- 文字数制限への対応提案

---

## 5. UI/UXデザインガイドライン

### 5.1 デザインシステム

#### カラーパレット
```
Primary:   #2563EB (Blue)
Secondary: #DC2626 (Red - Warning signs)
Success:   #16A34A (Green)
Warning:   #F59E0B (Orange)
Neutral:   #64748B (Gray)
Background: #F8FAFC (Light Gray)
```

#### タイポグラフィ
- **見出し**: Inter Bold
- **本文**: Inter Regular
- **標識プレビュー**: Highway Gothic (標準的な道路標識フォント)

### 5.2 レスポンシブデザイン
- **デスクトップ優先**: 主な操作はPC
- **タブレット対応**: エディター機能をタッチ最適化
- **モバイル**: 閲覧・注文確認のみ（編集は推奨しない）

### 5.3 アクセシビリティ
- WCAG 2.1 AA準拠
- キーボードナビゲーション対応
- スクリーンリーダー対応
- コントラスト比4.5:1以上

---

## 6. 開発フェーズ

### Phase 1: MVP (4〜6週間)
- [ ] 基本的なUI実装
- [ ] 3つのカテゴリー、各5テンプレート
- [ ] テキスト編集機能
- [ ] 基本的な2Dプレビュー
- [ ] 簡易注文フォーム
- [ ] メール通知機能

### Phase 2: AI統合 (3〜4週間)
- [ ] 音声入力機能
- [ ] GPT-4による意図解析
- [ ] AI デザイン提案
- [ ] テキスト最適化機能

### Phase 3: 高度な機能 (4〜6週間)
- [ ] 3Dプレビュー実装
- [ ] 実環境合成プレビュー
- [ ] 詳細なカスタマイズオプション
- [ ] ユーザーアカウント機能
- [ ] 注文履歴・再注文機能

### Phase 4: 制作会社統合 (2〜3週間)
- [ ] 制作会社向けダッシュボード
- [ ] 注文管理システム
- [ ] ステータス追跡
- [ ] 自動見積もりシステム

---

## 7. 技術的課題と解決策

### 7.1 課題: 音声認識の精度
**解決策**:
- Web Speech APIをプライマリに使用
- 認識結果をGPT-4でコンテキスト補正
- ユーザーが確認・修正できるUI

### 7.2 課題: 3Dプレビューのパフォーマンス
**解決策**:
- Three.jsの最適化
- テクスチャの遅延読み込み
- LOD (Level of Detail) の実装
- WebGLサポートチェックとフォールバック

### 7.3 課題: AIコストの管理
**解決策**:
- キャッシング戦略（同じ要求は再利用）
- バッチ処理で効率化
- 使用量モニタリング
- ティア制料金プラン検討

### 7.4 課題: リアルタイム性
**解決策**:
- デバウンス処理
- 楽観的UI更新
- WebSocket for リアルタイム通信
- プログレッシブレンダリング

---

## 8. セキュリティ考慮事項

### 8.1 データ保護
- HTTPS通信の強制
- 個人情報の暗号化保存
- GDPR/CCPA準拠
- 定期的なセキュリティ監査

### 8.2 入力バリデーション
- クライアント・サーバー双方でバリデーション
- SQLインジェクション対策
- XSS対策
- CSRF対策

### 8.3 APIセキュリティ
- レート制限
- APIキーのローテーション
- 認証・認可の実装
- ログモニタリング

---

## 9. ビジネスモデル

### 9.1 収益モデル
1. **取引手数料**: 各注文に対して制作費の10〜15%
2. **プレミアム機能**: AI高度機能への課金
3. **サブスクリプション**: 事業者向け月額プラン
4. **デザイナー連携**: カスタムデザイン依頼の仲介手数料

### 9.2 価格設定例
- **標準標識**: $50〜$200（サイズ・素材による）
- **カスタムデザイン**: $150〜$500
- **プレミアムAI機能**: $9.99/月
- **ビジネスプラン**: $49.99/月（無制限使用）

---

## 10. KPI・成功指標

### 10.1 ユーザーエンゲージメント
- デザインセッション完了率: >70%
- 平均セッション時間: 5〜10分
- 音声入力使用率: >40%
- テンプレート→注文変換率: >25%

### 10.2 ビジネス指標
- 月間注文数
- 平均注文単価
- 顧客獲得コスト (CAC)
- 顧客生涯価値 (LTV)
- リピート率: >30%

### 10.3 技術指標
- ページ読み込み時間: <2秒
- AI処理時間: <3秒
- システム稼働率: >99.5%
- エラー率: <1%

---

## 11. 競合分析

### 11.1 主要競合
1. **BuildASign.com**: 大手、AI機能なし
2. **Signs.com**: テンプレート豊富、音声入力なし
3. **Canva**: デザイン汎用、標識特化していない

### 11.2 差別化ポイント
- ✅ AI音声入力によるシンプルな操作
- ✅ 標識特化の最適化提案
- ✅ リアルタイム3Dプレビュー
- ✅ 制作会社直接統合

---

## 12. 次のステップ

### 即座に開始できること
1. **技術スタック選定の最終確認**
2. **ワイヤーフレーム作成**
3. **データベーススキーマの実装**
4. **テンプレートアセットの収集・作成**
5. **AI APIアカウントのセットアップ**

### 意思決定が必要な項目
1. **予算配分**: 開発・AI API・インフラ
2. **制作会社との連携方法**: API統合 vs メール通知
3. **初期テンプレート数**: 3カテゴリー×5 or 6カテゴリー×10
4. **ホスティング**: Vercel/Netlify vs AWS/GCP
5. **決済方法**: Stripe/Square/PayPal

---

## 13. リスク管理

### 高リスク項目
1. **AI コスト超過**: 使用量制限・監視の実装
2. **音声認識精度**: フォールバック手段の提供
3. **制作会社の受注キャパシティ**: 複数社との連携

### 中リスク項目
1. **3Dレンダリングパフォーマンス**: 最適化と代替案
2. **ユーザー学習曲線**: チュートリアル・ヘルプの充実

### 低リスク項目
1. **ブラウザ互換性**: 広くサポートされる技術の使用
2. **スケーラビリティ**: クラウドインフラの活用

---

## 14. 結論

このAI標識デザインサービスは、以下の特徴により市場で独自のポジションを確立できます：

✨ **シンプルさ**: 音声入力により誰でも簡単に操作
🎨 **ビジュアライゼーション**: 3Dプレビューで完成イメージを明確に
🤖 **AI活用**: デザイン提案とテキスト最適化で高品質
⚡ **効率性**: テンプレートから注文まで5分で完結

技術的には実現可能で、段階的な開発により早期のMVPリリースとフィードバック収集が可能です。

---

**ドキュメントバージョン**: 1.0  
**作成日**: 2025-11-25  
**次回レビュー予定**: 開発キックオフ時
