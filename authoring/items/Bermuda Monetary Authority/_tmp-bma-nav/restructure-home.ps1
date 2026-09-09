$ErrorActionPreference = 'Stop'
$utf8 = New-Object System.Text.UTF8Encoding $false
$root = 'c:\Projects\SE12\SE12-JBE-DM\authoring\items\Bermuda Monetary Authority'
$homeRoot = Join-Path $root 'serialized-content\bma-website\bma-website\Home'
$treePath = Join-Path $root '_tmp-bma-nav\menu-tree.json'
$navDir = Join-Path $root 'serialized-content\bma-website\bma-website\Data\Navigations'
$navItemDir = Join-Path $root 'serialized-content\bma-website\bma-website\Data\NavItems'
$HOME_ID = 'f5ab8e88-9630-4d14-a33a-0387b06c1c4b'
$PAGE_TEMPLATE = '97a02f7a-b48e-4eca-a8bd-58c22054c373'
$IMAGE_FIELD = 'a8c4e2f1-9b7d-4e6a-8c3f-1d5a7b9e0f24'
$stamp = '20260902T110000Z'

$md5 = [System.Security.Cryptography.MD5]::Create()
function Get-DetGuid([string]$s) {
  $hash = $md5.ComputeHash([Text.Encoding]::UTF8.GetBytes("bma-page:$s"))
  $hash[6] = ($hash[6] -band 0x0F) -bor 0x40
  $hash[8] = ($hash[8] -band 0x3F) -bor 0x80
  return ([guid]::new($hash)).ToString().ToLowerInvariant()
}

function Convert-BmaUrlToSegments([string]$url) {
  if ([string]::IsNullOrWhiteSpace($url)) { return @() }
  if ($url -notmatch '^(https?://)(www\.)?bma\.bm(/.*)?$') { return @() }
  $path = if ($Matches[3]) { $Matches[3] } else { '/' }
  $hashIdx = $path.IndexOf('#')
  if ($hashIdx -ge 0) { $path = $path.Substring(0, $hashIdx) }
  if ([string]::IsNullOrWhiteSpace($path) -or $path -eq '/') { return @() }
  return @(
    $path.Trim('/').Split('/') | ForEach-Object {
      $parts = $_ -split '-'
      ($parts | ForEach-Object {
        if ([string]::IsNullOrWhiteSpace($_)) { return '' }
        if ($_.Length -eq 1) { return $_.ToUpperInvariant() }
        return $_.Substring(0, 1).ToUpperInvariant() + $_.Substring(1).ToLowerInvariant()
      }) -join ' '
    }
  )
}

function Safe-Name([string]$name) {
  $invalid = [IO.Path]::GetInvalidFileNameChars() -join ''
  $cleaned = ($name -replace "[$([regex]::Escape($invalid))]", ' ' -replace '/', ' ' -replace '\s+', ' ').Trim()
  if ($cleaned.Length -gt 100) { $cleaned = $cleaned.Substring(0, 100).Trim() }
  return $cleaned
}

function Read-YamlMeta([string]$file) {
  $id = $null; $parent = $null; $path = $null
  foreach ($line in [IO.File]::ReadLines($file)) {
    if ($line -match '^ID: "([^"]+)"') { $id = $Matches[1] }
    elseif ($line -match '^Parent: "([^"]+)"') { $parent = $Matches[1] }
    elseif ($line -match '^Path: "([^"]+)"') { $path = $Matches[1] }
    elseif ($line -eq 'Languages:' -or $line -eq 'SharedFields:') { break }
  }
  return [pscustomobject]@{ File = $file; Id = $id; Parent = $parent; Path = $path; Name = [IO.Path]::GetFileNameWithoutExtension($file) }
}

# Index all existing pages
$pages = @{}
Get-ChildItem $homeRoot -Recurse -Filter '*.yml' | ForEach-Object {
  $m = Read-YamlMeta $_.FullName
  if ($m.Id) { $pages[$m.Id] = $m }
}
Write-Host "Indexed $($pages.Count) pages"

