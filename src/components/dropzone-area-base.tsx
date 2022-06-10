/* eslint-disable node/no-unsupported-features/es-builtins */
import * as React from 'react'
import {
  AlertColor,
  Button,
  ChipProps,
  Snackbar,
  SnackbarOrigin,
  SnackbarProps,
  styled,
  Typography,
} from '@mui/material'
import { AttachFile, CloudUpload } from '@mui/icons-material'
import clsx from 'clsx'
import merge from 'lodash.merge'
import isEqual from 'lodash.isequal'
import Dropzone, { DropEvent, FileRejection } from 'react-dropzone'
import { convertBytesToMbsOrKbs, isImage, readFile } from '../helpers'
import { PreviewList } from './preview-list'
import { SnackbarContentWrapper } from './snackbar-content-wrapper'
import {
  DropzoneAreaBaseProps,
  FileObject,
  PreviewGridProps,
} from './dropzone.defs'

interface DropzoneAreaBaseState extends DropzoneAreaBaseProps {
  filesLimit: number
  fileObjects: FileObject[]
  maxFileSize: number
  dropzoneText: string
  previewText: string
  disableRejectionFeedback: boolean
  showPreviews: boolean
  showPreviewsInDropzone: boolean
  showFileNames: boolean
  showFileNamesInPreview: boolean
  useChipsForPreview: boolean
  previewChipProps: ChipProps
  previewGridProps: PreviewGridProps
  showAlerts: boolean | AlertColor[]
  alertSnackbarProps: SnackbarProps
  getFileLimitExceedMessage(filesLimit: number): string
  getFileAddedMessage(fileName: string): string
  getDropRejectMessage(
    rejectedFile: File,
    acceptedFiles: string[],
    maxFileSize: number,
  ): string
  getFileRemovedMessage(fileName: string): string
  getPreviewIcon(fileObject: FileObject): JSX.Element
  openSnackBar: boolean
  snackbarMessage: string
  snackbarVariant: AlertColor
}

/**
 * This components creates a Material-UI Dropzone, with previews and snackbar notifications.
 */
class DropzoneAreaBaseImpl extends React.PureComponent<
  DropzoneAreaBaseProps,
  DropzoneAreaBaseState
