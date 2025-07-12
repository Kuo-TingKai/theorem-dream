#!/bin/bash

# 部署腳本 - 將網站部署到GitHub Pages

echo "🚀 開始部署《命題之夢》網站到GitHub Pages..."

# 確保我們在正確的分支上
git checkout main

# 添加所有更改
git add .

# 提交更改
git commit -m "Update website content"

# 推送到GitHub
git push origin main

echo "✅ 代碼已推送到GitHub"
echo "🌐 網站將在幾分鐘內在以下地址可用："
echo "   https://kuo-tingkai.github.io/theorem-dream"
echo ""
echo "📝 請確保在GitHub倉庫設置中啟用GitHub Pages："
echo "   1. 前往 https://github.com/Kuo-TingKai/theorem-dream/settings/pages"
echo "   2. 選擇 'Deploy from a branch'"
echo "   3. 選擇 'gh-pages' 分支"
echo "   4. 點擊 'Save'" 