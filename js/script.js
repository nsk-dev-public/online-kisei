var params = (new URL(document.location)).searchParams;
var status = params.get('s');
if (status == 1) {
    $(".waiter").show();
}else{
    $(".meeter").show();
}

let localStream = null;
let peer = null;
let existingCall = null;

navigator.mediaDevices.getUserMedia({video: true, audio: true})
    .then(function (stream) {
        // Success
        $('#my-video').get(0).srcObject = stream;
        localStream = stream;
    }).catch(function (error) {
    // Error
    console.error('mediaDevice.getUserMedia() error:', error);
    return;
});

// 一度でもid入力してたらデフォルトでそれ入れてあげる
var calltoId = "";
if ($.cookie("ok_calltoid")) {
    $("#callto-id").val($.cookie("ok_calltoid"));
}

// 一度でもid発行してたらそれ使い回す
var peerId = "";
if ($.cookie("ok_peerid") == null) {
    var CODE_TABLE = "0123456789";
    for (var i = 0, k = CODE_TABLE.length; i < 9; i++){
        peerId += CODE_TABLE.charAt(Math.floor(k * Math.random()));
    }
    $.cookie("ok_peerid", peerId, {expires: 7});
}else{
    peerId = $.cookie("ok_peerid");
}

peer = new Peer(String(peerId), {
    key: '*keyを入れてください*',
    debug: 3
});

peer.on('open', function(){
    var peerStr = peer.id;
    peerStr = peerStr.replace(/^(\d+)(\d{3})/,"$1-$2");
    peerStr = peerStr.replace(/^(\d+)(\d{3})/,"$1-$2");

    $('#my-id').text(peerStr);
});

peer.on('error', function(err){
    alert("番号が間違っているか、相手が待機していないようです。もう一度お試しください。");
    location.href="/index.html";    
    
});

peer.on('close', function(){
});

peer.on('disconnected', function(){
});

$('#make-call').submit(function(e){
    e.preventDefault();
    peerIdStr = $('#callto-id').val();
    // 半角にする
    // peerIdStr = String.fromCharCode( peerIdStr.charCodeAt(0) - 0xFEE0 )
    // validation

    $.cookie("ok_calltoid", peerIdStr, {expires: 7});
    const call = peer.call(peerIdStr, localStream);
    setupCallEventHandlers(call);
});

$('#end-call').click(function(){
    existingCall.close();
    // alert("接続を切断しました。TOPに戻ります。");
    // location.href="/index.html";    
});

peer.on('call', function(call){
    call.answer(localStream);
    setupCallEventHandlers(call);
});

function setupCallEventHandlers(call){
    $(".close-button").show();
    $(".popup_container").hide();

    if (existingCall) {
        existingCall.close();
    };

    existingCall = call;

    call.on('stream', function(stream){
        addVideo(call,stream);
        setupEndCallUI();
        $('#their-id').text(call.remoteId);
    });
    call.on('close', function(){
        alert("接続が切断しました。TOPに戻ります。");
        location.href="/index.html";    
        removeVideo(call.remoteId);
        setupMakeCallUI();
    });
}

function addVideo(call,stream){
    $('#their-video').get(0).srcObject = stream;
}

function removeVideo(peerId){
    $('#'+peerId).remove();
}

function setupMakeCallUI(){
    $('#make-call').show();
    $('#end-call').hide();
}

function setupEndCallUI() {
    $('#make-call').hide();
    $('#end-call').show();
}
