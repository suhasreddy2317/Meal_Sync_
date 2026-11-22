# scripts/extract-food-images.py
# Extracts the 28 authentic dish images from the user's master image sheet
# and saves them into public/images/dishes/ with high quality Lanczos resampling.

import os
from PIL import Image

MASTER_IMG_PATH = r"C:\Users\User\.gemini\antigravity\brain\3d162387-ca20-44d6-bf09-0e17bc2dc39e\.user_uploaded\media_1795237040236_1abfc44f.jpg"
OUTPUT_DIR = r"C:\Users\User\Desktop\mess management system\public\images\dishes"

os.makedirs(OUTPUT_DIR, exist_ok=True)
master = Image.open(MASTER_IMG_PATH)
w, h = master.size
print(f"Loaded master image: {w}x{h}")

# Row definitions: (row_name, y_top, y_photo_bottom, y_full_bottom)
# The food photo is cleanly contained between y_top and y_photo_bottom (avoiding the bottom black pill)
rows = [
    ("breakfast", 12, 146, 168),
    ("lunch",     182, 316, 338),
    ("snacks",    352, 486, 508),
    ("dinner",    522, 656, 678),
]

# Column definitions (7 columns):
cols = [
    (157, 276),
    (280, 399),
    (403, 522),
    (525, 645),
    (648, 768),
    (771, 891),
    (894, 1014),
]

dishes = [
    # Row 0: Breakfast
    ["idli", "dosa", "masala_dosa", "upma", "pongal", "poori", "aloo_paratha"],
    # Row 1: Lunch
    ["rice_sambar", "curd_rice", "veg_pulav", "chana_masala", "dal_rice", "chicken_biryani", "fish_curry"],
    # Row 2: Snacks
    ["samosa", "aloo_bonda", "veg_cutlet", "corn_chat", "masala_tea", "egg_roll", "chicken_65"],
    # Row 3: Dinner
    ["chapati_dal", "paneer_naan", "veg_fried_rice", "mixed_veg_curry", "curd", "chicken_curry", "egg_curry"],
]

extracted_count = 0

for r_idx, (r_name, y1, y_photo, y_full) in enumerate(rows):
    for c_idx, (x1, x2) in enumerate(cols):
        slug = dishes[r_idx][c_idx]
        
        # Crop the clean food photo (with 2px inner padding to avoid border lines)
        food_crop = master.crop((x1 + 2, y1 + 2, x2 - 2, y_photo - 2))
        
        # Upscale with Lanczos to crisp 480x480 resolution for high-DPI displays
        hq_food = food_crop.resize((480, 480), Image.Resampling.LANCZOS)
        out_path = os.path.join(OUTPUT_DIR, f"{slug}.jpg")
        hq_food.save(out_path, "JPEG", quality=95)
        
        extracted_count += 1
        print(f"  ✅ Extracted [{r_name}] {slug} -> public/images/dishes/{slug}.jpg")

# Also create backward compatibility aliases for existing dishes so no old paths break:
aliases = {
    "tea.jpg": "masala_tea.jpg",
    "coffee.jpg": "masala_tea.jpg", # fallback if coffee requested
    "roti.jpg": "chapati_dal.jpg",
    "rice.jpg": "rice_sambar.jpg",
    "pulao.jpg": "veg_pulav.jpg",
    "biryani.jpg": "chicken_biryani.jpg",
    "paneer.jpg": "paneer_naan.jpg",
    "dal.jpg": "chapati_dal.jpg",
    "dal_makhani.jpg": "chapati_dal.jpg",
    "chole.jpg": "chana_masala.jpg",
    "sambar.jpg": "rice_sambar.jpg",
    "rajma.jpg": "chana_masala.jpg",
    "aloo_gobhi.jpg": "mixed_veg_curry.jpg",
    "vada.jpg": "aloo_bonda.jpg",
    "poha.jpg": "upma.jpg",
    "biscuits.jpg": "veg_cutlet.jpg",
}

for alias_name, target_name in aliases.items():
    target_path = os.path.join(OUTPUT_DIR, target_name)
    alias_path = os.path.join(OUTPUT_DIR, alias_name)
    if os.path.exists(target_path):
        img_data = Image.open(target_path)
        img_data.save(alias_path, "JPEG", quality=95)
        print(f"  🔗 Linked alias {alias_name} -> {target_name}")

print(f"\n🎉 Extraction complete! Total extracted: {extracted_count} dishes into {OUTPUT_DIR}")
