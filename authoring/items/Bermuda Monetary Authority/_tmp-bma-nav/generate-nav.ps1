$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$contentRoot = Join-Path $root 'serialized-content\bma-website\bma-website'
$navDir = Join-Path $contentRoot 'Data\Navigations'
$navItemDir = Join-Path $contentRoot 'Data\NavItems'
$headerPath = Join-Path $contentRoot 'Presentation\Partial Designs\Header.yml'
$treePath = Join-Path $PSScriptRoot 'menu-tree.json'

$NAV_PARENT = 'aeb2911c-34f6-4439-84ec-c30c14ec3a60'
$NAVITEM_PARENT = '536b010a-d848-4294-808d-bb3d05220f2c'
$NAV_TEMPLATE = '3202e7a7-c4fd-4ecf-8b30-d52ccc4165a0'
$NAVITEM_TEMPLATE = 'fc58484e-338a-426a-b341-61677134fd75'
$HEADER_UID = 'B0A10002-0001-4001-8001-000000000001'
$NAV_RID = '{C4EB9052-B412-437E-A428-888CC5A0381F}'
$NAVITEM_RID = '{281B625E-B7CE-4412-A643-B3B8A2F8250D}'
$SITE_HEADER_DS = '84e47c05-9ea1-489c-81e8-30b504ec5e02'
$HEADER_RID = '{58C6C8EC-AA8A-4D87-ADC3-DFA631AF6128}'

$md5 = [System.Security.Cryptography.MD5]::Create()
function Get-DetGuid([string]$s) {
  $hash = $md5.ComputeHash([Text.Encoding]::UTF8.GetBytes("bma-nav:$s"))
  $hash[6] = ($hash[6] -band 0x0F) -bor 0x40
  $hash[8] = ($hash[8] -band 0x3F) -bor 0x80
  return ([guid]::new($hash)).ToString().ToLowerInvariant()
}

function Convert-BmaUrl([string]$url) {
  if ([string]::IsNullOrWhiteSpace($url)) { return '' }
  if ($url -match '^(https?://)(www\.)?bma\.bm(/.*)?$') {
    $path = if ($Matches[3]) { $Matches[3] } else { '/' }
    $hashIdx = $path.IndexOf('#')
    if ($hashIdx -ge 0) { $path = $path.Substring(0, $hashIdx) }
    if ([string]::IsNullOrWhiteSpace($path) -or $path -eq '/') { return '/' }
    $segments = $path.Trim('/').Split('/') | ForEach-Object {
      $parts = $_ -split '-'
      ($parts | ForEach-Object {
        if ([string]::IsNullOrWhiteSpace($_)) { return '' }
        if ($_.Length -eq 1) { return $_.ToUpperInvariant() }
        return $_.Substring(0, 1).ToUpperInvariant() + $_.Substring(1).ToLowerInvariant()
      }) -join ' '
    }
    return '/' + ($segments -join '/')
  }
  return $url
}

function Escape-Xml([string]$s) {
  if ($null -eq $s) { return '' }
  return ($s -replace '&', '&amp;' -replace '<', '&lt;' -replace '>', '&gt;' -replace '"', '&quot;')
}

function New-LinkXml([string]$text, [string]$url) {
  $safeText = Escape-Xml $text
  $converted = Convert-BmaUrl $url
  if ([string]::IsNullOrWhiteSpace($converted)) {
    return "<link text=`"$safeText`" linktype=`"external`" url=`"#`" anchor=`"`" target=`"`" />"
  }
  if ($converted -match '^https?://') {
    return "<link text=`"$safeText`" linktype=`"external`" url=`"$converted`" anchor=`"`" target=`"_blank`" />"
  }
  return "<link text=`"$safeText`" linktype=`"external`" url=`"$converted`" anchor=`"`" target=`"`" />"
}

function Safe-FileName([string]$name) {
  $invalid = [IO.Path]::GetInvalidFileNameChars() -join ''
  $cleaned = $name -replace "[$([regex]::Escape($invalid))]", ' '
  $cleaned = ($cleaned -replace '\s+', ' ').Trim()
  if ($cleaned.Length -gt 120) { $cleaned = $cleaned.Substring(0, 120).Trim() }
  return $cleaned
}

# Clear existing leaf items
Get-ChildItem $navDir -Filter '*.yml' -File | Remove-Item -Force
Get-ChildItem $navItemDir -Filter '*.yml' -File | Remove-Item -Force

$tree = Get-Content -Raw -Path $treePath | ConvertFrom-Json
$stamp = '20260902T100000Z'
$renderings = [System.Collections.Generic.List[string]]::new()
$prevUid = "{$HEADER_UID}"
$dynId = 2
$uidSeq = 2

