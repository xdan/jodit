mkfile_path := $(abspath $(lastword $(MAKEFILE_LIST)))
cwd := $(dir $(mkfile_path))
pwd := $(shell pwd)
build ?= es2015
devMode ?= development
generateTypes ?= false
es ?= es2015
uglify ?= true
browsers ?= FirefoxHeadless
includeLanguages ?= ''
excludeLanguages ?= ''
includePlugins ?= ''
excludePlugins ?= ''
singleRun ?= true
isTest ?= false
debug ?= false
updateTests ?= false
fat ?= false
push ?= true
outputFolder ?= ''
version = $(shell cat package.json | ./node_modules/node-jq/bin/jq -r '.version')

WEBPACK_DEV_PORT := 2000
ACTIONS_URL := https://github.com/xdan/jodit/actions/
BUILD_DTS := true
BUILD_ESM := true
UGLIFY_ESM := false
CHANGELOG_URL := https://github.com/xdan/jodit/blob/main/CHANGELOG.md
NODE_MODULES_BIN := ./node_modules/.bin
TS_NODE_BASE := $(NODE_MODULES_BIN)/ts-node --project $(cwd)tools/tsconfig.json
WEBPACK := $(TS_NODE_BASE) $(NODE_MODULES_BIN)/webpack
KARMA := @TS_NODE_TRANSPILE_ONLY=true $(TS_NODE_BASE) $(NODE_MODULES_BIN)/karma start

.PHONY: update
update:
	@npm update

.PHONY: version
version:
	@echo $(version)
	@echo super_cwd: $(cwd)
	@echo cwd: $(shell pwd)

.PHONY: start dev love
start dev love:
	@WEBPACK_DEV_PORT=$(WEBPACK_DEV_PORT) $(WEBPACK) serve --progress --mode $(devMode) \
		--env stat=true \
		--env es=$(es) \
		--env uglify=$(uglify) \
		--env includeLanguages=$(includeLanguages) \
		--env excludeLanguages=$(excludeLanguages) \
		--env includePlugins=$(includePlugins) \
		--env excludePlugins=$(excludePlugins) \
		--env isTest=$(isTest) \
		--env fat=$(fat)

.PHONY: build
build:
	@TS_NODE_TRANSPILE_ONLY=true $(WEBPACK) --progress --mode production \
		--env stat=true \
		--env es=$(es) \
		--env uglify=$(uglify) \
		--env isTest=$(isTest) \
		--env includeLanguages=$(includeLanguages) \
		--env excludeLanguages=$(excludeLanguages) \
		--env includePlugins=$(includePlugins) \
		--env excludePlugins=$(excludePlugins) \
		--env outputFolder=$(outputFolder) \
		--env fat=$(fat) \
		--env generateTypes=$(generateTypes)

