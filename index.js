const {
  S3Client,
  ListObjectsCommand,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} = require('@aws-sdk/client-s3');
const uuid = require('uuid');

module.exports = class AWS_S3_Service {
  constructor(config) {
    if (!config) {
      throw new Error('config is required');
    }
    if (!config.bucket)
      throw new Error('bucket is required');

    if (!config.region)
      throw new Error('region is required');

    if (!config.folder)
      throw new Error('folder is required');

    if (!config.accessKey)
      throw new Error('accessKey is required');

    if (!config.secretKey)
      throw new Error('secretKey is required');


    this.bucket = config.bucket;
    this.region = config.region;
    this.folder = config.folder;
    this.accessKey = config.accessKey;
    this.secretKey = config.secretKey;

    this.client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.accessKey,
        secretAccessKey: this.secretKey,
      },
    });
  }
  // buffer: image buffer, ext: extension file
  async upload(buffer, ext) {
    const Key = `${this.folder}${uuid.v4()}.${ext}`;
    const uploadParams = {
      Bucket: this.bucket,
      Key: `${Key}`,
      Body: buffer,
    };
    const command = new PutObjectCommand(uploadParams);
    const response = await this.client.send(command);
    response.key = Key;
    return response;
  }

  // fileName: name of file
  async delete(fileName) {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: `${fileName}`,
    });
    return this.client.send(command);
  }

  async get(fileName) {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: fileName,
    });
    const response = await this.client.send(command);
    return response;
  }

  async list() {
    const command = new ListObjectsCommand({
      Bucket: this.bucket,
    });
    return this.client.send(command);
  }

};
