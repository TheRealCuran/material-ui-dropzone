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
}
interface DropzoneDialogState extends DropzoneDialogProps {
    clearOnUnmount: boolean;
    filesLimit: number;
    initialFiles: FileData[];
    fileObjects: FileObject[];
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