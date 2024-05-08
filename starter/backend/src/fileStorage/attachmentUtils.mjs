import * as AWS from 'aws-sdk';
import { createLogger } from '../utils/logger';

const logger = createLogger('attachmentUtils');
const s3 = new AWS.S3();
const bucketName = process.env.ATTACHMENTS_S3_BUCKET;
const urlExpiration = process.env.SIGNED_URL_EXPIRATION;

export function getAttachmentUrl(attachmentId: string): string {
  return `https://${bucketName}.s3.amazonaws.com/${attachmentId}`;
}

export function getUploadUrl(attachmentId: string): string {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: attachmentId,
    Expires: parseInt(urlExpiration),
  });
}

export async function deleteAttachment(attachmentId: string) {
  try {
    await s3
      .deleteObject({
        Bucket: bucketName,
        Key: attachmentId,
      })
      .promise();
    logger.info(`Attachment ${attachmentId} deleted`);
  } catch (error) {
    logger.error(`Error deleting attachment ${attachmentId}`, { error });
    throw new Error('Error deleting attachment');
  }
}