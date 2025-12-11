import axios from 'axios'
import type { AxiosProgressEvent, AxiosResponse } from 'axios'
import Cookies from 'js-cookie'

/**
 * Uploads a file and reports the upload progress percentage.
 * @param url The URL to upload the file to.
 * @param formData The form-data to upload.
 * @param onProgress A callback function to receive the progress percentage (0-100).
 * @returns A promise that resolves to the Axios response data.
 */
function uploadFileWithProgress(
  url: string,
  formData: FormData,
  onProgress: (percentage: number) => void,
): Promise<AxiosResponse> {
  return axios
    .post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-CSRFToken': Cookies.get('csrftoken'),
      },
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        if (progressEvent.total) {
          const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(percentage)
        }
      },
    })
    .then((response) => {
      // Upload successful, set to 100%
      onProgress(100)

      return response.data
    })
    .catch((error) => {
      if (axios.isAxiosError(error)) {
        console.log('Upload failed: ', error.message)
      } else {
        console.log('Unknown error:', error)
      }

      onProgress(0)
      throw error
    })
}

export { uploadFileWithProgress }