> {
  #defaultGetPreviewIcon(fileObject: FileObject): JSX.Element {
    if (isImage(fileObject.file) && fileObject.data !== null) {
      return <img role="presentation" src={fileObject.data} />
    }

    return <AttachFile />
  }

  #defaultProps: DropzoneAreaBaseState = {
    acceptedFiles: [],
    filesLimit: 3,
    fileObjects: [],
    maxFileSize: 3_000_000,
    dropzoneText: 'Drag and drop a file here or click',
    previewText: 'Preview:',
    disableRejectionFeedback: false,
    showPreviews: false, // By default previews show up under in the dialog and inside in the standalone
    showPreviewsInDropzone: true,
    showFileNames: false,
    showFileNamesInPreview: false,
    useChipsForPreview: false,
    previewChipProps: {},
    previewGridProps: {},
    reset: undefined,
    showAlerts: true,
    alertSnackbarProps: {
      anchorOrigin: {
        horizontal: 'left',
        vertical: 'bottom',
      },
      autoHideDuration: 6000,
    },
    getFileLimitExceedMessage: (filesLimit: number) =>
      `Maximum allowed number of files exceeded. Only ${filesLimit} allowed`,
    getFileAddedMessage: (fileName) => `File ${fileName} successfully added.`,
    getPreviewIcon: this.#defaultGetPreviewIcon.bind(this),
    getFileRemovedMessage: (fileName) => `File ${fileName} removed.`,
    getDropRejectMessage: (rejectedFile, acceptedFiles, maxFileSize) => {
      let message = `File ${rejectedFile.name} was rejected. `
      if (!acceptedFiles.includes(rejectedFile.type)) {
        message += 'File type not supported. '
      }
      if (rejectedFile.size > maxFileSize) {
        message += `File is too big. Size limit is ${convertBytesToMbsOrKbs(
          maxFileSize,
        )}. `
      }
      return message
    },
    openSnackBar: false,
    snackbarMessage: '',
    snackbarVariant: 'success',
  }

  #defaultSnackbarAnchorOrigin: SnackbarOrigin = {
    horizontal: 'left',
    vertical: 'bottom',
  }

  constructor(props: DropzoneAreaBaseProps) {
    super(props)

    this.state = merge(this.#defaultProps, props)
  }

  #notifyAlert() {
    const { openSnackBar, snackbarMessage, snackbarVariant, onAlert } =
      this.state
    if (openSnackBar && onAlert) {
      onAlert(snackbarMessage, snackbarVariant)
    }
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  handleDropAccepted(acceptedFiles: File[], evt: DropEvent): void {
    const {
      fileObjects,
      filesLimit,
      getFileAddedMessage,
      getFileLimitExceedMessage,
      onAdd,
      onDrop,
    } = this.state

    if (
      filesLimit > 1 &&
      fileObjects.length + acceptedFiles.length > filesLimit
    ) {
      this.setState(
        {
          openSnackBar: true,
          snackbarMessage: getFileLimitExceedMessage(filesLimit),
          snackbarVariant: 'error',
        },
        this.#notifyAlert.bind(this),
      )
      return
    }

    // Notify Drop event
    if (onDrop) {
      onDrop(acceptedFiles, evt)
    }

    Promise.all(
      acceptedFiles.map(async (file) => {
        const data = await readFile(file)
        return {
          file,
          data,
        }
      }),
    )
      .then((fileObjs: FileObject[]) => {
        // Notify added files
        if (onAdd) {
          onAdd(fileObjs)
        }

        // Display message
        const message = fileObjs.reduce(
          (msg, fileObj) => msg + getFileAddedMessage(fileObj.file.name),
          '',
        )
        this.setState(
          {
            openSnackBar: true,
            snackbarMessage: message,
            snackbarVariant: 'success',
          },
          this.#notifyAlert.bind(this),
        )

        return true
      })
      .catch((error) => {
        let msg = 'Unknown error'
        if (error instanceof Error) {
          msg = error.message
        }
        this.setState(
          {
            openSnackBar: true,
            snackbarMessage: msg,
            snackbarVariant: 'error',
          },
          this.#notifyAlert.bind(this),
        )
      })
  }

  handleDropRejected(rejectedFiles: FileRejection[], evt: DropEvent): void {
    const {
      acceptedFiles,
      filesLimit,
      fileObjects,
      getDropRejectMessage,
      getFileLimitExceedMessage,
      maxFileSize,
      onDropRejected,
    } = this.state

    let message = ''
    if (fileObjects.length + rejectedFiles.length > filesLimit) {
      message = getFileLimitExceedMessage(filesLimit)
    } else {
      rejectedFiles.forEach((rejectedFile) => {
        message = getDropRejectMessage(
          rejectedFile.file,
          acceptedFiles,
          maxFileSize,
        )
      })
    }

    if (onDropRejected) {
      onDropRejected(
        rejectedFiles.map((rejFil) => rejFil.file),
        evt,
      )
    }

    this.setState(
      {
        openSnackBar: true,
        snackbarMessage: message,
        snackbarVariant: 'error',
      },
      this.#notifyAlert.bind(this),
    )
  }

  handleRemove(fileIndex: number, evt: React.MouseEvent<HTMLButtonElement>) {
    evt.stopPropagation()

    const { fileObjects, getFileRemovedMessage, onDelete } = this.state

    // Find removed fileObject
    const removedFileObj = fileObjects[fileIndex]

    // Notify removed file
    if (onDelete) {
      onDelete(removedFileObj, fileIndex)
    }

    this.setState(
      {
        openSnackBar: true,
        snackbarMessage: getFileRemovedMessage(removedFileObj.file.name),
        snackbarVariant: 'info',
      },
      this.#notifyAlert.bind(this),
    )
  }

  handleCloseSnackbar() {
    this.setState({
      openSnackBar: false,
    })
  }

  componentDidUpdate(prevProps: DropzoneAreaBaseProps) {
    const props = this.props
    if (!isEqual(prevProps, props)) {
      this.setState(merge(this.#defaultProps, props))
    }
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  render() {
    const {
      acceptedFiles,
      alertSnackbarProps,
      disableRejectionFeedback,
      dropzoneProps,
      dropzoneText,
      fileObjects,
      filesLimit,
      getPreviewIcon,
      Icon,
      inputProps,
      maxFileSize,
      previewChipProps,
      previewGridProps,
      previewText,
      showAlerts,
      showFileNames,
      showFileNamesInPreview,
      showPreviews,
      showPreviewsInDropzone,
      useChipsForPreview,
      reset,
      openSnackBar,
      snackbarMessage,
      snackbarVariant,
    } = this.state

    const acceptFiles = Object.fromEntries(
      acceptedFiles.map((key) => [key, []]),
    )
    const isMultiple = filesLimit > 1
    const previewsVisible = showPreviews && fileObjects.length > 0
    const previewsInDropzoneVisible =
      showPreviewsInDropzone && fileObjects.length > 0

    return (
      <React.Fragment>
        <Dropzone
          {...dropzoneProps}
          accept={acceptFiles}
          onDropAccepted={(files, evt) => this.handleDropAccepted(files, evt)}
          onDropRejected={(fileRejections, evt) =>
            this.handleDropRejected(fileRejections, evt)
          }
          maxSize={maxFileSize}
          multiple={isMultiple}
        >
          {({ getRootProps, getInputProps, isDragActive, isDragReject }) => (
            <div
              {...getRootProps({
                className: clsx('DropzoneAreaBase-root', {
                  'DropzoneAreaBase-active': isDragActive,
                  'DropzoneAreaBase-invalid':
                    !disableRejectionFeedback && isDragReject,
                }),
              })}
            >
              <input {...getInputProps(inputProps)} />

              <div className={clsx('DropzoneAreaBase-title')}>
                <Typography
                  variant="h5"
                  component="p"
                  className={clsx(
                    'MuiTypography-root',
                    'DropzoneAreaBase-titletxt',
                  )}
                >
                  {dropzoneText}
                </Typography>
                {Icon ? (
                  <Icon
                    className={clsx('MuiSvgIcon-root', 'DropzoneAreaBase-icon')}
                  />
                ) : (
                  <CloudUpload
                    className={clsx('MuiSvgIcon-root', 'DropzoneAreaBase-icon')}
                  />
                )}
              </div>

              {previewsInDropzoneVisible && (
                <PreviewList
                  fileObjects={fileObjects}
                  handleRemove={(idx, evt) => this.handleRemove(idx, evt)}
                  getPreviewIcon={getPreviewIcon}
                  showFileNames={showFileNames}
                  useChipsForPreview={useChipsForPreview}
                  previewChipProps={previewChipProps}
                  previewGridProps={previewGridProps}
                />
              )}
            </div>
          )}
        </Dropzone>

        {reset &&
          (React.isValidElement(reset) ? (
            reset
          ) : (
            <Button
              onClick={(evt) => {
                if (typeof reset === 'object' && 'onClick' in reset) {
                  reset.onClick(evt)
                }
              }}
              variant="outlined"
              className={clsx('MuiButton-root', 'DropzoneAreaBase-resetButton')}
            >
              {typeof reset === 'object' && 'text' in reset
                ? reset.text
                : 'reset'}
            </Button>
          ))}

        {previewsVisible && (
          <React.Fragment>
            <Typography variant="subtitle1" component="span">
              {previewText}
            </Typography>

            <PreviewList
              fileObjects={fileObjects}
              handleRemove={(idx, evt) => this.handleRemove(idx, evt)}
              getPreviewIcon={getPreviewIcon}
              showFileNames={showFileNamesInPreview}
              useChipsForPreview={useChipsForPreview}
              previewChipProps={previewChipProps}
              previewGridProps={previewGridProps}
            />
          </React.Fragment>
        )}

        {((typeof showAlerts === 'boolean' && showAlerts) ||
          (Array.isArray(showAlerts) &&
            showAlerts.includes(snackbarVariant))) && (
          <Snackbar
            anchorOrigin={this.#defaultSnackbarAnchorOrigin}
            autoHideDuration={6000}
            {...alertSnackbarProps}
            open={openSnackBar}
            onClose={() => this.handleCloseSnackbar()}
          >
            <SnackbarContentWrapper
              onClose={() => this.handleCloseSnackbar()}
              variant={snackbarVariant}
              message={snackbarMessage}
            />
          </Snackbar>
        )}
      </React.Fragment>
    )
  }
}

export const DropzoneAreaBase = styled(DropzoneAreaBaseImpl, {
  name: 'DropzoneAreaBase',
  slot: 'Root',
})<DropzoneAreaBaseProps>(({ theme }) => ({
  '@keyframes progress': {
    '0%': {
      backgroundPosition: '0 0',
    },
    '100%': {
      backgroundPosition: '-70px 0',
    },
  },
  position: 'relative',
  width: '100%',
  minHeight: '250px',
  backgroundColor: theme.palette.background.paper,
  border: 'dashed',
  borderColor: theme.palette.divider,
  borderRadius: theme.shape.borderRadius,
  boxSizing: 'border-box',
  cursor: 'pointer',
  overflow: 'hidden',
  '&.DropzoneAreaBase-active': {
    animation: '$progress 2s linear infinite !important',
    backgroundImage: `repeating-linear-gradient(-45deg, ${theme.palette.background.paper}, ${theme.palette.background.paper} 25px, ${theme.palette.divider} 25px, ${theme.palette.divider} 50px)`,
    backgroundSize: '150% 100%',
    border: 'solid',
    borderColor: theme.palette.primary.light,
  },
  '&.DropzoneAreaBase-invalid': {
    backgroundImage: `repeating-linear-gradient(-45deg, ${theme.palette.error.light}, ${theme.palette.error.light} 25px, ${theme.palette.error.dark} 25px, ${theme.palette.error.dark} 50px)`,
    borderColor: theme.palette.error.main,
  },
  '& .DropzoneAreaBase-icon': {
    width: 51,
    height: 51,
    color: theme.palette.text.primary,
  },
  '& .DropzoneAreaBase-resetButton': {
    display: 'block',
    margin: '10px 0',
  },
  '& .DropzoneAreaBase-title': {
    textAlign: 'center',
  },
  '& .DropzoneAreaBase-titletxt': {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    marginBottom: theme.spacing(3),
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    marginTop: theme.spacing(3),
  },
}))
