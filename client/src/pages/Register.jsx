import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap"
// prettier

function Register() {

    const { registerInfo, updateRegisterInfo, registerUser, registerError, isregisterLoading } = useContext(AuthContext)
    return <>
        <Form onSubmit={registerUser} >
            <Row style={{
                height: "100vh",
                justifyContent: "center",
                paddingTop: "10%",
            }}>
                <Col xs={6}>
                    <Stack gap={3}>
                        <h2>Register</h2>
                        <Form.Control type="text" placeholder="Name" onChange={(e) => updateRegisterInfo({ ...registerInfo, name: e.target.value })} />
                        {/* ...registerInfo : ở đây là lấy lại tất cả các tk email pass name trước, nếu ko có nó sẽ mất mấy tk kia */}
                        <Form.Control type="email" placeholder="Email" onChange={(e) => updateRegisterInfo({ ...registerInfo, email: e.target.value })} />
                        <Form.Control type="password" placeholder="Password" onChange={(e) => updateRegisterInfo({ ...registerInfo, password: e.target.value })} />

                        <Button variant="primary" type="submit">
                            {isregisterLoading ? "Register thành công" : "Register"}
                        </Button>

                        {
                            // nếu đăng ký ko lỗi gì thì ko hiện thông báo
                            registerError?.error &&
                            <Alert variant="danger"><p>{registerError?.message}</p></Alert>
                        }

                    </Stack>
                </Col>
            </Row>
        </Form>
    </>
}

export default Register
