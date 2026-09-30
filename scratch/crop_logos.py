import os
import zlib
import struct

def crop_png(input_path, output_path, pad=16):
    with open(input_path, 'rb') as f:
        data = f.read()
    
    w, h = struct.unpack('>II', data[16:24])
    pos = 8
    idat_chunks = []
    while pos < len(data):
        length = struct.unpack('>I', data[pos:pos+4])[0]
        chunk_type = data[pos+4:pos+8]
        if chunk_type == b'IDAT':
            idat_chunks.append(data[pos+8:pos+8+length])
        pos += 12 + length
        
    decompressed = zlib.decompress(b''.join(idat_chunks))
    stride = 1 + w * 4
    
    # Find bounding box
    min_x, max_x = w, 0
    min_y, max_y = h, 0
    for y in range(h):
        line = decompressed[y*stride + 1 : (y+1)*stride]
        for x in range(w):
            alpha = line[x*4 + 3]
            if alpha > 10:
                if x < min_x: min_x = x
                if x > max_x: max_x = x
                if y < min_y: min_y = y
                if y > max_y: max_y = y
                
    if min_x > max_x or min_y > max_y:
        print(f"Skipping {input_path}, empty image")
        return

    # Add padding
    crop_x1 = max(0, min_x - pad)
    crop_y1 = max(0, min_y - pad)
    crop_x2 = min(w - 1, max_x + pad)
    crop_y2 = min(h - 1, max_y + pad)
    
    new_w = crop_x2 - crop_x1 + 1
    new_h = crop_y2 - crop_y1 + 1
    
    # Extract cropped scanlines
    new_raw = bytearray()
    for y in range(crop_y1, crop_y2 + 1):
        new_raw.append(0) # filter type none
        start_idx = y * stride + 1 + crop_x1 * 4
        end_idx = start_idx + new_w * 4
        new_raw.extend(decompressed[start_idx:end_idx])
        
    # Build valid PNG
    def make_chunk(chunk_type, chunk_data):
        return struct.pack('>I', len(chunk_data)) + chunk_type + chunk_data + struct.pack('>I', zlib.crc32(chunk_type + chunk_data) & 0xffffffff)

    png_header = b'\x89PNG\r\n\x1a\n'
    ihdr_data = struct.pack('>IIBBBBB', new_w, new_h, 8, 6, 0, 0, 0)
    ihdr_chunk = make_chunk(b'IHDR', ihdr_data)
    idat_chunk = make_chunk(b'IDAT', zlib.compress(bytes(new_raw), level=9))
    iend_chunk = make_chunk(b'IEND', b'')
    
    with open(output_path, 'wb') as f:
        f.write(png_header + ihdr_chunk + idat_chunk + iend_chunk)
        
    print(f"Saved {output_path}: {new_w}x{new_h} (cropped from {w}x{h})")

crop_png('frontend/public/brand/1_transparent.png', 'frontend/public/brand/logo_icon.png', pad=12)
crop_png('frontend/public/brand/1_white.png', 'frontend/public/brand/logo_icon_white.png', pad=12)
crop_png('frontend/public/brand/3_transparent.png', 'frontend/public/brand/logo_full.png', pad=12)
crop_png('frontend/public/brand/3_white.png', 'frontend/public/brand/logo_full_white.png', pad=12)
