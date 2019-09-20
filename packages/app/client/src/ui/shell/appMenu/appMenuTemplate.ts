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

import { MenuItem } from './appMenu';

export const appMenuTemplate: { [key: string]: MenuItem[] } = {
  file: [
    { label: 'New bot config...' },
    { type: 'separator' },
    { label: 'Open bot' },
    {
      label: 'Open recent',
      type: 'submenu',
      items: [{ label: 'bot1' }, { label: 'bot2' }, { label: 'bot3' }, { label: 'bot4' }, { label: 'bot5' }],
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
      items: [
        { label: 'Light', onClick: () => console.log('Selected light theme') },
        { label: 'Dark' },
        { label: 'High contrast' },
      ],
    },
    { type: 'separator' },
    { label: 'Copy Emulator service URL' },
    { type: 'separator' },
    { label: 'Exit' },
  ],
  debug: [{ label: 'Start Debugging' }],
  edit: [
    { label: 'Undo' },
    { label: 'Redo' },
    { type: 'separator' },
    { label: 'Cut' },
    { label: 'Copy' },
    { label: 'Paste' },
    { label: 'Delete' },
  ],
  view: [
    { label: 'Reset Zoom' },
    { label: 'Zoom In' },
    { label: 'Zoom Out' },
    { type: 'separator' },
    { label: 'Toggle Full Screen' },
    { label: 'Toggle Developer Tools' },
  ],
  conversation: [
    {
      label: 'Send System Activity',
      type: 'submenu',
      items: [{ label: 'Typing' }, { label: 'Coversation update' }, { label: 'Attachment' }],
    },
  ],
  help: [
    { label: 'Welcome' },
    { type: 'separator' },
    { label: 'Privacy' },
    { label: 'License' },
    { label: 'Credits' },
    { type: 'separator' },
    { label: 'Report an issue' },
    { type: 'separator' },
    { label: 'Check for update...' },
    { type: 'separator' },
    { label: 'Get started with channels (Bot Inspector)' },
    { label: 'About' },
  ],
};
