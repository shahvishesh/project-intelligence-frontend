import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm, useWatch } from "react-hook-form";

import { queryClient } from "../../../app/queryClient";
import {
  dialogContentSx,
  dialogHeaderSx,
  dialogTitleSx,
} from "../../../components/page/pageStyles";
import {
  PROJECT_STATUSES,
  updateProject,
  type ProjectDetails,
  type ProjectStatus,
  type UpdateProjectRequest,
} from "../api/projectApi";

interface EditProjectDialogProps {
  open: boolean;
  project: ProjectDetails;
  onClose: () => void;
}

interface EditProjectForm {
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
}

export function EditProjectDialog({
  open,
  project,
  onClose,
}: EditProjectDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<EditProjectForm>({
    defaultValues: {
      name: project.name,
      description: project.description ?? "",
      status: project.status,
      startDate: dayjs(project.startDate),
      endDate: project.endDate ? dayjs(project.endDate) : null,
    },
  });

  const startDate = useWatch({
    control,
    name: "startDate",
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    reset({
      name: project.name,
      description: project.description ?? "",
      status: project.status,
      startDate: dayjs(project.startDate),
      endDate: project.endDate ? dayjs(project.endDate) : null,
    });
  }, [open, project, reset]);

  const updateProjectMutation = useMutation({
    mutationFn: (data: UpdateProjectRequest) => updateProject(project.id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["projects"],
      });

      onClose();
    },
  });

  const { reset: resetUpdateProjectMutation } = updateProjectMutation;

  useEffect(() => {
    if (open) {
      resetUpdateProjectMutation();
    }
  }, [open, resetUpdateProjectMutation]);

  const onSubmit = (values: EditProjectForm) => {
    const name = values.name.trim();
    const description = values.description.trim() || null;

    const originalStartDate = dayjs(project.startDate);

    const originalEndDate = project.endDate ? dayjs(project.endDate) : null;

    const startDateChanged = !values.startDate?.isSame(
      originalStartDate,
      "day",
    );

    const endDateChanged =
      originalEndDate === null
        ? values.endDate !== null
        : values.endDate === null ||
          !values.endDate.isSame(originalEndDate, "day");

    const data: UpdateProjectRequest = {};

    if (name !== project.name) {
      data.name = name;
    }

    if (description !== project.description) {
      data.description = description;
    }

    if (values.status !== project.status) {
      data.status = values.status;
    }

    if (startDateChanged) {
      data.startDate = values.startDate?.format("YYYY-MM-DD");
    }

    if (endDateChanged) {
      data.endDate = values.endDate?.format("YYYY-MM-DD") ?? null;
    }

    if (Object.keys(data).length === 0) {
      onClose();
      return;
    }

    updateProjectMutation.mutate(data);
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!updateProjectMutation.isPending) {
          onClose();
        }
      }}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle sx={dialogHeaderSx}>
        <Stack spacing={0.25}>
          <Typography variant="h5" sx={dialogTitleSx}>
            Edit project
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Update the project details and status.
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent sx={dialogContentSx}>
        <Stack spacing={2.5}>
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
            name="status"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Status"
                fullWidth
                error={!!errors.status}
                helperText={errors.status?.message}
              >
                {PROJECT_STATUSES.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          {updateProjectMutation.isError && (
            <FormHelperText error>
              {updateProjectMutation.error.message}
            </FormHelperText>
          )}

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
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={updateProjectMutation.isPending}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          loading={updateProjectMutation.isPending}
        >
          Save changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
