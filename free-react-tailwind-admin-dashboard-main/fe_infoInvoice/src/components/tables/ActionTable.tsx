import { EyeIcon, PencilIcon, TrashBinIcon } from "../../icons";

interface ActionTableProps {
  onView?: () => void;
  onUpdate?: () => void;
  onDelete?: () => void;
  disabled?: boolean;
}

export default function ActionTable({
  onView,
  onUpdate,
  onDelete,
  disabled = false,
}: ActionTableProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onView}
        disabled={disabled}
        className="text-gray-500 transition-colors hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400"
        aria-label="Xem"
        title="Xem"
      >
        <EyeIcon className="size-5 fill-current" />
      </button>

      <button
        onClick={onUpdate}
        disabled={disabled}
        className="text-gray-500 transition-colors hover:text-orange-500 dark:text-gray-400 dark:hover:text-orange-400"
        aria-label="Cập nhật"
        title="Cập nhật"
      >
        <PencilIcon className="size-5 fill-current" />
      </button>

      <button
        onClick={onDelete}
        disabled={disabled}
        className="text-gray-500 transition-colors hover:text-error-500 dark:text-gray-400 dark:hover:text-error-400"
        aria-label="Xóa"
        title="Xóa"
      >
        <TrashBinIcon className="size-5 fill-current" />
      </button>
    </div>
  );
}
