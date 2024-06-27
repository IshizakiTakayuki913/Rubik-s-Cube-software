// HTTPモジュール（HTTP通信機能）
let http = new require('http');

// URL,pathモジュール（URLの解析分解機能）
let url = new require('url');
let path = new require('path');

// ファイルシステムモジュール（ファイルの読み込み機能）
let fs = new require('fs');

let server = http.createServer(handleRequest);
server.listen(3000, '127.0.0.11');  // 待ち受けポート番号を 8080 に指定

function handleRequest(req, res) {
  let pathname = req.url;
  
  if (pathname == '/') {
    pathname = '/index.html';
  }
  
  // 指定されたパス名（pathname）の拡張子を取り出しファイルタイプを確認
  let ext = path.extname(pathname);

  // 拡張子とコンテンツのMIMEタイプを対応づける（とりあず３種類だけ記述）
  let typeExt = {
    '.html': 'text/html',        // HTMLテキストファイル
    '.js':   'text/javascript',  // Javascriptプログラムソース（テキスト）
    '.css':  'text/css',          // CSSテキストファイル
    '.png': 'image/png',
    '.jpg': 'image/jpeg'
  };

  let contentType = typeExt[ext] || 'text/plain';
  console.log(__dirname + pathname)
  // 指定したファイルをfsモジュールを利用して読み込む
  fs.readFile(__dirname + pathname,
    // 読み込みのためのコールバック関数の指定
    function (err, data) {
      // エラーが発生した場合に対応
      if (err) {
        res.writeHead(500);
        return res.end('Error loading ' + pathname);
      }
      // エラーでなければ、200番を設定して、ファイル転送を指定する
      res.writeHead(200,{ 'Content-Type': contentType });
      res.end(data);
    }
  );
}
