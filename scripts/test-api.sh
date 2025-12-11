#!/bin/bash

# Script test API endpoints trên Vercel Preview hoặc local
# Usage:
#   ./scripts/test-api.sh                    # Test local
#   ./scripts/test-api.sh https://preview-url.vercel.app  # Test preview

set -e

# Màu sắc cho output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Lấy URL từ argument hoặc dùng localhost
API_URL=${1:-"http://localhost:3000"}

echo -e "${BLUE}🧪 Testing API: ${API_URL}${NC}\n"

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

  if [ "$method" = "POST" ]; then
    response=$(curl -s -w "\n%{http_code}" -X POST "${API_URL}${endpoint}" \
      -H "Content-Type: application/json" \
      -d "$data")
  else
    response=$(curl -s -w "\n%{http_code}" -X GET "${API_URL}${endpoint}")
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
response=$(curl -s -w "\n%{http_code}" -X POST "${API_URL}/api/benchmark/report" \
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
response=$(curl -s -w "\n%{http_code}" -X POST "${API_URL}/api/benchmark/report" \
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



