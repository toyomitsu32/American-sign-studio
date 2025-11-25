# American Sign Studio - デモサイト

## 概要

自然言語でアメリカン標識デザインを生成するサービスのデモサイトです。

## 起動方法

### シンプルな起動（Python）

```bash
cd demo
python3 -m http.server 8000
```

ブラウザで http://localhost:8000 を開く

### Node.jsを使う場合

```bash
cd demo
npx serve .
```

## デモの特徴

### 3つのプリセットデザイン

1. **ビンテージガレージ標識**
   - ルート66スタイル
   - 1950年代レトロ
   - 星条旗カラー

2. **倉庫安全標識**
   - OSHA準拠
   - イエロー×ブラック警告色
   - フォークリフト注意喚起

3. **駐車場標識**
   - プライベートプロパティ
   - レッカー移動警告
   - 威圧的メッセージ

### 入力キーワード

デモは入力内容に応じて自動的に適切なデザインを選択します：

- 「ビンテージ」「ガレージ」「ルート66」→ ビンテージデザイン
- 「倉庫」「安全」「フォークリフト」→ 安全標識
- 「駐車」「パーキング」→ 駐車場標識

## 技術スタック

- **フロントエンド**: Pure HTML/CSS/JavaScript
- **スタイリング**: カスタムCSS（グラデーション、アニメーション）
- **AI統合**: デモ版（プリセットデータ）

## 本番環境での実装

本番では以下のAPI統合が必要：

```javascript
// OpenAI GPT-4でデザイン生成
const response = await fetch('/api/generate-design', {
    method: 'POST',
    body: JSON.stringify({
        userInput: input,
        style: 'american'
    })
});
```

## ファイル構成

```
demo/
├── index.html      # メインHTML
├── style.css       # スタイル
├── script.js       # ロジック
└── README.md       # このファイル
```

## カスタマイズ

新しいデザインプリセットを追加するには、`script.js`の`designPresets`オブジェクトに追加：

```javascript
const designPresets = {
    'your_new_design': {
        preview: {
            text: 'YOUR TEXT HERE',
            className: 'sign-custom'
        },
        specs: {
            'サイズ': '18" × 24"',
            // ... other specs
        },
        reasoning: 'デザインの理由...'
    }
};
```

## ブラウザ対応

- Chrome/Edge: ✅ 完全対応
- Firefox: ✅ 完全対応
- Safari: ✅ 完全対応
- IE11: ❌ 非対応

## ライセンス

デモサイト - 提案用途
