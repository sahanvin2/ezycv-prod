# ============================================================================
#  WALLPAPER PROCESSING PIPELINE — PowerShell + FFmpeg Alternative
# ============================================================================
#
#  Processes local wallpaper images into optimized versions using FFmpeg.
#  This script only processes images locally (no B2 upload or MongoDB).
#  Use seedFromOutput.js after this to upload to B2 and seed MongoDB.
#
#  REQUIRES: ffmpeg installed and in PATH
#
#  USAGE:
#    .\scripts\processWallpapers.ps1 -SrcRoot "D:\EzyCV_ASSETS\wallpapers\desktop" -OutRoot "D:\EzyCV_OUTPUT\wallpapers\desktop" -Device "desktop"
#    .\scripts\processWallpapers.ps1 -SrcRoot "D:\EzyCV_ASSETS\wallpapers\mobile" -OutRoot "D:\EzyCV_OUTPUT\wallpapers\mobile" -Device "mobile"
#    .\scripts\processWallpapers.ps1 -SrcRoot "D:\EzyCV_ASSETS\wallpapers\desktop\nature" -OutRoot "D:\EzyCV_OUTPUT\wallpapers\desktop\nature" -Device "desktop" -SingleCategory
#
# ============================================================================

param(
    [Parameter(Mandatory=$true)]
    [string]$SrcRoot,

    [Parameter(Mandatory=$true)]
    [string]$OutRoot,

    [Parameter(Mandatory=$true)]
    [ValidateSet("desktop","mobile")]
    [string]$Device,

    [switch]$SingleCategory
)

# Preview width per device type
$previewWidth = if ($Device -eq "desktop") { 1280 } else { 540 }

# Verify ffmpeg is available
try {
    $null = & ffmpeg -version 2>&1
} catch {
    Write-Error "FFmpeg not found. Install it and add to PATH."
    exit 1
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  WALLPAPER PROCESSING PIPELINE (PowerShell + FFmpeg)"       -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Source:  $SrcRoot"
Write-Host "  Output:  $OutRoot"
Write-Host "  Device:  $Device"
Write-Host "  Preview: ${previewWidth}px wide WebP"
Write-Host "  Download: Original size JPG (quality 90)"
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Discover categories or use single folder
if ($SingleCategory) {
    $categories = @(@{ Name = (Split-Path $SrcRoot -Leaf); Path = $SrcRoot })
} else {
    $categories = Get-ChildItem -Path $SrcRoot -Directory | ForEach-Object {
        @{ Name = $_.Name; Path = $_.FullName }
    }
}

if ($categories.Count -eq 0) {
    Write-Error "No category folders found in $SrcRoot"
    exit 1
}

Write-Host "Found $($categories.Count) category folder(s): $($categories | ForEach-Object { $_.Name } | Join-String -Separator ', ')" -ForegroundColor Green
Write-Host ""

$totalProcessed = 0
$totalFailed    = 0

foreach ($cat in $categories) {
    $catName = $cat.Name
    $catPath = $cat.Path

    # Find all images
    $images = Get-ChildItem -Path $catPath -File | Where-Object {
        $_.Extension -match "\.(png|jpg|jpeg|webp|tiff)$"
    } | Sort-Object Name

    if ($images.Count -eq 0) {
        Write-Host "  [$catName] No images found, skipping." -ForegroundColor Yellow
        continue
    }

    Write-Host "  [$catName] Processing $($images.Count) images..." -ForegroundColor Cyan

    # Create output directories
    $previewDir  = Join-Path $OutRoot "$catName\preview"
    $downloadDir = Join-Path $OutRoot "$catName\5k"
    New-Item -ItemType Directory -Force -Path $previewDir  | Out-Null
    New-Item -ItemType Directory -Force -Path $downloadDir | Out-Null

    $catProcessed = 0
    $catFailed    = 0

    foreach ($img in $images) {
        $base = $img.BaseName
        $idx  = $catProcessed + 1

        try {
            # 1) Preview WebP
            $previewOut = Join-Path $previewDir "$base.webp"
            & ffmpeg -hide_banner -loglevel error -y -i $img.FullName `
                -vf "scale=${previewWidth}:-2:flags=lanczos" `
                -c:v libwebp -preset photo -quality 75 `
                $previewOut 2>&1 | Out-Null

            # 2) Optimized 5K JPG (strip metadata)
            $downloadOut = Join-Path $downloadDir "$base.jpg"
            & ffmpeg -hide_banner -loglevel error -y -i $img.FullName `
                -q:v 3 -map_metadata -1 `
                $downloadOut 2>&1 | Out-Null

            # Get sizes for logging
            $prevSize = if (Test-Path $previewOut)  { (Get-Item $previewOut).Length  } else { 0 }
            $dlSize   = if (Test-Path $downloadOut) { (Get-Item $downloadOut).Length } else { 0 }
            $origSize = $img.Length

            $prevKB = [math]::Round($prevSize / 1KB, 0)
            $dlMB   = [math]::Round($dlSize / 1MB, 1)
            $origMB = [math]::Round($origSize / 1MB, 1)

            Write-Host "    [$idx/$($images.Count)] $($img.Name) -> preview: ${prevKB}KB | 5K: ${dlMB}MB (was ${origMB}MB)" -ForegroundColor Gray

            $catProcessed++
        }
        catch {
            Write-Host "    [$idx/$($images.Count)] FAILED: $($img.Name) - $($_.Exception.Message)" -ForegroundColor Red
            $catFailed++
        }
    }

    Write-Host "  [$catName] Done: $catProcessed processed, $catFailed failed" -ForegroundColor Green
    Write-Host ""

    $totalProcessed += $catProcessed
    $totalFailed    += $catFailed
}

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  COMPLETE" -ForegroundColor Green
Write-Host "  Processed: $totalProcessed" -ForegroundColor Green
Write-Host "  Failed:    $totalFailed" -ForegroundColor $(if ($totalFailed -gt 0) { "Red" } else { "Green" })
Write-Host ""
Write-Host "  Next step: Upload to B2 and seed MongoDB using:" -ForegroundColor Yellow
Write-Host "    node scripts/seedFromOutput.js --source `"$OutRoot`" --device $Device" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan
