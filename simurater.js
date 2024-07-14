window.addEventListener("load",function(e){
    guisetup();
    var a = new simurater(
        document.querySelector('#graph1'),
        document.querySelector('#graph2'),
        document.querySelector('T'),
        document.querySelector('X')
    );
});
var guisetup = () =>{
    var nl = new nylon();
    document.querySelector("#start").addEventListener("click", () => {
        nl.emit("start",null);
        nl.emit("u",{"T":document.querySelector('#T'),"X":document.querySelector('#X')});
        simurater();
    });
    document.querySelector("#stop").addEventListener("click",() => {
        nl.emit("stop",null);
    });
    document.querySelector("#reset").addEventListener("click",() => {
        nl.emit("clear",null);
        window.location.reload();
    });
}
function simurater(){
    //初期設定
    var u=[]; //現在の温度を格納
    var x = parseInt(document.querySelector('#X').value) ; //金属棒の長さを取得
    var t = parseInt(document.querySelector('#T').value) ; //初期温度を取得
    var i ;
    var h = 1; //微小時間
    var k = 0.1; //微小距離
    var r = k /h*h; //rの値(<0.5)
    var n = 1 -(2*r); //1-2rの値
    var x_1 = Math.floor(x / k) ; //金属棒の長さを微小距離で割った値
    u.push(0); //左端の境界条件
    for(i=1;i<x_1;i++){
        u.push(t); 
    }
    u.push(0);//右端の境界条件
    console.log("初期条件u:",u);//初期条件をコンソールに表示

    var iteration = 0;
    var maxIterations = 1000; // 最大繰り返し回数を設定
    while(u[Math.floor(x_1 / 2)] != 0 && iteration < maxIterations){
        var w=[]; //計算結果を格納
        w.push(0);//左端の境界条件
        for(i=1;i<x_1;i++){
            w.push(parseInt(r * (u[i+1]+u[i-1]) + n * u[i])) ;
        }
        w.push(0);//右端の境界条件
        u = w.slice(); //wの内容をuにコピー
        console.log("現在の温度分布u:",u);//現在の温度分布をコンソールに表示
        canvas1(u);
        canvas2(u);
        iteration++;
    }
    if (iteration >= maxIterations) {
        console.warn("Maximum iterations reached");
    }
}
//温度変化の様子
function canvas1(u){
}
//温度分布のグラフ
function canvas2(u){
    //this.cv2 = new VCanvas(element2);
    var canvas = document.querySelector('#graph2');
    var cv2 = canvas.getContext('2d');
    
    cv2.clearRect(0, 0, canvas.width, canvas.height); // キャンバスをクリア
    cv2.beginPath();
    
    // 最大値が0の場合を防ぐため、最低限の値を設定
    var maxU = Math.max(...u);
    if (maxU === 0) {
        maxU = 1; // 最大値が0の場合にスケールYが0にならないようにする
    }

    var scaleX = canvas.width / u.length;
    var scaleY = canvas.height / maxU;

    // x軸の描画
    cv2.moveTo(40, canvas.height-30); // キャンバスの下端
    cv2.lineTo(canvas.width-40, canvas.height-30); // x軸を描画
    cv2.strokeStyle = '#000000'; // x軸の色を設定
    cv2.stroke();

    // uの描画
    cv2.beginPath();
    cv2.moveTo(40, 60); // キャンバスの上端
    cv2.lineTo(40, canvas.height-30); // u軸を描画
    cv2.strokeStyle = '#000000'; // u軸の色を設定
    cv2.stroke();

    // 軸ラベルの描画
    cv2.fillStyle = '#000000'; // ラベルの色
    cv2.font = '16px Arial'; // フォントの設定

    // x軸ラベル
    cv2.fillText('x (位置)', canvas.width-60, canvas.height-10); // x軸ラベルを下に配置

    // u軸ラベル
    cv2.save(); // 現在の状態を保存
    cv2.translate(20, canvas.height / 2); // u軸ラベルを左側に配置
    cv2.rotate(-Math.PI / 2); // u軸ラベルを90度回転
    cv2.fillText('u (温度)', 70, 0); // u軸ラベルを描画
    cv2.restore(); // 保存した状態を復元

    //原点
    cv2.save(); // 現在の状態を保存
    cv2.fillText('0', 40, canvas.height-10); // 0配置
    cv2.fillText('0', 20, canvas.height-25); // 0配置

    //初期温度
    //ラベル
    cv2.save();// 現在の状態を保存
    cv2.fillText('T', 20, canvas.height-220); // T配置
    //線
    cv2.beginPath();
    cv2.moveTo(40, canvas.height-220); // スタート位置
    cv2.lineTo(canvas.width-40, canvas.height-220); // x軸を描画
    cv2.strokeStyle = '#000000'; // x軸の色を設定
    cv2.stroke();

    console.log("最高温度:",Math.max(...u));
   
    //以下作成途中のコード
    /*//温度分布の描画
    cv2.beginPath();
    cv2.moveTo(40, canvas.height - u[1] * scaleY); // スタート位置
    
    for (var i = 1; i < u.length; i++) {
        cv2.lineTo(i * scaleX, canvas.height - u[i-1] * scaleY);
        console.log(i*scaleX,canvas.height -220 - u[i-1] * scaleY);
    }
    
    cv2.strokeStyle = '#f90303'; // 温度分布の色を設定
    cv2.stroke();
    */
   
}
