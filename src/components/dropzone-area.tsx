import * as React from 'react'
import merge from 'lodash.merge'
import isEqual from 'lodash.isequal'
import { createFileFromUrl, readFile } from '../helpers'
import { DropzoneAreaBase } from './dropzone-area-base'
import { DropzoneAreaBaseProps, FileData, FileObject } from './dropzone.defs'
import { DropzoneContext } from './dropzone-ctx'

interface DropzoneAreaProps
  extends Omit<DropzoneAreaBaseProps, 'fileObjects' | 'onAdd' | 'onDelete'> {
  /** Clear uploaded files when component is unmounted.
   */
  clearOnUnmount?: boolean
  /** List containing File objects or URL strings.
   *
   * **Note:** Please take care of CORS.
   */
  initialFiles?: FileData[]
  /** Maximum number of files that can be loaded into the dropzone. */
  filesLimit?: number
  /**
   * Fired when the files inside dropzone change.
   *
   * @param {File[]} loadedFiles All the files currently loaded into the dropzone.
   */
  onChange?(loadedFiles: File[]): void
  /**
   * Fired when a file is deleted from the previews panel.
   *
   * @param {File} deletedFile The file that was removed.
   * @param {number} index The index of the removed file object.
   */
  onDelete?(deletedFile: File, index: number): void
}

interface DropzoneAreaState extends DropzoneAreaProps {
  clearOnUnmount: boolean
  initialFiles: FileData[]
  filesLimit: number
  fileObjects: FileObject[]
  addFiles(newFileObjects: FileObject[]): void
  deleteFile(removedFileObj: FileObject, removedFileObjIdx: number): void
  // unused in the DropzoneArea, but it's easier to have them always defined
  handleClose(evt: React.SyntheticEvent): void
  handleSave(evt: React.SyntheticEvent): void
}

/**
 * This components creates an uncontrolled Material-UI Dropzone, with previews and snackbar notifications.
 *
 * It supports all props of `DropzoneAreaBase` but keeps the files state internally.
 *
 * **Note** To listen to file changes use `onChange` event handler and notice that `onDelete` returns a `File` instance instead of `FileObject`.
 */
export class DropzoneArea extends React.PureComponent<
  DropzoneAreaProps,
  DropzoneAreaState
> {
  #defaultProps: DropzoneAreaState = {
    acceptedFiles: [],
    clearOnUnmount: true,
    filesLimit: 3,
    initialFiles: [],
    fileObjects: [],
    addFiles: (newFileObjects: FileObject[]) => this.#addFiles(newFileObjects),
    deleteFile: (removedFileObj: FileObject, removedFileObjIdx: number) =>
      this.#deleteFile(removedFileObj, removedFileObjIdx),
    // unused in the DropzoneArea, but it's easier to have them always defined
    handleClose: (_evt: React.SyntheticEvent) => {
      return
    },
    handleSave: (_evt: React.SyntheticEvent) => {
      return
    },
  }

  constructor(props: DropzoneAreaProps) {
    super(props)

    this.state = merge(this.#defaultProps, props)
  }

  #notifyFileChange() {
    const { fileObjects, onChange } = this.state

    if (onChange) {
      onChange(fileObjects.map((fileObject) => fileObject.file))
    }
  }

  #addFiles(newFileObjects: FileObject[]) {
    const { filesLimit, fileObjects } = this.state

    this.setState(
      {
        fileObjects:
          filesLimit <= 1
            ? [newFileObjects[0]]
            : [...fileObjects, ...newFileObjects],
      },
      this.#notifyFileChange.bind(this),
    )
  }

  #deleteFile(removedFileObj: FileObject, removedFileObjIdx: number): void {
    const { fileObjects, onDelete } = this.state

    // Calculate remaining fileObjects array
    const remainingFileObjs = fileObjects.filter(
      (_fileObject, i) => i !== removedFileObjIdx,
    )

    // Notify removed file
    if (onDelete) {
      onDelete(removedFileObj.file, removedFileObjIdx)
    }

    // Update local state
    this.setState(
      {
        fileObjects: remainingFileObjs,
      },
      this.#notifyFileChange.bind(this),
    )
  }

  #splitDropzoneAreaProps() {
    const {
      clearOnUnmount,
      initialFiles,
      onChange,
      onDelete,
      ...dropzoneAreaProps
    } = this.state

    return {
      clearOnUnmount,
      initialFiles,
      onChange,
      onDelete,
      dropzoneAreaProps: dropzoneAreaProps as DropzoneAreaState,
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
        this.setState(
          {
            fileObjects: [...fileObjects, ...fileObjs],
          },
          this.#notifyFileChange.bind(this),
        )
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
      this.setState(
        {
          fileObjects: [],
        },
        this.#notifyFileChange.bind(this),
      )
    }
  }

  componentDidUpdate(prevProps: DropzoneAreaProps) {
    const props = this.props
    if (!isEqual(prevProps, props)) {
      this.setState(merge(this.#defaultProps, props))
    }
  }

  render() {
    const { fileObjects, handleClose, handleSave, addFiles, deleteFile } =
      this.state
    const splitProps = this.#splitDropzoneAreaProps()

    return (
      <DropzoneContext.Provider
        value={{
          fileObjects,
          handleClose,
          handleSave,
          addFiles,
          deleteFile,
        }}
      >
        <DropzoneAreaBase {...splitProps.dropzoneAreaProps} />
      </DropzoneContext.Provider>
    )
  }
}
