  import admin, { ServiceAccount } from "firebase-admin";
  import serviceAccount from "../real-estate-law-firm-firebase-adminsdk-fbsvc-eadd334827.json" with { type: "json" };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
  });

  export default admin;
