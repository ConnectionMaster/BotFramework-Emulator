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

import * as styles from './appMenu.scss';
import { appMenuTemplate } from './appMenuTemplate';

type MenuItemType = 'default' | 'toggle' | 'submenu' | 'separator';
export interface MenuItem {
  disabled?: boolean;
  items?: MenuItem[];
  label?: string;
  onClick?: () => void;
  type?: MenuItemType;
}

export interface AppMenuProps {}

export interface AppMenuState {
  menuItemsShowing: { [menuItem: string]: boolean };
}

export class AppMenu extends React.Component<AppMenuProps, AppMenuState> {
  private menuItemRefs: { [menuItem: string]: HTMLLIElement };
  private initialMenuState = {
    file: false,
    debug: false,
    edit: false,
    view: false,
    conversation: false,
    help: false,
  };

  constructor(props: AppMenuProps) {
    super(props);
    this.state = {
      menuItemsShowing: { ...this.initialMenuState },
    };
    this.menuItemRefs = {};
  }

  public render(): React.ReactNode {
    const { onClickMenuItem, setMenuItemRef } = this;
    const { menuItemsShowing } = this.state;

    return (
      <>
        <ul className={styles.appMenu}>
          {['File', 'Debug', 'Edit', 'View', 'Conversation', 'Help'].map(menuItem => {
            const menuItemKey = menuItem.toLowerCase();
            return (
              <li key={menuItemKey} ref={setMenuItemRef(menuItemKey)} onClick={onClickMenuItem(menuItemKey)}>
                {menuItem}
              </li>
            );
          })}
        </ul>
        {Object.keys(appMenuTemplate).map(menuItem => {
          return (
            <Menu
              anchorRef={this.menuItemRefs[menuItem]}
              items={appMenuTemplate[menuItem]}
              topLevel={true}
              showing={menuItemsShowing[menuItem]}
            />
          );
        })}
      </>
    );
  }

  private setMenuItemRef = (menuItem: string) => (ref: HTMLLIElement): void => {
    this.menuItemRefs[menuItem] = ref;
  };

  private onClickMenuItem = (menuItem: string) => (_event: React.MouseEvent<HTMLLIElement>): void => {
    this.setState({
      menuItemsShowing: { ...this.initialMenuState, [menuItem]: !this.state.menuItemsShowing[menuItem] },
    });
  };
}

export interface MenuAnchorPoints {
  top?: string;
  left?: string;
  bottom?: string;
  right?: string;
}
export interface MenuProps {
  anchorRef?: HTMLElement;
  items: MenuItem[];
  showing?: boolean;
  topLevel?: boolean;
}
/** Menu that can be top-level, or spawned by a SubMenu */
export class Menu extends React.Component<MenuProps, {}> {
  public render(): React.ReactNode {
    const { anchorRef, items = [], topLevel } = this.props;

    if (!this.props.showing) {
      return null;
    }

    const menuPosition = anchorRef ? this.getMenuPosition() : undefined;
    const menuContent = (
      <ul className={styles.menu} style={menuPosition}>
        {items.map(item => {
          if (item.type === 'submenu') {
            return <SubMenu items={item.items} label={item.label}></SubMenu>;
          } else {
            return <MenuItemComp {...item} />;
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

  private getMenuPosition() {
    const domRect = this.props.anchorRef.getBoundingClientRect();
    const top = domRect.bottom;
    const left = domRect.left;
    return { top, left };
  }
}

export interface SubMenuProps {
  items: MenuItem[];
  label: string;
}
export interface SubMenuState {
  showing: boolean;
}
/** Represents a menu item that also opens a menu when hovered over */
export class SubMenu extends React.Component<SubMenuProps, SubMenuState> {
  constructor(props: SubMenuProps) {
    super(props);
    this.state = {
      showing: false,
    };
  }

  public render(): React.ReactNode {
    return (
      <li className={styles.menuItem} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
        {this.props.label}
        <span className={styles.submenuCaret} role="presentation">
          &gt;
        </span>
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

/** Just a basic menu item (Checkbox / Separator / Default) */
export class MenuItemComp extends React.Component<MenuItem, {}> {
  public render(): React.ReactNode {
    const { label, onClick, type = 'default' } = this.props;

    switch (type) {
      case 'separator':
        return <li className={styles.menuSeparator}></li>;

      // TODO: define checkbox
      case 'toggle':
      default:
        return (
          <li className={styles.menuItem} onClick={onClick}>
            {label}
          </li>
        );
    }
  }
}
