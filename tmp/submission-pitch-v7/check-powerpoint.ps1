$ErrorActionPreference = 'Stop'
$deckPath = (Resolve-Path -LiteralPath $args[0]).Path
$renderPath = $args[1]
$pptApp = New-Object -ComObject PowerPoint.Application
$pptApp.DisplayAlerts = 1
$deck = $null
try {
  $deck = $pptApp.Presentations.Open($deckPath, -1, 0, 0)
  Write-Output "Opened: $($deck.Slides.Count) slides"
  Write-Output "Slide 2: $($deck.Slides.Item(2).Shapes.Count) shapes"
  $deck.Slides.Item(2).Export($renderPath, 'PNG', 1280, 720)
  Write-Output "Exported slide 2: $renderPath"
  if ($args.Count -ge 3) {
    New-Item -ItemType Directory -Path $args[2] -Force | Out-Null
    for ($i = 1; $i -le $deck.Slides.Count; $i++) {
      $deck.Slides.Item($i).Export((Join-Path $args[2] ('slide-{0:d2}.png' -f $i)), 'PNG', 1280, 720)
    }
    Write-Output 'Exported all 14 slides in PowerPoint'
  }
} finally {
  if ($null -ne $deck) { $deck.Close() }
  [void][System.Runtime.InteropServices.Marshal]::ReleaseComObject($pptApp)
}
