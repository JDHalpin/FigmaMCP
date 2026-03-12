# Shared Shopping List

A simple, shareable shopping list app for couples or roommates.

## Features

- ✅ Add/remove/check off items
- ✅ Category organization (Produce, Dairy, Meat, Pantry, Other)
- ✅ Persistent storage (survives page refresh)
- ✅ Shareable links for collaboration
- ✅ Real-time updates between users
- ✅ Mobile-responsive design

## Deployment to GitHub Pages

This app is already set up as a standalone HTML file. Just commit and push:

```bash
git add .
git commit -m "Add shared shopping list app"
git push origin main
```

Wait ~1 minute for GitHub Pages to rebuild, then access at:
`https://jeffhalpin.com/shopping/`

## How to Use

1. Open the app at `jeffhalpin.com/shopping/`
2. Click "Copy Share Link"
3. Send the link to your shopping partner
4. Both of you can add/edit items and they'll sync automatically

## Technical Details

- **Framework:** React (via CDN)
- **Styling:** Tailwind CSS
- **Storage:** Browser localStorage
- **Sync:** URL hash-based list IDs + storage events

## Limitations (MVP)

- Data stored locally in browser (not cloud database)
- Best when both users have the page open simultaneously
- No native Amazon/Whole Foods integration

## Future Enhancements

- Import/export CSV functionality
- Quantity tracking
- Price estimation
- Recipe-based list generation
- Cloud database for true real-time sync
