import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('codepal.connect', () => {
      vscode.window.showInformationMessage('CodePal: Connect (stub)');
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand('codepal.codegen', () => {
      vscode.window.showInformationMessage('CodePal: Generate Code (stub)');
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand('codepal.review', () => {
      vscode.window.showInformationMessage('CodePal: Review Code (stub)');
    })
  );
}

export function deactivate() {} 