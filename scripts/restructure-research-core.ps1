$root = Join-Path $PSScriptRoot "..\content\research-core"
Set-Location $root

$pillars = @(
  "01-security-engineering",
  "02-platform-cloud",
  "03-operations-reliability",
  "04-collaboration-governance"
)

foreach ($p in $pillars) {
  New-Item -ItemType Directory -Force -Path $p | Out-Null
}

$moves = @{
  "DevSecOps" = "01-security-engineering/devsecops"
  "Security" = "01-security-engineering/security"
  "Kubernetes-Security" = "01-security-engineering/kubernetes-security"
  "Zero-Trust-Architecture" = "01-security-engineering/zero-trust-architecture"
  "Supply-Chain-Security" = "01-security-engineering/supply-chain-security"
  "Incident-Response" = "01-security-engineering/incident-response"
  "Cloud-Security-Posture" = "01-security-engineering/cloud-security-posture"
  "CyberSecurity" = "01-security-engineering/cybersecurity"
  "Cloud-Platform" = "02-platform-cloud/cloud-platform"
  "Infranstracture-as-a-Code" = "02-platform-cloud/infrastructure-as-code"
  "Containerization-and-Orchestration" = "02-platform-cloud/containerization-and-orchestration"
  "CI-CD-Pipelines" = "02-platform-cloud/ci-cd-pipelines"
  "Scripting" = "02-platform-cloud/scripting"
  "Logging-and-Monitoring" = "03-operations-reliability/logging-and-monitoring"
  "SRE-Reliability" = "03-operations-reliability/sre-reliability"
  "linux" = "03-operations-reliability/linux"
  "Networking" = "03-operations-reliability/networking"
  "Database" = "03-operations-reliability/database"
  "Communication" = "04-collaboration-governance/communication"
}

foreach ($entry in $moves.GetEnumerator()) {
  $src = Join-Path $root $entry.Key
  $dest = Join-Path $root $entry.Value
  if (Test-Path $src) {
    New-Item -ItemType Directory -Force -Path (Split-Path $dest -Parent) | Out-Null
    Move-Item -Path $src -Destination $dest -Force
    Write-Host "Moved $($entry.Key) -> $($entry.Value)"
  }
}

Write-Host "Done."