function Find-PageByLeafName([string]$leaf) {
  $leafSafe = Safe-Name $leaf
  $matches = @($pages.Values | Where-Object { $_.Name -eq $leafSafe -or $_.Name -eq $leaf })
  if ($matches.Count -eq 1) { return $matches[0] }
  if ($matches.Count -gt 1) {
    # Prefer non-Documents Centre for flat pages; else first
    $nonDc = @($matches | Where-Object { $_.Path -notmatch '/Documents Centre/' })
    if ($nonDc.Count -ge 1) { return $nonDc[0] }
    return $matches[0]
  }
  return $null
}

function Find-PageByUrl([string]$url) {
  $segs = Convert-BmaUrlToSegments $url
  if ($segs.Count -eq 0) { return $null }
  # Prefer exact path match under Home
  $want = '/sitecore/content/bermuda-monetary-authority/bma-website/Home/' + ($segs -join '/')
  $exact = @($pages.Values | Where-Object { $_.Path -eq $want })
  if ($exact.Count -eq 1) { return $exact[0] }
  # Documents Centre path match
  if ($segs[0] -eq 'Documents Centre') {
    $exactDc = @($pages.Values | Where-Object { $_.Path -eq $want })
    if ($exactDc.Count -ge 1) { return $exactDc[0] }
  }
  return Find-PageByLeafName $segs[-1]
}

function Is-DocumentsCentreUrl([string]$url) {
  $segs = Convert-BmaUrlToSegments $url
  return ($segs.Count -gt 0 -and $segs[0] -eq 'Documents Centre')
}

