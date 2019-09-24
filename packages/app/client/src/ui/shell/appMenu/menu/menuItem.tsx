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

type MenuItemType = 'default' | 'toggle' | 'submenu' | 'separator';

export interface MenuItem {
  disabled?: boolean;
  items?: MenuItem[];
  label?: string;
  onClick?: () => void;
  type?: MenuItemType;
}

export interface MenuItemProps extends MenuItem {
  focusHandler: (index: number) => (ref: HTMLLIElement) => void;
  index: number;
}

/** Just a basic menu item (Checkbox / Separator / Default) */
export class MenuItemComp extends React.Component<MenuItemProps, {}> {
  public render(): React.ReactNode {
    const { focusHandler, index, label, onClick, type = 'default' } = this.props;

    switch (type) {
      case 'separator':
        return <li className={styles.menuSeparator}></li>;

      // TODO: define checkbox
      case 'toggle':
      default:
        return (
          <li
            className={styles.menuItem}
            onClick={onClick}
            onKeyDown={this.onKeyDown}
            ref={focusHandler(index)}
            role="menuitem"
            tabIndex={-1}
          >
            {label}
          </li>
        );
    }
  }

  private onKeyDown = (event: React.KeyboardEvent<HTMLLIElement>): void => {
    let { key } = event;
    key = key.toLowerCase();

    if (key === 'enter') {
      event.preventDefault();
      event.stopPropagation();
      this.props.onClick && this.props.onClick();
      document.body.dispatchEvent(new Event('MenuItemSelected'));
    }
  };
}
