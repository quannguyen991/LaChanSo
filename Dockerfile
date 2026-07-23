# KHOAN ĐÃ — production image for Cloud Run / any container host.
# The app reads process.env.PORT (Cloud Run injects it) and needs GEMINI_API_KEY
# for AI analysis. Set TRUST_PROXY=true when running behind the platform proxy.
FROM node:20-slim

ENV NODE_ENV=production
WORKDIR /app

# Install production dependencies against the committed lockfile first (layer cache).
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

# Drop privileges — the base image ships a non-root "node" user.
USER node

EXPOSE 3000
CMD ["node", "server.js"]
