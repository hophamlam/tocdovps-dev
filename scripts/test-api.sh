#!/bin/bash

# Script test API endpoints trên Vercel Preview hoặc local
# Usage:
#   ./scripts/test-api.sh                                    # Test local
#   ./scripts/test-api.sh https://preview-url.vercel.app     # Test preview
#   ./scripts/test-api.sh https://staging.tocdovps.dev       # Test staging (sẽ tự động dùng bypass token nếu có)

set -e

# Màu sắc cho output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Lấy URL từ argument hoặc dùng localhost
BASE_URL=${1:-"http://localhost:3000"}

# Lấy bypass token từ argument, env variable, hoặc .env.local
BYPASS_TOKEN=${2:-${VERCEL_BYPASS_TOKEN:-""}}

# Load từ .env.local nếu có và chưa có token
if [ -z "$BYPASS_TOKEN" ] && [ -f .env.local ]; then
  # Extract VERCEL_BYPASS_TOKEN từ .env.local (handle cả quoted và unquoted)
  BYPASS_TOKEN=$(grep "^VERCEL_BYPASS_TOKEN=" .env.local 2>/dev/null | sed 's/^VERCEL_BYPASS_TOKEN=//' | sed 's/^"//' | sed 's/"$//' | sed "s/^'//" | sed "s/'$//" | tr -d ' ' || echo "")
fi

# Function để build URL với bypass token nếu cần
build_url() {
  local endpoint=$1
  local url="${BASE_URL}${endpoint}"
  
  # Nếu có bypass token và URL là staging/preview (không phải localhost)
  if [ -n "$BYPASS_TOKEN" ] && [[ "$BASE_URL" != "http://localhost"* ]]; then
    # Check nếu URL đã có query string
    if [[ "$url" == *"?"* ]]; then
      url="${url}&x-vercel-set-bypass-cookie=true&x-vercel-protection-bypass=${BYPASS_TOKEN}"
    else
      url="${url}?x-vercel-set-bypass-cookie=true&x-vercel-protection-bypass=${BYPASS_TOKEN}"
    fi
  fi
  
  echo "$url"
}

# Function để set bypass cookie trước (nếu cần)
set_bypass_cookie() {
  if [ -n "$BYPASS_TOKEN" ] && [[ "$BASE_URL" != "http://localhost"* ]]; then
    # Set cookie bằng cách gọi URL với bypass params
    curl -s -c /tmp/vercel_bypass_cookie.txt "${BASE_URL}?x-vercel-set-bypass-cookie=true&x-vercel-protection-bypass=${BYPASS_TOKEN}" > /dev/null 2>&1
  fi
}

echo -e "${BLUE}🧪 Testing API: ${BASE_URL}${NC}"
if [ -n "$BYPASS_TOKEN" ] && [[ "$BASE_URL" != "http://localhost"* ]]; then
  echo -e "${YELLOW}   Using Vercel bypass token${NC}"
  # Set bypass cookie trước
  set_bypass_cookie
fi
echo ""

# Counter cho test results
PASSED=0
FAILED=0

# Function để test endpoint
test_endpoint() {
  local method=$1
  local endpoint=$2
  local data=$3
  local expected_status=${4:-200}
  local description=$5

  echo -e "${YELLOW}Testing: ${method} ${endpoint}${NC}"
  if [ -n "$description" ]; then
    echo -e "  ${description}"
  fi

  local url=$(build_url "$endpoint")
  
  # Build curl command với cookie nếu có
  local cookie_args=""
  if [ -n "$BYPASS_TOKEN" ] && [[ "$BASE_URL" != "http://localhost"* ]] && [ -f /tmp/vercel_bypass_cookie.txt ]; then
    cookie_args="-b /tmp/vercel_bypass_cookie.txt"
  fi

  if [ "$method" = "POST" ]; then
    response=$(curl -s -L -w "\n%{http_code}" $cookie_args -X POST "$url" \
      -H "Content-Type: application/json" \
      -d "$data")
  else
    response=$(curl -s -L -w "\n%{http_code}" $cookie_args -X GET "$url")
  fi

  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')

  if [ "$http_code" -eq "$expected_status" ]; then
    echo -e "${GREEN}  ✅ PASSED (Status: ${http_code})${NC}"
    echo -e "  Response: ${body:0:200}..."
    ((PASSED++))
    return 0
  else
    echo -e "${RED}  ❌ FAILED (Expected: ${expected_status}, Got: ${http_code})${NC}"
    echo -e "  Response: ${body}"
    ((FAILED++))
    return 1
  fi
  echo ""
}

# Test 1: POST /api/benchmark/report - Valid payload
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Test 1: POST /api/benchmark/report (Valid)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

