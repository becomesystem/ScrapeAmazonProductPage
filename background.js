
const urlCalc = 'https://sellercentral-japan.amazon.com/fba/revenuecalculator/index?lang=ja_JP';
// const urlJAN  = 'https://sellercentral-japan.amazon.com/product-search/search?q=';
// const urlJAN  = 'https://sellercentral-japan.amazon.com/product-search/';
const urlJAN  = 'https://sellercentral.amazon.co.jp/abis/listing/syh?asin=';

let itemData = {};
let dataCalc = {};

let tabIdProduct;
let tabIdCalc;
let tabIdJan;

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
		console.log('addListener handler called');
		console.log(request);

        msg = request.msg;

        if (!msg.status) {
 			console.log(msg);
        	return;
        }

        // Amazon商品ページから来たメッセージか否かチェック
        // 詳細なURLチェックはmanifestで実施。ここでは簡易に。
        if (sender.url.indexOf('://www.amazon.co.jp/') >= 0 ) {

        	// 入力データ(ASIN、価格)が来たので計算を始める場合
        	if (msg.status == 'startCalc') {
	 			console.log('status: startCalc');

                // script.jsで商品ページからASINや価格を取得した後、
                // ここにメッセージが飛んできたことになる。
                // そのため、送料取得処理と、JAN取得処理をスタートさせる。

        		//後でメッセージを返せるように元の商品ページのTabIDを保存
	        	tabIdProduct = sender.tab.id;

	        	//後で計算ページに渡せるように情報を保存
	            itemData.asin = msg.asin;
	            itemData.price = msg.price;

                // これから取得するデータの保存先を確実に空にしておく
                dataCalc = {};
                
	            //計算ページを起動
	            chrome.tabs.create({url: urlCalc, active: false}, function(tab) {
					console.log('new tab created');
					tabIdCalc = tab.id;
	                chrome.tabs.executeScript(tab.id, {file: 'calculatorpage.js'});
	            });

                //JANページを起動
                chrome.tabs.create({url: urlJAN+itemData.asin+'#offer', active: false}, function(tab) {
                // chrome.tabs.create({url: urlJAN, active: false}, function(tab) {
					console.log('new tab created');
					tabIdJan = tab.id;
                    chrome.tabs.executeScript(tab.id, {file: 'getJAN.js'});
                });

	           // ２つのページを起動したことを通知
	           sendResponse(sender);
	        }
        	// 計算が終わったか確認の問い合わせの場合
        	else if (msg.status == 'waitFinishCalc') {
        		sendResponse(dataCalc);
        	}
        }
        // FBA売上計算シミュレータから来たメッセージの場合
        else if (sender.url.indexOf('https://sellercentral-japan.amazon.com/fba/revenuecalculator/') === 0 ) {

        	// 計算用ページが開いて準備できたので、計算用の入力データ(ASIN、価格)を送る
        	if (msg.status == 'readyCalc') {
	 			console.log('status: calcReady');
	            sendResponse({itemData: itemData, sender: sender});
        	}
        	// 計算用ページから結果が上がってきた場合
        	else if (msg.status == 'finishCalc') {
        		dataCalc.sellingFees = msg.sellingFees;
        		dataCalc.fulfillFees = msg.fulfillFees;
        		dataCalc.proceeds    = msg.proceeds;
        		chrome.tabs.remove(tabIdCalc);
        	}
        }
        // JAN取得ページから来たメッセージの場合
        // else if (sender.url.indexOf('https://sellercentral-japan.amazon.com/product-search/search') == 0 ) {
        // else if (sender.url.indexOf('https://sellercentral-japan.amazon.com/product-search') === 0 ) {
        else if (sender.url.indexOf('https://sellercentral.amazon.co.jp/abis/listing/') === 0 ) {

        	// Jan取得ページが開いて準備できたので、スクリプトを動かすようレスポンスを送る
        	if (msg.status == 'ready') {
	 			console.log('status: getJAN ready');
	            sendResponse();
        	}
        	// JAN,Ranking,Offerを取得した
        	else if (msg.status == 'finish') {
	 			console.log('status: getJAN finish');
        		dataCalc.jan   = msg.jan;
        		dataCalc.rank  = msg.rank;
        		dataCalc.offer = msg.offer;
        		chrome.tabs.remove(tabIdJan);
        	}
        }
        return true;
	}
);





chrome.browserAction.onClicked.addListener(function(tab) {
	chrome.tabs.sendMessage(tab.id, "Action");
});

'use strict';

{
  chrome.runtime.onInstalled.addListener(() => {
    const parent = chrome.contextMenus.create({
      id: 'parent',
      title: '親メニュー'
    });
    chrome.contextMenus.create({
      id: 'child1',
      parentId: 'parent',
      title: '子メニュー1'
    });
    chrome.contextMenus.create({
      id: 'child2',
      parentId: 'parent',
      title: '子メニュー2'
    });
    chrome.contextMenus.create({
      id: 'grandchild1',
      parentId: 'child1',
      title: '孫メニュー1'
    });
  });

  // メニューをクリック時に実行
  chrome.contextMenus.onClicked.addListener(item => {
    console.log(item);
    console.log(item.menuItemId);
    if (item=='child2') {
    	$("img").each(function(index) {
			$(this).css("-webkit-filter","grayscale(100%)");
		});
    }
  });
}