$ErrorActionPreference = 'Stop'
$root   = 'E:\WebGames\Dainik Bhaskar'
$v7     = "$root\output\submission-pitch-v7\Dainik Bhaskar Khel - Submission v7.pptx"
$outDir = "$root\output\submission-pitch-v8"
$v8     = "$outDir\Dainik Bhaskar Khel - Submission v8.pptx"
$scr    = 'C:\Users\Suhas\AppData\Local\Temp\claude\E--WebGames-Dainik-Bhaskar\ba8863da-7010-428c-a46d-cc4465a2e443\scratchpad\v8'
$homeShot   = "$root\output\app-media-2026-10-14\01-collection-home.png"
$icons = @{
  shabd   = "$root\tmp\submission-pitch-v5\assets\wordal-static.svg"
  niti    = "$scr\assets\niti-static.svg"
  over    = "$scr\assets\cricket-static.svg"
  nishana = "$root\tmp\submission-pitch-v5\assets\carrom-static.svg"
  jodi    = "$root\tmp\submission-pitch-v5\assets\jodo-static.svg"
}

New-Item -ItemType Directory -Force $outDir | Out-Null
Copy-Item $v7 $v8 -Force

function C([string]$hex) { [int]('0x' + $hex.Substring(4,2)) * 65536 + [int]('0x' + $hex.Substring(2,2)) * 256 + [int]('0x' + $hex.Substring(0,2)) }
$INK = C '20201F'; $MUTED = C '61605D'; $TEAL = C '315A61'

function Add-Text($slide, $name, $text, $x, $y, $w, $h, $font, $size, $color, [bool]$bold = $false, $align = 1) {
  $s = $slide.Shapes.AddTextbox(1, $x, $y, $w, $h)
  $s.Name = $name
  $tf = $s.TextFrame
  $tf.WordWrap = -1; $tf.AutoSize = 0
  $tf.MarginLeft = 0; $tf.MarginRight = 0; $tf.MarginTop = 0; $tf.MarginBottom = 0
  $tf.VerticalAnchor = 1
  $tf.TextRange.Text = $text
  $f = $tf.TextRange.Font
  try { $f.Name = $font } catch { throw "Name failed: $font" }
  try { $f.Size = [single]$size } catch { throw "Size failed: $size ($($size.GetType().Name))" }
  try { $f.Color.RGB = $color } catch { throw "Color failed: $color ($($color.GetType().Name))" }
  try { $f.Bold = $(if ($bold) { -1 } else { 0 }) } catch { throw "Bold failed: $bold" }
  $tf.TextRange.ParagraphFormat.Alignment = $align
  return $s
}

function Add-Line($slide, $name, $x1, $y1, $x2, $y2, $color, $weight, [bool]$arrow) {
  $l = $slide.Shapes.AddConnector(1, $x1, $y1, $x2, $y2)
  $l.Name = $name
  $l.Line.ForeColor.RGB = $color; $l.Line.Weight = $weight
  if ($arrow) { $l.Line.EndArrowheadStyle = 2; $l.Line.EndArrowheadLength = 1; $l.Line.EndArrowheadWidth = 1 }
  return $l
}

$games = @(
  @{ key='shabd';   name='Aaj Ka Shabd';   reason='Meaning';    color='675579'; tint='E9E3EF'; quote='जवाब मिले बिना चैन नहीं पड़ता!' },
  @{ key='niti';    name='Aaj Ki Niti';    reason='Expression'; color='826137'; tint='F3E6CD'; quote='सुबह वाला सुविचार… ग्रुप में भी भेज दिया।' },
  @{ key='over';    name='Aaj Ka Over';    reason='Excitement'; color='466853'; tint='E2EBDF'; quote='आख़िरी ओवर में वो गेंद क्यों डाली?' },
  @{ key='nishana'; name='Aaj Ka Nishana'; reason='Mastery';    color='526B78'; tint='E3EAEC'; quote='अब खेलने का टाइम ही नहीं मिलता!' },
  @{ key='jodi';    name='Aaj Ki Jodi';    reason='Context';    color='506D8A'; tint='E3EAF0'; quote='खबरें ही नहीं पढ़ पाया।' }
)

