# P-NP Patcher
P-NP modifies and serves Prodigy's game files.
<br>

------

# Quickstart

## Windows Quickstart

1. Install [Node.js with npm](https://nodejs.org) if you don't have it already.
2. Install [git](https://git-scm.com) if you don't have it already.
3. Open **Windows PowerShell**.
4. Copy and paste the code snippet below to automatically run P-NP.

```sh
git clone https://github.com/ProdigyPNP/P-NP.git
cd P-NP
npm install
npm start
```
<br>



## MacOS Quickstart

1. Install [Node.js with npm](https://nodejs.org) if you don't have it already.
2. Install [git](https://git-scm.com) if you don't have it already.
3. Open **iTerm**.
4. Copy and paste the code snippet below to automatically run P-NP.

```sh
git clone https://github.com/ProdigyPNP/P-NP.git
cd P-NP
npm install
npm start
```
<br>



## Linux Quickstart

1. Install [Node.js with npm](https://nodejs.org) if you don't have it already.
2. Install [git](https://git-scm.com) if you don't have it already.
3. Open **Terminal**.
4. Copy and paste the code snippet below to automatically run P-NP.

```sh
git clone https://github.com/ProdigyPNP/P-NP
cd P-NP
npm install
node dist
```
<br><br>



# Build Binaries

## Build Binaries on Windows

1. Install [Node.js with npm](https://nodejs.org) if you don't have it already.
2. Install [git](https://git-scm.com) if you don't have it already.
3. Open **Windows PowerShell**.
4. Copy and paste the code snippet below to automatically build P-NP's binaries.

```sh
git clone https://github.com/ProdigyPNP/P-NP.git
cd P-NP
npm install
# npm run build
# We'll return build soon, it's a bit of a mess right now as we only have the dist.
npm run create-exes
```
<br>



## Build Binaries on MacOS

1. Install [Node.js with npm](https://nodejs.org) if you don't have it already.
2. Install [git](https://git-scm.com) if you don't have it already.
3. Open **iTerm**.
4. Copy and paste the code snippet below to automatically build P-NP's binaries.

```sh
git clone https://github.com/ProdigyPNP/P-NP.git
cd P-NP
npm install
# npm run build
# We'll return build soon, it's a bit of a mess right now as we only have the dist.
npm run create-exes
```
<br>



## Build Binaries on Linux

1. Install [Node.js with npm](https://nodejs.org) if you don't have it already.
2. Install [git](https://git-scm.com) if you don't have it already.
3. Open **Terminal**.
4. Copy and paste the code snippet below to automatically build P-NP's binaries.

```sh
git clone https://github.com/ProdigyPNP/P-NP
cd P-NP
npm install
# npm run build
# We'll return build soon, it's a bit of a mess right now as we only have the dist.
npm run create-exes
```
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
npm init -y && npm i --save-dev node@16 && npm config set prefix=$(pwd)/node_modules/node && export PATH=$(pwd)/node_modules/node/bin:$PATH
node -v
npm install

```

<br><br>

# npm package

P-NP is available on npmjs at https://npmjs.com/package/p-np-patcher.

### Installing P-NP
Shell
```shell
npm install p-np-patcher
npm install
npm update
```

<br>

### Uninstalling P-NP
Shell
```shell
npm uninstall p-np-patcher
npm install
npm update
```

<br>

### Import in TypeScript
TypeScript
```typescript
import PNP from "p-np-patcher";
```

<br>

### Import in JavaScript
JavaScript
```javascript
const PNP = require("p-np-patcher");
```

<br>