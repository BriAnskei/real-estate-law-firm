import PageMeta from "../../components/common/PageMeta";
import TaskTables from "../../components/tables/ProccessServer/TaskTable";
import useProcessServerTask from "../../hooks/proccessServer/useProccessServerTask";

export default function ProccessServerTaskPage() {
  const { tasksData, loading, filterTaskState } = useProcessServerTask();

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <>
      <PageMeta
        title="Task Management"
        description="View and manage all  the assign task"
      />
      <TaskTables
        Tasks={tasksData ?? []}
        formatDate={formatDate}
        isLoading={loading}
        setQuery={filterTaskState.setQuery}
        query={filterTaskState.query}
        clearFilter={filterTaskState.clearFilter}
      />
    </>
  );
}
