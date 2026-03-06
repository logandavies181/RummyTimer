@clean:
    rm -rf dist

alias c := check
@check:
    deno check **/*.ts

alias b := build
@build: clean check
    mkdir -p dist
    deno bundle index.html --outdir dist
    echo "\n// $(git rev-parse HEAD) $(uuidgen)" >> dist/sw.js # trigger reload
    cp manifest.json dist
    deno run -A npm:@tailwindcss/cli -o dist/output.css
    cp public/* dist/

alias s := serve
@serve: build
    #!/usr/bin/env bash
    cd dist
    python3 -m http.server 8080

alias f := fmt
@fmt:
    deno run -A npm:prettier . -w

@deploy: clean build
    #!/usr/bin/env bash
    cd dist
    deno deploy --prod --org logandavies181 --app rummytimer
