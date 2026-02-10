from PIL import Image, ImageDraw, ImageFont
import os

# Create images directory if not exists
os.makedirs('.', exist_ok=True)

# Define sizes
sizes = [(16, 16), (32, 32), (180, 180), (192, 192), (512, 512)]

for size in sizes:
    # Create new image with gradient background
    img = Image.new('RGB', size, color='#2563eb')
    draw = ImageDraw.Draw(img)
    
    # Draw gradient effect
    for y in range(size[1]):
        color_value = int(37 + (124 - 37) * y / size[1])  # Blue to purple gradient
        r = int(37 + (124 - 37) * y / size[1])
        g = int(99 + (58 - 99) * y / size[1])
        b = int(235 + (237 - 235) * y / size[1])
        draw.line([(0, y), (size[0], y)], fill=(r, g, b))
    
    # Draw rounded rectangle
    margin = size[0] // 10
    draw.rounded_rectangle(
        [(margin, margin), (size[0] - margin, size[1] - margin)],
        radius=size[0] // 5,
        outline='white',
        width=max(2, size[0] // 50)
    )
    
    # Add "CV" text
    try:
        font_size = size[0] // 2
        # Try to use a system font
        try:
            font = ImageFont.truetype("arial.ttf", font_size)
        except:
            font = ImageFont.truetype("C:\\Windows\\Fonts\\arial.ttf", font_size)
    except:
        font = ImageFont.load_default()
    
    text = "CV"
    # Get text bounding box
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    position = ((size[0] - text_width) // 2, (size[1] - text_height) // 2 - size[1] // 20)
    draw.text(position, text, fill='white', font=font)
    
    # Save as PNG
    filename = f'favicon-{size[0]}x{size[1]}.png'
    img.save(filename, 'PNG')
    print(f'Created {filename}')

# Create apple-touch-icon (same as 180x180)
img = Image.open('favicon-180x180.png')
img.save('apple-touch-icon.png', 'PNG')
print('Created apple-touch-icon.png')

# Create OG image (1200x630)
og_img = Image.new('RGB', (1200, 630), color='#2563eb')
og_draw = ImageDraw.Draw(og_img)

# Draw gradient
for y in range(630):
    r = int(37 + (124 - 37) * y / 630)
    g = int(99 + (58 - 99) * y / 630)
    b = int(235 + (237 - 235) * y / 630)
    og_draw.line([(0, y), (1200, y)], fill=(r, g, b))

# Add large CV text
try:
    og_font = ImageFont.truetype("C:\\Windows\\Fonts\\arialbd.ttf", 200)
    og_font_sub = ImageFont.truetype("C:\\Windows\\Fonts\\arial.ttf", 60)
except:
    og_font = ImageFont.load_default()
    og_font_sub = ImageFont.load_default()

og_text = "CV Maker Pro"
og_bbox = og_draw.textbbox((0, 0), og_text, font=og_font)
og_text_width = og_bbox[2] - og_bbox[0]
og_draw.text(((1200 - og_text_width) // 2, 150), og_text, fill='white', font=og_font)

subtitle = "Create Professional Resumes & Presentations"
sub_bbox = og_draw.textbbox((0, 0), subtitle, font=og_font_sub)
sub_text_width = sub_bbox[2] - sub_bbox[0]
og_draw.text(((1200 - sub_text_width) // 2, 400), subtitle, fill='white', font=og_font_sub)

og_img.save('og-image.png', 'PNG')
print('Created og-image.png')

print('\nAll favicons generated successfully!')
