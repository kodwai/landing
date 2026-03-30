#!/bin/bash
API_KEY="AIzaSyBW_pepeo3TWa3GBjmpXz0yaCEvfjROYHQ"
MODEL="gemini-3.1-flash-image-preview"
API_URL="https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}"
OUTPUT_DIR="/Users/egehakankaraagac/Documents/GitHub/ai-interview/public/images/logos"

mkdir -p "${OUTPUT_DIR}"
mkdir -p "${OUTPUT_DIR}/no-bg"

generate_image() {
  local prompt="$1"
  local filename="$2"

  echo "Generating: ${filename}..."

  response=$(curl -s -X POST "${API_URL}" \
    -H "Content-Type: application/json" \
    -d "{
      \"contents\": [{
        \"parts\": [{
          \"text\": \"Generate an image: ${prompt}\"
        }]
      }],
      \"generationConfig\": {
        \"responseModalities\": [\"TEXT\", \"IMAGE\"]
      }
    }")

  echo "$response" | python3 -c "
import sys, json, base64
data = json.load(sys.stdin)
try:
    parts = data['candidates'][0]['content']['parts']
    for part in parts:
        if 'inlineData' in part:
            img_data = part['inlineData']['data']
            mime = part['inlineData']['mimeType']
            ext = 'png' if 'png' in mime else 'jpg' if 'jp' in mime else 'webp'
            with open('${OUTPUT_DIR}/${filename}.' + ext, 'wb') as f:
                f.write(base64.b64decode(img_data))
            print(f'Saved: ${filename}.{ext}')
            break
    else:
        print('No image in response')
        print(json.dumps(data, indent=2)[:500])
except Exception as e:
    print(f'Error: {e}')
    print(json.dumps(data, indent=2)[:500])
"
}

# Style context: Option E = "Paper Cut" style
# Colors: cream bg #faf8f4, dark text #1a1a1a, red accent #c23616
# Fonts: Instrument Serif, elegant editorial, minimal
# Overall: refined, editorial, clean, typographic

STYLE="Logo design for 'kodwai', an AI-powered technical interview platform. Style: refined editorial Paper Cut aesthetic. Colors: deep red #c23616 accent on clean cream #faf8f4 background. Typography-forward, elegant serif letterforms. Minimal, sophisticated, high-end editorial feel. The logo should be clean and work at small sizes. Square format, centered."

generate_image "${STYLE} Concept: Clean serif wordmark 'kodwai' with a subtle paper fold or cut on the 'k'. Elegant thin serif letterforms." "logo-01"

generate_image "${STYLE} Concept: Monogram logo using letters 'K' and 'W' intertwined in an elegant serif style. Red accent color. Geometric but refined." "logo-02"

generate_image "${STYLE} Concept: The word 'kodwai' in an italic serif typeface with the dot of the 'i' replaced by a small red diamond shape." "logo-03"

generate_image "${STYLE} Concept: A minimal logomark — abstract 'K' formed from two angular paper-cut shapes in red #c23616. Sharp geometric edges suggesting precision." "logo-04"

generate_image "${STYLE} Concept: 'kodwai' wordmark where the letters appear to be cut from paper with subtle shadow creating depth. Serif typeface, red color." "logo-05"

generate_image "${STYLE} Concept: Circular badge logo with 'KODWAI' around the perimeter in a mono typeface and a minimal AI circuit icon in the center. Red and dark tones." "logo-06"

generate_image "${STYLE} Concept: Elegant lowercase 'kodwai' with a horizontal red line cutting through the middle of all letters, suggesting a paper cut. Serif font." "logo-07"

generate_image "${STYLE} Concept: Letter 'K' as a standalone icon — constructed from two overlapping triangular paper shapes in red, creating negative space in the center." "logo-08"

generate_image "${STYLE} Concept: 'kodwai' in a refined serif with the 'ai' portion highlighted in red #c23616 while the rest is dark #1a1a1a. Clean and typographic." "logo-09"

generate_image "${STYLE} Concept: Abstract logomark — a folded paper crane silhouette in red, minimal and geometric. Suggests intelligence and precision." "logo-10"

