$ErrorActionPreference = 'Stop'
$root   = 'E:\WebGames\Dainik Bhaskar'
$v8     = "$root\output\submission-pitch-v8\Dainik Bhaskar Khel - Submission v8.pptx"
$outDir = "$root\output\submission-pitch-v9"
$v9     = "$outDir\Dainik Bhaskar Khel - Submission v9.pptx"
$scr    = 'C:\Users\Suhas\AppData\Local\Temp\claude\E--WebGames-Dainik-Bhaskar\ba8863da-7010-428c-a46d-cc4465a2e443\scratchpad\v9'
$iconFiles = @{
  shabd   = "$root\tmp\submission-pitch-v5\assets\wordal-static.svg"
  niti    = "$root\tmp\submission-pitch-v8\assets\niti-static.svg"
  over    = "$root\tmp\submission-pitch-v8\assets\cricket-static.svg"
  nishana = "$root\tmp\submission-pitch-v5\assets\carrom-static.svg"
  jodi    = "$root\tmp\submission-pitch-v5\assets\jodo-static.svg"
}

New-Item -ItemType Directory -Force $outDir | Out-Null
Copy-Item $v8 $v9 -Force

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
  $f.Name = $font; $f.Size = [single]$size; $f.Color.RGB = [int]$color; $f.Bold = $(if ($bold) { -1 } else { 0 })
  $tf.TextRange.ParagraphFormat.Alignment = $align
  return $s
}

