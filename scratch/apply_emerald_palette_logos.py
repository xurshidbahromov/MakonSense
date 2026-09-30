import zlib
import struct

def tint_white_png(input_path, output_path, tint_rule):
    with open(input_path, 'rb') as f:
        data = f.read()
    w, h = struct.unpack('>II', data[16:24])
    pos = 8
    idat = []
    while pos < len(data):
        l = struct.unpack('>I', data[pos:pos+4])[0]
        t = data[pos+4:pos+8]
        if t == b'IDAT': idat.append(data[pos+8:pos+8+l])
        pos += 12 + l
    decomp = bytearray(zlib.decompress(b''.join(idat)))
    stride = 1 + w * 4
    
    for y in range(h):
        for x in range(w):
            idx = y * stride + 1 + x * 4
            a = decomp[idx + 3]
            if a > 0:
                r, g, b = tint_rule(x, y, w, h)
                decomp[idx] = r
                decomp[idx + 1] = g
                decomp[idx + 2] = b
                
    def make_chunk(chunk_type, chunk_data):
        return struct.pack('>I', len(chunk_data)) + chunk_type + chunk_data + struct.pack('>I', zlib.crc32(chunk_type + chunk_data) & 0xffffffff)

    header = b'\x89PNG\r\n\x1a\n'
    ihdr = make_chunk(b'IHDR', struct.pack('>IIBBBBB', w, h, 8, 6, 0, 0, 0))
    new_idat = make_chunk(b'IDAT', zlib.compress(bytes(decomp), level=9))
    iend = make_chunk(b'IEND', b'')
    with open(output_path, 'wb') as f:
        f.write(header + ihdr + new_idat + iend)
    print(f"Tinted {output_path} ({w}x{h})")

# Exact colors from user's image:
EMERALD = (6, 214, 160)     # #06D6A0
POLAR = (230, 251, 246)     # #E6FBF6

# 1. logo_icon.png -> Pure Emerald #06D6A0
tint_white_png('frontend/public/brand/logo_icon_white.png', 'frontend/public/brand/logo_icon.png', lambda x, y, w, h: EMERALD)

# 2. logo_full.png -> Emerald icon + Polar white text
tint_white_png('frontend/public/brand/logo_full_white.png', 'frontend/public/brand/logo_full.png', lambda x, y, w, h: EMERALD if x < 455 else POLAR)

# 3. logo_emerald.png -> All emerald
tint_white_png('frontend/public/brand/logo_full_white.png', 'frontend/public/brand/logo_emerald.png', lambda x, y, w, h: EMERALD)
