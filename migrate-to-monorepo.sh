#!/bin/bash

echo "🚀 Starting monorepo migration..."

# Phase 2: Move existing app to apps/website
echo "📦 Moving existing app to apps/website..."

# List of items to move
items=(
  "app"
  "components"
  "lib"
  "public"
  "scripts"
  ".env.local"
  ".gitignore"
  "eslint.config.mjs"
  "next.config.ts"
  "next-env.d.ts"
  "package.json"
  "postcss.config.mjs"
  "tailwind.config.ts"
  "tsconfig.json"
  "vercel.json"
)

for item in "${items[@]}"; do
  if [ -e "$item" ]; then
    echo "  Moving $item..."
    mv "$item" apps/website/
  fi
done

# Move documentation to root docs folder
echo "📚 Organizing documentation..."
mkdir -p docs
mv *.md docs/ 2>/dev/null || true

echo "✅ Phase 2 complete!"

# Phase 3: Create admin app
echo "📦 Creating admin app..."

# Create admin package.json
cat > apps/admin/package.json << 'EOF'
{
  "name": "admin",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --port 3001",
    "build": "next build",
    "start": "next start --port 3001",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "16.0.3",
    "react": "19.2.0",
    "react-dom": "19.2.0",
    "lucide-react": "latest",
    "@neondatabase/serverless": "^0.10.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.0.3",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
EOF

# Copy config files from website to admin
echo "📋 Copying config files to admin..."
cp apps/website/next.config.ts apps/admin/
cp apps/website/tsconfig.json apps/admin/
cp apps/website/postcss.config.mjs apps/admin/
cp apps/website/eslint.config.mjs apps/admin/
cp apps/website/.gitignore apps/admin/

# Create tailwind config for admin
cat > apps/admin/tailwind.config.ts << 'EOF'
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;
EOF

echo "✅ Phase 3 complete!"

echo "🎉 Migration complete! Next steps:"
echo "1. Run: pnpm install"
echo "2. Move admin routes from apps/website/app/admin to apps/admin/app"
echo "3. Move admin components from apps/website/components to apps/admin/components"
echo "4. Update import paths in admin app"
echo "5. Test both apps: pnpm dev"
