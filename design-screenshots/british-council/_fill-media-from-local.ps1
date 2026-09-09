# Create Sitecore media YAML from local image files (when remote download is blocked).
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$repo = 'c:\Projects\SE12\SE12-JBE-DM'
$mediaRoot = Join-Path $repo 'authoring\items\British Council\serialized-content\media-library\british-council\british-council'
$siteRootId = 'bdcefd6c-0684-4b9f-88cd-5d35d2f73620'
$siteMediaPath = '/sitecore/media library/Project/british-council/british-council'
$MediaFolderTemplate = 'fe5dd826-48c6-436d-b87a-7c4210c7413b'
$MediaFileTemplate = 'f1828a2c-7e5d-4bbd-98ca-320474871548'
$ss = Join-Path $repo 'design-screenshots\british-council'
$outJson = Join-Path $ss 'media-id-map.json'
$cropDir = Join-Path $ss '_media-crops'
New-Item -ItemType Directory -Force -Path $cropDir | Out-Null

function Ensure-Folder([string[]]$segments, [string]$parentId) {
  $disk = $mediaRoot
  $sc = $siteMediaPath
  $currentParent = $parentId
  foreach ($seg in $segments) {
    if ([string]::IsNullOrWhiteSpace($seg)) { continue }
    $safe = ($seg -replace '[\\/:*?"<>|]', '-').Trim()
    $disk = Join-Path $disk $safe
    $sc = "$sc/$safe"
    $yml = "$disk.yml"
    if (-not (Test-Path $yml)) {
      $id = [guid]::NewGuid().ToString().ToLower()
      New-Item -ItemType Directory -Force -Path $disk | Out-Null
      @"
---
ID: "$id"
Parent: "$currentParent"
Template: "$MediaFolderTemplate"
Path: "$sc"
Languages:
- Language: en
  Versions:
  - Version: 1
    Fields:
    - ID: "25bed78c-4957-4165-998a-ca1b52f67497"
      Hint: __Created
      Value: 20260730T120000Z
"@ | Set-Content $yml -Encoding utf8
      Write-Host "Folder $sc"
      $currentParent = $id
    } else {
      New-Item -ItemType Directory -Force -Path $disk | Out-Null
      $text = Get-Content $yml -Raw
      if ($text -match '(?m)^ID: "([0-9a-f-]{36})"') { $currentParent = $Matches[1] }
    }
  }
  return @{ ParentId = $currentParent; DiskPath = $disk; SitecorePath = $sc }
}

