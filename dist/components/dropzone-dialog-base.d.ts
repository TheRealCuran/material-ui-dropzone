import * as React from 'react';
import { DialogProps } from '@mui/material';
import { DropzoneDialogBaseProps } from './dropzone.defs';
import { DropzoneContext } from './dropzone-ctx';
interface DropzoneDialogBaseState extends DropzoneDialogBaseProps {
    open: boolean;
    dialogTitle: string | JSX.Element;
    fullWidth: DialogProps['fullWidth'];
    maxWidth: DialogProps['maxWidth'];
    cancelButtonText: string;
    submitButtonText: string;
    showPreviews: boolean;
    showPreviewsInDropzone: boolean;
    showFileNamesInPreview: boolean;
}
/**
 * This component provides the DropzoneArea inside of a Material-UI Dialog.
 *
 * It supports all the Props and Methods from `DropzoneAreaBase`.
 */
export declare class DropzoneDialogBase extends React.PureComponent<DropzoneDialogBaseProps, DropzoneDialogBaseState> {
    #private;
    static contextType: React.Context<import("./dropzone-ctx").DropzoneContextMembers>;
    context: React.ContextType<typeof DropzoneContext>;
    constructor(props: DropzoneDialogBaseProps);
    componentDidUpdate(prevProps: DropzoneDialogBaseProps): void;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=dropzone-dialog-base.d.ts.map