/* eslint-disable no-console */
import * as React from 'react'
import { FileObject } from './dropzone.defs'

interface DropzoneContextMembers {
  fileObjects: FileObject[]
  addFiles(newFileObjects: FileObject[]): void
  deleteFile(removedFileObj: FileObject, removedFileObjIdx: number): void
  handleClose(evt: React.SyntheticEvent): void
  handleSave(evt: React.SyntheticEvent): void
}

const fileObjects: FileObject[] = []

const defaultContext: DropzoneContextMembers = {
  fileObjects,
  addFiles: (newFileObjects: FileObject[]) =>
    console.log(`Got ${newFileObjects.length} files to add`),
  deleteFile: (removedFileObj: FileObject, removedFileObjIdx: number) =>
    console.log(
      `Removing ${removedFileObj.file.name} at index ${removedFileObjIdx}`,
    ),
  handleClose: (evt: React.SyntheticEvent) => evt.stopPropagation(),
  handleSave: (evt: React.SyntheticEvent) => evt.stopPropagation(),
}

export const DropzoneContext = React.createContext(defaultContext)
