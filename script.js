
console.log('start script.js');

let gCounter = 0;

let isGotASIN = false;
let isGotPrice = false;
let isGotItemName = false;
let isGotCategory = false;
let isGotPoint = false;
let isWrittenAsinAndPrice = false;
let isStartCalc = false;
let isGotSellingFees = false;
let isGotJan = false;
let isGotCoupon = false;
let isGotRank = false;
let isGotOffer = false;
let isGotFees = false;

let asin;
let price;
let coupon;
let itemName;
let category;
let point = -1;
let jan = '000000000000'; //dummy
let rank;
let offer;
let feesRatio;
let fulfillFees;
let proceeds;

let msg = {};
msg.asin = '';
msg.price = '';
msg.point = '';


// タイマー設定
const jsInitCheckTimer = setInterval(function () {

	console.log('called timer handler: '+ gCounter);
	gCounter++;

	// ASIN取得
	if (!isGotASIN) {
		asin = getASIN().replace(/[^A-Z0-9.]/g, '');
		if (asin) {
			isGotASIN = true;
		}
	}

	// 価格取得
	if (!isGotPrice) {
		price = getPrice();
		if (price>=0) {
			isGotPrice = true;
		}
	}

	// ポイント取得
	if (!isGotPoint) {
		//あるかないか分からない要素なので、Priceが取得後にあるならば取れるだろうという仮定
		if (isGotPrice) {
			point = getPoint();
			console.log('point=' + point);
			if (point>=0) {
				isGotPoint = true;
			}
		}
	}

	// 商品名取得
	if (!isGotItemName) {
		itemName = getItemName();
		if (itemName) {
			isGotItemName = true;
		}
	}

	// カテゴリ取得
	if (!isGotCategory) {
		category = getCategory();
		if (category) {
			isGotCategory = true;
		}
	}
	
	// クーポン獲得
	if (!isGotCoupon) {
		coupon = getCoupon();
		if (coupon) {
			isGotCoupon = true;
		}
	}

	// JAN獲得
	if (!isGotJan) {
		jan = getJan();
		if (jan) {
			isGotJan = true;
		}
	}

	// ランクを取得
	if (!isGotRank) {
		rank = getRank();
		if (rank) {
			isGotRank = true;
		}
	}
	
	// 出品数を取得
	if (!isGotOffer) {
		offer = getOffer();
		if (offer) {
			isGotOffer = true;
		}
	}

	// 手数料を取得
	if (!isGotFees) {
		data = getFees();
		if (data) {
			feesRatio = ''+Math.round(data[0]*100/price)+'%';
			fulfillFees = data[1];
			isGotFees = true;
		}
	}

	
	
	// ひとまずASIN・価格・ポイントを表示して、backgroundに通知して計算を始めてもらう
	if (isGotASIN && isGotPrice && isGotPoint && isGotItemName && isGotCategory && isGotJan && isGotRank && isGotOffer && isGotFees && !isWrittenAsinAndPrice) {
		writeAsinAndPrice();

		// ASINと価格を取得したので、backgroundに通知して計算を始めてもらう
		//msg.asin = asin;
		//msg.price = price;
		//msg.point = point;
		//msg.status = 'startCalc';
		//chrome.runtime.sendMessage({msg: msg}, response => {
		//	isStartCalc = true;
		//	console.log(response);
		//});
		isWrittenAsinAndPrice = true;
	}
	else {
		console.log("isGotASIN:"+isGotASIN+" isGotPrice:"+isGotPrice+" isGotPoint:"+isGotPoint+" isGotItemName:"+isGotItemName+" isGotCategory:"+isGotCategory+" isGotJan:"+isGotJan+" isGotRank:"+isGotRank+" isGotOffer:"+isGotOffer+" isGotFees:"+isGotOffer);
	}

	// 最後の処理が終わるか１分超えたらタイマーを止める
	if (isWrittenAsinAndPrice || gCounter>60) {
		  clearInterval(jsInitCheckTimer);
	}
	
	// backgroundに計算を依頼し、結果が戻ってきたら表示する処理を登録
	//if (isStartCalc && !isGotSellingFees) {
	//	msg.status = 'waitFinishCalc';
	//	chrome.runtime.sendMessage({msg: msg}, response => {
	//		console.log("計算終了待ち：");
	//		console.log(response);
	//
	//		// 計算結果が戻ってきたら表示に反映
	//		//if ('jan' in response && !isGotJan) {
	//		//	isGotJan = true;
	//		//	console.log("結果が帰ってきたので反映する JAN");
	//		//	writeJan(response);
	//		//}
	//		if ('sellingFees' in response && !isGotSellingFees) {
	//			isGotSellingFees = true;
	//			console.log("結果が帰ってきたので反映する Fees");
	//			writeSellingFees(response);
	//		}
	//	});
	//}
	//
	//// 最後の処理が終わるか１分超えたらタイマーを止める
	//if (isGotSellingFees && isGotJan || gCounter>60) {
	//	  clearInterval(jsInitCheckTimer);
	//}

}, 1000);

