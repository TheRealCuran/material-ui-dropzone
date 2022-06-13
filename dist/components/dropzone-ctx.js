/* eslint-disable no-console */
import * as React from 'react';
const fileObjects = [];
const defaultContext = {
    fileObjects,
    addFiles: (newFileObjects) => console.log(`Got ${newFileObjects.length} files to add`),
    deleteFile: (removedFileObj, removedFileObjIdx) => console.log(`Removing ${removedFileObj.file.name} at index ${removedFileObjIdx}`),
    handleClose: (evt) => evt.stopPropagation(),
    handleSave: (evt) => evt.stopPropagation(),
};
export const DropzoneContext = React.createContext(defaultContext);
//# sourceMappingURL=dropzone-ctx.js.map