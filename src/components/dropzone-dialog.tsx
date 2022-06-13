import * as React from 'react'
import merge from 'lodash.merge'
import isEqual from 'lodash.isequal'
import { DropzoneDialogBase } from './dropzone-dialog-base'
import { createFileFromUrl, readFile } from '../helpers'
import { DropzoneDialogBaseProps, FileData, FileObject } from './dropzone.defs'
import { DropzoneContext } from './dropzone-ctx'

interface DropzoneDialogProps
  extends Omit<DropzoneDialogBaseProps, 'fileObjects' | 'onSave'> {
  /** Clear uploaded files when component is unmounted. */
  clearOnUnmount?: boolean
  /** Maximum number of files that can be loaded into the dropzone. */
  filesLimit?: number
  /** List containing File objects or URL strings.<br/>
   * **Note:** Please take care of CORS.
   */
  initialFiles?: FileData[]
  /**
   * Fired when the user clicks the Submit button.
   *
   * @param {File[]} files All the files currently inside the Dropzone.
   * @param {SyntheticEvent} event The react `SyntheticEvent`.
   */
  onSave?(files: File[], event: React.SyntheticEvent): void
  /**
   * Fired when the modal is closed.
   *
   * @param {SyntheticEvent} event The react `SyntheticEvent`
   */
  onClose?(evt: React.SyntheticEvent): void
  /**
   * Fired when new files are added to dropzone.
   *
   * @param {FileObject[]} newFiles The new files added to the dropzone.
   */
  onAdd?(newFiles: FileObject[]): void
  /**
   * Fired when a file is deleted from the previews panel.
   *
   * @param {FileObject} deletedFileObject The file that was removed.
   * @param {number} index The index of the removed file object.
   */
  onDelete?(deletedFileObject: FileObject, index: number): void
}

interface DropzoneDialogState extends DropzoneDialogProps {
  clearOnUnmount: boolean
  filesLimit: number
  initialFiles: FileData[]
  fileObjects: FileObject[]
  addFiles(newFileObjects: FileObject[]): void
  deleteFile(removedFileObj: FileObject, removedFileObjIdx: number): void
  handleClose(evt: React.SyntheticEvent): void
  handleSave(evt: React.SyntheticEvent): void
}

/**
 * This component provides an uncontrolled version of the DropzoneDialogBase component.
 *
 * It supports all the Props and Methods from `DropzoneDialogBase` but keeps the files state internally.
 *
 * **Note** The `onSave` handler also returns `File[]` with all the accepted files.
 */
export class DropzoneDialog extends React.PureComponent<
  DropzoneDialogProps,
  DropzoneDialogState
> {
  #defaultProps: DropzoneDialogState = {
    open: false,
    acceptedFiles: [],
    clearOnUnmount: true,
    filesLimit: 3,
    initialFiles: [],
    fileObjects: [],
    addFiles: (newFileObjects: FileObject[]) => this.#addFiles(newFileObjects),
    deleteFile: (removedFileObj: FileObject, removedFileObjIdx: number) =>
      this.#deleteFile(removedFileObj, removedFileObjIdx),
    handleClose: (evt: React.SyntheticEvent) => this.#handleClose(evt),
    handleSave: (evt: React.SyntheticEvent) => this.#handleSave(evt),
  }
  constructor(props: DropzoneDialogProps) {
    super(props)

    this.state = merge(this.#defaultProps, props)
  }

  #addFiles(newFileObjects: FileObject[]) {
    const { filesLimit, fileObjects, onAdd } = this.state

    if (onAdd) {
      onAdd(fileObjects)
    }

    this.setState({
      fileObjects:
        filesLimit <= 1
          ? [newFileObjects[0]]
          : [...fileObjects, ...newFileObjects],
    })
  }

  #deleteFile(removedFileObj: FileObject, removedFileObjIdx: number): void {
    const { fileObjects, onDelete } = this.state

    // Calculate remaining fileObjects array
    const remainingFileObjs = fileObjects.filter(
      (_fileObject, i) => i !== removedFileObjIdx,
    )

    // Notify removed file
    if (onDelete) {
      onDelete(removedFileObj, removedFileObjIdx)
    }

    // Update local state
    this.setState({
      fileObjects: remainingFileObjs,
    })
  }

  #handleClose(evt: React.SyntheticEvent) {
    const { clearOnUnmount, onClose } = this.state

    if (onClose) {
      onClose(evt)
    }

    if (clearOnUnmount) {
      this.setState({
        fileObjects: [],
      })
    }
  }

  #handleSave(evt: React.SyntheticEvent): void {
    const { clearOnUnmount, fileObjects, onSave } = this.state

    if (onSave) {
      onSave(
        fileObjects.map((fileObject) => fileObject.file),
        evt,
      )
    }

    if (clearOnUnmount) {
      this.setState({
        fileObjects: [],
      })
    }
  }

  componentDidMount() {
    const { initialFiles } = this.state
    Promise.all(
      initialFiles.map(async (initialFile): Promise<FileObject> => {
        const file =
          typeof initialFile === 'string'
            ? await createFileFromUrl(initialFile)
            : initialFile
        const data = await readFile(file)

        return {
          file,
          data,
        }
      }),
    )
      .then((fileObjs) => {
        const { fileObjects } = this.state
        this.setState({
          fileObjects: [...fileObjects, ...fileObjs],
        })
        return true
      })
      .catch((error) => {
        // we might want to show the user something?
        console.error(error)
      })
  }

  componentWillUnmount() {
    const { clearOnUnmount } = this.state

    if (clearOnUnmount) {
      this.setState({
        fileObjects: [],
      })
    }
  }

  componentDidUpdate(prevProps: DropzoneDialogProps) {
    const props = this.props
    if (!isEqual(prevProps, props)) {
      this.setState(merge(this.#defaultProps, props))
    }
  }

  render() {
    const { fileObjects, addFiles, deleteFile, handleClose, handleSave } =
      this.state
    return (
      <DropzoneContext.Provider
        value={{
          fileObjects,
          addFiles,
          deleteFile,
          handleClose,
          handleSave,
        }}
      >
        <DropzoneDialogBase {...this.state} />
      </DropzoneContext.Provider>
    )
  }
}