$pp = New-Object -ComObject PowerPoint.Application
$pres = $pp.Presentations.Open($v9, $false, $false, $false)
try {
  # ---------- Table slide (6): entry-point column becomes "One session" ----------
  $tbSlide = $pres.Slides(6)
  $sessions = @('One session · 1–3 min', 'Up to 6 guesses', '1 thought, its meaning and a card', '6 balls', '1 board, shots until it is cleared', '4 pairs, each explained')
  foreach ($sh in $tbSlide.Shapes) {
    if ($sh.HasTable) {
      for ($r = 1; $r -le 6; $r++) { $sh.Table.Cell($r, 2).Shape.TextFrame.TextRange.Text = $sessions[$r - 1] }
    } elseif ($sh.HasTextFrame -and $sh.TextFrame.TextRange.Text -like 'Quiet reflection*') {
      $sh.TextFrame.TextRange.Text = 'Five kinds of play, each designed for a 1–3 minute break.'
      $sh.Name = 'Designed for a short break'
    }
  }
  $tbNotes = $tbSlide.NotesPage.Shapes.Placeholders(2).TextFrame.TextRange
  $tbNotes.Text = "Each game is a complete session in a short break. One to three minutes is the design target for every game, not a measured reader average. Shabd allows up to six guesses. Niti is one thought, its meaning and a card to share. Over is six balls. Nishana is one board, played until it is cleared, so its time varies most. Jodi is four pairs, each with an explanation. Together the five offer quiet reflection, skill play and news discovery inside one daily home."

  # ---------- New content-scaling slide after the news slide (12) ----------
  $dup = $pres.Slides(12).Duplicate()
  $dup.MoveTo(13)
  $sc = $pres.Slides(13)
  for ($k = $sc.Shapes.Count; $k -ge 1; $k--) {
    $sh = $sc.Shapes($k)
    $isTitle = $sh.HasTextFrame -and $sh.TextFrame.HasText -and $sh.TextFrame.TextRange.Font.Size -eq 33
    $isPage  = [math]::Abs($sh.Left - 879) -lt 1 -and [math]::Abs($sh.Top - 514.5) -lt 1
    if ($isTitle) { $sh.Name = 'A short daily input per game'; $sh.TextFrame.TextRange.Text = 'A short daily input per game, none for Carrom' }
    elseif (-not $isPage) { $sh.Delete() }
  }

  # spectrum: editor chooses -> code generates
  Add-Text $sc 'Spectrum left' 'Editor chooses' 48 124 300 20 'Arial' 15 $TEAL $true 1 | Out-Null
  Add-Text $sc 'Spectrum right' 'Code generates' 612 124 300 20 'Arial' 15 $TEAL $true 3 | Out-Null
  $ar = $sc.Shapes.AddConnector(1, 48, 152, 910, 152)
  $ar.Name = 'Spectrum arrow'
  $ar.Line.ForeColor.RGB = $TEAL; $ar.Line.Weight = 1.5
  $ar.Line.EndArrowheadStyle = 2; $ar.Line.EndArrowheadLength = 2; $ar.Line.EndArrowheadWidth = 2

  $cards = @(
    @{ key='jodi';    name='Aaj Ki Jodi';    color='506D8A'; tint='E3EAF0'; who='Editor, with a source check'; what='4 pairs from the news, an explanation and a source for each' },
    @{ key='shabd';   name='Aaj Ka Shabd';   color='675579'; tint='E9E3EF'; who='Editor, from a word set';     what='Word, clue, meaning and the linked story' },
    @{ key='niti';    name='Aaj Ki Niti';    color='826137'; tint='F3E6CD'; who='Editor, from a thought bank'; what='Thought, 4 options and its meaning' },
    @{ key='over';    name='Aaj Ka Over';    color='466853'; tint='E2EBDF'; who='Editor, in a level form';     what='Team flags, runs needed and balls' },
    @{ key='nishana'; name='Aaj Ka Nishana'; color='526B78'; tint='E3EAEC'; who='Code, no editor';         what='A new board, checked to be solvable before release' }
  )
  $cw = 160; $gap = 16; $cy = 172; $ch = 256; $pad = 14
  for ($i = 0; $i -lt 5; $i++) {
    $cd = $cards[$i]; $cx = 48 + $i * ($cw + $gap); $col = C $cd.color
    $card = $sc.Shapes.AddShape(5, $cx, $cy, $cw, $ch)
    $card.Name = "Card $($cd.name)"
    $card.Fill.ForeColor.RGB = (C $cd.tint); $card.Line.Visible = 0
    $card.Adjustments.Item(1) = 0.07
    $back = $sc.Shapes.AddShape(5, ($cx + $pad - 3), ($cy + $pad - 3), 50, 50)
    $back.Name = "Icon backing $($cd.name)"; $back.Fill.ForeColor.RGB = (C 'FFFFFF'); $back.Line.Visible = 0; $back.Adjustments.Item(1) = 0.25
    $pic = $sc.Shapes.AddPicture($iconFiles[$cd.key], 0, -1, ($cx + $pad), ($cy + $pad), 44, 44)
    $pic.Name = "Icon $($cd.name)"
    Add-Text $sc "Name $($cd.name)" $cd.name ($cx + $pad) ($cy + 70) ($cw - 2 * $pad) 22 'Arial' 16.5 $col $true | Out-Null
    Add-Text $sc "Who $($cd.name)" $cd.who ($cx + $pad) ($cy + 100) ($cw - 2 * $pad) 40 'Arial' 14.5 $INK $true | Out-Null
    Add-Text $sc "Input label $($cd.name)" 'What goes in' ($cx + $pad) ($cy + 152) ($cw - 2 * $pad) 16 'Arial' 12 $MUTED $false | Out-Null
    Add-Text $sc "Input $($cd.name)" $cd.what ($cx + $pad) ($cy + 172) ($cw - 2 * $pad) 100 'Arial' 14 $INK $false | Out-Null
  }

  Add-Text $sc 'Batch note' 'Words and thoughts can be prepared a week ahead, so no one writes five games every morning.' 48 448 864 24 'Arial' 17 $TEAL $true | Out-Null
  Add-Text $sc 'Status note' 'Today: hand-authored demo editions in one shared format. Editor forms and the Carrom generator are planned.' 48 513.8 810 18.8 'Arial' 13.5 $MUTED $false | Out-Null

  $sc.NotesPage.Shapes.Placeholders(2).TextFrame.TextRange.Text = "How does tomorrow's edition get made? We chose each game's content source by how much human judgment it needs. Jodi needs the most: an editor picks four pairs from the news and checks a source for each. Shabd and Niti need an editor's choice, but words and thoughts can be prepared a week ahead in sets. Over needs only a short level form: the two teams' flags, the runs needed and the balls. Nishana needs no editor at all: code generates a new board and checks that it can be solved before release. Today the prototype runs on hand-authored demo editions that share one format; the editor forms and the Carrom generator are planned work."

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
