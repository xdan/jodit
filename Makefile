mkfile_path := $(abspath $(lastword $(MAKEFILE_LIST)))
cwd := $(dir $(mkfile_path))
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
outputFolder ?= ''
version = $(shell cat package.json | jq -r '.version')

WEBPACK_DEV_PORT := 2000
NODE_MODULES_BIN := ./node_modules/.bin
TS_NODE_BASE := $(NODE_MODULES_BIN)/ts-node --project $(cwd)tools/tsconfig.json
WEBPACK := $(TS_NODE_BASE) $(NODE_MODULES_BIN)/webpack
KARMA := $(TS_NODE_BASE) $(NODE_MODULES_BIN)/karma start

.PHONY: version
version:
	@echo $(version)
	@echo super_cwd: $(cwd)
	@echo cwd: $(shell pwd)

.PHONY: start
start:
	@WEBPACK_DEV_PORT=$(WEBPACK_DEV_PORT) $(WEBPACK) serve --progress --mode $(devMode) \
		--stats verbose
		--env stat=true \
		--env es=$(es) \
		--env uglify=$(uglify) \
		--env includeLanguages=$(includeLanguages) \
		--env excludeLanguages=$(excludeLanguages) \
		--env isTest=$(isTest)

.PHONY: build
build:
	@TS_NODE_TRANSPILE_ONLY=true $(WEBPACK) --progress --mode production \
		--env stat=true \
		--env es=$(es) \
		--env uglify=$(uglify) \
		--env isTest=$(isTest) \
		--env includeLanguages=$(includeLanguages) \
		--env excludeLanguages=$(excludeLanguages) \
		--env outputFolder=$(outputFolder) \
		--env generateTypes=$(generateTypes)

.PHONY: clean
clean:
	rm -rf ./node_modules/.cache && rm -rf build/*

.PHONY: dts
dts:
	echo Prepare types ...
	mkdir -p ./build/types/types
	cp -R ./tsconfig.json ./build/types/
	cp -R ./src/typings.d.ts ./build/types/
	cp -R ./src/types/* ./build/types/types
	@$(TS_NODE_BASE) $(cwd)tools/utils/resolve-alias-imports.ts --cwd=./build/types --ver=$(version)
	@$(NODE_MODULES_BIN)/replace "import .+.(less|svg)('|\");" '' ./build/types -r --include='*.d.ts' --silent

.PHONY: esm
esm:
	@echo 'Build esm modules ...'
	rm -rf ./build/esm
	tsc -p tsconfig.json --importHelpers false --module es2020 --target es2020 --removeComments false --sourceMap false --outDir ./build/esm

	@echo 'Remove style imports ...'
	@$(NODE_MODULES_BIN)/replace "import .+.(less)('|\");" '' ./build/esm -r --silent

	@echo 'Resolve alias imports ...'
	$(TS_NODE_BASE) $(cwd)tools/utils/resolve-alias-imports.ts --cwd=./build/esm --ver=$(version)

	@echo 'Copy langs ...'
	rsync -r --exclude '*.test.js' ./src/langs/*.js ./build/esm/langs
	@$(NODE_MODULES_BIN)/replace "module.exports = " "export default " ./build/esm/ -r --silent

	@echo 'Copy icons ...'
	@$(TS_NODE_BASE) ./tools/utils/copy-icons-in-esm.ts $(shell pwd)/src/ ./build/esm

.PHONY: build-all
build-all:
	make clean
	@mkdir -p ./build/
	$(TS_NODE_BASE) $(cwd)tools/utils/prepare-publish.ts $(shell pwd)
	@$(NODE_MODULES_BIN)/replace "4\.0\.0-beta\.\d+" "$(version)" ./build/README.md --silent
	cd ./build/ && npm i && cd ..

	make esm

	make build es=es2018 uglify=false generateTypes=true
	make dts
	make build es=es2018

	make build es=es2015
	make build es=es2015 uglify=false

	make build es=es2021
	make build es=es2021 uglify=false

	make build es=es5
	make build es=es5 uglify=false

	make build es=es2021 includeLanguages=en
	make build es=es2021 includeLanguages=en uglify=false

.PHONY: test-all
test-all:
	make test-only-run build=es2021 uglify=true
	make test-only-run build=es2018 uglify=true
	make test-only-run build=es2015 uglify=true
	make test-only-run build=es5 uglify=true

.PHONY: lint
lint:
	$(NODE_MODULES_BIN)/tsc --noemit --noErrorTruncation
	$(NODE_MODULES_BIN)/eslint ./src/ ./test/
	$(NODE_MODULES_BIN)/stylelint ./src/**/**.less

.PHONY: fix
fix:
	$(NODE_MODULES_BIN)/eslint ./src/ ./test/ --fix
	make prettify

prettify:
	$(NODE_MODULES_BIN)/prettier --write ./src/*.{ts,less} ./src/**/*.{ts,less} ./src/**/**/*.{ts,less} ./src/**/**/**/*.{ts,less} ./src/**/**/**/**/*.{ts,less}

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

.PHONY: screenshots-all
screenshots-all:
	make screenshots-build-image
	make screenshots-test build=es5
	make screenshots-test build=es2015
	make screenshots-test build=es2018
	make screenshots-test build=es2021


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
	#npm version patch --no-git-tag-version
	npm version prerelease --preid=beta --no-git-tag-version
	make newversion-git

.PHONY: newversion-git
newversion-git:
	git add --all  && git commit -m "New version $(version) Read more https://github.com/xdan/jodit/blob/main/CHANGELOG.md "
	git tag $(version)
	git push --tags origin HEAD:main
	@echo "New version $(version) Actions: https://github.com/xdan/jodit/actions/"

.PHONY: jodit
jodit:
	cd ../jodit-react/
	npm update
	npm run newversion
	cd ../jodit-pro
	npm run newversion
	cd ../jodit-joomla
	npm run newversion
