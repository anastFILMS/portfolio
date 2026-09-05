import re, urllib.request, os, pathlib

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
OUT = pathlib.Path("/home/user/portfolio/public/fonts")
OUT.mkdir(parents=True, exist_ok=True)

FAMILIES = {
    "Oswald":          "Oswald:wght@400;500;700",
    "Caveat":          "Caveat:wght@700",
    "JetBrains Mono":  "JetBrains+Mono:wght@400;700",
    "Inter":           "Inter:wght@400;600",
}
# Нужны только кириллица и латиница — остальные подмножества выкидываем.
KEEP = ("cyrillic", "latin")

def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()

css_out = []
for fam, spec in FAMILIES.items():
    css = get(f"https://fonts.googleapis.com/css2?family={spec}&display=swap").decode()
    # Google помечает каждый блок комментарием с именем подмножества.
    blocks = re.split(r"/\*\s*([\w\-\[\]]+)\s*\*/", css)
    for i in range(1, len(blocks) - 1, 2):
        subset, body = blocks[i], blocks[i + 1]
        if subset not in KEEP:
            continue
        m = re.search(r"url\((https://[^)]+\.woff2)\)", body)
        w = re.search(r"font-weight:\s*(\d+)", body)
        s = re.search(r"font-style:\s*(\w+)", body)
        if not m:
            continue
        weight = w.group(1) if w else "400"
        slug = fam.lower().replace(" ", "-")
        fname = f"{slug}-{weight}-{subset}.woff2"
        (OUT / fname).write_bytes(get(m.group(1)))
        rng = re.search(r"unicode-range:\s*([^;]+);", body)
        css_out.append(
            "@font-face {\n"
            f"  font-family: '{fam}';\n"
            f"  font-style: {s.group(1) if s else 'normal'};\n"
            f"  font-weight: {weight};\n"
            "  font-display: swap;\n"
            f"  src: url('/fonts/{fname}') format('woff2');\n"
            + (f"  unicode-range: {rng.group(1).strip()};\n" if rng else "")
            + "}\n"
        )
        print("OK", fname, (OUT / fname).stat().st_size)

header = (
    "/* Шрифты вшиты в проект, а не подключены с fonts.googleapis.com.\n"
    " * Причины: сайт для российской аудитории (Google Fonts бывает недоступен),\n"
    " * нет обращения к стороннему домену на первом экране и нет скачка вёрстки\n"
    " * при поздней загрузке. Файлы лежат в public/fonts, только cyrillic+latin.\n"
    " *\n"
    " * Обновить набор: scripts/fetch-fonts.py\n"
    " */\n\n"
)
pathlib.Path("/home/user/portfolio/src/styles/fonts.css").write_text(header + "\n".join(css_out))
print("TOTAL", len(css_out), "faces")
