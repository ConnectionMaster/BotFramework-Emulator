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

import * as styles from '../appMenu.scss';

import { Menu } from './menu';
import { MenuItem } from './menuItem';

export interface SubMenuProps {
  focusHandler: (index: number) => (ref: HTMLLIElement) => void;
  index: number;
  items: MenuItem[];
  label: string;
}

export interface SubMenuState {
  menuShowing: boolean;
}

/** Represents a menu item that also opens a menu when hovered over */
export class SubMenu extends React.Component<SubMenuProps, SubMenuState> {
  constructor(props: SubMenuProps) {
    super(props);
    this.state = {
      menuShowing: false,
    };
  }

  public render(): React.ReactNode {
    // if the submenu is showing, temporarily disable focus management in parent menu
    const focusHandler = this.state.menuShowing ? undefined : this.props.focusHandler(this.props.index);

    return (
      <li
        className={styles.menuItem}
        onKeyDown={this.onKeyDown}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        ref={focusHandler}
        role="menuitem"
        tabIndex={-1}
      >
        {this.props.label}
        <span className={styles.submenuCaret} role="presentation">
          &gt;
        </span>
        <Menu setMenuShowing={this.setMenuShowing} showing={this.state.menuShowing} items={this.props.items}></Menu>
      </li>
    );
  }

  private onKeyDown = (event: React.KeyboardEvent<HTMLLIElement>): void => {
    let { key } = event;
    key = key.toLowerCase();

    switch (key) {
      case 'arrowright':
      case 'enter':
        event.preventDefault();
        event.stopPropagation();
        this.setMenuShowing(true);
        break;

      case 'arrowleft':
      case 'escape':
        event.preventDefault();
        this.setMenuShowing(false);
        break;

      default:
        break;
    }
  };

  private onMouseEnter = (): void => {
    this.setMenuShowing(true);
  };

  private onMouseLeave = (): void => {
    this.setMenuShowing(false);
  };

  private setMenuShowing = (showing: boolean): void => {
    this.setState({ menuShowing: showing });
  };
}
