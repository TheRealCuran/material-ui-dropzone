var _DropzoneArea_instances, _DropzoneArea_defaultProps, _DropzoneArea_notifyFileChange, _DropzoneArea_addFiles, _DropzoneArea_deleteFile, _DropzoneArea_splitDropzoneAreaProps;
import { __classPrivateFieldGet } from "tslib";
import isEqual from 'lodash.isequal';
import merge from 'lodash.merge';
import * as React from 'react';
import { createFileFromUrl, readFile } from '../helpers';
import { DropzoneAreaBase } from './dropzone-area-base';
import { DropzoneContext } from './dropzone-ctx';
/**
 * This components creates an uncontrolled Material-UI Dropzone, with previews and snackbar notifications.
 *
 * It supports all props of `DropzoneAreaBase` but keeps the files state internally.
 *
 * **Note** To listen to file changes use `onChange` event handler and notice that `onDelete` returns a `File` instance instead of `FileObject`.
 */
export class DropzoneArea extends React.PureComponent {
    constructor(props) {
        super(props);
        _DropzoneArea_instances.add(this);
        _DropzoneArea_defaultProps.set(this, {
            acceptedFiles: [],
            clearOnUnmount: true,
            filesLimit: 3,
            initialFiles: [],
            fileObjects: [],
            addFiles: (newFileObjects) => __classPrivateFieldGet(this, _DropzoneArea_instances, "m", _DropzoneArea_addFiles).call(this, newFileObjects),
            deleteFile: (removedFileObj, removedFileObjIdx) => __classPrivateFieldGet(this, _DropzoneArea_instances, "m", _DropzoneArea_deleteFile).call(this, removedFileObj, removedFileObjIdx),
            // unused in the DropzoneArea, but it's easier to have them always defined
            handleClose: (_evt) => {
                return;
            },
            handleSave: (_evt) => {
                return;
            },
        });
        this.state = merge(__classPrivateFieldGet(this, _DropzoneArea_defaultProps, "f"), props);
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
            this.setState({
                fileObjects: [...fileObjects, ...fileObjs],
            }, __classPrivateFieldGet(this, _DropzoneArea_instances, "m", _DropzoneArea_notifyFileChange).bind(this));
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
            }, __classPrivateFieldGet(this, _DropzoneArea_instances, "m", _DropzoneArea_notifyFileChange).bind(this));
        }
    }
    componentDidUpdate(prevProps) {
        const props = this.props;
        if (!isEqual(prevProps, props)) {
            this.setState(merge(__classPrivateFieldGet(this, _DropzoneArea_defaultProps, "f"), props));
        }
    }
    render() {
        const { fileObjects, handleClose, handleSave, addFiles, deleteFile } = this.state;
        const splitProps = __classPrivateFieldGet(this, _DropzoneArea_instances, "m", _DropzoneArea_splitDropzoneAreaProps).call(this);
        return (React.createElement(DropzoneContext.Provider, { value: {
                fileObjects,
                handleClose,
                handleSave,
                addFiles,
                deleteFile,
            } },
            React.createElement(DropzoneAreaBase, { ...splitProps.dropzoneAreaProps })));
    }
}
_DropzoneArea_defaultProps = new WeakMap(), _DropzoneArea_instances = new WeakSet(), _DropzoneArea_notifyFileChange = function _DropzoneArea_notifyFileChange() {
    const { fileObjects, onChange } = this.state;
    if (onChange) {
        onChange(fileObjects.map((fileObject) => fileObject.file));
    }
}, _DropzoneArea_addFiles = function _DropzoneArea_addFiles(newFileObjects) {
    const { filesLimit, fileObjects } = this.state;
    this.setState({
        fileObjects: filesLimit <= 1
            ? [newFileObjects[0]]
            : [...fileObjects, ...newFileObjects],
    }, __classPrivateFieldGet(this, _DropzoneArea_instances, "m", _DropzoneArea_notifyFileChange).bind(this));
}, _DropzoneArea_deleteFile = function _DropzoneArea_deleteFile(removedFileObj, removedFileObjIdx) {
    const { fileObjects, onDelete } = this.state;
    // Calculate remaining fileObjects array
    const remainingFileObjs = fileObjects.filter((_fileObject, i) => i !== removedFileObjIdx);
    // Notify removed file
    if (onDelete) {
        onDelete(removedFileObj.file, removedFileObjIdx);
    }
    // Update local state
    this.setState({
        fileObjects: remainingFileObjs,
    }, __classPrivateFieldGet(this, _DropzoneArea_instances, "m", _DropzoneArea_notifyFileChange).bind(this));
}, _DropzoneArea_splitDropzoneAreaProps = function _DropzoneArea_splitDropzoneAreaProps() {
    const { clearOnUnmount, initialFiles, onChange, onDelete, ...dropzoneAreaProps } = this.state;
    return {
        clearOnUnmount,
        initialFiles,
        onChange,
        onDelete,
        dropzoneAreaProps: dropzoneAreaProps,
    };
};
//# sourceMappingURL=dropzone-area.js.map