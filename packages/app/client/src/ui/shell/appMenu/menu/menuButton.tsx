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

import { Menu } from './menu';
import { MenuItem } from './menuItem';

export interface MenuButtonProps {
  className?: string;
  id?: string;
  items: MenuItem[];
  key?: string;
}

export interface MenuButtonState {
  menuShowing: boolean;
}

export class MenuButton extends React.Component<MenuButtonProps, MenuButtonState> {
  private buttonRef: HTMLButtonElement;
  private onMenuItemSelectedListener: () => void;

  constructor(props: MenuButtonProps) {
    super(props);

    this.state = {
      menuShowing: false,
    };
  }

  public componentDidMount(): void {
    this.onMenuItemSelectedListener = this.onMenuItemSelected.bind(this);
    document.body.addEventListener('MenuItemSelected', this.onMenuItemSelectedListener);
  }

  public componentWillUnmount(): void {
    document.body.removeEventListener('MenuItemSelected', this.onMenuItemSelectedListener);
  }

  public render(): React.ReactNode {
    const { buttonRef, onButtonClick, setMenuShowing } = this;
    const { className, id, items = [], key } = this.props;
    const { menuShowing } = this.state;

    return (
      <>
        <button
          aria-haspopup={true}
          aria-expanded={menuShowing}
          className={className}
          key={key}
          id={id}
          ref={this.setWrapperRef}
          onClick={onButtonClick}
        >
          {this.props.children}
        </button>
        <Menu
          anchorRef={buttonRef}
          items={items}
          key={key}
          topLevel={true}
          setMenuShowing={setMenuShowing}
          showing={menuShowing}
        />
      </>
    );
  }

  private onButtonClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    // TODO: necessary?
    event.stopPropagation();
    this.setMenuShowing(!this.state.menuShowing);
  };

  private setWrapperRef = (ref: HTMLButtonElement): void => {
    this.buttonRef = ref;
  };

  private setMenuShowing = (showing: boolean): void => {
    this.setState({ menuShowing: showing });
    if (!showing) {
      this.buttonRef.focus();
    }
  };

  private onMenuItemSelected(): void {
    if (this.state.menuShowing) {
      this.setMenuShowing(false);
    }
  }
}
