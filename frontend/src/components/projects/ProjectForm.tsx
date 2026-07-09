import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import type { Project } from "../../types";
import { ErrorState } from "../ui/Primitives";
import { Input, TextArea } from "../ui/FormFields";
import { Button } from "../ui/Button";


const schema = z.object({
  name: z.string().min(2, "Project name must be at least 2 characters"),
  description: z.string().optional(),
});
export type ProjectFormValues = z.infer<typeof schema>;

interface ProjectFormProps {
  project?: Project;
  onSubmit: (values: ProjectFormValues) => Promise<void>;
  onDone: () => void;
}

export const ProjectForm = ({ project, onSubmit, onDone }: ProjectFormProps) => {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: project?.name ?? "", description: project?.description ?? "" },
  });

  const submit = async (values: ProjectFormValues) => {
    setServerError(null);
    try {
      await onSubmit(values);
      onDone();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setServerError(err.response?.data?.message || "Could not save the project");
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      {serverError && <ErrorState message={serverError} />}
      <Input
        label="Project name"
        required
        placeholder="e.g. Client A"
        error={errors.name?.message}
        {...register("name")}
      />
      <TextArea
        label="Description"
        hint="Optional"
        placeholder="What is this project about?"
        error={errors.description?.message}
        {...register("description")}
      />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {project ? "Save changes" : "Create project"}
        </Button>
      </div>
    </form>
  );
};
