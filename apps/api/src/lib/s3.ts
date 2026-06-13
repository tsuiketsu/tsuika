import { S3Client } from "bun";

const s3 = new S3Client({
  endpoint: "http://localhost:9000",
  accessKeyId: "rustfsadmin",
  secretAccessKey: "rustfsadmin",
  bucket: "tsuika",
  region: "us-east-1",
});

export { s3 };
