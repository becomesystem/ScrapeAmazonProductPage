let itemData = {};
let msg = {};

let timerPageLoad = 0;
let timerReadyCalc = 0;
let timerFinishCalc = 0;

let counterPageLoad = 0;
let counterReadyCalc =0;
let counterFinishCalc = 0;

msg.status = 'readyCalc';
chrome.runtime.sendMessage(
	// このスクリプトが立ち上がったことをbackgoundに伝える
	{msg: msg},

	// するとitemDataを戻してくるので、それを使って処理をすすめる
	response => {
		console.log('Start calculatorpage.js');
		console.log(response);

		itemData = response.itemData;

		// let asin = itemData.asin;
		// console.log(asin);
		// let price = itemData.price;

		// ASINと価格を入力し、計算させるためにタイマー処理を起動します。
		timerPageLoad = setInterval(waitPageLoad, 1000);
	}
);


function waitPageLoad() {
	console.log('called timerPageLoad:'+counterPageLoad);
	if (++counterPageLoad>60) {
    	console.log('時間切れでtimerPageLoad終了');
	    clearInterval(timerPageLoad);
	    return true;
	}

    // let elmForm        = document.querySelector('#ProductSearchInput');
    // let elmKatDropdown = document.querySelector('kat-dropdown[label="Amazonストア"]');
    let elmKatInput    = document.querySelector('kat-input[label="Amazonの商品を検索"]');

// 	if ( !elmForm ) {
//     	console.log("elmForm が見つかりません");
// 	    return false;
// 	}
// 	console.log(elmForm);

// 	if ( !elmKatDropdown ) {
//     	console.log("elmKatDropdown が見つかりません");
// 	    return false;
// 	}
// 	console.log(elmKatDropdown);

	if ( !elmKatInput ) {
    	console.log("elmKatInput が見つかりません");
	    return false;
	}
	console.log(elmKatInput);

	let shadowKatInput = elmKatInput.shadowRoot;
	if ( !shadowKatInput ) {
    	console.log("shadowKatInput が見つかりません");
	} else {
    	console.log("shadowKatInput が見つかった");
    	console.log(shadowKatInput);
    }

    let elmInput = shadowKatInput.querySelector('#katal-id-6');
	if ( !elmInput ) {
    	console.log("elmInput が見つかりません");
	} else {
    	console.log("elmInput が見つかった");
    	console.log(elmInput);
    }

	// ASIN入力
// 	elmInput.value = itemData.asin;
    elmInput.addEventListener('focus', () => {
        //処理内容
    	console.log("elmInput がフォーカスされたよ");
        // this.value = itemData.asin;
    });

    // タイマーをクリアする
    clearInterval(timerPageLoad);
	
    // １秒待って次の処理に進む
    setTimeout(clickInputArea, 1000);

	return true;
}


// KatInput領域をクリックする
// クリックイベントを発火するため
function clickInputArea() {
	console.log("clickInputArea 開始");

    let elmKatInput    = document.querySelector('kat-input[label="Amazonの商品を検索"]');
	let shadowKatInput = elmKatInput.shadowRoot;
    let elmInput = shadowKatInput.querySelector('#katal-id-6');
	console.log("elmInput が見つかった2");

    // elmInput.click();
    // elmInput.value = itemData.asin;
	elmInput.focus();

    // １秒待って次の処理に進む
    setTimeout(clickButton, 1000);

	return true;
}


function clickButton() {
	console.log("clickButton 開始");


    let elmKatInput    = document.querySelector('kat-input[label="Amazonの商品を検索"]');
	let shadowKatInput = elmKatInput.shadowRoot;
    let elmInput = shadowKatInput.querySelector('#katal-id-6');
    document.dispatchEvent( new KeyboardEvent( "keyuo", { keyCode: 66 }));
    elmInput.dispatchEvent( new KeyboardEvent( "keydown", { keyCode: 65 }));

	console.log("hogehoge");

    //////////////////
    // ボタン処理
    //////////////////
    let elmKatButton   = document.querySelector('kat-button[label="検索"]');
	if ( !elmKatButton ) {
    	console.log("elmKatButton が見つかりません");
	    return false;
	}
	console.log(elmKatButton);

	let shadowKatButton = elmKatButton.shadowRoot;
	if ( !shadowKatButton ) {
    	console.log("shadowKatButton が見つかりません");
	} else {
    	console.log("shadowKatButton が見つかった");
    	console.log(shadowKatButton);
    }

    let elmButton = shadowKatButton.querySelector('button');
	if ( !elmButton ) {
    	console.log("elmButton が見つかりません");
	} else {
    	console.log("elmButton が見つかった");
    	console.log(elmButton);
    }

    // 検索ボタンをクリックする
// 	elmButton.click();


    // // タイマーをクリアする
    // clearInterval(timerPageLoad);
	
    // // １秒待って次の処理に進む
    // setTimeout(waitAndClickInputArea, 1000);

	return true;
}

