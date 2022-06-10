import * as React from 'react';
import { AlertColor, ChipProps, SnackbarProps } from '@mui/material';
import { DropEvent, FileRejection } from 'react-dropzone';
import { DropzoneAreaBaseProps, FileObject, PreviewGridProps } from './dropzone.defs';
interface DropzoneAreaBaseState extends DropzoneAreaBaseProps {
    filesLimit: number;
    fileObjects: FileObject[];
    maxFileSize: number;
    dropzoneText: string;
    previewText: string;
    disableRejectionFeedback: boolean;
    showPreviews: boolean;
    showPreviewsInDropzone: boolean;
    showFileNames: boolean;
    showFileNamesInPreview: boolean;
    useChipsForPreview: boolean;
    previewChipProps: ChipProps;
    previewGridProps: PreviewGridProps;
    showAlerts: boolean | AlertColor[];
    alertSnackbarProps: SnackbarProps;
    getFileLimitExceedMessage(filesLimit: number): string;
    getFileAddedMessage(fileName: string): string;
    getDropRejectMessage(rejectedFile: File, acceptedFiles: string[], maxFileSize: number): string;
    getFileRemovedMessage(fileName: string): string;
    getPreviewIcon(fileObject: FileObject): JSX.Element;
    openSnackBar: boolean;
    snackbarMessage: string;
    snackbarVariant: AlertColor;
}
/**
 * This components creates a Material-UI Dropzone, with previews and snackbar notifications.
 */
declare class DropzoneAreaBaseImpl extends React.PureComponent<DropzoneAreaBaseProps, DropzoneAreaBaseState> {
    #private;
    constructor(props: DropzoneAreaBaseProps);
    handleDropAccepted(acceptedFiles: File[], evt: DropEvent): void;
    handleDropRejected(rejectedFiles: FileRejection[], evt: DropEvent): void;
    handleRemove(fileIndex: number, evt: React.MouseEvent<HTMLButtonElement>): void;
    handleCloseSnackbar(): void;
    componentDidUpdate(prevProps: DropzoneAreaBaseProps): void;
    render(): JSX.Element;
}
export declare const DropzoneAreaBase: import("@emotion/styled").StyledComponent<Pick<DropzoneAreaBaseProps, keyof DropzoneAreaBaseProps> & import("@mui/system").MUIStyledCommonProps<import("@mui/material").Theme> & DropzoneAreaBaseProps, {}, {
    ref?: React.Ref<DropzoneAreaBaseImpl> | undefined;
}>;
export {};
//# sourceMappingURL=dropzone-area-base.d.ts.map