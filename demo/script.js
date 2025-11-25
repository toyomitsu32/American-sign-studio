// デモデータ: 実際のAI生成の代わりにプリセットデザインを使用
const designPresets = {
    'vintage_garage': {
        preview: {
            html: `
                <span class="emoji-large">🏍️</span>
                <span class="title">ROUTE 66</span>
                <span class="subtitle">CLASSIC CAR GARAGE</span>
                <br>
                <span class="body-text">Quality Service</span>
                <span class="body-text">Since 1952</span>
                <br>
                <span class="stars">★ ★ ★</span>
                <span class="body-text emphasis">AMERICAN PRIDE</span>
            `,
            className: 'sign-vintage'
        },
        specs: {
            'サイズ': '24" × 30"',
            'スタイル': 'ヴィンテージ・ルート66',
            'カラー': 'レッド・ホワイト・ブルー（星条旗カラー）',
            'フォント': 'Futura Bold Condensed',
            'エフェクト': 'ヴィンテージ加工（錆・色褪せ）',
            '素材': '木製ベース推奨',
            'アイコン': 'クラシックカー、ルート66シールド'
        },
        reasoning: '「ビンテージ」「ルート66」というキーワードから、1950年代のアメリカンレトロスタイルを採用しました。Highway Gothicの代わりに、当時人気のあったFutura Boldを使用。星条旗カラー（レッド・ホワイト・ブルー）でアメリカらしさを演出。ヴィンテージ加工により、本物のアンティーク標識のような風合いを表現しています。'
    },
    'warehouse_safety': {
        preview: {
            html: `
                <span class="title">⚠️ CAUTION</span>
                <br>
                <span class="subtitle">FORKLIFT TRAFFIC</span>
                <br>
                <span class="emoji-large">🚜</span>
                <br>
                <span class="body-text emphasis">WATCH FOR</span>
                <span class="body-text emphasis">MOVING EQUIPMENT</span>
                <br>
                <span class="body-text">STAY ALERT</span>
            `,
            className: 'sign-warning'
        },
        specs: {
            'サイズ': '24" × 36"（大型）',
            'スタイル': 'インダストリアル・安全標識',
            'カラー': 'イエロー背景 × ブラック文字',
            'フォント': 'Highway Gothic Series E（極太）',
            'エフェクト': 'なし（視認性優先）',
            '素材': '反射アルミニウム（夜間対応）',
            'アイコン': 'フォークリフトシルエット、警告三角'
        },
        reasoning: '「倉庫」「フォークリフト」「目立つ」というキーワードから、OSHA（米国労働安全衛生局）準拠の警告標識スタイルを採用。イエロー×ブラックはMUTCD規格で最も視認性が高い警告色です。大きめのサイズと極太フォントで遠くからでも認識可能。反射材により夜間の安全性も確保しています。'
    },
    'parking_no': {
        preview: {
            html: `
                <span class="title">🚫 NO PARKING</span>
                <span class="subtitle">PRIVATE PROPERTY</span>
                <br>
                <span class="body-text">Unauthorized vehicles</span>
                <span class="body-text">will be <span class="emphasis">TOWED</span></span>
                <span class="body-text">at owner's expense</span>
                <br>
                <span class="small-text">Violators will be</span>
                <span class="small-text">prosecuted</span>
            `,
            className: 'sign-parking'
        },
        specs: {
            'サイズ': '18" × 24"',
            'スタイル': 'プライベート駐車場標識',
            'カラー': 'イエロー背景 × ブラック文字',
            'フォント': 'Highway Gothic Series E（太字）',
            'エフェクト': 'なし（明確性優先）',
            '素材': '反射アルミニウム',
            'アイコン': '🚫 禁止マーク（MUTCD準拠）'
        },
        reasoning: '「怖い感じ」「レッカー移動」というキーワードから、威圧的で明確なメッセージを重視。アメリカの駐車場標識で標準的な "will be TOWED" "at owner\'s expense" といった法的効力のある文言を使用。イエロー×ブラックの警告色で注意を引き、無断駐車を抑止します。'
    }
};

// グローバル変数
let currentDesign = null;

// DOM要素
const userInput = document.getElementById('userInput');
const generateBtn = document.getElementById('generateBtn');
const regenerateBtn = document.getElementById('regenerateBtn');
const loading = document.getElementById('loading');
const resultSection = document.getElementById('resultSection');
const signPreview = document.getElementById('signPreview');
const specs = document.getElementById('specs');
const reasoning = document.getElementById('reasoning');

// Example buttons
const exampleButtons = document.querySelectorAll('.example-btn');
exampleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const example = btn.getAttribute('data-example');
        userInput.value = example;
        // テキストエリアにフォーカスして、編集しやすいようにカーソルを最後に移動
        userInput.focus();
        // カーソルをテキストの最後に移動
        userInput.setSelectionRange(userInput.value.length, userInput.value.length);
        // 編集可能であることを視覚的に示すためにスクロール
        userInput.scrollTop = userInput.scrollHeight;
    });
});

// Generate button
generateBtn.addEventListener('click', generateDesign);

// Regenerate button
regenerateBtn.addEventListener('click', generateDesign);

