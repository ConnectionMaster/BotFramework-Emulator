//
// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license.
//
// Microsoft Bot Framework: http://botframework.com
//
// Bot Framework Emulator Github:
// https://github.com/Microsoft/BotFramwork-Emulator
//
// Copyright (c) Microsoft Corporation
// All rights reserved.
//
// MIT License:
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED ""AS IS"", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//

import { CommandServiceInstance, CommandServiceImpl } from '@bfemulator/sdk-shared';
import { SharedConstants } from '@bfemulator/app-shared';
import { remote } from 'electron';

import { MenuItem } from './menu/menuItem';

const {
  Channels: { HelpLabel, ReadmeUrl },
  Commands: {
    Electron: { OpenExternal, ShowMessageBox },
    Emulator: {
      SendConversationUpdateUserAdded,
      SendConversationUpdateUserRemoved,
      SendBotContactAdded,
      SendBotContactRemoved,
      SendTyping,
      SendPing,
      SendDeleteUserData,
    },
    UI: { ShowMarkdownPage, ShowOpenBotDialog, ShowWelcomePage },
  },
} = SharedConstants;

export class AppMenuTemplate {
  @CommandServiceInstance()
  private static commandService: CommandServiceImpl;

  public static get template(): { [key: string]: MenuItem[] } {
    return {
      file: this.fileMenu,
      debug: this.debugMenu,
      edit: this.editMenu,
      view: this.viewMenu,
      conversation: this.conversationMenu,
      help: this.helpMenu,
    };
  }

  private static get fileMenu(): MenuItem[] {
    return [
      { label: 'New bot config...' },
      { type: 'separator' },
      { label: 'Open bot' },
      {
        label: 'Open recent',
        type: 'submenu',
        items: [], // will be populated later
      },
      { type: 'separator' },
      { label: 'Open Transcript' },
      { type: 'separator' },
      { label: 'Close tab' },
      { type: 'separator' },
      { label: 'Sign in with Azure' },
      { label: 'Clear state' },
      { type: 'separator' },
      {
        label: 'Themes',
        type: 'submenu',
        items: [], // will be populated later
      },
      { type: 'separator' },
      { label: 'Copy Emulator service URL' },
      { type: 'separator' },
      { label: 'Exit' },
    ];
  }

  private static get debugMenu(): MenuItem[] {
    return [{ label: 'Start Debugging', onClick: () => AppMenuTemplate.commandService.call(ShowOpenBotDialog, true) }];
  }

  private static get editMenu(): MenuItem[] {
    return [
      // TODO: keybinds
      { label: 'Undo', onClick: () => remote.getCurrentWebContents().undo() },
      { label: 'Redo', onClick: () => remote.getCurrentWebContents().redo() },
      { type: 'separator' },
      { label: 'Cut', onClick: () => remote.getCurrentWebContents().cut() },
      { label: 'Copy', onClick: () => remote.getCurrentWebContents().copy() },
      { label: 'Paste', onClick: () => remote.getCurrentWebContents().paste() },
      { label: 'Delete', onClick: () => remote.getCurrentWebContents().delete() },
    ];
  }

  private static get viewMenu(): MenuItem[] {
    // TODO: keybinds
    return [
      { label: 'Reset Zoom', onClick: () => remote.getCurrentWebContents().setZoomLevel(0) },
      // TODO: make sure we honor the threshold (disable if hit)
      {
        label: 'Zoom In',
        onClick: () => {
          const webContents = remote.getCurrentWebContents();
          webContents.getZoomFactor(zoomFactor => {
            webContents.setZoomFactor(zoomFactor + 0.1);
          });
        },
      },
      // TODO: make sure we honor the threshold (disable if hit)
      {
        label: 'Zoom Out',
        onClick: () => {
          const webContents = remote.getCurrentWebContents();
          webContents.getZoomFactor(zoomFactor => {
            webContents.setZoomFactor(zoomFactor - 0.1);
          });
        },
      },
      { type: 'separator' },
      // TODO: make sure we check if the app is full-screenable if necessary
      {
        label: 'Toggle Full Screen',
        onClick: () => {
          const currentWindow = remote.getCurrentWindow();
          currentWindow.setFullScreen(!currentWindow.isFullScreen());
        },
      },
      { label: 'Toggle Developer Tools', onClick: () => remote.getCurrentWebContents().toggleDevTools() },
    ];
  }

  private static get conversationMenu(): MenuItem[] {
    return [
      {
        label: 'Send System Activity',
        type: 'submenu',
        items: [
          {
            label: 'conversationUpdate ( user added )',
            onClick: () => AppMenuTemplate.commandService.remoteCall(SendConversationUpdateUserAdded),
          },
          {
            label: 'conversationUpdate ( user removed )',
            onClick: () => AppMenuTemplate.commandService.remoteCall(SendConversationUpdateUserRemoved),
          },
          {
            label: 'contactRelationUpdate ( bot added )',
            onClick: () => AppMenuTemplate.commandService.remoteCall(SendBotContactAdded),
          },
          {
            label: 'contactRelationUpdate ( bot removed )',
            onClick: () => AppMenuTemplate.commandService.remoteCall(SendBotContactRemoved),
          },
          {
            label: 'typing',
            onClick: () => AppMenuTemplate.commandService.remoteCall(SendTyping),
          },
          {
            label: 'ping',
            onClick: () => AppMenuTemplate.commandService.remoteCall(SendPing),
          },
          {
            label: 'deleteUserData',
            onClick: () => AppMenuTemplate.commandService.remoteCall(SendDeleteUserData),
          },
        ],
      },
    ];
  }

  private static get helpMenu(): MenuItem[] {
    const { openLink } = this;
    const appName = remote.app.getName();
    const appVersion = remote.app.getVersion();

    return [
      { label: 'Welcome', onClick: () => AppMenuTemplate.commandService.call(ShowWelcomePage) },
      { type: 'separator' },
      { label: 'Privacy', onClick: openLink('https://privacy.microsoft.com/privacystatement') },
      { label: 'License', onClick: openLink('https://aka.ms/bot-framework-emulator-license') },
      { label: 'Credits', onClick: openLink('https://aka.ms/bot-framework-emulator-credits') },
      { type: 'separator' },
      { label: 'Report an issue', onClick: openLink('https://aka.ms/cy106f') },
      { type: 'separator' },
      { label: 'Check for update...' },
      { type: 'separator' },
      {
        label: 'Get started with channels (Bot Inspector)',
        onClick: () => AppMenuTemplate.commandService.call(ShowMarkdownPage, ReadmeUrl, HelpLabel),
      },
      {
        label: 'About',
        onClick: () =>
          AppMenuTemplate.commandService.remoteCall(ShowMessageBox, null, {
            type: 'info',
            title: appName,
            message: appName + '\r\nversion: ' + appVersion,
            buttons: ['Dismiss'],
          }),
      },
    ];
  }

  private static openLink = (url: string) => (): void => {
    AppMenuTemplate.commandService.remoteCall(OpenExternal, url);
  };
}
