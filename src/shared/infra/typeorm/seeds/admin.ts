import { hash } from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

import createConnection from "../connection";

(async () => {
  const connection = await createConnection();

  const id = uuidv4();
  const password = await hash("admin", 8);

  await connection.query(
    `INSERT INTO USERS(id, name, email, password, admin, driver_license, created_at) 
    values ('${id}', 'admin', 'admin@rentx.com.br', '${password}', true, 'admin_license', now())`
  );
})().then(() => console.log("> admin created successfully"));