//function writeJan(response) {
//	  jan = response.jan;
//	  rank = response.rank;
//	  offer = response.offer;
//	  
//	$('td#myJAN').text(jan);
//	$('td#myRank').text(rank);
//	$('td#myOffer').text(offer);
//}

//function writeSellingFees(response) {
//	  let fees = response.sellingFees;
//	  feesRatio = ''+Math.round(fees*100/price)+'%';
//	  fulfillFees = response.fulfillFees;
//	  proceeds = response.proceeds;
//	  
////	$('td#mySellingFees').text(response.sellingFees);
//	$('td#mySellingFees').text(feesRatio);
//	$('td#myFulfillFees').text(fulfillFees);
//	$('td#myProceeds').text(proceeds);
//}

function writeAsinAndPrice() {
	// class="a-size-small a-color-price"<span class="a-list-item">

	price = price - point;

//	$('div#showing-breadcrumbs_div').append(
	$('div#dp-container').prepend(
		'<table class="a-size-small">' +
			'<thead><tr>' +
				'<th></th>' +
				'<th>DATE</th>' +
				'<th>ASIN</th>' +
				'<th>JAN/EAN/UPC</th>' +
				'<th>商品名</th>' +
				'<th>カテゴリ</th>' +
				'<th>ランキング</th>' +
				'<th>出品数</th>' +
				'<th>予想売上</th>' +
				'<th>出品手数料</th>' +
				'<th>配送手数料</th>' +
			'</tr></thead>' +
			'<tbody><tr id="myTable">' +
				// '<td id="myCopy"><button onclick="copyInfoToClipBoard()">copy</button></td>' +
				// '<td id="myCopy"><button onclick="navigator.clipboard.writeText($("tr#myTable").innerHTML)">copy</button></td>' +
				'<td id="myCopy"><button id="btnCopy">copy</button></td>' +
				'<td id="myDate">'+getDate()+'</td>' +
				'<td id="myASIN">'+asin+'</td>' +
				'<td id="myJAN">'+jan+'</td>' +
				'<td id="myItemName">'+itemName+'</td>' +
				'<td id="myCategory">'+category+'</td>' +
				'<td id="myRank">'+rank+'</td>' +
				'<td id="myOffer">'+offer+'</td>' +
				'<td id="myPrice">'+price+'</td>' +
				'<td id="mySellingFees">'+feesRatio+'</td>' +
				'<td id="myFulfillFees">'+fulfillFees+'</td>' +
			'</tr></tbody>' +
		'</table>'
	);
	
	document.getElementById('btnCopy').addEventListener("click", function(){
		console.log('btnCopy clicked');
		let content = getDate() + '\t' + asin + '\t' + jan + '\t' + itemName + '\t' + category + '\t' + rank + '\t' + offer + '\t' + price + '\t' + feesRatio + '\t' + fulfillFees;
		navigator.clipboard.writeText(content);
	});
}


function copyInfoToClipBoard() {
	// var content = document.getElementById('textArea').innerHTML;
	// let content = $('tr#myTable').innerHTML;

	// navigator.clipboard.writeText(content);
	//	   .then(() => {
	//	   console.log("Text copied to clipboard...")
	// })
	//	   .catch(err => {
	//	   console.log('Something went wrong', err);
	// })
}

