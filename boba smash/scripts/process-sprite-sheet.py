#!/usr/bin/env python3
"""
Process a 2x3 capybara sprite sheet:
  - Splits into 6 individual sprites
  - Makes white/near-white background transparent
  - Saves as transparent PNGs

Usage:
  python3 scripts/process-sprite-sheet.py <input-image> <character-id>

Example:
  python3 scripts/process-sprite-sheet.py ~/Downloads/star-sheet.png star

Output goes to: src/assets/characters/<character-id>/
  - <id>-boba.png       (row 0, col 0)
  - <id>-sunglasses.png (row 0, col 1)
  - <id>-bow.png        (row 0, col 2)
  - <id>-coconut.png    (row 1, col 0)
  - <id>-flower-crown.png (row 1, col 1)
  - <id>-hat.png        (row 1, col 2)
  - <id>-base.png       (row 1, col 2 copy, used as default/no-accessory)
"""

import sys
import os
from PIL import Image
import numpy as np

# Accessory mapping: (row, col) -> filename suffix
ACCESSORY_MAP = [
    # Row 0
    ('boba',         0, 0),
    ('sunglasses',   0, 1),
    ('bow',          0, 2),
    # Row 1
    ('coconut',      1, 0),
    ('flower-crown', 1, 1),
    ('hat',          1, 2),
]

def make_transparent(img, threshold=240):
    """Replace white/near-white pixels with transparency."""
    data = np.array(img.convert('RGBA'))
    # Find pixels where R, G, B are all above threshold
    white_mask = (data[:, :, 0] > threshold) & \
                 (data[:, :, 1] > threshold) & \
                 (data[:, :, 2] > threshold)
    data[white_mask, 3] = 0  # Set alpha to 0
    return Image.fromarray(data)

def find_sprite_bounds(img, start_x, start_y, cell_w, cell_h):
    """Find the actual non-transparent bounding box within a cell."""
    cell = img.crop((start_x, start_y, start_x + cell_w, start_y + cell_h))
    cell = make_transparent(cell)
    bbox = cell.getbbox()
    if bbox:
        return cell.crop(bbox), bbox
    return cell, None

def process_sheet(input_path, character_id):
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_dir = os.path.dirname(script_dir)
    output_dir = os.path.join(project_dir, 'src', 'assets', 'characters', character_id)
    os.makedirs(output_dir, exist_ok=True)

    img = Image.open(input_path)
    w, h = img.size
    print(f"Input image: {w}x{h}")

    cols = 3
    rows = 2
    cell_w = w // cols
    cell_h = h // rows
    print(f"Cell size: {cell_w}x{cell_h}")

    # Find the maximum bounding box across all sprites for consistent sizing
    all_bounds = []
    for name, row, col in ACCESSORY_MAP:
        x = col * cell_w
        y = row * cell_h
        cell = img.crop((x, y, x + cell_w, y + cell_h))
        cell = make_transparent(cell)
        bbox = cell.getbbox()
        if bbox:
            all_bounds.append(bbox)

    if not all_bounds:
        print("Error: No non-transparent content found!")
        return

    # Use the union of all bounding boxes for consistent framing
    min_x = min(b[0] for b in all_bounds)
    min_y = min(b[1] for b in all_bounds)
    max_x = max(b[2] for b in all_bounds)
    max_y = max(b[3] for b in all_bounds)

    # Add small padding
    pad = 4
    min_x = max(0, min_x - pad)
    min_y = max(0, min_y - pad)
    max_x = min(cell_w, max_x + pad)
    max_y = min(cell_h, max_y + pad)

    crop_w = max_x - min_x
    crop_h = max_y - min_y
    print(f"Unified crop: ({min_x},{min_y}) to ({max_x},{max_y}) = {crop_w}x{crop_h}")

    saved = []
    for name, row, col in ACCESSORY_MAP:
        x = col * cell_w
        y = row * cell_h
        cell = img.crop((x, y, x + cell_w, y + cell_h))
        cell = make_transparent(cell)
        # Apply unified crop
        cropped = cell.crop((min_x, min_y, max_x, max_y))
        out_path = os.path.join(output_dir, f"{character_id}-{name}.png")
        cropped.save(out_path, 'PNG')
        saved.append(out_path)
        print(f"  Saved: {character_id}-{name}.png ({cropped.size[0]}x{cropped.size[1]})")

    # Also save the hat variant as the "base" (no accessory) version
    # since hat is the most neutral look
    base_src = os.path.join(output_dir, f"{character_id}-hat.png")
    base_dst = os.path.join(output_dir, f"{character_id}-base.png")
    if os.path.exists(base_src):
        import shutil
        shutil.copy2(base_src, base_dst)
        print(f"  Saved: {character_id}-base.png (copy of hat variant)")

    # Also create a "scene" version (flower-crown variant, good for story scenes)
    scene_src = os.path.join(output_dir, f"{character_id}-flower-crown.png")
    scene_dst = os.path.join(output_dir, f"{character_id}-scene.png")
    if os.path.exists(scene_src):
        import shutil
        shutil.copy2(scene_src, scene_dst)
        print(f"  Saved: {character_id}-scene.png (copy of flower-crown variant)")

    print(f"\nDone! {len(saved) + 2} sprites saved to {output_dir}")

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: python3 process-sprite-sheet.py <input-image> <character-id>")
        print("Example: python3 process-sprite-sheet.py ~/Downloads/star-sheet.png star")
        sys.exit(1)

    process_sheet(sys.argv[1], sys.argv[2])
