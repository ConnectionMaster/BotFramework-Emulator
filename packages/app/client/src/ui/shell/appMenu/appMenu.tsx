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

import * as styles from './appMenu.scss';

type MenuItemType = 'default' | 'checkbox' | 'submenu' | 'separator';
interface MenuItem {
  disabled?: boolean;
  items?: MenuItem[];
  label?: string;
  type: MenuItemType;
}

const fileMenu: MenuItem[] = [
  { type: 'default', label: 'New bot config...' },
  { type: 'separator' },
  {
    label: 'Themes',
    type: 'submenu',
    items: [{ type: 'default', label: 'Light' }, { type: 'default', label: 'Dark' }],
  },
];

export interface AppMenuProps {}

export interface AppMenuState {}

export class AppMenu extends React.Component<AppMenuProps, AppMenuState> {
  public render(): React.ReactNode {
    return (
      <>
        <ul className={styles.appMenu}>
          <li>File</li>
          <li>Debug</li>
          <li>Edit</li>
          <li>View</li>
          <li>Conversation</li>
          <li>Help</li>
        </ul>
        <Menu items={fileMenu}></Menu>
      </>
    );
  }
}

export interface MenuProps {
  items: MenuItem[];
  showing?: boolean;
}
export interface MenuState {
  showing: boolean;
}
export class Menu extends React.Component<MenuProps, MenuState> {
  constructor(props: MenuProps) {
    super(props);
    this.state = {
      showing: true,
    };
  }

  public render(): React.ReactNode {
    const { items = [] } = this.props;

    if (!this.state.showing) {
      return null;
    }

    return (
      <ul className={styles.menu}>
        {items.map(item => {
          if (item.type === 'default') {
            return <MenuItem>{item.label}</MenuItem>;
          } else if (item.type === 'separator') {
            return <MenuItem>======</MenuItem>;
          } else if (item.type === 'submenu') {
            return <SubMenu items={item.items} label={item.label}></SubMenu>;
          }
        })}
      </ul>
    );
  }
}

export class SubMenu extends React.Component<MenuProps & { label: string }, MenuState> {
  constructor(props: any) {
    super(props);
    this.state = {
      showing: false,
    };
  }

  public render(): React.ReactNode {
    return (
      <li className={styles.menuItem} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
        {this.props.label}
        {this.state.showing && <Menu showing={this.state.showing} items={this.props.items}></Menu>}
      </li>
    );
  }

  public onMouseEnter = (): void => {
    this.setState({ showing: true });
  };

  public onMouseLeave = (): void => {
    this.setState({ showing: false });
  };
}

export const MenuItem = props => <li>{props.children}</li>;
