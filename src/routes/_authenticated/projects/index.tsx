import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Box,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  dataTableActionsCellSx,
  dataTableContainerSx,
  dataTableEmptyStateCellSx,
  dataTableHeadRowSx,
  dataTablePrimaryCellSx,
} from "../../../components/table/tableStyles";
import { pageHeaderTitleSx } from "../../../components/page/pageStyles";
import { getProjects } from "../../../features/projects/api/projectApi";
import { getProjectStatusColor } from "../../../features/projects/utils/projectStatus";
import { useAuthorization } from "../../../features/auth/hooks/useAuthorization";

export const Route = createFileRoute("/_authenticated/projects/")({
  component: ProjectsPage,
});

function ProjectsPage() {
  const navigate = useNavigate();
  const { can } = useAuthorization();

  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  return (
    <Box>
      <Box
        sx={{
          px: { xs: 1, sm: 2 },
          pt: { xs: 1, sm: 2 },
          pb: 3,
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <Stack spacing={0.25}>
            <Typography variant="h5" sx={pageHeaderTitleSx}>
              Projects
            </Typography>

            <Typography variant="body2" color="text.secondary">
              View and manage your projects.
            </Typography>
          </Stack>

          {can("PROJECT_CREATE") && (
            <Button
              variant="contained"
              sx={{
                bgcolor: "brand.cta",
                color: "secondary.contrastText",
                "&:hover": {
                  bgcolor: "brand.ctaHover",
                },
              }}
              onClick={() =>
                navigate({
                  to: "/projects/create",
                })
              }
            >
              Create project
            </Button>
          )}
        </Stack>
      </Box>

      <Box>
        {projectsQuery.isPending && (
          <Box sx={{ p: 3 }}>
            <Typography color="text.secondary">Loading projects...</Typography>
          </Box>
        )}

        {projectsQuery.isError && (
          <Box sx={{ p: 3 }}>
            <Typography color="error">{projectsQuery.error.message}</Typography>
          </Box>
        )}

        {projectsQuery.data && (
          <TableContainer component={Box} sx={dataTableContainerSx}>
            <Table>
              <TableHead>
                <TableRow sx={dataTableHeadRowSx}>
                  <TableCell>Project</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Start date</TableCell>
                  <TableCell>End date</TableCell>
                  <TableCell sx={dataTableActionsCellSx}>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {projectsQuery.data.map((project) => (
                  <TableRow key={project.id} hover>
                    <TableCell sx={dataTablePrimaryCellSx}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                        }}
                      >
                        {project.name}
                      </Typography>
                    </TableCell>

                    <TableCell sx={{ maxWidth: 320 }}>
                      {project.description ? (
                        <Tooltip title={project.description}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            noWrap
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {project.description}
                          </Typography>
                        </Tooltip>
                      ) : (
                        "—"
                      )}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={project.status}
                        size="small"
                        color={getProjectStatusColor(project.status)}
                        sx={
                          project.status === "ACTIVE"
                            ? {
                                bgcolor: "status.active",
                                color: "status.activeText",
                              }
                            : project.status === "PLANNED"
                              ? {
                                  bgcolor: "status.planned",
                                  color: "status.plannedText",
                                }
                              : undefined
                        }
                      />
                    </TableCell>

                    <TableCell>
                      {new Date(project.startDate).toLocaleDateString()}
                    </TableCell>

                    <TableCell>
                      {project.endDate
                        ? new Date(project.endDate).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell sx={dataTableActionsCellSx}>
                      <Tooltip title="View project">
                        <IconButton
                          onClick={() =>
                            navigate({
                              to: "/projects/$projectId",
                              params: {
                                projectId: String(project.id),
                              },
                            })
                          }
                          size="small"
                          aria-label={`View ${project.name}`}
                        >
                          <VisibilityOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}

                {projectsQuery.data.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      align="center"
                      sx={dataTableEmptyStateCellSx}
                    >
                      No projects found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
}
