const rootUsername = process.env.MONGO_INITDB_ROOT_USERNAME;
const rootPassword = process.env.MONGO_INITDB_ROOT_PASSWORD;
const dbName = process.env.MONGO_INITDB_DATABASE;

db = db.getSiblingDB("admin");
db.auth(rootUsername, rootPassword);

// event-reward 데이터베이스 생성 및 사용자 권한 설정
db = db.getSiblingDB(dbName);
db.createUser({
    user: rootUsername,
    pwd: rootPassword,
    roles: [{ role: "readWrite", db: dbName }],
});
