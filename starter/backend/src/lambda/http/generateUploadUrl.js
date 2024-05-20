import { getUploadUrl } from '../../fileStorage/attachmentUtils';

export async function handler(event, context) {
  const attachmentId = event.pathParameters.attachmentId;

  try {
    const uploadUrl = getUploadUrl(attachmentId);
    console.log(`Generated upload URL for attachment ${attachmentId}`);
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadUrl,
      }),
    };
  } catch (error) {
    console.error(`Error generating upload URL for attachment ${attachmentId}`, error);
    
    return {
      statusCode: 500,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
      body: JSON.stringify({
        error: 'Failed to generate upload URL',
      }),
    };
  }
}