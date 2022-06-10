import * as React from 'react';
import { DropzoneAreaBaseProps, FileData, FileObject } from './dropzone.defs';
interface DropzoneAreaProps extends Omit<DropzoneAreaBaseProps, 'fileObjects' | 'onAdd' | 'onDelete'> {
    /** Clear uploaded files when component is unmounted.
     */
    clearOnUnmount?: boolean;
    /** List containing File objects or URL strings.
     *
     * **Note:** Please take care of CORS.
     */
    initialFiles?: FileData[];
    /** Maximum number of files that can be loaded into the dropzone. */
    filesLimit?: number;
    /**
     * Fired when the files inside dropzone change.
     *
     * @param {File[]} loadedFiles All the files currently loaded into the dropzone.
     */
    onChange?(loadedFiles: File[]): void;
    /**
     * Fired when a file is deleted from the previews panel.
     *
     * @param {File} deletedFile The file that was removed.
     * @param {number} index The index of the removed file object.
     */
    onDelete?(deletedFile: File, index: number): void;
}
interface DropzoneAreaState extends DropzoneAreaProps {
    clearOnUnmount: boolean;
    initialFiles: FileData[];
    filesLimit: number;
    fileObjects: FileObject[];
}
/**
 * This components creates an uncontrolled Material-UI Dropzone, with previews and snackbar notifications.
 *
 * It supports all props of `DropzoneAreaBase` but keeps the files state internally.
 *
 * **Note** To listen to file changes use `onChange` event handler and notice that `onDelete` returns a `File` instance instead of `FileObject`.
 */
export declare class DropzoneArea extends React.PureComponent<DropzoneAreaProps, DropzoneAreaState> {
    #private;
    constructor(props: DropzoneAreaProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    componentDidUpdate(prevProps: DropzoneAreaProps): void;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=dropzone-area.d.ts.map