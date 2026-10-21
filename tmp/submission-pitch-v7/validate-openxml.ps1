$ErrorActionPreference = 'Stop'
Add-Type -Path 'C:\Program Files\Microsoft Office\root\vfs\ProgramFilesX86\Microsoft Office\Office16\DCF\DocumentFormat.OpenXml.dll'
$doc = [DocumentFormat.OpenXml.Packaging.PresentationDocument]::Open((Resolve-Path -LiteralPath $args[0]).Path, $false)
try {
  $validator = New-Object DocumentFormat.OpenXml.Validation.OpenXmlValidator
  $errors = @($validator.Validate($doc))
  $errors | ForEach-Object { [pscustomobject]@{ Description=$_.Description; Part=$_.Part.Uri.ToString(); XPath=$_.Path.XPath; Type=$_.ErrorType.ToString() } } | ConvertTo-Json -Depth 4
  Write-Output "Error count: $($errors.Count)"
} finally { $doc.Dispose() }
