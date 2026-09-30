import zlib
import struct

def recolor_png(input_path, output_path, recolor_fn):
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
    decomp = zlib.decompress(b''.join(idat))
    stride = 1 + w * 4
    
    new_raw = bytearray()
    for y in range(h):
        new_raw.append(0) # filter type 0
        row_start = y * stride + 1
        for x in range(w):
            idx = row_start + x * 4
            r = decomp[idx]
            g = decomp[idx+1]
            b = decomp[idx+2]
            a = decomp[idx+3]
            
            nr, ng, nb, na = recolor_fn(x, y, w, h, r, g, b, a)
            new_raw.extend([nr, ng, nb, na])
            
    def make_chunk(chunk_type, chunk_data):
        return struct.pack('>I', len(chunk_data)) + chunk_type + chunk_data + struct.pack('>I', zlib.crc32(chunk_type + chunk_data) & 0xffffffff)

    png_header = b'\x89PNG\r\n\x1a\n'
    ihdr_data = struct.pack('>IIBBBBB', w, h, 8, 6, 0, 0, 0)
    ihdr_chunk = make_chunk(b'IHDR', ihdr_data)
    idat_chunk = make_chunk(b'IDAT', zlib.compress(bytes(new_raw), level=9))
    iend_chunk = make_chunk(b'IEND', b'')
    
    with open(output_path, 'wb') as f:
        f.write(png_header + ihdr_chunk + idat_chunk + iend_chunk)
    print(f"Generated {output_path}")

# Palette definitions
EMERALD = (6, 214, 160)     # #06D6A0
BRUNSWICK = (12, 65, 55)    # #0C4137
POLAR = (245, 251, 248)     # #F5FBF8 / #E6FBF6

# 1. Icon in Emerald #06D6A0
def recolor_icon_emerald(x, y, w, h, r, g, b, a):
    if a < 2:
        return 0, 0, 0, 0
    # Keep alpha perfectly smooth anti-aliased
    return EMERALD[0], EMERALD[1], EMERALD[2], a

recolor_png('frontend/public/brand/logo_icon.png', 'frontend/public/brand/logo_icon.png', recolor_icon_emerald)

# 2. Full logo: Icon in Emerald #06D6A0, Wordmark in Polar White #F5FBF8
def recolor_full_hybrid(x, y, w, h, r, g, b, a):
    if a < 2:
        return 0, 0, 0, 0
    if x < 455:
        # Icon part: Emerald
        return EMERALD[0], EMERALD[1], EMERALD[2], a
    else:
        # Wordmark part: Polar White (like Monestra logo in reference!)
        return POLAR[0], POLAR[1], POLAR[2], a

recolor_png('frontend/public/brand/logo_full.png', 'frontend/public/brand/logo_full.png', recolor_full_hybrid)

# 3. All Emerald full logo
def recolor_full_all_emerald(x, y, w, h, r, g, b, a):
    if a < 2:
        return 0, 0, 0, 0
    return EMERALD[0], EMERALD[1], EMERALD[2], a

recolor_png('frontend/public/brand/logo_full.png', 'frontend/public/brand/logo_emerald.png', recolor_full_all_emerald)
