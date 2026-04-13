import { Button, Dropdown, ButtonGroup } from 'react-bootstrap';

interface ActionTableProps {
    onView?: () => void;
    onReplace?: () => void;
    onAdjust?: () => void;
    onDelete?: () => void;
    isDraft?: boolean;
}

export default function ActionTable({ onView, onReplace, onAdjust, onDelete, isDraft }: ActionTableProps) {
    return (
        <Dropdown as={ButtonGroup}>
            <Button variant="outline-primary" size="sm" onClick={onView} title="Xem chi tiết">
                <i className="ri-eye-line"></i>
            </Button>
            <Dropdown.Toggle split variant="outline-primary" size="sm" />
            <Dropdown.Menu>
                <Dropdown.Item onClick={onReplace}>
                    <i className="ri-repeat-line me-2 text-warning"></i> Thay thế
                </Dropdown.Item>
                <Dropdown.Item onClick={onAdjust}>
                    <i className="ri-edit-2-line me-2 text-info"></i> Điều chỉnh
                </Dropdown.Item>
                {isDraft && (
                    <>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={onDelete} className="text-danger">
                            <i className="ri-delete-bin-line me-2"></i> Xóa nháp
                        </Dropdown.Item>
                    </>
                )}
            </Dropdown.Menu>
        </Dropdown>
    );
}