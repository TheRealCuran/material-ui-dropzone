var _DropzoneAreaBaseImpl_instances, _DropzoneAreaBaseImpl_defaultGetPreviewIcon, _DropzoneAreaBaseImpl_defaultProps, _DropzoneAreaBaseImpl_defaultSnackbarAnchorOrigin, _DropzoneAreaBaseImpl_notifyAlert;
import { __classPrivateFieldGet } from "tslib";
/* eslint-disable node/no-unsupported-features/es-builtins */
import * as React from 'react';
import { Button, Snackbar, styled, Typography, } from '@mui/material';
import { AttachFile, CloudUpload } from '@mui/icons-material';
import clsx from 'clsx';
import merge from 'lodash.merge';
import isEqual from 'lodash.isequal';
import Dropzone from 'react-dropzone';
import { convertBytesToMbsOrKbs, isImage, readFile } from '../helpers';
import { PreviewList } from './preview-list';
import { SnackbarContentWrapper } from './snackbar-content-wrapper';
/**
 * This components creates a Material-UI Dropzone, with previews and snackbar notifications.
 */
class DropzoneAreaBaseImpl extends React.PureComponent {
    constructor(props) {
        super(props);
        _DropzoneAreaBaseImpl_instances.add(this);
        _DropzoneAreaBaseImpl_defaultProps.set(this, {
            acceptedFiles: [],
            filesLimit: 3,
            fileObjects: [],
            maxFileSize: 3000000,
            dropzoneText: 'Drag and drop a file here or click',
            previewText: 'Preview:',
            disableRejectionFeedback: false,
            showPreviews: false,
            showPreviewsInDropzone: true,
            showFileNames: false,
            showFileNamesInPreview: false,
            useChipsForPreview: false,
            previewChipProps: {},
            previewGridProps: {},
            reset: undefined,
            showAlerts: true,
            alertSnackbarProps: {
                anchorOrigin: {
                    horizontal: 'left',
                    vertical: 'bottom',
                },
                autoHideDuration: 6000,
            },
            getFileLimitExceedMessage: (filesLimit) => `Maximum allowed number of files exceeded. Only ${filesLimit} allowed`,
            getFileAddedMessage: (fileName) => `File ${fileName} successfully added.`,
            getPreviewIcon: __classPrivateFieldGet(this, _DropzoneAreaBaseImpl_instances, "m", _DropzoneAreaBaseImpl_defaultGetPreviewIcon).bind(this),
            getFileRemovedMessage: (fileName) => `File ${fileName} removed.`,
            getDropRejectMessage: (rejectedFile, acceptedFiles, maxFileSize) => {
                let message = `File ${rejectedFile.name} was rejected. `;
                if (!acceptedFiles.includes(rejectedFile.type)) {
                    message += 'File type not supported. ';
                }
                if (rejectedFile.size > maxFileSize) {
                    message += `File is too big. Size limit is ${convertBytesToMbsOrKbs(maxFileSize)}. `;
                }
                return message;
            },
            openSnackBar: false,
            snackbarMessage: '',
            snackbarVariant: 'success',
        });
        _DropzoneAreaBaseImpl_defaultSnackbarAnchorOrigin.set(this, {
            horizontal: 'left',
            vertical: 'bottom',
        });
        this.state = merge(__classPrivateFieldGet(this, _DropzoneAreaBaseImpl_defaultProps, "f"), props);
    }
    // eslint-disable-next-line sonarjs/cognitive-complexity
    handleDropAccepted(acceptedFiles, evt) {
        const { fileObjects, filesLimit, getFileAddedMessage, getFileLimitExceedMessage, onAdd, onDrop, } = this.state;
        if (filesLimit > 1 &&
            fileObjects.length + acceptedFiles.length > filesLimit) {
            this.setState({
                openSnackBar: true,
                snackbarMessage: getFileLimitExceedMessage(filesLimit),
                snackbarVariant: 'error',
            }, __classPrivateFieldGet(this, _DropzoneAreaBaseImpl_instances, "m", _DropzoneAreaBaseImpl_notifyAlert).bind(this));
            return;
        }
        // Notify Drop event
        if (onDrop) {
            onDrop(acceptedFiles, evt);
        }
        Promise.all(acceptedFiles.map(async (file) => {
            const data = await readFile(file);
            return {
                file,
                data,
            };
        }))
            .then((fileObjs) => {
            // Notify added files
            if (onAdd) {
                onAdd(fileObjs);
            }
            // Display message
            const message = fileObjs.reduce((msg, fileObj) => msg + getFileAddedMessage(fileObj.file.name), '');
            this.setState({
                openSnackBar: true,
                snackbarMessage: message,
                snackbarVariant: 'success',
            }, __classPrivateFieldGet(this, _DropzoneAreaBaseImpl_instances, "m", _DropzoneAreaBaseImpl_notifyAlert).bind(this));
            return true;
        })
            .catch((error) => {
            let msg = 'Unknown error';
            if (error instanceof Error) {
                msg = error.message;
            }
            this.setState({
                openSnackBar: true,
                snackbarMessage: msg,
                snackbarVariant: 'error',
            }, __classPrivateFieldGet(this, _DropzoneAreaBaseImpl_instances, "m", _DropzoneAreaBaseImpl_notifyAlert).bind(this));
        });
    }
    handleDropRejected(rejectedFiles, evt) {
        const { acceptedFiles, filesLimit, fileObjects, getDropRejectMessage, getFileLimitExceedMessage, maxFileSize, onDropRejected, } = this.state;
        let message = '';
        if (fileObjects.length + rejectedFiles.length > filesLimit) {
            message = getFileLimitExceedMessage(filesLimit);
        }
        else {
            rejectedFiles.forEach((rejectedFile) => {
                message = getDropRejectMessage(rejectedFile.file, acceptedFiles, maxFileSize);
            });
        }
        if (onDropRejected) {
            onDropRejected(rejectedFiles.map((rejFil) => rejFil.file), evt);
        }
        this.setState({
            openSnackBar: true,
            snackbarMessage: message,
            snackbarVariant: 'error',
        }, __classPrivateFieldGet(this, _DropzoneAreaBaseImpl_instances, "m", _DropzoneAreaBaseImpl_notifyAlert).bind(this));
    }
    handleRemove(fileIndex, evt) {
        evt.stopPropagation();
        const { fileObjects, getFileRemovedMessage, onDelete } = this.state;
        // Find removed fileObject
        const removedFileObj = fileObjects[fileIndex];
        // Notify removed file
        if (onDelete) {
            onDelete(removedFileObj, fileIndex);
        }
        this.setState({
            openSnackBar: true,
            snackbarMessage: getFileRemovedMessage(removedFileObj.file.name),
            snackbarVariant: 'info',
        }, __classPrivateFieldGet(this, _DropzoneAreaBaseImpl_instances, "m", _DropzoneAreaBaseImpl_notifyAlert).bind(this));
    }
    handleCloseSnackbar() {
        this.setState({
            openSnackBar: false,
        });
    }
    componentDidUpdate(prevProps) {
        const props = this.props;
        if (!isEqual(prevProps, props)) {
            this.setState(merge(__classPrivateFieldGet(this, _DropzoneAreaBaseImpl_defaultProps, "f"), props));
        }
    }
    // eslint-disable-next-line sonarjs/cognitive-complexity
    render() {
        const { acceptedFiles, alertSnackbarProps, disableRejectionFeedback, dropzoneProps, dropzoneText, fileObjects, filesLimit, getPreviewIcon, Icon, inputProps, maxFileSize, previewChipProps, previewGridProps, previewText, showAlerts, showFileNames, showFileNamesInPreview, showPreviews, showPreviewsInDropzone, useChipsForPreview, reset, openSnackBar, snackbarMessage, snackbarVariant, } = this.state;
        const acceptFiles = Object.fromEntries(acceptedFiles.map((key) => [key, []]));
        const isMultiple = filesLimit > 1;
        const previewsVisible = showPreviews && fileObjects.length > 0;
        const previewsInDropzoneVisible = showPreviewsInDropzone && fileObjects.length > 0;
        return (React.createElement(React.Fragment, null,
            React.createElement(Dropzone, { ...dropzoneProps, accept: acceptFiles, onDropAccepted: (files, evt) => this.handleDropAccepted(files, evt), onDropRejected: (fileRejections, evt) => this.handleDropRejected(fileRejections, evt), maxSize: maxFileSize, multiple: isMultiple }, ({ getRootProps, getInputProps, isDragActive, isDragReject }) => (React.createElement("div", { ...getRootProps({
                    className: clsx('DropzoneAreaBase-root', {
                        'DropzoneAreaBase-active': isDragActive,
                        'DropzoneAreaBase-invalid': !disableRejectionFeedback && isDragReject,
                    }),
                }) },
                React.createElement("input", { ...getInputProps(inputProps) }),
                React.createElement("div", { className: clsx('DropzoneAreaBase-title') },
                    React.createElement(Typography, { variant: "h5", component: "p", className: clsx('MuiTypography-root', 'DropzoneAreaBase-titletxt') }, dropzoneText),
                    Icon ? (React.createElement(Icon, { className: clsx('MuiSvgIcon-root', 'DropzoneAreaBase-icon') })) : (React.createElement(CloudUpload, { className: clsx('MuiSvgIcon-root', 'DropzoneAreaBase-icon') }))),
                previewsInDropzoneVisible && (React.createElement(PreviewList, { fileObjects: fileObjects, handleRemove: (idx, evt) => this.handleRemove(idx, evt), getPreviewIcon: getPreviewIcon, showFileNames: showFileNames, useChipsForPreview: useChipsForPreview, previewChipProps: previewChipProps, previewGridProps: previewGridProps }))))),
            reset &&
                (React.isValidElement(reset) ? (reset) : (React.createElement(Button, { onClick: (evt) => {
                        if (typeof reset === 'object' && 'onClick' in reset) {
                            reset.onClick(evt);
                        }
                    }, variant: "outlined", className: clsx('MuiButton-root', 'DropzoneAreaBase-resetButton') }, typeof reset === 'object' && 'text' in reset
                    ? reset.text
                    : 'reset'))),
            previewsVisible && (React.createElement(React.Fragment, null,
                React.createElement(Typography, { variant: "subtitle1", component: "span" }, previewText),
                React.createElement(PreviewList, { fileObjects: fileObjects, handleRemove: (idx, evt) => this.handleRemove(idx, evt), getPreviewIcon: getPreviewIcon, showFileNames: showFileNamesInPreview, useChipsForPreview: useChipsForPreview, previewChipProps: previewChipProps, previewGridProps: previewGridProps }))),
            ((typeof showAlerts === 'boolean' && showAlerts) ||
                (Array.isArray(showAlerts) &&
                    showAlerts.includes(snackbarVariant))) && (React.createElement(Snackbar, { anchorOrigin: __classPrivateFieldGet(this, _DropzoneAreaBaseImpl_defaultSnackbarAnchorOrigin, "f"), autoHideDuration: 6000, ...alertSnackbarProps, open: openSnackBar, onClose: () => this.handleCloseSnackbar() },
                React.createElement(SnackbarContentWrapper, { onClose: () => this.handleCloseSnackbar(), variant: snackbarVariant, message: snackbarMessage })))));
    }
}
_DropzoneAreaBaseImpl_defaultProps = new WeakMap(), _DropzoneAreaBaseImpl_defaultSnackbarAnchorOrigin = new WeakMap(), _DropzoneAreaBaseImpl_instances = new WeakSet(), _DropzoneAreaBaseImpl_defaultGetPreviewIcon = function _DropzoneAreaBaseImpl_defaultGetPreviewIcon(fileObject) {
    if (isImage(fileObject.file) && fileObject.data !== null) {
        return React.createElement("img", { role: "presentation", src: fileObject.data });
    }
    return React.createElement(AttachFile, null);
}, _DropzoneAreaBaseImpl_notifyAlert = function _DropzoneAreaBaseImpl_notifyAlert() {
    const { openSnackBar, snackbarMessage, snackbarVariant, onAlert } = this.state;
    if (openSnackBar && onAlert) {
        onAlert(snackbarMessage, snackbarVariant);
    }
};
export const DropzoneAreaBase = styled(DropzoneAreaBaseImpl, {
    name: 'DropzoneAreaBase',
    slot: 'Root',
})(({ theme }) => ({
    '@keyframes progress': {
        '0%': {
            backgroundPosition: '0 0',
        },
        '100%': {
            backgroundPosition: '-70px 0',
        },
    },
    position: 'relative',
    width: '100%',
    minHeight: '250px',
    backgroundColor: theme.palette.background.paper,
    border: 'dashed',
    borderColor: theme.palette.divider,
    borderRadius: theme.shape.borderRadius,
    boxSizing: 'border-box',
    cursor: 'pointer',
    overflow: 'hidden',
    '&.DropzoneAreaBase-active': {
        animation: '$progress 2s linear infinite !important',
        backgroundImage: `repeating-linear-gradient(-45deg, ${theme.palette.background.paper}, ${theme.palette.background.paper} 25px, ${theme.palette.divider} 25px, ${theme.palette.divider} 50px)`,
        backgroundSize: '150% 100%',
        border: 'solid',
        borderColor: theme.palette.primary.light,
    },
    '&.DropzoneAreaBase-invalid': {
        backgroundImage: `repeating-linear-gradient(-45deg, ${theme.palette.error.light}, ${theme.palette.error.light} 25px, ${theme.palette.error.dark} 25px, ${theme.palette.error.dark} 50px)`,
        borderColor: theme.palette.error.main,
    },
    '& .DropzoneAreaBase-icon': {
        width: 51,
        height: 51,
        color: theme.palette.text.primary,
    },
    '& .DropzoneAreaBase-resetButton': {
        display: 'block',
        margin: '10px 0',
    },
    '& .DropzoneAreaBase-title': {
        textAlign: 'center',
    },
    '& .DropzoneAreaBase-titletxt': {
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        marginBottom: theme.spacing(3),
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        marginTop: theme.spacing(3),
    },
}));
//# sourceMappingURL=dropzone-area-base.js.map