NODE_MODULES_BIN := ./node_modules/.bin
TS_NODE_BASE := TS_NODE_TRANSPILE_ONLY=true node -r ts-node/register
WEBPACK := $(TS_NODE_BASE) $(NODE_MODULES_BIN)/webpack --progress --mode production --env stat=true
KARMA := $(TS_NODE_BASE) $(NODE_MODULES_BIN)/karma start

.PHONY: start
start:
	$(TS_NODE_BASE) server.ts --port=2000

.PHONY: build-es5
build-es5:
	$(WEBPACK) --env es=es5 --env uglify=true

.PHONY: test-find
test-find:
	$(TS_NODE_BASE) ./build-system/utils/find-tests.ts

.PHONY: test
test:
	make test-find
	make clean
	$(WEBPACK) --env es=es2018 --env uglify=false --env isTest=true
	make test-only-run

.PHONY: test-only-run
test-only-run:
	$(KARMA) --browsers FirefoxHeadless karma.conf.js

.PHONY: clean
clean:
	rm -rf ./node_modules/.cache && rm -rf build/*
