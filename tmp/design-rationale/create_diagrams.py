from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import math

OUT = Path(r'E:\WebGames\Dainik Bhaskar\tmp\design-rationale')
OUT.mkdir(parents=True, exist_ok=True)
BLACK = '#111111'
LINE = '#444444'
MUTED = '#666666'
COLORS = {
    'lavender': ('#F2EDF8', '#B4A0CF'),
    'ochre': ('#FBF3E4', '#CAA65C'),
    'sage': ('#EFF5ED', '#9EB593'),
    'terracotta': ('#FBEEE8', '#CF9F89'),
    'blue': ('#EDF3F9', '#9BB5D2'),
}

def font(size, bold=False):
    return ImageFont.truetype(r'C:\Windows\Fonts\arialbd.ttf' if bold else r'C:\Windows\Fonts\arial.ttf', size)

def centered_lines(draw, cx, y, lines, size=44, bold=False, spacing=8, fill=BLACK):
    f = font(size, bold)
    for line in lines:
        bbox = draw.textbbox((0,0), line, font=f)
        draw.text((cx - (bbox[2]-bbox[0])/2, y-bbox[1]), line, font=f, fill=fill)
        y += size + spacing
    return y

def arrow(draw, points, fill=LINE, width=4, head=14):
    draw.line(points, fill=fill, width=width, joint='curve')
    x,y=points[-1]; px,py=points[-2]
    a=math.atan2(y-py,x-px)
    p1=(x-head*math.cos(a-0.5),y-head*math.sin(a-0.5))
    p2=(x-head*math.cos(a+0.5),y-head*math.sin(a+0.5))
    draw.polygon([(x,y),p1,p2],fill=fill)

def dashed_arrow(draw, points, fill='#888888', width=3, dash=12, gap=10):
    for (x1,y1),(x2,y2) in zip(points[:-1],points[1:]):
        length=math.hypot(x2-x1,y2-y1)
        dx=(x2-x1)/length; dy=(y2-y1)/length
        n=0
        while n<length:
            end=min(n+dash,length)
            draw.line([(x1+n*dx,y1+n*dy),(x1+end*dx,y1+end*dy)], fill=fill,width=width)
            n+=dash+gap
    x,y=points[-1];px,py=points[-2];a=math.atan2(y-py,x-px);head=13
    draw.polygon([(x,y),(x-head*math.cos(a-0.5),y-head*math.sin(a-0.5)),(x-head*math.cos(a+0.5),y-head*math.sin(a+0.5))],fill=fill)

def box(draw, xy, accent):
    bg,edge=COLORS[accent]
    draw.rounded_rectangle(xy, radius=18, fill=bg, outline=edge, width=3)

im=Image.new('RGB',(2000,600),'white');d=ImageDraw.Draw(im)
nodes=[
    (['News','reader'], ['Short breaks','Familiar language'],'lavender'),
    (['Reader','motivation'], ['Curiosity','Reflection','Excitement','Skill','Discovery'],'ochre'),
    (['Small','interaction'], ['Guess','Complete','Play six balls','Aim','Match'],'sage'),
    (['Meaningful','result'], ['Learn','Share','Improve','Read'],'blue'),
]
for i,(titles,body,color) in enumerate(nodes):
    x=55+i*490;cx=x+210
    box(d,(x,55,x+420,545),color)
    centered_lines(d,cx,93,titles,size=48,bold=True,spacing=5)
    centered_lines(d,cx,243,body,size=43,spacing=11)
    if i<3:
        arrow(d,[(x+433,300),(x+477,300)],width=4,head=14)
im.save(OUT/'diagram-selection.png',dpi=(300,300))

im=Image.new('RGB',(2000,700),'white');d=ImageDraw.Draw(im)
top=[
    (90,['Bhaskar news','or game home'],'lavender'),
    (565,['Choose','one game'],'ochre'),
    (1040,['Short','play'],'sage'),
    (1515,['Meaning or','personal result'],'blue'),
]
for i,(x,labels,color) in enumerate(top):
    box(d,(x,40,x+370,200),color)
    centered_lines(d,x+185,72,labels,size=44,bold=True,spacing=8)
    if i<3:
        arrow(d,[(x+385,120),(x+460,120)],width=4,head=14)

# The result offers two optional follow-up actions.
d.line([(1700,200),(1700,275),(885,275)],fill=LINE,width=4,joint='curve')
arrow(d,[(885,275),(885,318)],width=4,head=14)
arrow(d,[(1550,275),(1550,318)],width=4,head=14)

box(d,(610,320,1160,465),'blue')
centered_lines(d,885,349,['Read related story'],size=43,bold=True,spacing=8)
centered_lines(d,885,411,['Where relevant'],size=40,spacing=8,fill=BLACK)
box(d,(1250,320,1850,465),'terracotta')
centered_lines(d,1550,338,['Share a thought or challenge'],size=40,bold=True,spacing=8)
centered_lines(d,1550,411,['By choice'],size=40,spacing=8,fill=BLACK)

# Either action can form part of a later visit.
d.line([(885,465),(885,505),(1550,505),(1550,465)],fill=LINE,width=4,joint='curve')
arrow(d,[(1225,505),(1225,553)],width=4,head=14)
box(d,(665,555,1785,680),'sage')
centered_lines(d,1225,576,['Return tomorrow'],size=44,bold=True,spacing=8)
centered_lines(d,1225,637,['Fresh content or a new skill challenge'],size=40,spacing=8)

# Reading and sharing are optional; the reader can simply finish for today.
arrow(d,[(1885,120),(1970,120),(1970,618),(1785,618)],width=4,head=14)
centered_lines(d,1870,498,['Finish for','today'],size=36,spacing=7,fill=BLACK)

# A quiet return path keeps the main left-to-right reading flow clear.
dashed_arrow(d,[(665,617),(55,617),(55,238),(750,238),(750,200)])
centered_lines(d,330,565,['Next visit'],size=36,spacing=8,fill=MUTED)
im.save(OUT/'diagram-journey.png',dpi=(300,300))
print(OUT/'diagram-selection.png')
print(OUT/'diagram-journey.png')
