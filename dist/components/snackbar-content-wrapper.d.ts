import { SvgIconComponent } from '@mui/icons-material';
import { AlertColor } from '@mui/material';
import * as React from 'react';
interface SnackbarContentWrapperProps {
    variant: AlertColor;
    message: string | JSX.Element;
    onClose(): void;
}
interface SnackbarContentWrapperState extends SnackbarContentWrapperProps {
    Icon: SvgIconComponent;
}
export declare class SnackbarContentWrapper extends React.PureComponent<SnackbarContentWrapperProps, SnackbarContentWrapperState> {
    #private;
    constructor(props: SnackbarContentWrapperProps);
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=snackbar-content-wrapper.d.ts.map