// Enter key to generate
userInput.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        generateDesign();
    }
});

// Main function
function generateDesign() {
    const input = userInput.value.trim();
    
    if (!input) {
        alert('標識の内容を入力してください');
        return;
    }

    // Hide result, show loading
    resultSection.classList.add('hidden');
    loading.classList.remove('hidden');

    // Scroll to loading
    loading.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Simulate AI processing (2 seconds)
    setTimeout(() => {
        // ユーザー入力を解析して動的にデザインを生成
        currentDesign = analyzeInputAndGenerateDesign(input);
        displayDesign(currentDesign);

        // Hide loading, show result
        loading.classList.add('hidden');
        resultSection.classList.remove('hidden');

        // Scroll to result
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 2000);
}

// ユーザー入力を解析してデザインを動的生成
function analyzeInputAndGenerateDesign(input) {
    const lowerInput = input.toLowerCase();
    
    // キーワード検出
    const keywords = {
        vintage: /ビンテージ|レトロ|ルート66|アンティーク|昔ながら|クラシック/i,
        warning: /警告|注意|危険|安全|フォークリフト|倉庫|作業場/i,
        parking: /駐車|パーキング|車/i,
        noParking: /駐車禁止|駐車不可|パーキング禁止/i,
        shop: /店|ショップ|カフェ|レストラン|バー|ガレージ|美容院|理髪店/i,
        welcome: /ようこそ|歓迎|welcome/i,
        open: /営業中|オープン|open/i,
        closed: /閉店|クローズ|closed/i,
        private: /私有地|プライベート|関係者以外|private/i,
        towing: /レッカー|牽引|tow/i,
        scary: /怖い|威圧|厳しい/i
    };

    // スタイル判定
    let signStyle = 'sign-parking'; // デフォルト
    let colorScheme = { bg: '#FCD34D', text: '#000', border: '#000' };
    let signType = 'standard';

    if (keywords.vintage.test(input)) {
        signStyle = 'sign-vintage';
        signType = 'vintage';
        colorScheme = { bg: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 50%, #991B1B 100%)', text: '#FEF3C7', border: '#FEF3C7' };
    } else if (keywords.warning.test(input)) {
        signStyle = 'sign-warning';
        signType = 'warning';
        colorScheme = { bg: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)', text: '#000', border: '#000' };
    } else if (keywords.noParking.test(input) || (keywords.parking.test(input) && input.includes('禁止'))) {
        signStyle = 'sign-parking';
        signType = 'no-parking';
        colorScheme = { bg: 'linear-gradient(180deg, #FCD34D 0%, #FDE68A 100%)', text: '#000', border: '#000' };
    }

    // テキスト内容を生成
    const content = generateSignContent(input, signType, keywords);
    
    // 仕様を生成
    const specs = generateSpecs(input, signType);
    
    // 理由を生成
    const reasoning = generateReasoning(input, signType);

    return {
        preview: {
            html: content,
            className: signStyle
        },
        specs: specs,
        reasoning: reasoning
    };
}

// 標識のコンテンツHTML生成
function generateSignContent(input, signType, keywords) {
    let html = '';
    
    if (signType === 'vintage') {
        // ビンテージスタイル
        const emoji = keywords.shop.test(input) && input.includes('ガレージ') ? '🏍️' : 
                     input.includes('カフェ') ? '☕' :
                     input.includes('バー') ? '🍺' : '🚗';
        
        const mainText = extractMainText(input) || 'ROUTE 66';
        const subtitle = input.includes('ガレージ') ? 'CLASSIC CAR GARAGE' :
                        input.includes('カフェ') ? 'COFFEE SHOP' :
                        input.includes('バー') ? 'BAR & GRILL' : 'GARAGE';
        
        html = `
            <span class="emoji-large">${emoji}</span>
            <span class="title">${mainText.toUpperCase()}</span>
            <span class="subtitle">${subtitle}</span>
            <br>
            <span class="body-text">Quality Service</span>
            <span class="body-text">Since 1952</span>
            <br>
            <span class="stars">★ ★ ★</span>
            <span class="body-text emphasis">AMERICAN PRIDE</span>
        `;
    } else if (signType === 'warning') {
        // 警告スタイル
        const warningType = input.includes('フォークリフト') ? 'FORKLIFT TRAFFIC' :
                           input.includes('倉庫') ? 'WAREHOUSE AREA' :
                           input.includes('作業') ? 'WORK ZONE' : 'CAUTION AREA';
        
        const emoji = input.includes('フォークリフト') ? '🚜' : '⚠️';
        
        html = `
            <span class="title">⚠️ CAUTION</span>
            <br>
            <span class="subtitle">${warningType}</span>
            <br>
            <span class="emoji-large">${emoji}</span>
            <br>
            <span class="body-text emphasis">WATCH FOR</span>
            <span class="body-text emphasis">MOVING EQUIPMENT</span>
            <br>
            <span class="body-text">STAY ALERT</span>
        `;
    } else {
        // 駐車禁止スタイル
        const location = input.includes('私有地') || input.includes('プライベート') ? 'PRIVATE PROPERTY' : 
                        input.includes('ガレージ') ? 'GARAGE ENTRANCE' : 'PRIVATE PROPERTY';
        
        const towingText = keywords.towing.test(input) || keywords.scary.test(input) ? 
            'will be <span class="emphasis">TOWED</span>' : 
            'will be <span class="emphasis">CITED</span>';
        
        html = `
            <span class="title">🚫 NO PARKING</span>
            <span class="subtitle">${location}</span>
            <br>
            <span class="body-text">Unauthorized vehicles</span>
            <span class="body-text">${towingText}</span>
            <span class="body-text">at owner's expense</span>
            <br>
            <span class="small-text">Violators will be</span>
            <span class="small-text">prosecuted</span>
        `;
    }
    
    return html;
}

// メインテキストを抽出（ビンテージ用）
function extractMainText(input) {
    // 店名や場所名を抽出する簡易ロジック
    if (input.includes('ルート66')) return 'ROUTE 66';
    if (input.includes('ガレージ')) return 'GARAGE';
    if (input.includes('カフェ')) return 'CAFE';
    if (input.includes('バー')) return 'BAR';
    return null;
}

// 仕様を生成
function generateSpecs(input, signType) {
    const specs = {};
    
    if (signType === 'vintage') {
        specs['サイズ'] = '24" × 30"';
        specs['スタイル'] = 'ヴィンテージ・ルート66';
        specs['カラー'] = 'レッド・ホワイト・ブルー（星条旗カラー）';
        specs['フォント'] = 'Futura Bold Condensed';
        specs['エフェクト'] = 'ヴィンテージ加工（錆・色褪せ）';
        specs['素材'] = '木製ベース推奨';
        specs['アイコン'] = input.includes('ガレージ') ? 'クラシックカー、ルート66シールド' : 'レトロアイコン';
    } else if (signType === 'warning') {
        specs['サイズ'] = '24" × 36"（大型）';
        specs['スタイル'] = 'インダストリアル・安全標識';
        specs['カラー'] = 'イエロー背景 × ブラック文字';
        specs['フォント'] = 'Highway Gothic Series E（極太）';
        specs['エフェクト'] = 'なし（視認性優先）';
        specs['素材'] = '反射アルミニウム（夜間対応）';
        specs['アイコン'] = input.includes('フォークリフト') ? 'フォークリフトシルエット、警告三角' : '警告三角';
    } else {
        specs['サイズ'] = '18" × 24"';
        specs['スタイル'] = 'プライベート駐車場標識';
        specs['カラー'] = 'イエロー背景 × ブラック文字';
        specs['フォント'] = 'Highway Gothic Series E（太字）';
        specs['エフェクト'] = 'なし（明確性優先）';
        specs['素材'] = '反射アルミニウム';
        specs['アイコン'] = '🚫 禁止マーク（MUTCD準拠）';
    }
    
    return specs;
}

// 理由を生成
function generateReasoning(input, signType) {
    let reasoning = '';
    
    if (signType === 'vintage') {
        reasoning = `「ビンテージ」「ルート66」というキーワードから、1950年代のアメリカンレトロスタイルを採用しました。Highway Gothicの代わりに、当時人気のあったFutura Boldを使用。星条旗カラー（レッド・ホワイト・ブルー）でアメリカらしさを演出。ヴィンテージ加工により、本物のアンティーク標識のような風合いを表現しています。`;
    } else if (signType === 'warning') {
        reasoning = `「${input.includes('倉庫') ? '倉庫' : '警告'}」「${input.includes('フォークリフト') ? 'フォークリフト' : '注意'}」というキーワードから、OSHA（米国労働安全衛生局）準拠の警告標識スタイルを採用。イエロー×ブラックはMUTCD規格で最も視認性が高い警告色です。大きめのサイズと極太フォントで遠くからでも認識可能。反射材により夜間の安全性も確保しています。`;
    } else {
        const towingMention = input.includes('レッカー') || input.includes('怖い') ? '「レッカー移動」「威圧的」' : '「駐車禁止」';
        reasoning = `${towingMention}というキーワードから、明確で法的効力のあるメッセージを重視。アメリカの駐車場標識で標準的な "will be TOWED" "at owner's expense" といった文言を使用。イエロー×ブラックの警告色で注意を引き、無断駐車を抑止します。`;
    }
    
    return reasoning;
}

function displayDesign(design) {
    // Display preview with sign-board wrapper
    signPreview.innerHTML = `<div class="sign-board">${design.preview.html}</div>`;
    signPreview.className = 'sign-preview ' + design.preview.className;

    // Display specs
    specs.innerHTML = '';
    for (const [label, value] of Object.entries(design.specs)) {
        const specItem = document.createElement('div');
        specItem.className = 'spec-item';
        specItem.innerHTML = `
            <span class="spec-label">${label}:</span>
            <span class="spec-value">${value}</span>
        `;
        specs.appendChild(specItem);
    }

    // Display reasoning
    reasoning.innerHTML = `<p>${design.reasoning}</p>`;
}

// Add some animation on load
document.addEventListener('DOMContentLoaded', () => {
    userInput.focus();
});