function New-MediaFromFile([string]$key, [string]$filePath, [string]$itemName, [string]$alt, [string[]]$folders) {
  if (-not (Test-Path $filePath)) { throw "Missing file: $filePath" }
  $folder = Ensure-Folder $folders $siteRootId
  $ymlPath = Join-Path $folder.DiskPath ($itemName + '.yml')
  $sitecorePath = "$($folder.SitecorePath)/$itemName"
  if (Test-Path $ymlPath) {
    $text = Get-Content $ymlPath -Raw
    if ($text -match 'ID: "([0-9a-f-]{36})"') {
      Write-Host "Reuse $sitecorePath"
      return @{ Key = $key; MediaId = $Matches[1]; Path = $ymlPath }
    }
  }
  $bytes = [IO.File]::ReadAllBytes($filePath)
  $ext = [IO.Path]::GetExtension($filePath).TrimStart('.').ToLower()
  if ($ext -eq 'jpeg') { $ext = 'jpg' }
  $mime = switch ($ext) { 'png' { 'image/png' } 'jpg' { 'image/jpeg' } 'webp' { 'image/webp' } default { 'application/octet-stream' } }
  $img = [Drawing.Image]::FromFile($filePath)
  $w = $img.Width; $h = $img.Height
  $img.Dispose()
  $id = [guid]::NewGuid().ToString().ToLower()
  $blobId = [guid]::NewGuid().ToString().ToLower()
  $b64 = [Convert]::ToBase64String($bytes)
  $altEsc = $alt -replace '"', '\"'
  @"
---
ID: "$id"
Parent: "$($folder.ParentId)"
Template: "$MediaFileTemplate"
Path: "$sitecorePath"
SharedFields:
- ID: "22eac599-f13b-4607-a89d-c091763a467d"
  Hint: Width
  Value: $w
- ID: "40e50ed9-ba07-4702-992e-a912738d32dc"
  Hint: Blob
  BlobID: "$blobId"
  Value: $b64
- ID: "6954b7c7-2487-423f-8600-436cb3b6dc0e"
  Hint: Size
  Value: $($bytes.Length)
- ID: "6f47a0a5-9c94-4b48-abeb-42d38def6054"
  Hint: Mime Type
  Value: $mime
- ID: "c06867fe-9a43-4c7d-b739-48780492d06f"
  Hint: Extension
  Value: $ext
- ID: "cb09946f-3218-4823-87d2-d5007c199a96"
  Hint: Dimensions
  Value: $w x $h
- ID: "de2ca9e4-c117-4c8a-a139-1ff4b199d15a"
  Hint: Height
  Value: $h
Languages:
- Language: en
  Versions:
  - Version: 1
    Fields:
    - ID: "65885c44-8fcd-4a7f-94f1-ee63703fe193"
      Hint: Alt
      Value: "$altEsc"
"@ | Set-Content $ymlPath -Encoding utf8 -NoNewline
  Write-Host "Created $sitecorePath ($w x $h)"
  return @{ Key = $key; MediaId = $id; Path = $ymlPath }
}

function Save-Crop([string]$src, [string]$dest, [int]$x, [int]$y, [int]$w, [int]$h) {
  $bmp = [Drawing.Bitmap]::FromFile($src)
  $rect = New-Object Drawing.Rectangle ([Math]::Max(0,$x)), ([Math]::Max(0,$y)), ([Math]::Min($w, $bmp.Width - $x)), ([Math]::Min($h, $bmp.Height - $y))
  $crop = $bmp.Clone($rect, $bmp.PixelFormat)
  $crop.Save($dest, [Drawing.Imaging.ImageFormat]::Png)
  $crop.Dispose(); $bmp.Dispose()
}

# Crops from known section screenshots
$header = Join-Path $ss 'sections\header\header-desktop.png'
$hero = Join-Path $ss 'sections\event-detail-hero-section\event-detail-hero-section-desktop.png'
$intro = Join-Path $ss 'sections\learn-english-online-rich-text-image-block\learn-english-online-rich-text-image-block-desktop.png'
$homeClean = Join-Path $ss 'britishcouncil-org--home\desktop-clean.png'
$learnClean = Join-Path $ss 'britishcouncil-org--english-learn-online\desktop-clean.png'

# Logo: left of header strip
$logoCrop = Join-Path $cropDir 'bc-logo.png'
$hb = [Drawing.Bitmap]::FromFile($header)
Save-Crop $header $logoCrop 16 12 ([Math]::Min(220, $hb.Width)) ([Math]::Min(56, $hb.Height - 12))
$hb.Dispose()

# Hero full section as image (best available offline)
# Intro: crop top image band from intro section (~top 55%)
$introBmp = [Drawing.Bitmap]::FromFile($intro)
$introCrop = Join-Path $cropDir 'learn-online-intro.png'
Save-Crop $intro  $introCrop 0 0 $introBmp.Width ([Math]::Max(120, [int]($introBmp.Height * 0.55)))
$introBmp.Dispose()

