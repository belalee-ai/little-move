"""Build contact sheets and confirm distinct rendered states; requires Pillow."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageChops, ImageStat
import json
out=Path('proof/coverage')
font=ImageFont.truetype('public/fonts/NotoSansSC.ttf',13)
items=list(range(178,291))
results=[]
for code in items:
    pics=[Image.open(out/f'{code}-{stage}.png').convert('RGB') for stage in ['early','middle','return']]
    deltas=[sum(ImageStat.Stat(ImageChops.difference(pics[0],im)).mean)/3 for im in pics[1:]]
    assert max(deltas)>0, (code,deltas)
    results.append({'code':str(code),'frames':[66,228,384],'meanPixelChange':deltas})
for stage in ['early','middle','return']:
    for page,offset in enumerate(range(0,len(items),20),1):
        sheet=Image.new('RGB',(1200,1080),'#fafaf7')
        draw=ImageDraw.Draw(sheet)
        for j,code in enumerate(items[offset:offset+20]):
            im=Image.open(out/f'{code}-{stage}.png'); im.thumbnail((288,180))
            x=(j%4)*300+6; y=(j//4)*216+4
            sheet.paste(im,(x,y)); draw.text((x+6,y+187),str(code),font=font,fill='#555')
        sheet.save(out/f'{stage}-sheet-{page:02}.jpg',quality=88)
(out/'render-results.json').write_text(json.dumps({'rendered':113,'expected':113,'stills':339,'frames':[66,228,384],'errors':[],'frameComparisons':results},ensure_ascii=False,indent=2)+'\n')
print('PASS: 339 readable PNGs; all 113 scenes have distinct states. Visual review still required.')
