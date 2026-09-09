# BMA site wiring generator
$ErrorActionPreference = 'Stop'
$root = "c:\Projects\SE12\SE12-JBE-DM\authoring\items\Bermuda Monetary Authority\serialized-content"
$created = [System.Collections.Generic.List[string]]::new()
$stamp = "20260901T120000Z"
$owner = "sitecore\Admin"

function New-GuidLike([string]$seed) {
  # Deterministic GUID from seed string
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
    [hashtable[]]$VersionFields = @(),
    [string]$BranchID = $null
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
  if ($BranchID) { [void]$sb.AppendLine("BranchID: `"$BranchID`"") }

  if ($SharedFields.Count -gt 0) {
    [void]$sb.AppendLine('SharedFields:')
    foreach ($f in $SharedFields) {
      [void]$sb.AppendLine("- ID: `"$($f.ID)`"")
      [void]$sb.AppendLine("  Hint: $($f.Hint)")
      $val = $f.Value
      if ($val -match "`n" -or $val.Length -gt 80 -or $val -match '^<' -or $val -match '^\s') {
        [void]$sb.AppendLine('  Value: |')
        foreach ($line in ($val -split "`n")) {
          [void]$sb.AppendLine("    $line")
        }
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
  $allVer = @($VersionFields) + $std
  foreach ($f in $allVer) {
    [void]$sb.AppendLine("    - ID: `"$($f.ID)`"")
    [void]$sb.AppendLine("      Hint: $($f.Hint)")
    $val = [string]$f.Value
    if ($val -match "`n" -or $val -match '^<' -or $val.Length -gt 120) {
      [void]$sb.AppendLine('      Value: |')
      foreach ($line in ($val -split "`n")) {
        [void]$sb.AppendLine("        $line")
      }
    } else {
      [void]$sb.AppendLine("      Value: `"$val`"")
    }
  }

  $utf8NoBom = New-Object System.Text.UTF8Encoding $false
  [System.IO.File]::WriteAllText($full, $sb.ToString(), $utf8NoBom)
  $created.Add($RelPath) | Out-Null
}

function ExtLink([string]$text, [string]$url) {
  return "<link text=`"$text`" linktype=`"external`" url=`"$url`" anchor=`"`" target=`"`" />"
}
function IntLink([string]$text, [string]$id, [string]$url = '') {
  if ($url) {
    return "<link text=`"$text`" linktype=`"internal`" id=`"{$($id.ToUpper())}`" url=`"$url`" />"
  }
  return "<link text=`"$text`" linktype=`"internal`" id=`"{$($id.ToUpper())}`" />"
}
function MediaLink([string]$text, [string]$id) {
  return "<link text=`"$text`" linktype=`"media`" id=`"{$($id.ToUpper())}`" />"
}

# ============================================================================
# IDs
# ============================================================================
$PH_PARENT = '6a5243a1-7cc4-48d8-8794-1879b8d48572'
$DATA_PARENT = 'e5f58de1-9e2a-4c96-a653-ceb18ba7ee9d'
$HOME_ID = 'f5ab8e88-9630-4d14-a33a-0387b06c1c4b'
$SITE_ID = 'c46560d8-7f82-42c7-9870-e191ade04c8e'
$PD_FOLDER = '3e3dc3fb-a72d-42ac-987c-423d3478a3df'
$PGD_FOLDER = '3cddb497-18ff-456b-942a-d8d594d1e252'
$PS_PARTIAL = 'e4f8e799-f0e1-4e6d-95c0-74e7777b60b7'
$MEDIA_LIB = 'e0f068e3-c078-460f-a83c-b9a2fb5a3df0'

$T_PH = '5c547d4e-7111-4995-95b0-6b561751bf2e'
$T_PD = 'fd2059fd-6043-4dfe-8c04-e2437ce87634'
$T_PGD = '1105b8f8-1e00-426b-bf1f-c840742d827b'
$T_SXA_PH = 'd2a6884c-04d5-4089-a64e-d27ca9d68d4c'
$T_PAGE = '97a02f7a-b48e-4eca-a8bd-58c22054c373'
$T_MEDIA_FOLDER = 'fe5dd826-48c6-436d-b87a-7c4210c7413b'
$T_FILE = '962b53c4-f93b-4df9-9821-415c867b8903'

# Rendering IDs (do NOT use $R â€” PowerShell vars are case-insensitive and collide with $r loops)
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

$DT = @{
  Breadcrumb='da35c405-bc88-4217-a4b3-9bd264fc76c9'
  BreadcrumbItem='406bbdad-ea18-459b-b49a-0e9f538c587e'
  CookieBanner='56b1d309-1feb-4c8d-998f-2b617fb69b72'
  DatedLinkItem='c9dc236a-621a-4817-a9ce-9f7c1a368f6e'
  DocumentCentreLayout='ced671c7-ac33-42e8-8ede-ef1e66af78ef'
  DocumentFilterGroup='8166960f-10a2-47b2-afb4-f47f75e0e021'
  DocumentFilterOption='bdc961e3-16bd-46b5-b74c-3ca715d998e4'
  DocumentResultCard='3e78da21-3dcd-40b0-92cf-dd0ce17d5ba0'
  Footer='42516e49-bf0f-4872-92ff-1bc88d15df1d'
  Header='d672fbc2-b039-4c75-a389-ab1a2ed3d614'
  HeroCarousel='b1a7e1b1-2ab5-4c15-8d7a-e59b18252763'
  HeroSlide='7bad0098-ecfb-4959-bdf2-bc8cd92f9025'
  HighlightLinkCard='588756bc-5ffc-4b3c-ae03-4c43273b7d1b'
  HighlightLinkGrid='b6948ad3-9d50-48a6-a7a4-40dc838c1067'
  LinkColumn='33d917e1-31a7-4988-8477-2fb32e075997'
  LinkColumnGrid='dbae0afc-db3f-4af9-ac34-bd6b7e50d638'
  LinkListItem='ee39cac2-efcd-4e99-8bb7-5a86d844d4ee'
  Navigation='3202e7a7-c4fd-4ecf-8b30-d52ccc4165a0'
  NavItem='fc58484e-338a-426a-b341-61677134fd75'
  PageTitleHeader='bb018ef7-15a5-42f7-8751-e1aae35d8793'
  PageUtilityActions='e783d1e6-a700-4dbf-b28d-ae8b3c9b5283'
  RichTextSection='9301b696-de5e-4019-8834-95681d41c3df'
  SocialLinkItem='0bbb521d-3691-4a9a-9471-c032109394d5'
  TopBar='02d049fb-5bba-4aad-9ac1-5753ed1aa098'
  VideoEmbedGrid='f46c2c8b-d7a1-4861-a643-cd567bc28b38'
  VideoEmbedItem='0a6aeda3-5fa3-485e-a078-eae6cb093894'
}

$FT = @{
  Breadcrumbs='5d826ce7-79f6-44b2-9ea4-1f048a52eec4'
  BreadcrumbItems='828ed29f-7827-4220-9730-143d1edb1af9'
  CookieBanners='facaf4a9-1159-4523-b69e-ef2622a32129'
  DatedLinkItems='81bdf304-36f0-40c9-a071-1430142b2ef9'
  DocumentCentreLayouts='e727aee4-92a7-4bf4-90fa-783f0fd7d250'
  DocumentFilterGroups='4bcc89b5-b01d-487b-b006-dafd98cccf95'
  DocumentFilterOptions='accd3435-1789-4d6e-b943-0dff9f99c2d5'
  DocumentResultCards='1db785fe-6080-4c75-bedb-d5f3f34406ab'
  Footers='bc097b02-f6e5-40ca-8fd6-d95521e74a9f'
  Headers='22a5d7e8-78fc-4c48-a0b8-4e9d8ec7207f'
  HeroCarousels='9abf9014-01c3-460a-b31b-9f98fbf05fcd'
  HeroSlides='bafd3153-1615-4c7e-8eba-0ff936e67e92'
  HighlightLinkCards='da0a803b-5c43-4045-9b97-8f8277cbd6d1'
  HighlightLinkGrids='48203958-5a40-4edf-a10e-81520535b582'
  LinkColumns='17c7d4f6-a9de-46a4-ba2c-480e0d3f366f'
  LinkColumnGrids='60684ff4-2e4b-43a9-b0fd-a9085afc50e3'
  LinkListItems='a67367f8-d04b-4e84-b6c5-47b981d347e0'
  Navigations='bfadc906-3695-4bd0-81ee-b057c95b0ae3'
  NavItems='b258ae14-892b-4037-aa45-df9fe1f6a62e'
  PageTitleHeaders='af753a85-55f3-4547-863e-0caacd68e94f'
  PageUtilityActions='0fd66885-cecc-41fb-a914-b8bb94833496'
  RichTextSections='70dd0ef4-ba88-4d42-9e93-d804945dcc36'
  SocialLinkItems='6fb637be-f9ec-4c45-85f9-3321e3b85e5e'
  TopBars='2bf184f3-60ec-4b3f-b459-ba35a958c1fb'
  VideoEmbedGrids='6c52ecd2-7947-453c-bfe4-bcbb82e41d7b'
  VideoEmbedItems='9d971f4c-fb45-4d68-add6-40575bbb3e9e'
}

# Field IDs
$F = @{
  'TopBar.PrimaryLink'='142e8cc6-8459-4658-a09b-64b5b2395d07'
  'TopBar.SecondaryLink'='d4aa7741-51e2-47e7-8a18-e03561bba354'
  'Header.Logo'='ed36bde4-dc62-4f10-8635-ab964b611122'
  'Header.LogoLink'='94a86338-b0ef-4341-820b-332dfe562318'
  'Navigation.Description'='bd02c3c0-a5e7-451c-ae82-30f15e3e6263'
  'Navigation.Image'='15f0905f-0143-44a0-a5c6-89d9faf807d2'
  'Navigation.Link'='365f6247-8ecf-4257-85fb-5e2ea6c080bc'
  'NavItem.Link'='422282cb-83ef-4695-b987-ce0ac5e0385a'
  'NavItem.Title'='6bede9bd-5bbe-44b0-9617-d2e993b154ab'
  'CookieBanner.Body'='fdc442e5-e51e-471e-a2fa-b1a2577326e4'
  'CookieBanner.PolicyLink'='4e19cc87-9ae7-430e-9cbb-48e8140bec54'
  'Footer.AddressBody'='1a772286-aee3-4b21-9884-d8433a14c925'
  'Footer.AddressTitle'='a166c3b8-0a7b-4061-b85d-347a568e6d81'
  'Footer.AlertsIntro'='087347ff-f05b-4d36-ae07-8481308a7c25'
  'Footer.AlertsTitle'='550e1e2b-3694-48cb-8fd2-6cf87ea9a795'
  'Footer.ContactBody'='41e76ecc-fed2-4ca3-8df3-3386c52cd813'
  'Footer.ContactTitle'='3b8b0556-503d-46f0-b672-a16e8aec8ce5'
  'Footer.Copyright'='f0940c2f-d0d8-4fc2-9de1-709a718f43ab'
  'Footer.Logo'='b948ed01-2ff3-4553-b333-28f6b589adc3'
  'Footer.MailingBody'='40eef396-8d7e-4650-a9bf-450d5dbc9d81'
  'Footer.MailingTitle'='c43dc1cc-1fd6-47f3-99e4-0f2cb40660c9'
  'Footer.PrivacyLink'='469b67ed-328a-42fe-9108-c8fb06d9e80f'
  'Footer.SitemapLink'='788b7a7a-e299-43aa-b5a8-e5e8cbfe15c6'
  'Footer.SubscribeLink'='ac4f3e51-be73-4cd2-a523-ecd41cf020a1'
  'Footer.TermsLink'='d48a3349-937e-4d3c-83e8-1e5a808818f8'
  'SocialLinkItem.IconName'='caabc686-3e34-431e-b985-337857391157'
  'SocialLinkItem.Link'='c65d76a5-d095-4ecc-99c0-970462c85fa5'
  'HeroCarousel.SearchAction'='92dc773e-dc36-4f60-b578-00d549244e1e'
  'HeroCarousel.SearchPlaceholder'='7450da88-d58d-48a3-9847-8259a49757a6'
  'HeroCarousel.Title'='ee1ef844-48c9-4cf7-b619-bdc2b44e51e4'
  'HeroSlide.AltText'='7972fcaf-35e5-4884-a2cc-98cce03e028c'
  'HeroSlide.Image'='dd181db5-2089-45f1-8b5c-a24429a129d2'
  'HeroSlide.Link'='8b770599-02a2-4ecb-bbea-f70cc3527b2a'
  'HighlightLinkCard.AccentColor'='f9f75bdc-d2e7-4de4-a33e-6735c053e3f3'
  'HighlightLinkCard.Link'='f7e42dee-a85c-4d04-82c4-8f1928358693'
  'HighlightLinkCard.Subtitle'='552e746e-4976-449a-bc01-944ae3945379'
  'HighlightLinkCard.Title'='fdb7d136-f910-422c-94d8-3cb0482c9cff'
  'DatedLinkItem.DateLabel'='f18f6df0-c012-428d-a38f-cfe49fbb4d3f'
  'DatedLinkItem.Link'='aa1a5666-cd05-454d-806a-3e0b14ddedb9'
  'LinkColumn.Intro'='3cea7e8c-2461-4316-8fa1-56f8dc2bc923'
  'LinkColumn.Title'='f94b5a8b-0746-4070-b925-be0556fdd57b'
  'LinkListItem.Link'='a1b9e05e-aad6-4280-bee0-9fc728078d0d'
  'BreadcrumbItem.Link'='d49c4558-d511-4523-b958-fb2a55c418d4'
  'BreadcrumbItem.Title'='fd7195d3-9a13-4d9f-910e-22c72e09682f'
  'PageTitleHeader.Title'='36b9f14a-5ce3-40e8-9324-98a7da233840'
  'PageUtilityActions.ShowEmail'='4f93ea46-2cde-4212-a405-3e7319299294'
  'PageUtilityActions.ShowPrint'='8fd766ff-59e9-468f-92f0-18d46cb75edd'
  'PageUtilityActions.ShowShare'='1024387b-2420-45ea-8a1f-660d77fce6cd'
  'RichTextSection.Body'='9ddf3249-06f8-4e90-8ff6-ed2cf084e553'
  'VideoEmbedItem.Title'='37dead59-12bb-457d-b681-93168380cb2e'
  'VideoEmbedItem.VideoUrl'='99a51236-1950-47a4-8f84-1796a66720d1'
  'DocumentCentreLayout.ArchiveLink'='48682c54-4f68-4221-8497-96d6e6e116b4'
  'DocumentCentreLayout.ResultsCountLabel'='ae863d06-60c1-46aa-961f-49f47c348f12'
  'DocumentCentreLayout.ResultsHeading'='92707e8b-b367-4cba-85d1-f37e522b96a4'
  'DocumentCentreLayout.ResultsIntro'='1876bd58-6c59-4137-84c1-c790d17f56f5'
  'DocumentCentreLayout.SidebarTitle'='9eb923c5-4742-457c-8d08-17e3188907b8'
  'DocumentFilterGroup.Title'='f9c6ca82-bdff-46fd-81b6-10757e742dbc'
  'DocumentFilterOption.IsSelected'='7fccdd46-2366-4766-a124-8472103be73d'
  'DocumentFilterOption.Label'='7c7813e0-8767-45e3-b6dd-f2d73bdeebd1'
  'DocumentFilterOption.Value'='980498f6-ba3b-45f1-903a-65c59fc3248b'
  'DocumentResultCard.DownloadLink'='d0e25f76-8234-447d-81d6-046b78af0191'
  'DocumentResultCard.PublishedDate'='e1634151-9478-459d-856a-92739d2f9688'
  'DocumentResultCard.RelatedLink'='ce9a6cc2-5a68-45e6-bd79-6a8683ab9346'
  'DocumentResultCard.Title'='dfda149f-3cac-4127-8f02-6e2b879aa0a3'
  'DocumentResultCard.ViewLink'='8b0aa85c-76e5-4041-834a-10c90b0ff79f'
}

# ============================================================================
# 1. Placeholder settings
# ============================================================================
Write-Host "Creating placeholder settings..."
$phDefs = @(
  @{ Name='header-navigation'; Allows='{58C6C8EC-AA8A-4D87-ADC3-DFA631AF6128}'.Replace('58C6C8EC','C4EB9052').Replace('AA8A-4D87-ADC3-DFA631AF6128','B412-437E-A428-888CC5A0381F'); AllowId=$Rend.Navigation }
  @{ Name='nav-children'; AllowId=$Rend.NavItem }
  @{ Name='footer-social-links'; AllowId=$Rend.SocialLinkItem }
  @{ Name='hero-slides'; AllowId=$Rend.HeroSlide }
  @{ Name='highlight-cards'; AllowId=$Rend.HighlightLinkCard }
  @{ Name='highlight-items'; AllowId=$Rend.DatedLinkItem }
  @{ Name='link-columns'; AllowId=$Rend.LinkColumn }
  @{ Name='column-links'; AllowId=$Rend.LinkListItem }
  @{ Name='breadcrumb-items'; AllowId=$Rend.BreadcrumbItem }
  @{ Name='video-items'; AllowId=$Rend.VideoEmbedItem }
  @{ Name='document-filters'; AllowId=$Rend.DocumentFilterGroup }
  @{ Name='document-results'; AllowId=$Rend.DocumentResultCard }
  @{ Name='filter-options'; AllowId=$Rend.DocumentFilterOption }
)

$phIds = @{}
foreach ($p in $phDefs) {
  $id = New-GuidLike "ph-$($p.Name)"
  $phIds[$p.Name] = $id
  $allow = "{$($p.AllowId.ToUpper())}"
  Write-YamlItem -RelPath "placeholder-settings/bermuda-monetary-authority/$($p.Name).yml" `
    -Id $id -Parent $PH_PARENT -Template $T_PH `
    -SitecorePath "/sitecore/layout/Placeholder Settings/Project/bermuda-monetary-authority/$($p.Name)" `
    -SharedFields @(
      @{ ID='7256bdab-1fd2-49dd-b205-cb4873d2917c'; Hint='Placeholder Key'; Value="$($p.Name)-{*}" },
      @{ ID='e391b526-d0c5-439d-803e-17512eae6222'; Hint='Allowed Controls'; Value=$allow }
    )
}

# ============================================================================
# 2. Patch rendering Placeholders fields
# ============================================================================
Write-Host "Patching rendering Placeholders..."
$phPatches = @{
  'Header.yml' = @($phIds['header-navigation'])
  'Navigation.yml' = @($phIds['nav-children'])
  'NavItem.yml' = @($phIds['nav-children'])
  'Footer.yml' = @($phIds['footer-social-links'])
  'HeroCarousel.yml' = @($phIds['hero-slides'])
  'HighlightLinkGrid.yml' = @($phIds['highlight-cards'])
  'HighlightLinkCard.yml' = @($phIds['highlight-items'])
  'LinkColumnGrid.yml' = @($phIds['link-columns'])
  'LinkColumn.yml' = @($phIds['column-links'])
  'Breadcrumb.yml' = @($phIds['breadcrumb-items'])
  'VideoEmbedGrid.yml' = @($phIds['video-items'])
  'DocumentCentreLayout.yml' = @($phIds['document-filters'], $phIds['document-results'])
  'DocumentFilterGroup.yml' = @($phIds['filter-options'])
}

foreach ($file in $phPatches.Keys) {
  $path = Join-Path $root "renderings/bermuda-monetary-authority/$file"
  $content = Get-Content $path -Raw
  if ($content -match 'Hint: Placeholders') { Write-Host "  Skip (exists): $file"; continue }
  $ids = ($phPatches[$file] | ForEach-Object { "    {$($_.ToUpper())}" }) -join "`r`n"
  $block = @"
- ID: "069a8361-b1cd-437c-8c32-a3be78941446"
  Hint: Placeholders
  Value: |
$ids
"@
  # Insert after componentName SharedField block (after first SharedFields entry value)
  if ($content -match '(?s)(SharedFields:\r?\n- ID: "037fe404-dd19-4bf7-8e30-4dadf68b27b0".*?Value: \w+\r?\n)') {
    $content = $content -replace '(SharedFields:\r?\n- ID: "037fe404-dd19-4bf7-8e30-4dadf68b27b0"\r?\n  Hint: componentName\r?\n  Value: \w+\r?\n)', "`$1$block`r`n"
    $utf8NoBom = New-Object System.Text.UTF8Encoding $false
    [System.IO.File]::WriteAllText($path, $content, $utf8NoBom)
    Write-Host "  Patched: $file"
  } else {
    Write-Host "  WARN: could not patch $file"
  }
}

# ============================================================================
# 3. Available Renderings
# ============================================================================
Write-Host "Updating Available Renderings..."
function Set-RenderingsList([string]$rel, [string[]]$ids) {
  $path = Join-Path $root $rel
  $content = Get-Content $path -Raw
  $list = ($ids | ForEach-Object { "    {$($_.ToUpper())}" }) -join "`r`n"
  $content = $content -replace '(?s)(Hint: Renderings\r?\n  Value: \|)\r?\n(?:    \{[0-9A-Fa-f-]+\}\r?\n)+', "`$1`r`n$list`r`n"
  $utf8NoBom = New-Object System.Text.UTF8Encoding $false
  [System.IO.File]::WriteAllText($path, $content, $utf8NoBom)
}

Set-RenderingsList "bma-website/bma-website/Presentation/Available Renderings/Navigation.yml" @(
  $Rend.TopBar, $Rend.Header, $Rend.Navigation, $Rend.NavItem, $Rend.CookieBanner, $Rend.Footer, $Rend.SocialLinkItem, $Rend.Breadcrumb, $Rend.BreadcrumbItem
)
Set-RenderingsList "bma-website/bma-website/Presentation/Available Renderings/Page Structure.yml" @(
  $Rend.PageTitleHeader, $Rend.PageUtilityActions, $Rend.DocumentCentreLayout, $Rend.DocumentFilterGroup, $Rend.DocumentFilterOption, $Rend.HeroCarousel, $Rend.HighlightLinkGrid, $Rend.LinkColumnGrid, $Rend.VideoEmbedGrid
)
Set-RenderingsList "bma-website/bma-website/Presentation/Available Renderings/Page Content.yml" @(
  $Rend.HeroSlide, $Rend.HighlightLinkCard, $Rend.DatedLinkItem, $Rend.LinkColumn, $Rend.LinkListItem, $Rend.RichTextSection, $Rend.VideoEmbedItem, $Rend.DocumentResultCard
)

# ============================================================================
# 4. Data folders + datasources
# ============================================================================
Write-Host "Creating Data folders and datasources..."
$folderIds = @{}
foreach ($name in $FT.Keys) {
  $fid = New-GuidLike "folder-$name"
  $folderIds[$name] = $fid
  Write-YamlItem -RelPath "bma-website/bma-website/Data/$name.yml" `
    -Id $fid -Parent $DATA_PARENT -Template $FT[$name] `
    -SitecorePath "/sitecore/content/bermuda-monetary-authority/bma-website/Data/$name"
}

# Helper for datasource
$ds = @{}
function New-Ds {
  param([string]$Key, [string]$FolderName, [string]$ItemName, [string]$TemplateId, [hashtable[]]$Fields)
  $id = New-GuidLike "ds-$Key"
  $ds[$Key] = $id
  Write-YamlItem -RelPath "bma-website/bma-website/Data/$FolderName/$ItemName.yml" `
    -Id $id -Parent $folderIds[$FolderName] -Template $TemplateId `
    -SitecorePath "/sitecore/content/bermuda-monetary-authority/bma-website/Data/$FolderName/$ItemName" `
    -VersionFields $Fields
  return $id
}

# TopBar
New-Ds 'TopBar' 'TopBars' 'Site TopBar' $DT.TopBar @(
  @{ ID=$F['TopBar.PrimaryLink']; Hint='PrimaryLink'; Value=(ExtLink 'Commemorative Coins' 'https://www.bma.bm/commemorative-coins') },
  @{ ID=$F['TopBar.SecondaryLink']; Hint='SecondaryLink'; Value=(ExtLink 'Regulated Entities' 'https://www.bma.bm/regulated-entities') }
) | Out-Null

# Header
New-Ds 'Header' 'Headers' 'Site Header' $DT.Header @(
  @{ ID=$F['Header.LogoLink']; Hint='LogoLink'; Value=(IntLink 'Bermuda Monetary Authority' $HOME_ID '/') }
) | Out-Null

# Navigation + NavItems
New-Ds 'Nav-About' 'Navigations' 'About Us' $DT.Navigation @(
  @{ ID=$F['Navigation.Link']; Hint='Link'; Value=(ExtLink 'About Us' '/About Us') }
) | Out-Null
New-Ds 'Nav-Regulation' 'Navigations' 'Regulation' $DT.Navigation @(
  @{ ID=$F['Navigation.Link']; Hint='Link'; Value=(ExtLink 'Regulation' '/regulation') }
) | Out-Null
New-Ds 'Nav-Documents' 'Navigations' 'Documents Centre' $DT.Navigation @(
  @{ ID=$F['Navigation.Link']; Hint='Link'; Value=(ExtLink 'Documents Centre' '/Documents Centre') }
) | Out-Null
New-Ds 'Nav-News' 'Navigations' 'News' $DT.Navigation @(
  @{ ID=$F['Navigation.Link']; Hint='Link'; Value=(ExtLink 'News' '/news') }
) | Out-Null

New-Ds 'NavItem-Mission' 'NavItems' 'Our Mission' $DT.NavItem @(
  @{ ID=$F['NavItem.Title']; Hint='Title'; Value='Our Mission' },
  @{ ID=$F['NavItem.Link']; Hint='Link'; Value=(ExtLink 'Our Mission' '/About Us') }
) | Out-Null
New-Ds 'NavItem-Leadership' 'NavItems' 'Leadership' $DT.NavItem @(
  @{ ID=$F['NavItem.Title']; Hint='Title'; Value='Leadership' },
  @{ ID=$F['NavItem.Link']; Hint='Link'; Value=(ExtLink 'Leadership' '/about-us/leadership') }
) | Out-Null
New-Ds 'NavItem-Insurance' 'NavItems' 'Insurance' $DT.NavItem @(
  @{ ID=$F['NavItem.Title']; Hint='Title'; Value='Insurance' },
  @{ ID=$F['NavItem.Link']; Hint='Link'; Value=(ExtLink 'Insurance' '/regulation/insurance') }
) | Out-Null
New-Ds 'NavItem-Banking' 'NavItems' 'Banking' $DT.NavItem @(
  @{ ID=$F['NavItem.Title']; Hint='Title'; Value='Banking' },
  @{ ID=$F['NavItem.Link']; Hint='Link'; Value=(ExtLink 'Banking' '/regulation/banking') }
) | Out-Null

# CookieBanner
New-Ds 'Cookie' 'CookieBanners' 'Site Cookie Banner' $DT.CookieBanner @(
  @{ ID=$F['CookieBanner.Body']; Hint='Body'; Value='<p>We use cookies to improve your experience on the BMA website. By continuing, you agree to our cookie policy.</p>' },
  @{ ID=$F['CookieBanner.PolicyLink']; Hint='PolicyLink'; Value=(ExtLink 'Cookie Policy' 'https://www.bma.bm/cookie-policy') }
) | Out-Null

# Footer + Social
New-Ds 'Footer' 'Footers' 'Site Footer' $DT.Footer @(
  @{ ID=$F['Footer.AddressTitle']; Hint='AddressTitle'; Value='Address' },
  @{ ID=$F['Footer.AddressBody']; Hint='AddressBody'; Value='<p>BMA House<br />43 Victoria Street<br />Hamilton HM 12<br />Bermuda</p>' },
  @{ ID=$F['Footer.ContactTitle']; Hint='ContactTitle'; Value='Contact' },
  @{ ID=$F['Footer.ContactBody']; Hint='ContactBody'; Value='<p>Tel: +1 441 295 5278<br />Email: enquiries@bma.bm</p>' },
  @{ ID=$F['Footer.AlertsTitle']; Hint='AlertsTitle'; Value='Alerts' },
  @{ ID=$F['Footer.AlertsIntro']; Hint='AlertsIntro'; Value='<p>Stay informed about regulatory notices and market alerts.</p>' },
  @{ ID=$F['Footer.MailingTitle']; Hint='MailingTitle'; Value='Mailing List' },
  @{ ID=$F['Footer.MailingBody']; Hint='MailingBody'; Value='<p>Subscribe for BMA updates and publications.</p>' },
  @{ ID=$F['Footer.Copyright']; Hint='Copyright'; Value='Â(c) Bermuda Monetary Authority. All rights reserved.' },
  @{ ID=$F['Footer.PrivacyLink']; Hint='PrivacyLink'; Value=(ExtLink 'Privacy' 'https://www.bma.bm/privacy') },
  @{ ID=$F['Footer.TermsLink']; Hint='TermsLink'; Value=(ExtLink 'Terms' 'https://www.bma.bm/terms') },
  @{ ID=$F['Footer.SitemapLink']; Hint='SitemapLink'; Value=(ExtLink 'Sitemap' '/sitemap') },
  @{ ID=$F['Footer.SubscribeLink']; Hint='SubscribeLink'; Value=(ExtLink 'Subscribe' 'https://www.bma.bm/subscribe') }
) | Out-Null

New-Ds 'Social-LinkedIn' 'SocialLinkItems' 'LinkedIn' $DT.SocialLinkItem @(
  @{ ID=$F['SocialLinkItem.IconName']; Hint='IconName'; Value='linkedin' },
  @{ ID=$F['SocialLinkItem.Link']; Hint='Link'; Value=(ExtLink 'LinkedIn' 'https://www.linkedin.com/company/bermuda-monetary-authority') }
) | Out-Null
New-Ds 'Social-X' 'SocialLinkItems' 'X' $DT.SocialLinkItem @(
  @{ ID=$F['SocialLinkItem.IconName']; Hint='IconName'; Value='x' },
  @{ ID=$F['SocialLinkItem.Link']; Hint='Link'; Value=(ExtLink 'X' 'https://twitter.com/BMA_Bermuda') }
) | Out-Null
New-Ds 'Social-YouTube' 'SocialLinkItems' 'YouTube' $DT.SocialLinkItem @(
  @{ ID=$F['SocialLinkItem.IconName']; Hint='IconName'; Value='youtube' },
  @{ ID=$F['SocialLinkItem.Link']; Hint='Link'; Value=(ExtLink 'YouTube' 'https://www.youtube.com/@BermudaMonetaryAuthority') }
) | Out-Null

# Hero
New-Ds 'Hero' 'HeroCarousels' 'Home Hero' $DT.HeroCarousel @(
  @{ ID=$F['HeroCarousel.Title']; Hint='Title'; Value='Protecting Bermuda''s financial system' },
  @{ ID=$F['HeroCarousel.SearchPlaceholder']; Hint='SearchPlaceholder'; Value='Search the BMA website...' },
  @{ ID=$F['HeroCarousel.SearchAction']; Hint='SearchAction'; Value=(ExtLink 'Search' '/search') }
) | Out-Null
New-Ds 'Slide1' 'HeroSlides' 'Slide Regulatory' $DT.HeroSlide @(
  @{ ID=$F['HeroSlide.AltText']; Hint='AltText'; Value='Regulatory excellence' },
  @{ ID=$F['HeroSlide.Link']; Hint='Link'; Value=(ExtLink 'Learn more' '/About Us') }
) | Out-Null
New-Ds 'Slide2' 'HeroSlides' 'Slide Documents' $DT.HeroSlide @(
  @{ ID=$F['HeroSlide.AltText']; Hint='AltText'; Value='Documents Centre' },
  @{ ID=$F['HeroSlide.Link']; Hint='Link'; Value=(ExtLink 'Browse documents' '/Documents Centre') }
) | Out-Null
New-Ds 'Slide3' 'HeroSlides' 'Slide News' $DT.HeroSlide @(
  @{ ID=$F['HeroSlide.AltText']; Hint='AltText'; Value='Latest news' },
  @{ ID=$F['HeroSlide.Link']; Hint='Link'; Value=(ExtLink 'View news' '/news') }
) | Out-Null

# Highlight grid
New-Ds 'HLGrid' 'HighlightLinkGrids' 'Home Highlights' $DT.HighlightLinkGrid @() | Out-Null

$cards = @(
  @{ Key='Card-CP'; Name='Consultation Papers'; Color='teal'; Sub='Open consultations'; Url='/Documents Centre/Discussion Consultation Papers' },
  @{ Key='Card-Sanctions'; Name='Sanctions'; Color='maroon'; Sub='Sanctions notices'; Url='/sanctions' },
  @{ Key='Card-Notices'; Name='Notices'; Color='navy'; Sub='Regulatory notices'; Url='/notices' },
  @{ Key='Card-News'; Name='Latest News'; Color='yellow'; Sub='News and updates'; Url='/news' }
)
foreach ($c in $cards) {
  New-Ds $c.Key 'HighlightLinkCards' $c.Name $DT.HighlightLinkCard @(
    @{ ID=$F['HighlightLinkCard.Title']; Hint='Title'; Value=$c.Name },
    @{ ID=$F['HighlightLinkCard.Subtitle']; Hint='Subtitle'; Value=$c.Sub },
    @{ ID=$F['HighlightLinkCard.AccentColor']; Hint='AccentColor'; Value=$c.Color },
    @{ ID=$F['HighlightLinkCard.Link']; Hint='Link'; Value=(ExtLink $c.Name $c.Url) }
  ) | Out-Null
  New-Ds "$($c.Key)-D1" 'DatedLinkItems' "$($c.Name) Item 1" $DT.DatedLinkItem @(
    @{ ID=$F['DatedLinkItem.DateLabel']; Hint='DateLabel'; Value='15 Aug 2026' },
    @{ ID=$F['DatedLinkItem.Link']; Hint='Link'; Value=(ExtLink "$($c.Name) update" $c.Url) }
  ) | Out-Null
  New-Ds "$($c.Key)-D2" 'DatedLinkItems' "$($c.Name) Item 2" $DT.DatedLinkItem @(
    @{ ID=$F['DatedLinkItem.DateLabel']; Hint='DateLabel'; Value='01 Jul 2026' },
    @{ ID=$F['DatedLinkItem.Link']; Hint='Link'; Value=(ExtLink "$($c.Name) archive" $c.Url) }
  ) | Out-Null
}

# Link columns
New-Ds 'LCGrid' 'LinkColumnGrids' 'Home Link Columns' $DT.LinkColumnGrid @() | Out-Null
$cols = @(
  @{ Key='Col-Reg'; Name='Regulation'; Intro='Supervisory frameworks'; Links=@('Insurance','Banking','Investment Business','Digital Assets') },
  @{ Key='Col-Lic'; Name='Licensing'; Intro='Authorisations and licences'; Links=@('Apply for a licence','Licence types','Fees') },
  @{ Key='Col-Pub'; Name='Publications'; Intro='Reports and guidance'; Links=@('Annual Report','Guidance Notes','Statistical Bulletin') },
  @{ Key='Col-About'; Name='About the BMA'; Intro='Who we are'; Links=@('Our Mission','Leadership','Careers') }
)
foreach ($col in $cols) {
  New-Ds $col.Key 'LinkColumns' $col.Name $DT.LinkColumn @(
    @{ ID=$F['LinkColumn.Title']; Hint='Title'; Value=$col.Name },
    @{ ID=$F['LinkColumn.Intro']; Hint='Intro'; Value=$col.Intro }
  ) | Out-Null
  $i = 0
  foreach ($ln in $col.Links) {
    $i++
    New-Ds "$($col.Key)-L$i" 'LinkListItems' "$($col.Name) - $ln" $DT.LinkListItem @(
      @{ ID=$F['LinkListItem.Link']; Hint='Link'; Value=(ExtLink $ln "/$($ln.ToLower() -replace ' ','-')") }
    ) | Out-Null
  }
}

# About Us datasources
New-Ds 'BC-About' 'Breadcrumbs' 'About Us Breadcrumb' $DT.Breadcrumb @() | Out-Null
New-Ds 'BCI-Home' 'BreadcrumbItems' 'Home Crumb' $DT.BreadcrumbItem @(
  @{ ID=$F['BreadcrumbItem.Title']; Hint='Title'; Value='Home' },
  @{ ID=$F['BreadcrumbItem.Link']; Hint='Link'; Value=(IntLink 'Home' $HOME_ID '/') }
) | Out-Null
New-Ds 'BCI-About' 'BreadcrumbItems' 'About Us Crumb' $DT.BreadcrumbItem @(
  @{ ID=$F['BreadcrumbItem.Title']; Hint='Title'; Value='About Us' },
  @{ ID=$F['BreadcrumbItem.Link']; Hint='Link'; Value=(ExtLink 'About Us' '/About Us') }
) | Out-Null
New-Ds 'PUA-About' 'PageUtilityActions' 'About Us Actions' $DT.PageUtilityActions @(
  @{ ID=$F['PageUtilityActions.ShowShare']; Hint='ShowShare'; Value='1' },
  @{ ID=$F['PageUtilityActions.ShowPrint']; Hint='ShowPrint'; Value='1' },
  @{ ID=$F['PageUtilityActions.ShowEmail']; Hint='ShowEmail'; Value='1' }
) | Out-Null
New-Ds 'PTH-About' 'PageTitleHeaders' 'About Us Title' $DT.PageTitleHeader @(
  @{ ID=$F['PageTitleHeader.Title']; Hint='Title'; Value='About Us' }
) | Out-Null
New-Ds 'RTS-About' 'RichTextSections' 'About Us Mission' $DT.RichTextSection @(
  @{ ID=$F['RichTextSection.Body']; Hint='Body'; Value='<h2>Our Mission</h2><p>The Bermuda Monetary Authority protects the integrity and stability of Bermuda''s financial system and promotes Bermuda as a leading international financial centre.</p><h2>Our Vision</h2><p>To be a trusted, respected supervisor that supports sustainable growth through proportionate regulation.</p>' }
) | Out-Null
New-Ds 'VEG-About' 'VideoEmbedGrids' 'About Us Videos' $DT.VideoEmbedGrid @() | Out-Null
New-Ds 'VEI-1' 'VideoEmbedItems' 'BMA Overview' $DT.VideoEmbedItem @(
  @{ ID=$F['VideoEmbedItem.Title']; Hint='Title'; Value='BMA Overview' },
  @{ ID=$F['VideoEmbedItem.VideoUrl']; Hint='VideoUrl'; Value='https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
) | Out-Null
New-Ds 'VEI-2' 'VideoEmbedItems' 'Regulatory Update' $DT.VideoEmbedItem @(
  @{ ID=$F['VideoEmbedItem.Title']; Hint='Title'; Value='Regulatory Update' },
  @{ ID=$F['VideoEmbedItem.VideoUrl']; Hint='VideoUrl'; Value='https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
) | Out-Null

# Document Centre
New-Ds 'DCL' 'DocumentCentreLayouts' 'Documents Centre Layout' $DT.DocumentCentreLayout @(
  @{ ID=$F['DocumentCentreLayout.SidebarTitle']; Hint='SidebarTitle'; Value='Filter documents' },
  @{ ID=$F['DocumentCentreLayout.ResultsHeading']; Hint='ResultsHeading'; Value='Discussion & Consultation Papers' },
  @{ ID=$F['DocumentCentreLayout.ResultsIntro']; Hint='ResultsIntro'; Value='Browse open and closed consultation papers.' },
  @{ ID=$F['DocumentCentreLayout.ResultsCountLabel']; Hint='ResultsCountLabel'; Value='results' },
  @{ ID=$F['DocumentCentreLayout.ArchiveLink']; Hint='ArchiveLink'; Value=(ExtLink 'View archive' '/Documents Centre') }
) | Out-Null
New-Ds 'FG-Type' 'DocumentFilterGroups' 'Type' $DT.DocumentFilterGroup @(
  @{ ID=$F['DocumentFilterGroup.Title']; Hint='Title'; Value='Type' }
) | Out-Null
New-Ds 'FG-Cat' 'DocumentFilterGroups' 'Category' $DT.DocumentFilterGroup @(
  @{ ID=$F['DocumentFilterGroup.Title']; Hint='Title'; Value='Category' }
) | Out-Null
foreach ($o in @(
  @{ Key='FO-CP'; Name='Consultation Paper'; Val='consultation-paper'; Sel='1'; G='Type' },
  @{ Key='FO-Disc'; Name='Discussion Paper'; Val='discussion-paper'; Sel='0'; G='Type' },
  @{ Key='FO-Ins'; Name='Insurance'; Val='insurance'; Sel='0'; G='Cat' },
  @{ Key='FO-Bank'; Name='Banking'; Val='banking'; Sel='0'; G='Cat' },
  @{ Key='FO-Inv'; Name='Investment'; Val='investment'; Sel='0'; G='Cat' }
)) {
  New-Ds $o.Key 'DocumentFilterOptions' $o.Name $DT.DocumentFilterOption @(
    @{ ID=$F['DocumentFilterOption.Label']; Hint='Label'; Value=$o.Name },
    @{ ID=$F['DocumentFilterOption.Value']; Hint='Value'; Value=$o.Val },
    @{ ID=$F['DocumentFilterOption.IsSelected']; Hint='IsSelected'; Value=$o.Sel }
  ) | Out-Null
}

# ============================================================================
# 5. Media documents (create first so result cards can link)
# ============================================================================
Write-Host "Creating media documents..."
$docsFolderId = New-GuidLike 'media-documents-folder'
Write-YamlItem -RelPath "media-library/bermuda-monetary-authority/bma-website/Documents.yml" `
  -Id $docsFolderId -Parent $MEDIA_LIB -Template $T_MEDIA_FOLDER `
  -SitecorePath "/sitecore/media library/Project/bermuda-monetary-authority/bma-website/Documents"

$docNames = @(
  'CP-Insurance-Capital-2026',
  'CP-Banking-Liquidity-2026',
  'DP-Digital-Assets-2025',
  'CP-Investment-Business-2025',
  'Notice-Sanctions-Update-2026',
  'Guidance-Corporate-Governance',
  'Statistical-Bulletin-Q2-2026',
  'Annual-Report-2025'
)
$docIds = @{}
$i = 0
foreach ($dn in $docNames) {
  $i++
  $id = New-GuidLike "media-doc-$dn"
  $docIds["Doc$i"] = $id
  $ds["Doc$i"] = $id
  # Minimal Unversioned File without Blob
  $full = Join-Path $root "media-library/bermuda-monetary-authority/bma-website/Documents/$dn.yml"
  $dir = Split-Path $full -Parent
  if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  $yaml = @"
---
ID: "$id"
Parent: "$docsFolderId"
Template: "$T_FILE"
Path: "/sitecore/media library/Project/bermuda-monetary-authority/bma-website/Documents/$dn"
SharedFields:
- ID: "6f47a0a5-9c94-4b48-abeb-42d38def6054"
  Hint: Mime Type
  Value: "application/pdf"
- ID: "c06867fe-9a43-4c7d-b739-48780492d06f"
  Hint: Extension
  Value: "pdf"
- ID: "6954b7c7-2487-423f-8600-436cb3b6dc0e"
  Hint: Size
  Value: "0"
Languages:
- Language: en
  Versions:
  - Version: 1
    Fields:
    - ID: "25bed78c-4957-4165-998a-ca1b52f67497"
      Hint: __Created
      Value: $stamp
    - ID: "5dd74568-4d4b-44c1-b513-0af5f4cda34f"
      Hint: __Created by
      Value: |
        $owner
    - ID: "8cdc337e-a112-42fb-bbb4-4143751e123f"
      Hint: __Revision
      Value: "$id"
    - ID: "3f4b20e9-36e6-4d45-a423-c86567373f82"
      Hint: Title
      Value: "$($dn -replace '-',' ')"
    - ID: "badd9cf9-53e0-4d0c-bcc0-2d784c282f6a"
      Hint: __Updated by
      Value: |
        $owner
    - ID: "d9cf14b1-fa16-4ba6-9288-e8a174d4d522"
      Hint: __Updated
      Value: $stamp
"@
  $utf8NoBom = New-Object System.Text.UTF8Encoding $false
  [System.IO.File]::WriteAllText($full, $yaml, $utf8NoBom)
  $created.Add("media-library/bermuda-monetary-authority/bma-website/Documents/$dn.yml") | Out-Null
}

# Document result cards
$results = @(
  @{ Key='DR1'; Title='Consultation Paper - Insurance Capital'; Date='12 Aug 2026'; Doc=1 },
  @{ Key='DR2'; Title='Consultation Paper - Banking Liquidity'; Date='05 Aug 2026'; Doc=2 },
  @{ Key='DR3'; Title='Discussion Paper - Digital Assets'; Date='22 Jul 2026'; Doc=3 },
  @{ Key='DR4'; Title='Consultation Paper - Investment Business'; Date='10 Jul 2026'; Doc=4 },
  @{ Key='DR5'; Title='Sanctions Notice Update'; Date='01 Jul 2026'; Doc=5 },
  @{ Key='DR6'; Title='Guidance - Corporate Governance'; Date='18 Jun 2026'; Doc=6 },
  @{ Key='DR7'; Title='Statistical Bulletin Q2 2026'; Date='30 Jun 2026'; Doc=7 },
  @{ Key='DR8'; Title='Annual Report 2025'; Date='15 May 2026'; Doc=8 }
)
foreach ($res in $results) {
  $mid = $docIds["Doc$($res.Doc)"]
  New-Ds $res.Key 'DocumentResultCards' $res.Title $DT.DocumentResultCard @(
    @{ ID=$F['DocumentResultCard.Title']; Hint='Title'; Value=$res.Title },
    @{ ID=$F['DocumentResultCard.PublishedDate']; Hint='PublishedDate'; Value=$res.Date },
    @{ ID=$F['DocumentResultCard.ViewLink']; Hint='ViewLink'; Value=(MediaLink 'View' $mid) },
    @{ ID=$F['DocumentResultCard.DownloadLink']; Hint='DownloadLink'; Value=(MediaLink 'Download' $mid) }
  ) | Out-Null
}

# ============================================================================
# 6. Partial Designs
# ============================================================================
Write-Host "Creating Partial Designs..."
$pdTopBar = New-GuidLike 'pd-topbar'
$pdHeader = New-GuidLike 'pd-header'
$pdCookie = New-GuidLike 'pd-cookie'
$pdFooter = New-GuidLike 'pd-footer'

# TopBar partial
$uidTB = '{B0A10001-0001-4001-8001-000000000001}'
$xmlTopBar = @"
<r xmlns:p="p" xmlns:s="s" p:p="1">
  <d id="{FE5D7FDF-89C0-4D99-9AA3-B5FBD009C9F3}">
    <r uid="$uidTB" p:before="*" s:ds="$($ds['TopBar'])" s:id="{$($Rend.TopBar.ToUpper())}" s:par="CSSStyles&amp;DynamicPlaceholderId=1" s:ph="headless-header" />
  </d>
</r>
"@
Write-YamlItem -RelPath "bma-website/bma-website/Presentation/Partial Designs/TopBar.yml" `
  -Id $pdTopBar -Parent $PD_FOLDER -Template $T_PD `
  -SitecorePath "/sitecore/content/bermuda-monetary-authority/bma-website/Presentation/Partial Designs/TopBar" `
  -SharedFields @(
    @{ ID='55faae90-3bba-4f7f-96fe-13c3f40055ff'; Hint='Signature'; Value='topbar' },
    @{ ID='f1a1fe9e-a60c-4ddb-a3a0-bb5b29fe732e'; Hint='__Renderings'; Value=$xmlTopBar.Trim() }
  )

# Header partial with Navigation + NavItems
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
"@
Write-YamlItem -RelPath "bma-website/bma-website/Presentation/Partial Designs/Header.yml" `
  -Id $pdHeader -Parent $PD_FOLDER -Template $T_PD `
  -SitecorePath "/sitecore/content/bermuda-monetary-authority/bma-website/Presentation/Partial Designs/Header" `
  -SharedFields @(
    @{ ID='55faae90-3bba-4f7f-96fe-13c3f40055ff'; Hint='Signature'; Value='header' },
    @{ ID='f1a1fe9e-a60c-4ddb-a3a0-bb5b29fe732e'; Hint='__Renderings'; Value=$xmlHeader.Trim() }
  )

$uidCK = '{B0A10003-0001-4001-8001-000000000001}'
$xmlCookie = @"
<r xmlns:p="p" xmlns:s="s" p:p="1">
  <d id="{FE5D7FDF-89C0-4D99-9AA3-B5FBD009C9F3}">
    <r uid="$uidCK" p:before="*" s:ds="$($ds['Cookie'])" s:id="{$($Rend.CookieBanner.ToUpper())}" s:par="CSSStyles" s:ph="headless-cookie" />
  </d>
</r>
"@
Write-YamlItem -RelPath "bma-website/bma-website/Presentation/Partial Designs/Cookie.yml" `
  -Id $pdCookie -Parent $PD_FOLDER -Template $T_PD `
  -SitecorePath "/sitecore/content/bermuda-monetary-authority/bma-website/Presentation/Partial Designs/Cookie" `
  -SharedFields @(
    @{ ID='55faae90-3bba-4f7f-96fe-13c3f40055ff'; Hint='Signature'; Value='cookie' },
    @{ ID='f1a1fe9e-a60c-4ddb-a3a0-bb5b29fe732e'; Hint='__Renderings'; Value=$xmlCookie.Trim() }
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
"@
Write-YamlItem -RelPath "bma-website/bma-website/Presentation/Partial Designs/Footer.yml" `
  -Id $pdFooter -Parent $PD_FOLDER -Template $T_PD `
  -SitecorePath "/sitecore/content/bermuda-monetary-authority/bma-website/Presentation/Partial Designs/Footer" `
  -SharedFields @(
    @{ ID='55faae90-3bba-4f7f-96fe-13c3f40055ff'; Hint='Signature'; Value='footer' },
    @{ ID='f1a1fe9e-a60c-4ddb-a3a0-bb5b29fe732e'; Hint='__Renderings'; Value=$xmlFooter.Trim() }
  )

# Partial Design placeholder settings
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
# 7. Page Design Default + TemplatesMapping
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

# Patch TemplatesMapping on Page Designs folder
$pgdPath = Join-Path $root "bma-website/bma-website/Presentation/Page Designs.yml"
$pgdContent = Get-Content $pgdPath -Raw
$mapping = "%7b$($T_PAGE.ToUpper())%7d%3d%257B$($pdDefault.ToUpper())%257D"
if ($pgdContent -notmatch 'TemplatesMapping') {
  $pgdContent = $pgdContent -replace '(SharedFields:\r?\n)', "`$1- ID: `"ba1f60d6-3deb-40cc-bb61-eec772279ee1`"`r`n  Hint: TemplatesMapping`r`n  Value: `"$mapping`"`r`n"
  $utf8NoBom = New-Object System.Text.UTF8Encoding $false
  [System.IO.File]::WriteAllText($pgdPath, $pgdContent, $utf8NoBom)
  Write-Host "  Patched TemplatesMapping"
}

# ============================================================================
# 8. Pages - Home, About Us, Documents Centre
# ============================================================================
Write-Host "Wiring pages..."

function Build-R([string]$uid, [string]$after, [string]$dsId, [string]$rid, [string]$ph, [string]$par) {
  $afterAttr = if ($after) { " p:after=`"r[@uid='$after']`"" } else { ' p:before="*"' }
  $dsAttr = if ($dsId) { " s:ds=`"$dsId`"" } else { '' }
  return "    <r uid=`"$uid`"$afterAttr$dsAttr s:id=`"{$($rid.ToUpper())}`" s:par=`"$par`" s:ph=`"$ph`" />"
}

# Home renderings
$homeRs = [System.Collections.Generic.List[string]]::new()
$u = { param($n) "{B0A20001-0001-4001-8001-$($n.ToString('000000000000'))}" }
$prev = $null
# Hero DynamicPlaceholderId=1
$uid = & $u 1
$homeRs.Add((Build-R $uid $prev $ds['Hero'] $Rend.HeroCarousel 'headless-main' 'CSSStyles&amp;DynamicPlaceholderId=1')) | Out-Null; $prev=$uid
$uid = & $u 2; $homeRs.Add((Build-R $uid $prev $ds['Slide1'] $Rend.HeroSlide '/headless-main/hero-slides-1' 'CSSStyles')) | Out-Null; $prev=$uid
$uid = & $u 3; $homeRs.Add((Build-R $uid $prev $ds['Slide2'] $Rend.HeroSlide '/headless-main/hero-slides-1' 'CSSStyles')) | Out-Null; $prev=$uid
$uid = & $u 4; $homeRs.Add((Build-R $uid $prev $ds['Slide3'] $Rend.HeroSlide '/headless-main/hero-slides-1' 'CSSStyles')) | Out-Null; $prev=$uid
# Highlight grid DP=2, cards DP=3..6
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
# Link columns DP=7, columns DP=8..11
$uid = & $u $n; $homeRs.Add((Build-R $uid $prev $ds['LCGrid'] $Rend.LinkColumnGrid 'headless-main' 'CSSStyles&amp;DynamicPlaceholderId=7')) | Out-Null; $prev=$uid; $n++
$colKeys = @(@{K='Col-Reg';L=4;DP=8},@{K='Col-Lic';L=3;DP=9},@{K='Col-Pub';L=3;DP=10},@{K='Col-About';L=3;DP=11})
foreach ($ck in $colKeys) {
  $uid = & $u $n; $homeRs.Add((Build-R $uid $prev $ds[$ck.K] $Rend.LinkColumn '/headless-main/link-columns-7' "CSSStyles&amp;DynamicPlaceholderId=$($ck.DP)")) | Out-Null; $prev=$uid; $n++
  for ($li=1; $li -le $ck.L; $li++) {
    $uid = & $u $n; $homeRs.Add((Build-R $uid $prev $ds["$($ck.K)-L$li"] $Rend.LinkListItem "/headless-main/link-columns-7/column-links-$($ck.DP)" 'CSSStyles')) | Out-Null; $prev=$uid; $n++
  }
}

$homeXml = @"
<r xmlns:p="p" xmlns:s="s" p:p="1">
  <d id="{FE5D7FDF-89C0-4D99-9AA3-B5FBD009C9F3}">
$($homeRs -join "`n")
  </d>
</r>
"@

# Update Home.yml - inject __Renderings and update titles
$homePath = Join-Path $root "bma-website/bma-website/Home.yml"
$homeContent = Get-Content $homePath -Raw
if ($homeContent -notmatch 'Hint: __Renderings') {
  $homeContent = $homeContent -replace '(SharedFields:\r?\n)', @"
SharedFields:
- ID: "f1a1fe9e-a60c-4ddb-a3a0-bb5b29fe732e"
  Hint: __Renderings
  Value: |
$($homeXml -split "`n" | ForEach-Object { "    $_" } | Out-String)
"@
  # Fix duplicate SharedFields key - the replace already consumed SharedFields:
  # Actually the above creates SharedFields: SharedFields: - need cleaner approach
}
# Safer: rewrite Home.yml fully preserving ID/Parent/Template
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
$($homeXml -split "`n" | ForEach-Object { "    $_" } | Out-String)- ID: "f6d8a61c-2f84-4401-bd24-52d2068172bc"
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
[System.IO.File]::WriteAllText($homePath, $homeYaml, $utf8NoBom)

# About Us page
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
$aboutXml = "<r xmlns:p=`"p`" xmlns:s=`"s`" p:p=`"1`">`n  <d id=`"{FE5D7FDF-89C0-4D99-9AA3-B5FBD009C9F3}`">`n$($aboutRs -join "`n")`n  </d>`n</r>"

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

# Documents Centre page
$docsId = New-GuidLike 'page-documents-centre'
$dcpId = New-GuidLike 'page-discussion-consultation'
# Create Documents Centre with layout pointing to DCL; put full wiring on Discussion Consultation Papers child as that's the source page - but user asked for Document Centre page with layout + filters + 8 cards. Wire on Documents Centre itself, and create child page lightly.

$docRs = [System.Collections.Generic.List[string]]::new()
$u3 = { param($n) "{B0A20003-0001-4001-8001-$($n.ToString('000000000000'))}" }
$prev=$null; $n=1
$uid=& $u3 $n; $docRs.Add((Build-R $uid $prev $ds['DCL'] $Rend.DocumentCentreLayout 'headless-main' 'CSSStyles&amp;DynamicPlaceholderId=1')) | Out-Null; $prev=$uid; $n++
# filters
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
$docXml = "<r xmlns:p=`"p`" xmlns:s=`"s`" p:p=`"1`">`n  <d id=`"{FE5D7FDF-89C0-4D99-9AA3-B5FBD009C9F3}`">`n$($docRs -join "`n")`n  </d>`n</r>"

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

# Child page - Discussion Consultation Papers (can share same layout or be thin)
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

# Export summary JSON
$summary = [ordered]@{
  placeholderSettings = $phIds
  dataFolders = $folderIds
  datasources = $ds
  partialDesigns = @{ TopBar=$pdTopBar; Header=$pdHeader; Cookie=$pdCookie; Footer=$pdFooter }
  pageDesignDefault = $pdDefault
  pages = @{ Home=$HOME_ID; AboutUs=$aboutId; DocumentsCentre=$docsId; DiscussionConsultationPapers=$dcpId }
  mediaDocuments = $docIds
  mediaDocumentsFolder = $docsFolderId
  createdCount = $created.Count
}
$summaryPath = Join-Path $root "..\_wire-bma-summary.json"
$summary | ConvertTo-Json -Depth 6 | Set-Content $summaryPath -Encoding UTF8
Write-Host "DONE. Created $($created.Count) files. Summary: $summaryPath"
Write-Host "PAGE_IDS Home=$HOME_ID About=$aboutId Docs=$docsId DCP=$dcpId"
Write-Host "MEDIA_FOLDER=$docsFolderId"
$docIds.GetEnumerator() | ForEach-Object { Write-Host "MEDIA $($_.Key)=$($_.Value)" }