.PHONY: clean
clean:
	@echo Clean cache and build folder ...
	@rm -rf $(pwd)/node_modules/.cache && rm -rf $(pwd)/build/*

.PHONY: dts
ifeq ($(BUILD_DTS), true)
dts:
	@echo Prepare types ...
	@mkdir -p ./build/types/types
	@cp -R ./tsconfig.json ./build/types/

	@echo 'Copy declarations ...';
	@$(TS_NODE_BASE) $(cwd)/tools/utils/copy-declaration-files-to-esm-build.ts $(pwd)/src/ $(pwd)/build/types ;


	@if [ -d ./build/types/node_modules/jodit ]; then \
		echo "Remove super types ..."; \
		rm -rf ./build/types/node_modules/; \
	fi;
	@if [ -d ./build/types/src ]; then \
		echo "Normalize self types ..."; \
		cp -R ./build/types/src/* ./build/types/; \
		rm -rf ./build/types/src/; \
	fi;

	@$(TS_NODE_BASE) $(cwd)tools/utils/resolve-alias-imports.ts --cwd=./build/types --mode=dts --ver=$(version)
	@$(NODE_MODULES_BIN)/replace "import .+.(less|svg)('|\");" '' ./build/types -r --include='*.d.ts' --silent

	@if [ -d ./build/esm ]; then \
		echo "Copy types to esm folder ..."; \
		cp -R ./build/types/* ./build/esm; \
	fi
else
dts:
	@echo "Types not yet available"
endif

.PHONY: esm

ifeq ($(BUILD_ESM), true)
esm:
	@echo 'Build esm modules ...' $(BUILD_ESM)
	rm -rf $(pwd)/build/esm
	tsc -p $(pwd)/tsconfig.esm.json --rootDir $(pwd)/src --importHelpers false --allowJs true --checkJs false --excludeDirectories $(pwd)/node_modules --module es2020 --target es2020 --removeComments false --sourceMap false --outDir $(pwd)/build/esm

	@echo 'Remove style imports ...'
	@$(NODE_MODULES_BIN)/replace "import .+\.(less|css)('|\");" '' $(pwd)/build/esm -r --silent

	echo 'Resolve alias imports ...'
	$(TS_NODE_BASE) $(cwd)tools/utils/resolve-alias-imports.ts --cwd=$(pwd)/build/esm --mode=esm --ver=$(version)

	@if [ -d "$(pwd)/src/langs" ]; then\
			echo 'Copy langs ...'; \
			rsync -r --exclude '*.test.js' $(pwd)/src/langs/*.js $(pwd)/build/esm/langs ;\
			$(NODE_MODULES_BIN)/replace "module.exports = " "export default " $(pwd)/build/esm/ -r --silent; \
	fi

	@echo 'Copy icons ...'
	@$(TS_NODE_BASE) $(cwd)/tools/utils/copy-icons-in-esm.ts $(pwd)/src/ $(pwd)/build/esm

	@if [ "$(UGLIFY_ESM)" = "true" ]; then \
		echo 'Uglify esm modules ...'; \
		find "$(pwd)/build/esm" -name "*.js" | while read fname; do \
			$(NODE_MODULES_BIN)/terser "$$fname" -o "$$fname" --compress passes=5,ecma=2020 --mangle --keep-classnames --keep-fnames  --module; \
		done \
	fi;
else
esm:
	@echo "ESM build not yet available"
endif


.PHONY: build-all
build-all:
	make clean
	@mkdir -p $(pwd)/build/
	@$(TS_NODE_BASE) $(cwd)tools/utils/prepare-publish.ts $(pwd)
	@$(NODE_MODULES_BIN)/replace "4\.0\.1\.\d+" "$(version)" $(pwd)/build/README.md --silent

	@echo 'Build esm ...'
	make esm

	@echo 'Build types ...'
	make build es=es2018 uglify=false generateTypes=$(BUILD_DTS)
	make dts

	@echo 'Builds ...'
	make build es=es2018
	make build es=es2018 uglify=true fat=true

	make build es=es2015
	make build es=es2015 uglify=false
	make build es=es2015 uglify=true fat=true

	make build es=es2021
	make build es=es2021 uglify=false
	make build es=es2021 uglify=true fat=true

	make build es=es5
	make build es=es5 uglify=false
	make build es=es5 uglify=true fat=true

	make build es=es2021 includeLanguages=en
	make build es=es2021 includeLanguages=en uglify=false
	make build es=es2021 includeLanguages=en uglify=true fat=true

.PHONY: test-all
test-all:
	make test-only-run build=es2021 uglify=$(uglify) fat=$(fat)
	make test-only-run build=es2018 uglify=$(uglify) fat=$(fat)
	make test-only-run build=es2015 uglify=$(uglify) fat=$(fat)
	make test-only-run build=es5 uglify=$(uglify) fat=$(fat)

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
	make build es=$(es) uglify=$(uglify) isTest=true fat=$(fat)
	make test-only-run build=$(es) uglify=$(uglify) fat=$(fat) browsers=$(browsers)


.PHONY: test-find find-test
test-find find-test:
	$(TS_NODE_BASE) $(cwd)tools/utils/find-tests.ts

.PHONY: test-only-run test-run-only
test-only-run test-run-only:
	$(KARMA) --browsers $(browsers) $(cwd)tools/karma.conf.ts --single-run $(singleRun) --build=$(build) --min=$(uglify) --fat=$(fat) --cwd=$(pwd)

.PHONY: coverage
coverage:
	npx --yes type-coverage ./src --detail --ignore-files 'build/**' --ignore-files 'test/**' --ignore-files 'examples/**'

.PHONY: screenshots-update
screenshots-update:
	make build es=es2021 fat=true uglify=true
	make screenshots-build-image
	make screenshots-test es=es2021 fat=true min=true updateTests=true


.PHONY: screenshots-all
screenshots-all:
	make screenshots-build-image
	make screenshots-test build=es5 fat=true min=true
	make screenshots-test build=es2015 fat=true min=true
	make screenshots-test build=es2018 fat=true min=true
	make screenshots-test build=es2021 fat=true min=true


.PHONY: screenshots-test
screenshots-test:
	docker run --ipc=host \
		-p 9323:9323 \
		-v $(shell pwd)/build:/app/build/ \
		-v $(shell pwd)/test:/app/test/ \
		-v $(shell pwd)/src:/app/src/ \
		-v $(shell pwd)/tools:/app/tools/ \
		-v $(shell pwd)/tools:/app/tools/ \
		-v $(shell pwd)/playwright-report:/app/playwright-report/ \
		-v $(shell pwd)/playwright.config.ts:/app/playwright.config.ts \
		-e BUILD=$(es) \
		-e MIN=$(uglify) \
		-e FAT=$(fat) \
		jodit-screenshots \
		npx playwright test --update-snapshots

.PHONY: screenshots-build-image
screenshots-build-image:
	docker build -t jodit-screenshots -f test/screenshots/Dockerfile .


.PHONY: newversion
newversion:
	npm version patch --no-git-tag-version
	#npm version prerelease --preid=beta --no-git-tag-version
	make newversion-git

.PHONY: newversion-git
newversion-git:
	git config user.name "xdan"
	git config user.email "chupurnov@gmail.com"
	git add --all  && git commit -m "New version $(version) Read more $(CHANGELOG_URL)"
	git tag $(version)
	@if [ "$(push)" = "true" ]; then \
		git push --tags origin HEAD:main;\
	fi
	@echo "New version $(version) Actions: $(ACTIONS_URL)"

.PHONY: jodit
jodit:
	cd ../jodit-react/
	npm update
	npm run newversion
	cd ../jodit-pro
	npm run newversion
	cd ../jodit-joomla
	npm run newversion

.PHONY: sync
sync:
	$(TS_NODE_BASE) $(cwd)tools/utils/sync.ts --source $(cwd) --target ../jodit-pro/node_modules/jodit

.PHONY: examples
examples:
	@echo "Copy build to examples"
	@if [ -d ./examples/build ]; then rm -rf ./examples/build; fi;
	@mkdir -p ./examples/build
	@cp -R ./build/* ./examples/build
	@$(NODE_MODULES_BIN)/replace '../build' './build' ./examples -r --include='*.html'

.PHONY: esm-t
esm-t:
		make clean
		@echo 'Build esm ...'
		make esm

		@echo 'Build types ...'
		make build es=es2018 uglify=false generateTypes=true
		make dts

		rm -rf ../jodit-examples/node_modules/jodit/esm
		mkdir ../jodit-examples/node_modules/jodit/esm
		cp -R ./build/esm/* ../jodit-examples/node_modules/jodit/esm
