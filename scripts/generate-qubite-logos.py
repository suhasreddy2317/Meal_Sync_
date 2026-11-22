# scripts/generate-qubite-logos.py
# Generates legacy source logo assets for the application branding workflow.

import os
import shutil
from PIL import Image, ImageOps
import numpy as np

src_path = "C:/Users/User/.gemini/antigravity/brain/3d162387-ca20-44d6-bf09-0e17bc2dc39e/.user_uploaded/media_1795239068785_b933bcec.jpg"
public_images_dir = "public/images"
public_dir = "public"
app_dir = "app"

os.makedirs(public_images_dir, exist_ok=True)

# 1. Exact direct copy of the uploaded file
dest_raw_jpg = os.path.join(public_images_dir, "qubite-logo.jpg")
shutil.copy(src_path, dest_raw_jpg)
print(f"✅ Saved exact raw copy: {dest_raw_jpg}")

img = Image.open(src_path).convert("RGB")
w, h = img.size

# Find exact bounding box of the logo elements (Q, cloche, steam, sparks)
arr = np.array(img)
bg_color = np.array([252, 250, 238])
diff = np.abs(arr.astype(int) - bg_color).sum(axis=-1)
mask = diff > 15
y_idxs, x_idxs = np.where(mask)

x_min, y_min = x_idxs.min(), y_idxs.min()
x_max, y_max = x_idxs.max(), y_idxs.max()
print(f"Detected logo bounds: x=({x_min}, {x_max}), y=({y_min}, {y_max})")

# Add a slight balanced breathing margin (~12px) around the logo bounds
margin = 12
crop_x1 = max(0, x_min - margin)
crop_y1 = max(0, y_min - margin)
crop_x2 = min(w, x_max + margin)
crop_y2 = min(h, y_max + margin)

cropped_logo = img.crop((crop_x1, crop_y1, crop_x2, crop_y2))
cw, ch = cropped_logo.size
print(f"Cropped logo size: {cw}x{ch}")

# 2. Centered High-Resolution 512x512 with authentic cream background
canvas_size = 512
bg_cream = (252, 250, 238)
cream_canvas = Image.new("RGB", (canvas_size, canvas_size), bg_cream)

# Scale cropped logo to fit nicely with ~48px padding (target width/height ~416px)
target_inner_size = 420
scale = min(target_inner_size / cw, target_inner_size / ch)
new_w, new_h = int(cw * scale), int(ch * scale)
scaled_logo = cropped_logo.resize((new_w, new_h), Image.Resampling.LANCZOS)

paste_x = (canvas_size - new_w) // 2
paste_y = (canvas_size - new_h) // 2
cream_canvas.paste(scaled_logo, (paste_x, paste_y))

dest_png = os.path.join(public_images_dir, "qubite-logo.png")
cream_canvas.save(dest_png, format="PNG", quality=100)
print(f"✅ Saved 512x512 cream background logo: {dest_png}")

# 3. Transparent PNG version (for dark sidebars or transparent badges)
# Smoothly key out the cream background
rgba_arr = np.array(cream_canvas.convert("RGBA"))
diff_canvas = np.abs(rgba_arr[:, :, :3].astype(int) - bg_color).sum(axis=-1)

# Inside the cloche or interior, preserve non-background colors.
# Alpha is 0 where diff < 15, smoothly ramp up to 255
alpha = np.clip((diff_canvas - 10) * 15, 0, 255).astype(np.uint8)
# In the center of the cloche or Q ring, the white/cream inside should be preserved if part of cloche
# But cloche background is the same cream. Let's make pure transparent outside the Q
rgba_arr[:, :, 3] = alpha
transparent_logo = Image.fromarray(rgba_arr)
dest_trans_png = os.path.join(public_images_dir, "qubite-logo-transparent.png")
transparent_logo.save(dest_trans_png, format="PNG")
print(f"✅ Saved 512x512 transparent logo: {dest_trans_png}")

# 4. Generate Favicons and App Icons
# Modern browsers support PNG favicons and multi-resolution ICO
favicon_ico_path = os.path.join(public_dir, "favicon.ico")
cream_canvas.save(
    favicon_ico_path,
    format="ICO",
    sizes=[(16, 16), (32, 32), (48, 48), (64, 64)]
)
print(f"✅ Saved multi-res favicon.ico: {favicon_ico_path}")

# Next.js App Router app/favicon.ico
app_favicon_path = os.path.join(app_dir, "favicon.ico")
shutil.copy(favicon_ico_path, app_favicon_path)
print(f"✅ Saved Next.js app/favicon.ico: {app_favicon_path}")

# app/icon.png (Next.js automatically uses app/icon.png as the high-res favicon)
app_icon_png = os.path.join(app_dir, "icon.png")
cream_canvas.resize((192, 192), Image.Resampling.LANCZOS).save(app_icon_png, format="PNG")
print(f"✅ Saved Next.js app/icon.png: {app_icon_png}")

# public/favicon.png and public/apple-touch-icon.png
public_fav_png = os.path.join(public_dir, "favicon.png")
cream_canvas.resize((32, 32), Image.Resampling.LANCZOS).save(public_fav_png, format="PNG")

apple_icon_path = os.path.join(public_dir, "apple-touch-icon.png")
cream_canvas.resize((180, 180), Image.Resampling.LANCZOS).save(apple_icon_path, format="PNG")
print(f"✅ Saved apple-touch-icon.png: {apple_icon_path}")

print("\n🎉 Legacy source logo assets successfully generated!")
