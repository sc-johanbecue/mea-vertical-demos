# Finish BMA wiring: Partial Designs, Page Design, pages, Layout cookie placeholder
# Reuses deterministic GUID seeds from _wire-bma.ps1 so datasource IDs match existing Data items.
$ErrorActionPreference = 'Stop'
$root = "c:\Projects\SE12\SE12-JBE-DM\authoring\items\Bermuda Monetary Authority\serialized-content"
$stamp = "20260901T120000Z"
$owner = "sitecore\Admin"

function New-GuidLike([string]$seed) {
  $md5 = [System.Security.Cryptography.MD5]::Create()
  $bytes = $md5.ComputeHash([Text.Encoding]::UTF8.GetBytes("bma-wire-$seed"))
  $hex = -join ($bytes | ForEach-Object { $_.ToString('x2') })
  return "{0}-{1}-{2}-{3}-{4}" -f $hex.Substring(0,8), $hex.Substring(8,4), "4$($hex.Substring(13,3))", ("8{0}" -f $hex.Substring(17,3)), $hex.Substring(20,12)
}

function Write-YamlItem {
  param(
    [string]$RelPath,
    [string]$Id,
    [string]$Parent,
    [string]$Template,
    [string]$SitecorePath,
    [hashtable[]]$SharedFields = @(),
    [hashtable[]]$VersionFields = @()
  )
  $full = Join-Path $root $RelPath
  $dir = Split-Path $full -Parent
  if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }

  $sb = [System.Text.StringBuilder]::new()
  [void]$sb.AppendLine('---')
  [void]$sb.AppendLine("ID: `"$Id`"")
  [void]$sb.AppendLine("Parent: `"$Parent`"")
  [void]$sb.AppendLine("Template: `"$Template`"")
  [void]$sb.AppendLine("Path: `"$SitecorePath`"")

  if ($SharedFields.Count -gt 0) {
    [void]$sb.AppendLine('SharedFields:')
    foreach ($f in $SharedFields) {
      [void]$sb.AppendLine("- ID: `"$($f.ID)`"")
      [void]$sb.AppendLine("  Hint: $($f.Hint)")
      $val = [string]$f.Value
      if ($val -match "`n" -or $val.Length -gt 80 -or $val -match '^<' -or $val -match '^\s') {
        [void]$sb.AppendLine('  Value: |')
        foreach ($line in ($val -split "`n")) { [void]$sb.AppendLine("    $line") }
      } else {
        [void]$sb.AppendLine("  Value: `"$val`"")
      }
    }
  }

  [void]$sb.AppendLine('Languages:')
  [void]$sb.AppendLine('- Language: en')
  [void]$sb.AppendLine('  Versions:')
  [void]$sb.AppendLine('  - Version: 1')
  [void]$sb.AppendLine('    Fields:')
  $std = @(
    @{ ID = '25bed78c-4957-4165-998a-ca1b52f67497'; Hint = '__Created'; Value = $stamp },
    @{ ID = '5dd74568-4d4b-44c1-b513-0af5f4cda34f'; Hint = '__Created by'; Value = $owner },
    @{ ID = '8cdc337e-a112-42fb-bbb4-4143751e123f'; Hint = '__Revision'; Value = $Id },
    @{ ID = 'badd9cf9-53e0-4d0c-bcc0-2d784c282f6a'; Hint = '__Updated by'; Value = $owner },
    @{ ID = 'd9cf14b1-fa16-4ba6-9288-e8a174d4d522'; Hint = '__Updated'; Value = $stamp }
  )
  foreach ($f in (@($VersionFields) + $std)) {
    [void]$sb.AppendLine("    - ID: `"$($f.ID)`"")
    [void]$sb.AppendLine("      Hint: $($f.Hint)")
    $val = [string]$f.Value
    if ($val -match "`n" -or $val -match '^<' -or $val.Length -gt 120) {
      [void]$sb.AppendLine('      Value: |')
      foreach ($line in ($val -split "`n")) { [void]$sb.AppendLine("        $line") }
    } else {
      [void]$sb.AppendLine("      Value: `"$val`"")
    }
  }

  $utf8NoBom = New-Object System.Text.UTF8Encoding $false
  [System.IO.File]::WriteAllText($full, $sb.ToString(), $utf8NoBom)
  Write-Host "Wrote $RelPath"
}

$HOME_ID = 'f5ab8e88-9630-4d14-a33a-0387b06c1c4b'
$SITE_ID = 'c46560d8-7f82-42c7-9870-e191ade04c8e'
$PD_FOLDER = '3e3dc3fb-a72d-42ac-987c-423d3478a3df'
$PGD_FOLDER = '3cddb497-18ff-456b-942a-d8d594d1e252'
$PS_PARTIAL = 'e4f8e799-f0e1-4e6d-95c0-74e7777b60b7'
$T_PD = 'fd2059fd-6043-4dfe-8c04-e2437ce87634'
$T_PGD = '1105b8f8-1e00-426b-bf1f-c840742d827b'
$T_SXA_PH = 'd2a6884c-04d5-4089-a64e-d27ca9d68d4c'
$T_PAGE = '97a02f7a-b48e-4eca-a8bd-58c22054c373'

$Rend = @{
  Breadcrumb='c0308900-8ecc-47da-95fd-f45f8b8dabb3'
  BreadcrumbItem='687df383-4a5b-4ae7-ae3c-59d069bab76c'
  CookieBanner='1578981e-1a63-4ee1-8d36-2a00081fb9a0'
  DatedLinkItem='852efac1-5f71-4264-9f68-ceed411b995c'
  DocumentCentreLayout='54d13632-5322-44ac-ba04-71cf88645c96'
  DocumentFilterGroup='20b242c6-b4c2-415c-abc2-4df7f6549efa'
  DocumentFilterOption='4ad0637e-e0ae-4329-8e97-1ff3433d083d'
  DocumentResultCard='f764b728-e24a-441d-9d55-9d1120b3cff8'
  Footer='01bc34f1-a77e-43b9-94a0-e4f757f39ddd'
  Header='58c6c8ec-aa8a-4d87-adc3-dfa631af6128'
  HeroCarousel='aeb8ef87-e4e3-4535-b68d-70b504c76e92'
  HeroSlide='04ef4599-5866-4e1f-9eb7-396bb563b0af'
  HighlightLinkCard='a157dbe1-32d5-45a4-b9e1-b95f59c9e688'
  HighlightLinkGrid='dd27db58-16c8-49c1-82e9-571c5ef74970'
  LinkColumn='ad0be8f0-8939-4074-996d-f3bb125fa1a1'
  LinkColumnGrid='abcfec74-6710-4232-b540-b282b5332f8e'
  LinkListItem='5576e3fd-3e93-48cb-8aa5-d1d44d4642a3'
  Navigation='c4eb9052-b412-437e-a428-888cc5a0381f'
  NavItem='281b625e-b7ce-4412-a643-b3b8a2f8250d'
  PageTitleHeader='c4ca6330-20b2-4b94-ab33-9ce43059a919'
  PageUtilityActions='ba55e1da-a524-4e09-bd65-de34947d2e12'
  RichTextSection='6cba3eef-6cde-4f14-8bd1-6a55b59ef6d5'
  SocialLinkItem='6ac93a5c-a7f1-4309-8405-e74bb3d8d9c3'
  TopBar='5c075c47-7ea9-4820-bb92-5d7b2dfebbaf'
  VideoEmbedGrid='53141565-7d72-47a4-94a5-16b48cf74a64'
  VideoEmbedItem='901a1f54-2997-489f-88d9-8b5f2b724fbd'
}

# Rebuild datasource ID map from seeds used in original script
$dsKeys = @(
  'TopBar','Header','Nav-About','Nav-Regulation','Nav-Documents','Nav-News',
  'NavItem-Mission','NavItem-Leadership','NavItem-Insurance','NavItem-Banking',
  'Cookie','Footer','Social-LinkedIn','Social-X','Social-YouTube',
  'Hero','Slide1','Slide2','Slide3','HLGrid',
  'Card-CP','Card-CP-D1','Card-CP-D2','Card-Sanctions','Card-Sanctions-D1','Card-Sanctions-D2',
  'Card-Notices','Card-Notices-D1','Card-Notices-D2','Card-News','Card-News-D1','Card-News-D2',
  'LCGrid','Col-Reg','Col-Reg-L1','Col-Reg-L2','Col-Reg-L3','Col-Reg-L4',
  'Col-Lic','Col-Lic-L1','Col-Lic-L2','Col-Lic-L3',
  'Col-Pub','Col-Pub-L1','Col-Pub-L2','Col-Pub-L3',
  'Col-About','Col-About-L1','Col-About-L2','Col-About-L3',
  'BC-About','BCI-Home','BCI-About','PUA-About','PTH-About','RTS-About','VEG-About','VEI-1','VEI-2',
  'DCL','FG-Type','FG-Cat','FO-CP','FO-Disc','FO-Ins','FO-Bank','FO-Inv',
  'DR1','DR2','DR3','DR4','DR5','DR6','DR7','DR8'
)
$ds = @{}
foreach ($k in $dsKeys) { $ds[$k] = New-GuidLike "ds-$k" }

# Verify one known existing item ID matches
$headerPath = Join-Path $root 'bma-website/bma-website/Data/Headers/Site Header.yml'
$headerId = (Select-String -Path $headerPath -Pattern '^ID: "([^"]+)"').Matches[0].Groups[1].Value
if ($headerId -ne $ds['Header']) {
  throw "Deterministic ID mismatch for Header. Disk=$headerId Seed=$($ds['Header']). Aborting."
}
Write-Host "Datasource seed map verified against Site Header."

function Build-R([string]$uid, [string]$after, [string]$dsId, [string]$rid, [string]$ph, [string]$par) {
  $afterAttr = if ($after) { " p:after=`"r[@uid='$after']`"" } else { ' p:before="*"' }
  $dsAttr = if ($dsId) { " s:ds=`"$dsId`"" } else { '' }
  return "    <r uid=`"$uid`"$afterAttr$dsAttr s:id=`"{$($rid.ToUpper())}`" s:par=`"$par`" s:ph=`"$ph`" />"
}

# ============================================================================
# Partial Designs
# ============================================================================
Write-Host "Creating Partial Designs..."
$pdTopBar = New-GuidLike 'pd-topbar'
$pdHeader = New-GuidLike 'pd-header'
$pdCookie = New-GuidLike 'pd-cookie'
$pdFooter = New-GuidLike 'pd-footer'

$uidTB = '{B0A10001-0001-4001-8001-000000000001}'
$xmlTopBar = @"
<r xmlns:p="p" xmlns:s="s" p:p="1">
  <d id="{FE5D7FDF-89C0-4D99-9AA3-B5FBD009C9F3}">
    <r uid="$uidTB" p:before="*" s:ds="$($ds['TopBar'])" s:id="{$($Rend.TopBar.ToUpper())}" s:par="CSSStyles&amp;DynamicPlaceholderId=1" s:ph="headless-header" />
  </d>
</r>
"@.Trim()

Write-YamlItem -RelPath "bma-website/bma-website/Presentation/Partial Designs/TopBar.yml" `
  -Id $pdTopBar -Parent $PD_FOLDER -Template $T_PD `
  -SitecorePath "/sitecore/content/bermuda-monetary-authority/bma-website/Presentation/Partial Designs/TopBar" `
  -SharedFields @(
    @{ ID='55faae90-3bba-4f7f-96fe-13c3f40055ff'; Hint='Signature'; Value='topbar' },
    @{ ID='f1a1fe9e-a60c-4ddb-a3a0-bb5b29fe732e'; Hint='__Renderings'; Value=$xmlTopBar }
  )

$uidH = '{B0A10002-0001-4001-8001-000000000001}'
$uidN1 = '{B0A10002-0001-4001-8001-000000000002}'
$uidN2 = '{B0A10002-0001-4001-8001-000000000003}'
$uidN3 = '{B0A10002-0001-4001-8001-000000000004}'
$uidN4 = '{B0A10002-0001-4001-8001-000000000005}'
$uidNI1 = '{B0A10002-0001-4001-8001-000000000011}'
$uidNI2 = '{B0A10002-0001-4001-8001-000000000012}'
$uidNI3 = '{B0A10002-0001-4001-8001-000000000013}'
$uidNI4 = '{B0A10002-0001-4001-8001-000000000014}'
$xmlHeader = @"
<r xmlns:p="p" xmlns:s="s" p:p="1">
  <d id="{FE5D7FDF-89C0-4D99-9AA3-B5FBD009C9F3}">
    <r uid="$uidH" p:before="*" s:ds="$($ds['Header'])" s:id="{$($Rend.Header.ToUpper())}" s:par="CSSStyles&amp;DynamicPlaceholderId=1" s:ph="headless-header" />
    <r uid="$uidN1" p:after="r[@uid='$uidH']" s:ds="$($ds['Nav-About'])" s:id="{$($Rend.Navigation.ToUpper())}" s:par="CSSStyles&amp;DynamicPlaceholderId=2" s:ph="/headless-header/header-navigation-1" />
    <r uid="$uidN2" p:after="r[@uid='$uidN1']" s:ds="$($ds['Nav-Regulation'])" s:id="{$($Rend.Navigation.ToUpper())}" s:par="CSSStyles&amp;DynamicPlaceholderId=3" s:ph="/headless-header/header-navigation-1" />
    <r uid="$uidN3" p:after="r[@uid='$uidN2']" s:ds="$($ds['Nav-Documents'])" s:id="{$($Rend.Navigation.ToUpper())}" s:par="CSSStyles" s:ph="/headless-header/header-navigation-1" />
    <r uid="$uidN4" p:after="r[@uid='$uidN3']" s:ds="$($ds['Nav-News'])" s:id="{$($Rend.Navigation.ToUpper())}" s:par="CSSStyles" s:ph="/headless-header/header-navigation-1" />
    <r uid="$uidNI1" p:after="r[@uid='$uidN4']" s:ds="$($ds['NavItem-Mission'])" s:id="{$($Rend.NavItem.ToUpper())}" s:par="CSSStyles" s:ph="/headless-header/header-navigation-1/nav-children-2" />
    <r uid="$uidNI2" p:after="r[@uid='$uidNI1']" s:ds="$($ds['NavItem-Leadership'])" s:id="{$($Rend.NavItem.ToUpper())}" s:par="CSSStyles" s:ph="/headless-header/header-navigation-1/nav-children-2" />
    <r uid="$uidNI3" p:after="r[@uid='$uidNI2']" s:ds="$($ds['NavItem-Insurance'])" s:id="{$($Rend.NavItem.ToUpper())}" s:par="CSSStyles" s:ph="/headless-header/header-navigation-1/nav-children-3" />
    <r uid="$uidNI4" p:after="r[@uid='$uidNI3']" s:ds="$($ds['NavItem-Banking'])" s:id="{$($Rend.NavItem.ToUpper())}" s:par="CSSStyles" s:ph="/headless-header/header-navigation-1/nav-children-3" />
  </d>
</r>
"@.Trim()

Write-YamlItem -RelPath "bma-website/bma-website/Presentation/Partial Designs/Header.yml" `
  -Id $pdHeader -Parent $PD_FOLDER -Template $T_PD `
  -SitecorePath "/sitecore/content/bermuda-monetary-authority/bma-website/Presentation/Partial Designs/Header" `
  -SharedFields @(
    @{ ID='55faae90-3bba-4f7f-96fe-13c3f40055ff'; Hint='Signature'; Value='header' },
    @{ ID='f1a1fe9e-a60c-4ddb-a3a0-bb5b29fe732e'; Hint='__Renderings'; Value=$xmlHeader }
  )

$uidCK = '{B0A10003-0001-4001-8001-000000000001}'
$xmlCookie = @"
<r xmlns:p="p" xmlns:s="s" p:p="1">
  <d id="{FE5D7FDF-89C0-4D99-9AA3-B5FBD009C9F3}">
    <r uid="$uidCK" p:before="*" s:ds="$($ds['Cookie'])" s:id="{$($Rend.CookieBanner.ToUpper())}" s:par="CSSStyles" s:ph="headless-cookie" />
  </d>
</r>
"@.Trim()

Write-YamlItem -RelPath "bma-website/bma-website/Presentation/Partial Designs/Cookie.yml" `
  -Id $pdCookie -Parent $PD_FOLDER -Template $T_PD `
  -SitecorePath "/sitecore/content/bermuda-monetary-authority/bma-website/Presentation/Partial Designs/Cookie" `
  -SharedFields @(
    @{ ID='55faae90-3bba-4f7f-96fe-13c3f40055ff'; Hint='Signature'; Value='cookie' },
    @{ ID='f1a1fe9e-a60c-4ddb-a3a0-bb5b29fe732e'; Hint='__Renderings'; Value=$xmlCookie }
  )

$uidF = '{B0A10004-0001-4001-8001-000000000001}'
$uidS1 = '{B0A10004-0001-4001-8001-000000000002}'
$uidS2 = '{B0A10004-0001-4001-8001-000000000003}'
$uidS3 = '{B0A10004-0001-4001-8001-000000000004}'
$xmlFooter = @"
<r xmlns:p="p" xmlns:s="s" p:p="1">
  <d id="{FE5D7FDF-89C0-4D99-9AA3-B5FBD009C9F3}">
    <r uid="$uidF" p:before="*" s:ds="$($ds['Footer'])" s:id="{$($Rend.Footer.ToUpper())}" s:par="CSSStyles&amp;DynamicPlaceholderId=1" s:ph="headless-footer" />
    <r uid="$uidS1" p:after="r[@uid='$uidF']" s:ds="$($ds['Social-LinkedIn'])" s:id="{$($Rend.SocialLinkItem.ToUpper())}" s:par="CSSStyles" s:ph="/headless-footer/footer-social-links-1" />
    <r uid="$uidS2" p:after="r[@uid='$uidS1']" s:ds="$($ds['Social-X'])" s:id="{$($Rend.SocialLinkItem.ToUpper())}" s:par="CSSStyles" s:ph="/headless-footer/footer-social-links-1" />
    <r uid="$uidS3" p:after="r[@uid='$uidS2']" s:ds="$($ds['Social-YouTube'])" s:id="{$($Rend.SocialLinkItem.ToUpper())}" s:par="CSSStyles" s:ph="/headless-footer/footer-social-links-1" />
  </d>
</r>
"@.Trim()

Write-YamlItem -RelPath "bma-website/bma-website/Presentation/Partial Designs/Footer.yml" `
  -Id $pdFooter -Parent $PD_FOLDER -Template $T_PD `
  -SitecorePath "/sitecore/content/bermuda-monetary-authority/bma-website/Presentation/Partial Designs/Footer" `
  -SharedFields @(
    @{ ID='55faae90-3bba-4f7f-96fe-13c3f40055ff'; Hint='Signature'; Value='footer' },
    @{ ID='f1a1fe9e-a60c-4ddb-a3a0-bb5b29fe732e'; Hint='__Renderings'; Value=$xmlFooter }
  )

foreach ($pair in @(
  @{ Name='TopBar'; Key='sxa-topbar' },
  @{ Name='Header'; Key='sxa-header' },
  @{ Name='Cookie'; Key='sxa-cookie' },
  @{ Name='Footer'; Key='sxa-footer' }
)) {
  $id = New-GuidLike "sxa-ph-$($pair.Name)"
  Write-YamlItem -RelPath "bma-website/bma-website/Presentation/Placeholder Settings/Partial Design/$($pair.Name).yml" `
    -Id $id -Parent $PS_PARTIAL -Template $T_SXA_PH `
    -SitecorePath "/sitecore/content/bermuda-monetary-authority/bma-website/Presentation/Placeholder Settings/Partial Design/$($pair.Name)" `
    -SharedFields @(
      @{ ID='7256bdab-1fd2-49dd-b205-cb4873d2917c'; Hint='Placeholder Key'; Value=$pair.Key }
    )
}

# ============================================================================
# Page Design + TemplatesMapping
# ============================================================================
Write-Host "Creating Page Design Default..."
$pdDefault = New-GuidLike 'page-design-default'
$partials = "$($pdTopBar.ToUpper())|$($pdHeader.ToUpper())|$($pdCookie.ToUpper())|$($pdFooter.ToUpper())"
Write-YamlItem -RelPath "bma-website/bma-website/Presentation/Page Designs/Default.yml" `
  -Id $pdDefault -Parent $PGD_FOLDER -Template $T_PGD `
  -SitecorePath "/sitecore/content/bermuda-monetary-authority/bma-website/Presentation/Page Designs/Default" `
  -SharedFields @(
    @{ ID='0966b999-0d0e-4278-acc9-9da69d461fe6'; Hint='PartialDesigns'; Value=$partials }
  )

$pgdPath = Join-Path $root "bma-website/bma-website/Presentation/Page Designs.yml"
$pgdContent = Get-Content $pgdPath -Raw
$mapping = "%7b$($T_PAGE.ToUpper())%7d%3d%257B$($pdDefault.ToUpper())%257D"
if ($pgdContent -notmatch 'TemplatesMapping') {
  $pgdContent = $pgdContent -replace '(SharedFields:\r?\n)', "`$1- ID: `"ba1f60d6-3deb-40cc-bb61-eec772279ee1`"`r`n  Hint: TemplatesMapping`r`n  Value: `"$mapping`"`r`n"
  $utf8NoBom = New-Object System.Text.UTF8Encoding $false
  [System.IO.File]::WriteAllText($pgdPath, $pgdContent, $utf8NoBom)
  Write-Host "Patched TemplatesMapping"
} else {
  Write-Host "TemplatesMapping already present"
}

# ============================================================================
# Pages
# ============================================================================
Write-Host "Wiring Home / About Us / Documents Centre..."

$homeRs = [System.Collections.Generic.List[string]]::new()
$u = { param($n) "{B0A20001-0001-4001-8001-$($n.ToString('000000000000'))}" }
$prev = $null
$uid = & $u 1
$homeRs.Add((Build-R $uid $prev $ds['Hero'] $Rend.HeroCarousel 'headless-main' 'CSSStyles&amp;DynamicPlaceholderId=1')) | Out-Null; $prev=$uid
$uid = & $u 2; $homeRs.Add((Build-R $uid $prev $ds['Slide1'] $Rend.HeroSlide '/headless-main/hero-slides-1' 'CSSStyles')) | Out-Null; $prev=$uid
$uid = & $u 3; $homeRs.Add((Build-R $uid $prev $ds['Slide2'] $Rend.HeroSlide '/headless-main/hero-slides-1' 'CSSStyles')) | Out-Null; $prev=$uid
$uid = & $u 4; $homeRs.Add((Build-R $uid $prev $ds['Slide3'] $Rend.HeroSlide '/headless-main/hero-slides-1' 'CSSStyles')) | Out-Null; $prev=$uid
$uid = & $u 5; $homeRs.Add((Build-R $uid $prev $ds['HLGrid'] $Rend.HighlightLinkGrid 'headless-main' 'CSSStyles&amp;DynamicPlaceholderId=2')) | Out-Null; $prev=$uid
$cardKeys = @('Card-CP','Card-Sanctions','Card-Notices','Card-News')
$dp = 3
$n = 6
foreach ($ck in $cardKeys) {
  $uid = & $u $n; $homeRs.Add((Build-R $uid $prev $ds[$ck] $Rend.HighlightLinkCard '/headless-main/highlight-cards-2' "CSSStyles&amp;DynamicPlaceholderId=$dp")) | Out-Null; $prev=$uid; $n++
  $uid = & $u $n; $homeRs.Add((Build-R $uid $prev $ds["$ck-D1"] $Rend.DatedLinkItem "/headless-main/highlight-cards-2/highlight-items-$dp" 'CSSStyles')) | Out-Null; $prev=$uid; $n++
  $uid = & $u $n; $homeRs.Add((Build-R $uid $prev $ds["$ck-D2"] $Rend.DatedLinkItem "/headless-main/highlight-cards-2/highlight-items-$dp" 'CSSStyles')) | Out-Null; $prev=$uid; $n++
  $dp++
}
$uid = & $u $n; $homeRs.Add((Build-R $uid $prev $ds['LCGrid'] $Rend.LinkColumnGrid 'headless-main' 'CSSStyles&amp;DynamicPlaceholderId=7')) | Out-Null; $prev=$uid; $n++
$colKeys = @(@{K='Col-Reg';L=4;DP=8},@{K='Col-Lic';L=3;DP=9},@{K='Col-Pub';L=3;DP=10},@{K='Col-About';L=3;DP=11})
foreach ($ck in $colKeys) {
  $uid = & $u $n; $homeRs.Add((Build-R $uid $prev $ds[$ck.K] $Rend.LinkColumn '/headless-main/link-columns-7' "CSSStyles&amp;DynamicPlaceholderId=$($ck.DP)")) | Out-Null; $prev=$uid; $n++
  for ($li=1; $li -le $ck.L; $li++) {
    $uid = & $u $n; $homeRs.Add((Build-R $uid $prev $ds["$($ck.K)-L$li"] $Rend.LinkListItem "/headless-main/link-columns-7/column-links-$($ck.DP)" 'CSSStyles')) | Out-Null; $prev=$uid; $n++
  }
}

$homeXmlLines = @(
  '<r xmlns:p="p" xmlns:s="s" p:p="1">',
  '  <d id="{FE5D7FDF-89C0-4D99-9AA3-B5FBD009C9F3}">'
) + $homeRs + @(
  '  </d>',
  '</r>'
)
$homeXmlIndented = ($homeXmlLines | ForEach-Object { "    $_" }) -join "`r`n"

$homeYaml = @"
---
ID: "$HOME_ID"
Parent: "$SITE_ID"
Template: "$T_PAGE"
Path: "/sitecore/content/bermuda-monetary-authority/bma-website/Home"
BranchID: "45cf9f42-b3ac-4412-aab9-f8441c7e448e"
SharedFields:
- ID: "c7c26117-dbb1-42b2-ab5e-f7223845cca3"
  Hint: __Thumbnail
  Value: |
    <image mediaid="{76303074-6DF9-4771-BF23-0B6D8CAC6BAB}" />
- ID: "f1a1fe9e-a60c-4ddb-a3a0-bb5b29fe732e"
  Hint: __Renderings
  Value: |
$homeXmlIndented
- ID: "f6d8a61c-2f84-4401-bd24-52d2068172bc"
  Hint: __Originator
  Value: "{F558BEC9-C602-4D7A-B9A1-D0411C946EA4}"
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
      Value: "Home"
    - ID: "52807595-0f8f-4b20-8d2a-cb71d28c6103"
      Hint: __Owner
      Value: |
        sitecore\johan.becue@sitecore.com
    - ID: "5dd74568-4d4b-44c1-b513-0af5f4cda34f"
      Hint: __Created by
      Value: |
        sitecore\johan.becue@sitecore.com
    - ID: "8cdc337e-a112-42fb-bbb4-4143751e123f"
      Hint: __Revision
      Value: "$HOME_ID"
    - ID: "166b027b-8578-4c7e-bc82-fd8b068168ed"
      Hint: Title
      Value: "Home"
    - ID: "badd9cf9-53e0-4d0c-bcc0-2d784c282f6a"
      Hint: __Updated by
      Value: |
        sitecore\johan.becue@sitecore.com
    - ID: "d9cf14b1-fa16-4ba6-9288-e8a174d4d522"
      Hint: __Updated
      Value: $stamp
"@
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText((Join-Path $root 'bma-website/bma-website/Home.yml'), $homeYaml, $utf8NoBom)
Write-Host "Wrote Home.yml"

# About Us
$aboutId = New-GuidLike 'page-about-us'
$aboutRs = [System.Collections.Generic.List[string]]::new()
$u2 = { param($n) "{B0A20002-0001-4001-8001-$($n.ToString('000000000000'))}" }
$prev=$null; $n=1
$uid=& $u2 $n; $aboutRs.Add((Build-R $uid $prev $ds['BC-About'] $Rend.Breadcrumb 'headless-main' 'CSSStyles&amp;DynamicPlaceholderId=1')) | Out-Null; $prev=$uid; $n++
$uid=& $u2 $n; $aboutRs.Add((Build-R $uid $prev $ds['BCI-Home'] $Rend.BreadcrumbItem '/headless-main/breadcrumb-items-1' 'CSSStyles')) | Out-Null; $prev=$uid; $n++
$uid=& $u2 $n; $aboutRs.Add((Build-R $uid $prev $ds['BCI-About'] $Rend.BreadcrumbItem '/headless-main/breadcrumb-items-1' 'CSSStyles')) | Out-Null; $prev=$uid; $n++
$uid=& $u2 $n; $aboutRs.Add((Build-R $uid $prev $ds['PUA-About'] $Rend.PageUtilityActions 'headless-main' 'CSSStyles')) | Out-Null; $prev=$uid; $n++
$uid=& $u2 $n; $aboutRs.Add((Build-R $uid $prev $ds['PTH-About'] $Rend.PageTitleHeader 'headless-main' 'CSSStyles')) | Out-Null; $prev=$uid; $n++
$uid=& $u2 $n; $aboutRs.Add((Build-R $uid $prev $ds['RTS-About'] $Rend.RichTextSection 'headless-main' 'CSSStyles')) | Out-Null; $prev=$uid; $n++
$uid=& $u2 $n; $aboutRs.Add((Build-R $uid $prev $ds['VEG-About'] $Rend.VideoEmbedGrid 'headless-main' 'CSSStyles&amp;DynamicPlaceholderId=2')) | Out-Null; $prev=$uid; $n++
$uid=& $u2 $n; $aboutRs.Add((Build-R $uid $prev $ds['VEI-1'] $Rend.VideoEmbedItem '/headless-main/video-items-2' 'CSSStyles')) | Out-Null; $prev=$uid; $n++
$uid=& $u2 $n; $aboutRs.Add((Build-R $uid $prev $ds['VEI-2'] $Rend.VideoEmbedItem '/headless-main/video-items-2' 'CSSStyles')) | Out-Null; $prev=$uid; $n++
$aboutXml = @"
<r xmlns:p="p" xmlns:s="s" p:p="1">
  <d id="{FE5D7FDF-89C0-4D99-9AA3-B5FBD009C9F3}">
$($aboutRs -join "`n")
  </d>
</r>
"@.Trim()
Write-YamlItem -RelPath "bma-website/bma-website/Home/About Us.yml" `
  -Id $aboutId -Parent $HOME_ID -Template $T_PAGE `
  -SitecorePath "/sitecore/content/bermuda-monetary-authority/bma-website/Home/About Us" `
  -SharedFields @(
    @{ ID='f1a1fe9e-a60c-4ddb-a3a0-bb5b29fe732e'; Hint='__Renderings'; Value=$aboutXml }
  ) `
  -VersionFields @(
    @{ ID='4e0720e9-9d50-4ddc-87cf-ecd65e8e94c8'; Hint='NavigationTitle'; Value='About Us' },
    @{ ID='166b027b-8578-4c7e-bc82-fd8b068168ed'; Hint='Title'; Value='About Us' }
  )

# Documents Centre
$docsId = New-GuidLike 'page-documents-centre'
$dcpId = New-GuidLike 'page-discussion-consultation'
$docRs = [System.Collections.Generic.List[string]]::new()
$u3 = { param($n) "{B0A20003-0001-4001-8001-$($n.ToString('000000000000'))}" }
$prev=$null; $n=1
$uid=& $u3 $n; $docRs.Add((Build-R $uid $prev $ds['DCL'] $Rend.DocumentCentreLayout 'headless-main' 'CSSStyles&amp;DynamicPlaceholderId=1')) | Out-Null; $prev=$uid; $n++
$uid=& $u3 $n; $docRs.Add((Build-R $uid $prev $ds['FG-Type'] $Rend.DocumentFilterGroup '/headless-main/document-filters-1' 'CSSStyles&amp;DynamicPlaceholderId=2')) | Out-Null; $prev=$uid; $n++
$uid=& $u3 $n; $docRs.Add((Build-R $uid $prev $ds['FO-CP'] $Rend.DocumentFilterOption '/headless-main/document-filters-1/filter-options-2' 'CSSStyles')) | Out-Null; $prev=$uid; $n++
$uid=& $u3 $n; $docRs.Add((Build-R $uid $prev $ds['FO-Disc'] $Rend.DocumentFilterOption '/headless-main/document-filters-1/filter-options-2' 'CSSStyles')) | Out-Null; $prev=$uid; $n++
$uid=& $u3 $n; $docRs.Add((Build-R $uid $prev $ds['FG-Cat'] $Rend.DocumentFilterGroup '/headless-main/document-filters-1' 'CSSStyles&amp;DynamicPlaceholderId=3')) | Out-Null; $prev=$uid; $n++
$uid=& $u3 $n; $docRs.Add((Build-R $uid $prev $ds['FO-Ins'] $Rend.DocumentFilterOption '/headless-main/document-filters-1/filter-options-3' 'CSSStyles')) | Out-Null; $prev=$uid; $n++
$uid=& $u3 $n; $docRs.Add((Build-R $uid $prev $ds['FO-Bank'] $Rend.DocumentFilterOption '/headless-main/document-filters-1/filter-options-3' 'CSSStyles')) | Out-Null; $prev=$uid; $n++
$uid=& $u3 $n; $docRs.Add((Build-R $uid $prev $ds['FO-Inv'] $Rend.DocumentFilterOption '/headless-main/document-filters-1/filter-options-3' 'CSSStyles')) | Out-Null; $prev=$uid; $n++
for ($ri=1; $ri -le 8; $ri++) {
  $uid=& $u3 $n; $docRs.Add((Build-R $uid $prev $ds["DR$ri"] $Rend.DocumentResultCard '/headless-main/document-results-1' 'CSSStyles')) | Out-Null; $prev=$uid; $n++
}
$docXml = @"
<r xmlns:p="p" xmlns:s="s" p:p="1">
  <d id="{FE5D7FDF-89C0-4D99-9AA3-B5FBD009C9F3}">
$($docRs -join "`n")
  </d>
</r>
"@.Trim()

Write-YamlItem -RelPath "bma-website/bma-website/Home/Documents Centre.yml" `
  -Id $docsId -Parent $HOME_ID -Template $T_PAGE `
  -SitecorePath "/sitecore/content/bermuda-monetary-authority/bma-website/Home/Documents Centre" `
  -SharedFields @(
    @{ ID='f1a1fe9e-a60c-4ddb-a3a0-bb5b29fe732e'; Hint='__Renderings'; Value=$docXml }
  ) `
  -VersionFields @(
    @{ ID='4e0720e9-9d50-4ddc-87cf-ecd65e8e94c8'; Hint='NavigationTitle'; Value='Documents Centre' },
    @{ ID='166b027b-8578-4c7e-bc82-fd8b068168ed'; Hint='Title'; Value='Documents Centre' }
  )

Write-YamlItem -RelPath "bma-website/bma-website/Home/Documents Centre/Discussion Consultation Papers.yml" `
  -Id $dcpId -Parent $docsId -Template $T_PAGE `
  -SitecorePath "/sitecore/content/bermuda-monetary-authority/bma-website/Home/Documents Centre/Discussion Consultation Papers" `
  -SharedFields @(
    @{ ID='f1a1fe9e-a60c-4ddb-a3a0-bb5b29fe732e'; Hint='__Renderings'; Value=$docXml }
  ) `
  -VersionFields @(
    @{ ID='4e0720e9-9d50-4ddc-87cf-ecd65e8e94c8'; Hint='NavigationTitle'; Value='Discussion Consultation Papers' },
    @{ ID='166b027b-8578-4c7e-bc82-fd8b068168ed'; Hint='Title'; Value='Discussion Consultation Papers' }
  )

# Rename corrupted DocumentResultCard files if needed
$cardsDir = Join-Path $root 'bma-website/bma-website/Data/DocumentResultCards'
$renames = @{
  'Consultation Paper - Insurance Capital' = $ds['DR1']
  'Consultation Paper - Banking Liquidity' = $ds['DR2']
  'Discussion Paper - Digital Assets' = $ds['DR3']
  'Consultation Paper - Investment Business' = $ds['DR4']
  'Sanctions Notice Update' = $ds['DR5']
  'Guidance - Corporate Governance' = $ds['DR6']
  'Statistical Bulletin Q2 2026' = $ds['DR7']
  'Annual Report 2025' = $ds['DR8']
}
Get-ChildItem $cardsDir -Filter '*.yml' | ForEach-Object {
  $raw = Get-Content $_.FullName -Raw
  if ($raw -match 'Hint: Title\r?\n\s+Value: "([^"]+)"') {
    $title = $Matches[1]
    $safe = ($title -replace '[\\/:*?"<>|]', '-').Trim()
    $target = Join-Path $cardsDir "$safe.yml"
    if ($_.FullName -ne $target -and -not (Test-Path $target)) {
      Move-Item -LiteralPath $_.FullName -Destination $target -Force
      Write-Host "Renamed $($_.Name) -> $safe.yml"
    }
  }
}

Write-Host "DONE"
Write-Host "PartialDesigns TopBar=$pdTopBar Header=$pdHeader Cookie=$pdCookie Footer=$pdFooter"
Write-Host "PageDesign=$pdDefault"
Write-Host "Pages About=$aboutId Docs=$docsId DCP=$dcpId"
