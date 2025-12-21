from PIL import Image
import os

# Paths
INPUT_PATH = r"c:\Users\dinko\Projects\PNWS\tryg-app\public\assets\sprites\family-presence.png"
OUTPUT_PATH = r"c:\Users\dinko\Projects\PNWS\tryg-app\public\assets\avatars\juzu.png"

def crop_juzu():
    try:
        img = Image.open(INPUT_PATH)
        width, height = img.size
        
        # Grid assumption: 4 columns, 2 rows (based on user image)
        # Beanie man is 3rd in top row.
        col_width = width / 4
        row_height = height / 2
        
        # Crop coordinates (left, top, right, bottom)
        # 3rd column (index 2), 1st row (index 0)
        left = 2 * col_width
        top = 0
        right = 3 * col_width
        bottom = row_height
        
        # Crop
        juzu_face = img.crop((left, top, right, bottom))
        
        # Resize to standard avatar size (e.g. 256x256) for better quality if needed, 
        # but original extraction is best.
        
        # Ensure output directory exists
        os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
        
        juzu_face.save(OUTPUT_PATH)
        print(f"Successfully saved Juzu avatar to {OUTPUT_PATH}")
        
    except Exception as e:
        print(f"Error extracting Juzu: {e}")

if __name__ == "__main__":
    crop_juzu()
