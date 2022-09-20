var _DropzoneDialog_instances, _DropzoneDialog_defaultProps, _DropzoneDialog_addFiles, _DropzoneDialog_deleteFile, _DropzoneDialog_handleClose, _DropzoneDialog_handleSave;
import { __classPrivateFieldGet } from "tslib";
import isEqual from 'lodash.isequal';
import merge from 'lodash.merge';
import * as React from 'react';
import { createFileFromUrl, readFile } from '../helpers';
import { DropzoneContext } from './dropzone-ctx';
import { DropzoneDialogBase } from './dropzone-dialog-base';
/**
 * This component provides an uncontrolled version of the DropzoneDialogBase component.
 *
 * It supports all the Props and Methods from `DropzoneDialogBase` but keeps the files state internally.
 *
 * **Note** The `onSave` handler also returns `File[]` with all the accepted files.
 */
export class DropzoneDialog extends React.PureComponent {
    constructor(props) {
        super(props);
        _DropzoneDialog_instances.add(this);
        _DropzoneDialog_defaultProps.set(this, {
            open: false,
            acceptedFiles: [],
            clearOnUnmount: true,
            filesLimit: 3,
            initialFiles: [],
            fileObjects: [],
            addFiles: (newFileObjects) => __classPrivateFieldGet(this, _DropzoneDialog_instances, "m", _DropzoneDialog_addFiles).call(this, newFileObjects),
            deleteFile: (removedFileObj, removedFileObjIdx) => __classPrivateFieldGet(this, _DropzoneDialog_instances, "m", _DropzoneDialog_deleteFile).call(this, removedFileObj, removedFileObjIdx),
            handleClose: (evt) => __classPrivateFieldGet(this, _DropzoneDialog_instances, "m", _DropzoneDialog_handleClose).call(this, evt),
            handleSave: (evt) => __classPrivateFieldGet(this, _DropzoneDialog_instances, "m", _DropzoneDialog_handleSave).call(this, evt),
        });
        this.state = merge(__classPrivateFieldGet(this, _DropzoneDialog_defaultProps, "f"), props);
    }
    componentDidMount() {
        const { initialFiles } = this.state;
        Promise.all(initialFiles.map(async (initialFile) => {
            const file = typeof initialFile === 'string'
                ? await createFileFromUrl(initialFile)
                : initialFile;
            const data = await readFile(file);
            return {
                file,
                data,
            };
        }))
            .then((fileObjs) => {
            const { fileObjects } = this.state;
            if (fileObjs.length > 0) {
                this.setState({
                    fileObjects: [...fileObjects, ...fileObjs],
                });
            }
            return true;
        })
            .catch((error) => {
            // we might want to show the user something?
            console.error(error);
        });
    }
    componentWillUnmount() {
        const { clearOnUnmount } = this.state;
        if (clearOnUnmount) {
            this.setState({
                fileObjects: [],
            });
        }
    }
    componentDidUpdate(prevProps) {
        const props = this.props;
        if (!isEqual(prevProps, props)) {
            this.setState(merge(__classPrivateFieldGet(this, _DropzoneDialog_defaultProps, "f"), props));
        }
    }
    render() {
        const { fileObjects, addFiles, deleteFile, handleClose, handleSave } = this.state;
        return (React.createElement(DropzoneContext.Provider, { value: {
                fileObjects,
                addFiles,
                deleteFile,
                handleClose,
                handleSave,
            } },
            React.createElement(DropzoneDialogBase, { ...this.state })));
    }
}
_DropzoneDialog_defaultProps = new WeakMap(), _DropzoneDialog_instances = new WeakSet(), _DropzoneDialog_addFiles = function _DropzoneDialog_addFiles(newFileObjects) {
    const { filesLimit, fileObjects, onAdd } = this.state;
    if (onAdd) {
        onAdd(fileObjects);
    }
    this.setState({
        fileObjects: filesLimit <= 1
            ? [newFileObjects[0]]
            : [...fileObjects, ...newFileObjects],
    });
}, _DropzoneDialog_deleteFile = function _DropzoneDialog_deleteFile(removedFileObj, removedFileObjIdx) {
    const { fileObjects, onDelete } = this.state;
    // Calculate remaining fileObjects array
    const remainingFileObjs = fileObjects.filter((_fileObject, i) => i !== removedFileObjIdx);
    // Notify removed file
    if (onDelete) {
        onDelete(removedFileObj, removedFileObjIdx);
    }
    // Update local state
    this.setState({
        fileObjects: remainingFileObjs,
    });
}, _DropzoneDialog_handleClose = function _DropzoneDialog_handleClose(evt) {
    const { clearOnUnmount, onClose } = this.state;
    if (onClose) {
        onClose(evt);
    }
    if (clearOnUnmount) {
        this.setState({
            fileObjects: [],
        });
    }
}, _DropzoneDialog_handleSave = function _DropzoneDialog_handleSave(evt) {
    const { clearOnUnmount, fileObjects, onSave } = this.state;
    if (onSave) {
        onSave(fileObjects.map((fileObject) => fileObject.file), evt);
    }
    if (clearOnUnmount) {
        this.setState({
            fileObjects: [],
        });
    }
};
//# sourceMappingURL=dropzone-dialog.js.map