#!/usr/bin/env python3
"""
Remove white/light background from sprite sheet and make it transparent
"""
from PIL import Image
import sys

def remove_white_background(input_path, output_path, threshold=240):
    """
    Remove white/light colored background from image
    
    Args:
        input_path: Path to input image
        output_path: Path to save output image
        threshold: RGB value threshold for considering a pixel as "white"
    """
    # Open image
    img = Image.open(input_path)
    img = img.convert("RGBA")
    
    # Get pixel data
    datas = img.getdata()
    
    newData = []
    for item in datas:
        # If pixel is whitish/grayish (all RGB values above threshold)
        # make it transparent
        if item[0] > threshold and item[1] > threshold and item[2] > threshold:
            newData.append((255, 255, 255, 0))  # Transparent
        else:
            newData.append(item)  # Keep original
    
    # Update image data
    img.putdata(newData)
    
    # Save as PNG with transparency
    img.save(output_path, "PNG")
    print(f"✓ Saved transparent version to: {output_path}")

if __name__ == "__main__":
    input_file = "/Users/nox/Library/Mobile Documents/com~apple~CloudDocs/bodygogo/public/pixel_girl_spritesheet_v4.png"
    output_file = "/Users/nox/Library/Mobile Documents/com~apple~CloudDocs/bodygogo/public/pixel_girl_spritesheet_v4_transparent.png"
    
    print(f"Processing: {input_file}")
    remove_white_background(input_file, output_file, threshold=230)
    print("Done!")