function New-StubYaml([string]$id, [string]$parentId, [string]$sitecorePath, [string]$navTitle, [string]$imageMediaId) {
  $imageBlock = ''
  if ($imageMediaId) {
    $g = $imageMediaId.ToUpperInvariant()
    $imageBlock = @"
    - ID: "$IMAGE_FIELD"
      Hint: Image
      Value: |
        <image mediaid="{$g}" alt="$navTitle" />
"@
  }
  return @"
---
ID: "$id"
Parent: "$parentId"
Template: "$PAGE_TEMPLATE"
Path: "$sitecorePath"
Languages:
- Language: en
  Versions:
  - Version: 1
    Fields:
    - ID: "25bed78c-4957-4165-998a-ca1b52f67497"
      Hint: __Created
      Value: $stamp
    - ID: "4e0720e9-9d50-4ddc-87cf-ecd65e8e94c8"
      Hint: NavigationTitle
      Value: $navTitle
$imageBlock
    - ID: "5dd74568-4d4b-44c1-b513-0af5f4cda34f"
      Hint: __Created by
      Value: |
        sitecore\Admin
    - ID: "8cdc337e-a112-42fb-bbb4-4143751e123f"
      Hint: __Revision
      Value: "$id"
    - ID: "badd9cf9-53e0-4d0c-bcc0-2d784c282f6a"
      Hint: __Updated by
      Value: |
        sitecore\Admin
    - ID: "d9cf14b1-fa16-4ba6-9288-e8a174d4d522"
      Hint: __Updated
      Value: $stamp
"@.TrimEnd() + "`n"
}

function Write-TextRetry([string]$file, [string]$text) {
  for ($i = 0; $i -lt 8; $i++) {
    try {
      [IO.File]::WriteAllText($file, $text, $utf8)
      return
    } catch {
      Start-Sleep -Milliseconds (400 * ($i + 1))
      if ($i -eq 7) { throw }
    }
  }
}

function Set-YamlParentPath([string]$file, [string]$newParent, [string]$newPath) {
  $lines = [IO.File]::ReadAllLines($file)
  for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match '^Parent: ') { $lines[$i] = "Parent: `"$newParent`"" }
    elseif ($lines[$i] -match '^Path: ') { $lines[$i] = "Path: `"$newPath`"" }
  }
  Write-TextRetry $file (($lines -join "`n") + "`n")
}

function Ensure-ImageField([string]$file, [string]$mediaId, [string]$alt) {
  $text = [IO.File]::ReadAllText($file)
  if ($text -match [regex]::Escape($IMAGE_FIELD)) { return }
  $g = $mediaId.ToUpperInvariant()
  $block = @"
    - ID: "$IMAGE_FIELD"
      Hint: Image
      Value: |
        <image mediaid="{$g}" alt="$alt" />
"@
  if ($text -match '(Hint: NavigationTitle\r?\n\s+Value: [^\r\n]+\r?\n)') {
    $text = $text -replace '(Hint: NavigationTitle\r?\n\s+Value: [^\r\n]+\r?\n)', "`$1$block`n"
  } else {
    $text = $text -replace '(Versions:\r?\n\s+- Version: 1\r?\n\s+Fields:\r?\n)', "`$1$block`n"
  }
  Write-TextRetry $file $text
}

function Move-PageFile([string]$id, [string]$newParentId, [string]$newSitecorePath) {
  $meta = $pages[$id]
  if (-not $meta) { throw "Unknown page $id" }
  if ($meta.Path -eq $newSitecorePath -and $meta.Parent -eq $newParentId) { return $meta }

  $rel = $newSitecorePath -replace '^/sitecore/content/bermuda-monetary-authority/bma-website/Home/', ''
  $destDir = Join-Path $homeRoot (Split-Path $rel -Parent)
  if ([string]::IsNullOrWhiteSpace((Split-Path $rel -Parent))) { $destDir = $homeRoot }
  $destName = Split-Path $rel -Leaf
  New-Item -ItemType Directory -Force -Path $destDir | Out-Null
  $destFile = Join-Path $destDir "$destName.yml"

  Set-YamlParentPath $meta.File $newParentId $newSitecorePath

  if ($meta.File -ne $destFile) {
    if (Test-Path $destFile) {
      # Destination already exists as different item — keep source updated in place under new path by overwriting carefully
      throw "Destination exists: $destFile (from $($meta.File))"
    }
    Move-Item -LiteralPath $meta.File -Destination $destFile -Force
    # Remove empty old dirs later
  }

  $meta.File = $destFile
  $meta.Parent = $newParentId
  $meta.Path = $newSitecorePath
  $meta.Name = $destName
  $pages[$id] = $meta
  return $meta
}

# Section roots that must never be moved as leaf destinations
$script:protectedIds = New-Object 'System.Collections.Generic.HashSet[string]'

function Ensure-Node([string]$title, [string]$url, [string]$parentId, [string]$parentPath, [string]$keyPath, [string]$imageMediaId, [bool]$forceStructural) {
  $name = Safe-Name $title
  $sitecorePath = "$parentPath/$name"

  # Documents Centre destinations stay under Documents Centre; create a local stub for IA
  if ($url -and (Is-DocumentsCentreUrl $url) -and -not $forceStructural) {
    # Local stub under mega tree so the folder structure exists
    $exact = @($pages.Values | Where-Object { $_.Path -eq $sitecorePath })
    if ($exact.Count -ge 1) { return $exact[0] }
    $id = Get-DetGuid "node:$keyPath"
    $rel = $sitecorePath -replace '^/sitecore/content/bermuda-monetary-authority/bma-website/Home/', ''
    $destDir = Join-Path $homeRoot (Split-Path $rel -Parent)
    if ([string]::IsNullOrWhiteSpace((Split-Path $rel -Parent))) { $destDir = $homeRoot }
    New-Item -ItemType Directory -Force -Path $destDir | Out-Null
    $destFile = Join-Path $destDir "$name.yml"
    if (-not (Test-Path $destFile)) {
      Write-TextRetry $destFile (New-StubYaml $id $parentId $sitecorePath $title $null)
      $meta = [pscustomobject]@{ File = $destFile; Id = $id; Parent = $parentId; Path = $sitecorePath; Name = $name }
      $pages[$id] = $meta
      Write-Host "  + dc-stub $sitecorePath"
      return $meta
    }
    return Read-YamlMeta $destFile
  }

  # If URL points at existing page (non-DC), move it under this parent
  if ($url -and -not $forceStructural) {
    $existing = Find-PageByUrl $url
    if ($existing) {
      if ($existing.Path -match '/Documents Centre(/|$)') { return $existing }
      if ($existing.Id -eq $HOME_ID) { return $existing }
      # Never relocate protected section roots (e.g. Vision and Mission -> about-us)
      if ($script:protectedIds.Contains($existing.Id)) {
        $id = Get-DetGuid "node:$keyPath"
        $rel = $sitecorePath -replace '^/sitecore/content/bermuda-monetary-authority/bma-website/Home/', ''
        $destDir = Join-Path $homeRoot (Split-Path $rel -Parent)
        if ([string]::IsNullOrWhiteSpace((Split-Path $rel -Parent))) { $destDir = $homeRoot }
        New-Item -ItemType Directory -Force -Path $destDir | Out-Null
        $destFile = Join-Path $destDir "$name.yml"
        if (-not (Test-Path $destFile)) {
          Write-TextRetry $destFile (New-StubYaml $id $parentId $sitecorePath $title $null)
          $meta = [pscustomobject]@{ File = $destFile; Id = $id; Parent = $parentId; Path = $sitecorePath; Name = $name }
          $pages[$id] = $meta
          Write-Host "  + alias-stub $sitecorePath (keeps $($existing.Name))"
          return $meta
        }
        return (Read-YamlMeta $destFile)
      }
      try {
        return Move-PageFile $existing.Id $parentId $sitecorePath
      } catch {
        Write-Host "  WARN move $($existing.Name): $_"
        return $existing
      }
    }
  }

  # Existing at exact path?
  $exact = @($pages.Values | Where-Object { $_.Path -eq $sitecorePath })
  if ($exact.Count -ge 1) {
    $node = $exact[0]
    if ($imageMediaId) { Ensure-ImageField $node.File $imageMediaId $title }
    return $node
  }

  # Existing by leaf name under same parent already?
  $byName = Find-PageByLeafName $name
  if ($byName -and $byName.Parent -eq $parentId) {
    if ($imageMediaId) { Ensure-ImageField $byName.File $imageMediaId $title }
    return $byName
  }

  # Create stub
  $id = Get-DetGuid "node:$keyPath"
  # Preserve known About Us / Careers / Conduct ids if creating at Home
  if ($parentId -eq $HOME_ID) {
    if ($name -eq 'About Us' -and $pages.ContainsKey('ad3fd214-5012-4212-8c1d-9d3b24d5b144')) {
      $node = Move-PageFile 'ad3fd214-5012-4212-8c1d-9d3b24d5b144' $parentId $sitecorePath
      if ($imageMediaId) { Ensure-ImageField $node.File $imageMediaId $title }
      return $node
    }
    if ($name -eq 'Careers' -and (Find-PageByLeafName 'Careers')) {
      $c = Find-PageByLeafName 'Careers'
      $node = Move-PageFile $c.Id $parentId $sitecorePath
      if ($imageMediaId) { Ensure-ImageField $node.File $imageMediaId $title }
      return $node
    }
    if ($name -eq 'Conduct Of Business' -and (Find-PageByLeafName 'Conduct Of Business')) {
      $c = Find-PageByLeafName 'Conduct Of Business'
      return Move-PageFile $c.Id $parentId $sitecorePath
    }
  }

  $rel = $sitecorePath -replace '^/sitecore/content/bermuda-monetary-authority/bma-website/Home/', ''
  $destDir = Join-Path $homeRoot (Split-Path $rel -Parent)
  if ([string]::IsNullOrWhiteSpace((Split-Path $rel -Parent))) { $destDir = $homeRoot }
  New-Item -ItemType Directory -Force -Path $destDir | Out-Null
  $destFile = Join-Path $destDir "$name.yml"
  $yaml = New-StubYaml $id $parentId $sitecorePath $title $imageMediaId
  Write-TextRetry $destFile $yaml
  $meta = [pscustomobject]@{ File = $destFile; Id = $id; Parent = $parentId; Path = $sitecorePath; Name = $name }
  $pages[$id] = $meta
  Write-Host "  + stub $sitecorePath"
  return $meta
}

function Process-Children($children, [string]$parentId, [string]$parentPath, [string]$keyPath) {
  if (-not $children) { return }
  foreach ($child in @($children)) {
    $childKey = "$keyPath/$($child.title)"
    $hasKids = $child.children -and @($child.children).Count -gt 0
    # Structural node if has children OR no url
    $forceStructural = $hasKids -and (-not $child.url)
    $node = Ensure-Node $child.title $child.url $parentId $parentPath $childKey $null $forceStructural

    # If this node has children and it's not a Documents Centre leaf page, recurse under it
    if ($hasKids) {
      if ($child.url -and (Is-DocumentsCentreUrl $child.url)) {
        # Don't nest under DC destination; create structural folder under current parent instead
        $struct = Ensure-Node $child.title $null $parentId $parentPath "$childKey/struct" $null $true
        Process-Children $child.children $struct.Id $struct.Path $childKey
      } else {
        Process-Children $child.children $node.Id $node.Path $childKey
      }
    }
  }
}

$sectionImages = @{
  'about-us' = 'e273b7cc-ebc4-1d48-ad70-b83f9dccd20a'
  'publications-and-news' = '9d5dcd1d-0bd6-9f4c-8c5e-a28d6d62f1c9'
  'regulated-sectors' = '91b4ca68-9e36-b645-848e-b2a60e7b0417'
  'external-cooperation' = '6f1b3340-b7b8-4e48-a0b7-3562ebcfc0d7'
  'aml-atf' = 'b0442bad-c2a6-3f43-97f1-ea94155d13d5'
  'careers' = 'afa301be-834b-4c4a-92f9-704282abafef'
}

$tree = Get-Content -Raw $treePath | ConvertFrom-Json
$pathMap = @{} # old relative path or leaf -> new path for nav updates

foreach ($nav in $tree) {
  Write-Host "Section: $($nav.title)"
  $img = $sectionImages[$nav.key]
  $section = Ensure-Node $nav.title $nav.url $HOME_ID '/sitecore/content/bermuda-monetary-authority/bma-website/Home' $nav.key $img $true
  [void]$script:protectedIds.Add($section.Id)
  if ($img) { Ensure-ImageField $section.File $img $nav.title }
  $pathMap[$nav.key] = $section.Path -replace '^/sitecore/content/bermuda-monetary-authority/bma-website/Home', ''
  if ($nav.children) {
    Process-Children $nav.children $section.Id $section.Path $nav.key
  }
}

# Cleanup empty directories under Home
Get-ChildItem $homeRoot -Recurse -Directory | Sort-Object { $_.FullName.Length } -Descending | ForEach-Object {
  if (-not (Get-ChildItem $_.FullName -Force | Where-Object { $_.Name -ne '.scindex' })) {
    Remove-Item $_.FullName -Force -ErrorAction SilentlyContinue
  }
}

# Update Navigation + NavItem URLs to new page paths where we can resolve them
function Content-Path-To-Url([string]$sitecorePath) {
  if (-not $sitecorePath) { return $null }
  return ($sitecorePath -replace '^/sitecore/content/bermuda-monetary-authority/bma-website/Home', '')
}

function Update-LinkUrlsInFile([string]$file) {
  $text = [IO.File]::ReadAllText($file)
  $orig = $text
  $text = [regex]::Replace($text, 'url="(/[^"]*)"', {
    param($m)
    $url = $m.Groups[1].Value
    if ($url -eq '#' -or $url -match '^https?://') { return $m.Value }
    # Try find page by current path
    $want = '/sitecore/content/bermuda-monetary-authority/bma-website/Home' + $url
    $hit = @($pages.Values | Where-Object { $_.Path -eq $want })
    if ($hit.Count -eq 1) { return "url=`"$url`"" }
    # Try by leaf
    $leaf = ($url.Trim('/') -split '/')[-1]
    $byLeaf = Find-PageByLeafName $leaf
    if ($byLeaf -and $byLeaf.Path -notmatch '/Documents Centre/') {
      $newUrl = Content-Path-To-Url $byLeaf.Path
      return "url=`"$newUrl`""
    }
    if ($byLeaf -and $byLeaf.Path -match '/Documents Centre') {
      $newUrl = Content-Path-To-Url $byLeaf.Path
      return "url=`"$newUrl`""
    }
    return $m.Value
  })
  if ($text -ne $orig) {
    Write-TextRetry $file $text
    return $true
  }
  return $false
}

$updated = 0
Get-ChildItem $navDir -Filter '*.yml' | ForEach-Object { if (Update-LinkUrlsInFile $_.FullName) { $updated++ } }
Get-ChildItem $navItemDir -Filter '*.yml' | ForEach-Object { if (Update-LinkUrlsInFile $_.FullName) { $updated++ } }

Write-Host "Nav files updated: $updated"
Write-Host "Pages now: $($pages.Count)"
Write-Host "Top-level under Home:"
Get-ChildItem $homeRoot | Sort-Object Name | ForEach-Object {
  if ($_.PSIsContainer) { "  DIR  $($_.Name)" } else { "  PAGE $($_.BaseName)" }
}
