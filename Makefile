# Makefile
.PHONY: start-aut stop-aut test-playwright test-k6 test-all

start-aut:
	docker compose up -d
	@echo "Waiting for the AUT to be available..."
	@until curl -s http://localhost:3000 > /dev/null; do sleep 2; done
	@echo "AUT available at http://localhost:3000"

stop-aut:
	docker compose down

test-playwright:
	cd tests/playwright && npx playwright test

test-k6:
	cd tests/k6 && k6 run scripts/load-test.js

test-all:
	test-playwright
	test-k6