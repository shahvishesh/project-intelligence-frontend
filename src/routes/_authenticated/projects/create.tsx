import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";

import type { Dayjs } from "dayjs";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm, useWatch } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import {
  pageContentPaperSx,
  pageHeaderPaperSx,
  pageHeaderTitleSx,
} from "../../../components/page/pageStyles";
import {
  createProject,
  type CreateProjectRequest,
} from "../../../features/projects/api/projectApi";
import { getCurrentUser } from "../../../features/auth/api/authApi";
import { useCreateProjectAvailableMembers } from "../../../features/projects/hooks/useCreateProjectAvailableMembers";
import { queryClient } from "../../../app/queryClient";

export const Route = createFileRoute("/_authenticated/projects/create")({
  beforeLoad: async ({ context }) => {
    const currentUser = await context.queryClient.query({
      queryKey: ["auth", "me"],
      queryFn: getCurrentUser,
    });

    if (!currentUser.systemPermissions.includes("PROJECT_CREATE")) {
      throw redirect({
        to: "/forbidden",
      });
    }
  },
  component: CreateProjectPage,
});

interface CreateProjectForm {
  name: string;
  description: string;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  projectManagers: number[];
  projectMembers: number[];
}

function CreateProjectPage() {
  const navigate = useNavigate();

  const {
    data: availableMembers = [],
    isLoading: isLoadingMembers,
    isError: isMembersError,
  } = useCreateProjectAvailableMembers();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProjectForm>({
    defaultValues: {
      name: "",
      description: "",
      startDate: null,
      endDate: null,
      projectManagers: [],
      projectMembers: [],
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: (data: CreateProjectRequest) => createProject(data),

    onSuccess: async (project) => {
      await queryClient.invalidateQueries({
        queryKey: ["projects"],
      });

      navigate({
        to: "/projects/$projectId",
        params: {
          projectId: String(project.id),
        },
      });
    },
  });

  const startDate = useWatch({
    control,
    name: "startDate",
  });

  const projectManagers = useWatch({
    control,
    name: "projectManagers",
  });

  const projectMembers = useWatch({
    control,
    name: "projectMembers",
  });

  useEffect(() => {
    reset({
      name: "",
      description: "",
      startDate: null,
      endDate: null,
      projectManagers: [],
      projectMembers: [],
    });
  }, [reset]);

  const onSubmit = (values: CreateProjectForm) => {
    const data: CreateProjectRequest = {
      name: values.name.trim(),
      description: values.description.trim() || undefined,
      startDate: values.startDate!.format("YYYY-MM-DD"),
      projectManagers: values.projectManagers,
      projectMembers: values.projectMembers,
      ...(values.endDate
        ? {
            endDate: values.endDate.format("YYYY-MM-DD"),
          }
        : {}),
    };

    createProjectMutation.mutate(data);
  };

  return (
    <Box>
      <Paper variant="outlined" sx={pageHeaderPaperSx}>
        <Stack spacing={0.25}>
          <Typography variant="h5" sx={pageHeaderTitleSx}>
            Create project
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Create a new project.
          </Typography>
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={pageContentPaperSx}>
        <Stack spacing={2.5} sx={{ p: 3 }}>
          <TextField
            label="Project name"
            fullWidth
            {...register("name", {
              validate: (value) =>
                value.trim().length > 0 || "Project name is required",
            })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <TextField
            label="Description"
            fullWidth
            multiline
            minRows={3}
            {...register("description")}
          />

          <Controller
            name="startDate"
            control={control}
            rules={{
              required: "Start date is required",
            }}
            render={({ field }) => (
              <DatePicker
                label="Start date"
                format="DD/MM/YYYY"
                value={field.value}
                onChange={(value) => field.onChange(value)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.startDate,
                    helperText: errors.startDate?.message,
                  },
                }}
              />
            )}
          />

          <Controller
            name="endDate"
            control={control}
            rules={{
              validate: (value) => {
                if (!value || !startDate) {
                  return true;
                }

                return (
                  !value.isBefore(startDate, "day") ||
                  "End date cannot be before start date"
                );
              },
            }}
            render={({ field }) => (
              <DatePicker
                label="End date"
                format="DD/MM/YYYY"
                value={field.value}
                minDate={startDate ?? undefined}
                onChange={(value) => field.onChange(value)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.endDate,
                    helperText: errors.endDate?.message,
                  },
                }}
              />
            )}
          />

          <Controller
            name="projectManagers"
            control={control}
            render={({ field }) => {
              const selectedMembers = availableMembers.filter((member) =>
                field.value.includes(member.id),
              );

              return (
                <Autocomplete
                  multiple
                  disableCloseOnSelect
                  options={availableMembers}
                  value={selectedMembers}
                  onChange={(_, values) => {
                    field.onChange(values.map((member) => member.id));
                  }}
                  getOptionLabel={(member) =>
                    `${member.name} (${member.email})`
                  }
                  renderOption={(props, member, { selected }) => (
                    <li {...props}>
                      <Checkbox checked={selected} sx={{ mr: 1 }} />
                      {`${member.name} (${member.email})`}
                    </li>
                  )}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  getOptionDisabled={(option) =>
                    projectMembers.includes(option.id)
                  }
                  loading={isLoadingMembers}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Project managers"
                      placeholder="Select managers"
                      error={isMembersError}
                      helperText={
                        isMembersError
                          ? "Failed to load available members"
                          : undefined
                      }
                    />
                  )}
                />
              );
            }}
          />

          <Controller
            name="projectMembers"
            control={control}
            render={({ field }) => {
              const selectedMembers = availableMembers.filter((member) =>
                field.value.includes(member.id),
              );

              return (
                <Autocomplete
                  multiple
                  disableCloseOnSelect
                  options={availableMembers}
                  value={selectedMembers}
                  onChange={(_, values) => {
                    field.onChange(values.map((member) => member.id));
                  }}
                  getOptionLabel={(member) =>
                    `${member.name} (${member.email})`
                  }
                  renderOption={(props, member, { selected }) => (
                    <li {...props}>
                      <Checkbox checked={selected} sx={{ mr: 1 }} />
                      {`${member.name} (${member.email})`}
                    </li>
                  )}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  getOptionDisabled={(option) =>
                    projectManagers.includes(option.id)
                  }
                  loading={isLoadingMembers}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Project members"
                      placeholder="Select members"
                      error={isMembersError}
                      helperText={
                        isMembersError
                          ? "Failed to load available members"
                          : undefined
                      }
                    />
                  )}
                />
              );
            }}
          />

          {createProjectMutation.isError && (
            <Typography variant="body2" color="error">
              {createProjectMutation.error.message}
            </Typography>
          )}

          <Stack
            direction="row"
            sx={{
              justifyContent: "flex-end",
              gap: 1,
            }}
          >
            <Button
              onClick={() =>
                navigate({
                  to: "/projects",
                })
              }
              disabled={createProjectMutation.isPending}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={handleSubmit(onSubmit)}
              loading={createProjectMutation.isPending}
            >
              Create project
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
