import {
  Avatar,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import {
  dialogContentSx,
  dialogHeaderSx,
  dialogTitleSx,
} from "../../../components/page/pageStyles";
import type { ProjectMember } from "../api/projectApi";

interface ProjectMembersDialogProps {
  open: boolean;
  members: ProjectMember[];
  onClose: () => void;
}

export function ProjectMembersDialog({
  open,
  members,
  onClose,
}: ProjectMembersDialogProps) {
  const managers = members.filter((member) =>
    member.roles.some((role) => role.name === "PROJECT_MANAGER"),
  );

  const projectMembers = members.filter(
    (member) => !member.roles.some((role) => role.name === "PROJECT_MANAGER"),
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      sx={{
        "& .MuiDialog-paper": {
          backgroundColor: "surface.content",
        },
      }}
    >
      <DialogTitle sx={dialogHeaderSx}>
        <Typography variant="h5" sx={dialogTitleSx}>
          Project members
        </Typography>
      </DialogTitle>

      <DialogContent sx={dialogContentSx}>
        <Stack spacing={2}>
          <Box>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                mb: 1.5,
              }}
            >
              Managers
            </Typography>

            {managers.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No managers assigned.
              </Typography>
            ) : (
              <Stack spacing={1.5}>
                {managers.map((member) => (
                  <Stack
                    key={member.userId}
                    direction="row"
                    spacing={1.5}
                    sx={{ alignItems: "center" }}
                  >
                    <Avatar
                      alt={member.name}
                      sx={{
                        bgcolor: "brand.cta",
                        color: "secondary.contrastText",
                      }}
                    >
                      {member.name.charAt(0).toUpperCase()}
                    </Avatar>

                    <Stack spacing={0.25}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {member.name}
                      </Typography>

                      <Typography variant="caption" color="text.secondary">
                        {member.email}
                      </Typography>
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            )}
          </Box>

          <Divider sx={{ borderColor: "surface.border" }} />

          <Box>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                mb: 1.5,
              }}
            >
              Members
            </Typography>

            {projectMembers.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No members assigned.
              </Typography>
            ) : (
              <Stack spacing={1.5}>
                {projectMembers.map((member) => (
                  <Stack
                    key={member.userId}
                    direction="row"
                    spacing={1.5}
                    sx={{ alignItems: "center" }}
                  >
                    <Avatar
                      alt={member.name}
                      sx={{
                        bgcolor: "brand.cta",
                        color: "secondary.contrastText",
                      }}
                    >
                      {member.name.charAt(0).toUpperCase()}
                    </Avatar>

                    <Stack spacing={0.25}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {member.name}
                      </Typography>

                      <Typography variant="caption" color="text.secondary">
                        {member.email}
                      </Typography>
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            )}
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
