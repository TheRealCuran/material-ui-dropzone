import * as React from 'react';
import { DropzoneDialogBaseProps, FileData, FileObject } from './dropzone.defs';
interface DropzoneDialogProps extends Omit<DropzoneDialogBaseProps, 'fileObjects' | 'onSave'> {
    /** Clear uploaded files when component is unmounted. */
    clearOnUnmount?: boolean;
    /** Maximum number of files that can be loaded into the dropzone. */
    filesLimit?: number;
    /** List containing File objects or URL strings.<br/>
     * **Note:** Please take care of CORS.
     */
    initialFiles?: FileData[];
    /**
     * Fired when the user clicks the Submit button.
     *
     * @param {File[]} files All the files currently inside the Dropzone.
     * @param {SyntheticEvent} event The react `SyntheticEvent`.
     */
    onSave?(files: File[], event: React.SyntheticEvent): void;
    /**
     * Fired when the modal is closed.
     *
     * @param {SyntheticEvent} event The react `SyntheticEvent`
     */
    onClose?(evt: React.SyntheticEvent): void;
    /**
     * Fired when new files are added to dropzone.
     *
     * @param {FileObject[]} newFiles The new files added to the dropzone.
     */
    onAdd?(newFiles: FileObject[]): void;
    /**
     * Fired when a file is deleted from the previews panel.
     *
     * @param {FileObject} deletedFileObject The file that was removed.
     * @param {number} index The index of the removed file object.
     */
    onDelete?(deletedFileObject: FileObject, index: number): void;
}
interface DropzoneDialogState extends DropzoneDialogProps {
    clearOnUnmount: boolean;
    filesLimit: number;
    initialFiles: FileData[];
    fileObjects: FileObject[];
    addFiles(newFileObjects: FileObject[]): void;
    deleteFile(removedFileObj: FileObject, removedFileObjIdx: number): void;
    handleClose(evt: React.SyntheticEvent): void;
    handleSave(evt: React.SyntheticEvent): void;
}
/**
 * This component provides an uncontrolled version of the DropzoneDialogBase component.
 *
 * It supports all the Props and Methods from `DropzoneDialogBase` but keeps the files state internally.
 *
 * **Note** The `onSave` handler also returns `File[]` with all the accepted files.
 */
export declare class DropzoneDialog extends React.PureComponent<DropzoneDialogProps, DropzoneDialogState> {
    #private;
    constructor(props: DropzoneDialogProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    componentDidUpdate(prevProps: DropzoneDialogProps): void;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=dropzone-dialog.d.ts.map