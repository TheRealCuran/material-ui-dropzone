var _SnackbarContentWrapper_variantIcon;
import { __classPrivateFieldGet } from "tslib";
import * as React from 'react';
import { IconButton, SnackbarContent, Typography, } from '@mui/material';
import { CheckCircle, Close, Error, Info, Warning, } from '@mui/icons-material';
export class SnackbarContentWrapper extends React.PureComponent {
    constructor(props) {
        super(props);
        _SnackbarContentWrapper_variantIcon.set(this, {
            success: CheckCircle,
            warning: Warning,
            error: Error,
            info: Info,
        });
        this.state = {
            ...props,
            Icon: __classPrivateFieldGet(this, _SnackbarContentWrapper_variantIcon, "f")[props.variant],
        };
    }
    render() {
        const { Icon, message, onClose } = this.state;
        return (React.createElement(SnackbarContent, { "aria-describedby": "client-snackbar", message: React.createElement(Typography, null,
                React.createElement(Icon, null),
                message), action: React.createElement(IconButton, { key: "close", "aria-label": "Close", color: "inherit", onClick: onClose },
                React.createElement(Close, null)) }));
    }
}
_SnackbarContentWrapper_variantIcon = new WeakMap();
// const styles = (theme) => ({
//   successAlert: {
//     backgroundColor: theme.palette.success.main,
//   },
//   errorAlert: {
//     backgroundColor: theme.palette.error.main,
//   },
//   infoAlert: {
//     backgroundColor: theme.palette.info.main,
//   },
//   warningAlert: {
//     backgroundColor: theme.palette.warning.main,
//   },
//   message: {
//     display: 'flex',
//     alignItems: 'center',
//     '& > svg': {
//       marginRight: theme.spacing(1),
//     },
//   },
//   icon: {
//     fontSize: 20,
//     opacity: 0.9,
//   },
//   closeButton: {},
// })
// export default withStyles(styles, { name: 'MuiDropzoneSnackbar' })(
//   SnackbarContentWrapper,
// )
//# sourceMappingURL=snackbar-content-wrapper.js.map