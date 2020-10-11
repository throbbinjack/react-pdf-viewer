/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { ReactElement } from 'react';
import { createStore, Plugin, PluginFunctions } from '@react-pdf-viewer/core';

import ScrollMode from './ScrollMode';
import StoreProps from './StoreProps';
import SwitchScrollMode, { SwitchScrollModeProps } from './SwitchScrollMode';
import SwitchScrollModeButton from './SwitchScrollModeButton';
import SwitchScrollModeMenuItem from './SwitchScrollModeMenuItem';

export interface SwitchScrollModeButtonProps {
    mode: ScrollMode;
}

export interface SwitchScrollModeMenuItemProps {
    mode: ScrollMode;
    onClick(): void;
}

interface ScrollModePlugin extends Plugin {
    SwitchScrollMode(props: SwitchScrollModeProps): ReactElement;
    SwitchScrollModeButton(props: SwitchScrollModeButtonProps): ReactElement;
    SwitchScrollModeMenuItem(props: SwitchScrollModeMenuItemProps): ReactElement;
}

const scrollModePlugin = (): ScrollModePlugin => {
    const store = createStore<StoreProps>({
        scrollMode: ScrollMode.Vertical,
    });

    const SwitchScrollModeDecorator = (props: SwitchScrollModeProps) => (
        <SwitchScrollMode {...props} store={store} />
    );

    const SwitchScrollModeButtonDecorator = (props: SwitchScrollModeButtonProps) => (
        <SwitchScrollModeDecorator mode={props.mode}>
            {
                (p) => (
                    <SwitchScrollModeButton
                        isSelected={p.isSelected}
                        mode={p.mode}
                        onClick={() => { p.onClick(); }}
                    />
                )
            }
        </SwitchScrollModeDecorator>
    );

    const SwitchScrollModeMenuItemDecorator = (props: SwitchScrollModeMenuItemProps) => (
        <SwitchScrollModeDecorator mode={props.mode}>
            {
                (p) => (
                    <SwitchScrollModeMenuItem
                        isSelected={p.isSelected}
                        mode={p.mode}
                        onClick={() => { p.onClick(); props.onClick(); }}
                    />
                )
            }
        </SwitchScrollModeDecorator>
    );

    return {
        install: (pluginFunctions: PluginFunctions) => {
            store.update('getPagesRef', pluginFunctions.getPagesRef);
        },
        SwitchScrollMode: SwitchScrollModeDecorator,
        SwitchScrollModeButton: SwitchScrollModeButtonDecorator,
        SwitchScrollModeMenuItem: SwitchScrollModeMenuItemDecorator,
    };
};

export default scrollModePlugin;
