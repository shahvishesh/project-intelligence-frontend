import { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {
  Avatar,
  AvatarGroup,
  Box,
  Chip,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  pageContentPaperSx,
  pageHeaderPaperSx,
  pageHeaderTitleSx,
} from "../../../components/page/pageStyles";
import { getProject } from "../../../features/projects/api/projectApi";
import { ProjectMembersDialog } from "../../../features/projects/components/ProjectMembersDialog";

export const Route = createFileRoute("/_authenticated/projects/$projectId")({
  component: ProjectDetailsPage,
});

function ProjectDetailsPage() {
  const { projectId } = Route.useParams();

  const [membersDialogOpen, setMembersDialogOpen] = useState(false);

  const projectQuery = useQuery({
    queryKey: ["projects", Number(projectId)],
    queryFn: () => getProject(Number(projectId)),
  });

  if (projectQuery.isPending) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="text.secondary">Loading project...</Typography>
      </Box>
    );
  }

  if (projectQuery.isError) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{projectQuery.error.message}</Typography>
      </Box>
    );
  }

  const project = projectQuery.data;
  const startDate = new Date(project.startDate).toLocaleDateString();
  const endDate = project.endDate
    ? new Date(project.endDate).toLocaleDateString()
    : null;

  return (
    <Box>
      <Paper variant="outlined" sx={pageHeaderPaperSx}>
        <Stack spacing={0.25}>
          <Stack
            direction="row"
            sx={{
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Typography variant="h5" sx={pageHeaderTitleSx}>
              {project.name}
            </Typography>

            {project.members.length > 0 && (
              <Stack
                direction="row"
                spacing={1.5}
                sx={{ alignItems: "center" }}
              >
                <AvatarGroup
                  max={5}
                  sx={{
                    justifyContent: "flex-start",
                  }}
                >
                  {project.members.map((member) => (
                    <Tooltip key={member.userId} title={member.name}>
                      <Avatar alt={member.name}>
                        {member.name.charAt(0).toUpperCase()}
                      </Avatar>
                    </Tooltip>
                  ))}
                </AvatarGroup>

                <Tooltip title="View members">
                  <IconButton
                    size="small"
                    aria-label="View members"
                    onClick={() => setMembersDialogOpen(true)}
                  >
                    <ArrowForwardIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            )}
          </Stack>

          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Chip label={project.status} size="small" />

            <Typography variant="body2" color="text.secondary">
              {endDate ? `${startDate} - ${endDate}` : startDate}
            </Typography>
          </Stack>
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={pageContentPaperSx}>
        <Stack spacing={3} sx={{ p: 3 }}>
          <Box>
            <Stack spacing={1.5}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Description
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {project.description || "No description"}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Paper>

      <ProjectMembersDialog
        open={membersDialogOpen}
        members={project.members}
        onClose={() => setMembersDialogOpen(false)}
      />
    </Box>
  );
}
