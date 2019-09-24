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
import * as ReactDOM from 'react-dom';

import * as styles from '../appMenu.scss';

import { MenuItem, MenuItemComp } from './menuItem';
import { SubMenu } from './subMenu';

export interface MenuProps {
  anchorRef?: HTMLElement;
  items: MenuItem[];
  setMenuShowing: (showing: boolean) => void;
  showing?: boolean;
  topLevel?: boolean;
}

export interface MenuState {
  focusedIndex: number;
}

/** Menu that can be top-level, or spawned by a SubMenu */
export class Menu extends React.Component<MenuProps, MenuState> {
  constructor(props: MenuProps) {
    super(props);
    this.state = {
      focusedIndex: 0,
    };
  }

  public render(): React.ReactNode {
    const { items = [], showing, topLevel } = this.props;

    if (!showing) {
      return null;
    }

    const menuContent = (
      <ul
        aria-labelledby={this.menuButtonId}
        className={styles.menu}
        role="menu"
        style={this.menuPosition}
        onKeyDown={this.onKeyDown}
      >
        {items.map((item, index) => {
          if (item.type === 'submenu') {
            return (
              <SubMenu
                focusHandler={this.checkRefForFocus}
                index={index}
                items={item.items}
                label={item.label}
              ></SubMenu>
            );
          } else {
            return <MenuItemComp focusHandler={this.checkRefForFocus} index={index} {...item} />;
          }
        })}
      </ul>
    );

    if (topLevel) {
      return ReactDOM.createPortal(menuContent, document.body);
    } else {
      return menuContent;
    }
  }

  private get menuPosition() {
    const { anchorRef } = this.props;
    if (anchorRef) {
      const domRect = anchorRef.getBoundingClientRect();
      const top = domRect.bottom;
      const left = domRect.left;
      return { top, left };
    }
    return undefined;
  }

  private get menuButtonId(): string {
    const { anchorRef } = this.props;
    if (anchorRef) {
      return anchorRef.getAttribute('id');
    }
    return '';
  }

  private focusPreviousItem(): void {
    const { items = [] } = this.props;
    const numItems = items.length;
    const focusableItems = items.filter(item => item.type !== 'separator');
    if (!numItems || !focusableItems.length) {
      // nothing to focus
      return;
    }
    // search for the previous focusable item and focus it
    const { focusedIndex } = this.state;
    let index = focusedIndex;
    let foundItem;
    while (!foundItem) {
      if (index === 0) {
        // start from the back of the array
        index = numItems - 1;
      } else {
        // start from the current index
        --index;
      }
      if (items[index].type !== 'separator') {
        foundItem = true;
      }
    }
    this.setState({ focusedIndex: index });
  }

  private focusNextItem(): void {
    const { items = [] } = this.props;
    const numItems = items.length;
    const focusableItems = items.filter(item => item.type !== 'separator');
    if (!numItems || !focusableItems.length) {
      // nothing to focus
      return;
    }
    // search for the next focusable item and focus it
    const { focusedIndex } = this.state;
    let index = focusedIndex;
    let foundItem;
    while (!foundItem) {
      if (index === numItems - 1) {
        // start from the front of the array
        index = 0;
      } else {
        // start from the current index
        ++index;
      }
      if (items[index].type !== 'separator') {
        foundItem = true;
      }
    }
    this.setState({ focusedIndex: index });
  }

  private checkRefForFocus = (index: number) => (ref: HTMLLIElement): void => {
    if (ref && index === this.state.focusedIndex) {
      ref.focus();
    }
  };

  private onKeyDown = (e: React.KeyboardEvent<HTMLUListElement>): void => {
    let { key = '' } = e;
    key = key.toLowerCase();

    switch (key) {
      case 'arrowdown':
        e.stopPropagation();
        this.focusNextItem();
        break;

      case 'arrowup':
        e.stopPropagation();
        this.focusPreviousItem();
        break;

      case 'escape':
        // don't want closing a submenu to close a top-level menu
        e.stopPropagation();
        this.closeMenu();
        break;

      case 'enter':
        // let selecting an option bubble up to parent menu
        if (this.props.topLevel) {
          // don't let the click bubble up to the button or the menu will reopen
          e.preventDefault();
        }
        this.closeMenu();
        break;

      case 'tab':
        if (e.shiftKey) {
          // closeMenu() already re-focuses the caret button,
          // so we want to prevent the default behavior which
          // would shift focus to whatever is before the caret button
          e.preventDefault();
        }
        this.closeMenu();
        break;

      default:
        break;
    }
  };

  private closeMenu(): void {
    if (this.props.anchorRef) {
      this.props.anchorRef.focus();
    }
    this.props.setMenuShowing(false);
  }
}
