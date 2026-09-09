# Fill British Council media library from capture URLs (idempotent).
$ErrorActionPreference = 'Stop'
$repo = 'c:\Projects\SE12\SE12-JBE-DM'
$mediaScript = Join-Path $repo '.cursor\sitecore-yaml\generators\sitecore-media-from-url-yaml\scripts\create-media-from-urls.ps1'
$mediaRoot = Join-Path $repo 'authoring\items\British Council\serialized-content\media-library\british-council\british-council'
$siteRootId = 'bdcefd6c-0684-4b9f-88cd-5d35d2f73620'
$siteMediaPath = '/sitecore/media library/Project/british-council/british-council'
$outJson = Join-Path $repo 'design-screenshots\british-council\media-id-map.json'

$assets = @(
  @{ Key = 'logo'; Url = 'https://www.britishcouncil.org/profiles/solas2/themes/solas_ui/images/desktop/britishcouncil_indigo_logo.jpg'; Alt = 'British Council' }
  @{ Key = 'hero'; Url = 'https://www.britishcouncil.org/sites/default/files/medium_resolution-getty_1222312516-hpc.jpg'; Alt = 'Two young women smiling by a red phone booth in London' }
  @{ Key = 'learn-online'; Url = 'https://www.britishcouncil.org/sites/default/files/learn-english-online.jpg'; Alt = 'A person studying online with the British Council' }
  @{ Key = 'featured-podcast'; Url = 'https://www.britishcouncil.org/sites/default/files/s3_e10_-_landscape_episode_tile_no_logo.png'; Alt = 'Headshots of podcast guests' }
  @{ Key = 'teaser-graduate'; Url = 'https://www.britishcouncil.org/sites/default/files/website-studyuk_02839_1.jpg'; Alt = 'Female university graduate scanning information on her phone' }
  @{ Key = 'teaser-schools'; Url = 'https://www.britishcouncil.org/sites/default/files/for_schools.jpg'; Alt = 'Young learners in a classroom' }
  @{ Key = 'teaser-tv'; Url = 'https://www.britishcouncil.org/sites/default/files/istock_south_agency_tv_watching.jpg'; Alt = 'Group of people sitting together on a sofa watching TV' }
  @{ Key = 'teaser-selfie'; Url = 'https://www.britishcouncil.org/sites/default/files/accents_istock-656972500.jpg'; Alt = 'Group of young people taking a selfie near Big Ben' }
  @{ Key = 'teaser-panel'; Url = 'https://www.britishcouncil.org/sites/default/files/cropped-youth-connect_study-trip_189.jpg'; Alt = 'Four people speaking on a panel at a conference' }
  @{ Key = 'teaser-london'; Url = 'https://www.britishcouncil.org/sites/default/files/website-getty_658184982.jpg'; Alt = 'Group of youngsters touring London near Big Ben' }
  @{ Key = 'teaser-performance'; Url = 'https://www.britishcouncil.org/sites/default/files/ctc_solas_destination_earth_cellule_studio_840_x_472.jpg'; Alt = 'Silhouette of a woman performing against a colourful projection' }
  @{ Key = 'teaser-report'; Url = 'https://www.britishcouncil.org/sites/default/files/890a7986.jpg'; Alt = 'Research report visual' }
  @{ Key = 'promo-training'; Url = 'https://www.britishcouncil.org/sites/default/files/training_courses_0.jpeg'; Alt = 'Corporate English training' }
  @{ Key = 'promo-englishscore'; Url = 'https://www.britishcouncil.org/sites/default/files/englishscore_hero_and_promo.png'; Alt = 'EnglishScore app' }
  @{ Key = 'promo-teachers'; Url = 'https://www.britishcouncil.org/sites/default/files/20_korea_2012_823.jpg'; Alt = 'Teachers and learners' }
  @{ Key = 'promo-learners'; Url = 'https://www.britishcouncil.org/sites/default/files/spain_02197.jpg'; Alt = 'Discover online resources' }
  @{ Key = 'cwgg'; Url = 'https://www.britishcouncil.org/sites/default/files/homepage_cwgg_0.jpg'; Alt = 'Commonwealth Games education resource launch' }
)

Write-Host "Creating $($assets.Count) media items..."
$raw = & $mediaScript `
  -MediaRoot $mediaRoot `
  -SiteMediaPath $siteMediaPath `
  -SiteRootItemId $siteRootId `
  -Assets ($assets | ForEach-Object { @{ Url = $_.Url; Alt = $_.Alt } }) `
  -BaseUrl 'https://www.britishcouncil.org' 2>&1 | Out-String

# Extract JSON array from mixed host output
$jsonMatch = [regex]::Match($raw, '(\[\s*\{[\s\S]*\}\s*\])\s*$')
if (-not $jsonMatch.Success) {
  # single object or pretty JSON
  $jsonMatch = [regex]::Match($raw, '(\{[\s\S]*"MediaId"[\s\S]*\})\s*$')
}
if (-not $jsonMatch.Success) { throw "Could not parse media script JSON. Output tail:`n$($raw.Substring([Math]::Max(0,$raw.Length-1500)))" }

$results = $jsonMatch.Groups[1].Value | ConvertFrom-Json
if ($results -isnot [System.Array]) { $results = @($results) }

$map = [ordered]@{}
for ($i = 0; $i -lt $assets.Count; $i++) {
  $map[$assets[$i].Key] = @{
    mediaId = $results[$i].MediaId
    url = $assets[$i].Url
    path = $results[$i].Path
  }
  Write-Host ("OK {0} => {1}" -f $assets[$i].Key, $results[$i].MediaId)
}
$map | ConvertTo-Json -Depth 4 | Set-Content $outJson -Encoding utf8
Write-Host "Wrote $outJson"
