#!/bin/bash
API_KEY="AIzaSyBW_pepeo3TWa3GBjmpXz0yaCEvfjROYHQ"
MODEL="gemini-3.1-flash-image-preview"
API_URL="https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}"
OUTPUT_DIR="/Users/egehakankaraagac/Documents/GitHub/ai-interview/public/images"

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
        print(json.dumps(data, indent=2)[:800])
except Exception as e:
    print(f'Error: {e}')
    print(json.dumps(data, indent=2)[:800])
"
}

generate_image "A sleek minimal abstract digital artwork for a dark-themed tech startup hero section. Evokes AI-powered coding and technical interviews. Deep indigo and violet tones with electric cyan and warm amber accent glows. Abstract geometric shapes like interconnected nodes, flowing data streams, holographic code fragments floating in dark space. No text, no people, no faces. Ultra modern cinematic lighting. Wide 16:9 aspect ratio. Clean negative space." "hero-abstract"

generate_image "Minimal abstract digital artwork showing AI analysis and intelligent scoring for a dark tech website. Data flowing through geometric neural pathways with glowing score indicators and analysis nodes. Deep dark background near black with electric violet and cyan accent lighting. Abstract, no text, no people, no UI mockups. Floating geometric shapes suggesting intelligence and evaluation. Clean modern cinematic. Wide format." "ai-scoring"

generate_image "Abstract dark background texture for a premium tech website. Subtle geometric grid pattern with faint glowing nodes at intersections. Deep navy-black base with very subtle indigo and cyan light traces. Minimal elegant not busy. Works as a background behind text. No text no objects just abstract atmospheric texture. Dark and moody." "bg-texture"

generate_image "Abstract digital artwork showing real-time collaboration and live observation for a dark tech website. Two abstract geometric viewports or holographic windows connected by flowing data streams and light particles. Deep dark background with warm amber and electric cyan accent glows. Suggests live monitoring, session replay, observation. No text no people no faces. Ultra-modern sleek minimal. Wide format." "session-visual"

echo ""
echo "Done! Generated images:"
ls -la "${OUTPUT_DIR}/"
