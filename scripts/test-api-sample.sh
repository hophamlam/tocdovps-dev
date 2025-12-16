#!/usr/bin/env bash

##
## Script test API với data sample (không cần chạy benchmark thật)
## Dùng để verify API hoạt động đúng trước khi test với script thật
##
## Usage:
##   bash scripts/test-api-sample.sh
##   REPORT_URL="https://staging.tocdovps.dev/api/benchmark/report" bash scripts/test-api-sample.sh
##

set -euo pipefail

# URL mặc định
DEFAULT_REPORT_URL="https://www.tocdovps.dev/api/benchmark/report"
REPORT_URL="${REPORT_URL:-$DEFAULT_REPORT_URL}"

# Sample data (giống format từ vps-benchmark.sh)
SAMPLE_JSON=$(cat <<'EOF'
{
  "serverLabel": null,
  "cpuModelText": "Intel(R) Xeon(R) Gold 6138 CPU @ 2.00GHz",
  "coreAmount": 1,
  "frequencyGhz": 2.00,
  "ramGb": 1.90,
  "ramAvailableGb": 1.56,
  "ramInfo": "1.90 GB (Available: 1.56 GB)",
  "swapInfo": "0.00 GB (Used: 0.00 GB)",
  "diskGb": 18.33,
  "diskInfo": "18.33 GB (Used: 2.83 GB, Available: 15.49 GB)",
  "loadAverage": "0.16, 0.05, 0.11",
  "uptimeSeconds": 271974,
  "osNameText": "Ubuntu",
  "virtualizationText": "KVM",
  "providerText": "VIET DIGITAL TECHNOLOGY LIABILITY COMPANY",
  "diskIo": {
    "writeSpeedMbps": 6480.16,
    "writeSpeedMBs": 810.02,
    "readSpeedMbps": 20347.76,
    "readSpeedMBs": 2543.47,
    "timeSeconds": 0,
    "bytesWritten": 1073741824
  },
  "fio": {
    "4k": {
      "total": 774,
      "read": 438,
      "write": 337,
      "iops": 198200,
      "iopsRead": 112000,
      "iopsWrite": 86200
    },
    "64k": {
      "total": 8061,
      "read": 4660,
      "write": 3401,
      "iops": 129000,
      "iopsRead": 74600,
      "iopsWrite": 54400
    },
    "512k": {
      "total": 21362,
      "read": 12707,
      "write": 8655,
      "iops": 42700,
      "iopsRead": 25400,
      "iopsWrite": 17300
    },
    "1M": {
      "total": 24251,
      "read": 15138,
      "write": 9113,
      "iops": 24300,
      "iopsRead": 15100,
      "iopsWrite": 9100
    }
  },
  "netSpeed": [
    {
      "server": "VN HN VNPT",
      "ping": 26.59,
      "download": 201.71,
      "upload": 207.73
    },
    {
      "server": "VN HN FPT",
      "ping": 21.40,
      "download": 200.36,
      "upload": 209.44
    }
  ],
  "payload": {
    "systemInfo": {
      "cpuModel": "Intel(R) Xeon(R) Gold 6138 CPU @ 2.00GHz",
      "cores": 1,
      "frequencyGHz": 2.00,
      "ramGB": 1.90,
      "ramAvailableGB": 1.56,
      "swapGB": 0.00,
      "swapUsedGB": 0.00,
      "diskTotalGB": 18.33,
      "diskUsedGB": 2.83,
      "diskAvailableGB": 15.49,
      "loadAverage": {
        "1min": 0.16,
        "5min": 0.05,
        "15min": 0.11
      },
      "uptimeSeconds": 271974,
      "os": {
        "name": "Ubuntu",
        "version": "24.04.1 LTS (Noble Numbat)"
      },
      "virtualization": "KVM",
      "provider": "VIET DIGITAL TECHNOLOGY LIABILITY COMPANY",
      "location": {
        "city": "Ho Chi Minh City",
        "region": "Ho Chi Minh City (HCMC)",
        "country": "VN",
        "loc": "10.8231,106.6297",
        "publicIp": "160.250.134.228"
      }
    },
    "diskIo": {
      "writeSpeedMbps": 6480.16,
      "writeSpeedMBs": 810.02,
      "readSpeedMbps": 20347.76,
      "readSpeedMBs": 2543.47,
      "timeSeconds": 0,
      "bytesWritten": 1073741824
    },
    "fio": {
      "4k": {
        "total": 774,
        "read": 438,
        "write": 337,
        "iops": 198200,
        "iopsRead": 112000,
        "iopsWrite": 86200
      },
      "64k": {
        "total": 8061,
        "read": 4660,
        "write": 3401,
        "iops": 129000,
        "iopsRead": 74600,
        "iopsWrite": 54400
      },
      "512k": {
        "total": 21362,
        "read": 12707,
        "write": 8655,
        "iops": 42700,
        "iopsRead": 25400,
        "iopsWrite": 17300
      },
      "1M": {
        "total": 24251,
        "read": 15138,
        "write": 9113,
        "iops": 24300,
        "iopsRead": 15100,
        "iopsWrite": 9100
      }
    },
    "netSpeed": [
      {
        "server": "VN HN VNPT",
        "ping": 26.59,
        "download": 201.71,
        "upload": 207.73
      },
      {
        "server": "VN HN FPT",
        "ping": 21.40,
        "download": 200.36,
        "upload": 209.44
      }
    ]
  },
  "systemInfo": {
    "cpuModel": "Intel(R) Xeon(R) Gold 6138 CPU @ 2.00GHz",
    "cores": 1,
    "frequencyGHz": 2.00,
    "ramGB": 1.90,
    "ramAvailableGB": 1.56,
    "swapGB": 0.00,
    "swapUsedGB": 0.00,
    "diskTotalGB": 18.33,
    "diskUsedGB": 2.83,
    "diskAvailableGB": 15.49,
    "loadAverage": {
      "1min": 0.16,
      "5min": 0.05,
      "15min": 0.11
    },
    "uptimeSeconds": 271974,
    "os": {
      "name": "Ubuntu",
      "version": "24.04.1 LTS (Noble Numbat)"
    },
    "virtualization": "KVM",
    "provider": "VIET DIGITAL TECHNOLOGY LIABILITY COMPANY",
    "location": {
      "city": "Ho Chi Minh City",
      "region": "Ho Chi Minh City (HCMC)",
      "country": "VN",
      "loc": "10.8231,106.6297",
      "publicIp": "160.250.134.228"
    }
  }
}
EOF
)

