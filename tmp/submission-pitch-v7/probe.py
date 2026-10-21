import zipfile
import copy
import xml.etree.ElementTree as ET
import re
from pathlib import Path
root = Path('E:/WebGames/Dainik Bhaskar')
src = root/'output/submission-pitch-v6/Dainik Bhaskar Khel - Submission v6.pptx'
with zipfile.ZipFile(src) as zin:
    original = zin.read('ppt/slides/slide2.xml')
    unique = original
    for i in range(5):
        unique = unique.replace(b'name="Illustrative everyday dialogue"', f'name="Illustrative everyday dialogue {i+1}"'.encode(),1)
    ns = {'p':'http://schemas.openxmlformats.org/presentationml/2006/main','a':'http://schemas.openxmlformats.org/drawingml/2006/main'}
    for key, uri in ns.items(): ET.register_namespace(key, uri)
    parsed = ET.fromstring(unique)
    for node in parsed.iter():
        for child in list(node):
            if child.tag.split('}')[-1] == 'extLst': node.remove(child)
    for i,node in enumerate(parsed.findall('.//p:cNvPr',ns),1): node.set('id',str(i))
    clean = ET.tostring(parsed,encoding='utf-8',xml_declaration=True)
    for geom in parsed.findall('.//a:prstGeom',ns):
        geom.set('prst','roundRect')
        for child in list(geom): geom.remove(child)
        ET.SubElement(geom,'{'+ns['a']+'}avLst')
    simple = ET.tostring(parsed,encoding='utf-8',xml_declaration=True)
    no_guides = re.sub(rb'<a:gd name="adj[12]" fmla="val -?\d+" />',b'',original)
    for label, xml in [
        ('roundrect', original.replace(b'wedgeRoundRectCallout', b'roundRect')),
        ('unique-names', unique),
        ('clean',clean),
        ('simple',simple),
        ('callout-no-guides',no_guides),
    ]:
        with zipfile.ZipFile(root/f'tmp/submission-pitch-v7/{label}.pptx','w',zipfile.ZIP_DEFLATED) as out:
            for entry in zin.infolist():
                out.writestr(copy.copy(entry), xml if entry.filename == 'ppt/slides/slide2.xml' else zin.read(entry.filename))
print('Created isolated slide-2 geometry probes')
