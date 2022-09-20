import { Delete } from '@mui/icons-material'
import { Chip, ChipProps, Fab, Grid, styled, Typography } from '@mui/material'
import * as React from 'react'
import { FileObject, PreviewGridProps } from './dropzone.defs'

interface PreviewListProps {
  fileObjects: FileObject[]
  handleRemove(
    fileIndex: number,
    evt: React.MouseEvent<HTMLButtonElement>,
  ): void
  showFileNames: boolean
  useChipsForPreview: boolean
  previewChipProps: ChipProps
  previewGridProps: PreviewGridProps
  getPreviewIcon(fileObject: FileObject): JSX.Element
}

class PreviewListImpl extends React.PureComponent<PreviewListProps> {
  constructor(props: PreviewListProps) {
    super(props)
  }

  render() {
    const {
      fileObjects,
      handleRemove,
      showFileNames,
      useChipsForPreview,
      previewChipProps,
      previewGridProps,
      getPreviewIcon,
    } = this.props
    if (useChipsForPreview) {
      return (
        <Grid
          spacing={1}
          direction="row"
          {...previewGridProps.container}
          container={true}
        >
          {fileObjects.map((fileObject, i) => {
            return (
              <Grid
                {...previewGridProps.item}
                item={true}
                key={`${fileObject.file?.name ?? 'file'}-${i}`}
              >
                <Chip
                  variant="outlined"
                  {...previewChipProps}
                  label={fileObject.file.name}
                  onDelete={(evt: React.MouseEvent<HTMLButtonElement>) =>
                    handleRemove(i, evt)
                  }
                />
              </Grid>
            )
          })}
        </Grid>
      )
    }

    return (
      <Grid spacing={8} {...previewGridProps.container} container={true}>
        {fileObjects.map((fileObject, i) => {
          return (
            <Grid
              xs={4}
              {...previewGridProps.item}
              item={true}
              key={`${fileObject.file?.name ?? 'file'}-${i}`}
            >
              {getPreviewIcon(fileObject)}

              {showFileNames && (
                <Typography variant="body1" component="p">
                  {fileObject.file.name}
                </Typography>
              )}

              <Fab onClick={(evt) => handleRemove(i, evt)} aria-label="Delete">
                <Delete />
              </Fab>
            </Grid>
          )
        })}
      </Grid>
    )
  }
}

export const PreviewList = styled(PreviewListImpl, {
  name: 'PreviewList',
  slot: 'Root',
})<PreviewListProps>(({ theme }) => ({
  '& .MuiGrid-container': {
    position: 'relative',
    zIndex: 10,
    textAlign: 'center',
    '&:hover .MuiGrid-item': {
      opacity: 0.3,
    },
    '&:hover .MuiFab-root': {
      opacity: 1,
    },
    '& .MuiGrid-item': {
      height: 100,
      width: 'initial',
      maxWidth: '100%',
      color: theme.palette.text.primary,
      transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
      boxSizing: 'border-box',
      boxShadow: 'rgba(0, 0, 0, 0.12) 0 1px 6px, rgba(0, 0, 0, 0.12) 0 1px 4px',
      borderRadius: theme.shape.borderRadius,
      zIndex: 5,
      opacity: 1,
    },
    '& .MuiFab-root': {
      transition: '.5s ease',
      position: 'absolute',
      opacity: 0,
      top: theme.spacing(-1),
      right: theme.spacing(-1),
      width: 40,
      height: 40,
      '&:focus': {
        opacity: 1,
      },
    },
  },
}))
