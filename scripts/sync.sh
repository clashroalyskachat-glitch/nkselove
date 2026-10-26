#!/usr/bin/env bash
#
# Подтягивает свежие файлы сайта из двух исходных репозиториев:
#
#   clashroalyskachat-glitch.github.io  ->  корень   (меню)
#   mypars                              ->  mypars/  (расписание + библиотека)
#
# Меню и расписание на GitHub Pages обновляются своими workflow,
# а Firebase получает актуальную копию при следующем запуске.

set -euo pipefail

HUB_REPO="clashroalyskachat-glitch/clashroalyskachat-glitch.github.io"
SITE_REPO="clashroalyskachat-glitch/mypars"
BRANCH="main"

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

fetch() {
    local repo="$1" dest="$2"
    mkdir -p "$dest"
    curl -fsSL "https://codeload.github.com/${repo}/tar.gz/refs/heads/${BRANCH}" \
        | tar -xz -C "$dest" --strip-components=1
}

echo "-> скачиваю ${HUB_REPO}"
fetch "$HUB_REPO" "$tmp/hub"

echo "-> скачиваю ${SITE_REPO}"
fetch "$SITE_REPO" "$tmp/site"

# --- меню (корень сайта) ---------------------------------------------------
for file in index.html styles.css app.js favicon.svg .nojekyll; do
    if [ -f "$tmp/hub/$file" ]; then
        cp "$tmp/hub/$file" "./$file"
    fi
done

# --- расписание и библиотека (mypars/) -------------------------------------
mkdir -p ./mypars

rsync -a --delete \
    --exclude='.git' \
    --exclude='.github' \
    --exclude='node_modules' \
    --exclude='__pycache__' \
    --exclude='_pagecache' \
    --exclude='server.py' \
    --exclude='server.log' \
    --exclude='update_all_groups_v3.py' \
    --exclude='update_and_start.bat' \
    --exclude='package.json' \
    --exclude='package-lock.json' \
    --exclude='tailwind.config.js' \
    --exclude='tailwind.src.css' \
    --exclude='firebase.json' \
    --exclude='.firebaserc' \
    --exclude='.gitignore' \
    "$tmp/site/" "./mypars/"

echo "-> готово"
