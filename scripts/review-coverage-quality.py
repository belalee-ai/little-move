from pathlib import Path
from PIL import Image,ImageDraw,ImageFont,ImageStat,ImageChops
import json
root=Path('proof/coverage-quality'); stages=list('abcdef');codes=list(range(178,291));font=ImageFont.truetype('public/fonts/NotoSansSC.ttf',16);rows=[]
for code in codes:
    images=[Image.open(root/f'{code}-{stage}.png').convert('RGB') for stage in stages]
    changes=[sum(ImageStat.Stat(ImageChops.difference(images[i],images[i+1])).mean)/3 for i in range(5)]
    assert max(changes)>.05,(code,changes)
    rows.append({'code':str(code),'adjacentFrameChanges':changes})
for page,start in enumerate(range(0,len(codes),10),1):
    sheet=Image.new('RGB',(1200,1490),'#fafaf7');draw=ImageDraw.Draw(sheet)
    for row,code in enumerate(codes[start:start+10]):
        draw.text((7,row*149+3),str(code),font=font,fill='#30383b')
        for col,stage in enumerate(stages):
            im=Image.open(root/f'{code}-{stage}.png');im.thumbnail((196,122));sheet.paste(im,(col*200+2,row*149+25))
    sheet.save(root/f'sequence-{page:02}.jpg',quality=90)
(root/'frame-review.json').write_text(json.dumps({'items':113,'frames':678,'seconds':[.6,1.4,2.5,3.9,5.6,6.9],'errors':[], 'itemsWithMotion':rows},indent=2)+'\n')
print('PASS 113 scenes / 678 actual frame renders, all non-static. Contact sheets require visual review.')
