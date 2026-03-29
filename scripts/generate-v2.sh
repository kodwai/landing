#!/bin/bash
API_KEY="AIzaSyBW_pepeo3TWa3GBjmpXz0yaCEvfjROYHQ"
MODEL="gemini-3.1-flash-image-preview"
API_URL="https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}"
OUT="/Users/egehakankaraagac/Documents/GitHub/ai-interview/public/images"

gen() {
  local prompt="$1" filename="$2"
  echo "  → ${filename}..."
  response=$(curl -s -X POST "${API_URL}" \
    -H "Content-Type: application/json" \
    -d "{\"contents\":[{\"parts\":[{\"text\":\"Generate an image: ${prompt}\"}]}],\"generationConfig\":{\"responseModalities\":[\"TEXT\",\"IMAGE\"]}}")
  echo "$response" | python3 -c "
import sys,json,base64
d=json.load(sys.stdin)
try:
 for p in d['candidates'][0]['content']['parts']:
  if 'inlineData' in p:
   ext='png' if 'png' in p['inlineData']['mimeType'] else 'jpg'
   open('${OUT}/${filename}.'+ext,'wb').write(base64.b64decode(p['inlineData']['data']))
   print(f'    ✓ ${filename}.{ext}')
   break
 else: print('    ✗ no image'); print(json.dumps(d,indent=2)[:400])
except Exception as e: print(f'    ✗ {e}'); print(json.dumps(d,indent=2)[:400])
"
}

echo "Generating Option C/D images..."

# Orb/sphere — abstract glowing AI brain orb for hero, transparent-feel on dark
gen "A single luminous ethereal orb floating in pure black void. The orb is made of swirling data streams, glowing cyan and violet light filaments, with tiny golden sparks. It looks like a condensed AI consciousness — an energy sphere. The background is completely pitch black (#000000). The orb should be centered and have a soft light bloom around it. Photorealistic render, 8K quality. Square format. No text." "orb-hero"

# Abstract flowing mesh — for use as a masked/clipped background accent
gen "Abstract 3D flowing mesh surface rendered in metallic rose gold and copper tones against a pure black background. The mesh has organic undulating waves like silk fabric caught mid-motion. Subtle iridescent reflections of teal and violet light on the metallic surface. Cinematic lighting from above. No text, no objects, just the flowing abstract metallic surface. Wide 16:9 format." "mesh-accent"

# Geometric crystal structure — for masked hero background
gen "A single large geometric crystal structure floating in pure black void. The crystal is made of semi-transparent glass planes with internal light refractions creating rainbow caustics. Edges glow with soft white and pale blue light. The crystal rotates slightly showing multiple facets. Think: a data diamond, a crystallized algorithm. Pure black background. Photorealistic 3D render. Square format. No text." "crystal-data"

# Particle field — for ambient background overlay
gen "Abstract field of thousands of tiny luminous particles scattered across a pure black background, forming a subtle wave pattern. The particles vary in size from tiny dots to small glowing spheres. Colors: predominantly white with hints of warm amber and cool teal. Looks like a distant galaxy or data visualization. The particle density is higher in the center creating a gentle focal point. Wide 16:9 format. No text." "particle-field"

# Circuit board closeup — for masked section accent
gen "Extreme macro closeup of a futuristic circuit board with glowing traces. The traces are made of liquid light in emerald green and gold. The background is deep matte black. Components appear as tiny glowing gems — rubies and sapphires. Shallow depth of field with beautiful bokeh. Photorealistic, cinematic. Wide 16:9 format. No text." "circuit-macro"

echo ""
echo "Done!"
ls -la "${OUT}/"
