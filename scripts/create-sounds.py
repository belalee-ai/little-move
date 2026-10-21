"""Original, deterministic SFX. No samples or third-party audio are used."""
import math, random, struct, wave, pathlib, json
ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / 'public' / 'sounds'
OUT.mkdir(exist_ok=True)
RATE = 48000
DURATIONS = {'tap': .075, 'tick': .045, 'sweep': .44, 'land': .23,
             'chime': .42, 'glitch': .16, 'error': .22, 'paper': .24}
manifest = []
for kind, duration in DURATIONS.items():
    rng = random.Random(1307)
    values = []
    low = 0
    phase = 0
    for i in range(round(duration * RATE)):
        t = i / RATE
        p = t / duration
        noise = rng.uniform(-1, 1)
        low += .13 * (noise - low)
        edge = min(1, t / .003, (duration-t) / .012)
        if kind == 'tap':
            value = (math.sin(2*math.pi*620*t)*.7 + low*.4) * math.exp(-t*65)
        elif kind == 'tick':
            value = (noise*.22 + math.sin(2*math.pi*1350*t)*.35) * math.exp(-t*110)
        elif kind == 'sweep':
            value = (noise-low) * math.sin(math.pi*p)**2 * .38
        elif kind == 'land':
            phase += 2*math.pi*(95 + 180*math.exp(-t*24))/RATE
            value = (math.sin(phase)*.6 + low*.16) * math.exp(-t*22)
        elif kind == 'chime':
            value = (math.sin(2*math.pi*660*t)*.36 + math.sin(2*math.pi*990*t)*.24) * math.exp(-t*10)
        elif kind == 'glitch':
            value = (noise*.25 + math.sin(2*math.pi*(380 if int(t*85)%2 else 740)*t)*.2) * math.exp(-t*22)
        elif kind == 'error':
            value = (math.sin(2*math.pi*(330-200*p)*t)*.35 + low*.12) * math.sin(math.pi*p)**2
        else:
            value = (noise-low)*.4 * math.sin(math.pi*p)**2 * (.65+.35*math.sin(t*105)**2)
        values.append(value * edge * .78)
    with wave.open(str(OUT/(kind+'.wav')), 'wb') as f:
        f.setparams((1, 2, RATE, len(values), 'NONE', 'not compressed'))
        f.writeframes(b''.join(struct.pack('<h', round(v*32767)) for v in values))
    manifest.append({'id':kind,'file':kind+'.wav','seconds':duration,'sampleRate':RATE,
                     'peak':round(max(abs(v) for v in values),5)})
(OUT/'manifest.json').write_text(json.dumps({'provenance':'Independently synthesized by this project; no third-party samples.', 'files':manifest}, indent=2)+'\n')
print('Generated',len(manifest),'original sound effects')
