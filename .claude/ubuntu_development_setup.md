# Ubuntu 22.04 頂尖開發環境設定指南

## 核心理念：基於第一性原理的系統建構

身為頂尖軟體科學家，我們將從「第一性原理」出發，打造一個極致高效、穩定且可擴展的 Ubuntu 22.04 開發環境。

這套系統設計的核心思想是：**隔離、自動化、效率與可觀測性**。我們不直接污染主系統，而是透過各種管理器和容器化技術，為每個專案建立乾प्ट獨立且可重現的環境。

### 思考流程

1.  **開發的本質**：將思想轉化為可執行的程式碼。這需要高效的**撰寫**、獨立的**執行**環境、強大的**除錯**工具、可靠的**版本控制**以及確保所有環境的**一致性**。
2.  **效率最大化**：透過自動化、模糊搜尋、快捷鍵來**減少摩擦**；透過更快的工具鏈來**加速反饋**；並盡可能在終端機內完成所有工作，以保持**專注心流**。
3.  **系統的穩定與純淨**：
    *   **隔離原則**：絕不使用系統級別的語言套件（如 `apt` 安裝的 Python/Node.js）。
    *   **容器化優先**：所有外部依賴服務（資料庫、快取）一律使用 Docker 進行管理。

---

## 安裝確認工作分解結構 (WBS)

- [x] **階段一：核心系統與基礎工具** - 確保系統底層穩定與功能完整。
- [x] **階段二：終端機與 Shell 強化** - 打造高效的命令列操作環境。
- [x] **階段三：開發環境與版本管理** - 建立隔離且多樣化的語言執行環境。
- [x] **階段四：容器化與虛擬化** - 部署和管理外部服務依賴。

---

## 套件與工具安裝清單

### 1. 核心系統與基礎工具 (System & Core Utilities)

這些是系統的基石，確保你能編譯軟體、安全地管理套件以及從網路獲取資源。

- [x] **`build-essential`**: 編譯 C/C++ 程式碼的基礎套件，安裝許多其他軟體的依賴。是所有開發的起點。
  - *安裝*: `sudo apt update && sudo apt install -y build-essential`
- [x] **`curl`, `wget`, `git`**: `curl`/`wget` 是從網路下載檔案或腳本的必備工具。`git` 是現代軟體開發的標準版本控制系統。
  - *安裝*: `sudo apt install -y curl wget git`
- [x] **`htop`, `neofetch`**: `htop` 是強化的互動式行程檢視器，`neofetch` 用於快速顯示系統資訊。幫助你隨時觀測系統狀態。
  - *安裝*: `sudo apt install -y htop neofetch`
- [x] **`openssh-server`**: 允許你從遠端安全地連線到你的開發機，實現遠端開發或管理。
  - *安裝*: `sudo apt install -y openssh-server`
- [x] **`ufw`**: Uncomplicated Firewall，簡單好用的防火牆。安全是第一要務。
  - *安裝*: `sudo ufw enable` (啟用) & `sudo ufw allow ssh` (允許 SSH)
- [x] **`ca-certificates`**: 允許系統信任加密的 HTTPS 連線，是安全地從外部 Repository 下載軟體的基礎。
  - *安裝*: `sudo apt install -y ca-certificates`
- [x] **`vim`**: 高效的文字編輯器，是 Neovim 的前身，也是系統管理中快速編輯設定檔的必備工具。
  - *安裝*: `sudo apt install -y vim`
- [x] **`linux-firmware`**: 包含大量硬體裝置（Wi-Fi, 藍芽, 顯示卡等）的韌體檔案，安裝此套件有助於解決許多潛在的驅動程式問題。
  - *安裝*: `sudo apt install -y linux-firmware`
- [x] **`bluez` & `blueman`**: `bluez` 是官方的 Linux 藍芽協定堆疊。`blueman` 提供了一個功能更完整的藍芽圖形化管理工具。
  - *安裝*: `sudo apt install -y bluez blueman`

