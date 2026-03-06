import * as fs from 'fs';

/**
 * Git Graph Reword Main Script
 *
 * This script is invoked by git during interactive rebase when updating a non-HEAD commit message.
 * It handles two modes:
 *   - 'sequence': Modifies the rebase todo file, replacing 'pick' with 'reword' for the target commit.
 *   - 'message':  Writes the new commit message to the file provided by git.
 *
 * Environment variables consumed:
 *   VSCODE_GIT_GRAPH_REWORD_MODE     - 'sequence' or 'message'
 *   VSCODE_GIT_GRAPH_REWORD_HASH     - The abbreviated commit hash to reword (used in sequence mode)
 *   VSCODE_GIT_GRAPH_REWORD_MSG_FILE - Path to a temp file containing the new commit message (used in message mode)
 */
function main(): void {
	const filePath = process.argv[2];
	if (!filePath) {
		process.exit(1);
		return;
	}

	const mode = process.env['VSCODE_GIT_GRAPH_REWORD_MODE'];

	if (mode === 'sequence') {
		const hash = process.env['VSCODE_GIT_GRAPH_REWORD_HASH'];
		if (!hash) {
			process.exit(1);
			return;
		}
		const content = fs.readFileSync(filePath, 'utf8');
		// Replace 'pick <hash>[extra-hex-chars]' with 'reword <hash>[extra-hex-chars]'
		const newContent = content.replace(
			new RegExp('^pick (' + hash + '[0-9a-f]*)', 'm'),
			'reword $1'
		);
		fs.writeFileSync(filePath, newContent, 'utf8');
	} else if (mode === 'message') {
		const msgFile = process.env['VSCODE_GIT_GRAPH_REWORD_MSG_FILE'];
		if (!msgFile) {
			process.exit(1);
			return;
		}
		const message = fs.readFileSync(msgFile, 'utf8');
		fs.writeFileSync(filePath, message.trim() + '\n', 'utf8');
	}

	process.exit(0);
}

main();
