# Deploy-Checkliste

Vor dem Deployment folgende Schritte ausfuehren:

1. Lint pruefen: `npm run lint`
2. Build testen: `npm run build`
3. TypeScript-Fehler pruefen: `npx tsc --noEmit`
4. Umgebungsvariablen in Vercel pruefen
5. Git Status pruefen: keine uncommitted changes
6. Push auf den aktuellen Branch: `git push`
7. Vercel-Deployment ueberwachen
