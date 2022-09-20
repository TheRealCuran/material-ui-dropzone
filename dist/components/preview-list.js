import { Delete } from '@mui/icons-material';
import { Chip, Fab, Grid, styled, Typography } from '@mui/material';
import * as React from 'react';
class PreviewListImpl extends React.PureComponent {
    constructor(props) {
        super(props);
    }
    render() {
        const { fileObjects, handleRemove, showFileNames, useChipsForPreview, previewChipProps, previewGridProps, getPreviewIcon, } = this.props;
        if (useChipsForPreview) {
            return (React.createElement(Grid, { spacing: 1, direction: "row", ...previewGridProps.container, container: true }, fileObjects.map((fileObject, i) => {
                return (React.createElement(Grid, { ...previewGridProps.item, item: true, key: `${fileObject.file?.name ?? 'file'}-${i}` },
                    React.createElement(Chip, { variant: "outlined", ...previewChipProps, label: fileObject.file.name, onDelete: (evt) => handleRemove(i, evt) })));
            })));
        }
        return (React.createElement(Grid, { spacing: 8, ...previewGridProps.container, container: true }, fileObjects.map((fileObject, i) => {
            return (React.createElement(Grid, { xs: 4, ...previewGridProps.item, item: true, key: `${fileObject.file?.name ?? 'file'}-${i}` },
                getPreviewIcon(fileObject),
                showFileNames && (React.createElement(Typography, { variant: "body1", component: "p" }, fileObject.file.name)),
                React.createElement(Fab, { onClick: (evt) => handleRemove(i, evt), "aria-label": "Delete" },
                    React.createElement(Delete, null))));
        })));
    }
}
export const PreviewList = styled(PreviewListImpl, {
    name: 'PreviewList',
    slot: 'Root',
})(({ theme }) => ({
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
}));
//# sourceMappingURL=preview-list.js.map