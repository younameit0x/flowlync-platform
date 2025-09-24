# CLAUDE HANDOFF PROMPT
*Copy and paste this entire prompt to another Claude interface for seamless collaboration*

---

**CONTEXT**: I'm working on FlowLync Platform (DeFi-powered affiliate network) and need you to continue development work seamlessly with full project context.

**WORKSPACE**: flowlync-platform (Next.js 15 + TailwindCSS + Vercel deployment)

**CRITICAL INSTRUCTIONS**: 
1. First read `CLAUDE_PROJECT_SYNC.md` in the workspace root - this is our "shared brain" with complete current status
2. Reference `GROK_PROJECT_BRIEF.md` for full technical context and design guidelines  
3. Update the sync document when you make changes so future Claude instances have context

**CURRENT PROJECT STATE**:
- ✅ **COMPLETED**: Professional dashboard integration, complete DeFi repositioning, deployment fixes, liquidity provider section with yield showcase
- 🔄 **NEXT PRIORITY**: Interactive yield calculator (placeholder exists in `src/app/page.js` - needs React component implementation)
- 🎯 **READY TO BUILD**: Casino partner section, social proof section, enhanced signup flow

**KEY CONTEXT**:
- Platform repositioned from generic affiliate to **DeFi liquidity provider innovation** (don't change this positioning)
- Live site deploys automatically from GitHub main branch via Vercel
- Design theme: Blue/purple/green gradients with TailwindCSS
- All foundation work complete - ready for component development phase

**IMMEDIATE TASK**: Build interactive yield calculator component replacing placeholder in `src/app/page.js` (search for "Interactive Yield Calculator - Currently Placeholder"). Requirements:
- Sliders for: Investment Amount ($10K-$1M), Duration (3-60 months), Risk Level
- Real-time calculations showing projected returns
- Visual earnings breakdown (monthly/annual)  
- Mobile responsive with consistent gradient styling
- Match existing design patterns in the file

**COLLABORATION PROTOCOL**: 
- Read sync document first for complete context
- Update sync document with your progress
- Use `npm run dev` for local testing
- Deploy with `git push origin main` 
- Follow existing code patterns and TailwindCSS styling

**DEVELOPMENT COMMANDS**:
```bash
npm run dev          # Start local development
git add .            # Stage changes  
git commit -m "..."  # Commit with descriptive message
git push origin main # Deploy to production
```

You should be able to start coding immediately with this context. The sync document contains exact line numbers, code examples, and detailed specifications for each component. Let's build this together seamlessly! 🚀