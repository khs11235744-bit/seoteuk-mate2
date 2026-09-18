#!/usr/bin/env python3
# Seoteuk Mate Antigravity DEV Bridge
# Browser -> localhost -> official Antigravity CLI (agy)

from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import json, os, secrets, shutil, subprocess, sys

HOST = '127.0.0.1'
PORT = int(os.environ.get('SEOTEUK_AG_PORT', '8765'))
TOKEN_FILE = Path.home() / '.seoteukmate' / 'antigravity_bridge_token.txt'
TOKEN_FILE.parent.mkdir(parents=True, exist_ok=True)

if os.environ.get('SEOTEUK_AG_TOKEN'):
    TOKEN = os.environ['SEOTEUK_AG_TOKEN'].strip()
elif TOKEN_FILE.exists():
    TOKEN = TOKEN_FILE.read_text(encoding='utf-8').strip()
else:
    TOKEN = secrets.token_urlsafe(24)
    TOKEN_FILE.write_text(TOKEN, encoding='utf-8')


def find_agy():
    return shutil.which('agy') or shutil.which('agy.exe')


def agy_version():
    exe = find_agy()
    if not exe:
        return None
    try:
        r = subprocess.run([exe, '--version'], capture_output=True, text=True, timeout=10)
        txt = (r.stdout or r.stderr).strip().splitlines()
        return txt[0] if txt else 'installed'
    except Exception:
        return 'installed'


def run_agy(prompt, model='', effort='medium'):
    exe = find_agy()
    if not exe:
        raise RuntimeError('Antigravity CLI(agy)를 찾지 못했습니다. 먼저 Antigravity CLI를 설치하고 agy 명령으로 1회 로그인하세요.')
    cmd = [exe, '-p', prompt, '--output-format', 'json', '--print-timeout', '5m']
    if model:
        cmd += ['--model', model]
    if effort in ('low', 'medium', 'high'):
        cmd += ['--effort', effort]
    proc = subprocess.run(cmd, capture_output=True, text=True, timeout=330)
    stdout = (proc.stdout or '').strip()
    stderr = (proc.stderr or '').strip()
    if proc.returncode != 0:
        raise RuntimeError(stderr or stdout or f'agy exited with code {proc.returncode}')
    try:
        data = json.loads(stdout)
    except Exception:
        # Fallback for unexpected plain text output
        return {'text': stdout, 'usage': None, 'conversation_id': None}
    if data.get('status') not in (None, 'SUCCESS'):
        raise RuntimeError(data.get('error') or f"Antigravity status: {data.get('status')}")
    return {
        'text': data.get('response', ''),
        'usage': data.get('usage'),
        'conversation_id': data.get('conversation_id'),
        'duration_seconds': data.get('duration_seconds'),
        'status': data.get('status', 'SUCCESS'),
        'engine': 'antigravity-cli',
        'agy_version': agy_version(),
        'model_requested': model or '',
        'model_used': data.get('model') or data.get('model_name') or model or '',
        'effort': effort,
    }


class Handler(BaseHTTPRequestHandler):
    server_version = 'SeoteukMateAGBridge/2.2'

    def log_message(self, fmt, *args):
        print('[bridge]', fmt % args)

    def _cors(self):
        origin = self.headers.get('Origin') or '*'
        self.send_header('Access-Control-Allow-Origin', origin)
        self.send_header('Vary', 'Origin')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, X-Seoteuk-Bridge-Token')
        self.send_header('Access-Control-Allow-Private-Network', 'true')
        self.send_header('Cache-Control', 'no-store')

    def _json(self, status, payload):
        data = json.dumps(payload, ensure_ascii=False).encode('utf-8')
        self.send_response(status)
        self._cors()
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def _authorized(self):
        return secrets.compare_digest(self.headers.get('X-Seoteuk-Bridge-Token', ''), TOKEN)

    def do_OPTIONS(self):
        self.send_response(204)
        self._cors()
        self.end_headers()

    def do_GET(self):
        if self.path.rstrip('/') == '/health':
            exe = find_agy()
            self._json(200, {
                'ok': bool(exe),
                'bridge': 'seoteukmate-antigravity-dev',
                'engine': 'antigravity-cli',
                'bridge_version': '2.2-history-safe',
                'agy_found': bool(exe),
                'version': agy_version(),
                'text_only': True,
                'token_required_for_generate': True,
                'token_valid': self._authorized(),
            })
            return
        self._json(404, {'ok': False, 'error': 'Not found'})

    def do_POST(self):
        if self.path.rstrip('/') != '/v1/generate':
            self._json(404, {'ok': False, 'error': 'Not found'})
            return
        if not self._authorized():
            self._json(401, {'ok': False, 'error': '브리지 토큰이 일치하지 않습니다.'})
            return
        try:
            length = int(self.headers.get('Content-Length', '0'))
            if length > 2_000_000:
                raise ValueError('요청이 너무 큽니다.')
            body = json.loads(self.rfile.read(length) or b'{}')
            prompt = str(body.get('prompt', '')).strip()
            if not prompt:
                raise ValueError('prompt가 비어 있습니다.')
            model = str(body.get('model', '')).strip()
            effort = str(body.get('effort', 'medium')).strip().lower()
            result = run_agy(prompt, model=model, effort=effort)
            self._json(200, {'ok': True, **result})
        except subprocess.TimeoutExpired:
            self._json(504, {'ok': False, 'error': 'Antigravity 응답 시간이 5분을 초과했습니다.'})
        except Exception as e:
            self._json(500, {'ok': False, 'error': str(e)})


def main():
    print('')
    print('============================================================')
    print(' Seoteuk Mate — Antigravity DEV Bridge')
    print('============================================================')
    print(f' 주소 : http://{HOST}:{PORT}')
    print(f' 토큰 : {TOKEN}')
    print(f' agy  : {find_agy() or "NOT FOUND"}')
    print('')
    print('웹앱의 ⚡ 안티그래비티 DEV 버튼을 누른 뒤 위 토큰을 입력하세요.')
    print('이 브리지는 127.0.0.1 에만 열리며, 생성 요청에는 토큰이 필요합니다.')
    print('종료: Ctrl+C')
    print('============================================================')
    print('')
    server = ThreadingHTTPServer((HOST, PORT), Handler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == '__main__':
    main()