//
//chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	// console.log(request);
	// if (request.status) {
		// if (request.status == 'finishCalc') {
			// $('td#mySellingFees').text(response.sellingFees);
			// $('td#myFulfillFees').text(response.fulfillFees);
			// $('td#myProceeds').text(response.proceeds);
		// }
	// }
//});

function getASIN() {

	let asinElement = $();	//空のjQueryオブジェクト
	let inputAsin = $('input#ASIN');
	let tabledetail = $('table#productDetails_detailBullets_sections1');
	let tabletecSpec = $('table#productDetails_techSpec_section_1');
	let divDetail = $('div#detailBullets_feature_div');
//	let prodDetail = $('div#productDetails_feature_div.celwidget');

	if (inputAsin) {
		console.log('found input#ASIN');
		console.log(inputAsin.val());
		asinElement = inputAsin;
		if (asinElement[0]) {
			console.log('got ASIN:0');
			return asinElement.val();
		}
	}
	else if (tabledetail[0]) {
		console.log('found table#productDetails_detailBullets_sections1');
		asinElement = tabledetail.find('th:contains("ASIN")+td');
		if (asinElement[0]) {
			console.log('got ASIN:1');
			return asinElement.text();
		}
	}
	else if (tabletecSpec[0]) {
		console.log('found table#productDetails_techSpec_section_1');
		asinElement = tabletecSpec.find('th:contains("ASIN")+td');
		if (asinElement[0]) {
			console.log('got ASIN:2');
			return asinElement.text();
		}
	}
	else if (divDetail[0]) {
		console.log('found div#detailBullets_feature_div');
		asinElement = divDetail.find('ul>li>span>span:contains("ASIN")+span');
		if (asinElement[0]) {
			console.log('got ASIN:3');
			return asinElement.text();
		}
	}

	return null;
}

function getPrice() {
	// jQueryの全セレクタのまとめ「完全マスター辞典！」
	// https://stand-4u.com/web/javascript/jquery-selector.html
	
	let priceBuyBox = $('#corePriceDisplay_desktop_feature_div > div.a-spacing-none > span.a-price span.a-price-whole').first();
	let stringAccord = '#apex_desktop_newAccordionRow[style!="display:none;"] > #corePriceDisplay_desktop_feature_div > div.a-spacing-none > span.a-price	span.a-price-whole';
	let stringOffer1 = '#apex_offerDisplay_desktop > #corePrice_feature_div	  span.a-price	 span.a-price-whole';
	let stringAllOffers = 'div#olp_feature_div > div.a-section.a-spacing-small.a-spacing-top-small > span > a > span.a-size-base.a-color-price';

	let priceAlias = null;

	if ( priceBuyBox ) {
		console.log('found price element:BuyBox ' + priceBuyBox[0]);
		priceAlias = priceBuyBox.text();
	} else if ( priceAccord = $(stringAccord).text() ) {
		console.log('found price element:Accord');
		priceAlias = priceAccord;
	} else if ( priceOffer1 = $(stringOffer1).text() ) {
		console.log('found price element:Offer1');
		priceAlias = priceOffer1;
	} else if (priceAllOffers = $(stringAllOffers).text() ) {
		console.log('found price element:AllOffers');
		priceAlias = priceAllOffers;
	} else {
		let avail = $('div#availability_feature_div>div#availability:contains("在庫切れ")');
		if (avail[0]) {
			console.log('got price（在庫切れ）');
			return 0;
		}
	}

	if (priceAlias) {
		console.log(priceAlias);
		//priceString = priceAlias.text();
		priceString = priceAlias;
		if (priceString) {
			console.log('got price');
			return priceString.replace(/[^0-9.]/g, '');
		}
	}

	return -1;
}

