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

import * as React from 'react';
import { BotInfo, SharedConstants, UpdateStatus } from '@bfemulator/app-shared';

import * as styles from './appMenu.scss';
import { AppMenuTemplate } from './appMenuTemplate';
import { MenuButton } from './menu/menuButton';
import { MenuItem } from './menu/menuItem';

export interface AppMenuProps {
  appUpdateStatus?: UpdateStatus;
  activeDocumentType?: string;
  availableThemes?: { name: string; href: string }[];
  checkForUpdates?: () => void;
  currentTheme?: string;
  openBot?: (path: string) => void;
  recentBots?: BotInfo[];
  switchTheme?: (themeName, themeHref) => void;
  quitAndInstall?: () => void;
}

export class AppMenu extends React.Component<AppMenuProps, {}> {
  private _menuTemplate: { [key: string]: MenuItem[] };

  constructor(props: AppMenuProps) {
    super(props);
    this._menuTemplate = AppMenuTemplate.template;
  }

  public render(): React.ReactNode {
    this._menuTemplate = this.updateMenu(this._menuTemplate);

    return (
      <ul className={styles.appMenu}>
        {['File', 'Debug', 'Edit', 'View', 'Conversation', 'Help'].map(menuItem => {
          const menuItemKey = menuItem.toLowerCase();

          return (
            <li key={menuItemKey}>
              <MenuButton className={styles.appMenuItem} items={this._menuTemplate[menuItemKey]}>
                {menuItem}
              </MenuButton>
            </li>
          );
        })}
      </ul>
    );
  }

  private updateMenu(template: { [key: string]: MenuItem[] }): { [key: string]: MenuItem[] } {
    const fileMenu = template['file'];
    fileMenu[12] = this.populateThemeMenu(fileMenu[12]);
    fileMenu[3] = this.populateRecentBotsMenu(fileMenu[3]);

    // disable / enable send conversation activities menu
    template['conversation'][0].disabled =
      this.props.activeDocumentType !== SharedConstants.ContentTypes.CONTENT_TYPE_LIVE_CHAT;

    template['help'][8] = this.getAppUpdateMenuItem();

    const newTemplate = { ...template };
    return newTemplate;
  }

  private populateThemeMenu(themeSubmenuItem: MenuItem): MenuItem {
    const { availableThemes, currentTheme } = this.props;
    if (!currentTheme || !availableThemes || !availableThemes.length) {
      return themeSubmenuItem;
    }
    const themes = [];
    availableThemes.forEach(theme => {
      const themeMenuItem: MenuItem = {
        label: theme.name,
        checked: theme.name === currentTheme,
        onClick: () => {
          // TODO: also trigger remember theme on main side somehow
          this.props.switchTheme(theme.name, theme.href);
        },
      };
      themes.push(themeMenuItem);
    });
    themeSubmenuItem.items = themes;
    return themeSubmenuItem;
  }

  private populateRecentBotsMenu(botsSubmenuItem: MenuItem): MenuItem {
    const { recentBots = [] } = this.props;
    const bots = [];
    recentBots.slice(0, 9).forEach(bot => {
      const botItem: MenuItem = {
        label: bot.displayName,
        onClick: () => {
          this.props.openBot(bot.path);
        },
      };
      bots.push(botItem);
    });
    botsSubmenuItem.items = bots;
    return botsSubmenuItem;
  }

  private getAppUpdateMenuItem(): MenuItem {
    const appUpdateStatus = this.props.appUpdateStatus;
    switch (appUpdateStatus) {
      case UpdateStatus.UpdateReadyToInstall:
        return {
          disabled: false,
          label: 'Restart to update...',
          onClick: () => this.props.quitAndInstall(),
        };

      case UpdateStatus.UpdateDownloading:
        return {
          disabled: true,
          label: 'Update downloading...',
        };

      case UpdateStatus.Idle:
      case UpdateStatus.UpdateAvailable:
      default:
        return {
          disabled: false,
          label: 'Check for update...',
          onClick: () => this.props.checkForUpdates(),
        };
    }
  }
}