echo "[i] Testing API with sample data..."
echo "[i] Report URL: $REPORT_URL"
echo

# Gửi request với bypass header nếu có VERCEL_BYPASS
if [[ -n "${VERCEL_BYPASS:-}" ]]; then
  echo "[i] Using VERCEL_BYPASS for deployment protection"
  response=$(curl -s -w "\n%{http_code}" -X POST "$REPORT_URL" \
    -H "Content-Type: application/json" \
    -H "X-VISIBILITY: private" \
    -H "x-vercel-protection-bypass:${VERCEL_BYPASS}" \
    -d "$SAMPLE_JSON" 2>&1)
else
  response=$(curl -s -w "\n%{http_code}" -X POST "$REPORT_URL" \
    -H "Content-Type: application/json" \
    -H "X-VISIBILITY: private" \
    -d "$SAMPLE_JSON" 2>&1)
fi

# Tách HTTP code từ response
http_code=$(echo "$response" | tail -n1)
response_body=$(echo "$response" | sed '$d')

echo "[i] HTTP Status: $http_code"
echo

if [[ "$http_code" -ge 200 ]] && [[ "$http_code" -lt 300 ]]; then
  echo "[✓] API test successful!"
  echo "[i] Response:"
  echo "$response_body" | jq '.' 2>/dev/null || echo "$response_body"
  
  # Parse result ID nếu có
  result_id=$(echo "$response_body" | grep -o '"id":"[^"]*"' | cut -d'"' -f4 || echo "")
  if [[ -n "$result_id" ]]; then
    result_url="${REPORT_URL%/api/benchmark/report}/result/$result_id"
    echo
    echo "[✓] View result: $result_url"
  fi
else
  echo "[!] API test failed!"
  echo "[i] Response:"
  echo "$response_body" | jq '.' 2>/dev/null || echo "$response_body"
  exit 1
fi