function getPoint() {

	console.log('called getPoint');

	// ポイントを含みうるElementを取得
	let featureDiv = $('#points_feature_div:first > span.a-color-price');
	let tablerows = $('div#price>table>tbody>tr:not(#priceblock_ourprice_row)');
	let spanPoint = $('div#pointsInsideBuyBox_feature_div>div>div>div>span.a-color-price');

	// 上記のElementがポイントを含むか確認し、含んでいればポイントを取得
	if (featureDiv) {
		console.log('found points_feature_div');
		let pointString = featureDiv.text();
		if (pointString) {
			console.log('got point:' + pointString);
			pointRemovedPercent = pointString.replace(/\([0-9.]+%\)/, '');
			console.log('got point:' + pointRemovedPercent);
			pointRemovedSpace = pointRemovedPercent.replace(/\s+/, '');
			console.log('got point:' + pointRemovedSpace);
			pointRemovedPt = pointRemovedSpace.replace(/pt/,'');
			console.log('got point:' + pointRemovedPt);
			return pointRemovedPt;
		}
	} else if (tablerows[0]) {
		let pointString;
		console.log('found savings/point element:' + tablerows.length);
		tablerows.each( function(){
			if ( $(this).attr('id') != 'regularprice_savings' ) {
				console.log('found point element');
				pointString = $(this).find('.a-color-price').text();
			}
		});
		if (pointString) {
			console.log('got point:' + pointString);
			pointRemovedPercent = pointString.replace(/\([0-9.]+%\)/, '');
			console.log('got point:' + pointRemovedPercent);
			pointRemovedSpace = pointRemovedPercent.replace(/\s+/, '');
			console.log('got point:' + pointRemovedSpace);
			pointRemovedPt = pointRemovedSpace.replace(/pt/,'');
			console.log('got point:' + pointRemovedPt);
			return pointRemovedPt;
			// return pointString.replace(/pt\s+\([0-9.]+%\)/, '');
		}
	} else if (spanPoint[0]) {
		console.log('found point element at buyBox');
		let pointString = spanPoint.text();
		if (pointString) {
			console.log('got point:' + pointString);
			pointRemovedPercent = pointString.replace(/\([0-9.]+%\)/, '');
			console.log('got point:' + pointRemovedPercent);
			pointRemovedSpace = pointRemovedPercent.replace(/\s+/, '');
			console.log('got point:' + pointRemovedSpace);
			pointRemovedPt = pointRemovedSpace.replace(/pt/,'');
			console.log('got point:' + pointRemovedPt);
			return pointRemovedPt;
		}
	}
	
	// ポイントを記述する行が存在しない
	console.log('no point row');
	return 0;
}

function getItemName() {
	let spanItemName = $('span#productTitle');

	if ( spanItemName[0] ) {
		console.log('found itemName element');
		let stringItemName = spanItemName.text();
		if (stringItemName) {
			console.log('got itemName');
			console.log(stringItemName);
			return stringItemName.replace(/\s/g, '');
		}
	}

	return null;
}

function getCategory() {
	let spanCategory = $('#nav-subnav > a.nav-a.nav-b > span');
	let anchorCategory = $('div#detailBulletsWrapper_feature_div > ul > li > span:contains(売れ筋ランキング) > a');
	let tableCat = $('table#productDetails_detailBullets_sections1 > tbody > tr > th:contains(売れ筋ランキング) + td > span > span:first');
	
	if ( spanCategory[0] ) {
		console.log('found category element:1');
		let stringCategory = spanCategory.text();
		if (stringCategory) {
			console.log('got category');
			console.log(stringCategory);
			stringCategory = stringCategory.replace(/\s/g, '');
			console.log(stringCategory);
			stringCategory = stringCategory.replace(/\n/g, '');
			console.log(stringCategory);
			return stringCategory;
		}
	} else if ( anchorCategory[0] ) {
		console.log('found category element:2');

		let textCategory = anchorCategory.text();
		console.log('textCategory: ' + textCategory);
		let textCategory2 = textCategory.replace('の売れ筋ランキングを見る', '');
		
		return textCategory2;
	} else if ( tableCat[0] ) {
		console.log('found category element:3');
		let stringCategory = tableCat.text();
		if (stringCategory) {
			console.log('got tableCat:'+stringCategory);
			stringCategory = stringCategory.replace(/[^\d]/g, '');
			console.log(stringCategory);
			return stringCategory;
		}
	}

	return null;
}

