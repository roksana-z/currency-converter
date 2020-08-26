install:
	install-deps

run: 
	node src/bin/index.html

lint:
	npx eslint 