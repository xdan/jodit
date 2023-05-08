NODE_MODULES_BIN := ./node_modules/.bin
TS_NODE_BASE := TS_NODE_TRANSPILE_ONLY=true node -r ts-node/register
WEBPACK := $(TS_NODE_BASE) $(NODE_MODULES_BIN)/webpack
KARMA := $(TS_NODE_BASE) $(NODE_MODULES_BIN)/karma start

build ?= build
devMode ?= development
generateTypes ?= generateTypes
es ?= es2015
uglify ?= true
browsers ?= FirefoxHeadless
includeLanguages ?= ''
excludeLanguages ?= ''
singleRun ?= true
isTest ?= false
debug ?= false
updateTests ?= false
version = $(shell cat package.json | jq -r '.version')

.PHONY: start
start:
	$(WEBPACK) serve --progress --mode $(devMode) \
		--env stat=true \
		--env es=$(es) \
		--env uglify=$(uglify) \
		--env includeLanguages=$(includeLanguages) \
		--env excludeLanguages=$(excludeLanguages) \
		--env isTest=$(isTest)

.PHONY: build
build:
	$(WEBPACK) --progress --mode production \
		--env stat=true \
		--env es=$(es) \
		--env uglify=$(uglify) \
		--env isTest=$(isTest) \
		--env includeLanguages=$(includeLanguages) \
		--env excludeLanguages=$(excludeLanguages) \
		--env generateTypes=$(generateTypes)

.PHONY: clean
clean:
	rm -rf ./node_modules/.cache && rm -rf build/*

.PHONY: dts
dts:
	mkdir -p ./build/types/types
	cp -R ./tsconfig.json ./build/types/
	cp -R ./src/typings.d.ts ./build/types/
	cp -R ./src/types/* ./build/types/types
	$(TS_NODE_BASE) ./tools/utils/resolve-alias-imports.ts ./build/types
	$(NODE_MODULES_BIN)/replace "import .+.(less|svg)('|\");" '' ./build/types -r --include='*.d.ts'

.PHONY: esm
esm:
	echo Build esm modules ...
	rm -rf ./build/esm
	tsc -p tsconfig.json --module es2020 --target es2020 --removeComments false --sourceMap false --outDir ./build/esm

	echo Resolve alias imports ...
	$(TS_NODE_BASE) ./tools/utils/resolve-alias-imports.ts ./build/esm

	echo Copy langs ...
	rsync -r --exclude '*.test.js' ./src/langs/*.js ./build/esm/langs
	$(NODE_MODULES_BIN)/replace "module.exports = " "export default " ./build/esm/langs/*.js

	echo Remove style imports ...
	$(NODE_MODULES_BIN)/replace "import .+.(less|css)('|\");" '' ./build/esm -r

	echo Copy icons ...
	$(TS_NODE_BASE) ./tools/utils/copy-icons-in-esm.ts $(shell pwd)/src/ ./build/esm

.PHONY: build-all
build-all:
	make clean
	$(TS_NODE_BASE) ./tools/utils/prepare-publish.ts
	cd ./build/ && npm i && cd ..

	make build es=es2021 uglify=false generateTypes=true
	make dts
	make build es=es2021

	make build es=es2015
	make build es=es2015 uglify=false

	make build es=es5
	make build es=es5 uglify=false

	make build es=es2021 includeLanguages=en
	make build es=es2021 includeLanguages=en uglify=false

	make esm

.PHONY: test-all
test-all:
	make test-only-run build=es2021 uglify=true
	make test-only-run build=es2015 uglify=true
	make test-only-run build=es5 uglify=true
	make screenshots-test build=es5
	make screenshots-test build=es2015
	make screenshots-test build=es2021

.PHONY: lint
lint:
	tsc --noemit --noErrorTruncation
	eslint ./src/ ./test/
	stylelint ./src/**/**.less

.PHONY: fix
fix:
	npx eslint ./src/ ./test/ --fix
	make prettify

prettify:
	npx prettier --write ./src/*.{ts,less} ./src/**/*.{ts,less} ./src/**/**/*.{ts,less} ./src/**/**/**/*.{ts,less} ./src/**/**/**/**/*.{ts,less}

.PHONY: test
test:
	make test-find
	make clean
	make build es=$(es) uglify=$(uglify) isTest=true
	make test-only-run build=$(es) uglify=$(uglify)

.PHONY: test-find
test-find:
	$(TS_NODE_BASE) ./tools/utils/find-tests.ts

.PHONY: test-only-run
test-only-run:
	$(KARMA) --browsers $(browsers) ./test/karma.conf.ts --single-run $(singleRun) --build=$(build) --min=$(uglify)

.PHONY: coverage
coverage:
	npx --yes type-coverage ./src --detail --ignore-files 'build/**' --ignore-files 'test/**' --ignore-files 'examples/**'


.PHONY: screenshots-test
screenshots-test:
	docker run -v $(shell pwd)/build:/app/build/ -v $(shell pwd)/test:/app/test/ \
		-p 2003:2003 \
		-e SNAPSHOT_UPDATE=$(updateTests) \
		-v $(shell pwd)/src:/app/src/ jodit-screenshots \
		node --input-type=module ./node_modules/.bin/mocha ./src/**/**.screenshot.js --build=$(es)

.PHONY: screenshots-build-image
screenshots-build-image:
	docker build -t jodit-screenshots -f test/screenshots/Dockerfile .

.PHONY: newversion
newversion:
	make lint
	make clean
	make test
	npm version patch --no-git-tag-version
	make build-all
	make newversion-git
	npm publish ./
	rm -rf types/

.PHONY: newversion-git
newversion-git:
	git add --all  && git commit -m "New version $(version) Read more https://github.com/xdan/jodit/blob/main/CHANGELOG.md "
	git tag $(version)
	git push --tags origin HEAD:main

.PHONY: jodit
jodit:
	cd ../jodit-react/
	npm update
	npm run newversion
	cd ../jodit-pro
	npm run newversion
	cd ../jodit-joomla
	npm run newversion
