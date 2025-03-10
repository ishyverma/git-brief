import axios from "axios";

interface getColorsResponse {
    language: string;
    color: string;
    line: number;
}

const getColors = async (owner: string, name: string): Promise<getColorsResponse[]> => {
  const returnResponseArray = [];

  const languageReponse = await axios.get(
    `https://api.github.com/repos/${owner}/${name}/languages`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`
      }
    }
  );
  const languageReponseData = languageReponse.data;

  const colorsResponse = await axios.get(
    "https://raw.githubusercontent.com/ozh/github-colors/master/colors.json",
  );
  const colorsResponseData = colorsResponse.data;
  
  for (const language in languageReponseData) {
    returnResponseArray.push({
      language,
      line: languageReponseData[language],
      color: colorsResponseData[language].color,
    });
  }

  return returnResponseArray
};

export default getColors;
