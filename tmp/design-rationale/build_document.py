from pathlib import Path
import re
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.opc.constants import RELATIONSHIP_TYPE as RT

ROOT = Path(r'E:\WebGames\Dainik Bhaskar')
SOURCE = ROOT / 'Doc' / 'Bhaskar Daily Games Design Rationale.md'
OUT = ROOT / 'output' / 'design-rationale'
OUT.mkdir(parents=True, exist_ok=True)
doc = Document()
sec = doc.sections[0]
sec.page_width = Inches(8.2677)
sec.page_height = Inches(11.6929)
sec.top_margin = Inches(.60)
sec.bottom_margin = Inches(.60)
sec.left_margin = Inches(.68)
sec.right_margin = Inches(.68)
sec.header_distance = Inches(.25)
sec.footer_distance = Inches(.25)

def font_style(style, size, bold=False):
    style.font.name = 'Arial'
    style.font.size = Pt(size)
    style.font.bold = bold
    style.font.color.rgb = RGBColor(0, 0, 0)
    rf = style.element.get_or_add_rPr().get_or_add_rFonts()
    for key in ('ascii', 'hAnsi'):
        rf.set(qn('w:'+key), 'Arial')
    rf.set(qn('w:cs'), 'Nirmala UI')
    rf.set(qn('w:eastAsia'), 'Nirmala UI')

normal = doc.styles['Normal']
font_style(normal, 11)
normal.paragraph_format.line_spacing = 1.1
normal.paragraph_format.space_after = Pt(6)
normal.paragraph_format.widow_control = True
font_style(doc.styles['Title'], 23, True)
doc.styles['Title'].paragraph_format.space_after = Pt(7)
font_style(doc.styles['Heading 1'], 20, True)
doc.styles['Heading 1'].paragraph_format.space_before = Pt(0)
doc.styles['Heading 1'].paragraph_format.space_after = Pt(10)
font_style(doc.styles['Heading 2'], 14, True)
doc.styles['Heading 2'].paragraph_format.space_before = Pt(9)
doc.styles['Heading 2'].paragraph_format.space_after = Pt(5)
for name in ('Title', 'Heading 1', 'Heading 2'):
    doc.styles[name].paragraph_format.keep_with_next = True
    borders = doc.styles[name].element.xpath('.//w:pBdr')
    for border in borders:
        border.getparent().remove(border)

hdr = sec.header.paragraphs[0]
hdr.alignment = WD_ALIGN_PARAGRAPH.LEFT
r = hdr.add_run('BHASKAR GAME LAB 2026')
r.font.name = 'Arial'
r.font.size = Pt(8)
r.font.color.rgb = RGBColor(0, 0, 0)
hdr.paragraph_format.space_after = Pt(0)

ftr = sec.footer.paragraphs[0]
ftr.alignment = WD_ALIGN_PARAGRAPH.RIGHT
r = ftr.add_run('Design rationale  |  ')
r.font.name = 'Arial'
r.font.size = Pt(8)
field = OxmlElement('w:fldSimple')
field.set(qn('w:instr'), 'PAGE')
ftr._p.append(field)

def rich(p, text, size=None):
    for segment in re.split(r'(\*\*.*?\*\*)', text):
        bold = segment.startswith('**') and segment.endswith('**')
        segment = segment[2:-2] if bold else segment
        for chunk in re.split(r'([\u0900-\u097F][\u0900-\u097F\s]*)', segment):
            if not chunk:
                continue
            run = p.add_run(chunk)
            run.bold = bold
            if re.search(r'[\u0900-\u097F]', chunk):
                run.font.name = 'Nirmala UI'
                run.font.size = Pt(size or 12)
                run._element.get_or_add_rPr().get_or_add_rFonts().set(qn('w:cs'), 'Nirmala UI')
            elif size:
                run.font.size = Pt(size)

def hyperlink(p, label, url, size=8.5):
    link = OxmlElement('w:hyperlink')
    link.set(qn('r:id'), p.part.relate_to(url, RT.HYPERLINK, is_external=True))
    r = OxmlElement('w:r')
    props = OxmlElement('w:rPr')
    color = OxmlElement('w:color')
    color.set(qn('w:val'), '000000')
    props.append(color)
    sz = OxmlElement('w:sz')
    sz.set(qn('w:val'), str(int(size*2)))
    props.append(sz)
    underline = OxmlElement('w:u')
    underline.set(qn('w:val'), 'single')
    props.append(underline)
    r.append(props)
    t = OxmlElement('w:t')
    t.text = label
    r.append(t)
    link.append(r)
    p._p.append(link)

page = 1
first = True
references = False
for block in SOURCE.read_text(encoding='utf-8').split('\n\n'):
    block = block.strip()
    if not block:
        continue
    if block == '<!-- page -->':
        doc.add_page_break()
        page += 1
        continue
    if block.startswith('<!-- diagram-'):
        filename = block[5:-4].strip()
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(4)
        p.paragraph_format.space_after = Pt(7)
        p.add_run().add_picture(str(ROOT / 'tmp' / 'design-rationale' / filename), width=Inches(6.9077))
        drawing = p._p.xpath('.//wp:docPr')
        if drawing:
            drawing[0].set('descr', 'Design reasoning flow from reader motivation to interaction and meaningful result' if 'selection' in filename else 'Intended reader journey with optional related reading and sharing and a new challenge on another day')
        continue
    if block.startswith('# '):
        p = doc.add_paragraph(block[2:], 'Title' if first else 'Heading 1')
        first = False
        continue
    if block.startswith('## '):
        heading = block[3:]
        if heading == 'References':
            references = True
            p = doc.add_paragraph(heading, 'Heading 2')
            for r in p.runs:
                r.font.size = Pt(10)
        else:
            p = doc.add_paragraph(heading, 'Heading 2')
        continue
    p = doc.add_paragraph()
    if page == 1 and block.startswith('How the brief'):
        rich(p, block, 12)
        p.paragraph_format.space_after = Pt(8)
    elif block.startswith('GBL 2026 submission'):
        rich(p, block, 9)
        p.paragraph_format.space_after = Pt(12)
    elif re.match(r'^आज', block):
        rich(p, block, 12)
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.keep_with_next = True
    elif references:
        text, *url = re.split(r'(https://\S+)', block)
        rich(p, text, 8.5)
        if url:
            hyperlink(p, 'Publisher listing', url[0])
        p.paragraph_format.line_spacing = 1.05
        p.paragraph_format.space_after = Pt(4)
    else:
        rich(p, block)

doc.core_properties.title = 'Design Rationale for Bhaskar Daily Games'
doc.core_properties.subject = 'Game Lab 2026 product rationale and future scope'
doc.core_properties.author = 'Bhaskar Game Lab submission team'
doc.core_properties.keywords = 'daily games, Hindi, design rationale, Bhaskar'
doc.core_properties.comments = ''
path = OUT / 'Bhaskar Daily Games Design Rationale.docx'
doc.save(path)
print(path)
