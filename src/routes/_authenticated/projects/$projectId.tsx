import { useState } from "react";

import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PeopleIcon from "@mui/icons-material/People";
import {
  Avatar,
  AvatarGroup,
  Box,
  Chip,
  Divider,
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
import {
  deleteProject,
  getProject,
} from "../../../features/projects/api/projectApi";
import { EditProjectDialog } from "../../../features/projects/components/EditProjectDialog";
import { ProjectMembersDialog } from "../../../features/projects/components/ProjectMembersDialog";
import { useProjectAccess } from "../../../features/projects/hooks/useProjectAccess";
import { getProjectStatusColor } from "../../../features/projects/utils/projectStatus";
import { useAvailableProjectMembers } from "../../../features/projects/hooks/useAvailableProjectMembers";
import { ManageProjectMembersDialog } from "../../../features/projects/components/ManageProjectMembersDialog";
import { queryClient } from "../../../app/queryClient";
import { DeleteProjectDialog } from "../../../features/projects/components/DeleteProjectDialog";

export const Route = createFileRoute("/_authenticated/projects/$projectId")({
  component: ProjectDetailsPage,
});

function ProjectDetailsPage() {
  const { projectId } = Route.useParams();
  const navigate = useNavigate();

  const [membersDialogOpen, setMembersDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [manageMembersDialogOpen, setManageMembersDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const projectQuery = useQuery({
    queryKey: ["projects", Number(projectId)],
    queryFn: () => getProject(Number(projectId)),
  });

  const projectAccessQuery = useProjectAccess(Number(projectId));
  const availableMembersQuery = useAvailableProjectMembers(Number(projectId));
  const deleteProjectMutation = useMutation({
    mutationFn: () => deleteProject(Number(projectId)),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["projects"],
      });

      navigate({
        to: "/projects",
      });
    },
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

  const canUpdate = projectAccessQuery.can("PROJECT_UPDATE");
  const canManageMembers = projectAccessQuery.can("PROJECT_MANAGE_MEMBERS");
  const canDelete = projectAccessQuery.can("PROJECT_DELETE");
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
            <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
              <Typography variant="h5" sx={pageHeaderTitleSx}>
                {project.name}
              </Typography>

              {canUpdate && (
                <Tooltip title="Edit project">
                  <IconButton
                    size="small"
                    aria-label="Edit project"
                    onClick={() => setEditDialogOpen(true)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}

              {canUpdate && canDelete && (
                <Divider orientation="vertical" flexItem sx={{ mx: 0.25 }} />
              )}

              {canDelete && (
                <Tooltip title="Delete project">
                  <IconButton
                    size="small"
                    color="error"
                    aria-label="Delete project"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>

            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
              {canManageMembers && (
                <Tooltip title="Manage members">
                  <IconButton
                    size="small"
                    aria-label="Manage members"
                    onClick={() => setManageMembersDialogOpen(true)}
                  >
                    <PeopleIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}

              {project.members.length > 0 && (
                <>
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
                </>
              )}
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Chip
              label={project.status}
              size="small"
              color={getProjectStatusColor(project.status)}
            />

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

      <EditProjectDialog
        open={editDialogOpen}
        project={project}
        onClose={() => setEditDialogOpen(false)}
      />

      <ManageProjectMembersDialog
        open={manageMembersDialogOpen}
        project={project}
        availableMembers={availableMembersQuery.data ?? []}
        onClose={() => setManageMembersDialogOpen(false)}
      />

      <DeleteProjectDialog
        open={deleteDialogOpen}
        projectName={project.name}
        isDeleting={deleteProjectMutation.isPending}
        errorMessage={
          deleteProjectMutation.isError
            ? deleteProjectMutation.error.message
            : undefined
        }
        onClose={() => {
          setDeleteDialogOpen(false);
        }}
        onConfirm={() => {
          deleteProjectMutation.mutate();
        }}
      />
    </Box>
  );
}
