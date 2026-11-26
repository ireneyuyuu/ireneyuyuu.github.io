# Updating and publishing your portfolio

Your website: **<https://ireneyuyuu.github.io/>**
Its code on GitHub: **<https://github.com/ireneyuyuu/ireneyuyuu.github.io>**

## The short version

1. Edit the website in **`Desktop/Internship/Portfolio`** (this folder).
2. Publish with one command: `npm run deploy -- "what you changed"`
3. Wait 1–2 minutes and refresh the website.

**Or just ask Claude Code.** Open Claude Code in this folder and say what you want, for example:

> "Add a new project called *Library Addition* to Academic Works using the drawings in `source-images/library-addition/`, then deploy."

> "Replace my resume PDF with `~/Downloads/Resume_2027.pdf`, update the resume page to match, and redeploy."

> "Deploy my latest changes to the website."

---

## How publishing works

```
You edit files here  ──►  npm run deploy  ──►  GitHub receives the changes
                                                    │
                       website updated  ◄──  GitHub builds the site itself
                       (1–2 minutes)          (.github/workflows/deploy.yml)
```

You never upload files by hand. GitHub rebuilds the whole site every time you publish, so the address stays the same.

> **Which folder?** Always work in `Desktop/Internship/Portfolio`. The copy in `Downloads/irene-zhang-portfolio` is your untouched original from before the site went online. Keep it as a backup, but don't edit it, because it isn't connected to GitHub.

---

## Step by step (doing it yourself)

### 1. Open Terminal in the project folder

Open the **Terminal** app (press Cmd+Space, type *Terminal*, press Return), then paste:

```bash
cd ~/Desktop/Internship/Portfolio
```

### 2. Preview your changes on your own computer (optional)

```bash
npm run dev
```

Open <http://localhost:4173> in your browser. The site rebuilds when you save a file; refresh the browser to see the change. Press **Ctrl+C** in Terminal to stop.

### 3. Make your changes

| I want to… | Edit this |
|---|---|
| Change project text, add/remove/reorder drawings | `src/content/projects.ts` |
| Add new drawings or renderings | Put originals in `source-images/<project-slug>/`, run `npm run images`, then reference them in `projects.ts` |
| Change the resume page text | `src/content/resume.ts` |
| Replace the resume PDF | Save the new PDF over `public/documents/Yuhan_Irene_Zhang_Resume.pdf` (same name) |
| Change name, tagline, categories | `src/content/site.ts` |
| Colours and fonts | Top of `src/styles.css` |

`README.md` has detailed examples for each of these.

### 4. Publish

```bash
npm run deploy -- "Add library project"
```

The text in quotes is a short note to yourself about what changed. You'll see four steps, then `✓ Uploaded`.

### 5. Check it's live

- Watch progress at <https://github.com/ireneyuyuu/ireneyuyuu.github.io/actions>. A **green tick** means it's live; a **red ✗** means the build failed and the old version stays online (see Troubleshooting).
- Then open <https://ireneyuyuu.github.io/> and refresh. If you still see the old version, force a refresh with **Cmd+Shift+R**.

---

## About images

- **Originals** (`source-images/`) stay on your computer only and are never uploaded.
- `npm run images` makes three web-sized copies of each in `public/images/` (800 px, 1600 px, and up to 4000 px for the zoom viewer). Those copies are what gets published.
- Keep exporting originals at about 4000 px on the long edge. GitHub's limits are 100 MB per file and about 1 GB for the whole site; the site is currently about 34 MB.

---

## Troubleshooting

| Problem | What to do |
|---|---|
| `command not found: npm` | Close Terminal and open a new window. If it still happens, run `export PATH="$HOME/.local/bin:$PATH"` first. |
| A red ✗ on the Actions page | Click it to see the error, or ask Claude Code: *"The GitHub deploy failed, please fix it."* The previous version of the site stays online meanwhile. |
| Deploy says "authentication failed" or asks for a password | Your GitHub login expired. Run `gh auth login --web` and follow the code-and-browser steps again. Never type your GitHub password into Terminal. |
| Deploy stops at step 3 with a "conflict" | Something was edited directly on github.com and clashes with your change. Ask Claude Code to resolve it. |
| I want to undo a change | Ask Claude Code: *"Undo my last website update and redeploy."* Every published version is saved on GitHub, so nothing is lost. |

---

## Technical details (for reference)

- **Hosting:** GitHub Pages, source set to *GitHub Actions* (repo → Settings → Pages). It's a user site at the domain root, so `basePath` in `site.ts` stays `""`.
- **Build:** `npm run build` pre-renders every page to its own `index.html` (`/projects/<slug>/index.html`, `/resume/index.html`…), plus `404.html`. Direct links and page refreshes therefore work without any routing workaround. `.nojekyll` isn't needed because GitHub Actions deploys skip Jekyll.
- **Workflow:** `.github/workflows/deploy.yml` runs `npm ci` and `npm run build` on Node 22, then publishes `dist/`. `dist/` itself is not stored in Git.
- **Pinned versions:** `package-lock.json` fixes React 19.2.8, Tailwind CSS 4.3.3 and esbuild 0.28.2, the versions the original site was built with. A fresh build reproduces the original files exactly. Upgrade them only on purpose, and compare the site afterwards.
- **Tools on this Mac:** Node.js 22 and GitHub CLI (`gh`) are installed in `~/.local` (no admin rights needed); `~/.zprofile` adds `~/.local/bin` to the PATH. Git uses `gh` for sign-in, so no password or token is stored in this project.
- **Commit identity:** commits use GitHub's private address `…@users.noreply.github.com`, so your email isn't exposed in the public history.
- **Privacy:** the phone number is intentionally blank in `src/content/resume.ts`. The repository is public, so anything in this folder except the ignored files (`node_modules/`, `dist/`, `source-images/`) can be read by anyone.
- **Netlify / Vercel:** `netlify.toml` and `vercel.json` are left in place and unused.
