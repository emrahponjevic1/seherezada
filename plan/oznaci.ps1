<#
  oznaci.ps1 — označava kućice u ZAVRSNI-PLAN.html

  Kućice koje klikneš mišem pamti preglednik. Agent nema preglednik,
  pa svoj napredak upisuje ovom naredbom direktno u dokument.

  Upotreba:
    powershell -File plan/oznaci.ps1 k7c1 k7c2 k7c3   označi kućice
    powershell -File plan/oznaci.ps1 -Odznaci k7c3    skini oznaku
    powershell -File plan/oznaci.ps1 -Stanje          ispiši napredak

  Oznaka "tvoje oko" u dokumentu znači da tu kućicu potvrđuje čovjek —
  agent je ne smije označiti sam.
#>
[CmdletBinding()]
param(
  [Parameter(ValueFromRemainingArguments = $true)]
  [string[]]$Id,
  [switch]$Odznaci,
  [switch]$Stanje
)

$ErrorActionPreference = 'Stop'

$plan = Join-Path $PSScriptRoot 'ZAVRSNI-PLAN.html'
if (-not (Test-Path $plan)) { throw "Ne nalazim dokument: $plan" }

$html = [System.IO.File]::ReadAllText($plan)
$uzorak = '<input type="checkbox" id="([A-Za-z0-9]+)"( checked)?>'

function Ispisi-Stanje([string]$tekst) {
  $svi = [regex]::Matches($tekst, $uzorak)
  $grupe = [ordered]@{}
  foreach ($m in $svi) {
    $kljuc = $m.Groups[1].Value
    if ($kljuc -match '^(k\d+)c\d+$') { $g = $Matches[1] } else { $g = 'zavrsna' }
    if (-not $grupe.Contains($g)) { $grupe[$g] = @{ ukupno = 0; gotovo = 0 } }
    $grupe[$g].ukupno++
    if ($m.Groups[2].Success) { $grupe[$g].gotovo++ }
  }
  $ukupno = 0; $gotovo = 0
  foreach ($g in $grupe.Keys) {
    $u = $grupe[$g].ukupno; $d = $grupe[$g].gotovo
    $ukupno += $u; $gotovo += $d
    $puno = [math]::Round($d / $u * 10)
    $traka = ('#' * $puno) + ('.' * (10 - $puno))
    $ime = $g
    if ($g -match '^k(\d+)$') { $ime = 'korak ' + $Matches[1].PadLeft(2, '0') }
    if ($d -eq $u) { $boja = 'Green' } elseif ($d -gt 0) { $boja = 'Yellow' } else { $boja = 'DarkGray' }
    Write-Host ("  {0,-10} {1}  {2,3} / {3}" -f $ime, $traka, $d, $u) -ForegroundColor $boja
  }
  Write-Host ""
  Write-Host ("  UKUPNO     {0} / {1}" -f $gotovo, $ukupno) -ForegroundColor Cyan
}

if ($Stanje -or -not $Id -or $Id.Count -eq 0) {
  Write-Host ""
  Write-Host "  Napredak — plan/ZAVRSNI-PLAN.html" -ForegroundColor White
  Write-Host ""
  Ispisi-Stanje $html
  Write-Host ""
  if (-not $Stanje) {
    Write-Host "  Za označavanje:  powershell -File plan/oznaci.ps1 k1c1 k1c2" -ForegroundColor DarkGray
    Write-Host ""
  }
  return
}

$oznaceno = 0; $vecTako = 0; $nepoznato = @()

foreach ($x in $Id) {
  $kljuc = $x.Trim()
  if ($kljuc -eq '') { continue }
  $esc = [regex]::Escape($kljuc)
  $trazi = '<input type="checkbox" id="' + $esc + '"( checked)?>'
  $m = [regex]::Match($html, $trazi)

  if (-not $m.Success) { $nepoznato += $kljuc; continue }

  $imaOznaku = $m.Groups[1].Success
  if ($Odznaci) {
    if (-not $imaOznaku) { $vecTako++; continue }
    $novi = '<input type="checkbox" id="' + $kljuc + '">'
  }
  else {
    if ($imaOznaku) { $vecTako++; continue }
    $novi = '<input type="checkbox" id="' + $kljuc + '" checked>'
  }

  $html = $html.Remove($m.Index, $m.Length).Insert($m.Index, $novi)
  $oznaceno++
}

if ($oznaceno -gt 0) {
  $enc = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($plan, $html, $enc)
}

Write-Host ""
if ($Odznaci) { $glagol = 'skinuto' } else { $glagol = 'označeno' }
Write-Host ("  {0}: {1}" -f $glagol, $oznaceno) -ForegroundColor Green
if ($vecTako -gt 0) { Write-Host ("  već tako: {0}" -f $vecTako) -ForegroundColor DarkGray }
if ($nepoznato.Count -gt 0) {
  Write-Host ("  NE POSTOJI: {0}" -f ($nepoznato -join ', ')) -ForegroundColor Red
  Write-Host "  Oznake su oblika k7c3 (korak 7, treća provjera) ili zz5 (završna lista)." -ForegroundColor DarkGray
}
Write-Host ""
Ispisi-Stanje $html
Write-Host ""