function Next-Uid {
  $script:uidSeq++
  return ('{0:B}' -f [guid]::Parse(('B0A10002-0001-4001-8001-{0:D12}' -f $script:uidSeq))).ToUpperInvariant()
}

function Write-NavigationYaml($id, $name, $title, $url, $description) {
  $pathName = Safe-FileName $name
  $link = New-LinkXml $title $url
  $descBlock = ''
  if (-not [string]::IsNullOrWhiteSpace($description)) {
    $escapedDesc = $description -replace '"', '\"'
    $descBlock = @"
    - ID: "bd02c3c0-a5e7-451c-ae82-30f15e3e6263"
      Hint: Description
      Value: "$escapedDesc"
"@
  }
  $yaml = @"
---
ID: "$id"
Parent: "$NAV_PARENT"
Template: "$NAV_TEMPLATE"
Path: "/sitecore/content/bermuda-monetary-authority/bma-website/Data/Navigations/$pathName"
Languages:
- Language: en
  Versions:
  - Version: 1
    Fields:
    - ID: "365f6247-8ecf-4257-85fb-5e2ea6c080bc"
      Hint: Link
      Value: |
        $link
$descBlock
    - ID: "25bed78c-4957-4165-998a-ca1b52f67497"
      Hint: __Created
      Value: "$stamp"
    - ID: "5dd74568-4d4b-44c1-b513-0af5f4cda34f"
      Hint: __Created by
      Value: "sitecore\Admin"
    - ID: "8cdc337e-a112-42fb-bbb4-4143751e123f"
      Hint: __Revision
      Value: "$id"
    - ID: "badd9cf9-53e0-4d0c-bcc0-2d784c282f6a"
      Hint: __Updated by
      Value: "sitecore\Admin"
    - ID: "d9cf14b1-fa16-4ba6-9288-e8a174d4d522"
      Hint: __Updated
      Value: "$stamp"
"@
  # Fix empty desc leaving blank lines awkwardly - clean double newlines in fields
  $file = Join-Path $navDir "$pathName.yml"
  Set-Content -Path $file -Value $yaml.TrimEnd() -Encoding UTF8
}

function Write-NavItemYaml($id, $name, $title, $url) {
  $pathName = Safe-FileName $name
  $link = New-LinkXml $title $url
  $yaml = @"
---
ID: "$id"
Parent: "$NAVITEM_PARENT"
Template: "$NAVITEM_TEMPLATE"
Path: "/sitecore/content/bermuda-monetary-authority/bma-website/Data/NavItems/$pathName"
Languages:
- Language: en
  Versions:
  - Version: 1
    Fields:
    - ID: "6bede9bd-5bbe-44b0-9617-d2e993b154ab"
      Hint: Title
      Value: "$($title -replace '"','\"')"
    - ID: "422282cb-83ef-4695-b987-ce0ac5e0385a"
      Hint: Link
      Value: |
        $link
    - ID: "25bed78c-4957-4165-998a-ca1b52f67497"
      Hint: __Created
      Value: "$stamp"
    - ID: "5dd74568-4d4b-44c1-b513-0af5f4cda34f"
      Hint: __Created by
      Value: "sitecore\Admin"
    - ID: "8cdc337e-a112-42fb-bbb4-4143751e123f"
      Hint: __Revision
      Value: "$id"
    - ID: "badd9cf9-53e0-4d0c-bcc0-2d784c282f6a"
      Hint: __Updated by
      Value: "sitecore\Admin"
    - ID: "d9cf14b1-fa16-4ba6-9288-e8a174d4d522"
      Hint: __Updated
      Value: "$stamp"
"@
  $file = Join-Path $navItemDir "$pathName.yml"
  Set-Content -Path $file -Value $yaml.TrimEnd() -Encoding UTF8
}

function Add-Rendering([string]$uid, [string]$afterUid, [string]$ds, [string]$rid, [string]$par, [string]$ph) {
  $block = @"
        <r
          uid="$uid"
          p:after="r[@uid='$afterUid']"
          s:ds="$ds"
          s:id="$rid"
          s:par="$par"
          s:ph="$ph" />
"@
  $renderings.Add($block.TrimEnd())
  $script:prevUid = $uid
}

function Process-Children($children, [string]$keyPath, [string]$placeholderPath) {
  if (-not $children) { return }
  $i = 0
  foreach ($child in $children) {
    $i++
    $childKey = "$keyPath/$($child.title)"
    $id = Get-DetGuid "navitem:$childKey"
    $fileName = ($childKey -replace '^[^/]+/', '' -replace '/', ' - ')
    if ($fileName.Length -gt 100) {
      $fileName = (Safe-FileName $child.title) + ' ' + $id.Substring(0, 8)
    }
    $url = if ($child.url) { $child.url } else { '' }
    Write-NavItemYaml $id $fileName $child.title $url

    $hasKids = $child.children -and @($child.children).Count -gt 0
    $uid = Next-Uid
    if ($hasKids) {
      $thisDyn = $script:dynId
      $script:dynId++
      $par = "CSSStyles&amp;DynamicPlaceholderId=$thisDyn"
      Add-Rendering $uid $prevUid $id $NAVITEM_RID $par $placeholderPath
      $childPh = "$placeholderPath/nav-children-$thisDyn"
      Process-Children $child.children $childKey $childPh
    } else {
      Add-Rendering $uid $prevUid $id $NAVITEM_RID 'CSSStyles' $placeholderPath
    }
  }
}

# Header component first
$headerBlock = @"
        <r
          uid="{$HEADER_UID}"
          p:before="*"
          s:ds="$SITE_HEADER_DS"
          s:id="$HEADER_RID"
          s:par="CSSStyles&amp;DynamicPlaceholderId=1"
          s:ph="headless-header" />
"@
$renderings.Add($headerBlock.TrimEnd())

foreach ($nav in $tree) {
  $navId = Get-DetGuid "navigation:$($nav.key)"
  # Preserve known About Us id for continuity
  if ($nav.key -eq 'about-us') { $navId = 'd02d24c3-5f22-4226-8550-4fa52a20e0a6' }

  Write-NavigationYaml $navId $nav.title $nav.title $nav.url $nav.description

  $uid = Next-Uid
  $hasKids = $nav.children -and @($nav.children).Count -gt 0
  if ($hasKids) {
    $thisDyn = $dynId
    $dynId++
    $par = "CSSStyles&amp;DynamicPlaceholderId=$thisDyn"
    Add-Rendering $uid $prevUid $navId $NAV_RID $par '/headless-header/header-navigation-1'
    Process-Children $nav.children $nav.key "/headless-header/header-navigation-1/nav-children-$thisDyn"
  } else {
    Add-Rendering $uid $prevUid $navId $NAV_RID 'CSSStyles' '/headless-header/header-navigation-1'
  }
}

$renderingXml = ($renderings -join "`n")
$headerYaml = @"
---
ID: "de9fe073-3c89-450a-8e9e-954af20f27cb"
Parent: "3e3dc3fb-a72d-42ac-987c-423d3478a3df"
Template: "fd2059fd-6043-4dfe-8c04-e2437ce87634"
Path: "/sitecore/content/bermuda-monetary-authority/bma-website/Presentation/Partial Designs/Header"
SharedFields:
- ID: "55faae90-3bba-4f7f-96fe-13c3f40055ff"
  Hint: Signature
  Value: header
- ID: "f1a1fe9e-a60c-4ddb-a3a0-bb5b29fe732e"
  Hint: __Renderings
  Value: |
    <r xmlns:p="p" xmlns:s="s"
      p:p="1">
      <d
        id="{FE5D7FDF-89C0-4D99-9AA3-B5FBD009C9F3}">
$renderingXml
      </d>
    </r>
Languages:
- Language: en
  Versions:
  - Version: 1
    Fields:
    - ID: "25bed78c-4957-4165-998a-ca1b52f67497"
      Hint: __Created
      Value: 20260901T120000Z
    - ID: "5dd74568-4d4b-44c1-b513-0af5f4cda34f"
      Hint: __Created by
      Value: |
        sitecore\Admin
    - ID: "8cdc337e-a112-42fb-bbb4-4143751e123f"
      Hint: __Revision
      Value: "de9fe073-3c89-450a-8e9e-954af20f27cb"
    - ID: "badd9cf9-53e0-4d0c-bcc0-2d784c282f6a"
      Hint: __Updated by
      Value: |
        sitecore\Admin
    - ID: "d9cf14b1-fa16-4ba6-9288-e8a174d4d522"
      Hint: __Updated
      Value: 20260902T100000Z
"@

Set-Content -Path $headerPath -Value $headerYaml.TrimEnd() -Encoding UTF8

$navCount = (Get-ChildItem $navDir -Filter '*.yml').Count
$itemCount = (Get-ChildItem $navItemDir -Filter '*.yml').Count
Write-Host "Navigations: $navCount"
Write-Host "NavItems: $itemCount"
Write-Host "DynamicPlaceholderIds used up to: $($dynId - 1)"
Write-Host "Renderings: $($renderings.Count)"