generate_image "${STYLE} Concept: 'kodwai' stacked vertically, each letter on its own line, left-aligned, elegant serif, with a thin red vertical line on the left side." "logo-11"

generate_image "${STYLE} Concept: Monogram 'kw' in connected cursive serif letterforms. Flowing but precise. Single red color on cream." "logo-12"

generate_image "${STYLE} Concept: The word 'kodwai' with a razor-thin slash cutting diagonally across all letters. Editorial, sharp, dynamic. Dark text with red slash." "logo-13"

generate_image "${STYLE} Concept: Hexagonal badge containing 'K' in an elegant serif. Thin red border. Minimal interior. Suggests code and structure." "logo-14"

generate_image "${STYLE} Concept: 'kodwai' in spaced-out uppercase letters, thin serif weight, with red dots between each letter. Elegant and structured." "logo-15"

generate_image "${STYLE} Concept: Abstract mark — two overlapping circles with a 'K' negative space formed in the intersection. Red gradient on cream." "logo-16"

generate_image "${STYLE} Concept: 'kodwai' wordmark with an underscore cursor blinking after the last letter, suggesting code and terminals. Serif italic style." "logo-17"

generate_image "${STYLE} Concept: Paper-cut style — the word 'kodwai' appears to emerge from a torn paper edge at the bottom. Red paper revealing dark text beneath." "logo-18"

generate_image "${STYLE} Concept: Minimal bracket logo: [ kodwai ] with red square brackets framing the serif wordmark. Clean developer aesthetic meets editorial." "logo-19"

generate_image "${STYLE} Concept: Abstract 'K' formed by intersecting lines at precise angles, reminiscent of Japanese calligraphy strokes. Red ink on cream. Minimal and bold." "logo-20"

echo ""
echo "=== Logo generation complete ==="
echo ""
echo "Generated logos:"
ls -la "${OUTPUT_DIR}/"
echo ""
echo "Now removing backgrounds..."

# Remove backgrounds using Python/Pillow
python3 << 'PYEOF'
import os
import glob

try:
    from PIL import Image
except ImportError:
    print("Installing Pillow...")
    os.system("pip3 install Pillow")
    from PIL import Image

logo_dir = "/Users/egehakankaraagac/Documents/GitHub/ai-interview/public/images/logos"
nobg_dir = os.path.join(logo_dir, "no-bg")
os.makedirs(nobg_dir, exist_ok=True)

# Find all logo files
logos = sorted(glob.glob(os.path.join(logo_dir, "logo-*.*")))

for logo_path in logos:
    filename = os.path.basename(logo_path)
    name, ext = os.path.splitext(filename)
    out_path = os.path.join(nobg_dir, f"{name}.png")

    try:
        img = Image.open(logo_path).convert("RGBA")
        pixels = img.load()
        w, h = img.size

        # Sample corners to detect background color
        corners = []
        for x, y in [(0,0), (w-1,0), (0,h-1), (w-1,h-1),
                      (5,5), (w-6,5), (5,h-6), (w-6,h-6)]:
            corners.append(pixels[x, y][:3])

        # Average corner color = background
        bg_r = sum(c[0] for c in corners) // len(corners)
        bg_g = sum(c[1] for c in corners) // len(corners)
        bg_b = sum(c[2] for c in corners) // len(corners)

        # Tolerance for background removal
        tolerance = 42

        for y in range(h):
            for x in range(w):
                r, g, b, a = pixels[x, y]
                dr = abs(r - bg_r)
                dg = abs(g - bg_g)
                db = abs(b - bg_b)
                dist = (dr + dg + db) / 3

                if dist < tolerance:
                    pixels[x, y] = (r, g, b, 0)
                elif dist < tolerance + 20:
                    # Smooth edge transition
                    alpha = int(255 * (dist - tolerance) / 20)
                    pixels[x, y] = (r, g, b, min(a, alpha))

        img.save(out_path, "PNG")
        print(f"BG removed: {filename} -> no-bg/{name}.png")
    except Exception as e:
        print(f"Error processing {filename}: {e}")

print("\nDone! Background-removed logos saved to no-bg/")
PYEOF

echo ""
echo "Final output:"
ls -la "${OUTPUT_DIR}/no-bg/"
