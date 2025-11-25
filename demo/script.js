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
        userInput.focus();
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
        // Determine which preset to use based on input
        let presetKey = 'parking_no'; // default

        if (input.includes('ビンテージ') || input.includes('ガレージ') || input.includes('ルート66') || input.includes('レトロ')) {
            presetKey = 'vintage_garage';
        } else if (input.includes('倉庫') || input.includes('安全') || input.includes('フォークリフト') || input.includes('警告')) {
            presetKey = 'warehouse_safety';
        } else if (input.includes('駐車') || input.includes('パーキング')) {
            presetKey = 'parking_no';
        }

        currentDesign = designPresets[presetKey];
        displayDesign(currentDesign);

        // Hide loading, show result
        loading.classList.add('hidden');
        resultSection.classList.remove('hidden');

        // Scroll to result
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 2000);
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
