function check(s) {
	if (/twitter|fbav|line/.test(navigator.userAgent.toLowerCase())) {
		$("#webview_popup").show();
	}else if(navigator.userAgent.match(/(iPhone|iPad|iPod|Android)/)){
		var str = retrunUrl(false, s);
		location.href=str; 
	}else{
		// ボタンの表示変える
		if (s == 0) {
			$("#button_meeter").html('<p>カメラ・マイクの許可<br>を確認しています。</p><p>許可承認のウィンドウが<br class="pc">表示した場合、許可してください</p>');
		}else{
			$("#button_waiter").html('<p>カメラ・マイクの許可<br>を確認しています。</p><p>許可承認のウィンドウが<br class="pc">表示した場合、許可してください</p>');
		}
		
		// 処理
		var blockFlg = true;
		var constrains = { video: true, audio: true }; // 映像・音声を取得するかの設定
		navigator.mediaDevices
		.getUserMedia(constrains)
		.then(function(stream) {
			// success
			var str = retrunUrl(false, s);
			location.href=str;
		})
		.catch(function(err) {
			var str = retrunUrl(true, s);
			location.href=str;
		});
	}
}

function retrunUrl(blockFlg, status){
	// 何もない(初回)場合もblockとみなす
	if (blockFlg) {
		return "./allow.html?s="+status.toString();
	}else{
		return "./connect.html?s="+status.toString();
	}
}