import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Box,
  Chip,
  Paper,
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
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  dataTableActionsCellSx,
  dataTableContainerSx,
  dataTableEmptyStateCellSx,
  dataTableHeadRowSx,
  dataTablePrimaryCellSx,
} from "../../../components/table/tableStyles";
import {
  pageContentPaperSx,
  pageHeaderPaperSx,
  pageHeaderTitleSx,
} from "../../../components/page/pageStyles";
import { getProjects } from "../../../features/projects/api/projectApi";
import { getProjectStatusColor } from "../../../features/projects/utils/projectStatus";

export const Route = createFileRoute("/_authenticated/projects/")({
  component: ProjectsPage,
});

function ProjectsPage() {
  const navigate = useNavigate();

  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  return (
    <Box>
      <Paper variant="outlined" sx={pageHeaderPaperSx}>
        <Stack spacing={0.25}>
          <Typography variant="h5" sx={pageHeaderTitleSx}>
            Projects
          </Typography>

          <Typography variant="body2" color="text.secondary">
            View and manage your projects.
          </Typography>
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={pageContentPaperSx}>
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
      </Paper>
    </Box>
  );
}