function getCoupon() {
	let labelCoupon = $('#promoPriceBlockMessage_feature_div>span.promoPriceBlockMessage_Sns>div>label');
	
	if ( labelCoupon[0] ) {
		console.log('found coupon element:1');
		let stringCoupon = labelCoupon.text();
		if (stringCoupon) {
			console.log('got coupon');
			console.log(stringCoupon);
			stringCoupon = stringCoupon.replace(/\s/g, '');
			console.log(stringCoupon);
			stringCoupon = stringCoupon.replace(/\n/g, '');
			stringCoupon = stringCoupon.replace('%OFFクーポンの適用。会員登録＆割引で購入する場合、割引は最初の注文に適用される場合があります。規約', '');
			console.log(stringCoupon);
			return stringCoupon;
		}
	}

}

//
// もりもとら様監修のクイックショップを前提とした処理
//
function getJan() {

	let divJan = $('#olp_feature_div > div > div.qs-container tr.qs-jan > td > span.qs-value');

	if ( divJan[0] ) {
		console.log('found JAN element');
		let stringJan = divJan.text();
		if (stringJan) {
			console.log('got Jan');
			console.log(stringJan);
			return stringJan.replace(/\s/g, '');
		}
	}
	return null;
}

function getRank() {

	let divRankAndCategory = $('#olp_feature_div > div > div.qs-container div.qs-ranking div.qs-value');

	if ( divRankAndCategory[0] ) {
		console.log('found Rank element');
		
		// divRankAndCategoryはこんな感じ	"2,815位 | 家電＆カメラ"
		let stringArrayRC = divRankAndCategory.text().split('|');
		
		if (stringArrayRC && stringArrayRC.length == 2 ) {
			console.log('got Rank');
			console.log(stringArrayRC);
			return stringArrayRC[0].replace(/[,\s位]/g, ''); // ランキングの文字列を正規化して返却
		}
	}
	return null;
}

function getOffer() {

	let spanOffer = $('#olp_feature_div > div > div.qs-container tr.qs-new-seller-cnt span.qs-value');

	if ( spanOffer[0] ) {
		console.log('found Offer element');
		
		let stringOffer = spanOffer.text();
		
		if ( stringOffer ) {
			console.log('got Offer');
			console.log(stringOffer);
			return stringOffer;
		}
	}
	return null;
}

// Amazon出品手数料とFBA出品手数料を返す
// 戻り値は配列
function getFees() {

	let spanFees = $('#olp_feature_div > div > div.qs-container table.qs-profit-table span.qs-fee');

	if ( spanFees[0] ) {
		console.log('found Fees element');
		
		stringFees = spanFees.attr('aria-label');
		console.log(stringFees);
		
		if (stringFees) {
		
			// stringFees はこんな感じ
			// "Amazon出品手数料: 6281円
			//		FBA出品手数料: 514円
			//		在庫保管手数料: 52円"
			let arrayFees = stringFees.split('\n');
			if ( arrayFees && arrayFees.length >= 2 ) {
				console.log('got Fees');
				console.log(arrayFees);
				
				let arrayAmazonDisplayFee = arrayFees[0].split(':');
				console.log(arrayAmazonDisplayFee);

				if ( arrayAmazonDisplayFee.length >= 2 ) {
					let AmazonDisplayFee = arrayAmazonDisplayFee[1].replace(/[\s円]/g,'');
					console.log(AmazonDisplayFee);

					let arrayFbaDisplayFee = arrayFees[1].split(':');
					console.log(arrayFbaDisplayFee);

					if ( arrayFbaDisplayFee.length >= 2 ) {
						let FbaDisplayFee = arrayFbaDisplayFee[1].replace(/[^0-9]/g,'');
						console.log(FbaDisplayFee);
						
						return [AmazonDisplayFee, FbaDisplayFee];
					}
				}
			}
		}
	}
	return null;
}





//*[@id="olp_feature_div"]/div[2]/div[1]/div[3]/div[2]
// document.querySelector("#olp_feature_div > div.qs-container.qs-size-m > div.qs-basis > div.qs-jan.qs-m-card > div.qs-value.qs-fs-xl")


function getDate() {
	let d = new Date();
	let yy = d.getFullYear() % 1000;
	let mm = ('0' + (d.getMonth() + 1)).slice(-2);
	let dd = ('0' + d.getDate()).slice(-2);
	
	let result = yy + '/' + mm + '/' + dd;
	return result;
}

