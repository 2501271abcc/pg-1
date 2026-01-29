//データ保存用関数
function recordAdd() {
	// dom取得
	let petNameEl = document.getElementById("petName");
	let WalkingDistanceEl = document.getElementById("walkingDistance");
	let walkingTimeEl = document.getElementById("walkingTime");
	let memoEl = document.getElementById("memo");
	//保存
	let oneData =
	{
		name: petNameEl.value,
		distance: WalkingDistanceEl.value,
		time: walkingTimeEl.value,
		memo: memoEl.value
	};
	//すでにあるデータを読み込む
	let existing = JSON.parse(localStorage.getItem("Data") || "[]");

	//デバッグ用

	// console.log(
	// 	document.getElementById("petSelect"),
	// 	document.getElementById("walkingDistance"),
	// 	document.getElementById("walkingTime"),
	// 	document.getElementById("memo")
	// );


	//読み込んだデータに追加
	existing.push(oneData);
	localStorage.setItem("Data", JSON.stringify(existing));
	alert("保存されました")

	// フォームをクリア
	let formEl = document.getElementById("recordForm");
	if (formEl) formEl.reset();

	// ★ displayタブを「同じ名前」で開く → 既存タブに切り替わる
	var w = window.open("./display.html", "displayTab");
	if (w) w.focus();
}

//現在のパスの取得
let path = window.location.pathname;
//書き込み先の取得
let list = document.getElementById("recordList");

//リスト表示
function renderRecords() {

	let listContainer = document.getElementById("recordList");
	let countEl = document.getElementById("recordsNumber");
	if (!listContainer) return;


	// データ取得（JSON.parse して配列に）
	let records = JSON.parse(localStorage.getItem("Data") || "[]");
	//記録件数表示
	if (countEl) {
		countEl.textContent = "記録件数：" + records.length;
	}

	listContainer.innerHTML = "";

	if (!records.length) {
		listContainer.textContent = "記録はまだありません。";
		return;
	}

	let ul = document.createElement("ul");

	//配列の順番を逆にする（最後が先頭）
	records = records.slice().reverse();

	records.forEach(function (record, index) {
		let li = document.createElement("li");
		//条件演算子?を使用。空文字でないかチェック
		let nameText = record && record.name ? record.name : "-";
		let distanceText = record && record.distance ? record.distance : "-";
		let timeText = record && record.time ? record.time : "-";
		let memoText = record && record.memo ? record.memo : "-";

		//日時の変換
		let createdText = "";
		if (record && record.createdAt) {
			let d = new Date(record.createdAt);
			createdText = d.toLocaleString();
		}
		//書き込み
		let text = "ペット名: " + nameText +
			" / 距離: " + distanceText + "m" +
			" / 時間: " + timeText + "分" +
			" / メモ: " + memoText +
			(createdText ? " / 追加日時: " + createdText : "");

		// テキスト用span
		let span = document.createElement("span");
		span.textContent = text;

		// 削除ボタンを動的に追加
		let delBtn = document.createElement("button");
		delBtn.type = "button";
		delBtn.textContent = "削除";
		delBtn.className = "btn danger";

		//表示を逆順にしているためここも逆にする
		let originalIndex = (records.length - 1) - index;

		// クリックしたらこのindexを消す
		delBtn.addEventListener("click", function () {
			// 確認
			var ok = confirm("この記録を削除しますか？");
			if (!ok) return;

			deleteRecord(originalIndex);
		});

		// liに追加（横並びにしたいので span と button を入れる）
		li.appendChild(span);
		li.appendChild(delBtn);

		ul.appendChild(li);
	});

	listContainer.appendChild(ul);
}

// display.html が開かれたとき最初に1回描画
document.addEventListener("DOMContentLoaded", function () {
	// displayページだけで動かしたい場合
	if (window.location.pathname.endsWith("/display.html")) {
		renderRecords();
	}
});

// ★別タブから Data が更新されたら自動で再描画
window.addEventListener("storage", function (e) {
	if (e.key === "Data") {
		renderRecords();
	}
});

//削除用関数


function deleteRecord(originalIndex) {
	// いまの記録配列を取得
	let records = JSON.parse(localStorage.getItem("Data") || "[]");

	// 範囲外なら何もしない
	if (originalIndex < 0 || originalIndex >= records.length) return;

	// 1件削除
	records.splice(originalIndex, 1);

	// 保存し直し
	localStorage.setItem("Data", JSON.stringify(records));

	// 一覧を再描画
	renderRecords();
}
