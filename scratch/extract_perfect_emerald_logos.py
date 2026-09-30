import zlib
import struct
import math

def process_logo(input_path, output_path, recolor_fn, pad=16):
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
    stride = 1 + w * 3 # RGB format
    
    # 1. Compute alpha and recolor in full resolution
    rgba_grid = []
    min_x, max_x = w, 0
    min_y, max_y = h, 0
    
    for y in range(h):
        row = []
        row_offset = y * stride + 1
        for x in range(w):
            idx = row_offset + x * 3
            r = decomp[idx]
            g = decomp[idx+1]
            b = decomp[idx+2]
            
            # Distance from pure white (255, 255, 255)
            # In RGB space, white is 255,255,255. The blue logo has r~25, g~80, b~155
            # So dist_white for blue is sqrt((255-25)^2 + (255-80)^2 + (255-155)^2) ~ 296
            dr = 255 - r
            dg = 255 - g
            db = 255 - b
            dist = math.sqrt(dr*dr + dg*dg + db*db)
            
            # Thresholding with smooth anti-aliased edge
            if dist < 12:
                alpha = 0
            elif dist > 180:
                alpha = 255
            else:
                # Smooth quadratic interpolation between 12 and 180
                t_val = (dist - 12) / (180 - 12)
                alpha = int(255 * (t_val ** 0.9))
                
            if alpha > 10:
                if x < min_x: min_x = x
                if x > max_x: max_x = x
                if y < min_y: min_y = y
                if y > max_y: max_y = y
                
            nr, ng, nb = recolor_fn(x, y, w, h, r, g, b, alpha)
            row.append((nr, ng, nb, alpha))
        rgba_grid.append(row)
        
    # 2. Crop to bounding box
    crop_x1 = max(0, min_x - pad)
    crop_y1 = max(0, min_y - pad)
    crop_x2 = min(w - 1, max_x + pad)
    crop_y2 = min(h - 1, max_y + pad)
    
    new_w = crop_x2 - crop_x1 + 1
    new_h = crop_y2 - crop_y1 + 1
    
    new_raw = bytearray()
    for y in range(crop_y1, crop_y2 + 1):
        new_raw.append(0) # filter type 0
        for x in range(crop_x1, crop_x2 + 1):
            nr, ng, nb, na = rgba_grid[y][x]
            new_raw.extend([nr, ng, nb, na])
            
    # 3. Write PNG
    def make_chunk(chunk_type, chunk_data):
        return struct.pack('>I', len(chunk_data)) + chunk_type + chunk_data + struct.pack('>I', zlib.crc32(chunk_type + chunk_data) & 0xffffffff)

    png_header = b'\x89PNG\r\n\x1a\n'
    ihdr_data = struct.pack('>IIBBBBB', new_w, new_h, 8, 6, 0, 0, 0)
    ihdr_chunk = make_chunk(b'IHDR', ihdr_data)
    idat_chunk = make_chunk(b'IDAT', zlib.compress(bytes(new_raw), level=9))
    iend_chunk = make_chunk(b'IEND', b'')
    
    with open(output_path, 'wb') as f:
        f.write(png_header + ihdr_chunk + idat_chunk + iend_chunk)
    print(f"Generated {output_path} ({new_w}x{new_h})")

# Target palette
EMERALD = (6, 214, 160)     # #06D6A0
POLAR = (230, 251, 246)     # #E6FBF6 Polar

# 1. Icon in Emerald #06D6A0
def icon_emerald(x, y, w, h, r, g, b, a):
    return EMERALD

process_logo('MakonSense Logo/1.png', 'frontend/public/brand/logo_icon.png', icon_emerald, pad=12)

# 2. Full logo: Icon in Emerald, Wordmark in Polar White #E6FBF6
def full_hybrid(x, y, w, h, r, g, b, a):
    # In 2000x2000, icon is in x < 850
    if x < 850:
        return EMERALD
    else:
        return POLAR

process_logo('MakonSense Logo/3.png', 'frontend/public/brand/logo_full.png', full_hybrid, pad=14)

# 3. All Emerald full logo
def full_emerald(x, y, w, h, r, g, b, a):
    return EMERALD

process_logo('MakonSense Logo/3.png', 'frontend/public/brand/logo_emerald.png', full_emerald, pad=14)

# 4. All Polar white full logo
def full_polar(x, y, w, h, r, g, b, a):
    return POLAR

process_logo('MakonSense Logo/3.png', 'frontend/public/brand/logo_polar.png', full_polar, pad=14)
