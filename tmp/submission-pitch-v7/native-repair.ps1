$ErrorActionPreference = 'Stop'
$pptApp = New-Object -ComObject PowerPoint.Application
$pptApp.DisplayAlerts = 1
$deck = $null
try {
  $deck = $pptApp.Presentations.Open2007((Resolve-Path -LiteralPath $args[0]).Path, -1, 0, 0, -1)
  Write-Output "Opened repair: $($deck.Slides.Count) slides"
  Write-Output "Slide 2: $($deck.Slides.Item(2).Shapes.Count) shapes"
  $deck.SaveAs($args[1],24)
} finally {
  if ($null -ne $deck) { $deck.Close() }
  [void][System.Runtime.InteropServices.Marshal]::ReleaseComObject($pptApp)
}
