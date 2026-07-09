import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import type { Project } from "../../types";
import { ErrorState } from "../ui/Primitives";
import { Input, Select, TextArea } from "../ui/FormFields";
import { Button } from "../ui/Button";

const schema = z
  .object({
    weekStart: z.string().min(1, "Week start is required"),
    weekEnd: z.string().min(1, "Week end is required"),
    projectId: z.string().min(1, "Select a project"),
    tasksCompleted: z.string().min(1, "Tasks completed is required"),
    tasksPlanned: z.string().min(1, "Tasks planned is required"),
    blockers: z.string().optional(),
    hoursWorked: z
      .union([z.string().length(0), z.coerce.number().min(0).max(168)])
      .optional()
      .transform((v) => (v === "" || v === undefined ? undefined : Number(v))),
    notes: z.string().optional(),
  })
  .refine((data) => data.weekEnd >= data.weekStart, {
    message: "Week end must be on or after week start",
    path: ["weekEnd"],
  });

export type ReportFormSchema = z.infer<typeof schema>;

interface ReportFormProps {
  projects: Project[];
  defaultValues?: Partial<ReportFormSchema>;
  onSubmit: (values: ReportFormSchema) => Promise<void>;
  submitLabel?: string;
  readOnly?: boolean;
}

// Fixed field order — identical for every user, per the reporting spec.
export const ReportForm = ({
  projects,
  defaultValues,
  onSubmit,
  submitLabel = "Save draft",
  readOnly = false,
}: ReportFormProps) => {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ReportFormSchema>({
    resolver: zodResolver(schema) as Resolver<ReportFormSchema>,
    defaultValues,
  });

  const submit = async (values: ReportFormSchema) => {
    setServerError(null);
    try {
      await onSubmit(values);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setServerError(err.response?.data?.message || "Could not save the report");
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5">
      {serverError && <ErrorState message={serverError} />}

      <fieldset disabled={readOnly} className="space-y-5">
        {/* 1. Week / date range */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Week start"
            type="date"
            required
            error={errors.weekStart?.message}
            {...register("weekStart")}
          />
          <Input
            label="Week end"
            type="date"
            required
            error={errors.weekEnd?.message}
            {...register("weekEnd")}
          />
        </div>

        {/* 2. Project / category tag */}
        <Select
          label="Project / category"
          required
          error={errors.projectId?.message}
          {...register("projectId")}
        >
          <option value="">Select a project…</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </Select>

        {/* 3. Tasks completed */}
        <TextArea
          label="Tasks completed"
          required
          placeholder="What did you finish this week?"
          error={errors.tasksCompleted?.message}
          {...register("tasksCompleted")}
        />

        {/* 4. Tasks planned for next week */}
        <TextArea
          label="Tasks planned for next week"
          required
          placeholder="What's next?"
          error={errors.tasksPlanned?.message}
          {...register("tasksPlanned")}
        />

        {/* 5. Blockers / challenges */}
        <TextArea
          label="Blockers / challenges"
          hint="Leave blank if nothing is blocking you"
          error={errors.blockers?.message}
          {...register("blockers")}
        />

        {/* 6. Hours worked (optional) */}
        <Input
          label="Hours worked"
          type="number"
          step="0.5"
          min={0}
          max={168}
          hint="Optional"
          error={errors.hoursWorked?.message as string | undefined}
          {...register("hoursWorked")}
        />

        {/* 7. Optional notes or links */}
        <TextArea
          label="Notes or links"
          hint="Optional"
          error={errors.notes?.message}
          {...register("notes")}
        />
      </fieldset>

      {!readOnly && (
        <Button type="submit" isLoading={isSubmitting}>
          {submitLabel}
        </Button>
      )}
    </form>
  );
};
