NODE_MODULES_BIN := ./node_modules/.bin
TS_NODE_BASE := TS_NODE_TRANSPILE_ONLY=true node -r ts-node/register
WEBPACK := $(TS_NODE_BASE) $(NODE_MODULES_BIN)/webpack

.PHONY: start
start:
	$(TS_NODE_BASE) server.ts --port=2000

.PHONY: build
build:
	$(WEBPACK) --progress --mode production --env es=es5 --env uglify=true --env stat=true
