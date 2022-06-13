import * as React from 'react';
import { FileObject } from './dropzone.defs';
export interface DropzoneContextMembers {
    fileObjects: FileObject[];
    addFiles(newFileObjects: FileObject[]): void;
    deleteFile(removedFileObj: FileObject, removedFileObjIdx: number): void;
    handleClose(evt: React.SyntheticEvent): void;
    handleSave(evt: React.SyntheticEvent): void;
}
export declare const DropzoneContext: React.Context<DropzoneContextMembers>;
//# sourceMappingURL=dropzone-ctx.d.ts.map