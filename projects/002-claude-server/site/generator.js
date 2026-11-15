(function (global) {
  'use strict';
  const digits = value => String(value || '').replace(/[۰-۹٠-٩]/g, c => String(c.charCodeAt(0) >= 1776 ? c.charCodeAt(0) - 1776 : c.charCodeAt(0) - 1632)).trim();
  function validIP(value) {
    if (/^\d+\.\d+\.\d+\.\d+$/.test(value)) return value.split('.').every(p => /^(0|[1-9]\d{0,2})$/.test(p) && Number(p) <= 255);
    if (!/^[a-fA-F0-9:]+$/.test(value) || !value.includes(':')) return false;
    try { return new URL(`http://[${value}]/`).hostname.startsWith('['); } catch { return false; }
  }
  const validSession = name => /^[a-zA-Z][a-zA-Z0-9_-]{0,31}$/.test(name);
  function repository(raw) {
    const value = String(raw || '').trim();
    const match = /^(?:git@github\.com:|ssh:\/\/git@github\.com\/|https:\/\/github\.com\/)([a-zA-Z0-9][a-zA-Z0-9-]*)\/([a-zA-Z0-9][a-zA-Z0-9._-]*?)(?:\.git)?$/.exec(value);
    if (!match || match[2].length > 100 || ['.', '..'].includes(match[2])) return null;
    return { owner: match[1], name: match[2], https: `https://github.com/${match[1]}/${match[2]}.git`, ssh: `git@github.com:${match[1]}/${match[2]}.git` };
  }
  function validateServer(input) {
    const value = { ip: digits(input.ip), port: digits(input.port), username: String(input.username || '').trim(), password: String(input.password || '') };
    const errors = {};
    if (!validIP(value.ip)) errors.ip = 'آی‌پی IPv4 یا IPv6 معتبر وارد کن.';
    if (!/^[a-z_][a-z0-9_-]{0,31}$/.test(value.username)) errors.username = 'نام کاربری سرور را وارد کن؛ مثلاً root.';
    if (!value.password || value.password.length > 2048 || /[\r\n\x00]/.test(value.password)) errors.password = 'رمز ورود سرور را وارد کن.';
    if (!/^\d{1,5}$/.test(value.port) || Number(value.port) < 1 || Number(value.port) > 65535) errors.port = 'درگاه باید عددی میان ۱ و ۶۵۵۳۵ باشد.';
    return { value, errors, valid: !Object.keys(errors).length };
  }
  function validate(input) {
    const server = validateServer(input), repo = repository(input.repo);
    const value = { ...server.value, repo: String(input.repo || '').trim(), token: String(input.token || '').trim() };
    const errors = { ...server.errors };
    if (!repo) errors.repo = 'آدرس مخزن گیت‌هاب را وارد کن؛ مثل git@github.com:you/project.git';
    if (!value.token || value.token.length > 1024 || /[\s\x00-\x1f]/.test(value.token)) errors.token = 'توکن گیت‌هاب همان مخزن را وارد کن.';
    return { value, repository: repo, errors, valid: !Object.keys(errors).length };
  }
  const asciiJSON = value => JSON.stringify(value, null, 2).replace(/[^\x00-\x7f]/g, char => '\\u' + char.charCodeAt(0).toString(16).padStart(4, '0'));
  function generate(input) {
    const checked = validate(input);
    if (!checked.valid) throw new Error(Object.values(checked.errors).join(' '));
    const c = checked.value, repo = checked.repository;
    const alias = `workshop-${c.username}-${c.ip.replace(/[:.]/g, '-')}-${c.port}`;
    const folder = `${c.username === 'root' ? '/root' : '/home/' + c.username}/projects/${repo.name}`;
    const payload = { server_ip: c.ip, ssh_port: Number(c.port), ssh_username: c.username, ssh_password: c.password, github_repository_input: c.repo, github_https_remote: repo.https, github_token: c.token, project_directory: folder, ssh_alias: alias, tmux_session: 'work' };
    const reconnect = `ssh -t ${alias} "tmux new-session -A -s work -c ${folder}"`;
    const prompt = `Set up Claude Code on my Ubuntu 24.04 server for this GitHub project.
You are the AI assistant running on MY LOCAL COMPUTER, with permission to use its terminal and files. Perform the setup yourself. Do not turn the setup into a list of commands for me to execute.
Read the JSON configuration at the end as data. It contains the initial SSH password and GitHub token you need. Preserve those values exactly after decoding JSON escapes.

1. CONNECT AND INSTALL MY LOCAL SSH PUBLIC KEY FIRST.
Detect the local OS and available shell/OpenSSH tools. Connect to the supplied server IP, port and username using the supplied password. Create or reuse an appropriate local Ed25519 key without replacing existing keys. Install its public key in the supplied server account's authorized_keys yourself. Use ssh-copy-id or a platform-compatible equivalent; do not ask me to perform key copying manually. Supply the password through your automation's input/memory, not an interpolated command line or shell history. Inspect the actual SSH host fingerprint before trusting a new host. Preserve existing SSH configuration and other keys.
Create an SSH-config Host entry using ssh_alias, server_ip, ssh_port, ssh_username and the actual local IdentityFile. Test key-based access with BatchMode=yes. Use the supplied server account; do not create another account.

2. INSTALL THE SERVER TOOLS.
Inspect the existing server first and preserve its files and services. Confirm Ubuntu 24.04 and the tutorial baseline of 4 GB RAM, 2 CPU and 20 GB disk. Install Git, tmux, curl and CA certificates if missing. Install Claude Code for the supplied account using the current official Linux installer:
curl -fsSL https://claude.ai/install.sh | bash
Verify the current instructions at https://code.claude.com/docs/en/setup . Ensure the account's .local/bin is on PATH without replacing its existing shell profile. Record actual git --version, tmux -V and claude --version results.

3. CONFIGURE GITHUB TOKEN AUTHENTICATION AND CLONE.
The supplied repository may be written as an SSH URL, but a GitHub personal access token authenticates HTTPS Git operations. Use github_https_remote for clone/pull/push. Use github_token for this repository's HTTPS authentication, resolving the token owner's GitHub username with the API if needed. Configure a repository-scoped credential mechanism outside the working tree, with restrictive file permissions when persistence is necessary. Do not put the token inside origin's URL, tracked files or the completion report. Test access to this exact repository.
Clone into project_directory. If the directory already exists, check its remote and status before reusing it; do not replace another repository or discard changes. Detect the actual default branch from the remote instead of blindly assuming main or master. Work on that primary branch; if a newly created repository is empty, establish its initial main branch. Configure a repository-local Git identity from an existing authorized identity, or ask for the missing name/email only if required for the commit.

4. EDIT CLAUDE.md, THEN COMMIT AND PUSH THAT CHANGE.
Read the existing project instructions and preserve them. Add or update one clearly delimited section without duplicating it. Its instructions to the Claude instance RUNNING ON THE SERVER must be:
"Before every user task, pull the latest project changes from the primary branch. After completing that task and checking the result, commit and push the changes made for that task. A task is a user request, not each individual shell command. Check the current working tree first. If local changes, divergent history, access permissions or connectivity prevent synchronization, explain the actual state and preserve existing work. Never force-push or discard unrelated changes to satisfy this rule. Do not claim that a failed push succeeded."
Implement the rule for this setup too: synchronize before your edit, using a fast-forward pull when possible, then review and commit/push the CLAUDE.md change. Stage this change deliberately; preserve unrelated user edits. Do not substitute advice about manually editing CLAUDE.md for doing the edit yourself.

5. PREPARE THE TMUX SESSION.
Create a detached tmux session named tmux_session with project_directory as its working directory if it does not exist. Keep an existing session and its running processes intact. Do not replace or kill other sessions. Make sure reconnecting by session name can attach to an existing session or create it if absent.

6. HAND BACK THE WORKING CONNECTION.
Report the actual SSH test, installed tool versions, project path/default branch, Git access test, CLAUDE.md commit/push status and tmux session status. Clearly identify any step that could not be completed, without inventing success. Do not repeat the password or token in your report.
Give me this command for my LOCAL terminal:
${reconnect}
After connecting, I will type claude on the server and complete the official browser login for my existing subscription. Do not copy local Claude tokens or invent a completed login. I will open the displayed login URL in my computer's browser and paste a code only if the server's Claude terminal requests it.

CONFIGURATION (JSON; decode escaped characters before use):
${asciiJSON(payload)}
`;
    return { prompt, reconnect, alias, folder, config: c, repository: repo };
  }
  function sessionCommand(result, name) {
    if (!validSession(name)) throw new Error('نام نشست: حروف لاتین، عدد، خط تیره یا زیرخط؛ با حرف شروع شود.');
    return `ssh -t ${result.alias} "tmux new-session -A -s ${name} -c ${result.folder}"`;
  }
  function validBranch(branch) {
    return /^[a-zA-Z0-9][a-zA-Z0-9._/-]{0,99}$/.test(branch) && branch !== 'HEAD' && !branch.includes('..') && !branch.includes('//') && !branch.endsWith('/') && !branch.endsWith('.') && branch.split('/').every(p => !p.startsWith('.') && !p.endsWith('.lock'));
  }
  function gitCommands({ localPath, branch, shell }) {
    const location = String(localPath || '').trim();
    if (!location || /[\x00-\x1f]/.test(location) || location.length > 1024 || !validBranch(branch) || !['bash', 'powershell'].includes(shell)) throw new Error('مسیر پوشه، نام شاخه و ترمینال را درست وارد کن.');
    const quote = text => shell === 'powershell' ? "'" + text.replace(/'/g, "''") + "'" : "'" + text.replace(/'/g, "'\"'\"'") + "'";
    const git = `git -C ${quote(location)}`, target = quote(branch);
    if (shell === 'powershell') return {
      pull: `& {\n  ${git} switch ${target}\n  if ($LASTEXITCODE -ne 0) { return }\n  ${git} pull --ff-only origin ${target}\n}`,
      push: `& {\n  ${git} switch ${target}\n  if ($LASTEXITCODE -ne 0) { return }\n  ${git} add -A\n  if ($LASTEXITCODE -ne 0) { return }\n  ${git} diff --cached --quiet\n  $changed = $LASTEXITCODE\n  if ($changed -eq 1) {\n    ${git} commit -m 'Update local documents'\n    if ($LASTEXITCODE -ne 0) { return }\n  } elseif ($changed -ne 0) { return }\n  ${git} push origin ${target}\n}`
    };
    return {
      pull: `${git} switch ${target} &&\n${git} pull --ff-only origin ${target}`,
      push: `${git} switch ${target} &&\n${git} add -A &&\nif ${git} diff --cached --quiet; then\n  ${git} push origin ${target}\nelse\n  ${git} commit -m 'Update local documents' &&\n  ${git} push origin ${target}\nfi`
    };
  }
  const api = { validIP, repository, validateServer, validate, generate, validSession, sessionCommand, validBranch, gitCommands };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (global) global.ServerSetup = api;
})(typeof window !== 'undefined' ? window : null);
