import { Tabs, Tab, Card, CardBody, Button } from "@heroui/react"
import { useState } from "react"

const AdminActions = () => {
    const [adminActions, setAdminActions] = useState(false);

    return (
        <div>

            <h1>Admin Actions</h1>
            <Tabs aria-label="Opciones" color="primary" variant="bordered">
                <Tab key="currency" title="Currency">
                    <Card>
                        <CardBody>
                            <h2>Gestion de DigitalCurrency</h2>
                            <Button color="primary" variant="flat" onPress={() => { }}>Mint</Button>
                            <Button color="danger" variant="flat" onPress={() => { }}>Burn</Button>
                            <Button color="warning" variant="flat" onPress={() => { }}>Transfer</Button>
                        </CardBody>
                    </Card>
                </Tab>
                <Tab key="assets" title="Assets">
                    <Card>
                        <CardBody>
                            <h2>Gestion de DigitalAssets</h2>
                            <Button color="primary" variant="flat" onPress={() => { }}>Mint</Button>
                            <Button color="danger" variant="flat" onPress={() => { }}>Burn</Button>
                            <Button color="warning" variant="flat" onPress={() => { }}>Transfer</Button>
                        </CardBody>
                    </Card>
                </Tab>
            </Tabs>
        </div>
    )
}

export default AdminActions