var _DropzoneDialogBase_defaultProps;
import { __classPrivateFieldGet } from "tslib";
import * as React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, } from '@mui/material';
import merge from 'lodash.merge';
import isEqual from 'lodash.isequal';
import { DropzoneAreaBase } from './dropzone-area-base';
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
        const { cancelButtonText, dialogProps, dialogTitle, fullWidth, maxWidth, onClose, onSave, open, submitButtonText, ...dropzoneAreaProps } = this.state;
        // Submit button state
        const submitDisabled = dropzoneAreaProps.fileObjects === undefined ||
            dropzoneAreaProps.fileObjects.length === 0;
        return (React.createElement(Dialog, { ...dialogProps, fullWidth: fullWidth, maxWidth: maxWidth, onClose: onClose, open: open },
            React.createElement(DialogTitle, null, dialogTitle),
            React.createElement(DialogContent, null,
                React.createElement(DropzoneAreaBase, { ...dropzoneAreaProps })),
            React.createElement(DialogActions, null,
                React.createElement(Button, { color: "primary", onClick: onClose }, cancelButtonText),
                React.createElement(Button, { color: "primary", disabled: submitDisabled, onClick: onSave }, submitButtonText))));
    }
}
_DropzoneDialogBase_defaultProps = new WeakMap();
//# sourceMappingURL=dropzone-dialog-base.js.map