var _DropzoneDialogBase_defaultProps;
import { __classPrivateFieldGet } from "tslib";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, } from '@mui/material';
import isEqual from 'lodash.isequal';
import merge from 'lodash.merge';
import * as React from 'react';
import { DropzoneAreaBase } from './dropzone-area-base';
import { DropzoneContext } from './dropzone-ctx';
/**
 * This component provides the DropzoneArea inside of a Material-UI Dialog.
 *
 * It supports all the Props and Methods from `DropzoneAreaBase`.
 */
export class DropzoneDialogBase extends React.PureComponent {
    constructor(props) {
        super(props);
        _DropzoneDialogBase_defaultProps.set(this, {
            acceptedFiles: [],
            open: false,
            dialogTitle: 'Upload file',
            fullWidth: true,
            maxWidth: 'sm',
            cancelButtonText: 'Cancel',
            submitButtonText: 'Submit',
            showPreviews: true,
            showPreviewsInDropzone: false,
            showFileNamesInPreview: true,
        });
        this.state = merge(__classPrivateFieldGet(this, _DropzoneDialogBase_defaultProps, "f"), props);
    }
    componentDidUpdate(prevProps) {
        const props = this.props;
        if (!isEqual(prevProps, props)) {
            this.setState(merge(__classPrivateFieldGet(this, _DropzoneDialogBase_defaultProps, "f"), props));
        }
    }
    render() {
        const { cancelButtonText, dialogProps, dialogTitle, fullWidth, maxWidth, open, submitButtonText, ...dropzoneAreaProps } = this.state;
        const { fileObjects } = this.context;
        // Submit button state
        const submitDisabled = fileObjects === undefined || fileObjects.length === 0;
        return (React.createElement(Dialog, { ...dialogProps, fullWidth: fullWidth, maxWidth: maxWidth, onClose: (evt) => this.context.handleClose(evt), open: open },
            React.createElement(DialogTitle, null, dialogTitle),
            React.createElement(DialogContent, null,
                React.createElement(DropzoneAreaBase, { ...dropzoneAreaProps })),
            React.createElement(DialogActions, null,
                React.createElement(Button, { color: "primary", onClick: () => this.setState({ open: false }) }, cancelButtonText),
                React.createElement(Button, { color: "primary", disabled: submitDisabled, onClick: (evt) => this.context.handleSave(evt) }, submitButtonText))));
    }
}
_DropzoneDialogBase_defaultProps = new WeakMap();
DropzoneDialogBase.contextType = DropzoneContext;
//# sourceMappingURL=dropzone-dialog-base.js.map