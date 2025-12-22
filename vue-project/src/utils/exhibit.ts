import axios, { type AxiosResponse } from 'axios'

import Cookies from 'js-cookie'

function updateExhibitCode(
  caseUuid: string,
  exhibitId: number,
  newCode: string | null,
): Promise<AxiosResponse> {
  const url = `/api/poc/cases/${caseUuid}/exhibits/${exhibitId}/`
  return axios.patch(
    url,
    { exhibit_code: newCode },
    {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookies.get('csrftoken'),
      },
    },
  )
}

export { updateExhibitCode }
