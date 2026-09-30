import zlib
import struct

def unfilter_png(filepath):
    with open(filepath, 'rb') as f:
        data = f.read()
    w, h = struct.unpack('>II', data[16:24])
    pos = 8
    idat = []
    while pos < len(data):
        l = struct.unpack('>I', data[pos:pos+4])[0]
        t = data[pos+4:pos+8]
        if t == b'IDAT': idat.append(data[pos+8:pos+8+l])
        pos += 12 + l
    compressed = b''.join(idat)
    raw = zlib.decompress(compressed)
    bpp = 3
    stride = 1 + w * bpp
    unfiltered = bytearray(w * h * bpp)
    prev_row = bytearray(w * bpp)
    for y in range(h):
        filter_type = raw[y * stride]
        curr_raw = raw[y * stride + 1 : (y + 1) * stride]
        curr_row = bytearray(w * bpp)
        for x in range(w * bpp):
            filt = curr_raw[x]
            a = curr_row[x - bpp] if x >= bpp else 0
            b = prev_row[x]
            c = prev_row[x - bpp] if x >= bpp else 0
            if filter_type == 0: val = filt
            elif filter_type == 1: val = (filt + a) & 0xff
            elif filter_type == 2: val = (filt + b) & 0xff
            elif filter_type == 3: val = (filt + ((a + b) // 2)) & 0xff
            elif filter_type == 4:
                p = a + b - c; pa, pb, pc = abs(p - a), abs(p - b), abs(p - c)
                pr = a if pa <= pb and pa <= pc else (b if pb <= pc else c)
                val = (filt + pr) & 0xff
            curr_row[x] = val
        unfiltered[y * w * bpp : (y + 1) * w * bpp] = curr_row
        prev_row = curr_row
    return w, h, unfiltered

# Colors from user's image:
EMERALD = (6, 214, 160)     # #06D6A0
POLAR = (230, 251, 246)     # #E6FBF6

def make_png(width, height, raw_bytes, out_path):
    def make_chunk(chunk_type, chunk_data):
        return struct.pack('>I', len(chunk_data)) + chunk_type + chunk_data + struct.pack('>I', zlib.crc32(chunk_type + chunk_data) & 0xffffffff)

    header = b'\x89PNG\r\n\x1a\n'
    ihdr = make_chunk(b'IHDR', struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0))
    idat = make_chunk(b'IDAT', zlib.compress(bytes(raw_bytes), level=9))
    iend = make_chunk(b'IEND', b'')
    with open(out_path, 'wb') as f:
        f.write(header + ihdr + idat + iend)
    print(f"Created {out_path} ({width}x{height})")

# 1. Process 1.png (Icon)
w, h, rgb = unfilter_png('MakonSense Logo/1.png')
# Glyph bbox was: x=[651, 1359], y=[546, 1445]
pad = 16
x1 = max(0, 651 - pad)
x2 = min(w - 1, 1359 + pad)
y1 = max(0, 546 - pad)
y2 = min(h - 1, 1445 + pad)
nw = x2 - x1 + 1
nh = y2 - y1 + 1

raw_icon = bytearray()
for y in range(y1, y2 + 1):
    raw_icon.append(0)
    for x in range(x1, x2 + 1):
        idx = (y * w + x) * 3
        r, g, b = rgb[idx], rgb[idx+1], rgb[idx+2]
        # Anti-aliasing alpha from white background
        # Blue logo has r=5..40, white has r=250..255
        if r > 248 and g > 248 and b > 248:
            alpha = 0
        else:
            # Fraction of glyph
            frac = max(0.0, min(1.0, (254.0 - r) / (254.0 - 5.0)))
            alpha = int(255 * (frac ** 1.05))
            if alpha < 4: alpha = 0
        raw_icon.extend([EMERALD[0], EMERALD[1], EMERALD[2], alpha])

make_png(nw, nh, raw_icon, 'frontend/public/brand/logo_icon.png')

# 2. Process 3.png (Horizontal Logo)
w3, h3, rgb3 = unfilter_png('MakonSense Logo/3.png')
# Find bbox in 3.png
min_x3, max_x3 = w3, 0
min_y3, max_y3 = h3, 0
for y in range(h3):
    for x in range(w3):
        idx = (y * w3 + x) * 3
        r, g, b = rgb3[idx], rgb3[idx+1], rgb3[idx+2]
        if b > 80 and b > r + 30:
            if x < min_x3: min_x3 = x
            if x > max_x3: max_x3 = x
            if y < min_y3: min_y3 = y
            if y > max_y3: max_y3 = y

x1_3 = max(0, min_x3 - pad)
x2_3 = min(w3 - 1, max_x3 + pad)
y1_3 = max(0, min_y3 - pad)
y2_3 = min(h3 - 1, max_y3 + pad)
nw3 = x2_3 - x1_3 + 1
nh3 = y2_3 - y1_3 + 1

# Gap between icon and text in 3.png is around x=820
raw_full = bytearray()
raw_emerald = bytearray()
for y in range(y1_3, y2_3 + 1):
    raw_full.append(0)
    raw_emerald.append(0)
    for x in range(x1_3, x2_3 + 1):
        idx = (y * w3 + x) * 3
        r, g, b = rgb3[idx], rgb3[idx+1], rgb3[idx+2]
        if r > 248 and g > 248 and b > 248:
            alpha = 0
        else:
            frac = max(0.0, min(1.0, (254.0 - r) / (254.0 - 5.0)))
            alpha = int(255 * (frac ** 1.05))
            if alpha < 4: alpha = 0
            
        # Hybrid: Icon Emerald, Wordmark Polar White
        if x < 815:
            raw_full.extend([EMERALD[0], EMERALD[1], EMERALD[2], alpha])
        else:
            raw_full.extend([POLAR[0], POLAR[1], POLAR[2], alpha])
            
        raw_emerald.extend([EMERALD[0], EMERALD[1], EMERALD[2], alpha])

make_png(nw3, nh3, raw_full, 'frontend/public/brand/logo_full.png')
make_png(nw3, nh3, raw_emerald, 'frontend/public/brand/logo_emerald.png')
