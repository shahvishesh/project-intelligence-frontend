import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Autocomplete,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm, useWatch } from "react-hook-form";

import {
  dialogContentSx,
  dialogHeaderSx,
  dialogTitleSx,
} from "../../../components/page/pageStyles";
import {
  updateProjectMembers,
  type AvailableProjectMember,
  type ProjectDetails,
  type UpdateProjectMembersRequest,
} from "../api/projectApi";
import { queryClient } from "../../../app/queryClient";

interface ManageProjectMembersDialogProps {
  open: boolean;
  project: ProjectDetails;
  availableMembers: AvailableProjectMember[];
  onClose: () => void;
}

interface ManageProjectMembersForm {
  projectManagers: number[];
  projectMembers: number[];
}

export function ManageProjectMembersDialog({
  open,
  project,
  availableMembers,
  onClose,
}: ManageProjectMembersDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ManageProjectMembersForm>({
    defaultValues: {
      projectManagers: [],
      projectMembers: [],
    },
  });

  const projectManagers = useWatch({
    control,
    name: "projectManagers",
  });

  const projectMembers = useWatch({
    control,
    name: "projectMembers",
  });

  const updateMembersMutation = useMutation({
    mutationFn: (data: UpdateProjectMembersRequest) =>
      updateProjectMembers(project.id, data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["projects", project.id],
      });
      await queryClient.invalidateQueries({
        queryKey: ["projects", project.id, "available-members"],
      });

      onClose();
    },
  });

  useEffect(() => {
    if (!open) {
      updateMembersMutation.reset();
    }
  }, [open, updateMembersMutation]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const projectManagers = project.members
      .filter((member) =>
        member.roles.some((role) => role.name === "PROJECT_MANAGER"),
      )
      .map((member) => member.userId);

    const projectMembers = project.members
      .filter(
        (member) =>
          !member.roles.some((role) => role.name === "PROJECT_MANAGER"),
      )
      .map((member) => member.userId);

    reset({
      projectManagers,
      projectMembers,
    });
  }, [open, project, reset]);

  const onSubmit = (values: ManageProjectMembersForm) => {
    updateMembersMutation.mutate({
      projectManagers: values.projectManagers,
      projectMembers: values.projectMembers,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!updateMembersMutation.isPending) {
          onClose();
        }
      }}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle sx={dialogHeaderSx}>
        <Stack spacing={0.25}>
          <Typography variant="h5" sx={dialogTitleSx}>
            Manage members
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Assign project managers and members.
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent sx={dialogContentSx}>
        <Stack spacing={2.5}>
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
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Project managers"
                      placeholder="Select managers"
                      error={!!errors.projectManagers}
                      helperText={errors.projectManagers?.message}
                    />
                  )}
                />
              );
            }}
          />

          <Controller
            name="projectMembers"
            control={control}
            rules={{
              validate: (value) => {
                const hasOverlap = value.some((userId) =>
                  projectManagers.includes(userId),
                );

                return (
                  !hasOverlap ||
                  "A user cannot be both a project manager and project member"
                );
              },
            }}
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
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Project members"
                      placeholder="Select members"
                      error={!!errors.projectMembers}
                      helperText={errors.projectMembers?.message}
                    />
                  )}
                />
              );
            }}
          />
        </Stack>

        {updateMembersMutation.isError && (
          <FormHelperText error>
            {updateMembersMutation.error.message}
          </FormHelperText>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={updateMembersMutation.isPending}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          loading={updateMembersMutation.isPending}
        >
          Save changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
