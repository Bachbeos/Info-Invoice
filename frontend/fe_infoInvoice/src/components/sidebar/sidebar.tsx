import { Nav, Dropdown } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import 'simplebar-react/dist/simplebar.min.css';
import SimpleBar from 'simplebar-react';

export default function Sidebar() {
    return (
        <div className="d-flex flex-column flex-shrink-0 p-3 bg-white border-end shadow-sm" style={{ width: '280px', height: '100vh' }}>
            <NavLink
                to="/"
                className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none border-bottom pb-3 w-100"
            >
                <i className="ri-box-3-line fs-4 me-2 text-primary"></i>
                <span className="fs-5 fw-bold">Info ERP</span>
            </NavLink>

            <SimpleBar style={{ maxHeight: 'calc(100vh - 160px)' }} className="flex-grow-1 mt-3">
                <Nav variant="pills" className="flex-column mb-auto">
                    <Nav.Item className="mb-1">
                        <NavLink
                            to="/invoice"
                            className={({ isActive }) =>
                                `nav-link d-flex align-items-center ${isActive ? 'active' : 'link-dark hover-light'}`
                            }
                        >
                            <i className="ri-file-list-3-line me-2"></i>
                            Danh sách hóa đơn
                        </NavLink>
                    </Nav.Item>
                </Nav>
            </SimpleBar>

            {/* <hr className="text-muted" /> */}

            {/* <Dropdown>
                <Dropdown.Toggle
                    variant="white"
                    id="dropdown-user"
                    className="d-flex align-items-center link-dark text-decoration-none w-100 border-0 bg-transparent p-0"
                >
                    <img
                        src="https://github.com/mdo.png"
                        alt="user"
                        width="32"
                        height="32"
                        className="rounded-circle me-2 shadow-sm"
                    />
                    <div className="text-start flex-grow-1">
                        <div className="fw-bold small">Admin</div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>Quản trị viên</div>
                    </div>
                </Dropdown.Toggle>

                <Dropdown.Menu className="shadow border-0 mt-2">
                    <Dropdown.Item href="#/settings">
                        <i className="ri-settings-4-line me-2"></i>Cài đặt
                    </Dropdown.Item>
                    <Dropdown.Item href="#/profile">
                        <i className="ri-user-settings-line me-2"></i>Hồ sơ
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item href="#/signout" className="text-danger">
                        <i className="ri-logout-box-r-line me-2"></i>Đăng xuất
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown> */}
        </div>
    );
};