VALID_PAYLOAD='{
  "serverLabel": "test-server-api",
  "avgPingMs": 15.5,
  "downloadMbps": 150.25,
  "score": 8.5,
  "cpuModelText": "Intel Xeon E5-2680",
  "coreAmount": 8,
  "frequencyGhz": 2.4,
  "ramGb": 16,
  "ramAvailableGb": 14,
  "ramInfo": "16GB DDR4",
  "swapInfo": "2GB",
  "diskGb": 500,
  "diskInfo": "SSD 500GB",
  "loadAverage": "0.5 0.3 0.2",
  "uptimeSeconds": 86400,
  "osNameText": "Ubuntu 22.04",
  "virtualizationText": "KVM",
  "providerText": "DigitalOcean",
  "payload": {
    "pingTargets": ["8.8.8.8", "1.1.1.1"],
    "avgPingMs": 15.5,
    "download": {
      "url": "https://example.com/test-file",
      "timeSeconds": 10,
      "speedMbps": 150.25
    }
  }
}'

test_endpoint "POST" "/api/benchmark/report" "$VALID_PAYLOAD" 201 "Valid benchmark report"

# Test 2: POST /api/benchmark/report - Invalid JSON
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Test 2: POST /api/benchmark/report (Invalid JSON)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo -e "${YELLOW}Testing: POST /api/benchmark/report${NC}"
echo -e "  Invalid JSON payload"
url=$(build_url "/api/benchmark/report")
cookie_args=""
if [ -n "$BYPASS_TOKEN" ] && [[ "$BASE_URL" != "http://localhost"* ]] && [ -f /tmp/vercel_bypass_cookie.txt ]; then
  cookie_args="-b /tmp/vercel_bypass_cookie.txt"
fi
response=$(curl -s -L -w "\n%{http_code}" $cookie_args -X POST "$url" \
  -H "Content-Type: application/json" \
  -d '{"invalid": json}')
http_code=$(echo "$response" | tail -n1)
if [ "$http_code" -eq 400 ]; then
  echo -e "${GREEN}  ✅ PASSED (Status: ${http_code})${NC}"
  ((PASSED++))
else
  echo -e "${RED}  ❌ FAILED (Expected: 400, Got: ${http_code})${NC}"
  ((FAILED++))
fi

# Test 3: POST /api/benchmark/report - Missing required fields
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Test 3: POST /api/benchmark/report (Missing payload)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

INVALID_PAYLOAD='{
  "serverLabel": "test",
  "avgPingMs": 10
}'

test_endpoint "POST" "/api/benchmark/report" "$INVALID_PAYLOAD" 400 "Missing required payload field"

# Test 4: POST /api/benchmark/report - Invalid score range
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Test 4: POST /api/benchmark/report (Invalid score)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

INVALID_SCORE_PAYLOAD='{
  "score": 15,
  "payload": {
    "pingTargets": ["8.8.8.8"],
    "avgPingMs": 10,
    "download": {
      "url": "https://example.com/test",
      "timeSeconds": 5,
      "speedMbps": 100
    }
  }
}'

test_endpoint "POST" "/api/benchmark/report" "$INVALID_SCORE_PAYLOAD" 400 "Score out of range (0-10)"

# Test 5: POST /api/benchmark/report - With visibility header
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Test 5: POST /api/benchmark/report (Private visibility)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo -e "${YELLOW}Testing: POST /api/benchmark/report with X-Visibility: private${NC}"
url=$(build_url "/api/benchmark/report")
cookie_args=""
if [ -n "$BYPASS_TOKEN" ] && [[ "$BASE_URL" != "http://localhost"* ]] && [ -f /tmp/vercel_bypass_cookie.txt ]; then
  cookie_args="-b /tmp/vercel_bypass_cookie.txt"
fi
response=$(curl -s -L -w "\n%{http_code}" $cookie_args -X POST "$url" \
  -H "Content-Type: application/json" \
  -H "X-Visibility: private" \
  -d "$VALID_PAYLOAD")
http_code=$(echo "$response" | tail -n1)
if [ "$http_code" -eq 201 ]; then
  echo -e "${GREEN}  ✅ PASSED (Status: ${http_code})${NC}"
  ((PASSED++))
else
  echo -e "${RED}  ❌ FAILED (Expected: 201, Got: ${http_code})${NC}"
  ((FAILED++))
fi

# Summary
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📊 Test Summary${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Passed: ${PASSED}${NC}"
echo -e "${RED}❌ Failed: ${FAILED}${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}🎉 All tests passed!${NC}\n"
  exit 0
else
  echo -e "${RED}⚠️  Some tests failed. Please review the output above.${NC}\n"
  exit 1
fi



