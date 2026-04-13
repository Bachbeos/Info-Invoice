import { Navbar, Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { clearToken } from '../../utils/token';

export default function Header() {
    const navigate = useNavigate();

    const handleLogout = () => {
        clearToken();
        navigate("/login", { replace: true });
    };

    return (
        <Navbar bg="white" className="py-2 px-4 shadow-sm border-bottom">
            <Container fluid className="d-flex justify-content-end">
                <Button variant="outline-danger" size="sm" onClick={handleLogout}>
                    <i className="ri-logout-box-r-line me-1"></i>
                    Đăng xuất
                </Button>
            </Container>
        </Navbar>
    );
};