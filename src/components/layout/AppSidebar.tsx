import {
  Box,
  List,
  ListItemButton,
  ListItemText,
} from '@mui/material'
import {
  Link,
  useMatchRoute,
} from '@tanstack/react-router'

import { useAuthorization } from '../../features/auth/hooks/useAuthorization'

const navigationItems = [
  {
    label: 'Dashboard',
    to: '/dashboard',
  },
  {
    label: 'Members',
    to: '/members',
    permission: 'MEMBER_VIEW',
  },
] as const

export function AppSidebar() {
  const matchRoute = useMatchRoute()
  const { can } = useAuthorization()

  const itemSx = {
    mx: 1,
    my: 0.5,
    borderRadius: 1,
    px: 2,
    py: 1,
    minHeight: 44,
    justifyContent: 'flex-start',

    borderLeft: 4,
    borderLeftStyle: 'solid',
    borderLeftColor: 'transparent',

    color: 'text.secondary',

    '& .MuiListItemText-primary': {
      typography: 'body2',
    },

    '&:hover': {
      bgcolor: 'action.hover',
      color: 'text.primary',
    },

    '&.Mui-selected': {
      bgcolor: 'action.selected',
      borderLeftColor: 'primary.main',
      color: 'text.primary',

      '&:hover': {
        bgcolor: 'action.selected',
      },
    },

    '&.Mui-selected .MuiListItemText-primary': {
      fontWeight: 600,
    },
  }

  return (
    <Box
      component="aside"
      sx={{
        width: 240,
        flexShrink: 0,
        borderRight: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <List sx={{ py: 1 }}>
        {navigationItems.map((item) => {
          if (
            'permission' in item &&
            !can(item.permission)
          ) {
            return null
          }

          const isActive = Boolean(
            matchRoute({
              to: item.to,
              fuzzy: true,
            }),
          )

          return (
            <ListItemButton
              key={item.to}
              component={Link}
              to={item.to}
              selected={isActive}
              sx={itemSx}
            >
              <ListItemText
                primary={item.label}
              />
            </ListItemButton>
          )
        })}
      </List>
    </Box>
  )
}