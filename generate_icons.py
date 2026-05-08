"""アプリアイコン生成スクリプト"""
import struct, zlib, os

def write_png(path, width, height, pixels):
    def chunk(name, data):
        c = name + data
        return struct.pack('>I', len(data)) + c + struct.pack('>I', zlib.crc32(c) & 0xffffffff)

    raw = b''
    for y in range(height):
        raw += b'\x00'
        for x in range(width):
            raw += bytes(pixels[y][x])

    ihdr = struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0)
    idat = zlib.compress(raw)

    with open(path, 'wb') as f:
        f.write(b'\x89PNG\r\n\x1a\n')
        f.write(chunk(b'IHDR', ihdr))
        f.write(chunk(b'IDAT', idat))
        f.write(chunk(b'IEND', b''))

def make_icon(size, path):
    bg   = (26, 26, 46)
    acc  = (78, 204, 163)
    white = (255, 255, 255)

    pixels = [[list(bg) for _ in range(size)] for _ in range(size)]

    # 背景を丸角に
    r = size // 5
    cx, cy = size // 2, size // 2
    for y in range(size):
        for x in range(size):
            dx, dy = x - cx, y - cy
            corner = False
            for ox, oy in [(-1,-1),(1,-1),(-1,1),(1,1)]:
                rx = abs(dx) - (cx - r)
                ry = abs(dy) - (cy - r)
                if rx > 0 and ry > 0 and rx*rx + ry*ry > r*r:
                    corner = True
            if corner:
                pixels[y][x] = [0, 0, 0, 0] if False else list(bg)

    # カート の簡易描画
    s = size // 8
    ox = size // 4
    oy = size // 3

    # カートの本体（台形）
    for y in range(oy, oy + s*2):
        for x in range(ox, ox + s*5):
            pixels[y][x] = list(acc)

    # カートのハンドル
    for y in range(oy - s, oy + 1):
        for x in range(ox + s*4, ox + s*5 + 2):
            pixels[y][x] = list(acc)

    # 車輪（円）
    for wheel_cx in [ox + s, ox + s*4]:
        wheel_cy = oy + s*2 + s//2 + 2
        wr = s // 2 + 2
        for y in range(wheel_cy - wr, wheel_cy + wr + 1):
            for x in range(wheel_cx - wr, wheel_cx + wr + 1):
                if 0 <= y < size and 0 <= x < size:
                    if (x - wheel_cx)**2 + (y - wheel_cy)**2 <= wr*wr:
                        pixels[y][x] = list(acc)

    write_png(path, size, size, pixels)
    print(f'生成: {path}')

os.makedirs('icons', exist_ok=True)
make_icon(192, 'icons/icon-192.png')
make_icon(512, 'icons/icon-512.png')
print('アイコン生成完了')
