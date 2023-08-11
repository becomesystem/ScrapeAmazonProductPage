let itemData = {};
let msg = {};

let timerPageLoad = 0;
let timerPageSearchResult = 0;
let timerReadyCalc = 0;

let counterPageLoad = 0;
let counterReadyCalc =0;

msg.status = 'ready';
chrome.runtime.sendMessage(
	// このスクリプトが立ち上がったことをbackgoundに伝える
	{msg: msg},

	// するとitemDataを戻してくるので、それを使って処理をすすめる
	response => {
		console.log('Start getJAN.js');

// 		itemData = response.itemData;

		// スクレイピングのためのタイマー処理を起動します。
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

    //
    // 必要な値を持つノードが存在するか確認
    //
    let kLabelEAN = document.querySelector('#reconciled_banner kat-label[emphasis="EAN:"]');
    let kLabelUPC = document.querySelector('#reconciled_banner kat-label[emphasis="UPC:"]');
	if ( !kLabelEAN && !kLabelUPC ) return false;
	console.log('exist JAN');

    let kLabelRank = document.querySelector('#reconcile-sales-rank');
	if ( !kLabelRank ) return false;
	console.log('exist RANK');
	
    let kLabelOffer = document.querySelector('#reconciled-other-offer-details div.condition-type-competing-offer');
	if ( !kLabelOffer ) return false;
	console.log('exist Offer');
	let textOffer = kLabelOffer.textContent;
	if ( textOffer.indexOf('新品') < 0) return false;
	console.log('exist Offer新品');
	
    //
    // それぞれの値を取得
    //
	let jan = '';
	if ( kLabelEAN ) {
	    jan = kLabelEAN.getAttribute('text');
	}
	else {
	    jan = kLabelUPC.getAttribute('text');
	}
	console.log(jan);

	let rank = kLabelRank.getAttribute('text');
	console.log(rank);
	
	let offer = textOffer.substring(0,textOffer.indexOf('新品')-1);
	console.log(offer);

    //
    // background.js に取得した情報を送る
    //
	msg.status = 'finish';
	msg.jan    = jan;
	msg.rank   = rank;
	msg.offer  = offer;
	chrome.runtime.sendMessage({msg: msg});
	clearInterval(timerPageLoad);
	return true;
}


// ダミー
function waitPageLoadXXXX() {
// 	let jan = '';
	let rank = 0;
// 	let offer = 0;

	let sJan = false;
	let sRank = false;
	let sOffer = false;


	for (var i=0; i<targetP.length; i++) {
		let p = targetP[i];
		let t = p.textContent;
		console.log(t);

		if( t.indexOf('JAN')>=0 || t.indexOf('EAN')>=0) {
			sJan = true;
			jan = t.replace(/[^0-9]/g, '');
		}
		else if (t.indexOf('売上ランキング')>=0) {
			sRank = true;
			rank = t.replace(/[^0-9]/g, '');
		}
		else if (t.indexOf('オファー')>=0) {
			sOffer = true;
			offer = t.replace(/[^0-9]/g, '');
		}
	}

	if ( (  sJan && jan   ||   !sJan && !jan  ) &&
	     ( sRank && rank  ||  !sRank && !rank ) &&
	     (sOffer && offer || !sOffer && !offer) ) {
		// background.js に計算結果を通知
		msg.status = 'finish';
		msg.jan    = jan;
		msg.rank   = rank;
		msg.offer  = offer;
		chrome.runtime.sendMessage({msg: msg});
	    clearInterval(timerPageSearchResult);
		return true;
	}
	return false;



}

function waitPageLoadOld() {
	console.log('called timerPageLoad:'+counterPageLoad);
	if (++counterPageLoad>60) {
    	console.log('時間切れでtimerPageLoad終了');
	    clearInterval(timerPageLoad);
	    return true;
	}
	
	// ASIN検索用のテキストボックスとボタンが存在することを確認する
	let searchInputContent = document.getElementById('SearchInputContent');
	if ( !searchInputContent ) return false;
    // console.log('発見：SearchInputContent');
	
	let searchInputGroup = searchInputContent.getElementsByClassName('search-input-group');
	if ( !searchInputGroup || !searchInputGroup[0]) return false;
	console.log('発見：searchInputGroup[0]');

    // kat-input
	let katInput = searchInputGroup[0].getElementsByTagName('kat-input');
	if ( !katInput || !katInput[0]) return false;
	console.log('発見：katInput[0]');

    // ShadowRoot
//     let shadow = katInput[0].shadowRoot;
// 	if ( !shadow ) return false;
// 	console.log('発見：shadowRoot');

    // spanContainer
//     let spanContainer = katInput[0].childNodes;
// 	if ( !spanContainer || !spanContainer[0]) return false;
// 	console.log('発見：spanContainer[0]');

    // デバッグ用コード
    let children = katInput[0].childNodes;
	if ( !children ) return false;

    let len = children.length;
    console.log("ノード数:" + len);
	if ( 0 === len ) return false;

    for (let i = 0; i < len; i++){
        console.log(" - " + children.item(i).tagName + " : " + children.item(i).className);
        
        let gchildren = children.item(i).childNodes;
        let glen = gchildren.length;
        console.log("孫ノード数:" + glen);
    	if ( 0 === glen ) continue;
        for (let j = 0; j < glen; j++){
            console.log(" --- " + gchildren.item(i).tagName + " : " + gchildren.item(i).className);
        }
    }

    return false;
    
	let searchButton = searchInputGroup[0].getElementsByTagName('button');
	if ( !searchButton || !searchButton[0]) return false;
	console.log('発見：searchButton[0]');


// 	let katal = document.getElementById('katal-id-0');
// 	if ( !katal ) return false;

    // タイマーをクリアする
    clearInterval(timerPageLoad);

	// ASIN入力
	katInput[0].value = itemData.asin;

    // 1秒待って検索ボタンをクリックする
    setTimeout(waitClick, 1000);

	return true;
}

function waitClick() {

	// ASIN検索用のテキストボックスとボタンが存在することを確認する
	let searchInputContent = document.getElementById('SearchInputContent');
	if ( !searchInputContent ) return false;
	
	let searchInputGroup = searchInputContent.getElementsByClassName('search-input-group');
	if ( !searchInputGroup || !searchInputGroup[0]) return false;
	
	let searchButton = searchInputGroup[0].getElementsByTagName('button');
	if ( !searchButton || !searchButton[0]) return false;


// 	let searchForm = document.getElementById('search-form');

    // 検索ボタンをクリックする
	searchButton[0].click();

    // 検索結果の表示を待つタイマーを起動
	timerPageSearchResult = setInterval(waitSearchResultLoaded, 1000);

	return true;
}


// 検索結果の表示を待ち、表示されたらJANを取得する
function waitSearchResultLoaded() {

	// 検索結果が存在することを確認する
	let searchResult = document.getElementById('search-result');
	if ( !searchResult ) return false;

	let resultRows = searchResult.getElementsByClassName('content kat-row row-container');
	if ( !resultRows || !resultRows[0]) return false;

	let targetSection = resultRows[0].getElementsByClassName('kat-col-xs-7 attributes');
	if ( !targetSection || !targetSection[0]) return false;

	console.log('found div#search-result section.kat-col-xs-7.attributes');
	console.log(targetSection);

	let targetP = targetSection[0].getElementsByClassName('attribute');
	console.log(targetP);

	let jan = '';
	let rank = 0;
	let offer = 0;

	let sJan = false;
	let sRank = false;
	let sOffer = false;


	for (var i=0; i<targetP.length; i++) {
		let p = targetP[i];
		let t = p.textContent;
		console.log(t);

		if( t.indexOf('JAN')>=0 || t.indexOf('EAN')>=0) {
			sJan = true;
			jan = t.replace(/[^0-9]/g, '');
		}
		else if (t.indexOf('売上ランキング')>=0) {
			sRank = true;
			rank = t.replace(/[^0-9]/g, '');
		}
		else if (t.indexOf('オファー')>=0) {
			sOffer = true;
			offer = t.replace(/[^0-9]/g, '');
		}
	}

	if ( (  sJan && jan   ||   !sJan && !jan  ) &&
	     ( sRank && rank  ||  !sRank && !rank ) &&
	     (sOffer && offer || !sOffer && !offer) ) {
		// background.js に計算結果を通知
		msg.status = 'finish';
		msg.jan    = jan;
		msg.rank   = rank;
		msg.offer  = offer;
		chrome.runtime.sendMessage({msg: msg});
	    clearInterval(timerPageSearchResult);
		return true;
	}
	return false;
}


//現時点では使っていない。今後、バリエーションが存在する場合の参考にとってある
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
