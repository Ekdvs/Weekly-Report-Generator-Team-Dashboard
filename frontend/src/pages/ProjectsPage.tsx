import { useState } from "react";
import { PlusCircle, Pencil, Trash2, Users } from "lucide-react";
import { useProjects } from "../hooks/useProjects";
import type { Project } from "../types";
import { createProjectRequest, deleteProjectRequest, updateProjectRequest } from "../api/project.api";
import { Topbar } from "../components/layout/Topbar";
import { Button } from "../components/ui/Button";
import { Card, EmptyState, ErrorState, Spinner } from "../components/ui/Primitives";
import { Modal } from "../components/ui/Modal";
import { ProjectForm } from "../components/projects/ProjectForm";
import { MembersPanel } from "../components/projects/MembersPanel";


export const ProjectsPage = () => {
  const { projects, isLoading, error, refetch } = useProjects();
  const [formModal, setFormModal] = useState<{ open: boolean; project?: Project }>({
    open: false,
  });
  const [membersModal, setMembersModal] = useState<Project | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleCreateOrUpdate = async (values: { name: string; description?: string }) => {
    if (formModal.project) {
      await updateProjectRequest(formModal.project.id, values);
    } else {
      await createProjectRequest(values);
    }
    refetch();
  };

  const handleDelete = async (project: Project) => {
    if (!window.confirm(`Delete "${project.name}"? This can't be undone.`)) return;
    setDeleteError(null);
    try {
      await deleteProjectRequest(project.id);
      refetch();
    } catch (err: any) {
      setDeleteError(err.response?.data?.message || "Could not delete this project");
    }
  };

  return (
    <>
      <Topbar title="Projects" subtitle="Manage work categories and team assignments" />

      <div className="p-8">
        <div className="mb-6 flex justify-end">
          <Button onClick={() => setFormModal({ open: true })}>
            <PlusCircle className="h-4 w-4" />
            New project
          </Button>
        </div>

        {isLoading && <Spinner />}
        {error && <ErrorState message={error} />}
        {deleteError && (
          <div className="mb-4">
            <ErrorState message={deleteError} />
          </div>
        )}

        {!isLoading && !error && projects.length === 0 && (
          <EmptyState
            title="No projects yet"
            description="Create a project so team members can tag their weekly reports."
            action={<Button onClick={() => setFormModal({ open: true })}>Create a project</Button>}
          />
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display text-sm font-semibold text-ink">{project.name}</h3>
                  {project.description && (
                    <p className="mt-1 text-sm text-ink-soft">{project.description}</p>
                  )}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-ink-soft">
                <span>{project._count?.reports ?? 0} reports</span>
                <span>{project.members?.length ?? 0} members</span>
              </div>

              <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
                <Button size="sm" variant="secondary" onClick={() => setMembersModal(project)}>
                  <Users className="h-3.5 w-3.5" />
                  Members
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setFormModal({ open: true, project })}
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(project)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Modal
        isOpen={formModal.open}
        onClose={() => setFormModal({ open: false })}
        title={formModal.project ? "Edit project" : "New project"}
      >
        <ProjectForm
          project={formModal.project}
          onSubmit={handleCreateOrUpdate}
          onDone={() => setFormModal({ open: false })}
        />
      </Modal>

      <Modal
        isOpen={!!membersModal}
        onClose={() => setMembersModal(null)}
        title={`Team members — ${membersModal?.name ?? ""}`}
      >
        {membersModal && (
          <MembersPanel
            project={membersModal}
            onUpdated={(updated) => {
              setMembersModal(updated);
              refetch();
            }}
          />
        )}
      </Modal>
    </>
  );
};
