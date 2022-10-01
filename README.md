# P-NP Patcher
P-NP modifies and serves Prodigy's game files.
<br>

------

# Quickstart

## Shell Script
```sh
git clone https://github.com/ProdigyPNP/P-NP.git
cd P-NP
pnpm install
pnpm build
node dist
```

## Dependencies
- [Node.js](https://nodejs.org/)
  - Node.js is the JavaScript runtime that we use
  - P-NP needs Node.js **v16 or above** to run.
- [git](https://git-scm.com/)
  - It's technically possible to run P-NP without git, however git allows easy updating through `git pull`, and lots of other functionality.
  - Using wget: ```wget https://github.com/ProdigyPNP/P-NP/archive/refs/heads/master.zip && unzip master.zip && rm master.zip && cd master && pnpm install && pnpm build && node dist```
- [pnpm](https://pnpm.io/)
  - It's the package manager we here at ProdigyPNP use. It's much better than the normal npm for a variety of reasons.
  - Technically possible to use npm/yarn instead of pnpm for P-NP, but not reccomended.

<br><br>


# Repl

## Running P-NP on Repl.it
Repl is a bit wacky, since it uses a very old version of Node.js. This makes P-NP throw an error, but there is a fix.

1. Make a [new **Repl**](https://repl.it/new).
2. Click **Import from GitHub**.
3. Paste this in GitHub URL: ``https://github.com/ProdigyPNP/P-NP.git``.
4. Click **+ Import from GitHub**.
5. If you get a popup from Repl saying "configure the start button", click **OK**.
6. On the right half of the screen, there should be a tab that says **Shell**. Click it.
7. Paste the code snippet below into the shell. Once it's finished, click the Start button.

```sh
node -v
npm i --save-dev node@16
npm config set prefix=$(pwd)/node_modules/node
export PATH=$(pwd)/node_modules/node/bin:$PATH
node -v

```

<br><br>

# Node.js Package

P-NP is available on npmjs at https://npmjs.com/package/p-np-patcher.

## Install
```shell
pnpm install p-np-patcher
```

## Uninstall
```shell
pnpm remove p-np-patcher
```

### Import
P-NP supports ES Modules/TypeScript, and not CommonJS.
```es6
import PNP from "p-np-patcher";
```

<br>


<br>