### 2. 終端機與 Shell 強化 (Terminal & Shell Enhancement)

終端機是科學家的實驗室，我們需要將其打造成最高效的資訊處理中心。

- [x] **Zsh + Oh My Zsh**: Zsh 是比 Bash 更強大的 Shell，提供更智能的自動補全、拼寫校正等功能。Oh My Zsh 則是一個 Zsh 設定管理框架，讓你輕鬆配置主題和插件。
  - *安裝*: `sudo apt install -y zsh`，然後 `sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"`
- [x] **`fzf`**: 命令列的模糊搜尋器（Fuzzy Finder）。徹底改變你尋找檔案 (`Ctrl+T`)、指令歷史 (`Ctrl+R`) 的方式。
  - *安裝*: `sudo apt install -y fzf`
- [x] **`ripgrep` (`rg`)**: 一個極度快速的程式碼搜尋工具，`grep` 的現代替代品。它預設會尊重 `.gitignore` 規則。
  - *安裝*: `sudo apt install -y ripgrep`
- [x] **`bat`**: `cat` 的現代替代品，提供語法高亮、行號和 Git 整合。
  - *安裝*: `sudo apt install -y bat` (可能需建立符號連結: `ln -s /usr/bin/batcat ~/.local/bin/bat`)
- [x] **`exa`**: `ls` 的現代替代品，提供更豐富的顏色、圖示、檔案資訊和樹狀檢視。
  - *安裝*: `sudo apt install -y exa`
- [x] **`tmux` / `zellij`**: 終端機多工器。允許在一個終端機視窗中建立多個面板和視窗，並保持 Session 不中斷。
  - *安裝*: `sudo apt install -y tmux`

### 3. 開發環境與版本管理 (Runtimes & Version Management)

**核心原則**：絕不使用 `apt` 安裝語言執行環境。永遠使用專業的版本管理器。

- [x] **Python**: 使用 `pyenv` 管理不同版本的 Python，搭配 `Poetry` 管理專案依賴。
  - *安裝*: 參考 [pyenv-installer](https://github.com/pyenv/pyenv-installer) 和 `curl -sSL https://install.python-poetry.org | python3 -`
- [x] **Node.js**: 使用 `nvm` (Node Version Manager) 管理多個 Node.js 版本。
  - *安裝*: 參考 [nvm 安裝腳本](https://github.com/nvm-sh/nvm#installing-and-updating)
- [x] **Go**: 使用官方 Go Toolchain，它自帶版本和套件管理。
  - *安裝*: 參考 [Go 官方文件](https://go.dev/doc/install)

### 4. 容器化與虛擬化 (Containerization & Virtualization)

**核心原則**：任何外部服務都應在容器中執行。

- [x] **Docker Engine**: 現代應用程式開發的基石，用於建立、執行和管理容器。
  - *安裝*: 遵循 [官方安裝文檔](https://docs.docker.com/engine/install/ubuntu/)
- [x] **Docker Compose**: 用於定義和執行多容器 Docker 應用程式的工具。
  - *安裝*: 通常會作為 Docker Engine 的一部分一起安裝。

### 5. 開發輔助工具 (Developer Utilities)

- [ ] **`ccusage`**: 一個 CLI 工具，用於分析 Claude Code/Codex 的使用量與成本。
  - *全域安裝*: `npm install -g ccusage` (注意：開發者建議使用 `npx ccusage@latest` 以確保總是執行最新版本)

---

## 總結

這套設定的核心是**分層**與**隔離**：
*   **系統層**保持最小化和穩定。
*   **工具層**強化你的 Shell，提升效率。
*   **環境層**透過版本管理器隔離不同語言。
*   **服務層**透過 Docker 容器化所有外部依賴。

這確保了無論您開發何種專案，都能在一個乾淨、獨立且高效的環境中進行，而不會互相干擾。
