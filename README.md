# Boba Smash Share Repo

This git repo contains the game in the [`boba smash`](/Users/leanderblumenthal/chargame/boba%20smash) folder.

## Publish target

- GitHub repo name: `boba-smash`
- Vercel root directory: `boba smash`

## Quick publish

```bash
cd "/Users/leanderblumenthal/chargame"
git add .
git commit -m "Prepare Boba Smash for deployment"
gh auth login -h github.com
gh repo create boba-smash --public --source=. --remote=origin --push
```

Then import the repo into Vercel and set the root directory to `boba smash`.
