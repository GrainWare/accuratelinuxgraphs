#!/bin/bash
npm run build
touch dist/.assetsignore
npx wrangler deploy 