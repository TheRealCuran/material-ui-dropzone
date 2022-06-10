import * as React from 'react';
import { ChipProps } from '@mui/material';
import { FileObject, PreviewGridProps } from './dropzone.defs';
interface PreviewListProps {
    fileObjects: FileObject[];
    handleRemove(fileIndex: number, evt: React.MouseEvent<HTMLButtonElement>): void;
    showFileNames: boolean;
    useChipsForPreview: boolean;
    previewChipProps: ChipProps;
    previewGridProps: PreviewGridProps;
    getPreviewIcon(fileObject: FileObject): JSX.Element;
}
declare class PreviewListImpl extends React.PureComponent<PreviewListProps> {
    constructor(props: PreviewListProps);
    render(): JSX.Element;
}
export declare const PreviewList: import("@emotion/styled").StyledComponent<Pick<PreviewListProps, keyof PreviewListProps> & import("@mui/system").MUIStyledCommonProps<import("@mui/material").Theme> & PreviewListProps, {}, {
    ref?: React.Ref<PreviewListImpl> | undefined;
}>;
export {};
//# sourceMappingURL=preview-list.d.ts.map