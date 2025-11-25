# デモサイト デプロイオプション

## 現在の状態
- URL: https://8000-if5xo090npjfocgmy9gk1-c07dda5e.sandbox.novita.ai
- 外部アクセス: ✅ 可能
- 制限: サンドボックス環境（一時的）

## 永続的なデプロイオプション

### 1. GitHub Pages（最も簡単・無料）

**手順**:
```bash
# 1. GitHubリポジトリ設定で Pages を有効化
# Settings → Pages → Source: main branch → /demo folder

# 2. 自動的にデプロイされる
# URL: https://toyomitsu32.github.io/American-sign-studio/
```

**メリット**:
- 完全無料
- 自動デプロイ（git push で更新）
- カスタムドメイン対応
- SSL証明書自動

**制限**:
- 静的サイトのみ（このデモは問題なし）

---

### 2. Vercel（推奨・プロフェッショナル）

**手順**:
```bash
# 1. Vercel アカウント作成（無料）
# 2. GitHubリポジトリを接続
# 3. デプロイ設定:
#    Root Directory: demo
#    Build Command: （不要）
#    Output Directory: .

# 自動デプロイ完了
# URL: https://american-sign-studio.vercel.app
```

**メリット**:
- 超高速CDN
- 自動HTTPS
- カスタムドメイン無料
- プレビューデプロイ（PR毎）

---

### 3. Netlify（同じく優秀）

**手順**:
```bash
# 1. Netlify アカウント作成
# 2. "New site from Git" → GitHubリポジトリ選択
# 3. Base directory: demo
# 4. Publish directory: .

# URL: https://american-sign-studio.netlify.app
```

**メリット**:
- 無料プラン充実
- フォーム処理対応
- カスタムドメイン

---

### 4. Cloudflare Pages（最速）

**手順**:
```bash
# 1. Cloudflare アカウント
# 2. Pages → "Create a project"
# 3. GitHubリポジトリ接続
# 4. Build directory: demo

# URL: https://american-sign-studio.pages.dev
```

**メリット**:
- 世界最速CDN
- 無制限帯域幅
- DDoS保護

---

## 推奨デプロイ方法

**今すぐ試してもらう場合**:
→ 現在のURL（サンドボックス）をそのまま共有

**本格的に見せる場合**:
→ **Vercel** または **GitHub Pages**

### GitHub Pages の設定手順（3分）

1. https://github.com/toyomitsu32/American-sign-studio
2. Settings → Pages
3. Source: "Deploy from a branch"
4. Branch: main → /demo folder → Save
5. 数分待つ
6. URL が表示される

---

## カスタムドメイン（オプション）

独自ドメインを使いたい場合:
- www.american-sign-studio.com
- demo.yourcompany.com

設定方法:
1. ドメイン取得（年間$10〜20）
2. Vercel/Netlify でカスタムドメイン設定
3. DNS レコード更新
4. 完了（SSL自動）

---

## 現在のURLの有効期限

サンドボックスURL:
- 有効期限: セッション中
- 推奨: 今日中に試してもらう
- 恒久的には上記サービスへデプロイ
