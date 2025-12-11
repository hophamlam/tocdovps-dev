#!/bin/bash

# Script test rate limiting trên staging/production
# Usage:
#   ./scripts/test-rate-limit.sh https://staging.tocdovps.dev
#   ./scripts/test-rate-limit.sh https://staging.tocdovps.dev 15  # Test 15 requests

set -e

# Màu sắc
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Lấy URL và số requests từ arguments
BASE_URL=${1:-"https://staging.tocdovps.dev"}
NUM_REQUESTS=${2:-15}

# Lấy bypass token từ .env.local
BYPASS_TOKEN=""
if [ -f .env.local ]; then
  BYPASS_TOKEN=$(grep "^VERCEL_BYPASS_TOKEN=" .env.local 2>/dev/null | sed 's/^VERCEL_BYPASS_TOKEN=//' | sed 's/^"//' | sed 's/"$//' | sed "s/^'//" | sed "s/'$//" | tr -d ' ' || echo "")
fi

# Nếu không có token, thử từ env variable
if [ -z "$BYPASS_TOKEN" ]; then
  BYPASS_TOKEN=${VERCEL_BYPASS_TOKEN:-""}
fi

echo -e "${BLUE}🧪 Testing Rate Limiting: ${BASE_URL}${NC}"
echo -e "${BLUE}   Sending ${NUM_REQUESTS} requests...${NC}"
echo ""

# Set bypass cookie trước (nếu có token và không phải localhost)
if [ -n "$BYPASS_TOKEN" ] && [[ "$BASE_URL" != "http://localhost"* ]]; then
  echo -e "${YELLOW}Setting bypass cookie...${NC}"
  curl -s -c /tmp/vercel_bypass_cookie.txt -L "${BASE_URL}?x-vercel-set-bypass-cookie=true&x-vercel-protection-bypass=${BYPASS_TOKEN}" > /dev/null 2>&1
  echo -e "${GREEN}✅ Cookie set${NC}"
  echo ""
fi

# Counter
SUCCESS=0
RATE_LIMITED=0
ERROR=0

# Test payload
PAYLOAD='{"payload":{"pingTargets":["8.8.8.8"],"avgPingMs":10,"download":{"url":"https://example.com","timeSeconds":5,"speedMbps":100}}}'

# Build cookie args
COOKIE_ARGS=""
if [ -n "$BYPASS_TOKEN" ] && [[ "$BASE_URL" != "http://localhost"* ]] && [ -f /tmp/vercel_bypass_cookie.txt ]; then
  COOKIE_ARGS="-b /tmp/vercel_bypass_cookie.txt"
fi

# Gửi requests
for i in $(seq 1 $NUM_REQUESTS); do
  echo -n "Request $i: "
  
  # Gửi request và lấy cả response body và headers
  response=$(curl -s -L -i -w "\n%{http_code}" $COOKIE_ARGS -X POST "${BASE_URL}/api/benchmark/report" \
    -H "Content-Type: application/json" \
    -d "$PAYLOAD" 2>&1)
  
  http_code=$(echo "$response" | tail -n1)
  
  # Extract rate limit headers (từ phần headers)
  rate_limit_remaining=$(echo "$response" | grep -i "^x-ratelimit-remaining:" | cut -d' ' -f2 | tr -d '\r' || echo "")
  rate_limit_limit=$(echo "$response" | grep -i "^x-ratelimit-limit:" | cut -d' ' -f2 | tr -d '\r' || echo "")
  rate_limit_reset=$(echo "$response" | grep -i "^x-ratelimit-reset:" | cut -d' ' -f2 | tr -d '\r' || echo "")
  
  # Extract body (giữa dòng trống và http_code)
  body=$(echo "$response" | awk '/^$/{flag=1; next} flag && !/^[0-9]+$/{print}' | head -c 200)
  
  if [ "$http_code" -eq 201 ]; then
    echo -e "${GREEN}✅ Success (201)${NC}"
    if [ -n "$rate_limit_remaining" ]; then
      echo "   Remaining: $rate_limit_remaining/$rate_limit_limit"
    fi
    SUCCESS=$((SUCCESS + 1))
  elif [ "$http_code" -eq 429 ]; then
    echo -e "${RED}🚫 Rate Limited (429)${NC}"
    if [ -n "$rate_limit_remaining" ]; then
      echo "   Remaining: $rate_limit_remaining/$rate_limit_limit"
    fi
    if [ -n "$rate_limit_reset" ]; then
      reset_seconds=$((rate_limit_reset - $(date +%s)))
      echo "   Reset in: ${reset_seconds}s"
    fi
    if [ -n "$body" ]; then
      echo "   Response: $body"
    fi
    RATE_LIMITED=$((RATE_LIMITED + 1))
  else
    echo -e "${YELLOW}⚠️  Error (${http_code})${NC}"
    if [ -n "$body" ]; then
      echo "   Response: $body"
    fi
    ERROR=$((ERROR + 1))
  fi
  
  # Sleep giữa các requests
  sleep 0.3
done

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📊 Results:${NC}"
echo -e "  ${GREEN}✅ Success: ${SUCCESS}${NC}"
echo -e "  ${RED}🚫 Rate Limited: ${RATE_LIMITED}${NC}"
echo -e "  ${YELLOW}⚠️  Errors: ${ERROR}${NC}"
echo ""

# Cleanup
if [ -f /tmp/vercel_bypass_cookie.txt ]; then
  rm -f /tmp/vercel_bypass_cookie.txt
fi

# Expected: First 10 should succeed, then rate limited
if [ $SUCCESS -le 10 ] && [ $RATE_LIMITED -gt 0 ]; then
  echo -e "${GREEN}✅ Rate limiting is working correctly!${NC}"
  exit 0
else
  echo -e "${YELLOW}⚠️  Rate limiting may not be working as expected${NC}"
  exit 1
fi