$pp = New-Object -ComObject PowerPoint.Application
$pres = $pp.Presentations.Open($v8, $false, $false, $false)
try {
  # ---------- New statement slide: duplicate the closing slide's text frame, place at 4 ----------
  $dup = $pres.Slides(14).Duplicate()
  $dup.MoveTo(4)
  $st = $pres.Slides(4)
  $toDelete = @()
  foreach ($sh in $st.Shapes) {
    $size = $sh.TextFrame.TextRange.Font.Size
    if ($size -eq 33) {
      $sh.Name = 'Why five games, not one'
      $sh.TextFrame.TextRange.Text = 'Why five games, not one'
      $f = $sh.TextFrame.TextRange.Font; $f.Name = 'Arial'; $f.Size = 21; $f.Bold = -1; $f.Color.RGB = $TEAL
      $sh.Left = 48; $sh.Top = 88; $sh.Width = 520; $sh.Height = 32
    } elseif ($size -eq 54) {
      $sh.Name = 'Different reasons, one home (Hindi)'
      $sh.TextFrame.TextRange.Text = "वजहें अलग-अलग,`rठिकाना एक।"
      $sh.Left = 48; $sh.Top = 170; $sh.Width = 520; $sh.Height = 156
    } elseif ($size -eq 27) {
      $sh.Name = 'One game gives one reason'
      $sh.TextFrame.TextRange.Text = "One game gives one reason to visit.`rReaders bring several."
      $sh.TextFrame.TextRange.Font.Size = 25.5
      $sh.Left = 48; $sh.Top = 350; $sh.Width = 520; $sh.Height = 78
    } elseif ($size -eq 29.25) {
      $toDelete += $sh
    }
  }
  foreach ($sh in $toDelete) { $sh.Delete() }

  # five icons converging into the real home screen
  $iconX = 588; $iconSize = 52; $joinX = 712; $joinY = 280
  for ($i = 0; $i -lt 5; $i++) {
    $g = $games[$i]
    $iy = 118 + $i * 68
    $pic = $st.Shapes.AddPicture($icons[$g.key], 0, -1, $iconX, $iy, $iconSize, $iconSize)
    $pic.Name = "Icon $($g.name)"
    $ln = Add-Line $st "Joins home $($g.name)" ($iconX + $iconSize + 6) ($iy + $iconSize / 2) $joinX $joinY (C $g.color) 1.5 $false
  }
  Add-Line $st 'Arrow to home' $joinX $joinY 748 $joinY $TEAL 2.25 $true | Out-Null
  $shot = $st.Shapes.AddPicture($homeShot, 0, -1, 755, 110, 157, 340)
  $shot.Name = 'Prototype home screen'
  $shot.Line.Visible = -1; $shot.Line.ForeColor.RGB = (C 'D6D5D0'); $shot.Line.Weight = 0.75
  try { $shot.AutoShapeType = 5; $shot.Adjustments.Item(1) = 0.07 } catch {}
  Add-Text $st 'Home caption' 'The prototype home' 755 456 157 18 'Arial' 12 $MUTED $false 2 | Out-Null

  $st.NotesPage.Shapes.Placeholders(2).TextFrame.TextRange.Text = "Why five games and not one. One game gives a reader one reason to open it. The people we started with bring different reasons: a cricket argument, a morning thought, a question that will not let go. The same reader's mood also changes through the day. So we built five small games behind one home. The reader picks a game, keeps one Mashal, and one game is enough to take part. Five is our starting mix; reader testing should decide which games earn continued investment."

  # ---------- Explanation slide: rebuild the old slide 4 (now 5) ----------
  $ex = $pres.Slides(5)
  for ($k = $ex.Shapes.Count; $k -ge 1; $k--) {
    $sh = $ex.Shapes($k)
    $isTitle = $sh.HasTextFrame -and $sh.TextFrame.HasText -and $sh.TextFrame.TextRange.Font.Size -eq 33
    $isPage  = [math]::Abs($sh.Left - 879) -lt 1 -and [math]::Abs($sh.Top - 514.5) -lt 1
    if ($isTitle) { $sh.Name = 'Each conversation points to a different game'; $sh.TextFrame.TextRange.Text = 'Each conversation points to a different game' }
    elseif (-not $isPage) { $sh.Delete() }
  }

  for ($i = 0; $i -lt 5; $i++) {
    $g = $games[$i]; $y = 132 + $i * 68; $col = C $g.color
    $b = $ex.Shapes.AddShape(5, 48, $y, 300, 48)
    $b.Name = "Quote $($g.name)"
    $b.Fill.ForeColor.RGB = (C $g.tint); $b.Line.Visible = 0
    $b.Adjustments.Item(1) = 0.22
    $tf = $b.TextFrame; $tf.WordWrap = -1; $tf.AutoSize = 0
    $tf.MarginLeft = 14; $tf.MarginRight = 10; $tf.MarginTop = 2; $tf.MarginBottom = 2; $tf.VerticalAnchor = 3
    $tf.TextRange.Text = $g.quote
    $tf.TextRange.ParagraphFormat.Alignment = 1
    $f = $tf.TextRange.Font; $f.Name = 'Nirmala UI'; $f.NameComplexScript = 'Nirmala UI'; $f.NameFarEast = 'Nirmala UI'; $f.Size = 15.75; $f.Bold = 0; $f.Color.RGB = $INK
    Add-Line $ex "Leads to $($g.name)" 356 ($y + 24) 384 ($y + 24) $col 1.75 $true | Out-Null
    $pic = $ex.Shapes.AddPicture($icons[$g.key], 0, -1, 392, ($y + 3), 42, 42)
    $pic.Name = "Icon $($g.name)"
    Add-Text $ex "Reason $($g.name)" $g.reason 444 ($y + 2) 140 24 'Arial' 18 $col $true | Out-Null
    Add-Text $ex "Game $($g.name)" $g.name 444 ($y + 26) 140 20 'Arial' 14 $MUTED $false | Out-Null
  }

  $panel = $ex.Shapes.AddShape(5, 604, 132, 308, 320)
  $panel.Name = 'Why five panel'
  $panel.Fill.ForeColor.RGB = (C 'EEF0EE'); $panel.Line.Visible = 0
  $panel.Adjustments.Item(1) = 0.06

  $blocks = @(
    @{ h='One reader, many moods'; b='A morning thought, cricket at lunch, a word at night.'; lines=2 },
    @{ h='Five, not fifteen';      b="Language and thought: Shabd, Niti`rFamiliar skill: Over, Nishana`rNews discovery: Jodi"; lines=3 },
    @{ h='One habit, not five';    b='One home, one shared Mashal. One game is enough.'; lines=2 }
  )
  $by = 152
  foreach ($blk in $blocks) {
    Add-Text $ex "Heading $($blk.h)" $blk.h 626 $by 268 24 'Arial' 19 $TEAL $true | Out-Null
    $bh = 20 * $blk.lines
    Add-Text $ex "Body $($blk.h)" $blk.b 626 ($by + 30) 268 $bh 'Arial' 16.5 $INK $false | Out-Null
    $by += 30 + $bh + 24
  }

  Add-Text $ex 'Starting mix note' 'Five is our starting mix, not a proven number. Reader testing decides which games earn continued investment.' 48 513.8 810 18.8 'Arial' 13.5 $MUTED $false | Out-Null

  $ex.NotesPage.Shapes.Placeholders(2).TextFrame.TextRange.Text = "Each opening conversation points to a different reason to play, and each reason has its own game. Curiosity becomes Aaj Ka Shabd. The morning suvichar becomes Aaj Ki Niti. The cricket argument becomes Aaj Ka Over. Childhood skill with no time to play becomes Aaj Ka Nishana. Missing the news becomes Aaj Ki Jodi. Three choices keep this from becoming a catalogue: the same reader can choose by mood; five gives two language-and-thought games, two familiar skill games and one news discovery game; and everything sits in one home with one Mashal, so the reader builds one habit, not five. The quotes are illustrative lines we wrote, not interview quotations, and these habits are overlapping entry points, not five separate audience segments."

  # ---------- Renumber page numbers ----------
  foreach ($s in $pres.Slides) {
    foreach ($sh in $s.Shapes) {
      if ([math]::Abs($sh.Left - 879) -lt 1 -and [math]::Abs($sh.Top - 514.5) -lt 1 -and $sh.HasTextFrame) {
        $sh.TextFrame.TextRange.Text = '{0:D2}' -f $s.SlideIndex
        $sh.Name = 'Page ' + ('{0:D2}' -f $s.SlideIndex)
      }
    }
  }

  $pres.Save()

  $png = "$scr\renders"
  New-Item -ItemType Directory -Force $png | Out-Null
  Get-ChildItem $png -Filter *.png | Remove-Item -Force
  foreach ($s in $pres.Slides) { $s.Export(("$png\slide-{0:D2}.png" -f $s.SlideIndex), 'PNG', 1600, 900) }
  "Slides: " + $pres.Slides.Count
}
finally {
  $pres.Close(); $pp.Quit()
}
