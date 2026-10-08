# Builds the site icons in public/ from the logos in src/assets/:
#
#   favicon.svg                       browser tabs in Chrome, Edge and Firefox:
#                                     the light-mode logo, swapped for the
#                                     dark-mode one when the browser is dark
#   favicon-48.png, favicon-192.png   light-mode, transparent, for Google and
#                                     Safari (no theme switching there)
#   apple-touch-icon.png (180)        on white; iOS blackens transparency, which
#                                     would hide the logo's dark lettering
#
# Google shows the icon on a white circle next to results, so the light-mode
# logo (dark lettering) reads there. Only needed when the logo changes; the
# outputs are committed.
#
#   powershell -ExecutionPolicy Bypass -File scripts/make-icons.ps1

Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$light = [System.Drawing.Bitmap]::FromFile((Join-Path $root 'src/assets/lightmode.png'))
$dark = [System.Drawing.Bitmap]::FromFile((Join-Path $root 'src/assets/darkmode.png'))

# Trim the transparent margin so the artwork, not the padding, fills the icon.
# One crop covers both logos so the theme swap doesn't shift the artwork.
$minX = $light.Width; $minY = $light.Height; $maxX = -1; $maxY = -1
foreach ($src in $light, $dark) {
  for ($y = 0; $y -lt $src.Height; $y++) {
    for ($x = 0; $x -lt $src.Width; $x++) {
      if ($src.GetPixel($x, $y).A -gt 24) {
        if ($x -lt $minX) { $minX = $x }; if ($x -gt $maxX) { $maxX = $x }
        if ($y -lt $minY) { $minY = $y }; if ($y -gt $maxY) { $maxY = $y }
      }
    }
  }
}
$crop = New-Object System.Drawing.Rectangle $minX, $minY, ($maxX - $minX + 1), ($maxY - $minY + 1)

function Get-IconPng($src, [int]$size, [double]$fill, $background) {
  $bmp = New-Object System.Drawing.Bitmap $size, $size, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = 'HighQualityBicubic'
  $g.PixelOffsetMode = 'HighQuality'
  $g.CompositingQuality = 'HighQuality'
  $g.Clear($background)

  # The logo is wider than tall, so its width is what meets the edge.
  $w = $fill * $size; $h = $crop.Height * $w / $crop.Width
  $dest = New-Object System.Drawing.RectangleF (($size - $w) / 2), (($size - $h) / 2), $w, $h
  $attrs = New-Object System.Drawing.Imaging.ImageAttributes
  $attrs.SetWrapMode('TileFlipXY')   # no fringe from sampling past the crop
  $g.DrawImage($src, [System.Drawing.Rectangle]::Round($dest), $crop.X, $crop.Y, $crop.Width, $crop.Height, 'Pixel', $attrs)
  $g.Dispose()

  $stream = New-Object System.IO.MemoryStream
  $bmp.Save($stream, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
  , $stream.ToArray()
}

function Write-Png($name, $bytes) {
  [System.IO.File]::WriteAllBytes((Join-Path $root "public/$name"), $bytes)
}

$clear = [System.Drawing.Color]::Transparent
Write-Png 'favicon-48.png' (Get-IconPng $light 48 1.0 $clear)
Write-Png 'favicon-192.png' (Get-IconPng $light 192 1.0 $clear)
Write-Png 'apple-touch-icon.png' (Get-IconPng $light 180 0.86 ([System.Drawing.Color]::White))

# A tab draws the icon at 16-32 CSS px, so 128 covers high-density screens
# while keeping the SVG small. The PNGs are inlined because an SVG used as an
# icon can't load anything else.
$l = [Convert]::ToBase64String((Get-IconPng $light 128 1.0 $clear))
$d = [Convert]::ToBase64String((Get-IconPng $dark 128 1.0 $clear))
$svg = @"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
<style>#d{display:none}@media (prefers-color-scheme:dark){#l{display:none}#d{display:inline}}</style>
<image id="l" width="128" height="128" href="data:image/png;base64,$l"/>
<image id="d" width="128" height="128" href="data:image/png;base64,$d"/>
</svg>
"@
[System.IO.File]::WriteAllText((Join-Path $root 'public/favicon.svg'), $svg)

$light.Dispose()
$dark.Dispose()