// KatInput領域をクリックする
// 子Shadow要素を実体化できるかもしれないから
function waitAndClickInputArea() {
	console.log("waitAndClickInputArea 開始");

    let elmKatInput    = document.querySelector('kat-input[label="Amazonの商品を検索"]');

    // 検索ボタンをクリックする
// 	let searchForm = document.getElementById('search-form');
// 	searchForm.getElementsByClassName('a-button-input')[0].click();
	elmKatInput.click();

    // １秒待って次の処理に進む
    setTimeout(checkShadowElement, 1000);

	return true;
}

// KatInput領域をクリックされた後、
// 子Shadow要素の取得を試す
function checkShadowElement() {
    console.log("checkShadowElement 開始");

    let elmKatInput    = document.querySelector('kat-input[label="Amazonの商品を検索"]');
	console.log(elmKatInput);

    let elmKatLabel1   = document.querySelector('[part="input-label"]');
	if ( !elmKatLabel1 ) {
    	console.log("elmKatLabel1 が見つかりません");
	} else {
    	console.log("elmKatLabel1 が見つかった");
    	console.log(elmKatLabel1);
	}

    // 次の処理をすすめる
}


function waitDummy() {

	if (targetDropDown.textContent.indexOf('ASINまたはキーワード') < 0 ) return false;
	if (whiteOverlay.style.opacity < 0.9 ) return false;

	// ASIN入力
	document.getElementById('search-string').value = itemData.asin;

    // 1秒待って検索ボタンをクリックする
    setTimeout(waitClick, 1000);

	return true;
}

function waitClick() {

	let searchForm = document.getElementById('search-form');

    // 検索ボタンをクリックする
	searchForm.getElementsByClassName('a-button-input')[0].click();

    // 検索ボタンを押下
	timerReadyCalc = setInterval(waitReadyCalc, 1000);

	return true;
}

function waitReadyCalc(){
	console.log('called timerReadyCalc:' + counterReadyCalc);
	if (++counterReadyCalc>60) {
    	console.log('時間切れでtimerReadyCalc終了');
	    clearInterval(timerReadyCalc);
	    return true;
	}

	let inputPrice = document.getElementById('afn-pricing');
	let buttonCalc = document.getElementById('update-fees-link-announce');
	if (!inputPrice || !buttonCalc) return false;
	if (buttonCalc.textContent.indexOf('計算') < 0 ) return false;

    clearInterval(timerReadyCalc);

    //価格を入力して計算ボタンをクリック
    inputPrice.value = itemData.price;
	buttonCalc.click();

	//計算終了を待つタイマーを起動
	timerFinishCalc = setInterval(waitFinishCalc, 1000);

    clearInterval(timerReadyCalc);
	return true;
}

function waitFinishCalc() {
	console.log('called timerFinishCalc:' + counterFinishCalc);
	if (++counterFinishCalc>60) {
    	console.log('時間切れでtimerFinishCalc終了');
        clearInterval(timerFinishCalc);
        return true;
	}
	let sellingFees = document.getElementById('afn-selling-fees');
	let fulfillFees = document.getElementById('afn-amazon-fulfillment-fees');
	let proceeds    = document.getElementById('afn-seller-proceeds');

	// Wait条件を確認
	if (!sellingFees || !fulfillFees || !proceeds) return false;
	if ( sellingFees.textContent.length <= 0 ) return false;
	if ( fulfillFees.textContent.length <= 0 ) return false;
	if ( proceeds.value.length <= 0 ) return false;

	// background.js に計算結果を通知
	msg.sellingFees = sellingFees.textContent;
	msg.fulfillFees = fulfillFees.textContent;
	msg.proceeds    = proceeds.value;
	msg.status      = 'finishCalc';
	chrome.runtime.sendMessage({msg: msg});

    clearInterval(timerFinishCalc);
	return true;
}







function fillPrice(price) {
	if (price) {
		// if (document.getElementById('afn-fees-price')) {
		// 	document.getElementById('afn-fees-price').value = price;
		// }
		if (document.getElementById('afn-pricing')) {
			document.getElementById('afn-pricing').value = price;
		}
		// if (document.getElementsByClassName('a-input-text revenue pricing').length > 0) {
		// 	document.getElementsByClassName('a-input-text revenue pricing')[0].value = price;
		// }
		document.getElementById('update-fees-link').click();
	}

}
