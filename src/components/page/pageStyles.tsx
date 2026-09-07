import type { SxProps, Theme } from '@mui/material/styles'

export const dialogHeaderSx: SxProps<Theme> = {
    px: { xs: 2, sm: 2.5 },
    pt: { xs: 2, sm: 2.5 },
    pb: 1.5,
    borderBottom: 1,
    borderColor: 'divider',
}

export const dialogTitleSx: SxProps<Theme> = {
    fontWeight: 700,
}

export const dialogContentSx: SxProps<Theme> = {
    px: { xs: 2, sm: 2.5 },
    pt: 3,
    mt: 1.5,
    pb: { xs: 2, sm: 2.5 },
    overflowY: 'visible',
}

export const pageHeaderPaperSx: SxProps<Theme> = {
    pt: { xs: 2, sm: 2.5 },
    px: { xs: 2, sm: 2.5 },
    pb: 2.5,
    mb: 0,
    borderRadius: 2,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    overflow: "hidden",
};

export const pageHeaderStackSx: SxProps<Theme> = {
    pb: 1.5,
    mb: 2,
};

export const pageHeaderTitleSx: SxProps<Theme> = {
    fontWeight: 700,
};

export const pageContentPaperSx: SxProps<Theme> = {
    borderTop: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    overflow: "hidden",
    mb: 2,
};