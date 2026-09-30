import zlib
import struct
import math

def generate_clean_emerald_assets():
    # 1. Process 1.png (Icon only)
    with open('MakonSense Logo/1.png', 'rb') as f:
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
    stride = 1 + w * 3
    
    # Target palette from user's image:
    # Emerald: #06D6A0 -> (6, 214, 160)
    # Polar: #E6FBF6 -> (230, 251, 246)
    EMERALD_R, EMERALD_G, EMERALD_B = 6, 214, 160
    POLAR_R, POLAR_G, POLAR_B = 230, 251, 246

    # Icon bounds in 1.png are within [400..1600, 360..1560]
    # Find exact non-white bounding box within that region
    min_x, max_x = w, 0
    min_y, max_y = h, 0
    
    # Store rgba
    icon_rgba = {}
    for y in range(350, 1580):
        for x in range(400, 1600):
            idx = y * stride + 1 + x * 3
            r, g, b = decomp[idx], decomp[idx+1], decomp[idx+2]
            
            # Distance from white
            dr = 255 - r
            dg = 255 - g
            db = 255 - b
            dist = math.sqrt(dr*dr + dg*dg + db*db)
            
            if dist > 20: # glyph pixel
                # Smooth alpha between dist=20 and dist=160
                t = min(1.0, max(0.0, (dist - 20) / (160 - 20)))
                alpha = int(255 * (t ** 0.85))
                if alpha > 8:
                    icon_rgba[(x, y)] = alpha
                    if x < min_x: min_x = x
                    if x > max_x: max_x = x
                    if y < min_y: min_y = y
                    if y > max_y: max_y = y
                    
    pad = 16
    cx1 = max(0, min_x - pad)
    cy1 = max(0, min_y - pad)
    cx2 = min(w - 1, max_x + pad)
    cy2 = min(h - 1, max_y + pad)
    nw = cx2 - cx1 + 1
    nh = cy2 - cy1 + 1
    
    # Write cropped logo_icon.png
    raw_icon = bytearray()
    for y in range(cy1, cy2 + 1):
        raw_icon.append(0)
        for x in range(cx1, cx2 + 1):
            a = icon_rgba.get((x, y), 0)
            raw_icon.extend([EMERALD_R, EMERALD_G, EMERALD_B, a])
            
    def make_png(width, height, raw_bytes, out_path):
        def make_chunk(chunk_type, chunk_data):
            return struct.pack('>I', len(chunk_data)) + chunk_type + chunk_data + struct.pack('>I', zlib.crc32(chunk_type + chunk_data) & 0xffffffff)

        header = b'\x89PNG\r\n\x1a\n'
        ihdr = make_chunk(b'IHDR', struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0))
        idat = make_chunk(b'IDAT', zlib.compress(bytes(raw_bytes), level=9))
        iend = make_chunk(b'IEND', b'')
        with open(out_path, 'wb') as f:
            f.write(header + ihdr + idat + iend)
        print(f"Saved {out_path}: {width}x{height}")

    make_png(nw, nh, raw_icon, 'frontend/public/brand/logo_icon.png')
    
    # 2. Process 3.png (Horizontal Icon + MakonSense text)
    with open('MakonSense Logo/3.png', 'rb') as f:
        data3 = f.read()
    w3, h3 = struct.unpack('>II', data3[16:24])
    pos = 8
    idat3 = []
    while pos < len(data3):
        l = struct.unpack('>I', data3[pos:pos+4])[0]
        t = data3[pos+4:pos+8]
        if t == b'IDAT': idat3.append(data3[pos+8:pos+8+l])
        pos += 12 + l
    decomp3 = zlib.decompress(b''.join(idat3))
    stride3 = 1 + w3 * 3
    
    min_x3, max_x3 = w3, 0
    min_y3, max_y3 = h3, 0
    full_rgba = {}
    
    for y in range(350, 1580):
        for x in range(300, 1850):
            idx = y * stride3 + 1 + x * 3
            r, g, b = decomp3[idx], decomp3[idx+1], decomp3[idx+2]
            dr = 255 - r
            dg = 255 - g
            db = 255 - b
            dist = math.sqrt(dr*dr + dg*dg + db*db)
            
            if dist > 20:
                t = min(1.0, max(0.0, (dist - 20) / (160 - 20)))
                alpha = int(255 * (t ** 0.85))
                if alpha > 8:
                    full_rgba[(x, y)] = alpha
                    if x < min_x3: min_x3 = x
                    if x > max_x3: max_x3 = x
                    if y < min_y3: min_y3 = y
                    if y > max_y3: max_y3 = y
                    
    cx1_3 = max(0, min_x3 - pad)
    cy1_3 = max(0, min_y3 - pad)
    cx2_3 = min(w3 - 1, max_x3 + pad)
    cy2_3 = min(h3 - 1, max_y3 + pad)
    nw3 = cx2_3 - cx1_3 + 1
    nh3 = cy2_3 - cy1_3 + 1
    
    # In 3.png, icon ends around x=800, text starts around x=820
    # Generate Hybrid: Icon in Emerald, Text in Polar White (Monestra style!)
    raw_hybrid = bytearray()
    for y in range(cy1_3, cy2_3 + 1):
        raw_hybrid.append(0)
        for x in range(cx1_3, cx2_3 + 1):
            a = full_rgba.get((x, y), 0)
            if x < 800:
                raw_hybrid.extend([EMERALD_R, EMERALD_G, EMERALD_B, a])
            else:
                raw_hybrid.extend([POLAR_R, POLAR_G, POLAR_B, a])
    make_png(nw3, nh3, raw_hybrid, 'frontend/public/brand/logo_full.png')
    
    # Generate All Emerald version
    raw_all_emerald = bytearray()
    for y in range(cy1_3, cy2_3 + 1):
        raw_all_emerald.append(0)
        for x in range(cx1_3, cx2_3 + 1):
            a = full_rgba.get((x, y), 0)
            raw_all_emerald.extend([EMERALD_R, EMERALD_G, EMERALD_B, a])
    make_png(nw3, nh3, raw_all_emerald, 'frontend/public/brand/logo_emerald.png')

generate_clean_emerald_assets()
