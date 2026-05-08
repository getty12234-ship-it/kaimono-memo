"""
買い物メモアプリ - ローカルサーバー
スマホからアクセスするためのHTTPSサーバー

使い方:
  python server.py

アクセス:
  スマホで https://<このPCのIPアドレス>:8443 を開く
  （同じWi-Fiに接続している必要があります）
"""
import http.server, ssl, os, socket, subprocess, sys
from pathlib import Path

PORT = 8443
CERT_FILE = 'cert.pem'
KEY_FILE  = 'key.pem'

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return '127.0.0.1'

def generate_cert():
    """自己署名証明書を生成（音声認識にはHTTPS必須）"""
    print('SSL証明書を生成中...')
    try:
        subprocess.run([
            'openssl', 'req', '-x509', '-newkey', 'rsa:2048',
            '-keyout', KEY_FILE, '-out', CERT_FILE,
            '-days', '365', '-nodes',
            '-subj', '/CN=localhost'
        ], check=True, capture_output=True)
        print('証明書生成完了')
        return True
    except FileNotFoundError:
        return False
    except subprocess.CalledProcessError as e:
        print(f'証明書生成失敗: {e}')
        return False

def run_http():
    """HTTPサーバー（ローカルのみ、音声認識はlocalhost扱い）"""
    os.chdir(Path(__file__).parent)
    handler = http.server.SimpleHTTPRequestHandler
    handler.extensions_map = {
        '': 'application/octet-stream',
        '.html': 'text/html; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.js': 'application/javascript; charset=utf-8',
        '.json': 'application/json; charset=utf-8',
        '.png': 'image/png',
    }

    with http.server.HTTPServer(('0.0.0.0', 8080), handler) as httpd:
        ip = get_local_ip()
        print(f'\n==============================')
        print(f'  買い物メモアプリ起動中')
        print(f'==============================')
        print(f'  PC:    http://localhost:8080')
        print(f'  スマホ: http://{ip}:8080')
        print(f'')
        print(f'  ※ スマホとPCが同じWi-Fiに')
        print(f'    接続されている必要があります')
        print(f'  ※ 音声認識はChromeを推奨')
        print(f'  Ctrl+C で終了')
        print(f'==============================\n')
        httpd.serve_forever()

if __name__ == '__main__':
    os.chdir(Path(__file__).parent)
    run_http()
