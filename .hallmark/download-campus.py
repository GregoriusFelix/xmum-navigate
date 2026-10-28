import json
import pathlib
import re
import urllib.parse
import urllib.request

names = [('Xiamen University Malaysia at afternoon.jpg', 'campus'), ('Xiamen University Malaysia library.jpg', 'library'), ('Xmumtree.jpg', 'walkway')]
records = []
for name, slug in names:
    url = 'https://commons.wikimedia.org/wiki/File:' + urllib.parse.quote(name.replace(' ', '_'))
    request = urllib.request.Request(url, headers={'User-Agent': 'XMUMNavigate/1.0 student project'})
    html = urllib.request.urlopen(request, timeout=30).read().decode()
    matches = re.findall(r'https://upload.wikimedia.org/wikipedia/commons/[^"<> ]+?\.(?:jpg|JPG)', html)
    image = next((s for s in matches if '/1280px-' in s), matches[0])
    target = pathlib.Path('frontend/public/images/' + slug + '.jpg')
    if not target.exists():
        data = urllib.request.urlopen(urllib.request.Request(image, headers={'User-Agent': 'XMUMNavigate/1.0'}), timeout=30).read()
        target.write_bytes(data)
    records.append({'title': name, 'source': url, 'image': image, 'public_domain': 'PD-self' in html, 'author': re.findall(r'Author[\s\S]{0,600}', html)[:1]})
    print(slug, target.stat().st_size)
    pathlib.Path('frontend/public/images/sources.json').write_text(json.dumps(records, indent=2))
pathlib.Path('frontend/public/images/sources.json').write_text(json.dumps(records, indent=2))