# From home full page, approximate vertical bands for teasers (desktop-clean is tall)
$homeBmp = [Drawing.Bitmap]::FromFile($homeClean)
$hw = $homeBmp.Width
# Rough Y positions as fractions of page height for card rows after hero/stats
$teaserSpecs = @(
  @{ Key='featured'; Name='featured-research'; FrY=0.42; FrH=0.12; Alt='Featured research and insight' }
  @{ Key='teaser1'; Name='teaser-1'; FrY=0.55; FrH=0.10; Alt='Research teaser card 1' }
  @{ Key='teaser2'; Name='teaser-2'; FrY=0.55; FrH=0.10; Alt='Research teaser card 2'; FrX=0.34 }
  @{ Key='teaser3'; Name='teaser-3'; FrY=0.55; FrH=0.10; Alt='Research teaser card 3'; FrX=0.67 }
  @{ Key='voices1'; Name='voices-1'; FrY=0.68; FrH=0.10; Alt='Voices magazine card 1' }
  @{ Key='voices2'; Name='voices-2'; FrY=0.68; FrH=0.10; Alt='Voices magazine card 2'; FrX=0.34 }
  @{ Key='voices3'; Name='voices-3'; FrY=0.68; FrH=0.10; Alt='Voices magazine card 3'; FrX=0.67 }
)
$teaserFiles = @{}
foreach ($t in $teaserSpecs) {
  $fx = if ($t.FrX) { $t.FrX } else { 0.05 }
  $fw = if ($t.FrX) { 0.28 } else { 0.30 }
  $path = Join-Path $cropDir ($t.Name + '.png')
  $x = [int]($hw * $fx); $y = [int]($homeBmp.Height * $t.FrY)
  $w = [int]($hw * $fw); $h = [int]($homeBmp.Height * $t.FrH)
  Save-Crop $homeClean $path $x $y $w $h
  $teaserFiles[$t.Key] = @{ Path = $path; Name = $t.Name; Alt = $t.Alt }
}
$homeBmp.Dispose()

# Promo crops from learn-online page
$learnBmp = [Drawing.Bitmap]::FromFile($learnClean)
$promoSpecs = @(
  @{ Key='promo1'; Name='promo-training'; FrY=0.55; FrH=0.12; Alt='Corporate training promo' }
  @{ Key='promo2'; Name='promo-englishscore'; FrY=0.68; FrH=0.12; Alt='EnglishScore promo' }
  @{ Key='promo3'; Name='promo-teachers'; FrY=0.80; FrH=0.10; Alt='Teachers promo' }
  @{ Key='promo4'; Name='promo-learners'; FrY=0.90; FrH=0.08; Alt='Learners promo' }
)
$promoFiles = @{}
foreach ($t in $promoSpecs) {
  $path = Join-Path $cropDir ($t.Name + '.png')
  $x = [int]($learnBmp.Width * 0.08); $y = [int]($learnBmp.Height * $t.FrY)
  $w = [int]($learnBmp.Width * 0.55); $h = [int]($learnBmp.Height * $t.FrH)
  Save-Crop $learnClean $path $x $y $w $h
  $promoFiles[$t.Key] = @{ Path = $path; Name = $t.Name; Alt = $t.Alt }
}
$learnBmp.Dispose()

$folders = @('images')
$map = [ordered]@{}
$r = New-MediaFromFile 'logo' $logoCrop 'bc-logo' 'British Council' $folders; $map[$r.Key] = $r.MediaId
$r = New-MediaFromFile 'hero' $hero 'home-hero' 'We connect. We inspire.' $folders; $map[$r.Key] = $r.MediaId
$r = New-MediaFromFile 'learn-online' $introCrop 'learn-online-intro' 'A person studying online with the British Council' $folders; $map[$r.Key] = $r.MediaId
foreach ($k in $teaserFiles.Keys) {
  $t = $teaserFiles[$k]
  $r = New-MediaFromFile $k $t.Path $t.Name $t.Alt $folders
  $map[$r.Key] = $r.MediaId
}
foreach ($k in $promoFiles.Keys) {
  $t = $promoFiles[$k]
  $r = New-MediaFromFile $k $t.Path $t.Name $t.Alt $folders
  $map[$r.Key] = $r.MediaId
}

$map | ConvertTo-Json | Set-Content $outJson -Encoding utf8
Write-Host "Wrote $outJson"
$map.GetEnumerator() | ForEach-Object { Write-Host "$($_.Key)=$($_.Value)" }
