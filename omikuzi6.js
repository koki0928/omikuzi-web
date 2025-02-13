const totalAmountInput = document.getElementById("totalAmount");
const participantNameInput = document.getElementById("participantName");
const addParticipantButton = document.getElementById("addParticipant");
const participantList = document.getElementById("participantList");
const drawButton = document.getElementById("drawButton");
const resetButton = document.getElementById("resetButton");
const resultSection = document.getElementById("resultSection");
const resultList = document.getElementById("resultList");
const howToUseButton = document.getElementById("howToUseButton");
const howToUseModal = document.getElementById("howToUseModal");
const closeButton = document.querySelector(".close");
const toggleDarkModeButton = document.getElementById("toggleDarkMode");
const punishmentModeCheckbox = document.getElementById("punishmentMode");
const punishmentSection = document.getElementById("punishmentSection");
const punishmentText = document.getElementById("punishmentText");
let participants = [];
const punishments = [
    "💛今日いるメンバー全員の好きなところを発表！",
    "🤳 インスタのストーリーに『最高に楽しい！』と投稿する",
    "💖 5秒間、照れた顔で『好き』と言い続ける（※相手は誰でもOK）",
    "🎭 ランダムな人に告白する（演技でもOK）",
    "📦 バッグの中身をみんなに見せて、1つエピソードを語る",
    "👃 目の前の人の頭をクンクンして、『いい匂い…』と小声で呟く",
    "💼 次の5分間、社長になりきって全員に指示を出す",
    "🚶‍♂️ スーパーモデルのように歩きながら飲み物を取りに行く（トイレに行くでも可）",
    "🤫1つ自分の秘密を話す！",
    "📅 次のイベントの幹事をすることを宣言する",
    "🗣️ 次の10分間、標準語禁止！方言で話す（出身の方言じゃなくてもいい）"
];

// 初回ロード時には非表示のまま
howToUseModal.style.display = "none";

// 使い方ボタンを押したら開く
howToUseButton.addEventListener("click", () => {
    howToUseModal.style.display = "flex";
});

// ×ボタンを押したら閉じる
closeButton.addEventListener("click", () => {
    howToUseModal.style.display = "none";
});

// モーダルの外をクリックしても閉じる
window.addEventListener("click", (event) => {
    if (event.target === howToUseModal) {
        howToUseModal.style.display = "none";
    }
});

// 参加者追加
function addParticipant() {
    const name = participantNameInput.value.trim();
    if (name && !participants.includes(name)) {
        participants.push(name);
        const li = document.createElement("li");
        li.textContent = name;
        participantList.appendChild(li);
        participantNameInput.value = "";
    }
}

// 参加者追加ボタンのイベント
addParticipantButton.addEventListener("click", addParticipant);

// Enterキーで参加者を追加するイベント
participantNameInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault(); // デフォルトの動作を防ぐ
        addParticipant();
    }
});

// 結果表示
function showResult(totalAmount) {
    const selectedMode = document.querySelector('input[name="mode"]:checked').value;
    resultList.innerHTML = "";
    document.body.classList.add("shake");
    setTimeout(() => document.body.classList.remove("shake"), 500);
    document.body.classList.add("flash");
    setTimeout(() => document.body.classList.remove("flash"), 300);


    let results = [];
    if (selectedMode === "split") {
        // 参加者をシャッフル
        const shuffledParticipants = shuffleArray(participants.slice());
        const amounts = generateRandomAmounts(totalAmount, participants.length);
        shuffledParticipants.forEach((name, index) => {
            results.push(`${name}: ${amounts[index]}円`);
        });
    } else {
        const chosenOne = participants[Math.floor(Math.random() * participants.length)];
        results.push(`${chosenOne} が ${totalAmount}円 全額支払い！`);
    }

    let index = 0;
    const revealInterval = setInterval(() => {
        if (index < results.length) {
            const li = document.createElement("li");
            li.textContent = results[index];
            resultList.appendChild(li);
            index++;
        } else {
            clearInterval(revealInterval);

            // 罰ゲームモードがONならランダムに罰ゲームを表示
            if (punishmentModeCheckbox.checked) {
                punishmentSection.classList.remove("hidden");
                punishmentText.textContent = punishments[Math.floor(Math.random() * punishments.length)];
            } else {
                punishmentSection.classList.add("hidden");
            }
        }
    }, 500);
}

// くじを引く
drawButton.addEventListener("click", () => {
    const totalAmount = parseInt(totalAmountInput.value, 10);
    if (!totalAmount || participants.length < 2) {
        alert("合計金額を入力し、2人以上の参加者を追加してください。");
        return;
    }

    resultList.innerHTML = ""; 
    resultSection.classList.remove("hidden");

    let countdown = 3;
    resultList.innerHTML = `<li style="font-size: 30px; font-weight: bold;">${countdown}...</li>`;

    // カウントダウン演出
    const countdownInterval = setInterval(() => {
        countdown--;
        resultList.innerHTML = `<li style="font-size: 30px; font-weight: bold;">${countdown}...</li>`;
        if (countdown === 0) {
            clearInterval(countdownInterval);
            showResult(totalAmount);
        }
    }, 1000);
});

// 金額をランダム分割 (100円単位)
function generateRandomAmounts(total, count) {
    let amounts = Array(count).fill(0);
    let remaining = total;

    for (let i = 0; i < count - 1; i++) {
        // 残りの合計から最大金額を決定 (100円単位)
        let max = Math.floor(remaining / (count - i) / 100) * 100; // 100円単位で最大金額を計算
        max = Math.max(100, max); // 最小金額は100円
        let amount = Math.floor(Math.random() * (max / 100)) * 100; // 100円単位の決定
        amounts[i] = amount;
        remaining -= amount;
    }
    amounts[count - 1] = remaining; // 残り全額を最後に追加
    return amounts;
}

// 配列をシャッフルする関数
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // swap
    }
    return array;
}

// リセットボタン
resetButton.addEventListener("click", () => {
    participants = [];
    participantList.innerHTML = "";
    resultList.innerHTML = "";
    resultSection.classList.add("hidden");
    punishmentSection.classList.add("hidden");
    totalAmountInput.value = "";
    participantNameInput.value = "";
});

// 白黒反転モード
toggleDarkModeButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});