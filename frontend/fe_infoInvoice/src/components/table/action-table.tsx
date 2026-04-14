import { Button } from 'react-bootstrap';

interface ActionTableProps {
    onView?: () => void;
    onUpdate?: () => void;
    onDelete?: () => void;
}

export default function ActionTable({ onView, onUpdate, onDelete }: ActionTableProps) {
    return (
        <div className="d-flex gap-1 flex-wrap">
            <Button size="sm" variant="outline-primary" onClick={onView}>
                <i className="ri-eye-line"></i>
            </Button>

            <Button size="sm" variant="outline-warning" onClick={onUpdate}>
                <i className="ri-pencil-line"></i>
            </Button>

            <Button size="sm" variant="outline-danger" onClick={onDelete}>
                <i className="ri-delete-bin-2-line"></i>
            </Button>
        </div>
    );
}